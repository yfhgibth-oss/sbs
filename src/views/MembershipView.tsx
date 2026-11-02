import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { FirestoreMembershipPlan } from '../services/firebaseService';
import { 
  Award, 
  Check, 
  AlertTriangle, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ExternalLink,
  X
} from 'lucide-react';

interface MembershipViewProps {
  onOpenAuth: () => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({ onOpenAuth }) => {
  const { memberships, membershipPayments, submitMembershipPayment, fbUser, userProfile, settings } = useFirebase();
  const { t, language } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<FirestoreMembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [senderAccount, setSenderAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenUpgrade = (plan: FirestoreMembershipPlan) => {
    if (!fbUser) {
      onOpenAuth();
      return;
    }
    setSelectedPlan(plan);
    setSenderAccount('');
    setTransactionId('');
    setFeedback(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!senderAccount.trim() || !transactionId.trim()) {
      setFeedback({ text: 'Please enter sender account and transaction reference ID.', isError: true });
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitMembershipPayment(selectedPlan.id, paymentMethod, senderAccount.trim(), transactionId.trim().toUpperCase());
      setFeedback({ text: res.message, isError: !res.success });
      if (res.success) {
        setTimeout(() => setSelectedPlan(null), 2500);
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Payment submission failed.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const userPayments = membershipPayments.filter((p) => p.userId === fbUser?.uid);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 border border-indigo-200/50">
          <Award className="w-3.5 h-3.5" />
          Transparent Membership Program
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Accelerate Your Micro-Task Rewards
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Unlock higher reward multipliers, elevated daily task quotas, zero withdrawal fees, and priority verification.
        </p>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Statutory Risk Disclosure:</strong> Membership does NOT promise, guarantee, or advertise fixed income or investment returns. Upgrades grant higher multiplier rates on approved tasks and elevated daily limits. Rewards remain strictly contingent upon actual advertiser-funded tasks completed with approved quality.
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memberships.map((plan) => {
          const isCurrent = userProfile?.membershipTier === plan.id;
          const isFree = plan.price === 0;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between border transition shadow-xs ${
                isCurrent
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black text-[9px] uppercase">
                      Current
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {isFree ? 'Free' : `${plan.price} ৳`}
                  </span>
                  {!isFree && <span className="text-xs text-slate-400">/ {plan.durationDays} days</span>}
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reward Rate:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400">{plan.rewardMultiplier}x Multiplier</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Daily Tasks:</span>
                    <strong className="text-slate-800 dark:text-slate-200">Up to {plan.dailyTaskLimit}</strong>
                  </div>
                </div>

                {/* Benefits checklist */}
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs cursor-default"
                  >
                    Active Plan
                  </button>
                ) : isFree ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs cursor-default"
                  >
                    Default Tier
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenUpgrade(plan)}
                    className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
                  >
                    Upgrade for {plan.price} ৳
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Upgrade History */}
      {userPayments.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            My Upgrade Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2 px-3">Plan</th>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Transaction ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{p.planName}</td>
                    <td className="py-2.5 px-3 uppercase">{p.paymentMethod}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600">{p.price} ৳</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-600">{p.transactionId}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[10px]">{p.submittedAt.substring(0, 16)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-xs">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Upgrade to {selectedPlan.name} ({selectedPlan.price} ৳)</span>
            </h3>

            {/* Merchant Payment Instructions */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Official Payment Accounts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <p><strong>bKash Merchant:</strong> {settings?.bkashMerchant || '01700-112233'}</p>
                <p><strong>Nagad Merchant:</strong> {settings?.nagadMerchant || '01800-445566'}</p>
              </div>
              <p className="text-[10px] text-slate-500">
                Send <strong>{selectedPlan.price} ৳</strong> via "Make Payment" or "Send Money" then copy the transaction ID below.
              </p>
            </div>

            {feedback && (
              <div className={`mt-3 p-3 rounded-2xl font-semibold flex items-center gap-2 ${
                feedback.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="mt-4 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-xl border p-2 bg-white dark:bg-slate-800"
                >
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Sender Mobile / Account Number:
                </label>
                <input
                  type="text"
                  required
                  value={senderAccount}
                  onChange={(e) => setSenderAccount(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full rounded-xl border p-2 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction Reference ID (TrxID):
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9J4K2L18BD"
                  className="w-full rounded-xl border p-2 bg-white dark:bg-slate-800 font-mono uppercase font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  {submitting ? 'Verifying...' : 'Submit Payment for Verification'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
