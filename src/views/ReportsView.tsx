import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Calendar, 
  Filter, 
  FileText, 
  CheckCircle,
  Database
} from 'lucide-react';

export type ReportType = 
  | 'users' 
  | 'tasks' 
  | 'rewards' 
  | 'withdrawals' 
  | 'memberships' 
  | 'campaigns' 
  | 'payments';

export const ReportsView: React.FC = () => {
  const { users, tasks, submissions, withdrawals, campaigns, auditLogs } = useApp();
  const { t } = useLanguage();

  const [selectedReport, setSelectedReport] = useState<ReportType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  const reportOptions: { id: ReportType; label: string; count: number; desc: string }[] = [
    { id: 'users', label: 'User Directory Report', count: users.length, desc: 'Profiles, membership tiers, levels, streak records, risk scores' },
    { id: 'tasks', label: 'Task Catalog Report', count: tasks.length, desc: 'Active tasks, rewards, category splits, completion counts' },
    { id: 'rewards', label: 'Reward & Submissions Report', count: submissions.length, desc: 'User proofs, approval decisions, coin & XP awards' },
    { id: 'withdrawals', label: 'Withdrawal Ledger Report', count: withdrawals.length, desc: 'MFS payouts, fee deductions, bKash/Nagad references' },
    { id: 'memberships', label: 'Membership Analytics Report', count: users.length, desc: 'Tier distribution, level progression, retention statistics' },
    { id: 'campaigns', label: 'Campaign Escrow Report', count: campaigns.length, desc: 'Advertiser budgets, cost per action, remaining balances' },
    { id: 'payments', label: 'Financial Audit Report', count: auditLogs.length, desc: 'Immutable transaction trails, balance transfers, admin actions' }
  ];

  // Generate data rows based on report type
  const getReportData = () => {
    switch (selectedReport) {
      case 'users':
        return users.map((u) => ({
          'User ID': u.id,
          'Full Name': u.name,
          'Email Address': u.email,
          'Role': u.role,
          'Tier': u.membershipTier,
          'Balance (BDT)': u.balance,
          'Total Earned': u.totalEarned,
          'Level': u.level,
          'XP': u.xp,
          'Streak Days': u.streakDays,
          'Risk Score': u.riskScore,
          'Age Verified': u.isAgeVerified ? 'Yes' : 'No',
          'Registered Date': u.registeredAt
        }));
      case 'tasks':
        return tasks.map((t) => ({
          'Task ID': t.id,
          'Title': t.title,
          'Category': t.category,
          'Reward (BDT)': t.reward,
          'XP Reward': t.xpReward,
          'Required Tier': t.requiredTier,
          'Proof Type': t.proofType,
          'Completions': t.completedCount,
          'Max Limit': t.maxCompletions,
          'Rating': t.rating,
          'Active': t.active ? 'Yes' : 'No'
        }));
      case 'rewards':
        return submissions.map((s) => ({
          'Submission ID': s.id,
          'Task Title': s.taskTitle,
          'User Name': s.userName,
          'User Email': s.userEmail,
          'Category': s.category,
          'Submitted At': s.submittedAt,
          'Status': s.status,
          'Reward (BDT)': s.reward,
          'XP Awarded': s.xpReward,
          'Time Spent (Sec)': s.timeSpentSeconds,
          'Notes': s.reviewNotes || 'N/A'
        }));
      case 'withdrawals':
        return withdrawals.map((w) => ({
          'Withdrawal ID': w.id,
          'User Name': w.userName,
          'Method': w.method.toUpperCase(),
          'Account Number': w.accountNo,
          'Amount (BDT)': w.amount,
          'Fee': w.fee,
          'Net Payout': w.netAmount,
          'Transaction ID': w.trxId,
          'Status': w.status,
          'Requested At': w.requestedAt,
          'Reviewed At': w.reviewedAt || 'Pending'
        }));
      case 'memberships':
        return users.map((u) => ({
          'User ID': u.id,
          'Name': u.name,
          'Tier': u.membershipTier.toUpperCase(),
          'Level': u.level,
          'XP Progress': `${u.xp}/${u.xpNextLevel}`,
          'Badges Count': u.badges.length,
          'Streak Days': u.streakDays,
          'Total Earned': u.totalEarned
        }));
      case 'campaigns':
        return campaigns.map((c) => ({
          'Campaign ID': c.id,
          'Title': c.title,
          'Category': c.category,
          'Advertiser': c.managerName,
          'Total Budget (BDT)': c.budgetTotal,
          'Spent (BDT)': c.budgetSpent,
          'CPA (BDT)': c.costPerAction,
          'Completed Actions': c.actionsCompleted,
          'Max Actions': c.maxActions,
          'Impressions': c.impressions,
          'Clicks': c.clicks,
          'Status': c.status,
          'Start Date': c.startDate,
          'End Date': c.endDate
        }));
      case 'payments':
        return auditLogs.map((a) => ({
          'Audit Log ID': a.id,
          'Admin Name': a.adminName,
          'Role': a.role,
          'Action': a.action,
          'Target Type': a.targetType,
          'Target ID': a.targetId,
          'Details': a.details,
          'Timestamp': a.timestamp,
          'IP Address': a.ipAddress
        }));
      default:
        return [];
    }
  };

  const rawRows = getReportData();

  // Search filter
  const filteredRows = rawRows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(q));
  });

  const headers = filteredRows.length > 0 ? Object.keys(filteredRows[0]) : [];

  // Export to CSV function
  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;

    const csvHeaders = headers.join(',');
    const csvContent = filteredRows
      .map((row) =>
        headers
          .map((h) => {
            const val = String((row as any)[h] ?? '').replace(/"/g, '""');
            return `"${val}"`;
          })
          .join(',')
      )
      .join('\n');

    const fullCsv = `${csvHeaders}\n${csvContent}`;
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskEarn_Report_${selectedReport}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to Excel-compatible TSV/XML spreadsheet
  const handleExportExcel = () => {
    if (filteredRows.length === 0) return;

    // Excel compatible tab-delimited file with .xls extension
    const tsvHeaders = headers.join('\t');
    const tsvContent = filteredRows
      .map((row) =>
        headers.map((h) => String((row as any)[h] ?? '').replace(/\t/g, ' ')).join('\t')
      )
      .join('\n');

    const fullTsv = `${tsvHeaders}\n${tsvContent}`;
    const blob = new Blob([fullTsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskEarn_Spreadsheet_${selectedReport}_${Date.now()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Comprehensive Report Generation & Export</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export verified audit logs, user registries, task records, and financial ledgers to CSV & Excel spreadsheets.
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-bold text-xs shadow-xs active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsv}</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.exportSpreadsheet}</span>
          </button>
        </div>
      </div>

      {/* Report Categories Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {reportOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedReport(opt.id)}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
              selectedReport === opt.id
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold truncate">{opt.label}</span>
            <span className="text-[10px] text-slate-400 mt-2">{opt.count} records</span>
          </button>
        ))}
      </div>

      {/* Filters Bar: Search & Date Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search across ${selectedReport} records...`}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>From:</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
          />
          <span className="text-slate-400">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
          />
        </div>

      </div>

      {/* Interactive Data Preview Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>Previewing {filteredRows.length} rows</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Click "Export CSV" or "Export Spreadsheet" to download full raw data
          </span>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-12 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    {headers.map((h, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono text-[11px]">
                        {String((row as any)[h])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
