import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';
import { 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Search, 
  Terminal, 
  KeyRound, 
  CheckCircle,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';

export const AdminSecurityView: React.FC = () => {
  const { 
    auditLogs, 
    currentUser, 
    users, 
    updateUserRole, 
    requireSensitiveConfirm 
  } = useApp();
  const { t } = useLanguage();

  const [searchLog, setSearchLog] = useState('');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<string | null>(null);

  const isSuperAdmin = currentUser.role === 'super_admin';

  const roleDefinitions: { role: UserRole; title: string; permissions: string[]; badge: string }[] = [
    {
      role: 'super_admin',
      title: 'Super Administrator',
      permissions: ['Full Platform Control', 'Cloud Backups & Restore', 'Role Management', 'Budget Adjustments', 'System Config'],
      badge: 'bg-rose-500 text-white'
    },
    {
      role: 'task_manager',
      title: 'Task Manager',
      permissions: ['Verify Submissions', 'Create & Manage Missions', 'Categorize Tasks', 'Inspect Duplicate Evidence'],
      badge: 'bg-indigo-500 text-white'
    },
    {
      role: 'payment_manager',
      title: 'Payment & Finance Manager',
      permissions: ['Review Withdrawals', 'Verify bKash/Nagad TrxIDs', 'Audit Escrow Balances', 'Flag Duplicate Payments'],
      badge: 'bg-emerald-500 text-white'
    },
    {
      role: 'support_manager',
      title: 'Customer Support Manager',
      permissions: ['Resolve Tickets', 'Configure WhatsApp Desk', 'Handle Inquiries', 'Issue User Warnings'],
      badge: 'bg-amber-500 text-white'
    },
    {
      role: 'analyst',
      title: 'Read-Only Analyst',
      permissions: ['View Analytics Dashboard', 'Export CSV & Excel Reports', 'Read-Only System Access', 'No Write Actions'],
      badge: 'bg-cyan-500 text-white'
    }
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchLog.trim()) return true;
    const q = searchLog.toLowerCase();
    return (
      log.adminName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.targetType.toLowerCase().includes(q)
    );
  });

  const handleTestSensitiveAction = () => {
    requireSensitiveConfirm(
      'System Audit Cache Reset & Security Re-Key',
      'This action simulates clearing ephemeral session cache tokens across all active nodes and logging a high-severity security audit event.',
      () => {
        alert('Action successfully verified and executed under Super Admin credentials.');
      }
    );
  };

  const handleRoleChange = (userId: string, targetRole: UserRole) => {
    requireSensitiveConfirm(
      `Role Privilege Escalation / Modification`,
      `Are you sure you want to change this user's platform authorization level to ${targetRole.toUpperCase()}? This will modify their access permissions immediately.`,
      () => {
        updateUserRole(userId, targetRole);
        setSelectedUserToEdit(null);
      }
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.adminSecurityTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC), multi-party sensitive action confirmations, and immutable audit trails.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleTestSensitiveAction}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 active:scale-95 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Test Sensitive Action Protocol</span>
          </button>
        )}
      </div>

      {/* Role Definitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleDefinitions.map((rd) => (
          <div
            key={rd.role}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rd.badge}`}>
                  {rd.role.replace('_', ' ')}
                </span>
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {rd.title}
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {rd.permissions.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
              Active assigned admins: {users.filter((u) => u.role === rd.role).length}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Personnel Management Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>Administrative Personnel & Role Assignments</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized platform operators. Secrets and session tokens are strictly server-side isolated.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Session Security Status</th>
                <th className="py-2.5 px-3">Registered At</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.filter((u) => u.role !== 'user').map((adminUser) => (
                <tr key={adminUser.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={adminUser.avatar} alt={adminUser.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{adminUser.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{adminUser.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-bold uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {adminUser.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Encrypted JWT Session
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {adminUser.registeredAt}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {isSuperAdmin && adminUser.id !== currentUser.id ? (
                      <select
                        value={adminUser.role}
                        onChange={(e) => handleRoleChange(adminUser.id, e.target.value as UserRole)}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="task_manager">Task Manager</option>
                        <option value="payment_manager">Payment Manager</option>
                        <option value="support_manager">Support Manager</option>
                        <option value="analyst">Analyst</option>
                        <option value="campaign_manager">Campaign Manager</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-400">Current Operator</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Activity Log / Trail */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>{t.auditLogs}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only immutable record of all administrative operations, reviews, and policy updates.
            </p>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto max-h-[420px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-[10px] font-bold uppercase text-slate-400">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Admin Operator</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Details</th>
                <th className="py-2.5 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white">{log.adminName}</span>
                    <span className="block text-[10px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
