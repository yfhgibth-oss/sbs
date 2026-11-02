import React from 'react';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  LayoutDashboard,
  CheckSquare, 
  Wallet,
  Award, 
  Trophy,
  Share2,
  Calendar as CalendarIcon, 
  Megaphone, 
  ShieldAlert, 
  BarChart3, 
  FileSpreadsheet, 
  Ticket, 
  Headphones, 
  Server, 
  Lock, 
  Scale, 
  UserCircle,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Smartphone,
  X
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'tasks' 
  | 'apps'
  | 'wallet'
  | 'memberships'
  | 'leaderboard'
  | 'referrals'
  | 'missions' 
  | 'calendar' 
  | 'promos' 
  | 'profile'
  | 'campaigns' 
  | 'admin_panel'
  | 'anti_fraud' 
  | 'analytics' 
  | 'reports' 
  | 'support' 
  | 'system_health' 
  | 'admin_security' 
  | 'financial_rules';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentUser } = useApp();
  const { fbUser, userProfile, isAdmin, wallet } = useFirebase();
  const { t, language } = useLanguage();

  const isSuperAdmin = isAdmin || currentUser?.role === 'super_admin';

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    requiresAdmin?: boolean;
    group: 'earner' | 'advertiser' | 'admin' | 'compliance';
  }[] = [
    // Earner Features
    { id: 'dashboard', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Overview', icon: LayoutDashboard, group: 'earner' },
    { id: 'tasks', label: t.tasks, icon: CheckSquare, badge: 'Tasks', badgeColor: 'bg-indigo-500 text-white', group: 'earner' },
    { id: 'apps', label: language === 'bn' ? 'অ্যাপস ও গেমস' : 'Apps & Hub', icon: Smartphone, badge: 'Earn', badgeColor: 'bg-cyan-500 text-slate-950 font-bold', group: 'earner' },
    { id: 'wallet', label: language === 'bn' ? 'ওয়ালেট ও উত্তোলন' : 'Wallet & Payouts', icon: Wallet, group: 'earner' },
    { id: 'memberships', label: language === 'bn' ? 'মেম্বারশিপ প্ল্যান' : 'Memberships', icon: CreditCard, group: 'earner' },
    { id: 'leaderboard', label: language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard', icon: Trophy, group: 'earner' },
    { id: 'referrals', label: language === 'bn' ? 'রেফার ও আয়' : 'Referral 5%', icon: Share2, group: 'earner' },
    { id: 'missions', label: t.missions, icon: Award, badge: 'Hot', badgeColor: 'bg-amber-500 text-white', group: 'earner' },
    { id: 'calendar', label: t.calendar, icon: CalendarIcon, group: 'earner' },
    { id: 'promos', label: t.promoCodes, icon: Ticket, group: 'earner' },
    { id: 'profile', label: t.profile, icon: UserCircle, group: 'earner' },

    // Advertiser & Campaign Manager
    { id: 'campaigns', label: t.campaigns, icon: Megaphone, badge: 'Escrow', badgeColor: 'bg-indigo-500 text-white', group: 'advertiser' },

    // Full Admin Control Panel
    { id: 'admin_panel', label: language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Console', icon: ShieldCheck, badge: 'Super', badgeColor: 'bg-amber-500 text-slate-950 font-black', group: 'admin', requiresAdmin: true },
    { id: 'anti_fraud', label: t.antiFraud, icon: ShieldAlert, badge: 'Scans', badgeColor: 'bg-rose-500 text-white', group: 'admin' },
    { id: 'analytics', label: t.analytics, icon: BarChart3, group: 'admin' },
    { id: 'reports', label: t.reports, icon: FileSpreadsheet, group: 'admin' },
    { id: 'support', label: t.support, icon: Headphones, group: 'admin' },

    // Platform Integrity & Health
    { id: 'system_health', label: t.systemHealth, icon: Server, badge: 'Online', badgeColor: 'bg-emerald-500 text-white', group: 'admin' },
    { id: 'admin_security', label: t.adminSecurity, icon: Lock, group: 'admin' },
    { id: 'financial_rules', label: t.financialRules, icon: Scale, group: 'compliance' }
  ];

  const handleNavClick = (id: ActiveTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const level = userProfile?.streakDays ? Math.min(Math.floor((userProfile.streakDays || 1) / 3) + 1, 50) : currentUser.level;
  const currentTier = userProfile?.membershipTier || currentUser.membershipTier;

  const content = (
    <div className="flex h-full flex-col justify-between overflow-y-auto p-4 space-y-6">
      <div className="space-y-5">
        
        {/* User Mini Level Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-xs">
                L{level}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {currentTier} Member
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {fbUser ? (userProfile?.fullName || fbUser.email?.split('@')[0]) : 'Guest Explorer'}
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          {/* XP Progress Bar */}
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min((currentUser.xp / currentUser.xpNextLevel) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          
          {/* Main Earner Hub */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === 'bn' ? 'ইউজার আর্নিং হাব' : 'Earner Hub'}
            </span>
            <div className="mt-1.5 space-y-0.5">
              {navItems.filter((i) => i.group === 'earner').map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advertiser Hub */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === 'bn' ? 'বিজ্ঞাপনদাতা পোর্টাল' : 'Advertiser Portal'}
            </span>
            <div className="mt-1.5 space-y-0.5">
              {navItems.filter((i) => i.group === 'advertiser').map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin & Security Hub (Visible only to authenticated admins) */}
          {isSuperAdmin && (
            <div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Administration
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  ADMIN
                </span>
              </div>
              <div className="mt-1.5 space-y-0.5">
                {navItems.filter((i) => i.group === 'admin').map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                          : item.id === 'admin_panel'
                          ? 'text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : item.id === 'admin_panel' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compliance & Zero-Ponzi Hub */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Legal & Trust
            </span>
            <div className="mt-1.5 space-y-0.5">
              {navItems.filter((i) => i.group === 'compliance').map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Zero-Ponzi Badge in Sidebar Bottom */}
      <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
        <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Statutory Protection</span>
        </p>
        <p className="mt-0.5 leading-snug">
          100% Performance-based rewards. Zero guaranteed returns.
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                Menu & Navigation
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
