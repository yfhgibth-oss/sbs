import React from 'react';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, MessageCircle, AlertTriangle, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenFinancialRules?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenFinancialRules,
}) => {
  const { whatsAppConfig } = useApp();
  const { settings } = useFirebase();
  const { t, language } = useLanguage();

  const currentWhatsApp = settings?.whatsAppNumber || whatsAppConfig.phone;

  const handleWhatsAppClick = () => {
    const encoded = encodeURIComponent(whatsAppConfig.defaultMessage);
    const cleanNumber = currentWhatsApp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Compliance & Disclaimer Banner */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-bold">
                {language === 'bn' ? 'সংবিধিবদ্ধ আর্থিক সতর্কতা:' : 'Statutory Financial & Regulatory Notice:'}
              </span>{' '}
              {language === 'bn'
                ? 'টাস্ক অ্যান্ড আর্ন প্ল্যাটফর্মে কোনো নির্দিষ্ট উপার্জনের নিশ্চয়তা দেওয়া হয় না। সকল রিওয়ার্ড অনুমোদিত কাজের মানের উপর নির্ভরশীল। কোনো মেম্বারশিপ ফি দিয়ে পূর্ববর্তী সদস্যদের কমিশন প্রদান করা হয় না। ফেক ভিডিও ওয়াচিং বা কৃত্রিম ক্লিক সম্পূর্ণভাবে নিষিদ্ধ।'
                : 'Task & Earn does not promise or guarantee fixed earnings. All payouts are strictly performance-based upon verified task completions funded by real advertiser campaign budgets. We enforce zero-Ponzi isolation, mandatory anti-fraud hashing, and strict compliance with local financial consumer protection laws.'}
            </div>
          </div>
        </div>

        {/* Links & WhatsApp Direct Support */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenFinancialRules}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition"
            >
              {t.financialRulesTitle}
            </button>
            <span>•</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Privacy Policy & GDPR
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Terms of Service
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Escrow
            </span>
          </div>

          {/* Configurable WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 shadow-sm transition active:scale-95"
            title="Chat with official support on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t.whatsAppDirect}</span>
            <span className="text-[10px] opacity-80 font-mono">({currentWhatsApp})</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>
            <a href="#admin" className="hover:text-slate-600 dark:hover:text-slate-300 transition cursor-default" title="Admin Entry">©</a> 2026 {settings?.websiteName || 'Task & Earn Platform'}. Built with bank-grade auditability.
          </p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered for fair micro-work & authentic digital engagement
          </p>
        </div>

      </div>
    </footer>
  );
};
