import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Lock, 
  Database,
  Coins,
  BadgePercent
} from 'lucide-react';

export const FinancialRulesView: React.FC = () => {
  const { t, language } = useLanguage();

  const rules = [
    {
      num: 1,
      title: 'Never Promise Guaranteed Earnings',
      desc: 'Micro-task rewards are strictly performance-contingent upon approved, authentic completions. No fixed daily or monthly return may ever be advertised or promised to users.',
      icon: Ban,
      status: 'Strictly Enforced',
      color: 'text-rose-500'
    },
    {
      num: 2,
      title: 'Zero-Ponzi: Never Use Membership Fees to Pay Rewards',
      desc: 'All task rewards and user balances are funded exclusively by pre-deposited advertiser campaign escrow budgets. Membership fees never cross-subsidize or pay older members.',
      icon: ShieldCheck,
      status: 'Escrow Isolated',
      color: 'text-emerald-500'
    },
    {
      num: 3,
      title: 'Anti-Fake Engagement: Zero Automated or Fake Video Views',
      desc: 'We strictly disallow fake click-farms, synthetic video views, and scripted answer generators. Every task enforces minimum attention timers and unique image/hash validation.',
      icon: AlertTriangle,
      status: 'Algorithmic Screen',
      color: 'text-amber-500'
    },
    {
      num: 4,
      title: 'No Gambling or Chance-Based Paid Rewards',
      desc: 'Paid lotteries, luck-based pay-to-spin wheels, and speculative wagering are strictly prohibited. Every reward corresponds to legitimate micro-work or certified educational quizzes.',
      icon: Ban,
      status: 'Prohibited by Charter',
      color: 'text-rose-500'
    },
    {
      num: 5,
      title: 'Campaign-Specific Budget Isolation',
      desc: 'Tasks automatically pause the instant an advertiser campaign exhausts its allocated budget cap. Platform reserves cannot create synthetic or unbacked rewards.',
      icon: Coins,
      status: 'Hard-Capped',
      color: 'text-indigo-500'
    },
    {
      num: 6,
      title: 'Verified Payments Before Activation',
      desc: 'Financial disbursements and membership activations undergo multi-point telecom verification (bKash/Nagad/Rocket/Bank) with transaction reference hashing to stop reuse.',
      icon: CheckCircle2,
      status: 'TrxID Hashed',
      color: 'text-cyan-500'
    },
    {
      num: 7,
      title: 'Complete Immutable Financial Audit Records',
      desc: 'Every balance credit, debit, payout fee, and campaign escrow movement is written to an append-only audit trail accessible by compliance authorities.',
      icon: Database,
      status: 'Immutable Ledger',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Platform Financial Constitution & Zero-Ponzi Mandate
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Core statutory compliance rules governing fair micro-work, ethical advertising, and verified escrow economics.
            </p>
          </div>
        </div>
      </div>

      {/* Escrow Mechanism Explanation Box */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>How Advertiser Escrow Works (Transparent Capital Flow)</span>
        </h3>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">1. Advertiser Escrow Deposit</span>
            <p className="text-slate-600 dark:text-slate-300">
              Verified brands (banks, app publishers, e-commerce) deposit 100% of the campaign budget in secure escrow before tasks appear on the platform.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">2. Quality Work & Anti-Fraud</span>
            <p className="text-slate-600 dark:text-slate-300">
              Earners complete lessons, app reviews, or feedback. Anti-fraud filters verify attention time, image fingerprints, and duplicate prevention.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">3. Direct Escrow Release</span>
            <p className="text-slate-600 dark:text-slate-300">
              Approved tasks release funds directly from the specific campaign budget into user balances for real-time MFS withdrawal.
            </p>
          </div>
        </div>
      </div>

      {/* The 7 Statutory Rules */}
      <div className="space-y-3.5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          7 Enforced Principles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.num}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300">
                      #{rule.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {rule.status}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${rule.color}`} />
                    <span>{rule.title}</span>
                  </h4>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
