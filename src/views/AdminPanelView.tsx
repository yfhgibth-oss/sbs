import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  FirestoreTask, 
  FirestoreAdvertisement, 
  FirestoreNotice,
  FirestoreSettings,
  FirestoreMembershipPlan
} from '../services/firebaseService';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileCheck2, 
  Wallet, 
  CreditCard, 
  Award, 
  Megaphone, 
  Image as ImageIcon, 
  Share2, 
  Trophy, 
  Bell, 
  Headphones, 
  Settings as SettingsIcon, 
  Sliders, 
  ShieldCheck, 
  FileText,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  ChevronRight,
  ArrowLeft,
  LayoutGrid,
  Smartphone
} from 'lucide-react';

// Modular Sections
import { DashboardCockpit } from './admin/DashboardCockpit';
import { UserManagementSection } from './admin/UserManagementSection';
import { TaskManagementSection } from './admin/TaskManagementSection';
import { SubmissionsSection } from './admin/SubmissionsSection';
import { 
  WalletsLedgerSection, 
  WithdrawalsSection, 
  PaymentSettingsSection 
} from './admin/FinanceSections';
import { 
  MembershipsSection,
  AdvertisementsSection,
  BannersSection,
  ReferralsSection,
  LeaderboardSection,
  NoticesSection,
  SupportSection,
  WebsiteSettingsSection,
  AdminManagementSection,
  ActivityLogsSection
} from './admin/MarketingAndSettingsSections';
import { 
  AppUpdateSection, 
  PromotedAppsSection 
} from './admin/AppAndVersionSections';

// Standalone Modals
import { 
  TaskModal, 
  AdModal, 
  BannerModal, 
  NoticeModal, 
  WalletModal, 
  PayoutModal 
} from './admin/AdminModals';

export type AdminSection = 
  | 'dashboard'
  | 'users'
  | 'tasks'
  | 'submissions'
  | 'wallets'
  | 'withdrawals'
  | 'memberships'
  | 'advertisements'
  | 'banners'
  | 'referrals'
  | 'leaderboard'
  | 'notifications'
  | 'support'
  | 'payment_settings'
  | 'website_settings'
  | 'admin_management'
  | 'activity_logs'
  | 'app_update'
  | 'promoted_apps';

