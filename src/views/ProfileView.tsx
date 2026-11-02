import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Withdrawal } from '../types';
import { 
  UserCircle, 
  Award, 
  Flame, 
  ShieldCheck, 
  Lock, 
  Download, 
  Trash2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Sparkles,
  Eye,
  Bell,
  Scale
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    badges, 
    requestWithdrawal, 
    withdrawals,
    verifyAgeAndConsent,
    updatePrivacySettings,
    exportUserData,
    requestAccountDeletion
  } = useApp();
  const { t, language } = useLanguage();

  // Withdrawal form state
  const [wthMethod, setWthMethod] = useState<Withdrawal['method']>('bkash');
  const [wthAccount, setWthAccount] = useState('01712-345678');
  const [wthAmount, setWthAmount] = useState<number>(300);
  const [wthFeedback, setWthFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Privacy settings state
  const [leaderboardPrivacy, setLeaderboardPrivacy] = useState(currentUser.privacyLeaderboard);
  const [notifPrefs, setNotifPrefs] = useState(currentUser.notificationPrefs);
  const [isAgeVerified, setIsAgeVerified] = useState(currentUser.isAgeVerified);
  const [guardianConsent, setGuardianConsent] = useState(currentUser.guardianConsent);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestWithdrawal(wthMethod, wthAccount, Number(wthAmount));
    setWthFeedback({
      text: res.message,
      isError: !res.success
    });
  };

  const handleSavePrivacy = () => {
    updatePrivacySettings(leaderboardPrivacy, notifPrefs);
    verifyAgeAndConsent(isAgeVerified, guardianConsent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Profile Header & Level Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-sm">
              L{currentUser.level}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold text-xs uppercase">
                {currentUser.membershipTier} Member
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">{currentUser.email} • Registered {currentUser.registeredAt}</p>

            {/* Level XP Progress */}
            <div className="mt-3 space-y-1 max-w-sm">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Level {currentUser.level} Advancement</span>
                <span className="text-indigo-600 dark:text-indigo-400">{currentUser.xp} / {currentUser.xpNextLevel} XP</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${Math.min((currentUser.xp / currentUser.xpNextLevel) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Balance & Streak overview */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Available Balance</span>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">{currentUser.balance} ৳</p>
            <span className="text-[10px] text-slate-400">Total: {currentUser.totalEarned} ৳</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">Daily Streak</span>
            <p className="text-2xl font-black text-orange-900 dark:text-orange-200 mt-1 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
              {currentUser.streakDays}d
            </p>
            <span className="text-[10px] text-slate-400">Best: {currentUser.longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Main Profile 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Badges & Financial Withdrawal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Achievement Badges Showcase */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Achievement Badges & Permanent Perks</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlock badges through quality task completions to receive lifetime reward multipliers.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => {
                const isUnlocked = currentUser.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                      isUnlocked
                        ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-60'
                    }`}
                  >
                    <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                      {b.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {language === 'bn' ? b.nameBn : b.name}
                        </h4>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          isUnlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {language === 'bn' ? b.descriptionBn : b.description}
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Perk: {language === 'bn' ? b.perkBn : b.perk}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Withdrawal Form & History */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Withdraw Verified Earnings</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero withdrawal fee for Platinum members. Standard 2% fee applies to lower tiers. Minimum 200 BDT.
            </p>

            <form onSubmit={handleWithdrawalSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payout Channel:
                  </label>
                  <select
                    value={wthMethod}
                    onChange={(e) => setWthMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="bkash">bKash Personal</option>
                    <option value="nagad">Nagad Personal</option>
                    <option value="rocket">Rocket DBBL</option>
                    <option value="bank">Direct Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account / Wallet Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={wthAccount}
                    onChange={(e) => setWthAccount(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (BDT):
                  </label>
                  <input
                    type="number"
                    min="200"
                    step="50"
                    value={wthAmount}
                    onChange={(e) => setWthAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {wthFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    wthFeedback.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{wthFeedback.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Est. Net Receive: <strong className="text-slate-900 dark:text-white">{wthAmount - Math.round(wthAmount * (currentUser.membershipTier === 'platinum' ? 0 : 0.02))} ৳</strong>
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition"
                >
                  Confirm Payout Request
                </button>
              </div>
            </form>

            {/* Withdrawal records table */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Recent Withdrawal Transactions
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="py-2">Method</th>
                      <th className="py-2">Account</th>
                      <th className="py-2">Net Amount</th>
                      <th className="py-2">Trx Reference</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {userWithdrawals.map((w) => (
                      <tr key={w.id}>
                        <td className="py-2 font-bold uppercase">{w.method}</td>
                        <td className="py-2 font-mono text-[11px] text-slate-500">{w.accountNo}</td>
                        <td className="py-2 font-extrabold text-slate-900 dark:text-white">{w.netAmount} ৳</td>
                        <td className="py-2 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{w.trxId}</td>
                        <td className="py-2 text-right">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Privacy, Age Consent & Data Export */}
        <div className="space-y-6">
          
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Privacy & Legal Safeguards</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control public visibility, guardian consent, and statutory data protections.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              
              {/* Leaderboard Privacy */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Public Leaderboard Visibility:
                </label>
                <select
                  value={leaderboardPrivacy}
                  onChange={(e) => setLeaderboardPrivacy(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="public">Show Full Real Name & Avatar</option>
                  <option value="alias">Show Anonymous Alias / Initials</option>
                  <option value="hidden">Hide Completely from Public Leaderboard</option>
                </select>
              </div>

              {/* Age Verification & Guardian Consent */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Age Eligibility & Minor Protection
                </span>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgeVerified}
                    onChange={(e) => setIsAgeVerified(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    I certify that I am 18 years of age or older, legally eligible to perform digital micro-tasks.
                  </span>
                </label>

                {!isAgeVerified && (
                  <label className="flex items-start gap-2 cursor-pointer pt-1 border-t border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={guardianConsent}
                      onChange={(e) => setGuardianConsent(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug font-semibold">
                      Under 18: I have verified written legal guardian consent on record.
                    </span>
                  </label>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Notification Channels:
                </span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifPrefs.rewards}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, rewards: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Reward and task approval notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifPrefs.missions}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, missions: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Mission launch alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifPrefs.announcements}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, announcements: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Security & policy announcements</span>
                </label>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                  Settings Saved Successfully!
                </div>
              )}

              <button
                type="button"
                onClick={handleSavePrivacy}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
              >
                Save Preferences
              </button>

              {/* GDPR Data Export & Account Deletion */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={exportUserData}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.dataExport}</span>
                </button>

                <button
                  type="button"
                  onClick={requestAccountDeletion}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-700 dark:text-rose-400 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.deleteAccount}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
