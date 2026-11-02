import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { testConnection } from '../firebase/connectionTest';
import { seedFirestoreIfEmpty, purgeAllDemoData } from '../services/seedFirestore';
import { 
  FirestoreUser, 
  FirestoreWallet, 
  FirestoreTask, 
  FirestoreSubmission, 
  FirestoreWithdrawal, 
  FirestoreMembershipPlan, 
  FirestoreMembershipPayment, 
  FirestoreAdvertisement, 
  FirestoreBanner, 
  FirestoreNotice, 
  FirestoreSupportTicket, 
  FirestoreSettings, 
  FirestoreAuditLog,
  PromotedApp,
  AppVersionInfo,
  uploadImageToStorage
} from '../services/firebaseService';
import confetti from 'canvas-confetti';

interface FirebaseContextType {
  fbUser: FirebaseUser | null;
  userProfile: FirestoreUser | null;
  wallet: FirestoreWallet | null;
  loading: boolean;
  isAdmin: boolean;
  tasks: FirestoreTask[];
  submissions: FirestoreSubmission[];
  withdrawals: FirestoreWithdrawal[];
  memberships: FirestoreMembershipPlan[];
  membershipPayments: FirestoreMembershipPayment[];
  advertisements: FirestoreAdvertisement[];
  banners: FirestoreBanner[];
  notices: FirestoreNotice[];
  supportTickets: FirestoreSupportTicket[];
  settings: FirestoreSettings | null;
  auditLogs: FirestoreAuditLog[];
  allUsers: FirestoreUser[];
  promotedApps: PromotedApp[];

  // Auth Operations
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone: string, refCode?: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // User Actions
  claimDailyStreak: () => Promise<{ success: boolean; coins: number; message: string }>;
  submitTaskProof: (
    taskId: string, 
    proofType: 'screenshot' | 'text' | 'url', 
    proofData: { screenshotUrl?: string; text?: string; url?: string }, 
    timeSpent: number,
    quizAnswerIndex?: number
  ) => Promise<{ success: boolean; message: string }>;
  requestWithdrawal: (method: 'bkash' | 'nagad' | 'rocket' | 'bank', account: string, amount: number) => Promise<{ success: boolean; message: string }>;
  submitMembershipPayment: (planId: string, method: 'bkash' | 'nagad' | 'rocket' | 'bank', account: string, trxId: string) => Promise<{ success: boolean; message: string }>;
  createSupportTicket: (category: string, priority: 'low' | 'medium' | 'high' | 'urgent', subject: string, message: string) => Promise<void>;
  replySupportTicket: (ticketId: string, text: string) => Promise<void>;
  updateProfilePrivacy: (privacyLeaderboard: 'public' | 'alias' | 'hidden', isAgeVerified: boolean, guardianConsent: boolean) => Promise<void>;

