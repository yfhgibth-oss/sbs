import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { FraudFlag } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle, 
  FileText, 
  PauseCircle, 
  Eye, 
  Info,
  Clock,
  Layers,
  Fingerprint
} from 'lucide-react';

export const AntiFraudView: React.FC = () => {
  const { fraudFlags, reviewFraudFlag, currentUser } = useApp();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'cleared' | 'restricted'>('all');
  const [selectedFlag, setSelectedFlag] = useState<FraudFlag | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedFlags = fraudFlags.filter((f) => {
    if (activeFilter === 'pending' && f.status !== 'pending_review') return false;
    if (activeFilter === 'cleared' && f.status !== 'cleared') return false;
    if (activeFilter === 'restricted' && f.status !== 'restricted' && f.status !== 'warning_issued') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.userName.toLowerCase().includes(q) ||
        f.userEmail.toLowerCase().includes(q) ||
        f.evidenceSummary.toLowerCase().includes(q) ||
        f.flagType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (score: number) => {
    if (score >= 85) {
      return {
        label: t.riskCritical,
        classes: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
        bar: 'bg-rose-500'
      };
    }
    if (score >= 65) {
      return {
        label: t.riskHigh,
        classes: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900',
        bar: 'bg-orange-500'
      };
    }
    if (score >= 40) {
      return {
        label: t.riskMedium,
        classes: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
        bar: 'bg-amber-500'
      };
    }
    return {
      label: t.riskLow,
      classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      bar: 'bg-emerald-500'
    };
  };

  const handleAction = (action: 'cleared' | 'restricted' | 'warning_issued') => {
    if (!selectedFlag) return;
    reviewFraudFlag(selectedFlag.id, action, adminNotes.trim() || 'Reviewed by admin.');
    setSelectedFlag(null);
    setAdminNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Privacy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>{t.antiFraudTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time screening for duplicate submissions, reused TrxIDs, velocity anomalies, and multi-accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <Fingerprint className="w-4 h-4 text-indigo-500" />
          <span>Active Flagged Accounts: {fraudFlags.filter((f) => f.status === 'pending_review').length}</span>
        </div>
      </div>

      {/* Mandatory Privacy & Fairness Callout */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
            <span className="font-bold">Privacy-Conscious Protection Constitution:</span> {t.privacyNote}
            <span className="block mt-1 text-[11px] text-indigo-800 dark:text-indigo-300">
              Indicators serve as investigative alerts. Admins must review evidence, examine telemetry, and request proof before taking punitive action.
            </span>
          </div>
        </div>
      </div>

      {/* Quick Monitoring Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duplicate Proofs</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {fraudFlags.filter((f) => f.flagType === 'duplicate_submission' || f.flagType === 'repeated_evidence').length}
          </p>
          <span className="text-[10px] text-rose-500 font-semibold">Image & text fingerprint matches</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duplicate TrxIDs</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {fraudFlags.filter((f) => f.flagType === 'duplicate_trx').length}
          </p>
          <span className="text-[10px] text-amber-500 font-semibold">bKash/Nagad reference reuse</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Clusters</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {fraudFlags.filter((f) => f.flagType === 'suspicious_signup' || f.flagType === 'self_referral').length}
          </p>
          <span className="text-[10px] text-indigo-500 font-semibold">Subnet & device collision</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Velocity Triggers</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {fraudFlags.filter((f) => f.flagType === 'unusual_withdrawal').length}
          </p>
          <span className="text-[10px] text-purple-500 font-semibold">Burst payout velocity spikes</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Logs ({fraudFlags.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeFilter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Pending Review ({fraudFlags.filter((f) => f.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setActiveFilter('restricted')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeFilter === 'restricted'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Restricted / Warned
          </button>
          <button
            onClick={() => setActiveFilter('cleared')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeFilter === 'cleared'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Cleared Safe
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, email, flag type..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Flagged Accounts Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Flag Category</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Automated Evidence Summary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedFlags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No flagged records found matching your filters.
                  </td>
                </tr>
              ) : (
                displayedFlags.map((flag) => {
                  const risk = getRiskBadge(flag.riskScore);
                  return (
                    <tr key={flag.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{flag.userName}</p>
                        <p className="text-[11px] text-slate-400">{flag.userEmail}</p>
                        <span className="text-[10px] text-slate-400">{flag.timestamp}</span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono">
                          {flag.flagType.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 w-28">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border text-center ${risk.classes}`}>
                            {flag.riskScore}/100 • {risk.label}
                          </span>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full ${risk.bar}`} style={{ width: `${flag.riskScore}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {flag.evidenceSummary}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          flag.status === 'pending_review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : flag.status === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {flag.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedFlag(flag);
                            setAdminNotes(flag.adminNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 font-bold text-xs transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Investigate Flagged Case #{selectedFlag.id}</span>
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">User: {selectedFlag.userName} ({selectedFlag.userEmail})</p>
                <p className="text-slate-500 mt-0.5">Category: {selectedFlag.flagType} • Risk Score: {selectedFlag.riskScore}/100</p>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{selectedFlag.evidenceSummary}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Investigation Notes:
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record verification findings, telecom receipt check, or explanation..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedFlag(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t.cancel}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('cleared')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.markSafe}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('warning_issued')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.requestProof}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('restricted')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>{t.restrictAccount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
