import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useFirebase } from '../context/FirebaseContext';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  Check, 
  X, 
  Monitor, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallWebAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { settings } = useFirebase();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directApkUrl = settings?.webAppDownloadUrl || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="h-full w-full rounded-[14px] bg-slate-900 flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Official Web App
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              ওয়েব অ্যাপ ইনস্টল ও ডাউনলোড করুন
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {settings?.websiteName || 'Task & Earn'} অ্যাপটি আপনার ফোনে সরাসরি ইনস্টল করে অ্যাপের মতো ফুলস্ক্রিনে ব্যবহার করুন। কোনো মেমোরি খরচ নেই এবং সুপার ফাস্ট লোডিং!
        </p>

        {/* Status: Already installed */}
        {isInstalled && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 mb-5">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-800 dark:text-emerald-200 font-bold">
              অভিনন্দন! আপনার ডিভাইসে ইতিমধ্যেই ওয়েব অ্যাপ ইনস্টল করা আছে।
            </div>
          </div>
        )}

        {/* Option 1: Native 1-Click Install Button */}
        {isInstallable && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                সরাসরি ইনস্টল (1-Click Install)
              </span>
              <span className="text-[10px] font-bold text-slate-400">Android & PC</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              নিচের বাটনে চাপ দিলে আপনার মোবাইল বা কম্পিউটারের হোমস্ক্রিনে অ্যাপ আইকন সেভ হয়ে যাবে।
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-xs text-white shadow-md shadow-indigo-600/30 transition active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>হোমস্ক্রিনে অ্যাপ ইনস্টল করুন</span>
            </button>
          </div>
        )}

        {/* Option 2: Direct APK Download (If link set by admin) */}
        {directApkUrl && (
          <div className="mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                সরাসরি Android APK ডাউনলোড
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                APK File
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              অ্যাডমিন দ্বারা নির্ধারিত অফিশিয়াল APK ফাইল সরাসরি আপনার ফোনে ডাউনলোড করে ইনস্টল করুন।
            </p>
            <a
              href={directApkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Android APK ডাউনলোড করুন</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        )}

        {/* Option 3: Manual Guide for iPhone & Android */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            ম্যানুয়াল ইনস্টল পদ্ধতি (Step by Step Guide):
          </h4>

          {/* Android Chrome */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>Android ফোনে (Chrome Browser):</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ১. ব্রাউজারের উপরে ডানপাশের ৩টি ডট <strong>(⋮)</strong> বাটনে চাপ দিন।<br />
              ২. <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> চাপুন।<br />
              ৩. <strong>"Install"</strong> নিশ্চিত করুন। ব্যাস, আপনার অ্যাপ তৈরি!
            </p>
          </div>

          {/* iPhone Safari */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              <Share2 className="w-4 h-4 text-cyan-500" />
              <span>iPhone / iPad এ (Safari Browser):</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ১. সাফারির নিচে থাকা <strong>Share (বক্সের উপর তীর)</strong> আইকনে চাপ দিন।<br />
              ২. নিচে স্ক্রল করে <strong>"Add to Home Screen (হোম স্ক্রিনে যোগ করুন)"</strong> এ চাপুন।<br />
              ৩. উপরে ডানপাশে <strong>"Add"</strong> চাপুন।
            </p>
          </div>

          {/* Desktop PC */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              <Monitor className="w-4 h-4 text-purple-500" />
              <span>ল্যাপটপ বা কম্পিউটার (PC):</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা <strong>Install icon (কম্পিউটার/ডাউনলোড আইকন)</strong> এ ক্লিক করে "Install" সিলেক্ট করুন।
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>১০০% নিরাপদ ও সুরক্ষিত</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>লাইভ নোটিফিকেশন সুবিধা</span>
          </div>
        </div>

        {/* Copy Link & Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyUrl}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {copied ? '✓ লিংক কপি হয়েছে!' : 'ওয়েব অ্যাপ লিংক কপি করুন'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-white text-xs font-bold hover:bg-slate-700 transition"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
