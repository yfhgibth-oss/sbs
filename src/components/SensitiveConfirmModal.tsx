import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const SensitiveConfirmModal: React.FC = () => {
  const { sensitiveModalState, closeSensitiveModal } = useApp();
  const { t } = useLanguage();
  const [typedInput, setTypedInput] = useState('');

  if (!sensitiveModalState || !sensitiveModalState.isOpen) return null;

  const isMatching = typedInput.trim().toUpperCase() === 'CONFIRM';

  const handleConfirm = () => {
    if (isMatching) {
      sensitiveModalState.onConfirm();
      setTypedInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60">
        <button
          onClick={closeSensitiveModal}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.sensitiveConfirm}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              Security Audit Protocol #RBAC-CONFIRM
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {sensitiveModalState.title}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {sensitiveModalState.detail}
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t.typeConfirm}
          </label>
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="CONFIRM"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-mono uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            autoFocus
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={closeSensitiveModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isMatching}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition ${
              isMatching
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Confirm Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
