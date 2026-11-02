import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FirestoreUser } from '../../services/firebaseService';

interface UserManagementSectionProps {
  allUsers: FirestoreUser[];
  language: 'bn' | 'en';
  onUpdateRole: (uid: string, role: any) => Promise<void>;
  onUpdateTier: (uid: string, tier: any) => Promise<void>;
  onToggleSuspension: (uid: string, currentStatus: string) => Promise<void>;
  onOpenAdjustWallet: (uid: string) => void;
  showToast: (msg: string) => void;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  allUsers,
  language,
  onUpdateRole,
  onUpdateTier,
  onToggleSuspension,
  onOpenAdjustWallet,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | string>('all');
  const [tierFilter, setTierFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = !searchQuery || 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mobileNumber && u.mobileNumber.includes(searchQuery)) ||
      u.uid.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesTier = tierFilter === 'all' || u.membershipTier === tierFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesTier && matchesStatus;
  });

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{language === 'bn' ? 'ইউজার একাউন্ট ও পারমিশন' : 'User Accounts'}</span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredUsers.length}/{allUsers.length}
            </span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
            {language === 'bn' 
              ? 'ইউজার রোল পরিবর্তন, মেম্বারশিপ টায়ার ও ব্যালেন্স সমন্বয়।' 
              : 'Audit user roles, membership tier upgrades, and balances.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'নাম বা মোবাইল খুঁজুন...' : 'Search name, phone, UID...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 sm:pl-8 pr-2.5 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" />
          <span className="hidden sm:inline">{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </span>

        {/* Status Filter */}
        <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
          {(['all', 'active', 'suspended'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                statusFilter === st 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st === 'all' ? (language === 'bn' ? 'সব' : 'All') : st.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">{language === 'bn' ? 'সব টায়ার' : 'All Tiers'}</option>
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="premium">Premium</option>
        </select>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">{language === 'bn' ? 'সব রোল' : 'All Roles'}</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
          <option value="task_manager">Task Mgr</option>
          <option value="payment_manager">Payment Mgr</option>
          <option value="support_manager">Support Mgr</option>
          <option value="analyst">Analyst</option>
        </select>
      </div>

      {/* Clean High-Density Data Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[560px]">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">User</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Contact</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Wallet</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Role</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Tier</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Status</th>
              <th className="py-2 px-2.5 sm:py-2.5 sm:px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                  {language === 'bn' ? 'কোনো ইউজার মেলেনি' : 'No matching users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.uid || u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2 px-2 sm:py-2.5 sm:px-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <img
                        src={u.avatar || u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`}
                        alt=""
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate text-[11px] sm:text-xs">
                          {u.fullName || 'User'}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono block">
                          #{u.uid.slice(0, 6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3 text-slate-600 dark:text-slate-300">
                    <p className="font-mono text-[10px] sm:text-xs">{u.mobileNumber || 'N/A'}</p>
                    <p className="text-[9px] text-slate-400 truncate max-w-[120px] hidden sm:block">{u.email}</p>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3">
                    <div className="font-mono text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {(u.balance ?? 50).toLocaleString()} ৳
                    </div>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3">
                    <select
                      value={u.role || 'user'}
                      onChange={async (e) => {
                        await onUpdateRole(u.uid, e.target.value);
                        showToast(`Role updated to ${e.target.value}`);
                      }}
                      className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] sm:text-[11px] font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super</option>
                      <option value="task_manager">Task Mgr</option>
                      <option value="payment_manager">Payment</option>
                      <option value="support_manager">Support</option>
                      <option value="analyst">Analyst</option>
                    </select>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3">
                    <select
                      value={u.membershipTier || 'free'}
                      onChange={async (e) => {
                        await onUpdateTier(u.uid, e.target.value);
                        showToast(`Tier set to ${e.target.value}`);
                      }}
                      className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] sm:text-[11px] font-semibold uppercase text-indigo-600 dark:text-indigo-400"
                    >
                      <option value="free">Free</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="premium">VIP</option>
                    </select>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3">
                    <button
                      onClick={async () => {
                        await onToggleSuspension(u.uid, u.status);
                        showToast(`User ${u.status === 'suspended' ? 'Reactivated' : 'Suspended'}`);
                      }}
                      className={`px-1.5 py-0.2 rounded-full font-medium text-[9px] sm:text-[10px] inline-flex items-center gap-1 ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{u.status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'স্থগিত' : 'Paused')}</span>
                    </button>
                  </td>

                  <td className="py-2 px-2 sm:py-2.5 sm:px-3 text-right">
                    <button
                      onClick={() => onOpenAdjustWallet(u.uid)}
                      className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-medium text-[10px] sm:text-[11px]"
                    >
                      ± {language === 'bn' ? 'টাকা' : 'Adjust'}
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
