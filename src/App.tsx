import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
import { SensitiveConfirmModal } from './components/SensitiveConfirmModal';
import { LegalModal, PrivacyPolicyContent, TermsOfServiceContent } from './components/PrivacyModals';
import { AuthModal } from './components/AuthModal';
import { AdvertisementPopup } from './components/AdvertisementPopup';
import { AppUpdateModal } from './components/AppUpdateModal';

// Views
import { UserDashboardView } from './views/UserDashboardView';
import { TasksView } from './views/TasksView';
import { AppsPromotionView } from './views/AppsPromotionView';
import { WalletWithdrawalView } from './views/WalletWithdrawalView';
import { MembershipView } from './views/MembershipView';
import { LeaderboardView } from './views/LeaderboardView';
import { ReferralView } from './views/ReferralView';
import { TaskCalendarView } from './views/TaskCalendarView';
import { MissionsView } from './views/MissionsView';
import { CampaignManagerView } from './views/CampaignManagerView';
import { AdminPanelView } from './views/AdminPanelView';
import { AntiFraudView } from './views/AntiFraudView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { PromoCodeView } from './views/PromoCodeView';
import { SupportCenterView } from './views/SupportCenterView';
import { SystemHealthView } from './views/SystemHealthView';
import { AdminSecurityView } from './views/AdminSecurityView';
import { FinancialRulesView } from './views/FinancialRulesView';
import { ProfileView } from './views/ProfileView';

// Mobile Bottom Nav Icons
import { LayoutDashboard, CheckSquare, Wallet, Trophy, Menu as MenuIcon } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { fbUser, isAdmin } = useFirebase();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // 1. Auto-redirect to Admin Panel when logging in with master Gmail or admin account
  const redirectedForUserRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (fbUser) {
      const isMasterAdmin = fbUser.email === 'yfhgibth@gmail.com' || isAdmin;
      if (isMasterAdmin && redirectedForUserRef.current !== fbUser.uid) {
        setActiveTab('admin_panel');
        redirectedForUserRef.current = fbUser.uid;
      }
    } else {
      redirectedForUserRef.current = null;
    }
  }, [fbUser, isAdmin]);

  // 2. Secret URL hash support: typing #admin or #admin_panel in the address bar navigates directly
  React.useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#admin' || h === '#admin_panel' || h === '#console') {
        setActiveTab('admin_panel');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // 3. Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A opens the Admin Console
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin_panel' ? 'dashboard' : 'admin_panel'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <UserDashboardView 
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)} 
            onOpenAuth={() => setAuthModalOpen(true)} 
          />
        );
      case 'tasks':
        return <TasksView />;
      case 'apps':
        return <AppsPromotionView />;
      case 'wallet':
        return <WalletWithdrawalView onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'memberships':
        return <MembershipView onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'referrals':
        return <ReferralView onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'missions':
        return <MissionsView />;
      case 'calendar':
        return <TaskCalendarView />;
      case 'campaigns':
        return <CampaignManagerView />;
      case 'admin_panel':
        return <AdminPanelView />;
      case 'anti_fraud':
        return <AntiFraudView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'promos':
        return <PromoCodeView />;
      case 'support':
        return <SupportCenterView />;
      case 'system_health':
        return <SystemHealthView />;
      case 'admin_security':
        return <AdminSecurityView />;
      case 'financial_rules':
        return <FinancialRulesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <UserDashboardView 
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)} 
            onOpenAuth={() => setAuthModalOpen(true)} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 lg:pb-0">
      
      {/* Header with Auth, Language Toggle, Dark Mode & Admin Button */}
      <Header 
        onToggleSidebarMobile={() => setMobileSidebarOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex mx-auto w-full max-w-7xl">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-bold transition ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-bold transition ${
            activeTab === 'tasks'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-bold transition ${
            activeTab === 'wallet'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-bold transition ${
            activeTab === 'leaderboard'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Ranks</span>
        </button>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400"
        >
          <MenuIcon className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Footer with Zero-Ponzi & Financial Disclaimers + WhatsApp */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenFinancialRules={() => setActiveTab('financial_rules')}
      />

      {/* Overlays, Popups & Modals */}
      <AppUpdateModal />
      <AdvertisementPopup />
      <OfflineIndicator />
      <BadgeUnlockedModal />
      <SensitiveConfirmModal />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <LegalModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy & GDPR Right of Access"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms of Service & Performance-Based Micro-Work Agreement"
      >
        <TermsOfServiceContent />
      </LegalModal>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <FirebaseProvider>
            <AppProvider>
              <MainLayout />
            </AppProvider>
          </FirebaseProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
