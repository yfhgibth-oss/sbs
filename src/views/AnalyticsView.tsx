import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Coins, 
  CreditCard, 
  PieChart, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { users, tasks, submissions, campaigns, withdrawals } = useApp();
  const { t } = useLanguage();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month' | 'year'>('30d');

  // Computed platform statistics
  const totalUsers = users.length + 1420; // Simulated historical + current
  const totalSubmissions = submissions.length + 5840;
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved').length + 5410;
  const approvalRate = Math.round((approvedSubmissions / totalSubmissions) * 100);

  const totalRewardsDistributed = 285400 + users.reduce((acc, u) => acc + u.totalEarned, 0);
  const totalWithdrawalsPaid = withdrawals.filter((w) => w.status === 'approved').reduce((acc, w) => acc + w.amount, 0) + 210000;

  // Chart data: Registrations & WAU over time
  const registrationTrend = [
    { label: 'Oct 01', val: 120 },
    { label: 'Oct 05', val: 145 },
    { label: 'Oct 10', val: 210 },
    { label: 'Oct 15', val: 190 },
    { label: 'Oct 20', val: 280 },
    { label: 'Oct 25', val: 340 },
    { label: 'Oct 31', val: 410 },
  ];

  // Membership breakdown
  const membershipData = [
    { tier: 'Free', count: 980, color: '#94a3b8', percentage: 65 },
    { tier: 'Silver', count: 320, color: '#6366f1', percentage: 21 },
    { tier: 'Gold', count: 140, color: '#f59e0b', percentage: 10 },
    { tier: 'Platinum', count: 60, color: '#06b6d4', percentage: 4 }
  ];

  // Category completion rates
  const categoryStats = [
    { name: 'Education & Quizzes', count: 2450, rate: 98, color: 'bg-emerald-500' },
    { name: 'App Testing', count: 1120, rate: 89, color: 'bg-indigo-500' },
    { name: 'Consumer Surveys', count: 1840, rate: 94, color: 'bg-cyan-500' },
    { name: 'Social Advocacy', count: 890, rate: 86, color: 'bg-purple-500' },
    { name: 'Translation & Review', count: 420, rate: 91, color: 'bg-amber-500' }
  ];

  // Withdrawal methods distribution
  const paymentMethods = [
    { method: 'bKash', amount: 165000, share: 58 },
    { method: 'Nagad', amount: 78000, share: 27 },
    { method: 'Rocket', amount: 28000, share: 10 },
    { method: 'Bank Transfer', amount: 14400, share: 5 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Platform Analytics & Performance Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated financial health, user growth velocity, task approval ratios, and budget burns.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              timeRange === '7d'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              timeRange === '30d'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              timeRange === 'month'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              timeRange === 'year'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">WAU / MAU</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            1,180 <span className="text-xs font-semibold text-slate-400">/ 3,420</span>
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Task Approval Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {approvalRate}%
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Quality-verified submissions</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Rewards Distributed</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalRewardsDistributed.toLocaleString()} ৳
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <span>Direct advertiser funded</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Withdrawals Settled</span>
            <CreditCard className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalWithdrawalsPaid.toLocaleString()} ৳
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span>100% On-time telecom settlement</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth & Daily Registration Trend SVG Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Registrations & Active Earner Velocity
                </h3>
                <p className="text-xs text-slate-500">New verified signups over the selected timeline</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                Avg 240 / day
              </span>
            </div>

            {/* Custom Interactive SVG Line & Bar Chart */}
            <div className="mt-6 h-60 w-full">
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="700" y2="160" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="210" x2="700" y2="210" stroke="currentColor" strokeOpacity="0.15" />

                {/* Bars for daily volume */}
                {registrationTrend.map((d, i) => {
                  const x = 50 + i * 100;
                  const h = (d.val / 450) * 160;
                  const y = 210 - h;
                  return (
                    <g key={i} className="group cursor-pointer">
                      <rect
                        x={x - 18}
                        y={y}
                        width="36"
                        height={h}
                        rx="8"
                        className="fill-indigo-100 dark:fill-indigo-950/60 hover:fill-indigo-200 dark:hover:fill-indigo-900 transition-all"
                      />
                      <circle cx={x} cy={y} r="5" className="fill-indigo-600 stroke-2 stroke-white dark:stroke-slate-900" />
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        +{d.val}
                      </text>
                      <text
                        x={x}
                        y="230"
                        textAnchor="middle"
                        className="text-[10px] font-medium fill-slate-400"
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}

                {/* Trend line */}
                <path
                  d="M 50 167 L 150 158 L 250 135 L 350 142 L 450 110 L 550 88 L 650 64"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Historical verified peak: 410 daily signups</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Organic referral share: 64%</span>
          </div>
        </div>

        {/* Membership Tier Distribution (1 Col) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Membership Demographics
            </h3>
            <p className="text-xs text-slate-500">Tier distribution across registered earners</p>

            {/* Visual stacked bar */}
            <div className="mt-5 h-4 w-full rounded-full flex overflow-hidden">
              {membershipData.map((m, idx) => (
                <div
                  key={idx}
                  style={{ width: `${m.percentage}%`, backgroundColor: m.color }}
                  title={`${m.tier}: ${m.percentage}%`}
                />
              ))}
            </div>

            {/* Legend items */}
            <div className="mt-6 space-y-3">
              {membershipData.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{m.tier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{m.count.toLocaleString()} members</span>
                    <span className="font-extrabold text-slate-900 dark:text-white w-8 text-right">
                      {m.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Free tier constitutes 65% of the user base with zero barrier to entry.
          </div>
        </div>

      </div>

      {/* Secondary Metrics Row: Task Categories & Payout Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Completion & Accuracy Rates */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Task Completion & Accuracy by Category
          </h3>
          <p className="text-xs text-slate-500">Verified volume and approval rate benchmark</p>

          <div className="mt-5 space-y-4">
            {categoryStats.map((c, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">{c.count.toLocaleString()} tasks</span>
                    <span className="font-extrabold text-emerald-600">{c.rate}% verified</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Method Breakdown */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Withdrawal Channel Distribution
          </h3>
          <p className="text-xs text-slate-500">Distribution of settled user earnings by MFS provider</p>

          <div className="mt-5 space-y-3">
            {paymentMethods.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">{p.method}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.share}% total payout volume</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-indigo-600 dark:text-indigo-400">
                    {p.amount.toLocaleString()} ৳
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Immediate MFS API</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
