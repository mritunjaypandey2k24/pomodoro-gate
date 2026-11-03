import React from 'react';
import { Minus, Plus, Target } from 'lucide-react';
import { GateBranch, SessionRecord, SubjectCategory } from '../types';
import { getLevelInfo } from '../utils/gamification';
import { soundManager } from '../utils/audio';

interface HeroScreenProps {
  totalXp: number;
  completedSessions: number;
  currentStreak: number;
  subjectXp: Record<SubjectCategory, number>;
  topicSessions: Record<string, number>;
  sessions: SessionRecord[];
  selectedBranch: GateBranch;
  onQuickFocusSubject: (category: SubjectCategory, topic?: string) => void;
  dailyGoal: number;
  onUpdateDailyGoal: (goal: number) => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  totalXp,
  completedSessions,
  currentStreak,
  subjectXp,
  topicSessions,
  sessions,
  selectedBranch,
  onQuickFocusSubject,
  dailyGoal,
  onUpdateDailyGoal
}) => {
  const { currentLevel, nextLevel, progressPercent } = getLevelInfo(totalXp);

  const totalFocusMinutes = completedSessions * 25;
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  // Calculate today's completed work sessions
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayStartTimestamp = startOfToday.getTime();

  const todaySessionsCount = sessions.filter(
    (s) => s.timestamp >= todayStartTimestamp && s.mode === 'work'
  ).length || (sessions.length === 0 ? completedSessions : 0);

  const goalProgressFraction = Math.min(1, todaySessionsCount / Math.max(1, dailyGoal));
  const goalProgressPercent = Math.min(100, Math.round((todaySessionsCount / Math.max(1, dailyGoal)) * 100));

  // Daily Goal Progress Ring Math
  const ringSize = 84;
  const strokeWidth = 5;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - goalProgressFraction * circumference;

  // Subject XP numbers
  const mathXp = subjectXp['Engineering Mathematics'] || 0;
  const technicalXp = subjectXp['Core Technical'] || 0;
  const aptitudeXp = subjectXp['General Aptitude'] || 0;

  const totalCategoryXp = mathXp + technicalXp + aptitudeXp || 1;

  const mathPercent = Math.round((mathXp / totalCategoryXp) * 100);
  const technicalPercent = Math.round((technicalXp / totalCategoryXp) * 100);
  const aptitudePercent = Math.round((aptitudeXp / totalCategoryXp) * 100);

  const subjectsWithXp = [
    { category: 'Core Technical' as SubjectCategory, xp: technicalXp, percent: technicalPercent, targetWeight: '70% Marks' },
    { category: 'Engineering Mathematics' as SubjectCategory, xp: mathXp, percent: mathPercent, targetWeight: '13-15% Marks' },
    { category: 'General Aptitude' as SubjectCategory, xp: aptitudeXp, percent: aptitudePercent, targetWeight: '15% Marks' },
  ];

  const sortedByXp = [...subjectsWithXp].sort((a, b) => b.xp - a.xp);
  const strongest = sortedByXp[0];
  const weakest = sortedByXp[sortedByXp.length - 1];

  const technicalTopicEntries = Object.entries(topicSessions)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handleAdjustGoal = (delta: number) => {
    soundManager.playClick();
    const nextGoal = Math.max(1, Math.min(24, dailyGoal + delta));
    onUpdateDailyGoal(nextGoal);
  };

  const handleSetPreset = (preset: number) => {
    soundManager.playClick();
    onUpdateDailyGoal(preset);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 text-zinc-300 overflow-y-auto max-w-md mx-auto w-full space-y-4 bg-black">
      {/* 1. Hero Level Minimal Card */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-850 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-500 font-normal">
              Level {currentLevel.level} of 10
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight mt-0.5">
              {currentLevel.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{currentLevel.perk}</p>
          </div>
          <div className="text-3xl select-none opacity-80">{currentLevel.badge}</div>
        </div>

        {/* Minimal XP Progress Bar with Subtle Slate Fill */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tabular-nums">
            <span>Progress</span>
            <span className="text-white font-medium">
              {totalXp} / {nextLevel ? nextLevel.minXp : currentLevel.maxXp} XP
            </span>
          </div>

          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-600">
            <span>{progressPercent}% Complete</span>
            {nextLevel ? (
              <span>{nextLevel.minXp - totalXp} XP to Level {nextLevel.level}</span>
            ) : (
              <span>Maximum Rank</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Minimal Strip */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
          <div className="text-[10px] text-zinc-500">Total XP</div>
          <div className="text-sm font-semibold text-white font-mono mt-0.5 tabular-nums">{totalXp}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
          <div className="text-[10px] text-zinc-500">Focus</div>
          <div className="text-sm font-semibold text-white font-mono mt-0.5 tabular-nums">{focusHours}h</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
          <div className="text-[10px] text-zinc-500">Sessions</div>
          <div className="text-sm font-semibold text-white font-mono mt-0.5 tabular-nums">{completedSessions}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
          <div className="text-[10px] text-zinc-500">Streak</div>
          <div className="text-sm font-semibold text-white font-mono mt-0.5 tabular-nums">{currentStreak}</div>
        </div>
      </div>

      {/* 3. Daily Session Goal Tracker with Progress Ring & Stepper */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-white">
            <Target className="w-3.5 h-3.5 text-zinc-400" />
            <span>Daily Session Target</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {goalProgressPercent}% today
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Ring with Numerical Count */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
              {/* Background Track */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#18181b"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Subtle Slate Blue Progress Fill */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#64748b"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Numerical count in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-lg font-semibold font-mono tabular-nums text-white leading-tight">
                {todaySessionsCount}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono leading-none">
                / {dailyGoal}
              </span>
            </div>
          </div>

          {/* Target Controls & Status Description */}
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-xs text-zinc-300 font-medium">
                {todaySessionsCount >= dailyGoal
                  ? 'Daily goal reached'
                  : `${dailyGoal - todaySessionsCount} session${dailyGoal - todaySessionsCount === 1 ? '' : 's'} remaining`}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Target: {dailyGoal} sessions ({(dailyGoal * 25 / 60).toFixed(1)}h deep work)
              </div>
            </div>

            {/* Target Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustGoal(-1)}
                disabled={dailyGoal <= 1}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                title="Decrease goal"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                {[4, 6, 8, 10].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSetPreset(preset)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono transition-colors ${
                      dailyGoal === preset
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAdjustGoal(1)}
                disabled={dailyGoal >= 24}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                title="Increase goal"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Subject XP Breakdown (Strong & Weak Areas) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Subject Breakdown</span>
          <span>+100 XP / session</span>
        </div>

        <div className="space-y-2">
          {/* Core Technical */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">Core Technical ({selectedBranch})</span>
                  {technicalXp > 0 && technicalXp >= mathXp && technicalXp >= aptitudeXp && (
                    <span className="text-[10px] text-zinc-400">· Strongest</span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {Math.floor(technicalXp / 100)} Sessions · 70% Weightage
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-white font-mono tabular-nums">+{technicalXp} XP</span>
                <div className="text-[10px] text-zinc-500">{technicalPercent}%</div>
              </div>
            </div>

            <div className="mt-2 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-full transition-all duration-300"
                style={{ width: `${technicalPercent}%` }}
              />
            </div>

            {technicalTopicEntries.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-zinc-900 flex flex-wrap gap-1.5">
                {technicalTopicEntries.map(([topic, count]) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900/60 text-[10px] text-zinc-400 font-mono"
                  >
                    <span>{topic}:</span>
                    <span className="text-zinc-300">{count * 100} XP</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Engineering Mathematics */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">Engineering Mathematics</span>
                  {mathXp > 0 && mathXp >= technicalXp && (
                    <span className="text-[10px] text-zinc-400">· Strongest</span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {Math.floor(mathXp / 100)} Sessions · 13-15 Marks
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-white font-mono tabular-nums">+{mathXp} XP</span>
                <div className="text-[10px] text-zinc-500">{mathPercent}%</div>
              </div>
            </div>

            <div className="mt-2 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-full transition-all duration-300"
                style={{ width: `${mathPercent}%` }}
              />
            </div>
          </div>

          {/* General Aptitude */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">General Aptitude</span>
                  {aptitudeXp === 0 && (
                    <span className="text-[10px] text-zinc-500">· Pending</span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {Math.floor(aptitudeXp / 100)} Sessions · 15 Marks
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-white font-mono tabular-nums">+{aptitudeXp} XP</span>
                <div className="text-[10px] text-zinc-500">{aptitudePercent}%</div>
              </div>
            </div>

            <div className="mt-2 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-full transition-all duration-300"
                style={{ width: `${aptitudePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Strategic Recommendation */}
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
        <div className="text-xs text-zinc-400 font-medium">Preparation Assessment</div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {totalXp === 0 ? (
            <span>Complete your initial 25-minute session to log baseline topic metrics.</span>
          ) : weakest.xp === 0 ? (
            <span>
              Your weakest area is <strong className="text-zinc-300 font-medium">{weakest.category}</strong> (0 XP). GATE top percentiles consistently secure 25+ marks in Maths & Aptitude.
            </span>
          ) : (
            <span>
              Primary focus logged in <strong className="text-zinc-300 font-medium">{strongest.category}</strong> (+{strongest.xp} XP). To balance your score distribution, schedule upcoming sessions in <strong className="text-zinc-300 font-medium">{weakest.category}</strong>.
            </span>
          )}
        </p>

        {totalXp > 0 && (
          <button
            type="button"
            onClick={() => onQuickFocusSubject(weakest.category)}
            className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-xs font-medium text-zinc-300 flex items-center justify-between border border-zinc-800 transition-colors"
          >
            <span>Target {weakest.category} (+100 XP)</span>
            <span className="text-zinc-500">→</span>
          </button>
        )}
      </div>

      {/* 6. Recent Session Logs */}
      {sessions.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-500">Recent Sessions</div>
          <div className="space-y-1">
            {sessions.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="text-zinc-300 font-normal">{sess.topic}</div>
                  <div className="text-[10px] text-zinc-600">
                    {sess.category} · {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className="font-mono text-zinc-400 tabular-nums">+{sess.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
