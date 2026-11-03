import React, { useState } from 'react';
import { Lock, Check, X } from 'lucide-react';
import { Achievement } from '../types';
import { soundManager } from '../utils/audio';

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'unlocked') return ach.isUnlocked;
    if (filter === 'locked') return !ach.isUnlocked;
    return true;
  });

  const getEmojiForBadge = (id: string): string => {
    switch (id) {
      case 'first_step':
        return '🚀';
      case 'deep_work_streak':
        return '🔥';
      case 'syllabus_conqueror':
        return '⚔️';
      case 'maths_virtuoso':
        return '📐';
      case 'aptitude_ace':
        return '💡';
      case 'century_club':
        return '⚡';
      case 'centurion_focus':
        return '⏱️';
      case 'air1_mindset':
        return '👑';
      default:
        return '🏅';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 text-zinc-300 overflow-y-auto max-w-md mx-auto w-full space-y-4 bg-black">
      {/* 1. Minimal Summary Header */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Milestones</div>
            <h2 className="text-base font-semibold text-white mt-0.5">GATE Achievements</h2>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-white font-mono tabular-nums">
              {unlockedCount} / {totalCount}
            </span>
            <div className="text-[10px] text-zinc-500">Unlocked</div>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 font-mono tabular-nums">
            <span>{completionPercent}% Completed</span>
            <span>+XP added automatically</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Segmented Buttons */}
      <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-lg border border-zinc-900">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setFilter('all');
          }}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setFilter('unlocked');
          }}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${
            filter === 'unlocked'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Unlocked ({unlockedCount})
        </button>
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setFilter('locked');
          }}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${
            filter === 'locked'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Locked ({totalCount - unlockedCount})
        </button>
      </div>

      {/* 3. Achievements 2-Column Minimal Grid */}
      <div className="grid grid-cols-2 gap-2.5 pb-6">
        {filteredAchievements.map((badge) => {
          const isUnlocked = badge.isUnlocked;
          const emoji = getEmojiForBadge(badge.id);

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedBadge(badge);
              }}
              className={`relative p-3 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer active:scale-98 min-h-[135px] ${
                isUnlocked
                  ? 'bg-zinc-950 border-zinc-750 hover:border-zinc-600'
                  : 'bg-black border-zinc-900/80 hover:border-zinc-800 opacity-40'
              }`}
            >
              {/* Top Row: Icon + Status */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all ${
                    isUnlocked
                      ? 'bg-zinc-900 border border-zinc-800'
                      : 'bg-zinc-950 border border-zinc-900'
                  }`}
                >
                  <span className={isUnlocked ? 'filter grayscale-0' : 'filter grayscale'}>
                    {emoji}
                  </span>
                </div>

                {isUnlocked ? (
                  <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-zinc-700 shrink-0" />
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-2 space-y-0.5">
                <h4
                  className={`text-xs font-medium leading-snug ${
                    isUnlocked ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {badge.title}
                </h4>
                <p className="text-[10px] text-zinc-500 line-clamp-2 leading-tight">
                  {badge.description}
                </p>
              </div>

              {/* Bottom Progress or Reward */}
              <div className="mt-2 pt-1.5 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono tabular-nums">
                {isUnlocked ? (
                  <span className="text-zinc-400 font-medium">+{badge.xpReward} XP</span>
                ) : (
                  <div className="w-full space-y-0.5">
                    <div className="flex justify-between text-zinc-600 text-[9px]">
                      <span>Progress</span>
                      <span>
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Minimal Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xs rounded-2xl bg-zinc-950 border border-zinc-800 p-4 text-center space-y-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 p-1 rounded-md text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center text-2xl ${
                selectedBadge.isUnlocked
                  ? 'bg-zinc-900 border border-zinc-700'
                  : 'bg-zinc-950 border border-zinc-900 opacity-60'
              }`}
            >
              {getEmojiForBadge(selectedBadge.id)}
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500">
                {selectedBadge.isUnlocked ? 'Unlocked' : 'In Progress'}
              </div>
              <h3 className="text-base font-semibold text-white mt-0.5">{selectedBadge.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{selectedBadge.description}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-black border border-zinc-900 text-xs text-left space-y-1 font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-zinc-500">Reward:</span>
                <span className="text-zinc-300 font-medium">+{selectedBadge.xpReward} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Progress:</span>
                <span className={selectedBadge.isUnlocked ? 'text-zinc-300' : 'text-zinc-500'}>
                  {selectedBadge.isUnlocked
                    ? 'Completed'
                    : `${selectedBadge.progress} / ${selectedBadge.maxProgress}`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors border border-zinc-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
