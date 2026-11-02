export type UserRole = 
  | 'user' 
  | 'campaign_manager' 
  | 'super_admin' 
  | 'task_manager' 
  | 'payment_manager' 
  | 'support_manager' 
  | 'analyst';

export type MembershipTier = 'free' | 'silver' | 'gold' | 'platinum';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  membershipTier: MembershipTier;
  balance: number; // In BDT / Coins (1 BDT = 1 Coin for clarity, or displayed in BDT)
  totalEarned: number;
  level: number;
  xp: number;
  xpNextLevel: number;
  streakDays: number;
  longestStreak: number;
  lastLoginDate: string;
  streakClaimedToday: boolean;
  streakFreezeRemaining: number;
  badges: string[];
  savedTaskIds: string[];
  recentlyViewedTaskIds: string[];
  isAgeVerified: boolean; // Over 18 or guardian consented
  guardianConsent: boolean;
  privacyLeaderboard: 'public' | 'alias' | 'hidden';
  notificationPrefs: {
    rewards: boolean;
    missions: boolean;
    announcements: boolean;
    emailDigest: boolean;
  };
  riskScore: number; // 0 - 100
  isFlagged: boolean;
  riskReason?: string;
  registeredAt: string;
}

export type TaskCategory = 'app_test' | 'survey' | 'social' | 'education' | 'content' | 'review';

export interface Task {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  category: TaskCategory;
  reward: number; // Coins / BDT
  xpReward: number;
  timeEstimateMinutes: number;
  requiredTier: MembershipTier;
  campaignId?: string;
  sponsorName?: string;
  sponsorNameBn?: string;
  proofType: 'screenshot' | 'text' | 'url';
  maxCompletions: number;
  completedCount: number;
  active: boolean;
  tags: string[];
  guidelines: string[];
  guidelinesBn?: string[];
  instructions?: string;
  instructionsBn?: string;
  quizQuestion?: string;
  quizQuestionBn?: string;
  quizOptions?: string[];
  quizOptionsBn?: string[];
  correctOptionIndex?: number;
  minTimeOnTaskSeconds: number;
  scheduledDate?: string; // For calendar
  rating: number;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  category: TaskCategory;
  userId: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  proofData: {
    screenshotUrl?: string;
    text?: string;
    link?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reward: number;
  xpReward: number;
  reviewNotes?: string;
  duplicateHash?: string;
  trxId?: string;
  timeSpentSeconds: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  reqType: 'approved_tasks' | 'education_tasks' | 'campaign_tasks' | 'weekly_tasks' | 'login_streak';
  reqTarget: number;
  rewardCoins: number;
  rewardXP: number;
  eligibleMembership: MembershipTier[];
  maxParticipants: number;
  currentParticipants: number;
  campaignBudget: number;
  budgetSpent: number;
  status: 'active' | 'upcoming' | 'ended';
  claimedUserIds: string[];
}

export interface Campaign {
  id: string;
  managerId: string;
  managerName: string;
  title: string;
  category: TaskCategory;
  targetUrl: string;
  bannerUrl: string;
  budgetTotal: number;
  budgetSpent: number;
  costPerAction: number;
  maxActions: number;
  actionsCompleted: number;
  eligibleTiers: MembershipTier[];
  eligibleAudience: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  impressions: number;
  clicks: number;
}

export interface FraudFlag {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  flagType: 
    | 'duplicate_submission' 
    | 'duplicate_trx' 
    | 'suspicious_signup' 
    | 'repeated_evidence' 
    | 'unusual_withdrawal' 
    | 'self_referral' 
    | 'multiple_reward_claims';
  riskScore: number;
  evidenceSummary: string;
  timestamp: string;
  status: 'pending_review' | 'cleared' | 'restricted' | 'warning_issued';
  adminNotes?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  rewardType: 'balance' | 'bonus_xp' | 'task_multiplier' | 'tier_upgrade';
  rewardValue: number;
  expiresAt: string;
  usageLimit: number;
  timesUsed: number;
  perUserLimit: number;
  eligibleTiers: ('all' | MembershipTier)[];
  active: boolean;
  usedByUsers: string[];
  description: string;
}

export interface SupportTicketMessage {
  id: string;
  senderRole: 'user' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'task_dispute' | 'payment_withdrawal' | 'account' | 'campaign' | 'bug' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  status: 'open' | 'in_progress' | 'awaiting_user' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  attachmentUrl?: string;
  messages: SupportTicketMessage[];
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  method: 'bkash' | 'nagad' | 'rocket' | 'bank';
  accountNo: string;
  amount: number;
  fee: number;
  netAmount: number;
  trxId: string;
  status: 'pending' | 'approved' | 'flagged' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  isDuplicateTrx?: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  role: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemHealthState {
  firebaseConnected: boolean;
  authStatus: 'healthy' | 'degraded';
  firestoreLatencyMs: number;
  storageStatus: 'healthy' | 'warning';
  cloudFunctionsLatencyMs: number;
  lastBackupDate: string;
  backupSizeMb: number;
  backupStatus: 'completed' | 'running' | 'scheduled';
  restorePoints: {
    id: string;
    timestamp: string;
    snapshotName: string;
    sizeMb: number;
    tables: string[];
  }[];
  recentErrors: {
    id: string;
    code: string;
    message: string;
    timestamp: string;
    severity: 'warning' | 'error';
    service: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'mission' | 'streak' | 'fraud' | 'system';
  read: boolean;
  timestamp: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  requirement: string;
  perk: string;
  perkBn: string;
}
