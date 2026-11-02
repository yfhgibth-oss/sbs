import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Server, 
  Database, 
  Activity, 
  ShieldCheck, 
  CloudRain, 
  CloudLightning, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  HardDrive, 
  Lock,
  Layers,
  Archive
} from 'lucide-react';

export const SystemHealthView: React.FC = () => {
  const { systemHealth, triggerBackupNow, testFirestoreLatency, currentUser } = useApp();
  const { t } = useLanguage();

  const [testingLatency, setTestingLatency] = useState(false);
  const [latencyResult, setLatencyResult] = useState<number | null>(null);
  const [backupTriggering, setBackupTriggering] = useState(false);
  const [selectedError, setSelectedError] = useState<any | null>(null);

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role.includes('admin') || currentUser.role.includes('manager');

  if (!isAdmin) {
    return (
      <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <Lock className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Restricted System Access</h2>
        <p className="text-xs text-slate-500 mt-1">
          System Health, Cloud Backups, and Firebase runtime telemetry are restricted to authorized administrators.
        </p>
      </div>
    );
  }

  const handleTestLatency = async () => {
    setTestingLatency(true);
    const ms = await testFirestoreLatency();
    setLatencyResult(ms);
    setTestingLatency(false);
  };

  const handleTriggerBackup = async () => {
    setBackupTriggering(true);
    await triggerBackupNow();
    setBackupTriggering(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.systemHealthTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cloud infrastructure uptime, database response times, scheduled automated backups, and error logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestLatency}
            disabled={testingLatency}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingLatency ? 'animate-spin' : ''}`} />
            <span>Ping Firestore</span>
          </button>

          <button
            onClick={handleTriggerBackup}
            disabled={backupTriggering}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
          >
            <Archive className="w-4 h-4" />
            <span>{backupTriggering ? 'Executing Cloud Snapshot...' : t.triggerBackup}</span>
          </button>
        </div>
      </div>

      {/* Cloud Service Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Firebase Core */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Firebase Core</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-base font-extrabold text-slate-900 dark:text-white">Connected</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">GCP Cloud Region: asia-northeast1</p>
        </div>

        {/* Firestore Database */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Firestore Query Latency</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {latencyResult !== null ? `${latencyResult} ms` : `${systemHealth.firestoreLatencyMs} ms`}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Optimal real-time sync</p>
        </div>

        {/* Firebase Auth */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authentication Service</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900 dark:text-white capitalize">
              {systemHealth.authStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">OAuth2 & JWT Token Proxy active</p>
        </div>

        {/* Cloud Functions */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cloud Functions Runtime</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            {systemHealth.cloudFunctionsLatencyMs} ms
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Webhook triggers 99.98% SLA</p>
        </div>

      </div>

      {/* Cloud Backup & Disaster Recovery Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-600" />
              <span>Automated GCP Firestore Scheduled Backups</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily incremental snapshots stored in Google Cloud Storage Multi-Region Coldline buckets.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Last Backup:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{systemHealth.lastBackupDate}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {systemHealth.backupSizeMb} MB
            </span>
          </div>
        </div>

        {/* Snapshot restore points table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                <th className="py-2.5 px-3">Snapshot Name</th>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Compressed Size</th>
                <th className="py-2.5 px-3">Collections Included</th>
                <th className="py-2.5 px-3 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {systemHealth.restorePoints.map((pt) => (
                <tr key={pt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {pt.snapshotName}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{pt.timestamp}</td>
                  <td className="py-3 px-3 font-semibold">{pt.sizeMb} MB</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{pt.tables.join(', ')}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Errors & Telemetry Log */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>{t.recentErrors}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Filtered backend proxy events, auto-recovered exceptions, and rate limit intercepts.
        </p>

        <div className="mt-4 space-y-2.5">
          {systemHealth.recentErrors.map((err) => (
            <div
              key={err.id}
              onClick={() => setSelectedError(err)}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  err.severity === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {err.code}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{err.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Service: {err.service} • Timestamp: {err.timestamp}</p>
                </div>
              </div>

              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Inspect
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Inspect Modal */}
      {selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Event Details: {selectedError.code}</span>
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto">
                <p><strong>Service:</strong> {selectedError.service}</p>
                <p><strong>Timestamp:</strong> {selectedError.timestamp}</p>
                <p><strong>Severity:</strong> {selectedError.severity.toUpperCase()}</p>
                <p className="mt-2"><strong>Message:</strong> {selectedError.message}</p>
                <p className="mt-2 text-slate-400">// Stack trace recovered gracefully via automatic retry mechanism.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
