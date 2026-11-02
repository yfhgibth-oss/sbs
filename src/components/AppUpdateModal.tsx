import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Sparkles, Download, CheckCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AppUpdateModal: React.FC = () => {
  const { settings } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  const versionInfo = settings?.appVersionInfo;

  useEffect(() => {
    if (!versionInfo || !versionInfo.active) return;

    const currentSavedVersion = localStorage.getItem('taskearn_installed_version') || '1.0.0';

    // Check if new version is available and not already dismissed in this session
    if (versionInfo.version !== currentSavedVersion && dismissedVersion !== versionInfo.version) {
      // Delay slightly so initial UI is mounted smoothly
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [versionInfo, dismissedVersion]);

  // Listen for custom trigger to open update preview from admin panel
  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('taskearn_preview_update_modal', handleTrigger);
    return () => window.removeEventListener('taskearn_preview_update_modal', handleTrigger);
  }, []);

  if (!isOpen || !versionInfo) return null;

  const handleUpdateNow = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Save current version
    localStorage.setItem('taskearn_installed_version', versionInfo.version);
    setIsOpen(false);

    if (versionInfo.downloadUrl && versionInfo.downloadUrl.trim().length > 0) {
      window.open(versionInfo.downloadUrl, '_blank');
    } else {
      // Refresh to fetch latest PWA cache & service worker assets
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleDismiss = () => {
    if (versionInfo.forceUpdate) return; // Cannot dismiss force updates
    setDismissedVersion(versionInfo.version);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200/50 dark:border-indigo-900/50 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
        
        {!versionInfo.forceUpdate && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Icon Badge */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="h-full w-full rounded-[14px] bg-slate-900 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                New Version {versionInfo.version}
              </span>
              {versionInfo.forceUpdate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                  Required
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              {versionInfo.title || 'নতুন আপডেট উপলভ্য!'}
            </h3>
          </div>
        </div>

        {/* Release Notes */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-500" />
            নতুন যা যা যুক্ত হয়েছে (What's New):
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
            {versionInfo.releaseNotes && versionInfo.releaseNotes.length > 0 ? (
              versionInfo.releaseNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">পারফরম্যান্স ও ইউজার এক্সপেরিয়েন্স আরও দ্রুত করা হয়েছে।</li>
            )}
          </ul>
        </div>

        {/* Info Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-6 px-1">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>আপডেট করলে আপনার অ্যাকাউন্ট বা ব্যালেন্স সুরক্ষিত থাকবে এবং নতুন সুবিধাগুলো সরাসরি চালু হবে।</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleUpdateNow}
            className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 active:scale-98 transition"
          >
            <Download className="w-4 h-4" />
            <span>এখনই আপডেট করুন (Update Now)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!versionInfo.forceUpdate && (
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-300 transition"
            >
              পরে করবো (Later)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
