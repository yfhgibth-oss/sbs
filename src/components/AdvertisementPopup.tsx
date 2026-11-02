import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { X, ExternalLink, Sparkles } from 'lucide-react';

export const AdvertisementPopup: React.FC = () => {
  const { settings } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (settings?.popupActive && settings?.popupImageUrl) {
      const dismissed = sessionStorage.getItem('promo_popup_dismissed');
      if (!dismissed) {
        // Small delay to let initial page render smoothly
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('promo_popup_dismissed', 'true');
  };

  const handleCta = () => {
    handleClose();
    if (settings?.popupTargetUrl) {
      window.open(settings.popupTargetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen || !settings?.popupActive || !settings?.popupImageUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
          aria-label="Close promotion"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Promo Image */}
        <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800">
          <img
            src={settings.popupImageUrl}
            alt="Sponsored Promotion"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
            <Sparkles className="w-3 h-3" />
            Special Campaign
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              {settings.siteName ? `${settings.siteName} Partner Offer` : 'Sponsored Brand Campaign'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete special sponsor challenges or visit official partner portals to earn bonus task rewards today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCta}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/20 active:scale-98 transition"
            >
              <span>Visit Sponsor Offer</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Skip
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
