import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { GateBranch, GATE_BRANCHES, MATH_TOPICS, APTITUDE_TOPICS, SubjectCategory } from '../types';
import { soundManager } from '../utils/audio';

interface TimerScreenProps {
  selectedCategory: SubjectCategory;
  onSelectCategory: (category: SubjectCategory) => void;
  selectedBranch: GateBranch;
  onSelectBranch: (branch: GateBranch) => void;
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  onSessionComplete: (durationMinutes: number, category: SubjectCategory, topic: string) => void;
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60;  // 5 minutes

export const TimerScreen: React.FC<TimerScreenProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedBranch,
  onSelectBranch,
  selectedTopic,
  onSelectTopic,
  onSessionComplete,
  currentStreak,
  soundEnabled,
  onToggleSound
}) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(WORK_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState<boolean>(false);

  const totalTime = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const progress = Math.max(0, Math.min(1, 1 - timeLeft / totalTime));

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available topics based on category
  const availableTopics = React.useMemo(() => {
    if (selectedCategory === 'Engineering Mathematics') {
      return MATH_TOPICS;
    } else if (selectedCategory === 'General Aptitude') {
      return APTITUDE_TOPICS;
    } else {
      return GATE_BRANCHES[selectedBranch]?.defaultTopics || [];
    }
  }, [selectedCategory, selectedBranch]);

  // Keep selectedTopic valid
  useEffect(() => {
    if (!selectedTopic || !availableTopics.includes(selectedTopic)) {
      if (availableTopics.length > 0) {
        onSelectTopic(availableTopics[0]);
      }
    }
  }, [selectedCategory, selectedBranch, availableTopics, selectedTopic, onSelectTopic]);

  // Timer Tick Interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, selectedCategory, selectedTopic]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'work') {
      soundManager.playSessionComplete();
      onSessionComplete(25, selectedCategory, selectedTopic || availableTopics[0]);
      setMode('break');
      setTimeLeft(BREAK_DURATION);
    } else {
      soundManager.playClick();
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }
  };

  const handleToggleTimer = () => {
    soundManager.playClick();
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    soundManager.playClick();
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_DURATION : BREAK_DURATION);
  };

  const handleSwitchMode = (newMode: 'work' | 'break') => {
    soundManager.playClick();
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? WORK_DURATION : BREAK_DURATION);
  };

  const handleFastForwardComplete = () => {
    soundManager.playClick();
    setIsRunning(false);
    if (mode === 'work') {
      onSessionComplete(25, selectedCategory, selectedTopic || availableTopics[0]);
      setMode('break');
      setTimeLeft(BREAK_DURATION);
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWork = mode === 'work';

  // Minimal SVG circular dimensions
  const size = 268;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  // Single muted slate blue accent for timer countdown & progress fill
  const slateAccentColor = isWork ? '#64748b' : '#94a3b8';

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 text-zinc-200 overflow-y-auto max-w-md mx-auto w-full bg-black">
      {/* 1. Header with Mode Toggle & Sound */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-normal">
          <div className="flex items-center gap-2">
            <span>GATE Focus</span>
            {currentStreak > 0 && (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-400">Streak {currentStreak}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Minimal Mode Selector (Work 25m vs Break 5m) */}
        <div className="flex items-center p-0.5 bg-zinc-950 rounded-lg border border-zinc-900">
          <button
            type="button"
            onClick={() => handleSwitchMode('work')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
              isWork
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Study · 25m
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('break')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
              !isWork
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Break · 5m
          </button>
        </div>

        {/* 2. GATE Subject Category Selection Dropdown */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-0.5">
            <span>Subject Category</span>
            <span className="text-zinc-600">Required</span>
          </div>

          {/* Primary Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              disabled={isRunning}
              className={`w-full py-2 px-3 rounded-lg bg-zinc-950 border text-left flex items-center justify-between text-xs transition-colors ${
                isRunning
                  ? 'opacity-60 border-zinc-900 cursor-not-allowed text-zinc-400'
                  : 'border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
              }`}
            >
              <span className="font-medium truncate">{selectedCategory}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-lg bg-zinc-950 border border-zinc-800 shadow-xl z-30 space-y-0.5">
                {(['Engineering Mathematics', 'Core Technical', 'General Aptitude'] as SubjectCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onSelectCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full py-1.5 px-2.5 rounded text-left text-xs transition-colors ${
                        selectedCategory === cat
                          ? 'bg-zinc-900 text-white font-medium'
                          : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sub-selection: Specific Technical Topic */}
          <div className="flex items-center gap-2 pt-0.5">
            {selectedCategory === 'Core Technical' && (
              <div className="shrink-0">
                <select
                  value={selectedBranch}
                  disabled={isRunning}
                  onChange={(e) => {
                    soundManager.playClick();
                    onSelectBranch(e.target.value as GateBranch);
                  }}
                  className="py-1 px-2 text-[11px] bg-zinc-950 border border-zinc-800/80 rounded-md text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  {(Object.keys(GATE_BRANCHES) as GateBranch[]).map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsTopicDropdownOpen((prev) => !prev)}
                disabled={isRunning}
                className="w-full py-1 px-2.5 rounded-md bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-left flex items-center justify-between text-xs text-zinc-400 truncate"
              >
                <span className="truncate">{selectedTopic || 'Select Topic'}</span>
                <ChevronDown className="w-3 h-3 text-zinc-600 ml-1 shrink-0" />
              </button>

              {isTopicDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-44 overflow-y-auto p-1 rounded-lg bg-zinc-950 border border-zinc-800 shadow-xl z-20 space-y-0.5">
                  {availableTopics.map((top) => (
                    <button
                      key={top}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onSelectTopic(top);
                        setIsTopicDropdownOpen(false);
                      }}
                      className={`w-full py-1.5 px-2 rounded text-left text-xs truncate ${
                        selectedTopic === top
                          ? 'bg-zinc-900 text-white font-medium'
                          : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                      }`}
                    >
                      {top}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Invisible, Peaceful Countdown Anchor */}
      <div className="relative my-auto flex flex-col items-center justify-center py-6 select-none">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Minimal Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#18181b"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Subtle Muted Slate Blue Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={slateAccentColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Centered Large Monochromatic Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-light font-mono tabular-nums tracking-tighter text-white">
              {formattedTime}
            </span>

            <div className="mt-2 text-xs text-zinc-500 font-normal">
              {isWork ? (
                <span>+100 XP upon completion</span>
              ) : (
                <span>Rest period</span>
              )}
            </div>

            <div className="text-[11px] text-zinc-600 mt-1 max-w-[190px] truncate">
              {selectedTopic || selectedCategory}
            </div>
          </div>
        </div>

        {/* Minimal indicator text */}
        <div className="mt-4 text-center">
          <span className="text-[11px] text-zinc-600">
            {isRunning ? 'Counting down' : 'Paused'}
          </span>
        </div>
      </div>

      {/* 4. Controls & Secondary Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-center gap-4">
          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetTimer}
            className="w-11 h-11 rounded-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Minimal Play/Pause button */}
          <button
            type="button"
            onClick={handleToggleTimer}
            className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-current text-white" />
            ) : (
              <Play className="w-6 h-6 fill-current text-white ml-0.5" />
            )}
          </button>

          {/* Fast forward test button */}
          <button
            type="button"
            onClick={handleFastForwardComplete}
            className="w-11 h-11 rounded-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
            title="Complete Session (+100 XP)"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Fast test trigger text */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleFastForwardComplete}
            className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Simulate 25m completion (+100 XP)
          </button>
        </div>
      </div>
    </div>
  );
};
