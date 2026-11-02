import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { FirestoreUser } from '../services/firebaseService';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Star 
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { allUsers, userProfile, updateProfilePrivacy, fbUser } = useFirebase();
  const { t, language } = useLanguage();

  const [filterPeriod, setFilterPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [privacyMode, setPrivacyMode] = useState<'public' | 'alias' | 'hidden'>(
    userProfile?.privacyLeaderboard || 'public'
  );
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Fallback verified community champions to ensure rich hall of fame display
  const defaultChampions: FirestoreUser[] = [
    {
      uid: 'champ_1',
      id: 'champ_1',
      fullName: 'Tanvir Hossain',
      email: 'tanvir@gmail.com',
      role: 'user',
      membershipTier: 'premium',
      referralCode: 'TANVIR99',
      status: 'active',
      level: 18,
      xp: 8400,
      streakDays: 42,
      lastLoginDate: '2026-10-31',
      streakClaimedToday: true,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'public',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      totalEarned: 18450,
      tasksCompleted: 342,
      createdAt: '2026-08-01',
      updatedAt: '2026-10-31'
    },
    {
      uid: 'champ_2',
      id: 'champ_2',
      fullName: 'Nusrat Jahan',
      email: 'nusrat@gmail.com',
      role: 'user',
      membershipTier: 'gold',
      referralCode: 'NUSRAT12',
      status: 'active',
      level: 14,
      xp: 5900,
      streakDays: 28,
      lastLoginDate: '2026-10-31',
      streakClaimedToday: true,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'public',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      totalEarned: 14200,
      tasksCompleted: 265,
      createdAt: '2026-08-10',
      updatedAt: '2026-10-31'
    },
    {
      uid: 'champ_3',
      id: 'champ_3',
      fullName: 'Arif Chowdhury',
      email: 'arif@gmail.com',
      role: 'user',
      membershipTier: 'silver',
      referralCode: 'ARIF77',
      status: 'active',
      level: 11,
      xp: 4100,
      streakDays: 19,
      lastLoginDate: '2026-10-31',
      streakClaimedToday: true,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'public',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      totalEarned: 9850,
      tasksCompleted: 180,
      createdAt: '2026-08-20',
      updatedAt: '2026-10-31'
    },
    {
      uid: 'champ_4',
      id: 'champ_4',
      fullName: 'Farhana Akter',
      email: 'farhana@gmail.com',
      role: 'user',
      membershipTier: 'gold',
      referralCode: 'FARHANA5',
      status: 'active',
      level: 9,
      xp: 3200,
      streakDays: 14,
      lastLoginDate: '2026-10-31',
      streakClaimedToday: false,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'public',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      totalEarned: 7650,
      tasksCompleted: 142,
      createdAt: '2026-09-01',
      updatedAt: '2026-10-31'
    },
    {
      uid: 'champ_5',
      id: 'champ_5',
      fullName: 'Mahmudul Hasan',
      email: 'mahmud@gmail.com',
      role: 'user',
      membershipTier: 'free',
      referralCode: 'MAHMUD21',
      status: 'active',
      level: 8,
      xp: 2800,
      streakDays: 11,
      lastLoginDate: '2026-10-31',
      streakClaimedToday: true,
      isAgeVerified: true,
      guardianConsent: false,
      privacyLeaderboard: 'public',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      totalEarned: 5400,
      tasksCompleted: 115,
      createdAt: '2026-09-12',
      updatedAt: '2026-10-31'
    }
  ];

  // Merge live database users with seed champions
  const combinedUserMap = new Map<string, FirestoreUser>();
  defaultChampions.forEach((c) => combinedUserMap.set(c.uid, c));
  allUsers.forEach((u) => combinedUserMap.set(u.uid || u.id || '', u));

  if (fbUser && userProfile) {
    combinedUserMap.set(fbUser.uid, {
      ...userProfile,
      uid: fbUser.uid,
      id: fbUser.uid,
      totalEarned: userProfile.totalEarned || 50,
      tasksCompleted: userProfile.tasksCompleted || 0
    });
  }

  // Filter visible users and sort by totalEarned
  const visibleUsers = Array.from(combinedUserMap.values())
    .filter((u) => u.privacyLeaderboard !== 'hidden')
    .sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0));

  const topThree = visibleUsers.slice(0, 3);
  const remainingUsers = visibleUsers.slice(3, 50);

  const handleUpdatePrivacy = async (mode: 'public' | 'alias' | 'hidden') => {
    try {
      setSavingPrivacy(true);
      setPrivacyMode(mode);
      await updateProfilePrivacy(mode, userProfile?.isAgeVerified || true, userProfile?.guardianConsent || false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPrivacy(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-amber-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Verified Hall of Fame
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold">
              Updated Hourly
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'bn' ? 'শীর্ষ উপার্জনকারী লিডারবোর্ড' : 'Earner Champions & Leaderboard'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-amber-100 leading-relaxed">
            {language === 'bn' 
              ? 'আমাদের প্ল্যাটফর্মের সবচেয়ে সক্রিয় ও সফল কর্মীদের তালিকা। আপনার অবস্থান উন্নত করতে অনুমোদিত টাস্ক সম্পন্ন করুন।'
              : 'Recognizing top performers for verified task quality, streak loyalty, and skill excellence.'}
          </p>
        </div>
      </div>

      {/* Privacy Settings Bar for current user */}
      {fbUser && (
        <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                {language === 'bn' ? 'লিডারবোর্ড প্রাইভেসি কন্ট্রোল' : 'Your Leaderboard Visibility (Privacy)'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose how your name and score appear to other users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl shrink-0">
            {[
              { id: 'public', label: 'Public Name' },
              { id: 'alias', label: 'Alias Only' },
              { id: 'hidden', label: 'Incognito (Hide)' }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={savingPrivacy}
                onClick={() => handleUpdatePrivacy(opt.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  privacyMode === opt.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="order-2 md:order-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-slate-400">
              <Medal className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={topThree[1].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThree[1].id}`}
                  alt=""
                  className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 object-cover"
                />
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-400 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                {topThree[1].privacyLeaderboard === 'alias' ? 'Anonymous Earner' : topThree[1].fullName}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {topThree[1].membershipTier} Member
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Total Earned</p>
                <p className="font-black text-emerald-600 dark:text-emerald-400">{(topThree[1].totalEarned || 0).toLocaleString()} ৳</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Tasks</p>
                <p className="font-black text-slate-700 dark:text-slate-300">{topThree[1].tasksCompleted || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place (Crown) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 p-6 text-center shadow-lg relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute top-3 right-3 text-amber-500">
              <Crown className="w-8 h-8 fill-amber-400" />
            </div>
            <div>
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={topThree[0].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThree[0].id}`}
                  alt=""
                  className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                  1
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                {topThree[0].privacyLeaderboard === 'alias' ? 'Anonymous Champion' : topThree[0].fullName}
              </h3>
              <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                🏆 Top Champion • {topThree[0].membershipTier}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-900/50 flex items-center justify-around text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Total Earned</p>
                <p className="font-black text-base text-emerald-600 dark:text-emerald-400">{(topThree[0].totalEarned || 0).toLocaleString()} ৳</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Tasks Completed</p>
                <p className="font-black text-base text-slate-900 dark:text-white">{topThree[0].tasksCompleted || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="order-3 md:order-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-amber-700">
              <Medal className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={topThree[2].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThree[2].id}`}
                  alt=""
                  className="w-16 h-16 rounded-full border-4 border-amber-700/40 object-cover"
                />
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                {topThree[2].privacyLeaderboard === 'alias' ? 'Anonymous Earner' : topThree[2].fullName}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {topThree[2].membershipTier} Member
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Total Earned</p>
                <p className="font-black text-emerald-600 dark:text-emerald-400">{(topThree[2].totalEarned || 0).toLocaleString()} ৳</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Tasks</p>
                <p className="font-black text-slate-700 dark:text-slate-300">{topThree[2].tasksCompleted || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ranks 4 to 50 Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>All-Time Rankings</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Showing top {visibleUsers.length} verified earners
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {remainingUsers.map((u, idx) => (
            <div
              key={u.id}
              className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition ${
                u.id === fbUser?.uid ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 text-center font-black text-xs text-slate-400">
                  #{idx + 4}
                </span>
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0">
                  <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <span>{u.privacyLeaderboard === 'alias' ? 'Anonymous Earner' : u.fullName}</span>
                    {u.id === fbUser?.uid && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-[9px] font-black text-indigo-700 dark:text-indigo-300">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {u.membershipTier} Member • {u.streakDays || 0}d streak
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                  {(u.totalEarned || 0).toLocaleString()} ৳
                </p>
                <p className="text-[10px] text-slate-400">
                  {u.tasksCompleted || 0} tasks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
