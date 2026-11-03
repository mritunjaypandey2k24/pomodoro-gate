import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { NavigationBar, TabType } from './components/NavigationBar';
import { TimerScreen } from './components/TimerScreen';
import { HeroScreen } from './components/HeroScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { CelebrationModal } from './components/CelebrationModal';
import { ComposeCodeModal } from './components/ComposeCodeModal';
import { InstallModal } from './components/InstallModal';
import {
  GateBranch,
  GATE_BRANCHES,
  SubjectCategory,
  SessionRecord,
  Achievement,
  GateLevelInfo
} from './types';
import {
  INITIAL_ACHIEVEMENTS,
  evaluateAchievements,
  getLevelInfo
} from './utils/gamification';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'gate_chrono_rpg_state_v1';

export default function App() {
  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<TabType>('timer');

  // Gamification & Session State
  const [totalXp, setTotalXp] = useState<number>(0);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [selectedBranch, setSelectedBranch] = useState<GateBranch>('CS');
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('Engineering Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>('Linear Algebra');
  const [subjectXp, setSubjectXp] = useState<Record<SubjectCategory, number>>({
    'Engineering Mathematics': 0,
    'Core Technical': 0,
    'General Aptitude': 0
  });
  const [topicSessions, setTopicSessions] = useState<Record<string, number>>({});
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dailyGoal, setDailyGoal] = useState<number>(6);

  // Modals
  const [celebrationData, setCelebrationData] = useState<{
    type: 'session_complete' | 'level_up' | 'badge_unlocked';
    data?: {
      xpEarned?: number;
      subject?: string;
      topic?: string;
      level?: GateLevelInfo;
      achievement?: Achievement;
    };
  } | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.totalXp !== undefined) setTotalXp(parsed.totalXp);
        if (parsed.completedSessions !== undefined) setCompletedSessions(parsed.completedSessions);
        if (parsed.currentStreak !== undefined) setCurrentStreak(parsed.currentStreak);
        if (parsed.selectedBranch) setSelectedBranch(parsed.selectedBranch);
        if (parsed.selectedCategory) setSelectedCategory(parsed.selectedCategory);
        if (parsed.selectedTopic) setSelectedTopic(parsed.selectedTopic);
        if (parsed.subjectXp) setSubjectXp(parsed.subjectXp);
        if (parsed.topicSessions) setTopicSessions(parsed.topicSessions);
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.achievements) {
          // Merge saved achievements with INITIAL_ACHIEVEMENTS to avoid missing new badges
          const merged = INITIAL_ACHIEVEMENTS.map((initAch) => {
            const found = parsed.achievements.find((a: Achievement) => a.id === initAch.id);
            return found ? { ...initAch, ...found } : initAch;
          });
          setAchievements(merged);
        }
        if (parsed.soundEnabled !== undefined) {
          setSoundEnabled(parsed.soundEnabled);
          soundManager.setMuted(!parsed.soundEnabled);
        }
        if (parsed.dailyGoal !== undefined) setDailyGoal(parsed.dailyGoal);
      }
    } catch {
      // LocalStorage load error fallback
    }
  }, []);

  // Save state to localStorage on state changes
  useEffect(() => {
    try {
      const stateToSave = {
        totalXp,
        completedSessions,
        currentStreak,
        selectedBranch,
        selectedCategory,
        selectedTopic,
        subjectXp,
        topicSessions,
        sessions,
        achievements,
        soundEnabled,
        dailyGoal
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // LocalStorage save error fallback
    }
  }, [
    totalXp,
    completedSessions,
    currentStreak,
    selectedBranch,
    selectedCategory,
    selectedTopic,
    subjectXp,
    topicSessions,
    sessions,
    achievements,
    soundEnabled,
    dailyGoal
  ]);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setMuted(!nextVal);
    if (nextVal) soundManager.playClick();
  };

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTotalXp(0);
    setCompletedSessions(0);
    setCurrentStreak(0);
    setDailyGoal(6);
    setSubjectXp({
      'Engineering Mathematics': 0,
      'Core Technical': 0,
      'General Aptitude': 0
    });
    setTopicSessions({});
    setSessions([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSelectedBranch('CS');
    setSelectedCategory('Engineering Mathematics');
    setSelectedTopic('Linear Algebra');
    soundManager.playClick();
  };

  // Triggered when a 25-minute Pomodoro session is completed
  const handleSessionComplete = (
    durationMinutes: number,
    category: SubjectCategory,
    topic: string
  ) => {
    const xpGained = 100; // Every completed 25-minute session awards +100 XP
    const newTotalXp = totalXp + xpGained;
    const newCompletedSessions = completedSessions + 1;
    const newStreak = currentStreak + 1;

    // Subject XP update
    const newSubjectXp = {
      ...subjectXp,
      [category]: (subjectXp[category] || 0) + xpGained
    };

    // Topic sessions update
    const newTopicSessions = {
      ...topicSessions,
      [topic]: (topicSessions[topic] || 0) + 1
    };

    // Session record
    const newRecord: SessionRecord = {
      id: `session_${Date.now()}`,
      timestamp: Date.now(),
      durationMinutes,
      category,
      topic,
      branch: selectedBranch,
      xpEarned: xpGained,
      mode: 'work'
    };

    const newSessions = [newRecord, ...sessions];

    // Check level-up
    const prevLevel = getLevelInfo(totalXp).currentLevel;
    const nextLevel = getLevelInfo(newTotalXp).currentLevel;
    const didLevelUp = nextLevel.level > prevLevel.level;

    // Check achievements
    const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
      achievements,
      newTotalXp,
      newCompletedSessions,
      newStreak,
      newCompletedSessions * 25,
      newSubjectXp,
      newTopicSessions,
      nextLevel.level
    );

    // Apply state updates
    setTotalXp(newTotalXp);
    setCompletedSessions(newCompletedSessions);
    setCurrentStreak(newStreak);
    setSubjectXp(newSubjectXp);
    setTopicSessions(newTopicSessions);
    setSessions(newSessions);
    setAchievements(updatedAchievements);

    // Play appropriate sound and show celebration
    if (didLevelUp) {
      soundManager.playLevelUp();
      setCelebrationData({
        type: 'level_up',
        data: { level: nextLevel }
      });
    } else if (newlyUnlocked.length > 0) {
      soundManager.playBadgeUnlocked();
      setCelebrationData({
        type: 'badge_unlocked',
        data: { achievement: newlyUnlocked[0] }
      });
    } else {
      soundManager.playSessionComplete();
      setCelebrationData({
        type: 'session_complete',
        data: {
          xpEarned: xpGained,
          subject: category,
          topic
        }
      });
    }
  };

  const handleQuickFocusSubject = (category: SubjectCategory, topic?: string) => {
    setSelectedCategory(category);
    if (topic) {
      setSelectedTopic(topic);
    } else if (category === 'Engineering Mathematics') {
      setSelectedTopic('Linear Algebra');
    } else if (category === 'General Aptitude') {
      setSelectedTopic('Numerical Ability');
    } else {
      const branchTopics = GATE_BRANCHES[selectedBranch]?.defaultTopics || [];
      setSelectedTopic(branchTopics[0] || 'Algorithms & Data Structures');
    }
    setCurrentTab('timer');
  };

  const currentLevelNumber = getLevelInfo(totalXp).currentLevel.level;
  const unlockedBadgesCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <AndroidFrame
      onOpenComposeModal={() => setIsComposeModalOpen(true)}
      onOpenInstallModal={() => setIsInstallModalOpen(true)}
      onResetData={handleResetData}
    >
      {/* Primary Tab Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'timer' && (
          <TimerScreen
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            onSessionComplete={handleSessionComplete}
            currentStreak={currentStreak}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentTab === 'hero' && (
          <HeroScreen
            totalXp={totalXp}
            completedSessions={completedSessions}
            currentStreak={currentStreak}
            subjectXp={subjectXp}
            topicSessions={topicSessions}
            sessions={sessions}
            selectedBranch={selectedBranch}
            onQuickFocusSubject={handleQuickFocusSubject}
            dailyGoal={dailyGoal}
            onUpdateDailyGoal={setDailyGoal}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsScreen achievements={achievements} />
        )}
      </main>

      {/* Android Bottom Navigation Bar */}
      <NavigationBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentLevel={currentLevelNumber}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Celebration Modal (+100 XP, Level-Up, Badge Unlocked) */}
      {celebrationData && (
        <CelebrationModal
          type={celebrationData.type}
          data={celebrationData.data}
          onClose={() => setCelebrationData(null)}
          onStartBreak={() => {
            setCelebrationData(null);
            setCurrentTab('timer');
          }}
        />
      )}

      {/* Jetpack Compose Kotlin Code Modal */}
      <ComposeCodeModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
      />

      {/* Install on Phone / APK Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onOpenComposeCode={() => setIsComposeModalOpen(true)}
      />
    </AndroidFrame>
  );
}
