import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Achievement, GateLevelInfo } from '../types';

interface CelebrationModalProps {
  type: 'session_complete' | 'level_up' | 'badge_unlocked';
  data?: {
    xpEarned?: number;
    subject?: string;
    topic?: string;
    level?: GateLevelInfo;
    achievement?: Achievement;
  };
  onClose: () => void;
  onStartBreak?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  type,
  data,
  onClose,
  onStartBreak
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Optional timeout
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-5 text-center shadow-2xl">
        {type === 'session_complete' && (
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 mx-auto flex items-center justify-center">
              <Check className="w-5 h-5 text-zinc-200" />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Session Complete
              </div>
              <h3 className="text-xl font-medium text-white mt-0.5">
                +{data?.xpEarned || 100} XP Logged
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {data?.subject} · <span className="text-zinc-300">{data?.topic}</span>
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-black border border-zinc-900 text-xs text-left space-y-1 font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-zinc-500">Duration:</span>
                <span className="text-zinc-300">25:00 Cleared</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">GATE XP:</span>
                <span className="text-zinc-300">+100 Added</span>
              </div>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              {onStartBreak && (
                <button
                  type="button"
                  onClick={onStartBreak}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-zinc-800"
                >
                  <span>Start 5-Minute Break</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {type === 'badge_unlocked' && data?.achievement && (
          <div className="space-y-3.5">
            <div className="text-3xl mx-auto">{data.achievement.icon || '🏅'}</div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Achievement Unlocked
              </div>
              <h3 className="text-lg font-semibold text-white mt-0.5">
                {data.achievement.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                {data.achievement.description}
              </p>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono tabular-nums">
              +{data.achievement.xpReward} Bonus XP
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-medium border border-zinc-800 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {type === 'level_up' && data?.level && (
          <div className="space-y-3.5">
            <div className="text-4xl mx-auto">{data.level.badge}</div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Rank Progression
              </div>
              <h3 className="text-xl font-semibold text-white mt-0.5">
                Level {data.level.level}: {data.level.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">{data.level.perk}</p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-medium border border-zinc-800 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
