import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { InstallWebAppModal } from './InstallWebAppModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 active:scale-95 transition"
        title="Install Web App on your phone or PC / ওয়েব অ্যাপ ইনস্টল করুন"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.installApp || 'Install App'}</span>
        <span className="sm:hidden">App</span>
      </button>

      <InstallWebAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
