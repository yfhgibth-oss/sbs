import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Sparkles, X, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const BadgeUnlockedModal: React.FC = () => {
  const { unlockedBadgeModal, setUnlockedBadgeModal } = useApp();
  const { language } = useLanguage();

  if (!unlockedBadgeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setUnlockedBadgeModal(null)}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-xl shadow-amber-500/30 text-4xl">
          {unlockedBadgeModal.icon}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>New Achievement Unlocked!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
          {language === 'bn' ? unlockedBadgeModal.nameBn : unlockedBadgeModal.name}
        </h3>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          {language === 'bn' ? unlockedBadgeModal.descriptionBn : unlockedBadgeModal.description}
        </p>

        <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 p-3">
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
            Permanent Perk Unlocked:
          </span>
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
            {language === 'bn' ? unlockedBadgeModal.perkBn : unlockedBadgeModal.perk}
          </span>
        </div>

        <button
          onClick={() => setUnlockedBadgeModal(null)}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white py-2.5 text-xs font-bold text-white dark:text-slate-900 hover:opacity-90 transition"
        >
          <Check className="w-4 h-4" />
          <span>Awesome!</span>
        </button>
      </div>
    </div>
  );
};
