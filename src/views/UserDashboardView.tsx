import React from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { getTaskTitle, getCategoryLabel, getProofTypeLabel } from '../services/taskTranslations';
import { 
  Coins, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  CheckSquare, 
  Award, 
  Share2, 
  Flame, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Smartphone,
  Download
} from 'lucide-react';

interface UserDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  const { fbUser, userProfile, wallet, tasks, submissions, claimDailyStreak, notices, advertisements, banners, settings } = useFirebase();
  const { t, language } = useLanguage();

  const userSubmissions = submissions.filter((s) => s.userId === fbUser?.uid);
  const approvedCount = userSubmissions.filter((s) => s.status === 'approved').length;
  const pendingCount = userSubmissions.filter((s) => s.status === 'pending').length;
  const availableTasksCount = tasks.filter((t) => t.status === 'active').length;

  const currentDayInCycle = ((userProfile?.streakDays || 1) % 7) || 1;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-3.5 sm:p-6 md:p-8 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Verified Micro-Rewards Platform
            </span>
            {userProfile?.membershipTier && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 border border-white/20 text-[10px] sm:text-xs font-bold uppercase">
                {userProfile.membershipTier} Member
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            Welcome back, {fbUser ? (userProfile?.fullName || fbUser.displayName || 'Earner') : 'Valued Earner'}!
          </h1>
          <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs md:text-sm text-indigo-100 leading-relaxed line-clamp-2 sm:line-clamp-none">
            Complete approved tasks, learn digital skills, test mobile apps, and withdraw verified rewards directly to your bKash, Nagad, or Bank account.
          </p>

          <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
            {fbUser ? (
              <button
                onClick={() => onNavigateTab('tasks')}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] sm:text-xs shadow-lg active:scale-95 transition"
              >
                <span>Browse Tasks ({availableTasksCount})</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] sm:text-xs shadow-lg active:scale-95 transition"
              >
                <span>Sign In (+50 ৳ Welcome)</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigateTab('apps')}
              className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-bold text-[11px] sm:text-xs backdrop-blur-md transition"
            >
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
              <span>Apps & Games (New)</span>
            </button>

            <button
              onClick={() => onNavigateTab('memberships')}
              className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[11px] sm:text-xs backdrop-blur-md transition"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>Membership</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Suspended Alert if applicable */}
      {userProfile?.status === 'suspended' && (
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-[11px] sm:text-xs">Account Verification Hold</p>
              <p className="text-[10px] sm:text-[11px] text-rose-600 dark:text-rose-300">Your account payouts are paused for routine verification.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('support')}
            className="px-2.5 py-1 rounded-lg sm:rounded-xl bg-rose-600 text-white font-bold text-[10px] sm:text-xs shrink-0"
          >
            Contact
          </button>
        </div>
      )}

      {/* Primary 10 Financial KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5">
        
        {/* 1. Total Available Balance */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Available Balance</span>
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </div>
          <p className="text-base sm:text-2xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2">
            {(wallet?.availableBalance || 0).toLocaleString()} ৳
          </p>
          <div className="mt-1 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-emerald-600 font-semibold">Ready</span>
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Withdraw &rarr;
            </button>
          </div>
        </div>

        {/* 2. Pending Rewards */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Pending Rewards</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </div>
          <p className="text-base sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 sm:mt-2">
            {(wallet?.pendingBalance || 0).toLocaleString()} ৳
          </p>
          <span className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-slate-400">{pendingCount} in queue</span>
        </div>

        {/* 3. Approved Rewards */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Approved Rewards</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
          </div>
          <p className="text-base sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2">
            {approvedCount} Tasks
          </p>
          <span className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-slate-400">Verified Quality</span>
        </div>

        {/* 4. Lifetime Total Earnings */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Total Earnings</span>
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
          </div>
          <p className="text-base sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 sm:mt-2">
            {(wallet?.lifetimeEarnings || 0).toLocaleString()} ৳
          </p>
          <span className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-slate-400">Escrow backed</span>
        </div>

        {/* 5. Completed Tasks */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Tasks</span>
          <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1">{approvedCount}</p>
          <span className="text-[9px] sm:text-[10px] text-slate-500">All categories</span>
        </div>

        {/* 6. Available Tasks */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Tasks</span>
          <p className="text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{availableTasksCount}</p>
          <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold">Active now</span>
        </div>

        {/* 7. Membership Status */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Tier Status</span>
          <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white capitalize mt-1">
            {userProfile?.membershipTier || 'Free'}
          </p>
          <button
            onClick={() => onNavigateTab('memberships')}
            className="text-[9px] sm:text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Upgrade &rarr;
          </button>
        </div>

        {/* 8. Daily Check-in Streak */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Streak</span>
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-base sm:text-xl font-black text-orange-600 dark:text-orange-400 mt-1">
            {userProfile?.streakDays || 1} Days
          </p>
          {userProfile?.streakClaimedToday ? (
            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold">Claimed</span>
          ) : (
            <button
              onClick={claimDailyStreak}
              className="text-[9px] sm:text-[10px] text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Claim +{Math.min(currentDayInCycle * 10, 80)} ৳ &rarr;
            </button>
          )}
        </div>

      </div>

      {/* Featured Tasks Carousel & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6">
        
        {/* Featured Tasks (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs space-y-2.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white">
                Featured Verified Micro-Tasks
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">Sponsored campaigns funded by verified advertisers</p>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 sm:gap-1"
            >
              <span>View All ({tasks.length})</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => onNavigateTab('tasks')}
                className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-800 transition cursor-pointer flex items-center justify-between gap-2.5 sm:gap-4 text-xs"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {task.imageUrl && (
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {getCategoryLabel(task.category || task.taskType, language)}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5 sm:mt-1 truncate group-hover:text-indigo-600 transition">
                      {getTaskTitle(task, language)}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                      Est. {Math.round(task.minTimeOnTaskSeconds / 60)} min • {language === 'bn' ? 'প্রমাণ:' : 'Proof:'} {getProofTypeLabel(task.proofType, language)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm">+{task.rewardAmount} ৳</span>
                  <span className="block text-[9px] sm:text-[10px] text-slate-400">+{task.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Banners (1 Col) */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Official Notices</span>
              <span className="text-[9px] sm:text-[10px] text-indigo-600 font-semibold">Live Broadcast</span>
            </div>

            <div className="mt-2.5 sm:mt-4 space-y-2 sm:space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    {n.category}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{n.title}</h5>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>100% Escrow Protection</span>
            </span>
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 leading-relaxed">
              All rewards are pre-deposited in escrow by brand advertisers. No members pay each other.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
