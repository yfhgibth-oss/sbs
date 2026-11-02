import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { StreakClaimModal } from './StreakClaimModal';
import { NotificationDrawer } from './NotificationDrawer';
import { 
  Sun, 
  Moon, 
  Flame, 
  Bell, 
  Coins, 
  ChevronDown, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  Menu,
  LogIn,
  LogOut,
  Sliders,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebarMobile?: () => void;
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebarMobile, 
  onOpenAuth,
  onNavigateTab 
}) => {
  const { currentUser, notifications } = useApp();
  const { fbUser, userProfile, wallet, isAdmin, logout, settings } = useFirebase();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = (notifications || []).filter(
    (n) => !n.read && (currentUser?.id ? n.userId === currentUser.id : false) || Boolean(currentUser?.role?.includes('admin'))
  ).length;

  const displayBalance = Number(wallet?.availableBalance ?? userProfile?.balance ?? currentUser?.balance ?? 0);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 sm:px-4 py-1.5 sm:py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 sm:gap-2">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              onClick={onToggleSidebarMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button 
              onClick={() => onNavigateTab && onNavigateTab('dashboard')}
              className="flex items-center gap-1.5 sm:gap-2 text-left group min-w-0"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition flex-shrink-0">
                <div className="h-full w-full rounded-[10px] sm:rounded-[14px] bg-slate-900 flex items-center justify-center">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-xs sm:text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent truncate block max-w-[85px] xs:max-w-[125px] sm:max-w-none">
                  {settings?.websiteName || t.brandName}
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                  PRO
                </span>
              </div>
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* PWA Install Button - visible on tablet/desktop to save mobile space */}
            <div className="hidden md:flex">
              <PWAInstallButton />
            </div>

            {/* Streak Button */}
            <button
              onClick={() => setIsStreakModalOpen(true)}
              className="flex items-center gap-1 rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm active:scale-95 transition flex-shrink-0"
              title="Daily Streak Reward"
            >
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-white flex-shrink-0" />
              <span>{userProfile?.streakDays ?? currentUser?.streakDays ?? 1}d</span>
            </button>

            {/* Balance Pill -> clicks to wallet */}
            <button
              onClick={() => onNavigateTab && onNavigateTab('wallet')}
              className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/40 px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 transition flex-shrink-0"
              title="Wallet & Withdrawals"
            >
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{(displayBalance || 0).toLocaleString()} ৳</span>
            </button>

            {/* Language Switcher - visible on tablet & desktop */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Switch Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase text-[11px]">{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Dark Mode Toggle - visible on tablet & desktop */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] sm:text-[9px] font-extrabold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Auth Button or User Profile Dropdown */}
            {fbUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="User menu"
                >
                  <img
                    src={userProfile?.avatar || fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`}
                    alt=""
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover border border-indigo-500"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400 mr-0.5 hidden sm:block" />
                </button>

                {/* Backdrop to close dropdown on tap outside */}
                {isUserMenuOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                )}

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[85vw] rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {userProfile?.fullName || fbUser.displayName || 'Authenticated Earner'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {fbUser.email || userProfile?.phone || 'Firebase User'}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {userProfile?.membershipTier || 'Free'} Tier
                        </span>
                        {isAdmin && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Super Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Quick Controls for Language & Theme */}
                    <div className="sm:hidden grid grid-cols-2 gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl my-1 border border-slate-200/50 dark:border-slate-700/50">
                      <button
                        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                        className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition"
                      >
                        <Globe className="w-3 h-3 text-indigo-500" />
                        <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
                      </button>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition"
                      >
                        {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-500" />}
                        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                      </button>
                    </div>

                    <div className="py-1 space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateTab && onNavigateTab('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateTab && onNavigateTab('wallet');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Wallet & Withdrawals</span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{(displayBalance || 0).toLocaleString()} ৳</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateTab && onNavigateTab('apps');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Apps & Games Hub
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateTab && onNavigateTab('profile');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Profile Settings
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigateTab && onNavigateTab('admin_panel');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Console Panel</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {/* Guest mobile compact controls */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="sm:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Switch Language"
                >
                  {language === 'en' ? 'বাং' : 'EN'}
                </button>
                <button
                  onClick={toggleTheme}
                  className="sm:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-600" />}
                </button>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-extrabold shadow-sm active:scale-95 transition flex-shrink-0"
                >
                  <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="whitespace-nowrap">{language === 'bn' ? 'সাইন ইন' : 'Sign In'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Streak Claim Modal */}
      <StreakClaimModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />
    </>
  );
};
