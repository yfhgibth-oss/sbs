import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle,
  Coins,
  History,
  Info
} from 'lucide-react';

interface WalletWithdrawalViewProps {
  onOpenAuth: () => void;
}

export const WalletWithdrawalView: React.FC<WalletWithdrawalViewProps> = ({ onOpenAuth }) => {
  const { 
    fbUser, 
    userProfile, 
    wallet, 
    withdrawals, 
    requestWithdrawal, 
    settings 
  } = useFirebase();
  const { t, language } = useLanguage();

  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', branchName: '', routingNumber: '' });
  const [amount, setAmount] = useState<number>(200);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Available balance
  const availableBalance = wallet?.availableBalance ?? (userProfile?.balance || 0);
  const pendingBalance = wallet?.pendingBalance ?? 0;
  const lifetimeEarnings = wallet?.lifetimeEarnings ?? (userProfile?.totalEarned || 0);
  const totalWithdrawn = wallet?.totalWithdrawn ?? (userProfile?.totalWithdrawn || 0);

  const minWithdrawal = settings?.minWithdrawal || settings?.minimumWithdrawal || 100;
  const maxWithdrawal = settings?.maxWithdrawal || 25000;

  // Filter withdrawals for current user
  const userWithdrawals = fbUser 
    ? withdrawals.filter((w) => w.userId === fbUser.uid) 
    : [];

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbUser) {
      onOpenAuth();
      return;
    }

    if (!accountNumber.trim()) {
      setFeedback({ text: 'Please enter a valid mobile number or bank account number.', isError: true });
      return;
    }

    if (amount < minWithdrawal) {
      setFeedback({ text: `Minimum withdrawal amount is ${minWithdrawal} ৳.`, isError: true });
      return;
    }

    if (amount > maxWithdrawal) {
      setFeedback({ text: `Maximum single withdrawal is ${maxWithdrawal} ৳.`, isError: true });
      return;
    }

    if (amount > availableBalance) {
      setFeedback({ text: `Insufficient balance! You have ${availableBalance} ৳ available.`, isError: true });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const fullAccountStr = method === 'bank' 
        ? `${bankDetails.bankName} | A/C: ${accountNumber} | Branch: ${bankDetails.branchName}` 
        : accountNumber.trim();

      const res = await requestWithdrawal(method, fullAccountStr, Number(amount));
      setFeedback({ text: res.message, isError: !res.success });
      if (res.success) {
        setAccountNumber('');
        setBankDetails({ bankName: '', branchName: '', routingNumber: '' });
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Withdrawal request failed. Please try again.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured Escrow Wallet
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold">
              24-48h Guaranteed Payouts
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'bn' ? 'ওয়ালেট ও টাকা উত্তোলন' : 'Wallet & Instant Payouts'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {language === 'bn' 
              ? 'আপনার যাচাইকৃত কাজের উপার্জিত অর্থ বিকাশ, নগদ, রকেট অথবা সরাসরি ব্যাংক একাউন্টে উত্তোলন করুন।'
              : 'Withdraw your verified task rewards seamlessly to bKash, Nagad, Rocket, or direct Bank transfer.'}
          </p>
        </div>
      </div>

      {/* 4 Balances Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              {language === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Available Balance'}
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {availableBalance.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">৳</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'যেকোনো সময় উত্তোলনযোগ্য' : 'Ready for withdrawal'}
          </p>
        </div>

        {/* Pending Balance */}
        <div className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {language === 'bn' ? 'অপেক্ষমাণ পুরস্কার' : 'Pending Rewards'}
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pendingBalance.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">৳</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'যাচাই শেষে যোগ হবে' : 'In review verification'}
          </p>
        </div>

        {/* Lifetime Earned */}
        <div className="p-5 rounded-3xl bg-indigo-500/10 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              {language === 'bn' ? 'মোট আয়' : 'Lifetime Earned'}
            </span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {lifetimeEarnings.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">৳</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'সর্বমোট অর্জিত টাকা' : 'All-time approved tasks'}
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className="p-5 rounded-3xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              {language === 'bn' ? 'মোট উত্তোলন' : 'Total Withdrawn'}
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalWithdrawn.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">৳</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'সফল পেমেন্ট সম্পন্ন' : 'Successfully disbursed'}
          </p>
        </div>

      </div>

      {/* Main Grid: Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Withdrawal Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'নতুন উত্তোলনের আবেদন' : 'Request Payout'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'নির্দিষ্ট মোবাইল ব্যাংকিং সিলেক্ট করুন' : 'Select preferred gateway & account'}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Min: {minWithdrawal} ৳
            </span>
          </div>

          {!fbUser ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <Wallet className="w-12 h-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  {language === 'bn' ? 'উত্তোলন করতে লগইন করুন' : 'Authentication Required'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {language === 'bn' 
                    ? 'টাকা উত্তোলন ও রিয়েল-টাইম ওয়ালেট পরিচালনা করতে আপনার অ্যাকাউন্টে সাইন ইন করুন।'
                    : 'Sign in to access your personal wallet and request secure withdrawals.'}
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                {language === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Gateway'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'bkash', name: 'bKash', color: 'border-pink-500 text-pink-600 bg-pink-50/50 dark:bg-pink-950/20' },
                    { id: 'nagad', name: 'Nagad', color: 'border-orange-500 text-orange-600 bg-orange-50/50 dark:bg-orange-950/20' },
                    { id: 'rocket', name: 'Rocket', color: 'border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20' },
                    { id: 'bank', name: 'Bank Wire', color: 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20' }
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setMethod(gw.id as any)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        method === gw.id
                          ? `${gw.color} border-2 font-black shadow-sm`
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {method === 'bank' 
                    ? (language === 'bn' ? 'ব্যাংক একাউন্ট নম্বর' : 'Bank Account Number')
                    : (language === 'bn' ? `${method.toUpperCase()} পার্সোনাল নম্বর` : `${method.toUpperCase()} Personal Number`)}
                </label>
                <input
                  type="text"
                  required
                  placeholder={method === 'bank' ? 'e.g. 2050123456789' : '017XXXXXXXX'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Extra Bank Details if Bank selected */}
              {method === 'bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Islami Bank / DBBL"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dhanmondi Branch"
                      value={bankDetails.branchName}
                      onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? 'উত্তোলনের পরিমাণ (টাকা)' : 'Withdrawal Amount (BDT)'}
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Max: {availableBalance} ৳
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={minWithdrawal}
                    max={Math.min(availableBalance, maxWithdrawal)}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-black text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    BDT ৳
                  </span>
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[100, 250, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={amt > availableBalance}
                      onClick={() => setAmount(amt)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-[11px] font-bold disabled:opacity-40 transition"
                    >
                      +{amt} ৳
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance)}
                    className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div className={`p-4 rounded-2xl flex items-start gap-2 text-xs font-semibold ${
                  feedback.isError 
                    ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-200 dark:border-rose-900' 
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                }`}>
                  {feedback.isError ? <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || availableBalance < minWithdrawal}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <span>Confirm & Withdraw {amount} ৳</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Zero-Ponzi & Security Disclosure */}
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Statutory Guarantee:</strong> Task rewards are backed 1:1 by advertiser campaign deposits. No interest, compounding, or unearned yield is offered. Withdrawals are processed manually via authorized merchant APIs within 24–48 hours.
                </p>
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Withdrawal History (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'উত্তোলন হিস্টোরি' : 'Payout History'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {userWithdrawals.length} Records
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {userWithdrawals.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No payout requests yet. Complete tasks to earn and withdraw!
              </div>
            ) : (
              userWithdrawals.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase">
                        {item.method}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {item.accountNumber}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>ID: #{item.id.slice(-6).toUpperCase()}</span>
                      {item.trxReference && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          Trx: {item.trxReference}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-black text-xs text-slate-900 dark:text-white">
                      {item.amount.toLocaleString()} ৳
                    </p>
                    <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
