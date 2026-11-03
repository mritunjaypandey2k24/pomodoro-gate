import React from 'react';
import { Clock, Shield, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type TabType = 'timer' | 'hero' | 'achievements';

interface NavigationBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLevel: number;
  unlockedBadgesCount: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentTab,
  onTabChange,
  currentLevel,
  unlockedBadgesCount
}) => {
  const tabs = [
    {
      id: 'timer' as TabType,
      label: 'Timer',
      icon: Clock,
      badge: null
    },
    {
      id: 'hero' as TabType,
      label: 'Hero XP',
      icon: Shield,
      badge: `L${currentLevel}`
    },
    {
      id: 'achievements' as TabType,
      label: 'Badges',
      icon: Award,
      badge: unlockedBadgesCount > 0 ? `${unlockedBadgesCount}` : null
    }
  ];

  return (
    <nav className="w-full bg-black border-t border-zinc-900 px-3 py-1.5 flex items-center justify-around z-40 select-none">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (!isActive) {
                soundManager.playClick();
                onTabChange(tab.id);
              }
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 group min-h-[44px] relative transition-colors active:scale-98"
          >
            {/* Minimalist active indicator pill */}
            <div
              className={`relative px-4 py-1 rounded-md transition-colors flex items-center justify-center ${
                isActive
                  ? 'bg-zinc-900 text-white border border-zinc-800'
                  : 'text-zinc-500 group-hover:text-zinc-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />

              {tab.badge && (
                <span
                  className={`absolute -top-1.5 -right-2 px-1 py-0.2 rounded text-[9px] font-mono leading-none ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'bg-zinc-950 text-zinc-600 border border-zinc-900'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-1 transition-colors ${
                isActive ? 'text-zinc-200 font-medium' : 'text-zinc-600'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
