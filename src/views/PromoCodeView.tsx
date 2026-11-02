import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PromoCode, MembershipTier } from '../types';
import { 
  Ticket, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Copy, 
  Check, 
  X,
  Coins
} from 'lucide-react';

export const PromoCodeView: React.FC = () => {
  const { promoCodes, redeemPromoCode, createPromoCode, currentUser } = useApp();
  const { t } = useLanguage();

  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Code Form
  const [codeName, setCodeName] = useState('');
  const [rewardType, setRewardType] = useState<PromoCode['rewardType']>('balance');
  const [rewardValue, setRewardValue] = useState(50);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(500);
  const [eligibleTiers, setEligibleTiers] = useState<('all' | MembershipTier)[]>(['all']);
  const [description, setDescription] = useState('');

  const isAdmin = currentUser.role.includes('admin');

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = redeemPromoCode(inputCode.trim());
    setFeedback({
      text: res.message,
      isError: !res.success
    });

    if (res.success) {
      setInputCode('');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeName.trim()) return;

    createPromoCode({
      code: codeName.trim().toUpperCase(),
      rewardType,
      rewardValue: Number(rewardValue),
      expiresAt,
      usageLimit: Number(usageLimit),
      perUserLimit: 1,
      eligibleTiers,
      active: true,
      description: description.trim() || `Special promotional gift of ${rewardValue}`
    });

    setIsCreateOpen(false);
    setCodeName('');
    setDescription('');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Promotional Code & Voucher System</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Redeem official campaign vouchers or configure platform-wide promo bonuses with usage caps.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        )}
      </div>

      {/* User Redemption Box */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-500/10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Redeem Instant Voucher
          </span>
          <h2 className="mt-2 text-2xl font-black">
            Have a Promo or Referral Voucher?
          </h2>
          <p className="mt-1 text-xs text-indigo-100 leading-relaxed">
            Enter your voucher code below to claim direct coin balances, XP multipliers, or exclusive discounts.
          </p>

          <form onSubmit={handleRedeem} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME2026 or BOOST50"
              className="flex-1 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition"
            >
              Apply Voucher
            </button>
          </form>

          {feedback && (
            <div
              className={`mt-3 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                feedback.isError
                  ? 'bg-rose-950/70 border border-rose-500 text-rose-200'
                  : 'bg-emerald-950/70 border border-emerald-500 text-emerald-200'
              }`}
            >
              {feedback.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Platform Promo Codes List */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
          <span>Active Promotional Offers</span>
          <span className="text-xs text-slate-400 font-normal">Click code to copy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoCodes.map((promo) => {
            const hasUsed = promo.usedByUsers.includes(currentUser.id);
            const isExpired = new Date(promo.expiresAt) < new Date();

            return (
              <div
                key={promo.id}
                className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {promo.rewardType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      promo.active && !isExpired ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isExpired ? 'Expired' : promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Code Pill */}
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Copy promo code"
                    >
                      {copiedCode === promo.code ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {promo.description}
                  </p>

                  <div className="mt-4 space-y-1 text-[11px] text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Expires: {promo.expiresAt}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Used: {promo.timesUsed} / {promo.usageLimit} times</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{promo.rewardValue} Value</span>
                  </div>

                  {hasUsed ? (
                    <span className="text-[11px] font-bold text-slate-400">Redeemed</span>
                  ) : (
                    <button
                      onClick={() => setInputCode(promo.code)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Insert Code
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Create Promo Code Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              <span>Create New Promotional Code</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Code Name:
                </label>
                <input
                  type="text"
                  required
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value.toUpperCase())}
                  placeholder="e.g. EIDSPECIAL2026"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 font-mono uppercase font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reward Type:
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="balance">Direct Coin Balance</option>
                    <option value="bonus_xp">Bonus XP</option>
                    <option value="task_multiplier">Task Multiplier %</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reward Value:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rewardValue}
                    onChange={(e) => setRewardValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expiration Date:
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Global Usage Limit:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Special reward for community members..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
