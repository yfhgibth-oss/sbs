import { 
  User, 
  Task, 
  TaskSubmission, 
  Mission, 
  Campaign, 
  FraudFlag, 
  PromoCode, 
  SupportTicket, 
  Withdrawal, 
  AdminAuditLog, 
  SystemHealthState, 
  NotificationItem,
  BadgeDefinition 
} from '../types';

export const INITIAL_BADGES: BadgeDefinition[] = [
  {
    id: 'first_task',
    name: 'First Step',
    nameBn: 'প্রথম পদক্ষেপ',
    description: 'Complete your first approved micro-task',
    descriptionBn: 'আপনার প্রথম অনুমোদিত মাইক্রো-টাস্ক সম্পন্ন করুন',
    icon: '🎯',
    requirement: '1 Approved Task',
    perk: '+5% XP on tasks',
    perkBn: '+৫% অতিরিক্ত XP'
  },
  {
    id: 'streak_master_7',
    name: 'Streak Pioneer',
    nameBn: 'স্ট্রিক অগ্রদূত',
    description: 'Maintain a 7-day daily login streak',
    descriptionBn: 'টানা ৭ দিন লগইন স্ট্রিক বজায় রাখুন',
    icon: '🔥',
    requirement: '7 Days Streak',
    perk: '1 Free Streak Freeze per month',
    perkBn: 'মাসে ১টি ফ্রি স্ট্রিক ফ্রিজ'
  },
  {
    id: 'edu_scholar',
    name: 'Knowledge Scholar',
    nameBn: 'জ্ঞান অন্বেষী',
    description: 'Complete 10 verified educational micro-tasks',
    descriptionBn: '১০টি যাচাইকৃত শিক্ষামূলক মাইক্রো-টাস্ক সম্পন্ন করুন',
    icon: '🎓',
    requirement: '10 Educational Tasks',
    perk: 'Access to High-Yield Educational Quizzes',
    perkBn: 'উচ্চ মূল্যের শিক্ষণীয় টাস্কে অগ্রাধিকার'
  },
  {
    id: 'speedy_solver',
    name: 'Lightning Earner',
    nameBn: 'তড়িৎ আর্নার',
    description: 'Submit 5 high-accuracy tasks within 24 hours',
    descriptionBn: '২৪ ঘণ্টার মধ্যে ৫টি নিখুঁত টাস্ক সাবমিট করুন',
    icon: '⚡',
    requirement: '5 Tasks in 1 Day',
    perk: 'Fast-track task verification',
    perkBn: 'দ্রুত টাস্ক অনুমোদন সুবিধা'
  },
  {
    id: 'mission_champion',
    name: 'Mission Champion',
    nameBn: 'মিশন চ্যাম্পিয়ন',
    description: 'Successfully complete 3 platform challenge missions',
    descriptionBn: '৩টি প্ল্যাটফর্ম চ্যালেঞ্জ মিশন সফলভাবে শেষ করুন',
    icon: '🏆',
    requirement: '3 Missions Completed',
    perk: '+50 Coins Bonus per Mission',
    perkBn: 'প্রতি মিশনে ৫০ কয়েন বোনাস'
  },
  {
    id: 'trusted_earner',
    name: 'Gold Reputation',
    nameBn: 'বিশ্বস্ত উপভোক্তা',
    description: 'Achieve 100% approval rate across 20+ tasks with zero fraud flags',
    descriptionBn: 'কোনো জালিয়াতি ছাড়া ১০০% অনুমোদনের রেকর্ড অর্জন করুন',
    icon: '🛡️',
    requirement: '20 Approved, 0 Flags',
    perk: 'Zero withdrawal processing fees',
    perkBn: 'উত্তোলনে শূন্য প্রসেসিং ফি'
  },
  {
    id: 'social_influencer',
    name: 'Digital Ambassador',
    nameBn: 'ডিজিটাল দূত',
    description: 'Promote 5 sponsored social campaigns with verified engagement',
    descriptionBn: '৫টি স্পন্সর করা সামাজিক প্রচারণা সফলভাবে প্রচার করুন',
    icon: '📣',
    requirement: '5 Social Tasks',
    perk: 'Exclusive Campaign Invitations',
    perkBn: 'এক্সক্লুসিভ স্পন্সর ক্যাম্পেইন নিমন্ত্রণ'
  },
  {
    id: 'veteran_level_5',
    name: 'Level 5 Veteran',
    nameBn: 'লেভেল ৫ প্রবীণ',
    description: 'Reach user Level 5 through consistent quality contributions',
    descriptionBn: 'ধারাবাহিক অবদানের মাধ্যমে লেভেল ৫ অর্জন করুন',
    icon: '⭐',
    requirement: 'Reach Level 5',
    perk: '1.25x Platform Reward Multiplier',
    perkBn: '১.২৫ গুণ স্থায়ী প্ল্যাটফর্ম রিওয়ার্ড'
  }
];

export const DEFAULT_USER: User = {
  id: 'usr_admin',
  name: 'Platform Administrator',
  email: 'yfhgibth@gmail.com',
  phone: '',
  role: 'super_admin',
  avatar: '',
  membershipTier: 'free',
  balance: 0,
  totalEarned: 0,
  level: 1,
  xp: 0,
  xpNextLevel: 100,
  streakDays: 0,
  longestStreak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  streakClaimedToday: false,
  streakFreezeRemaining: 0,
  badges: [],
  savedTaskIds: [],
  recentlyViewedTaskIds: [],
  isAgeVerified: true,
  guardianConsent: false,
  privacyLeaderboard: 'public',
  notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: false },
  riskScore: 0,
  isFlagged: false,
  registeredAt: new Date().toISOString().split('T')[0]
};

export const INITIAL_USERS: User[] = [DEFAULT_USER];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SUBMISSIONS: TaskSubmission[] = [];

export const INITIAL_MISSIONS: Mission[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_FRAUD_FLAGS: FraudFlag[] = [];

export const INITIAL_PROMO_CODES: PromoCode[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [];

export const INITIAL_SYSTEM_HEALTH: SystemHealthState = {
  firebaseConnected: true,
  authStatus: 'healthy',
  firestoreLatencyMs: 35,
  storageStatus: 'healthy',
  cloudFunctionsLatencyMs: 70,
  lastBackupDate: new Date().toISOString().split('T')[0],
  backupSizeMb: 0,
  backupStatus: 'completed',
  restorePoints: [],
  recentErrors: []
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