  // Admin Actions
  reviewSubmission: (submissionId: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  reviewWithdrawal: (withdrawalId: string, status: 'paid' | 'rejected', trxReference?: string) => Promise<void>;
  reviewMembershipPayment: (paymentId: string, status: 'approved' | 'rejected') => Promise<void>;
  createTask: (task: Omit<FirestoreTask, 'id' | 'completedCount' | 'createdAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<FirestoreTask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createAdvertisement: (ad: Omit<FirestoreAdvertisement, 'id' | 'impressions' | 'clicks'>) => Promise<void>;
  updateAdvertisement: (adId: string, updates: Partial<FirestoreAdvertisement>) => Promise<void>;
  deleteAdvertisement: (adId: string) => Promise<void>;
  createBanner: (banner: Omit<FirestoreBanner, 'id'>) => Promise<void>;
  updateBanner: (bannerId: string, updates: Partial<FirestoreBanner>) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  createNotice: (notice: Omit<FirestoreNotice, 'id' | 'createdAt'>) => Promise<void>;
  deleteNotice: (noticeId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<FirestoreSettings>) => Promise<void>;
  createMembershipPlan: (plan: FirestoreMembershipPlan) => Promise<void>;
  updateMembershipPlan: (planId: string, plan: Partial<FirestoreMembershipPlan>) => Promise<void>;
  toggleUserSuspension: (userId: string, currentStatus: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: FirestoreUser['role']) => Promise<void>;
  updateUserTier: (userId: string, newTier: FirestoreUser['membershipTier']) => Promise<void>;
  manualWalletAdjustment: (userId: string, amount: number, type: 'credit' | 'debit', reason: string) => Promise<void>;
  uploadImage: (file: File, folder?: string) => Promise<string>;
  reSeedInitialData: () => Promise<void>;
  purgeDemoData: () => Promise<void>;
  createPromotedApp: (app: Omit<PromotedApp, 'id' | 'downloadsCount' | 'submittedAt'>) => Promise<void>;
  updatePromotedApp: (appId: string, updates: Partial<PromotedApp>) => Promise<void>;
  deletePromotedApp: (appId: string) => Promise<void>;
  updateAppVersion: (versionInfo: AppVersionInfo, webAppDownloadUrl?: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null);
  const [wallet, setWallet] = useState<FirestoreWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [promotedApps, setPromotedApps] = useState<PromotedApp[]>([]);

  // Live Collection State
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [submissions, setSubmissions] = useState<FirestoreSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<FirestoreWithdrawal[]>([]);
  const [memberships, setMemberships] = useState<FirestoreMembershipPlan[]>([]);
  const [membershipPayments, setMembershipPayments] = useState<FirestoreMembershipPayment[]>([]);
  const [advertisements, setAdvertisements] = useState<FirestoreAdvertisement[]>([]);
  const [banners, setBanners] = useState<FirestoreBanner[]>([]);
  const [notices, setNotices] = useState<FirestoreNotice[]>([]);
  const [supportTickets, setSupportTickets] = useState<FirestoreSupportTicket[]>([]);
  const [settings, setSettings] = useState<FirestoreSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<FirestoreAuditLog[]>([]);
  const [allUsers, setAllUsers] = useState<FirestoreUser[]>([]);

  // Startup verification and seeding
  useEffect(() => {
    async function init() {
      await testConnection();
      await seedFirestoreIfEmpty();
    }
    init();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        const isRuntimeAdmin = user.email === 'yfhgibth@gmail.com';

        if (!userSnap.exists()) {
          const newProfile: FirestoreUser = {
            uid: user.uid,
            fullName: user.displayName || user.email?.split('@')[0] || 'Earner User',
            email: user.email || '',
            role: isRuntimeAdmin ? 'super_admin' : 'user',
            membershipTier: 'free',
            referralCode: `REF${user.uid.substring(0, 6).toUpperCase()}`,
            status: 'active',
            level: 1,
            xp: 0,
            streakDays: 1,
            lastLoginDate: new Date().toISOString().split('T')[0],
            streakClaimedToday: false,
            isAgeVerified: true,
            guardianConsent: false,
            privacyLeaderboard: 'alias',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);

          // Create wallet
          const walletRef = doc(db, 'wallets', user.uid);
          const initialWallet: FirestoreWallet = {
            userId: user.uid,
            availableBalance: 50, // Welcome gift
            pendingBalance: 0,
            lifetimeEarnings: 50,
            totalWithdrawn: 0,
            updatedAt: new Date().toISOString()
          };
          await setDoc(walletRef, initialWallet);
          setWallet(initialWallet);
        } else {
          const profileData = userSnap.data() as FirestoreUser;
          // Grant admin rights if email matches runtime admin email
          if (isRuntimeAdmin && profileData.role === 'user') {
            profileData.role = 'super_admin';
            await updateDoc(userRef, { role: 'super_admin' });
          }
          setUserProfile(profileData);
        }
      } else {
        setUserProfile(null);
        setWallet(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    fbUser && (
      fbUser.email === 'yfhgibth@gmail.com' ||
      userProfile?.role === 'admin' || 
      userProfile?.role === 'super_admin' || 
      userProfile?.role === 'task_manager' || 
      userProfile?.role === 'payment_manager' || 
      userProfile?.role === 'support_manager'
    )
  );

  // Listen to Wallet if user is logged in
  useEffect(() => {
    if (!fbUser) return;
    const unsub = onSnapshot(doc(db, 'wallets', fbUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setWallet(docSnap.data() as FirestoreWallet);
      }
    });
    return () => unsub();
  }, [fbUser]);

  // Listen to Global Collections
  useEffect(() => {
    // Tasks
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snap) => {
      setTasks(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreTask)));
    }, (err) => console.warn('Tasks onSnapshot listener notice:', err));

    // Memberships
    const unsubMemberships = onSnapshot(collection(db, 'memberships'), (snap) => {
      setMemberships(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreMembershipPlan)));
    }, (err) => console.warn('Memberships onSnapshot listener notice:', err));

    // Advertisements
    const unsubAds = onSnapshot(collection(db, 'advertisements'), (snap) => {
      setAdvertisements(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreAdvertisement)));
    }, (err) => console.warn('Ads onSnapshot listener notice:', err));

    // Banners
    const unsubBanners = onSnapshot(collection(db, 'banners'), (snap) => {
      setBanners(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreBanner)));
    }, (err) => console.warn('Banners onSnapshot listener notice:', err));

    // Notices
    const unsubNotices = onSnapshot(collection(db, 'notices'), (snap) => {
      setNotices(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreNotice)));
    }, (err) => console.warn('Notices onSnapshot listener notice:', err));

    // Promoted Apps / User-submitted Apps
    const unsubApps = onSnapshot(collection(db, 'promotedApps'), (snap) => {
      setPromotedApps(snap.docs.map((d) => ({ ...d.data(), id: d.id } as PromotedApp)));
    }, (err) => console.warn('PromotedApps onSnapshot listener notice:', err));

    // Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as FirestoreSettings);
      }
    }, (err) => console.warn('Settings onSnapshot listener notice:', err));

    return () => {
      unsubTasks();
      unsubMemberships();
      unsubAds();
      unsubBanners();
      unsubNotices();
      unsubApps();
      unsubSettings();
    };
  }, []);

  // Listen to User-scoped or Admin Submissions & Withdrawals
  useEffect(() => {
    if (!fbUser) {
      setSubmissions([]);
      setWithdrawals([]);
      setSupportTickets([]);
      return;
    }

    // Submissions
    const submissionsQuery = isAdmin
      ? collection(db, 'taskSubmissions')
      : query(collection(db, 'taskSubmissions'), where('userId', '==', fbUser.uid));

    const unsubSubmissions = onSnapshot(submissionsQuery, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreSubmission)));
    }, (err) => console.warn('Submissions onSnapshot error notice:', err));

    // Withdrawals
    const withdrawalsQuery = isAdmin
      ? collection(db, 'withdrawals')
      : query(collection(db, 'withdrawals'), where('userId', '==', fbUser.uid));

    const unsubWithdrawals = onSnapshot(withdrawalsQuery, (snap) => {
      setWithdrawals(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreWithdrawal)));
    }, (err) => console.warn('Withdrawals onSnapshot error notice:', err));

    // Support Tickets
    const ticketsQuery = isAdmin
      ? collection(db, 'supportTickets')
      : query(collection(db, 'supportTickets'), where('userId', '==', fbUser.uid));

    const unsubTickets = onSnapshot(ticketsQuery, (snap) => {
      setSupportTickets(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreSupportTicket)));
    }, (err) => console.warn('Tickets onSnapshot error notice:', err));

    // Membership Payments
    const paymentsQuery = isAdmin
      ? collection(db, 'membershipPayments')
      : query(collection(db, 'membershipPayments'), where('userId', '==', fbUser.uid));

    const unsubPayments = onSnapshot(paymentsQuery, (snap) => {
      setMembershipPayments(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreMembershipPayment)));
    }, (err) => console.warn('Payments onSnapshot error notice:', err));

    // Audit logs (admin only)
    let unsubAudit = () => {};
    if (isAdmin) {
      unsubAudit = onSnapshot(collection(db, 'auditLogs'), (snap) => {
        setAuditLogs(snap.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreAuditLog)));
      }, (err) => console.warn('AuditLogs onSnapshot error notice:', err));
    }

    // All users list (admin only)
    let unsubUsers = () => {};
    if (isAdmin) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        setAllUsers(snap.docs.map((d) => ({ ...d.data(), uid: d.id } as FirestoreUser)));
      }, (err) => console.warn('Users onSnapshot error notice:', err));
    }

    return () => {
      unsubSubmissions();
      unsubWithdrawals();
      unsubTickets();
      unsubPayments();
      unsubAudit();
      unsubUsers();
    };
  }, [fbUser, isAdmin]);

  // Auth Functions
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    phone: string, 
    refCode?: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });

    const newProfile: FirestoreUser = {
      uid: cred.user.uid,
      fullName: name,
      mobileNumber: phone,
      email,
      role: email === 'yfhgibth@gmail.com' ? 'super_admin' : 'user',
      membershipTier: 'free',
      referralCode: `REF${cred.user.uid.substring(0, 6).toUpperCase()}`,
      referredBy: refCode || undefined,
      status: 'active',
      level: 1,
      xp: 0,
      streakDays: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      streakClaimedToday: false,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'alias',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);

    // Initial wallet with 50 bonus coins
    const initialWallet: FirestoreWallet = {
      userId: cred.user.uid,
      availableBalance: 50,
      pendingBalance: 0,
      lifetimeEarnings: 50,
      totalWithdrawn: 0,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'wallets', cred.user.uid), initialWallet);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // User Actions
  const claimDailyStreak = async () => {
    if (!fbUser || !userProfile) return { success: false, coins: 0, message: 'Please login first' };
    if (userProfile.streakClaimedToday) return { success: false, coins: 0, message: 'Already claimed streak today!' };

    const newStreak = (userProfile.streakDays || 0) + 1;
    const coinsReward = Math.min(newStreak * 10, 80);

    await updateDoc(doc(db, 'users', fbUser.uid), {
      streakDays: newStreak,
      streakClaimedToday: true,
      lastLoginDate: new Date().toISOString().split('T')[0],
      xp: increment(coinsReward * 2)
    });

    await updateDoc(doc(db, 'wallets', fbUser.uid), {
      availableBalance: increment(coinsReward),
      lifetimeEarnings: increment(coinsReward),
      updatedAt: new Date().toISOString()
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    return { success: true, coins: coinsReward, message: `Day ${newStreak} Streak Claimed! +${coinsReward} ৳` };
  };

  const submitTaskProof = async (
    taskId: string, 
    proofType: 'screenshot' | 'text' | 'url', 
    proofData: { screenshotUrl?: string; text?: string; url?: string }, 
    timeSpent: number,
    quizAnswerIndex?: number
  ) => {
    if (!fbUser || !userProfile) return { success: false, message: 'Please login first' };
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    // Duplicate submission check
    const existingSub = submissions.find((s) => s.taskId === taskId && s.userId === fbUser.uid && (s.status === 'pending' || s.status === 'approved'));
    if (existingSub) {
      return { success: false, message: 'You have already submitted this task.' };
    }

    // Quiz verification check if applicable
    if (task.quizQuestion && task.correctOptionIndex !== undefined) {
      if (quizAnswerIndex !== task.correctOptionIndex) {
        return { success: false, message: 'Incorrect quiz answer. Please review the material and try again.' };
      }
    }

    // Anti-fraud content fingerprint check
    const duplicateProof = submissions.find((s) => 
      (proofData.screenshotUrl && s.proofUrl === proofData.screenshotUrl) ||
      (proofData.text && s.proofText === proofData.text && s.userId !== fbUser.uid)
    );

    const submissionId = `sub_${Date.now()}`;
    const newSub: FirestoreSubmission = {
      id: submissionId,
      taskId: task.id,
      taskTitle: task.title,
      userId: fbUser.uid,
      userName: userProfile.fullName,
      proofType,
      proofUrl: proofData.screenshotUrl || proofData.url,
      proofText: proofData.text,
      status: duplicateProof ? 'flagged' : 'pending',
      rewardAmount: Math.round(task.rewardAmount * (userProfile.membershipTier === 'silver' ? 1.25 : userProfile.membershipTier === 'gold' ? 1.6 : userProfile.membershipTier === 'premium' ? 2.2 : 1.0)),
      xpReward: task.xpReward,
      adminNotes: duplicateProof ? 'Flagged: Duplicate proof fingerprint detected.' : undefined,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'taskSubmissions', submissionId), newSub);

    // Update wallet pending balance
    await updateDoc(doc(db, 'wallets', fbUser.uid), {
      pendingBalance: increment(newSub.rewardAmount),
      updatedAt: new Date().toISOString()
    });

    // Increment task completed count
    await updateDoc(doc(db, 'tasks', taskId), {
      completedCount: increment(1)
    });

    return { 
      success: true, 
      message: duplicateProof ? 'Submitted! Note: Evidence flagged for duplicate verification review.' : 'Task evidence submitted! Pending review.' 
    };
  };

  const reviewSubmission = async (submissionId: string, status: 'approved' | 'rejected', notes?: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    await updateDoc(doc(db, 'taskSubmissions', submissionId), {
      status,
      adminNotes: notes || (status === 'approved' ? 'Verified by admin.' : 'Rejected.')
    });

    // Update user wallet
    const userWalletRef = doc(db, 'wallets', sub.userId);
    if (status === 'approved') {
      await updateDoc(userWalletRef, {
        pendingBalance: increment(-sub.rewardAmount),
        availableBalance: increment(sub.rewardAmount),
        lifetimeEarnings: increment(sub.rewardAmount),
        updatedAt: new Date().toISOString()
      });

      // Credit XP to user
      await updateDoc(doc(db, 'users', sub.userId), {
        xp: increment(sub.xpReward)
      });
    } else {
      await updateDoc(userWalletRef, {
        pendingBalance: increment(-sub.rewardAmount),
        updatedAt: new Date().toISOString()
      });
    }

    // Log admin activity
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: `SUBMISSION_${status.toUpperCase()}`,
      targetType: 'SUBMISSION',
      targetId: submissionId,
      details: `Submission for "${sub.taskTitle}" was marked as ${status}. Notes: ${notes || 'None'}`,
      timestamp: new Date().toISOString()
    });
  };

  const requestWithdrawal = async (method: 'bkash' | 'nagad' | 'rocket' | 'bank', account: string, amount: number) => {
    if (!fbUser || !userProfile || !wallet) return { success: false, message: 'Please login first' };
    if (userProfile.status === 'suspended') return { success: false, message: 'Your account is suspended. Contact support.' };
    if (amount > wallet.availableBalance) return { success: false, message: 'Withdrawal amount exceeds available balance.' };
    if (amount < (settings?.minimumWithdrawal || 200)) return { success: false, message: `Minimum withdrawal is ${settings?.minimumWithdrawal || 200} ৳` };

    const feeRate = userProfile.membershipTier === 'gold' || userProfile.membershipTier === 'premium' ? 0 : 0.02;
    const fee = Math.round(amount * feeRate);
    const netAmount = amount - fee;

    const withdrawalId = `wth_${Date.now()}`;
    const newWth: FirestoreWithdrawal = {
      id: withdrawalId,
      userId: fbUser.uid,
      userName: userProfile.fullName,
      method,
      accountNumber: account,
      amount,
      fee,
      netAmount,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'withdrawals', withdrawalId), newWth);

    // Deduct available balance
    await updateDoc(doc(db, 'wallets', fbUser.uid), {
      availableBalance: increment(-amount),
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: `Withdrawal request for ${amount} ৳ via ${method.toUpperCase()} submitted!` };
  };

  const reviewWithdrawal = async (withdrawalId: string, status: 'paid' | 'rejected', trxReference?: string) => {
    const wth = withdrawals.find((w) => w.id === withdrawalId);
    if (!wth) return;

    await updateDoc(doc(db, 'withdrawals', withdrawalId), {
      status,
      transactionReference: trxReference || `MFS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      processedAt: new Date().toISOString()
    });

    if (status === 'rejected') {
      // Refund user balance
      await updateDoc(doc(db, 'wallets', wth.userId), {
        availableBalance: increment(wth.amount),
        updatedAt: new Date().toISOString()
      });
    } else if (status === 'paid') {
      await updateDoc(doc(db, 'wallets', wth.userId), {
        totalWithdrawn: increment(wth.netAmount),
        updatedAt: new Date().toISOString()
      });
    }

    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: `WITHDRAWAL_${status.toUpperCase()}`,
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      details: `Withdrawal of ${wth.amount} ৳ to ${wth.userName} marked as ${status}. TrxRef: ${trxReference || 'Auto'}`,
      timestamp: new Date().toISOString()
    });
  };

  const submitMembershipPayment = async (
    planId: string, 
    method: 'bkash' | 'nagad' | 'rocket' | 'bank', 
    account: string, 
    trxId: string
  ) => {
    if (!fbUser || !userProfile) return { success: false, message: 'Please login first' };
    const plan = memberships.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Plan not found' };

    const paymentId = `mp_${Date.now()}`;
    const newPayment: FirestoreMembershipPayment = {
      id: paymentId,
      userId: fbUser.uid,
      userName: userProfile.fullName,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      paymentMethod: method,
      senderAccount: account,
      transactionId: trxId,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'membershipPayments', paymentId), newPayment);
    return { success: true, message: 'Upgrade payment submitted! Pending administrator verification.' };
  };

  const reviewMembershipPayment = async (paymentId: string, status: 'approved' | 'rejected') => {
    const payment = membershipPayments.find((p) => p.id === paymentId);
    if (!payment) return;

    await updateDoc(doc(db, 'membershipPayments', paymentId), { status });

    if (status === 'approved') {
      const plan = memberships.find((p) => p.id === payment.planId);
      const days = plan?.durationDays || 30;
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      await updateDoc(doc(db, 'users', payment.userId), {
        membershipTier: payment.planId,
        membershipExpiresAt: expiresAt
      });
    }

    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: `MEMBERSHIP_PAYMENT_${status.toUpperCase()}`,
      targetType: 'MEMBERSHIP_PAYMENT',
      targetId: paymentId,
      details: `Membership upgrade for ${payment.userName} to ${payment.planName} marked as ${status}.`,
      timestamp: new Date().toISOString()
    });
  };

  const createSupportTicket = async (category: string, priority: 'low' | 'medium' | 'high' | 'urgent', subject: string, message: string) => {
    if (!fbUser || !userProfile) return;
    const ticketId = `tkt_${Date.now()}`;
    const newTicket: FirestoreSupportTicket = {
      id: ticketId,
      userId: fbUser.uid,
      userName: userProfile.fullName,
      category,
      priority,
      subject,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: fbUser.uid,
          senderName: userProfile.fullName,
          senderRole: 'user',
          text: message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    await setDoc(doc(db, 'supportTickets', ticketId), newTicket);
  };

  const replySupportTicket = async (ticketId: string, text: string) => {
    if (!fbUser || !userProfile) return;
    const ticket = supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: fbUser.uid,
      senderName: userProfile.fullName,
      senderRole: (isAdmin ? 'admin' : 'user') as 'admin' | 'user',
      text,
      timestamp: new Date().toISOString()
    };

    await updateDoc(doc(db, 'supportTickets', ticketId), {
      messages: [...ticket.messages, newMsg],
      updatedAt: new Date().toISOString(),
      status: isAdmin ? 'awaiting_user' : 'in_progress'
    });
  };

  const updateProfilePrivacy = async (privacyLeaderboard: 'public' | 'alias' | 'hidden', isAgeVerified: boolean, guardianConsent: boolean) => {
    if (!fbUser) return;
    await updateDoc(doc(db, 'users', fbUser.uid), {
      privacyLeaderboard,
      isAgeVerified,
      guardianConsent
    });
  };

  // Administrative Operations
  const createTask = async (task: Omit<FirestoreTask, 'id' | 'completedCount' | 'createdAt'>) => {
    const taskId = `task_${Date.now()}`;
    await setDoc(doc(db, 'tasks', taskId), {
      ...task,
      id: taskId,
      completedCount: 0,
      createdAt: new Date().toISOString()
    });
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: 'TASK_CREATE',
      targetType: 'TASK',
      targetId: taskId,
      details: `Created task "${task.title}" with reward ${task.rewardAmount} ৳`,
      timestamp: new Date().toISOString()
    });
  };

  const updateTask = async (taskId: string, updates: Partial<FirestoreTask>) => {
    await updateDoc(doc(db, 'tasks', taskId), updates);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const createAdvertisement = async (ad: Omit<FirestoreAdvertisement, 'id' | 'impressions' | 'clicks'>) => {
    const adId = `ad_${Date.now()}`;
    await setDoc(doc(db, 'advertisements', adId), {
      ...ad,
      id: adId,
      impressions: 0,
      clicks: 0
    });
  };

  const updateAdvertisement = async (adId: string, updates: Partial<FirestoreAdvertisement>) => {
    await updateDoc(doc(db, 'advertisements', adId), updates);
  };

  const deleteAdvertisement = async (adId: string) => {
    await deleteDoc(doc(db, 'advertisements', adId));
  };

  const createBanner = async (banner: Omit<FirestoreBanner, 'id'>) => {
    const bannerId = `ban_${Date.now()}`;
    await setDoc(doc(db, 'banners', bannerId), { ...banner, id: bannerId });
  };

  const deleteBanner = async (bannerId: string) => {
    await deleteDoc(doc(db, 'banners', bannerId));
  };

  const createNotice = async (notice: Omit<FirestoreNotice, 'id' | 'createdAt'>) => {
    const noticeId = `not_${Date.now()}`;
    await setDoc(doc(db, 'notices', noticeId), {
      ...notice,
      id: noticeId,
      createdAt: new Date().toISOString()
    });
  };

  const deleteNotice = async (noticeId: string) => {
    await deleteDoc(doc(db, 'notices', noticeId));
  };

  const updateSettings = async (newSettings: Partial<FirestoreSettings>) => {
    await updateDoc(doc(db, 'settings', 'global'), newSettings);
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: 'SETTINGS_UPDATE',
      targetType: 'SETTINGS',
      targetId: 'global',
      details: `Updated platform settings: ${Object.keys(newSettings).join(', ')}`,
      timestamp: new Date().toISOString()
    });
  };

  const createMembershipPlan = async (plan: FirestoreMembershipPlan) => {
    await setDoc(doc(db, 'memberships', plan.id), plan);
  };

  const updateMembershipPlan = async (planId: string, plan: Partial<FirestoreMembershipPlan>) => {
    await updateDoc(doc(db, 'memberships', planId), plan);
  };

  const toggleUserSuspension = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    await updateDoc(doc(db, 'users', userId), { status: newStatus });
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: newStatus === 'suspended' ? 'USER_SUSPEND' : 'USER_REACTIVATE',
      targetType: 'USER',
      targetId: userId,
      details: `Changed user account status to ${newStatus}`,
      timestamp: new Date().toISOString()
    });
  };

  const updateUserRole = async (userId: string, newRole: FirestoreUser['role']) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: 'ROLE_UPDATE',
      targetType: 'USER',
      targetId: userId,
      details: `Updated role of user ${userId} to ${newRole}`,
      timestamp: new Date().toISOString()
    });
  };

  const manualWalletAdjustment = async (userId: string, amount: number, type: 'credit' | 'debit', reason: string) => {
    const delta = type === 'credit' ? amount : -amount;
    await updateDoc(doc(db, 'wallets', userId), {
      availableBalance: increment(delta),
      lifetimeEarnings: type === 'credit' ? increment(amount) : increment(0),
      updatedAt: new Date().toISOString()
    });

    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: `WALLET_MANUAL_${type.toUpperCase()}`,
      targetType: 'WALLET',
      targetId: userId,
      details: `Manual ${type} of ${amount} ৳ to user ${userId}. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    });
  };

  const updateUserTier = async (userId: string, newTier: FirestoreUser['membershipTier']) => {
    await updateDoc(doc(db, 'users', userId), { membershipTier: newTier });
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: 'TIER_UPDATE',
      targetType: 'USER',
      targetId: userId,
      details: `Updated membership tier of user ${userId} to ${newTier}`,
      timestamp: new Date().toISOString()
    });
  };

  const updateBanner = async (bannerId: string, updates: Partial<FirestoreBanner>) => {
    await updateDoc(doc(db, 'banners', bannerId), updates);
  };

  const reSeedInitialData = async () => {
    await seedFirestoreIfEmpty();
  };

  const purgeDemoData = async () => {
    await purgeAllDemoData();
  };

  const uploadImage = async (file: File, folder = 'uploads') => {
    return await uploadImageToStorage(file, folder);
  };

  // Promoted Apps operations
  const createPromotedApp = async (appData: Omit<PromotedApp, 'id' | 'downloadsCount' | 'submittedAt'>) => {
    const id = `app_${Date.now()}`;
    const newApp: PromotedApp = {
      ...appData,
      id,
      downloadsCount: 0,
      submittedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'promotedApps', id), newApp);
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'user',
      adminName: userProfile?.fullName || fbUser?.displayName || 'App Contributor',
      action: 'APP_CREATED',
      targetType: 'PROMOTED_APP',
      targetId: id,
      details: `Added new promoted app: "${appData.title}" (${appData.category})`,
      timestamp: new Date().toISOString()
    });
  };

  const updatePromotedApp = async (appId: string, updates: Partial<PromotedApp>) => {
    await updateDoc(doc(db, 'promotedApps', appId), updates);
  };

  const deletePromotedApp = async (appId: string) => {
    await deleteDoc(doc(db, 'promotedApps', appId));
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Administrator',
      action: 'APP_DELETED',
      targetType: 'PROMOTED_APP',
      targetId: appId,
      details: `Deleted promoted app: ${appId}`,
      timestamp: new Date().toISOString()
    });
  };

  // Update App Version in Settings
  const updateAppVersion = async (versionInfo: AppVersionInfo, webAppDownloadUrl?: string) => {
    const settingsRef = doc(db, 'settings', 'global');
    const updatePayload: Partial<FirestoreSettings> = {
      appVersionInfo: versionInfo
    };
    if (webAppDownloadUrl !== undefined) {
      updatePayload.webAppDownloadUrl = webAppDownloadUrl;
    }
    await updateDoc(settingsRef, updatePayload);
    await addDoc(collection(db, 'auditLogs'), {
      adminId: fbUser?.uid || 'admin',
      adminName: userProfile?.fullName || 'Super Administrator',
      action: 'APP_VERSION_RELEASED',
      targetType: 'SYSTEM_SETTINGS',
      targetId: versionInfo.version,
      details: `Published App Update: ${versionInfo.version} (${versionInfo.title})`,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        fbUser,
        userProfile,
        wallet,
        loading,
        isAdmin,
        tasks,
        submissions,
        withdrawals,
        memberships,
        membershipPayments,
        advertisements,
        banners,
        notices,
        supportTickets,
        settings,
        auditLogs,
        allUsers,
        promotedApps,

        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        sendPasswordReset,
        logout,

        claimDailyStreak,
        submitTaskProof,
        requestWithdrawal,
        submitMembershipPayment,
        createSupportTicket,
        replySupportTicket,
        updateProfilePrivacy,

        reviewSubmission,
        reviewWithdrawal,
        reviewMembershipPayment,
        createTask,
        updateTask,
        deleteTask,
        createAdvertisement,
        updateAdvertisement,
        deleteAdvertisement,
        createBanner,
        updateBanner,
        deleteBanner,
        createNotice,
        deleteNotice,
        updateSettings,
        createMembershipPlan,
        updateMembershipPlan,
        toggleUserSuspension,
        updateUserRole,
        updateUserTier,
        manualWalletAdjustment,
        uploadImage,
        reSeedInitialData,
        purgeDemoData,
        createPromotedApp,
        updatePromotedApp,
        deletePromotedApp,
        updateAppVersion
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
