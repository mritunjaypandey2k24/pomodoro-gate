import { Achievement, GATE_LEVELS, GateLevelInfo, SessionRecord, SubjectCategory } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first 25-minute GATE deep work session.',
    category: 'starter',
    icon: 'Flag',
    progress: 0,
    maxProgress: 1,
    isUnlocked: false,
    xpReward: 100
  },
  {
    id: 'deep_work_streak',
    title: 'Deep Work Streak',
    description: 'Complete 4 Pomodoro sessions in a continuous streak without breaking focus.',
    category: 'streak',
    icon: 'Flame',
    progress: 0,
    maxProgress: 4,
    isUnlocked: false,
    xpReward: 250
  },
  {
    id: 'syllabus_conqueror',
    title: 'Syllabus Conqueror',
    description: 'Complete 10 sessions in a single Core Technical subject.',
    category: 'syllabus',
    icon: 'BookOpenCheck',
    progress: 0,
    maxProgress: 10,
    isUnlocked: false,
    xpReward: 500
  },
  {
    id: 'maths_virtuoso',
    title: 'Maths Virtuoso',
    description: 'Complete 5 sessions in Engineering Mathematics (13-15 marks guaranteed!).',
    category: 'syllabus',
    icon: 'Calculator',
    progress: 0,
    maxProgress: 5,
    isUnlocked: false,
    xpReward: 200
  },
  {
    id: 'aptitude_ace',
    title: 'Aptitude Ace',
    description: 'Complete 5 sessions in General Aptitude (the easiest 15 marks).',
    category: 'syllabus',
    icon: 'Sparkles',
    progress: 0,
    maxProgress: 5,
    isUnlocked: false,
    xpReward: 200
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Accumulate a total of 1,000 XP in your GATE journey.',
    category: 'mastery',
    icon: 'Zap',
    progress: 0,
    maxProgress: 1000,
    isUnlocked: false,
    xpReward: 300
  },
  {
    id: 'centurion_focus',
    title: 'Centurion Focus',
    description: 'Accumulate 250 total minutes of deep focused GATE preparation.',
    category: 'mastery',
    icon: 'Clock',
    progress: 0,
    maxProgress: 250,
    isUnlocked: false,
    xpReward: 250
  },
  {
    id: 'air1_mindset',
    title: 'AIR 1 Mindset',
    description: 'Climb the GATE ranking ladder and reach Level 5 (Mock Vanguard).',
    category: 'mastery',
    icon: 'Crown',
    progress: 1,
    maxProgress: 5,
    isUnlocked: false,
    xpReward: 400
  }
];

export function getLevelInfo(xp: number): {
  currentLevel: GateLevelInfo;
  nextLevel: GateLevelInfo | null;
  progressPercent: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
} {
  let currentLevel = GATE_LEVELS[0];

  for (let i = GATE_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= GATE_LEVELS[i].minXp) {
      currentLevel = GATE_LEVELS[i];
      break;
    }
  }

  const nextLevelIndex = GATE_LEVELS.findIndex(l => l.level === currentLevel.level + 1);
  const nextLevel = nextLevelIndex !== -1 ? GATE_LEVELS[nextLevelIndex] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      xpInCurrentLevel: xp - currentLevel.minXp,
      xpForNextLevel: currentLevel.maxXp - currentLevel.minXp,
    };
  }

  const range = nextLevel.minXp - currentLevel.minXp;
  const currentInRange = xp - currentLevel.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpInCurrentLevel: currentInRange,
    xpForNextLevel: range,
  };
}

export function evaluateAchievements(
  currentAchievements: Achievement[],
  totalXp: number,
  completedWorkSessions: number,
  currentStreak: number,
  totalFocusMinutes: number,
  subjectXpMap: Record<SubjectCategory, number>,
  topicSessionsCount: Record<string, number>,
  currentLevelNumber: number
): { updatedAchievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  // Find highest single technical topic session count
  let maxSingleTechnicalTopicCount = 0;
  for (const [topic, count] of Object.entries(topicSessionsCount)) {
    // Check if count is highest
    if (count > maxSingleTechnicalTopicCount) {
      maxSingleTechnicalTopicCount = count;
    }
  }

  const mathSessions = Math.floor((subjectXpMap['Engineering Mathematics'] || 0) / 100);
  const aptitudeSessions = Math.floor((subjectXpMap['General Aptitude'] || 0) / 100);

  const updatedAchievements = currentAchievements.map(ach => {
    let currentProgress = ach.progress;
    let unlocked = ach.isUnlocked;

    switch (ach.id) {
      case 'first_step':
        currentProgress = Math.min(1, completedWorkSessions);
        break;
      case 'deep_work_streak':
        currentProgress = Math.min(4, Math.max(ach.progress, currentStreak));
        break;
      case 'syllabus_conqueror':
        currentProgress = Math.min(10, maxSingleTechnicalTopicCount);
        break;
      case 'maths_virtuoso':
        currentProgress = Math.min(5, mathSessions);
        break;
      case 'aptitude_ace':
        currentProgress = Math.min(5, aptitudeSessions);
        break;
      case 'century_club':
        currentProgress = Math.min(1000, totalXp);
        break;
      case 'centurion_focus':
        currentProgress = Math.min(250, totalFocusMinutes);
        break;
      case 'air1_mindset':
        currentProgress = Math.min(5, currentLevelNumber);
        break;
      default:
        break;
    }

    if (!unlocked && currentProgress >= ach.maxProgress) {
      unlocked = true;
      const updatedAch: Achievement = {
        ...ach,
        progress: currentProgress,
        isUnlocked: true,
        unlockedAt: Date.now()
      };
      newlyUnlocked.push(updatedAch);
      return updatedAch;
    }

    return {
      ...ach,
      progress: currentProgress,
      isUnlocked: unlocked
    };
  });

  return { updatedAchievements, newlyUnlocked };
}