export const AdminPanelView: React.FC = () => {
  const { 
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
    updateMembershipPlan,
    toggleUserSuspension,
    updateUserRole,
    updateUserTier,
    manualWalletAdjustment,
    replySupportTicket,
    reSeedInitialData,
    purgeDemoData,
    promotedApps,
    updatePromotedApp,
    deletePromotedApp,
    updateAppVersion
  } = useFirebase();

  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Task creation/editing modal state
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FirestoreTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTitleBn, setTaskTitleBn] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDescBn, setTaskDescBn] = useState('');
  const [taskType, setTaskType] = useState<FirestoreTask['taskType']>('video');
  const [taskReward, setTaskReward] = useState(30);
  const [taskXp, setTaskXp] = useState(50);
  const [taskUrl, setTaskUrl] = useState('');
  const [taskImg, setTaskImg] = useState('');
  const [taskProofType, setTaskProofType] = useState<FirestoreTask['proofType']>('screenshot');
  const [taskInstructions, setTaskInstructions] = useState('Complete the activity and submit proof.');
  const [taskInstructionsBn, setTaskInstructionsBn] = useState('কাজের সকল শর্ত পূরণ করে উপযুক্ত প্রমাণ জমা দিন।');

  // Ad modal state
  const [newAdOpen, setNewAdOpen] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adImg, setAdImg] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [adPlacement, setAdPlacement] = useState<FirestoreAdvertisement['placement']>('popup');

  // Banner modal state
  const [newBannerOpen, setNewBannerOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerLink, setBannerLink] = useState('#');

  // Notice modal state
  const [newNoticeOpen, setNewNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<FirestoreNotice['category']>('general');

  // Wallet adjustment modal state
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState(100);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState('Campaign bonus or correction');

  // Payout confirmation modal state
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [targetWithdrawalId, setTargetWithdrawalId] = useState<string | null>(null);
  const [customTrxId, setCustomTrxId] = useState('');

  // Stats calculation
  const totalUsers = allUsers.length || 1;
  const activeUsers = allUsers.filter((u) => u.status === 'active').length;
  const suspendedUsers = allUsers.filter((u) => u.status === 'suspended').length;
  const totalTasks = tasks.length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending').length;
  const totalRewardsDistributed = submissions.filter((s) => s.status === 'approved').reduce((acc, s) => acc + s.rewardAmount, 0) + 148500;
  const openSupportCount = supportTickets.filter((t) => t.status === 'open').length;

  const pendingSubmissionsList = submissions.filter((s) => s.status === 'pending');
  const pendingWithdrawalsList = withdrawals.filter((w) => w.status === 'pending');

  // Task submit handler
  const handleCreateOrUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      await updateTask(editingTask.id, {
        title: taskTitle.trim(),
        titleBn: taskTitleBn.trim() || undefined,
        description: taskDesc.trim(),
        descriptionBn: taskDescBn.trim() || undefined,
        taskType,
        rewardAmount: Number(taskReward),
        xpReward: Number(taskXp),
        instructions: taskInstructions.trim(),
        instructionsBn: taskInstructionsBn.trim() || undefined,
        proofType: taskProofType,
        externalUrl: taskUrl.trim() || undefined,
        imageUrl: taskImg.trim() || undefined
      });
      showToast(`Task "${taskTitle}" updated successfully!`);
      setEditingTask(null);
    } else {
      await createTask({
        title: taskTitle.trim(),
        titleBn: taskTitleBn.trim() || undefined,
        description: taskDesc.trim(),
        descriptionBn: taskDescBn.trim() || undefined,
        taskType,
        rewardAmount: Number(taskReward),
        xpReward: Number(taskXp),
        eligibleTiers: ['free', 'silver', 'gold', 'premium'],
        minTimeOnTaskSeconds: 60,
        dailyLimit: 500,
        totalLimit: 5000,
        instructions: taskInstructions.trim(),
        instructionsBn: taskInstructionsBn.trim() || undefined,
        proofType: taskProofType,
        externalUrl: taskUrl.trim() || undefined,
        imageUrl: taskImg.trim() || undefined,
        status: 'active'
      });
      showToast(`Task "${taskTitle}" published successfully!`);
    }

    setNewTaskOpen(false);
    setTaskTitle('');
    setTaskTitleBn('');
    setTaskDesc('');
    setTaskDescBn('');
    setTaskInstructions('Complete the activity and submit proof.');
    setTaskInstructionsBn('কাজের সকল শর্ত পূরণ করে উপযুক্ত প্রমাণ জমা দিন।');
  };

  const handleOpenEditTask = (task: FirestoreTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTitleBn(task.titleBn || '');
    setTaskDesc(task.description);
    setTaskDescBn(task.descriptionBn || '');
    setTaskType(task.taskType);
    setTaskReward(task.rewardAmount);
    setTaskXp(task.xpReward);
    setTaskUrl(task.externalUrl || '');
    setTaskImg(task.imageUrl || '');
    setTaskProofType(task.proofType);
    setTaskInstructions(task.instructions);
    setTaskInstructionsBn(task.instructionsBn || '');
    setNewTaskOpen(true);
  };

  const handleBulkApproveSubmissions = async () => {
    const pendings = submissions.filter((s) => s.status === 'pending');
    if (pendings.length === 0) return;
    for (const sub of pendings) {
      await reviewSubmission(sub.id, 'approved', 'Bulk verified by Super Admin.');
    }
    showToast(`Approved ${pendings.length} pending submissions!`);
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim()) return;

    await createAdvertisement({
      title: adTitle.trim(),
      imageUrl: adImg.trim(),
      targetUrl: adUrl.trim(),
      placement: adPlacement,
      active: true
    });

    setNewAdOpen(false);
    setAdTitle('');
    showToast('Advertisement created and live on website!');
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    await createBanner({
      title: bannerTitle.trim(),
      imageUrl: bannerImg.trim(),
      linkUrl: bannerLink.trim() || undefined,
      order: banners.length + 1,
      active: true
    });

    setNewBannerOpen(false);
    setBannerTitle('');
    showToast('Banner created and added to carousel!');
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    await createNotice({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      category: noticeCategory,
      important: true
    });

    setNewNoticeOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
    showToast('Announcement broadcasted to all users!');
  };

  const handleManualWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) return;

    await manualWalletAdjustment(targetUserId, Number(adjustAmount), adjustType, adjustReason);
    setAdjustOpen(false);
    setTargetUserId('');
    showToast(`Wallet ${adjustType.toUpperCase()} of ${adjustAmount} ৳ applied successfully.`);
  };

  const handleConfirmPayout = async () => {
    if (!targetWithdrawalId) return;
    const trx = customTrxId.trim() || `BKASH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    await reviewWithdrawal(targetWithdrawalId, 'paid', trx);
    setPayoutModalOpen(false);
    setTargetWithdrawalId(null);
    setCustomTrxId('');
    showToast(`Payout marked as Paid! TrxRef: ${trx}`);
  };

  // Categories & Filters
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'overview' | 'tasks' | 'finance' | 'users' | 'system'>('all');
  const [moduleSearch, setModuleSearch] = useState('');

  const categories: {
    id: 'all' | 'overview' | 'tasks' | 'finance' | 'users' | 'system';
    label: string;
    icon: any;
    badge?: number;
  }[] = [
    { id: 'all', label: language === 'bn' ? 'সকল কন্ট্রোল গ্রিড' : 'All Controls Grid', icon: LayoutGrid },
    { id: 'overview', label: language === 'bn' ? 'ড্যাশবোর্ড ওভারভিউ' : 'Overview Dashboard', icon: LayoutDashboard },
    { 
      id: 'tasks', 
      label: language === 'bn' ? 'টাস্ক ও প্রুফ' : 'Tasks & Proofs', 
      icon: CheckSquare, 
      badge: pendingSubmissions > 0 ? pendingSubmissions : undefined 
    },
    { 
      id: 'finance', 
      label: language === 'bn' ? 'ফিন্যান্স ও ক্যাশআউট' : 'Finance & Payouts', 
      icon: Wallet, 
      badge: pendingWithdrawals > 0 ? pendingWithdrawals : undefined 
    },
    { id: 'users', label: language === 'bn' ? 'ইউজার ও মেম্বার' : 'Users & Community', icon: Users },
    { 
      id: 'system', 
      label: language === 'bn' ? 'সিস্টেম সেটিংস' : 'System & Settings', 
      icon: SettingsIcon, 
      badge: openSupportCount > 0 ? openSupportCount : undefined 
    }
  ];

  const allModules: {
    id: AdminSection;
    label: string;
    bnLabel: string;
    category: 'overview' | 'tasks' | 'finance' | 'users' | 'system';
    icon: any;
    count?: number;
    badgeType?: 'warning' | 'info' | 'success';
    description: string;
    bnDescription: string;
  }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard Cockpit', 
      bnLabel: 'ড্যাশবোর্ড ওভারভিউ', 
      category: 'overview', 
      icon: LayoutDashboard, 
      description: 'Platform metrics, fast approval queues, financial health',
      bnDescription: 'লাইভ মেট্রিক্স, দ্রুত অনুমোদন কিউ এবং আর্থিক অবস্থা'
    },
    { 
      id: 'tasks', 
      label: 'Task Management', 
      bnLabel: 'টাস্ক ম্যানেজমেন্ট ও তৈরি', 
      category: 'tasks', 
      icon: CheckSquare, 
      count: totalTasks, 
      description: 'Create, edit reward coins, pause, and delete micro-tasks',
      bnDescription: 'নতুন মাইক্রো-টাস্ক তৈরি, রিওয়ার্ড কয়েন এডিট ও চালু/বন্ধ করুন'
    },
    { 
      id: 'submissions', 
      label: 'Proof Verification', 
      bnLabel: 'টাস্ক প্রুফ ও প্রমাণপত্র যাচাই', 
      category: 'tasks', 
      icon: FileCheck2, 
      count: pendingSubmissions, 
      badgeType: 'warning', 
      description: 'Inspect screenshots & codes, disburse coins to user wallets',
      bnDescription: 'স্ক্রিনশট ও জমা দেওয়া প্রুফ যাচাই করে কয়েন অনুমোদন করুন'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      bnLabel: 'ইউজার ম্যানেজমেন্ট ও রোল', 
      category: 'users', 
      icon: Users, 
      count: totalUsers, 
      description: 'Directory, roles (Admin/User), VIP tiers, and suspensions',
      bnDescription: 'সকল ইউজারের প্রোফাইল, রোল পরিবর্তন, মেম্বারশিপ ও সাসপেনশন'
    },
    { 
      id: 'withdrawals', 
      label: 'Withdrawal Approvals', 
      bnLabel: 'ক্যাশআউট ও উত্তোলন অনুমোদন', 
      category: 'finance', 
      icon: CreditCard, 
      count: pendingWithdrawals, 
      badgeType: 'warning', 
      description: 'Approve bKash, Nagad, Rocket payouts and enter TrxID',
      bnDescription: 'বিকাশ, নগদ, রকেটে টাকা পাঠিয়ে TrxID রেকর্ড ও অনুমোদন করুন'
    },
    { 
      id: 'wallets', 
      label: 'User Wallets Ledger', 
      bnLabel: 'ইউজার ওয়ালেট ও এসক্রো', 
      category: 'finance', 
      icon: Wallet, 
      description: 'Audit user balances, lifetime earnings, and direct adjustments',
      bnDescription: 'আর্নারদের বর্তমান ব্যালেন্স ও সরাসরি ক্রেডিট বা ডেবিট সমন্বয়'
    },
    { 
      id: 'payment_settings', 
      label: 'MFS Gateway Accounts', 
      bnLabel: 'পেমেন্ট গেটওয়ে সেটিংস', 
      category: 'finance', 
      icon: Sliders, 
      description: 'Configure official bKash, Nagad, Rocket & Bank accounts',
      bnDescription: 'অফিসিয়াল বিকাশ, নগদ ও রকেট মার্চেন্ট/পার্সোনাল নম্বর পরিবর্তন'
    },
    { 
      id: 'memberships', 
      label: 'Membership Tiers', 
      bnLabel: 'মেম্বারশিপ প্যাকেজ ও আপগ্রেড', 
      category: 'tasks', 
      icon: Award, 
      count: memberships.length, 
      description: 'VIP subscription pricing, task limits, and multipliers',
      bnDescription: 'সিলভার, গোল্ড ও প্রিমিয়াম প্ল্যান ফি এবং রিওয়ার্ড গুণক নির্ধারণ'
    },
    { 
      id: 'advertisements', 
      label: 'Advertisements & Popups', 
      bnLabel: 'বিজ্ঞাপন ও পপআপ ক্যাম্পেইন', 
      category: 'system', 
      icon: Megaphone, 
      count: advertisements.length, 
      description: 'Create modal popup ads, banners, and external sponsor URLs',
      bnDescription: 'ওয়েবসাইটে স্পন্সর পপআপ ব্যানার তৈরি ও এক্সটার্নাল লিংক সেট'
    },
    { 
      id: 'banners', 
      label: 'Homepage Banners', 
      bnLabel: 'হোমপেজ ক্যারোসেল স্লাইডার', 
      category: 'system', 
      icon: ImageIcon, 
      count: banners.length, 
      description: 'Promotional graphic slides shown at the top of the user app',
      bnDescription: 'ইউজার অ্যাপের উপরের স্লাইডার ব্যানার তৈরি ও পরিচালনা'
    },
    { 
      id: 'referrals', 
      label: 'Referral System', 
      bnLabel: 'রেফারেল কমিশন ও বোনাস', 
      category: 'users', 
      icon: Share2, 
      description: 'Set performance commission (%) and welcome bonus amounts',
      bnDescription: 'রেফারেল কমিশন শতকরা হার ও সাইনআপ বোনাস টাকা নির্ধারণ'
    },
    { 
      id: 'leaderboard', 
      label: 'Leaderboard Moderation', 
      bnLabel: 'লিডারবোর্ড ও টপ আর্নার', 
      category: 'users', 
      icon: Trophy, 
      description: 'View top earners and toggle public ranking visibility',
      bnDescription: 'শীর্ষ উপার্জনকারীদের তালিকা ও পাবলিক ভিজিবিলিটি মডারেশন'
    },
    { 
      id: 'notifications', 
      label: 'Broadcast Notices', 
      bnLabel: 'পুশ নোটিশ ও জরুরি ঘোষণা', 
      category: 'system', 
      icon: Bell, 
      count: notices.length, 
      description: 'Publish instant announcements shown across the user app',
      bnDescription: 'সকল ইউজারের অ্যাপে তাত্ক্ষণিক জরুরি ঘোষণা পাঠানো'
    },
    { 
      id: 'support', 
      label: 'Support Helpdesk', 
      bnLabel: 'গ্রাহক সহায়তা টিকিট', 
      category: 'system', 
      icon: Headphones, 
      count: openSupportCount, 
      badgeType: 'warning', 
      description: 'Threaded customer inquiry tickets with live replies',
      bnDescription: 'ইউজারদের পাঠানো অভিযোগ বা সাহায্য বার্তা এবং রিপ্লাই প্রদান'
    },
    { 
      id: 'website_settings', 
      label: 'Website & Brand Config', 
      bnLabel: 'ওয়েবসাইট ব্র্যান্ডিং সেটিংস', 
      category: 'system', 
      icon: SettingsIcon, 
      description: 'Site name, WhatsApp hotline, min withdrawal, maintenance',
      bnDescription: 'ওয়েবসাইটের নাম, হোয়াটসঅ্যাপ হেল্পলাইন ও মিনিমাম উইথড্রয়াল'
    },
    { 
      id: 'admin_management', 
      label: 'Staff Administration', 
      bnLabel: 'অ্যাডমিন ও স্টাফ রোল', 
      category: 'system', 
      icon: ShieldCheck, 
      description: 'Super Admin, Manager credentials, and access permissions',
      bnDescription: 'ম্যানেজার ও মডারেটরদের ক্ষমতা ও অ্যাডমিন এক্সেস কন্ট্রোল'
    },
    { 
      id: 'activity_logs', 
      label: 'Activity & Audit Logs', 
      bnLabel: 'অপরিবর্তনযোগ্য অ্যাক্টিভিটি লগ', 
      category: 'overview', 
      icon: FileText, 
      count: auditLogs.length, 
      description: 'Chronological timeline of all admin operations and changes',
      bnDescription: 'সকল অ্যাডমিন কার্যক্রমের অপরিবর্তনযোগ্য হিস্টোরি ও লগ'
    },
    { 
      id: 'app_update', 
      label: 'Web App & Version Manager', 
      bnLabel: 'ওয়েব অ্যাপ ভার্সন ও আপডেট ম্যানেজার', 
      category: 'system', 
      icon: Smartphone, 
      description: 'Configure PWA releases, changelog, force updates, and live popup alerts',
      bnDescription: 'ওয়েব অ্যাপ ভার্সন রিলিজ, চেঞ্জলগ ও লাইভ আপডেট পপআপ পাবলিশ'
    },
    { 
      id: 'promoted_apps', 
      label: 'Promoted Apps Directory', 
      bnLabel: 'অ্যাপ প্রমোশন ও ডিরেক্টরি', 
      category: 'tasks', 
      icon: Layers, 
      count: promotedApps.length,
      description: 'Review submitted apps, approve download rewards, and toggle featured apps',
      bnDescription: 'ব্যবহারকারীদের সাবমিট করা অ্যাপস অনুমোদন ও রিওয়ার্ড কন্ট্রোল'
    }
  ];

  const filteredModules = allModules.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory || (selectedCategory === 'overview' && m.id === 'dashboard');
    const matchesSearch = !moduleSearch || 
      m.label.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.bnLabel.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(moduleSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeModuleMeta = allModules.find((m) => m.id === activeSection) || allModules[0];

  return (
    <div className="space-y-5">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 p-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium text-xs shadow-xl animate-in slide-in-from-top-2 border border-slate-700 dark:border-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Unified Executive Header */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Console'}</span>
            </span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
              {language === 'bn' ? activeModuleMeta.bnLabel : activeModuleMeta.label}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="Connected to Firestore" />
          </div>
          <h1 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'bn' ? activeModuleMeta.bnLabel : activeModuleMeta.label}
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-xl line-clamp-1 sm:line-clamp-none">
            {language === 'bn' ? activeModuleMeta.bnDescription : activeModuleMeta.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          {/* Escrow Badge */}
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
              {language === 'bn' ? 'এসক্রো:' : 'Escrow:'}
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white tabular-nums">
              {(totalRewardsDistributed + 50000).toLocaleString()} ৳
            </span>
          </div>

          {/* Pending Alert Badge */}
          {(pendingSubmissions > 0 || pendingWithdrawals > 0) && (
            <button
              onClick={() => setActiveSection(pendingSubmissions > 0 ? 'submissions' : 'withdrawals')}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>
                {pendingSubmissions + pendingWithdrawals} {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
              </span>
            </button>
          )}

          {/* Quick Action Buttons */}
          <button
            onClick={() => {
              setEditingTask(null);
              setTaskTitle('');
              setTaskDesc('');
              setNewTaskOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{language === 'bn' ? 'নতুন টাস্ক' : 'New Task'}</span>
          </button>

          <button
            onClick={() => setNewNoticeOpen(true)}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] sm:text-xs transition-colors"
            title="Broadcast announcement to all users"
          >
            <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ঘোষণা' : 'Notice'}</span>
          </button>

          <button
            onClick={async () => {
              await reSeedInitialData();
              showToast('Platform verified data synchronized successfully!');
            }}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Sync & verify platform initial state"
          >
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Pills & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (activeSection !== 'dashboard') {
                    setActiveSection('dashboard');
                  }
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{cat.label}</span>
                {cat.badge !== undefined && (
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    active 
                      ? 'bg-amber-400 text-slate-950' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            placeholder={language === 'bn' ? 'মডিউল খুঁজুন...' : 'Search controls...'}
            className="w-full pl-7 sm:pl-8 pr-2.5 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] sm:text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Breadcrumb Navigation when inside a sub-module */}
      {activeSection !== 'dashboard' && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
          <button
            onClick={() => setActiveSection('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-900 dark:text-white text-[10px] sm:text-xs font-semibold shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? '← সকল কন্ট্রোল গ্রিড' : '← All Controls Grid'}</span>
          </button>

          {/* Quick Module Jump Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
            <span className="text-[10px] text-slate-400 font-medium mr-0.5 hidden sm:inline">
              {language === 'bn' ? 'জাম্প:' : 'Switch:'}
            </span>
            {[
              { id: 'tasks', label: language === 'bn' ? 'টাস্ক' : 'Tasks' },
              { id: 'submissions', label: language === 'bn' ? 'প্রুফ' : 'Proofs' },
              { id: 'users', label: language === 'bn' ? 'ইউজার' : 'Users' },
              { id: 'withdrawals', label: language === 'bn' ? 'ক্যাশআউট' : 'Payouts' },
              { id: 'wallets', label: language === 'bn' ? 'ওয়ালেট' : 'Wallets' },
              { id: 'payment_settings', label: language === 'bn' ? 'গেটওয়ে' : 'MFS' },
              { id: 'website_settings', label: language === 'bn' ? 'সেটিংস' : 'Settings' }
            ].map((jump) => (
              <button
                key={jump.id}
                onClick={() => setActiveSection(jump.id as AdminSection)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-colors ${
                  activeSection === jump.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {jump.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Workspace (Full Width Responsive Sections without cramped sidebar) */}
      <div className="space-y-6">
        
        {/* SECTION 1: DASHBOARD OVERVIEW WITH RESPONSIVE CSS GRID */}
        {activeSection === 'dashboard' && (
          <DashboardCockpit
            language={language}
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            suspendedUsers={suspendedUsers}
            totalTasks={totalTasks}
            pendingSubmissions={pendingSubmissions}
            pendingWithdrawals={pendingWithdrawals}
            totalRewardsDistributed={totalRewardsDistributed}
            pendingSubmissionsList={pendingSubmissionsList}
            pendingWithdrawalsList={pendingWithdrawalsList}
            advertisements={advertisements}
            banners={banners}
            memberships={memberships}
            notices={notices}
            supportTickets={supportTickets}
            auditLogs={auditLogs}
            onNavigate={(s) => setActiveSection(s)}
            onOpenNewTask={() => {
              setEditingTask(null);
              setTaskTitle('');
              setTaskDesc('');
              setNewTaskOpen(true);
            }}
            onOpenNewNotice={() => setNewNoticeOpen(true)}
            onOpenAdjustWallet={() => setAdjustOpen(true)}
            onReviewSubmission={async (id, status, notes) => {
              await reviewSubmission(id, status, notes);
            }}
            onOpenPayoutModal={(wId) => {
              setTargetWithdrawalId(wId);
              setCustomTrxId(`BKASH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
              setPayoutModalOpen(true);
            }}
            showToast={showToast}
            purgeDemoData={purgeDemoData}
          />
        )}

        {/* SECTION 2: USER MANAGEMENT */}
        {activeSection === 'users' && (
          <UserManagementSection
            allUsers={allUsers}
            language={language}
            onUpdateRole={updateUserRole}
            onUpdateTier={updateUserTier}
            onToggleSuspension={toggleUserSuspension}
            onOpenAdjustWallet={(uid) => {
              setTargetUserId(uid);
              setAdjustOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {/* SECTION 3: TASK MANAGEMENT */}
        {activeSection === 'tasks' && (
          <TaskManagementSection
            tasks={tasks}
            language={language}
            onOpenNewTask={() => {
              setEditingTask(null);
              setTaskTitle('');
              setTaskDesc('');
              setNewTaskOpen(true);
            }}
            onOpenEditTask={handleOpenEditTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            showToast={showToast}
          />
        )}

        {/* SECTION 4: TASK SUBMISSIONS REVIEW */}
        {activeSection === 'submissions' && (
          <SubmissionsSection
            submissions={submissions}
            language={language}
            onReviewSubmission={reviewSubmission}
            onBulkApprove={handleBulkApproveSubmissions}
            showToast={showToast}
          />
        )}

        {/* SECTION 5: WALLET MANAGEMENT */}
        {activeSection === 'wallets' && (
          <WalletsLedgerSection
            allUsers={allUsers}
            language={language}
            onOpenAdjustWallet={(uid) => {
              if (uid) setTargetUserId(uid);
              setAdjustOpen(true);
            }}
          />
        )}

        {/* SECTION 6: WITHDRAWAL MANAGEMENT */}
        {activeSection === 'withdrawals' && (
          <WithdrawalsSection
            withdrawals={withdrawals}
            language={language}
            onOpenPayoutModal={(id) => {
              setTargetWithdrawalId(id);
              setCustomTrxId(`BKASH-${Math.floor(100000 + Math.random() * 900000)}`);
              setPayoutModalOpen(true);
            }}
            onRejectWithdrawal={async (id) => {
              await reviewWithdrawal(id, 'rejected');
            }}
            showToast={showToast}
          />
        )}

        {/* SECTION 7: MEMBERSHIP MANAGEMENT */}
        {activeSection === 'memberships' && (
          <MembershipsSection
            memberships={memberships}
            membershipPayments={membershipPayments}
            language={language}
            onReviewPayment={reviewMembershipPayment}
            onUpdatePlan={updateMembershipPlan}
            showToast={showToast}
          />
        )}

        {/* SECTION 8: ADVERTISEMENT MANAGEMENT */}
        {activeSection === 'advertisements' && (
          <AdvertisementsSection
            advertisements={advertisements}
            language={language}
            onOpenNewAd={() => setNewAdOpen(true)}
            onUpdateAd={updateAdvertisement}
            onDeleteAd={deleteAdvertisement}
            showToast={showToast}
          />
        )}

        {/* SECTION 9: BANNER MANAGEMENT */}
        {activeSection === 'banners' && (
          <BannersSection
            banners={banners}
            language={language}
            onOpenNewBanner={() => setNewBannerOpen(true)}
            onUpdateBanner={updateBanner}
            onDeleteBanner={deleteBanner}
            showToast={showToast}
          />
        )}

        {/* SECTION 10: REFERRAL MANAGEMENT */}
        {activeSection === 'referrals' && (
          <ReferralsSection
            settings={settings}
            language={language}
            onUpdateSettings={updateSettings}
            showToast={showToast}
          />
        )}

        {/* SECTION 11: LEADERBOARD MANAGEMENT */}
        {activeSection === 'leaderboard' && (
          <LeaderboardSection
            allUsers={allUsers}
            language={language}
            onTogglePrivacy={async (uid, current) => {
              const next = current === 'hidden' ? 'public' : 'hidden';
              await updateDoc(doc(db, 'users', uid), { privacyLeaderboard: next });
            }}
            showToast={showToast}
          />
        )}

        {/* SECTION 12: NOTIFICATIONS & NOTICES */}
        {activeSection === 'notifications' && (
          <NoticesSection
            notices={notices}
            language={language}
            onOpenNewNotice={() => setNewNoticeOpen(true)}
            onDeleteNotice={deleteNotice}
            showToast={showToast}
          />
        )}

        {/* SECTION 13: SUPPORT MANAGEMENT */}
        {activeSection === 'support' && (
          <SupportSection
            supportTickets={supportTickets}
            language={language}
            onReplyTicket={replySupportTicket}
            showToast={showToast}
          />
        )}

        {/* SECTION 14: PAYMENT SETTINGS */}
        {activeSection === 'payment_settings' && (
          <PaymentSettingsSection
            settings={settings}
            language={language}
            onSavePaymentSettings={updateSettings}
            showToast={showToast}
          />
        )}

        {/* SECTION 15: WEBSITE SETTINGS */}
        {activeSection === 'website_settings' && (
          <WebsiteSettingsSection
            settings={settings}
            language={language}
            onSaveSettings={updateSettings}
            showToast={showToast}
          />
        )}

        {/* SECTION 16: ADMIN MANAGEMENT */}
        {activeSection === 'admin_management' && (
          <AdminManagementSection
            allUsers={allUsers}
            language={language}
            onUpdateRole={updateUserRole}
            showToast={showToast}
          />
        )}

        {/* SECTION 17: ACTIVITY LOGS */}
        {activeSection === 'activity_logs' && (
          <ActivityLogsSection
            auditLogs={auditLogs}
            language={language}
          />
        )}

        {/* SECTION 18: WEB APP & VERSION UPDATE MANAGER */}
        {activeSection === 'app_update' && (
          <AppUpdateSection
            settings={settings}
            language={language}
            onUpdateAppVersion={updateAppVersion}
            showToast={showToast}
          />
        )}

        {/* SECTION 19: PROMOTED APPS DIRECTORY */}
        {activeSection === 'promoted_apps' && (
          <PromotedAppsSection
            promotedApps={promotedApps}
            language={language}
            onUpdateApp={updatePromotedApp}
            onDeleteApp={deletePromotedApp}
            showToast={showToast}
          />
        )}

      </div>

      {/* Standalone Modals */}
      <TaskModal
        open={newTaskOpen}
        editingTask={editingTask}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskTitleBn={taskTitleBn}
        setTaskTitleBn={setTaskTitleBn}
        taskDesc={taskDesc}
        setTaskDesc={setTaskDesc}
        taskDescBn={taskDescBn}
        setTaskDescBn={setTaskDescBn}
        taskType={taskType}
        setTaskType={setTaskType}
        taskReward={taskReward}
        setTaskReward={setTaskReward}
        taskXp={taskXp}
        setTaskXp={setTaskXp}
        taskUrl={taskUrl}
        setTaskUrl={setTaskUrl}
        taskImg={taskImg}
        setTaskImg={setTaskImg}
        taskProofType={taskProofType}
        setTaskProofType={setTaskProofType}
        taskInstructions={taskInstructions}
        setTaskInstructions={setTaskInstructions}
        taskInstructionsBn={taskInstructionsBn}
        setTaskInstructionsBn={setTaskInstructionsBn}
        onClose={() => setNewTaskOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
      />

      <AdModal
        open={newAdOpen}
        adTitle={adTitle}
        setAdTitle={setAdTitle}
        adImg={adImg}
        setAdImg={setAdImg}
        adUrl={adUrl}
        setAdUrl={setAdUrl}
        adPlacement={adPlacement}
        setAdPlacement={setAdPlacement}
        onClose={() => setNewAdOpen(false)}
        onSubmit={handleCreateAd}
      />

      <BannerModal
        open={newBannerOpen}
        bannerTitle={bannerTitle}
        setBannerTitle={setBannerTitle}
        bannerImg={bannerImg}
        setBannerImg={setBannerImg}
        bannerLink={bannerLink}
        setBannerLink={setBannerLink}
        onClose={() => setNewBannerOpen(false)}
        onSubmit={handleCreateBanner}
      />

      <NoticeModal
        open={newNoticeOpen}
        noticeTitle={noticeTitle}
        setNoticeTitle={setNoticeTitle}
        noticeContent={noticeContent}
        setNoticeContent={setNoticeContent}
        noticeCategory={noticeCategory}
        setNoticeCategory={setNoticeCategory}
        onClose={() => setNewNoticeOpen(false)}
        onSubmit={handleCreateNotice}
      />

      <WalletModal
        open={adjustOpen}
        targetUserId={targetUserId}
        setTargetUserId={setTargetUserId}
        adjustAmount={adjustAmount}
        setAdjustAmount={setAdjustAmount}
        adjustType={adjustType}
        setAdjustType={setAdjustType}
        adjustReason={adjustReason}
        setAdjustReason={setAdjustReason}
        onClose={() => setAdjustOpen(false)}
        onSubmit={handleManualWallet}
      />

      <PayoutModal
        open={payoutModalOpen}
        customTrxId={customTrxId}
        setCustomTrxId={setCustomTrxId}
        onClose={() => setPayoutModalOpen(false)}
        onConfirm={handleConfirmPayout}
      />

    </div>
  );
};
