import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Sliders, 
  Plus, 
  Check, 
  X, 
  Search, 
  Save, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Building2,
  DollarSign
} from 'lucide-react';
import { 
  FirestoreUser, 
  FirestoreWithdrawal, 
  FirestoreSettings 
} from '../../services/firebaseService';

interface WalletsLedgerSectionProps {
  allUsers: FirestoreUser[];
  language: 'bn' | 'en';
  onOpenAdjustWallet: (uid?: string) => void;
}

export const WalletsLedgerSection: React.FC<WalletsLedgerSectionProps> = ({
  allUsers,
  language,
  onOpenAdjustWallet
}) => {
  const [search, setSearch] = useState('');

  const filteredUsers = allUsers.filter((u) => 
    !search || 
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.mobileNumber && u.mobileNumber.includes(search)) ||
    u.uid.toLowerCase().includes(search.toLowerCase())
  );

  const totalPlatformBalance = allUsers.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalEarned = allUsers.reduce((acc, u) => acc + (u.totalEarned || 0), 0);
  const totalWithdrawn = allUsers.reduce((acc, u) => acc + (u.totalWithdrawn || 0), 0);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'bn' ? 'ইউজার ওয়ালেট লেজার ও এসক্রো ব্যালেন্স' : 'User Wallets Ledger & Escrow'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'ইউজারদের বর্তমান ব্যালেন্স, মোট ইনকাম ও উইথড্রয়াল হিস্টোরি নিরীক্ষণ ও সরাসরি ক্রেডিট/ডেবিট সমন্বয়।' 
              : 'Audit user balances, lifetime earnings, and execute manual credit or debit adjustments.'}
          </p>
        </div>

        <button
          onClick={() => onOpenAdjustWallet()}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{language === 'bn' ? 'ম্যানুয়াল ব্যালেন্স সমন্বয়' : 'Manual Adjustment'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5 pt-1">
        <div className="p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'মোট ইউজারের ওয়ালেট ব্যালেন্স' : 'Current User Liabilities'}
          </span>
          <p className="text-base sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {totalPlatformBalance.toLocaleString()} ৳
          </p>
        </div>

        <div className="p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'সর্বমোট অর্জিত আয়' : 'Lifetime Earnings Released'}
          </span>
          <p className="text-base sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {totalEarned.toLocaleString()} ৳
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'পরিশোধিত ক্যাশআউট' : 'Total Withdrawn to Date'}
          </span>
          <p className="text-base sm:text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {totalWithdrawn.toLocaleString()} ৳
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={language === 'bn' ? 'ইউজার নাম বা মোবাইল খুঁজুন...' : 'Search user or phone...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-7 sm:pl-8 pr-2.5 sm:pr-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[500px]">
        <table className="w-full text-left text-[11px] sm:text-xs">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Earner Profile</th>
              <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Available Balance</th>
              <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Lifetime Earned</th>
              <th className="py-2 sm:py-2.5 px-2.5 sm:px-3">Withdrawn</th>
              <th className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-right">Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                  {language === 'bn' ? 'কোনো ওয়ালেট পাওয়া যায়নি' : 'No user wallets matched.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2 sm:py-3 px-2.5 sm:px-3">
                    <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-none">{u.fullName || 'User'}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">#{u.uid.slice(0, 8)} · {u.email}</p>
                  </td>
                  <td className="py-2 sm:py-3 px-2.5 sm:px-3">
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {(u.balance ?? 50).toLocaleString()} ৳
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2.5 sm:px-3 font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {(u.totalEarned ?? 50).toLocaleString()} ৳
                  </td>
                  <td className="py-2 sm:py-3 px-2.5 sm:px-3 font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {(u.totalWithdrawn ?? 0).toLocaleString()} ৳
                  </td>
                  <td className="py-2 sm:py-3 px-2.5 sm:px-3 text-right">
                    <button
                      onClick={() => onOpenAdjustWallet(u.uid)}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[10px] sm:text-[11px] transition-colors"
                    >
                      ± {language === 'bn' ? 'সমন্বয়' : 'Adjust'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface WithdrawalsSectionProps {
  withdrawals: FirestoreWithdrawal[];
  language: 'bn' | 'en';
  onOpenPayoutModal: (id: string) => void;
  onRejectWithdrawal: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const WithdrawalsSection: React.FC<WithdrawalsSectionProps> = ({
  withdrawals,
  language,
  onOpenPayoutModal,
  onRejectWithdrawal,
  showToast
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('pending');

  const pendingList = withdrawals.filter((w) => w.status === 'pending');
  const paidList = withdrawals.filter((w) => w.status === 'paid');
  const rejectedList = withdrawals.filter((w) => w.status === 'rejected');

  const filtered = withdrawals.filter((w) => filter === 'all' || w.status === filter);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400" />
            <span>{language === 'bn' ? 'ক্যাশআউট ও উত্তোলন অনুমোদন' : 'Withdrawals & Payout Approvals'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'বিকাশ, নগদ, রকেট বা ব্যাংক একাউন্টে ব্যবহারকারীদের টাকা পাঠিয়ে ট্রানজ্যাকশন আইডি যুক্ত করুন।' 
              : 'Approve pending cashouts, disburse via MFS gateways, and provide official TrxID reference.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-0.5 sm:p-1 rounded-lg border border-slate-200 dark:border-slate-700/80 w-fit overflow-x-auto">
        {[
          { id: 'pending', label: language === 'bn' ? 'পেন্ডিং' : 'Pending', count: pendingList.length, color: 'text-rose-600' },
          { id: 'paid', label: language === 'bn' ? 'পরিশোধিত' : 'Paid', count: paidList.length, color: 'text-emerald-600' },
          { id: 'rejected', label: language === 'bn' ? 'বাতিল' : 'Rejected', count: rejectedList.length, color: 'text-slate-500' },
          { id: 'all', label: language === 'bn' ? 'সকল' : 'All', count: withdrawals.length, color: 'text-slate-600' }
        ].map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium transition-colors ${
                active 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full ${active ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-200/60 dark:bg-slate-800/80'} ${tab.color}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards List */}
      <div className="space-y-2 sm:space-y-3">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 space-y-1">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-medium text-slate-600 dark:text-slate-400">
              {language === 'bn' ? 'কোনো ক্যাশআউট অনুরোধ নেই' : 'No payout requests in this filter.'}
            </p>
          </div>
        ) : (
          filtered.map((w) => (
            <div
              key={w.id}
              className="p-2.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={`text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md ${
                    w.status === 'paid' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60' 
                      : w.status === 'pending' 
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {w.status}
                  </span>
                  <span className="font-bold text-[11px] sm:text-xs uppercase text-slate-900 dark:text-white tracking-wide">
                    {w.method}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {w.accountNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500">
                  <span>{language === 'bn' ? 'ইউজার:' : 'User:'} <strong className="text-slate-800 dark:text-slate-200 font-medium">{w.userName || w.userId.slice(0, 8)}</strong></span>
                  <span>·</span>
                  <span>{w.requestedAt ? w.requestedAt.substring(0, 16) : 'Today'}</span>
                  {w.transactionReference && (
                    <>
                      <span>·</span>
                      <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                        TrxRef: {w.transactionReference}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <p className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {w.netAmount || w.amount} ৳
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-400">
                    Fee: {w.fee || 0} ৳
                  </span>
                </div>

                {w.status === 'pending' ? (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <button
                      onClick={() => onOpenPayoutModal(w.id)}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[10px] sm:text-xs transition-colors shadow-xs"
                    >
                      {language === 'bn' ? 'অনুমোদন ও পে' : 'Approve & Pay'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Reject withdrawal and refund to balance?')) {
                          await onRejectWithdrawal(w.id);
                          showToast('Withdrawal rejected and balance refunded.');
                        }
                      }}
                      className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 text-[10px] sm:text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1">
                    {w.status === 'paid' ? '✓ Paid' : '✕ Refunded'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface PaymentSettingsSectionProps {
  settings: FirestoreSettings | null;
  language: 'bn' | 'en';
  onSavePaymentSettings: (data: Partial<FirestoreSettings>) => Promise<void>;
  showToast: (msg: string) => void;
}

export const PaymentSettingsSection: React.FC<PaymentSettingsSectionProps> = ({
  settings,
  language,
  onSavePaymentSettings,
  showToast
}) => {
  const [formData, setFormData] = useState<Partial<FirestoreSettings>>({
    bkashMerchant: settings?.bkashMerchant || '01700-000001',
    nagadMerchant: settings?.nagadMerchant || '01800-000002',
    rocketMerchant: settings?.rocketMerchant || '01900-000003',
    bankDetails: settings?.bankDetails || 'DBBL / City Bank | A/C: 2050123456789'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSavePaymentSettings(formData);
    showToast('Payment accounts updated successfully!');
  };

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      <div>
        <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
          <span>{language === 'bn' ? 'অফিসিয়াল MFS ও পেমেন্ট গেটওয়ে সেটিংস' : 'Official MFS & Payment Gateways'}</span>
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
          {language === 'bn' 
            ? 'মেম্বারশিপ ডিপোজিট এবং ম্যানুয়াল ভেরিফিকেশনের জন্য বিকাশ, নগদ ও রকেট মার্চেন্ট নাম্বার সেট করুন।' 
            : 'Configure official merchant accounts for deposits and payouts.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              bKash Merchant / Personal No:
            </label>
            <input
              type="text"
              value={formData.bkashMerchant || ''}
              onChange={(e) => setFormData({ ...formData, bkashMerchant: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Nagad Merchant / Personal No:
            </label>
            <input
              type="text"
              value={formData.nagadMerchant || ''}
              onChange={(e) => setFormData({ ...formData, nagadMerchant: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Rocket Merchant Number:
            </label>
            <input
              type="text"
              value={formData.rocketMerchant || ''}
              onChange={(e) => setFormData({ ...formData, rocketMerchant: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Bank Wire Routing & Instructions:
            </label>
            <input
              type="text"
              value={formData.bankDetails || ''}
              onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-1 sm:pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{language === 'bn' ? 'গেটওয়ে সেটিংস সংরক্ষণ করুন' : 'Save Gateway Accounts'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
