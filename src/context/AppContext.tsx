import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  UserRole,
  MembershipTier,
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
import { 
  INITIAL_USERS, 
  INITIAL_TASKS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_MISSIONS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_FRAUD_FLAGS, 
  INITIAL_PROMO_CODES, 
  INITIAL_TICKETS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SYSTEM_HEALTH, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_BADGES 
} from '../data/mockData';

interface AppContextType {
  // Users & Roles
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUserTier: (userId: string, newTier: MembershipTier) => void;

  // Streak & Badges
  badges: BadgeDefinition[];
  claimStreakReward: () => { success: boolean; coins: number; xp: number; day: number; message: string };
  useStreakFreeze: () => boolean;
  unlockedBadgeModal: BadgeDefinition | null;
  setUnlockedBadgeModal: (b: BadgeDefinition | null) => void;

  // Tasks
  tasks: Task[];
  submissions: TaskSubmission[];
  savedTasks: Task[];
  recentlyViewedTasks: Task[];
  recommendedTasks: Task[];
  saveTask: (taskId: string) => void;
  unsaveTask: (taskId: string) => void;
  trackViewTask: (taskId: string) => void;
  submitTaskProof: (
    taskId: string, 
    proofData: { screenshotUrl?: string; text?: string; link?: string }, 
    timeSpentSeconds: number
  ) => { success: boolean; flagged: boolean; message: string };
  reviewSubmission: (submissionId: string, status: 'approved' | 'rejected', notes?: string) => void;

  // Missions
  missions: Mission[];
  createMission: (mission: Omit<Mission, 'id' | 'currentParticipants' | 'budgetSpent' | 'claimedUserIds'>) => void;
  claimMissionReward: (missionId: string) => { success: boolean; message: string };
  getMissionProgress: (mission: Mission, userId: string) => { current: number; target: number; percentage: number; isEligible: boolean; canClaim: boolean; isClaimed: boolean };

  // Anti-Fraud
  fraudFlags: FraudFlag[];
  reviewFraudFlag: (flagId: string, action: 'cleared' | 'restricted' | 'warning_issued', adminNotes: string) => void;

  // Campaigns
  campaigns: Campaign[];
  createCampaign: (campaign: Omit<Campaign, 'id' | 'budgetSpent' | 'actionsCompleted' | 'impressions' | 'clicks'>) => void;
  toggleCampaignStatus: (campaignId: string) => void;

  // Promo Codes
  promoCodes: PromoCode[];
  redeemPromoCode: (codeStr: string) => { success: boolean; message: string };
  createPromoCode: (promo: Omit<PromoCode, 'id' | 'timesUsed' | 'usedByUsers'>) => void;

  // Support
  tickets: SupportTicket[];
  createTicket: (category: SupportTicket['category'], priority: SupportTicket['priority'], subject: string, initialMessage: string, attachmentUrl?: string) => void;
  replyTicket: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  whatsAppConfig: { phone: string; defaultMessage: string };
  setWhatsAppConfig: (cfg: { phone: string; defaultMessage: string }) => void;

  // Withdrawals
  withdrawals: Withdrawal[];
  requestWithdrawal: (method: Withdrawal['method'], accountNo: string, amount: number) => { success: boolean; message: string };
  reviewWithdrawal: (withdrawalId: string, status: 'approved' | 'rejected' | 'flagged') => void;

  // System Health & Backups
  systemHealth: SystemHealthState;
  triggerBackupNow: () => Promise<void>;
  testFirestoreLatency: () => Promise<number>;

