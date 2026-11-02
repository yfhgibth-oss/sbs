import React from 'react';
import { 
  CheckSquare, 
  Wallet, 
  Users, 
  Sliders, 
  Megaphone, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  FileCheck2, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Share2, 
  Trophy, 
  Bell, 
  Headphones, 
  ShieldCheck, 
  FileText, 
  Coins, 
  Clock, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { 
  FirestoreSubmission, 
  FirestoreWithdrawal, 
  FirestoreAdvertisement, 
  FirestoreBanner, 
  FirestoreMembershipPlan, 
  FirestoreNotice, 
  FirestoreSupportTicket, 
  FirestoreAuditLog 
} from '../../services/firebaseService';
import { AdminSection } from '../AdminPanelView';

interface DashboardCockpitProps {
  language: 'bn' | 'en';
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalTasks: number;
  pendingSubmissions: number;
  pendingWithdrawals: number;
  totalRewardsDistributed: number;
  pendingSubmissionsList: FirestoreSubmission[];
  pendingWithdrawalsList: FirestoreWithdrawal[];
  advertisements: FirestoreAdvertisement[];
  banners: FirestoreBanner[];
  memberships?: FirestoreMembershipPlan[];
  notices?: FirestoreNotice[];
  supportTickets?: FirestoreSupportTicket[];
  auditLogs?: FirestoreAuditLog[];
  onNavigate: (section: AdminSection) => void;
  onOpenNewTask: () => void;
  onOpenNewNotice: () => void;
  onOpenAdjustWallet: () => void;
  onReviewSubmission: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  onOpenPayoutModal: (withdrawalId: string) => void;
  showToast: (msg: string) => void;
  purgeDemoData: () => Promise<void>;
}

export const DashboardCockpit: React.FC<DashboardCockpitProps> = ({
  language,
  totalUsers,
  activeUsers,
  suspendedUsers,
  totalTasks,
  pendingSubmissions,
  pendingWithdrawals,
  totalRewardsDistributed,
  pendingSubmissionsList,
  pendingWithdrawalsList,
  advertisements,
  banners,
  memberships = [],
  notices = [],
  supportTickets = [],
  auditLogs = [],
  onNavigate,
  onOpenNewTask,
  onOpenNewNotice,
  onOpenAdjustWallet,
  onReviewSubmission,
  onOpenPayoutModal,
  showToast,
  purgeDemoData
}) => {
  const openSupportCount = supportTickets.filter((t) => t.status === 'open').length;

  const adminControlCards: {
    id: AdminSection;
    title: string;
    bnTitle: string;
    description: string;
    bnDescription: string;
    icon: any;
    color: string;
    bgColor: string;
    badge?: string | number;
    badgeColor?: string;
    actionLabel: string;
    bnActionLabel: string;
  }[] = [
    {
      id: 'tasks',
      title: 'Task Management',
      bnTitle: 'টাস্ক ম্যানেজমেন্ট',
      description: 'Create, edit reward coins, pause, and delete micro-tasks.',
      bnDescription: 'নতুন মাইক্রো-টাস্ক তৈরি, রিওয়ার্ড কয়েন এডিট ও চালু/বন্ধ।',
      icon: CheckSquare,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60',
      badge: `${totalTasks}`,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      actionLabel: 'Manage',
      bnActionLabel: 'পরিচালনা'
    },
    {
      id: 'submissions',
      title: 'Proof Verification',
      bnTitle: 'প্রুফ যাচাইকরণ',
      description: 'Inspect screenshots & codes, disburse coins to user wallets.',
      bnDescription: 'স্ক্রিনশট ও প্রমাণপত্র যাচাই করে রিওয়ার্ড অনুমোদন।',
      icon: FileCheck2,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
      badge: pendingSubmissions > 0 ? `${pendingSubmissions}` : '✓',
      badgeColor: pendingSubmissions > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      actionLabel: 'Verify',
      bnActionLabel: 'যাচাই'
    },
    {
      id: 'users',
      title: 'User Management',
      bnTitle: 'ইউজার ম্যানেজমেন্ট',
      description: 'Directory, roles (Admin/User), VIP tiers, and suspensions.',
      bnDescription: 'ইউজার প্রোফাইল, রোল পরিবর্তন, মেম্বারশিপ ও সাসপেনশন।',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60',
      badge: `${totalUsers}`,
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      actionLabel: 'Manage',
      bnActionLabel: 'পরিচালনা'
    },
    {
      id: 'withdrawals',
      title: 'Withdrawal Approvals',
      bnTitle: 'ক্যাশআউট অনুমোদন',
      description: 'Approve bKash, Nagad, Rocket payouts and enter TrxID.',
      bnDescription: 'বিকাশ, নগদ, রকেটে টাকা পাঠিয়ে TrxID এন্ট্রি ও অনুমোদন।',
      icon: CreditCard,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60',
      badge: pendingWithdrawals > 0 ? `${pendingWithdrawals}` : '0',
      badgeColor: pendingWithdrawals > 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      actionLabel: 'Payouts',
      bnActionLabel: 'পেমেন্ট'
    },
    {
      id: 'wallets',
      title: 'Wallets Ledger',
      bnTitle: 'ওয়ালেট লেজার',
      description: 'Audit user balances, lifetime earnings, and direct adjustments.',
      bnDescription: 'আর্নারদের ব্যালেন্স নিরীক্ষণ ও সরাসরি ক্রেডিট/ডেবিট সমন্বয়।',
      icon: Wallet,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
      badge: `${Math.round(totalRewardsDistributed / 1000)}k ৳`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      actionLabel: 'Ledger',
      bnActionLabel: 'লেজার'
    },
    {
      id: 'payment_settings',
      title: 'MFS Gateways',
      bnTitle: 'পেমেন্ট গেটওয়ে',
      description: 'Configure official bKash, Nagad, Rocket & Bank accounts.',
      bnDescription: 'অফিসিয়াল বিকাশ, নগদ ও রকেট মার্চেন্ট/পার্সোনাল নম্বর।',
      icon: Sliders,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/60',
      badge: 'MFS',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      actionLabel: 'Setup',
      bnActionLabel: 'সেটআপ'
    },
    {
      id: 'memberships',
      title: 'Membership Tiers',
      bnTitle: 'মেম্বারশিপ প্যাকেজ',
      description: 'VIP subscription pricing, task limits, and multipliers.',
      bnDescription: 'সিলভার, গোল্ড ও প্রিমিয়াম প্ল্যান ফি এবং রিওয়ার্ড গুণক।',
      icon: Award,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60',
      badge: `${memberships.length || 4}`,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      actionLabel: 'Tiers',
      bnActionLabel: 'টায়ার'
    },
    {
      id: 'advertisements',
      title: 'Advertisements',
      bnTitle: 'বিজ্ঞাপন ক্যাম্পেইন',
      description: 'Create modal popup ads, banners, and external sponsor URLs.',
      bnDescription: 'ওয়েবসাইটে স্পন্সর পপআপ ব্যানার তৈরি ও এক্সটার্নাল লিংক।',
      icon: Megaphone,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/60',
      badge: `${advertisements.length}`,
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      actionLabel: 'Ads',
      bnActionLabel: 'বিজ্ঞাপন'
    },
    {
      id: 'banners',
      title: 'Hero Banners',
      bnTitle: 'ক্যারোসেল ব্যানার',
      description: 'Promotional graphic slides shown at the top of the user app.',
      bnDescription: 'ইউজার অ্যাপের উপরের স্লাইডার ব্যানার তৈরি ও পরিচালনা।',
      icon: ImageIcon,
      color: 'text-fuchsia-600 dark:text-fuchsia-400',
      bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200 dark:border-fuchsia-800/60',
      badge: `${banners.length}`,
      badgeColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      actionLabel: 'Banners',
      bnActionLabel: 'ব্যানার'
    },
    {
      id: 'referrals',
      title: 'Referral System',
      bnTitle: 'রেফারেল কমিশন',
      description: 'Set performance commission (%) and welcome bonus amounts.',
      bnDescription: 'রেফারেল কমিশন শতকরা হার ও সাইনআপ বোনাস টাকা।',
      icon: Share2,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/60',
      badge: '%',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      actionLabel: 'Rules',
      bnActionLabel: 'নিয়ম'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      bnTitle: 'লিডারবোর্ড মডারেশন',
      description: 'View top earners and toggle public ranking visibility.',
      bnDescription: 'শীর্ষ উপার্জনকারীদের তালিকা ও পাবলিক ভিজিবিলিটি।',
      icon: Trophy,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800/60',
      badge: 'Top',
      badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      actionLabel: 'Ranks',
      bnActionLabel: 'র‍্যাঙ্ক'
    },
    {
      id: 'notifications',
      title: 'Broadcast Notices',
      bnTitle: 'পুশ নোটিশ ও ঘোষণা',
      description: 'Publish instant announcements shown across the user app.',
      bnDescription: 'সকল ইউজারের অ্যাপে জরুরি ঘোষণা পাঠানো।',
      icon: Bell,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/60',
      badge: `${notices.length}`,
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      actionLabel: 'Notice',
      bnActionLabel: 'নোটিশ'
    },
    {
      id: 'support',
      title: 'Support Helpdesk',
      bnTitle: 'সাপোর্ট হেল্পডেস্ক',
      description: 'Threaded customer inquiry tickets with live replies.',
      bnDescription: 'ইউজারদের পাঠানো অভিযোগ বা সাহায্য বার্তা এবং রিপ্লাই প্রদান।',
      icon: Headphones,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60',
      badge: openSupportCount > 0 ? `${openSupportCount}` : '✓',
      badgeColor: openSupportCount > 0 ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      actionLabel: 'Helpdesk',
      bnActionLabel: 'হেল্পডেস্ক'
    },
    {
      id: 'website_settings',
      title: 'Website Config',
      bnTitle: 'ওয়েবসাইট সেটিংস',
      description: 'Site name, WhatsApp hotline, min withdrawal, maintenance.',
      bnDescription: 'ওয়েবসাইটের নাম, হোয়াটসঅ্যাপ হেল্পলাইন ও মিনিমাম উইথড্রয়াল।',
      icon: SettingsIcon,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800/60',
      badge: 'Config',
      badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      actionLabel: 'Settings',
      bnActionLabel: 'সেটিংস'
    },
    {
      id: 'admin_management',
      title: 'Staff Access',
      bnTitle: 'স্টাফ পারমিশন',
      description: 'Super Admin, Manager credentials, and access permissions.',
      bnDescription: 'ম্যানেজার ও মডারেটরদের ক্ষমতা ও অ্যাডমিন এক্সেস কন্ট্রোল।',
      icon: ShieldCheck,
      color: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
      badge: 'Roles',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      actionLabel: 'Staff',
      bnActionLabel: 'স্টাফ'
    },
    {
      id: 'activity_logs',
      title: 'Audit Logs',
      bnTitle: 'অ্যাক্টিভিটি লগ',
      description: 'Chronological timeline of all admin operations and changes.',
      bnDescription: 'সকল অ্যাডমিন কার্যক্রমের অপরিবর্তনযোগ্য হিস্টোরি ও লগ।',
      icon: FileText,
      color: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80',
      badge: `${auditLogs.length}`,
      badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
      actionLabel: 'Audit',
      bnActionLabel: 'অডিট'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. Responsive 4-Metric KPI Grid (2 cols on mobile, 4 on desktop, compact padding) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
        <div 
          onClick={() => onNavigate('users')}
          className="p-2.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block truncate">
              {language === 'bn' ? 'নিবন্ধিত ইউজার' : 'Registered Users'}
            </span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition shrink-0 ml-1" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-mono tabular-nums">
            {totalUsers}
          </p>
          <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">
            <span className="text-slate-500 truncate">
              <span className="font-semibold text-emerald-600">{activeUsers}</span> {language === 'bn' ? 'সক্রিয়' : 'active'}
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:underline text-[10px] sm:text-[11px] shrink-0 ml-1">
              {language === 'bn' ? 'তালিকা →' : 'View →'}
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('tasks')}
          className="p-2.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block truncate">
              {language === 'bn' ? 'লাইভ টাস্ক' : 'Active Tasks'}
            </span>
            <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition shrink-0 ml-1" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-mono tabular-nums">
            {totalTasks}
          </p>
          <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">
            <span className="text-slate-500 truncate">
              {language === 'bn' ? 'চালু আছে' : 'Live now'}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline text-[10px] sm:text-[11px] shrink-0 ml-1">
              {language === 'bn' ? 'এডিট →' : 'Edit →'}
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate(pendingSubmissions > 0 ? 'submissions' : 'withdrawals')}
          className="p-2.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block truncate">
              {language === 'bn' ? 'অনুমোদন দরকার' : 'Action Required'}
            </span>
            <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition shrink-0 ml-1" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 font-mono tabular-nums">
            {pendingSubmissions + pendingWithdrawals}
          </p>
          <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">
            <span className="text-slate-500 truncate">
              <span className="font-semibold text-amber-600">{pendingSubmissions}</span> {language === 'bn' ? 'প্রুফ' : 'proofs'}
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:underline text-[10px] sm:text-[11px] shrink-0 ml-1">
              {language === 'bn' ? 'চেক →' : 'Check →'}
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('wallets')}
          className="p-2.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block truncate">
              {language === 'bn' ? 'বিতরণকৃত রিওয়ার্ড' : 'Disbursed'}
            </span>
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition shrink-0 ml-1" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 font-mono tabular-nums truncate">
            {totalRewardsDistributed.toLocaleString()} ৳
          </p>
          <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">
            <span className="text-slate-500 truncate">
              {language === 'bn' ? 'পরিশোধিত' : 'Credited'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline text-[10px] sm:text-[11px] shrink-0 ml-1">
              {language === 'bn' ? 'লেজার →' : 'Ledger →'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Compact Responsive Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
        
        {/* Queue 1: Task Proof Review */}
        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-xs sm:text-xs text-slate-900 dark:text-white">
                {language === 'bn' ? 'টাস্ক প্রুফ যাচাই কিউ' : 'Task Proof Review Queue'}
              </h3>
              {pendingSubmissionsList.length > 0 && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {pendingSubmissionsList.length}
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigate('submissions')}
              className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
            >
              <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingSubmissionsList.length === 0 ? (
            <div className="py-4 sm:py-6 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                {language === 'bn' ? 'কোনো প্রুফ পেন্ডিং নেই' : 'All submissions verified'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingSubmissionsList.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:border-indigo-400 transition-all flex items-center justify-between gap-2 text-xs"
                >
                  <div 
                    onClick={() => onNavigate('submissions')}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 dark:text-white truncate text-xs hover:text-indigo-600">
                        {sub.taskTitle || 'Micro Task'}
                      </span>
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        +{sub.rewardAmount} ৳
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {sub.userName || sub.userId.slice(0, 6)} · {sub.proofType}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={async () => {
                        await onReviewSubmission(sub.id, 'approved', 'Quick verified from Dashboard');
                        showToast(`Approved (+${sub.rewardAmount} ৳) for ${sub.userName || 'Earner'}!`);
                      }}
                      className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[10px] sm:text-[11px] transition-colors shadow-xs"
                    >
                      ✓ {language === 'bn' ? 'অনুমোদন' : 'Approve'}
                    </button>
                    <button
                      onClick={() => onNavigate('submissions')}
                      className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-[10px] sm:text-[11px] transition-colors"
                    >
                      {language === 'bn' ? 'রিভিউ' : 'Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Queue 2: Cashout Approvals */}
        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="font-semibold text-xs sm:text-xs text-slate-900 dark:text-white">
                {language === 'bn' ? 'ক্যাশআউট অনুমোদন কিউ' : 'Cashout Approvals Queue'}
              </h3>
              {pendingWithdrawalsList.length > 0 && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {pendingWithdrawalsList.length}
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigate('withdrawals')}
              className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 transition-colors"
            >
              <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingWithdrawalsList.length === 0 ? (
            <div className="py-4 sm:py-6 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                {language === 'bn' ? 'কোনো ক্যাশআউট পেন্ডিং নেই' : 'All payouts cleared'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingWithdrawalsList.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:border-rose-400 transition-all flex items-center justify-between gap-2 text-xs"
                >
                  <div 
                    onClick={() => onNavigate('withdrawals')}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {w.netAmount || w.amount} ৳
                      </p>
                      <span className="font-semibold text-[9px] sm:text-[10px] uppercase px-1 py-0.2 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/60 shrink-0">
                        {w.method}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                      {w.accountNumber} · {w.userName || w.userId.slice(0, 6)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenPayoutModal(w.id)}
                      className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[10px] sm:text-[11px] transition-colors shadow-xs"
                    >
                      {language === 'bn' ? 'পে করুন' : 'Pay Out'}
                    </button>
                    <button
                      onClick={() => onNavigate('withdrawals')}
                      className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-[10px] sm:text-[11px] transition-colors"
                    >
                      {language === 'bn' ? 'ডিটেইলস' : 'Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. MASTER RESPONSIVE CSS GRID: 2 Columns on mobile (compact!), 3 on tablet, 4 on desktop */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'bn' ? 'সকল অ্যাডমিন কন্ট্রোল হাব' : 'Admin Control Center'}</span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
              {language === 'bn' 
                ? 'যেকোনো কার্ডে ক্লিক করে সরাসরি সেই পেইজে গিয়ে পরিবর্তন করুন।' 
                : 'Click any card to open that management workspace.'}
            </p>
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
            {adminControlCards.length} {language === 'bn' ? 'মডিউল' : 'Modules'}
          </span>
        </div>

        {/* Responsive CSS Grid (grid-cols-2 on mobile, grid-cols-3 on md, grid-cols-4 on xl) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3.5">
          {adminControlCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/80 dark:hover:border-indigo-500/80 hover:shadow-md transition-all duration-200 p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer"
              >
                {/* Card Top: Compact Icon + Badge */}
                <div className="space-y-1.5 sm:space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border ${card.bgColor} ${card.color} group-hover:scale-105 transition-transform shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                    </div>

                    {card.badge && (
                      <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${card.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Title and Short Description */}
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-tight">
                      {language === 'bn' ? card.bnTitle : card.title}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                      {language === 'bn' ? card.bnDescription : card.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Compact Interactive Button */}
                <div className="pt-2 sm:pt-2.5 mt-2 sm:mt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-0.5">
                    <span>{language === 'bn' ? card.bnActionLabel : card.actionLabel}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                    #{card.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Compact Fast Action Shortcut Bar */}
      <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-900 dark:text-white">
            {language === 'bn' ? 'শর্টকাট:' : 'Shortcuts:'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
          <button
            onClick={onOpenNewTask}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-medium text-[10px] sm:text-xs transition-colors shadow-2xs text-center"
          >
            + {language === 'bn' ? 'টাস্ক' : 'New Task'}
          </button>
          <button
            onClick={onOpenNewNotice}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-medium text-[10px] sm:text-xs transition-colors shadow-2xs text-center"
          >
            📢 {language === 'bn' ? 'ঘোষণা' : 'Notice'}
          </button>
          <button
            onClick={onOpenAdjustWallet}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-medium text-[10px] sm:text-xs transition-colors shadow-2xs text-center"
          >
            ± {language === 'bn' ? 'ব্যালেন্স' : 'Wallet'}
          </button>
          <button
            onClick={() => onNavigate('payment_settings')}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-medium text-[10px] sm:text-xs transition-colors shadow-2xs text-center"
          >
            💳 {language === 'bn' ? 'গেটওয়ে' : 'Gateways'}
          </button>
          <button
            onClick={async () => {
              if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে সকল ডেমো ও নমুনা ডাটা মুছে ফেলতে চান?' : 'Are you sure you want to remove all demo placeholder data?')) {
                await purgeDemoData();
                showToast(language === 'bn' ? 'সকল ডেমো ডাটা সফলভাবে মুছে ফেলা হয়েছে!' : 'All demo data removed successfully!');
              }
            }}
            className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-medium text-[10px] sm:text-xs transition-colors shadow-2xs text-center flex items-center justify-center gap-1"
            title="Permanently remove all demo/dummy records"
          >
            🗑️ {language === 'bn' ? 'ডেমো মুছুন' : 'Purge Demo'}
          </button>
        </div>
      </div>
    </div>
  );
};
