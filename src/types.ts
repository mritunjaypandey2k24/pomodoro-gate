export type SubjectCategory = 'Engineering Mathematics' | 'Core Technical' | 'General Aptitude';

export type GateBranch = 'CS' | 'EE' | 'EC' | 'ME' | 'CE' | 'IN' | 'DA';

export interface BranchInfo {
  code: GateBranch;
  name: string;
  defaultTopics: string[];
}

export const GATE_BRANCHES: Record<GateBranch, BranchInfo> = {
  CS: {
    code: 'CS',
    name: 'Computer Science & IT',
    defaultTopics: [
      'Algorithms & Data Structures',
      'Operating Systems',
      'Computer Networks',
      'DBMS',
      'Theory of Computation',
      'Compiler Design',
      'Computer Organization'
    ]
  },
  EE: {
    code: 'EE',
    name: 'Electrical Engineering',
    defaultTopics: [
      'Power Systems',
      'Electrical Machines',
      'Control Systems',
      'Power Electronics',
      'Signals & Systems',
      'Electric Circuits',
      'Electromagnetic Fields'
    ]
  },
  EC: {
    code: 'EC',
    name: 'Electronics & Comm.',
    defaultTopics: [
      'Analog Circuits',
      'Digital Circuits',
      'Signals & Systems',
      'Communications',
      'Electromagnetics',
      'Control Systems',
      'Electronic Devices'
    ]
  },
  ME: {
    code: 'ME',
    name: 'Mechanical Engineering',
    defaultTopics: [
      'Thermodynamics',
      'Fluid Mechanics',
      'Manufacturing & Industrial',
      'Strength of Materials',
      'Theory of Machines',
      'Heat Transfer',
      'Engineering Mechanics'
    ]
  },
  CE: {
    code: 'CE',
    name: 'Civil Engineering',
    defaultTopics: [
      'Structural Analysis',
      'Geotechnical Engineering',
      'Fluid Mechanics & Hydraulics',
      'Environmental Engineering',
      'Transportation Engineering',
      'Surveying & Geomatics',
      'RCC & Steel Structures'
    ]
  },
  IN: {
    code: 'IN',
    name: 'Instrumentation Engineering',
    defaultTopics: [
      'Sensors & Industrial Instrumentation',
      'Signals & Systems',
      'Control Systems',
      'Analog & Digital Circuits',
      'Optical Instrumentation',
      'Electrical Circuits'
    ]
  },
  DA: {
    code: 'DA',
    name: 'Data Science & AI',
    defaultTopics: [
      'Machine Learning',
      'Artificial Intelligence',
      'Database Management & Warehousing',
      'Python & Data Structures',
      'Linear Algebra & Calculus',
      'Probability & Statistics'
    ]
  }
};

export const MATH_TOPICS = [
  'Linear Algebra',
  'Calculus & Multivariable',
  'Differential Equations',
  'Complex Variables',
  'Probability & Statistics',
  'Numerical Methods',
  'Discrete Mathematics'
];

export const APTITUDE_TOPICS = [
  'Numerical Ability',
  'Verbal Ability & Comprehension',
  'Reasoning & Analytical Logic',
  'Spatial Aptitude & Mental Ability',
  'Data Interpretation & Graphs'
];

export interface SessionRecord {
  id: string;
  timestamp: number;
  durationMinutes: number;
  category: SubjectCategory;
  topic: string;
  branch: GateBranch;
  xpEarned: number;
  mode: 'work' | 'break';
}

export interface GateLevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
  perk: string;
}

export const GATE_LEVELS: GateLevelInfo[] = [
  { level: 1, title: 'GATE Aspirant', minXp: 0, maxXp: 200, badge: '🌱', perk: 'Formula Foundation Unlocked' },
  { level: 2, title: 'Formula Initiate', minXp: 200, maxXp: 500, badge: '⚡', perk: 'PYQ Solver Streak Activated' },
  { level: 3, title: 'Problem Solver', minXp: 500, maxXp: 900, badge: '🧩', perk: 'Precision Speed +10%' },
  { level: 4, title: 'Concept Alchemist', minXp: 900, maxXp: 1400, badge: '🔥', perk: 'Virtual Calculator Master' },
  { level: 5, title: 'Mock Vanguard', minXp: 1400, maxXp: 2000, badge: '🛡️', perk: 'Rank Predictor Tier 1' },
  { level: 6, title: 'Syllabus Titan', minXp: 2000, maxXp: 2800, badge: '⚔️', perk: 'High-Weightage Domination' },
  { level: 7, title: 'Top 500 Contender', minXp: 2800, maxXp: 3800, badge: '💎', perk: 'PSU Interview Shortlist Caliber' },
  { level: 8, title: 'Top 100 Elite', minXp: 3800, maxXp: 5000, badge: '👑', perk: 'IIT Direct Admit Zone' },
  { level: 9, title: 'IISc Scholar', minXp: 5000, maxXp: 6500, badge: '🌌', perk: 'Gold Medalist Aura' },
  { level: 10, title: 'AIR 1 Prodigy', minXp: 6500, maxXp: 10000, badge: '🏆', perk: 'GATE Legend Immortalized' },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'starter' | 'streak' | 'syllabus' | 'mastery';
  icon: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  xpReward: number;
}