  // Admin Security & Audit
  auditLogs: AdminAuditLog[];
  logAdminAction: (action: string, targetType: string, targetId: string, details: string) => void;
  requireSensitiveConfirm: (actionTitle: string, actionDetail: string, onConfirm: () => void) => void;
  sensitiveModalState: {
    isOpen: boolean;
    title: string;
    detail: string;
    onConfirm: () => void;
  } | null;
  closeSensitiveModal: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Privacy & Compliance
  verifyAgeAndConsent: (isAgeVerified: boolean, guardianConsent: boolean) => void;
  updatePrivacySettings: (leaderboard: 'public' | 'alias' | 'hidden', notificationPrefs: User['notificationPrefs']) => void;
  exportUserData: () => void;
  requestAccountDeletion: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial seeds
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('taskearn_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading taskearn_users from storage:', e);
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('taskearn_current_user_id') || 'usr_tanvir';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskearn_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('taskearn_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('taskearn_missions');
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('taskearn_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [fraudFlags, setFraudFlags] = useState<FraudFlag[]>(() => {
    const saved = localStorage.getItem('taskearn_fraud_flags');
    return saved ? JSON.parse(saved) : INITIAL_FRAUD_FLAGS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('taskearn_promo_codes');
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('taskearn_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem('taskearn_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('taskearn_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealthState>(() => {
    const saved = localStorage.getItem('taskearn_system_health');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_HEALTH;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('taskearn_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [whatsAppConfig, setWhatsAppConfigState] = useState<{ phone: string; defaultMessage: string }>(() => {
    const saved = localStorage.getItem('taskearn_whatsapp_config');
    return saved ? JSON.parse(saved) : {
      phone: '+8801700112233',
      defaultMessage: 'Hello Task & Earn Support team, I need assistance with my account verification and tasks.'
    };
  });

  const [unlockedBadgeModal, setUnlockedBadgeModal] = useState<BadgeDefinition | null>(null);

  const [sensitiveModalState, setSensitiveModalState] = useState<{
    isOpen: boolean;
    title: string;
    detail: string;
    onConfirm: () => void;
  } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('taskearn_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('taskearn_current_user_id', currentUserId);
  }, [currentUserId]);
  useEffect(() => {
    localStorage.setItem('taskearn_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('taskearn_submissions', JSON.stringify(submissions));
  }, [submissions]);
  useEffect(() => {
    localStorage.setItem('taskearn_missions', JSON.stringify(missions));
  }, [missions]);
  useEffect(() => {
    localStorage.setItem('taskearn_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);
  useEffect(() => {
    localStorage.setItem('taskearn_fraud_flags', JSON.stringify(fraudFlags));
  }, [fraudFlags]);
  useEffect(() => {
    localStorage.setItem('taskearn_promo_codes', JSON.stringify(promoCodes));
  }, [promoCodes]);
  useEffect(() => {
    localStorage.setItem('taskearn_tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem('taskearn_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);
  useEffect(() => {
    localStorage.setItem('taskearn_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('taskearn_system_health', JSON.stringify(systemHealth));
  }, [systemHealth]);
  useEffect(() => {
    localStorage.setItem('taskearn_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('taskearn_whatsapp_config', JSON.stringify(whatsAppConfig));
  }, [whatsAppConfig]);

  // Current active user
  const currentUser: User = (users && users.find((u) => u.id === currentUserId)) || (users && users[0]) || INITIAL_USERS[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const setWhatsAppConfig = (cfg: { phone: string; defaultMessage: string }) => {
    setWhatsAppConfigState(cfg);
  };

  const logAdminAction = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `aud_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      role: currentUser.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '103.205.180.42'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const requireSensitiveConfirm = (actionTitle: string, actionDetail: string, onConfirm: () => void) => {
    setSensitiveModalState({
      isOpen: true,
      title: actionTitle,
      detail: actionDetail,
      onConfirm: () => {
        onConfirm();
        setSensitiveModalState(null);
      }
    });
  };

  const closeSensitiveModal = () => {
    setSensitiveModalState(null);
  };

  // Level & XP management helper
  const addXPAndCoinsToUser = (userId: string, xpToAdd: number, coinsToAdd: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        let newXp = u.xp + xpToAdd;
        let newLevel = u.level;
        let newXpNext = u.xpNextLevel;
        let levelUpHappened = false;

        while (newXp >= newXpNext && newLevel < 10) {
          newXp -= newXpNext;
          newLevel += 1;
          newXpNext = Math.round(newXpNext * 1.4);
          levelUpHappened = true;
        }

        if (levelUpHappened) {
          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // Safe fallback
          }

          // Add notification
          const notif: NotificationItem = {
            id: `notif_lvl_${Date.now()}`,
            userId: u.id,
            title: `Level Up! Reached Level ${newLevel}`,
            message: `Congratulations! Your level promotion brings higher task multipliers and priority payouts.`,
            type: 'reward',
            read: false,
            timestamp: 'Just now'
          };
          setNotifications((n) => [notif, ...n]);
        }

        return {
          ...u,
          xp: newXp,
          level: newLevel,
          xpNextLevel: newXpNext,
          balance: u.balance + coinsToAdd,
          totalEarned: u.totalEarned + coinsToAdd
        };
      })
    );
  };

  // Streak Claim
  const claimStreakReward = () => {
    if (currentUser.streakClaimedToday) {
      return { success: false, coins: 0, xp: 0, day: currentUser.streakDays, message: 'Already claimed today!' };
    }

    const currentDay = (currentUser.streakDays % 7) + 1;
    // Ladder rewards: Day 1-7
    const dayRewards: Record<number, { coins: number; xp: number }> = {
      1: { coins: 10, xp: 20 },
      2: { coins: 15, xp: 30 },
      3: { coins: 20, xp: 40 },
      4: { coins: 25, xp: 60 },
      5: { coins: 35, xp: 80 },
      6: { coins: 50, xp: 100 },
      7: { coins: 80, xp: 200 }
    };

    const reward = dayRewards[currentDay] || { coins: 15, xp: 30 };
    const newStreakDays = currentUser.streakDays + 1;
    const newLongest = Math.max(newStreakDays, currentUser.longestStreak);

    // Update user
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          streakDays: newStreakDays,
          longestStreak: newLongest,
          streakClaimedToday: true,
          lastLoginDate: new Date().toISOString().split('T')[0]
        };
      })
    );

    addXPAndCoinsToUser(currentUser.id, reward.xp, reward.coins);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignored
    }

    // Check 7-day streak badge unlock
    if (newStreakDays >= 7 && !currentUser.badges.includes('streak_master_7')) {
      const badge = INITIAL_BADGES.find((b) => b.id === 'streak_master_7');
      if (badge) {
        setUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, badges: [...u.badges, 'streak_master_7'] } : u))
        );
        setUnlockedBadgeModal(badge);
      }
    }

    const notif: NotificationItem = {
      id: `notif_streak_${Date.now()}`,
      userId: currentUser.id,
      title: `Day ${currentDay} Streak Claimed! (+${reward.coins} Coins)`,
      message: `You earned ${reward.coins} Coins and ${reward.xp} XP for maintaining your daily streak.`,
      type: 'streak',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      coins: reward.coins,
      xp: reward.xp,
      day: currentDay,
      message: `Day ${currentDay} streak successfully claimed!`
    };
  };

  const useStreakFreeze = () => {
    if (currentUser.streakFreezeRemaining <= 0) return false;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, streakFreezeRemaining: u.streakFreezeRemaining - 1 }
          : u
      )
    );
    return true;
  };

  // Task Actions
  const saveTask = (taskId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, savedTaskIds: Array.from(new Set([...u.savedTaskIds, taskId])) }
          : u
      )
    );
  };

  const unsaveTask = (taskId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, savedTaskIds: u.savedTaskIds.filter((id) => id !== taskId) }
          : u
      )
    );
  };

  const trackViewTask = (taskId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const filtered = u.recentlyViewedTaskIds.filter((id) => id !== taskId);
        return { ...u, recentlyViewedTaskIds: [taskId, ...filtered].slice(0, 6) };
      })
    );
  };

  const submitTaskProof = (
    taskId: string, 
    proofData: { screenshotUrl?: string; text?: string; link?: string }, 
    timeSpentSeconds: number
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, flagged: false, message: 'Task not found' };

    // Duplicate Detection Engine: Check identical screenshotUrl or identical text or exact duplicate link
    let duplicateMatch = false;
    let duplicateReason = '';

    if (proofData.screenshotUrl && proofData.screenshotUrl.trim().length > 0) {
      const match = submissions.find(
        (s) => s.proofData.screenshotUrl && s.proofData.screenshotUrl === proofData.screenshotUrl
      );
      if (match) {
        duplicateMatch = true;
        duplicateReason = `Duplicate screenshot URL matched with prior submission ${match.id}.`;
      }
    }

    if (!duplicateMatch && proofData.text && proofData.text.trim().length > 10) {
      const normalized = proofData.text.trim().toLowerCase();
      const match = submissions.find(
        (s) => s.proofData.text && s.proofData.text.trim().toLowerCase() === normalized
      );
      if (match && match.userId !== currentUser.id) {
        duplicateMatch = true;
        duplicateReason = `Identical text content matched with submission from another user (${match.userName}).`;
      }
    }

    const newSub: TaskSubmission = {
      id: `sub_${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      category: task.category,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      proofData,
      status: duplicateMatch ? 'flagged' : 'pending',
      reward: task.reward,
      xpReward: task.xpReward,
      reviewNotes: duplicateMatch ? `Auto-flagged by anti-fraud: ${duplicateReason}` : undefined,
      duplicateHash: proofData.screenshotUrl || proofData.link || `txt_${proofData.text?.substring(0, 20)}`,
      timeSpentSeconds
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // If flagged by anti-fraud, record a FraudFlag
    if (duplicateMatch) {
      const flag: FraudFlag = {
        id: `frd_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        flagType: 'duplicate_submission',
        riskScore: Math.min(currentUser.riskScore + 35, 100),
        evidenceSummary: duplicateReason,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'pending_review',
        adminNotes: 'Automated duplicate submission flag created for admin review.'
      };
      setFraudFlags((prev) => [flag, ...prev]);

      // Increase user risk score
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, riskScore: Math.min(u.riskScore + 35, 100), isFlagged: true }
            : u
        )
      );

      return {
        success: true,
        flagged: true,
        message: 'Evidence submitted, but flagged for duplicate verification review by administrator.'
      };
    }

    // Increment task completed count
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completedCount: t.completedCount + 1 } : t))
    );

    // If campaign task, deduct budget and update campaign actions
    if (task.campaignId) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === task.campaignId
            ? {
                ...c,
                actionsCompleted: c.actionsCompleted + 1,
                budgetSpent: c.budgetSpent + c.costPerAction
              }
            : c
        )
      );
    }

    return {
      success: true,
      flagged: false,
      message: 'Evidence submitted successfully! It is queued for verification.'
    };
  };

  const reviewSubmission = (submissionId: string, status: 'approved' | 'rejected', notes?: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status, reviewNotes: notes } : s))
    );

    if (status === 'approved') {
      addXPAndCoinsToUser(sub.userId, sub.xpReward, sub.reward);

      // Check first task badge
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === sub.userId && !u.badges.includes('first_task')) {
            return { ...u, badges: [...u.badges, 'first_task'] };
          }
          return u;
        })
      );

      // Notification
      const notif: NotificationItem = {
        id: `notif_appr_${Date.now()}`,
        userId: sub.userId,
        title: `Task Approved: ${sub.taskTitle}`,
        message: `Your evidence was verified. +${sub.reward} Coins and +${sub.xpReward} XP credited.`,
        type: 'reward',
        read: false,
        timestamp: 'Just now'
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    logAdminAction(
      `SUBMISSION_${status.toUpperCase()}`,
      'TASK_SUBMISSION',
      submissionId,
      `Submission for "${sub.taskTitle}" marked as ${status}. Notes: ${notes || 'None'}`
    );
  };

  // Missions
  const createMission = (
    missionData: Omit<Mission, 'id' | 'currentParticipants' | 'budgetSpent' | 'claimedUserIds'>
  ) => {
    const newMission: Mission = {
      ...missionData,
      id: `mis_${Date.now()}`,
      currentParticipants: 0,
      budgetSpent: 0,
      claimedUserIds: []
    };
    setMissions((prev) => [newMission, ...prev]);
    logAdminAction('CREATE_MISSION', 'MISSION', newMission.id, `Created mission: ${newMission.title}`);
  };

  const getMissionProgress = (mission: Mission, userId: string) => {
    const user = users.find((u) => u.id === userId) || currentUser;
    const isEligible = mission.eligibleMembership.includes(user.membershipTier);
    const isClaimed = mission.claimedUserIds.includes(userId);

    let current = 0;
    if (mission.reqType === 'approved_tasks') {
      current = submissions.filter((s) => s.userId === userId && s.status === 'approved').length;
    } else if (mission.reqType === 'education_tasks') {
      current = submissions.filter(
        (s) => s.userId === userId && s.status === 'approved' && s.category === 'education'
      ).length;
    } else if (mission.reqType === 'campaign_tasks') {
      current = submissions.filter(
        (s) => s.userId === userId && s.status === 'approved' && (s.category === 'app_test' || s.category === 'social')
      ).length;
    } else if (mission.reqType === 'weekly_tasks') {
      current = submissions.filter((s) => s.userId === userId && s.status === 'approved').length;
    } else if (mission.reqType === 'login_streak') {
      current = user.streakDays;
    }

    const target = mission.reqTarget;
    const percentage = Math.min(Math.round((current / target) * 100), 100);
    const canClaim = isEligible && !isClaimed && current >= target && mission.status === 'active';

    return { current, target, percentage, isEligible, canClaim, isClaimed };
  };

  const claimMissionReward = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return { success: false, message: 'Mission not found' };

    const progress = getMissionProgress(mission, currentUser.id);
    if (!progress.canClaim) {
      return { success: false, message: 'You have not fulfilled the mission requirements or already claimed it.' };
    }

    // Budget check
    if (mission.budgetSpent + mission.rewardCoins > mission.campaignBudget) {
      return { success: false, message: 'Mission campaign budget has reached its maximum cap.' };
    }

    // Credit user
    addXPAndCoinsToUser(currentUser.id, mission.rewardXP, mission.rewardCoins);

    // Update mission state
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? {
              ...m,
              budgetSpent: m.budgetSpent + m.rewardCoins,
              currentParticipants: m.currentParticipants + 1,
              claimedUserIds: [...m.claimedUserIds, currentUser.id]
            }
          : m
      )
    );

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    const notif: NotificationItem = {
      id: `notif_mis_${Date.now()}`,
      userId: currentUser.id,
      title: `Mission Completed: ${mission.title}`,
      message: `You claimed ${mission.rewardCoins} Coins and ${mission.rewardXP} XP!`,
      type: 'mission',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [notif, ...prev]);

    logAdminAction(
      'MISSION_CLAIM_VERIFIED',
      'MISSION',
      missionId,
      `User ${currentUser.name} completed and claimed mission ${mission.title} (+${mission.rewardCoins} coins)`
    );

    return { success: true, message: `Mission completed! +${mission.rewardCoins} Coins & +${mission.rewardXP} XP awarded.` };
  };

  // Anti-fraud review
  const reviewFraudFlag = (flagId: string, action: 'cleared' | 'restricted' | 'warning_issued', adminNotes: string) => {
    const flag = fraudFlags.find((f) => f.id === flagId);
    if (!flag) return;

    setFraudFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, status: action, adminNotes } : f))
    );

    if (action === 'cleared') {
      setUsers((prev) =>
        prev.map((u) => (u.id === flag.userId ? { ...u, isFlagged: false, riskScore: Math.max(0, u.riskScore - 30) } : u))
      );
    } else if (action === 'restricted') {
      setUsers((prev) =>
        prev.map((u) => (u.id === flag.userId ? { ...u, isFlagged: true, riskScore: Math.min(100, u.riskScore + 15) } : u))
      );
    }

    logAdminAction(
      `FRAUD_REVIEW_${action.toUpperCase()}`,
      'FRAUD_FLAG',
      flagId,
      `Admin reviewed flag for user ${flag.userName}. Decision: ${action}. Notes: ${adminNotes}`
    );
  };

  // Campaign management
  const createCampaign = (
    campaignData: Omit<Campaign, 'id' | 'budgetSpent' | 'actionsCompleted' | 'impressions' | 'clicks'>
  ) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `cmp_${Date.now()}`,
      budgetSpent: 0,
      actionsCompleted: 0,
      impressions: 10,
      clicks: 0
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    logAdminAction('CAMPAIGN_CREATE', 'CAMPAIGN', newCamp.id, `Created campaign: ${newCamp.title}`);
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        const newStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: newStatus };
      })
    );
  };

  // Promo Codes
  const redeemPromoCode = (codeStr: string) => {
    const clean = codeStr.trim().toUpperCase();
    const promo = promoCodes.find((p) => p.code.toUpperCase() === clean);

    if (!promo) {
      return { success: false, message: 'Invalid promo code. Please double-check spelling.' };
    }
    if (!promo.active) {
      return { success: false, message: 'This promo code is currently inactive.' };
    }
    if (new Date(promo.expiresAt) < new Date()) {
      return { success: false, message: 'This promotional code has expired.' };
    }
    if (promo.timesUsed >= promo.usageLimit) {
      return { success: false, message: 'This promo code has reached its maximum global usage cap.' };
    }
    if (promo.usedByUsers.includes(currentUser.id)) {
      return { success: false, message: 'You have already redeemed this promotional code.' };
    }
    if (!promo.eligibleTiers.includes('all') && !promo.eligibleTiers.includes(currentUser.membershipTier)) {
      return {
        success: false,
        message: `This promo code is exclusive to ${promo.eligibleTiers.join(', ')} members.`
      };
    }

    // Apply reward
    if (promo.rewardType === 'balance') {
      addXPAndCoinsToUser(currentUser.id, 20, promo.rewardValue);
    } else if (promo.rewardType === 'bonus_xp') {
      addXPAndCoinsToUser(currentUser.id, promo.rewardValue, 0);
    }

    // Mark as used
    setPromoCodes((prev) =>
      prev.map((p) =>
        p.id === promo.id
          ? {
              ...p,
              timesUsed: p.timesUsed + 1,
              usedByUsers: [...p.usedByUsers, currentUser.id]
            }
          : p
      )
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 }
      });
    } catch {
      // Ignored
    }

    const notif: NotificationItem = {
      id: `notif_prm_${Date.now()}`,
      userId: currentUser.id,
      title: `Promo Code Applied: ${promo.code}`,
      message: `Successfully received reward value of ${promo.rewardValue}. Enjoy your bonus!`,
      type: 'reward',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: `Promo code ${promo.code} redeemed! Reward value: ${promo.rewardValue}.` };
  };

  const createPromoCode = (promo: Omit<PromoCode, 'id' | 'timesUsed' | 'usedByUsers'>) => {
    const newPromo: PromoCode = {
      ...promo,
      id: `prm_${Date.now()}`,
      timesUsed: 0,
      usedByUsers: []
    };
    setPromoCodes((prev) => [newPromo, ...prev]);
    logAdminAction('CREATE_PROMO', 'PROMO_CODE', newPromo.id, `Created promo code: ${newPromo.code}`);
  };

  // Support Tickets
  const createTicket = (
    category: SupportTicket['category'],
    priority: SupportTicket['priority'],
    subject: string,
    initialMessage: string,
    attachmentUrl?: string
  ) => {
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      category,
      priority,
      subject,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      attachmentUrl,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderRole: 'user',
          senderName: currentUser.name,
          text: initialMessage,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const replyTicket = (ticketId: string, text: string) => {
    const role: 'admin' | 'user' = currentUser.role.includes('admin') || currentUser.role.includes('manager') ? 'admin' : 'user';
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const msg = {
          id: `msg_${Date.now()}`,
          senderRole: role,
          senderName: currentUser.name,
          text,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        return {
          ...t,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: role === 'admin' ? 'awaiting_user' : 'in_progress',
          messages: [...t.messages, msg]
        };
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : t))
    );
  };

  // Withdrawals
  const requestWithdrawal = (method: Withdrawal['method'], accountNo: string, amount: number) => {
    // Financial rule verification
    if (!currentUser.isAgeVerified) {
      return { success: false, message: 'Age verification or legal guardian consent is required before requesting financial payouts.' };
    }
    if (currentUser.isFlagged) {
      return { success: false, message: 'Account is under anti-fraud review. Payouts are temporarily frozen until review completes.' };
    }
    if (amount > currentUser.balance) {
      return { success: false, message: 'Withdrawal amount exceeds your current available balance.' };
    }
    if (amount < 200) {
      return { success: false, message: 'Minimum withdrawal threshold is 200 BDT.' };
    }

    const feeRate = currentUser.membershipTier === 'platinum' ? 0 : 0.02; // 0% fee for Platinum, 2% standard
    const fee = Math.round(amount * feeRate);
    const netAmount = amount - fee;

    // Deduct balance
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u))
    );

    const newWth: Withdrawal = {
      id: `wth_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      method,
      accountNo,
      amount,
      fee,
      netAmount,
      trxId: `PENDING-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isDuplicateTrx: false
    };

    setWithdrawals((prev) => [newWth, ...prev]);

    return {
      success: true,
      message: `Withdrawal request of ${amount} BDT submitted via ${method.toUpperCase()}. Net to receive: ${netAmount} BDT.`
    };
  };

  const reviewWithdrawal = (withdrawalId: string, status: 'approved' | 'rejected' | 'flagged') => {
    const wth = withdrawals.find((w) => w.id === withdrawalId);
    if (!wth) return;

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status,
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              trxId: status === 'approved' ? `${w.method.toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : w.trxId
            }
          : w
      )
    );

    if (status === 'rejected') {
      // Refund balance
      setUsers((prev) =>
        prev.map((u) => (u.id === wth.userId ? { ...u, balance: u.balance + wth.amount } : u))
      );
    }

    logAdminAction(
      `WITHDRAWAL_${status.toUpperCase()}`,
      'WITHDRAWAL',
      withdrawalId,
      `Reviewed withdrawal of ${wth.amount} BDT for user ${wth.userName}. New status: ${status}.`
    );
  };

  // System Health & Backup actions
  const triggerBackupNow = async () => {
    setSystemHealth((prev) => ({ ...prev, backupStatus: 'running' }));
    
    // Simulate real backup creation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const snapId = `SNAP-${new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14)}`;
    const newSnapshot = {
      id: `rst_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      snapshotName: snapId,
      sizeMb: 144.2,
      tables: ['users', 'tasks', 'submissions', 'campaigns', 'audit_logs', 'support_tickets']
    };

    setSystemHealth((prev) => ({
      ...prev,
      backupStatus: 'completed',
      lastBackupDate: `${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC`,
      backupSizeMb: 144.2,
      restorePoints: [newSnapshot, ...prev.restorePoints]
    }));

    logAdminAction(
      'GCP_FIRESTORE_BACKUP_EXEC',
      'DATABASE_BACKUP',
      snapId,
      'Initiated and verified Firestore cold storage compressed snapshot.'
    );
  };

  const testFirestoreLatency = async () => {
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 40) + 25));
    const duration = Math.round(performance.now() - start);
    setSystemHealth((prev) => ({ ...prev, firestoreLatencyMs: duration }));
    return duration;
  };

  // Role & Tier adjustments
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    logAdminAction('USER_ROLE_CHANGE', 'USER', userId, `Changed role to ${newRole}`);
  };

  const updateUserTier = (userId: string, newTier: MembershipTier) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, membershipTier: newTier } : u))
    );
    logAdminAction('USER_TIER_CHANGE', 'USER', userId, `Changed tier to ${newTier}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Privacy & Compliance
  const verifyAgeAndConsent = (isAgeVerified: boolean, guardianConsent: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, isAgeVerified, guardianConsent }
          : u
      )
    );
  };

  const updatePrivacySettings = (
    leaderboard: 'public' | 'alias' | 'hidden',
    notificationPrefs: User['notificationPrefs']
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, privacyLeaderboard: leaderboard, notificationPrefs }
          : u
      )
    );
  };

  const exportUserData = () => {
    const userSubmissions = submissions.filter((s) => s.userId === currentUser.id);
    const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);
    const userTickets = tickets.filter((t) => t.userId === currentUser.id);

    const exportPayload = {
      userProfile: currentUser,
      submissions: userSubmissions,
      withdrawals: userWithdrawals,
      supportTickets: userTickets,
      exportTimestamp: new Date().toISOString(),
      platformCompliance: 'GDPR / Local Data Protection Right to Access'
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskEarn_UserData_${currentUser.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const requestAccountDeletion = () => {
    requireSensitiveConfirm(
      'Request Account Deletion',
      'This will schedule your account and all associated personal identifiers for permanent erasure after a 14-day statutory grace period. All active payouts will be settled.',
      () => {
        logAdminAction('ACCOUNT_DELETION_REQUESTED', 'USER', currentUser.id, 'User requested permanent account erasure.');
        alert('Your account deletion request has been registered. You have 14 days to cancel before permanent erasure.');
      }
    );
  };

  // Filtered views for saved & recently viewed
  const savedTasks = tasks.filter((t) => currentUser.savedTaskIds.includes(t.id));
  const recentlyViewedTasks = currentUser.recentlyViewedTaskIds
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean) as Task[];

  // Personalized recommendations: High rating, eligible tier, uncompleted
  const completedTaskIds = new Set(
    submissions.filter((s) => s.userId === currentUser.id && s.status === 'approved').map((s) => s.taskId)
  );
  const recommendedTasks = tasks
    .filter((t) => !completedTaskIds.has(t.id) && t.active)
    .sort((a, b) => b.rating * b.reward - a.rating * a.reward)
    .slice(0, 4);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        updateUserRole,
        updateUserTier,
        badges: INITIAL_BADGES,
        claimStreakReward,
        useStreakFreeze,
        unlockedBadgeModal,
        setUnlockedBadgeModal,
        tasks,
        submissions,
        savedTasks,
        recentlyViewedTasks,
        recommendedTasks,
        saveTask,
        unsaveTask,
        trackViewTask,
        submitTaskProof,
        reviewSubmission,
        missions,
        createMission,
        claimMissionReward,
        getMissionProgress,
        fraudFlags,
        reviewFraudFlag,
        campaigns,
        createCampaign,
        toggleCampaignStatus,
        promoCodes,
        redeemPromoCode,
        createPromoCode,
        tickets,
        createTicket,
        replyTicket,
        updateTicketStatus,
        whatsAppConfig,
        setWhatsAppConfig,
        withdrawals,
        requestWithdrawal,
        reviewWithdrawal,
        systemHealth,
        triggerBackupNow,
        testFirestoreLatency,
        auditLogs,
        logAdminAction,
        requireSensitiveConfirm,
        sensitiveModalState,
        closeSensitiveModal,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        verifyAgeAndConsent,
        updatePrivacySettings,
        exportUserData,
        requestAccountDeletion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
