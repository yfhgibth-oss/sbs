import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink, 
  MessageCircle, 
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ReferralViewProps {
  onOpenAuth: () => void;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ onOpenAuth }) => {
  const { fbUser, userProfile, wallet, allUsers, settings } = useFirebase();
  const { t, language } = useLanguage();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const refCode = userProfile?.referralCode || (fbUser ? `REF${fbUser.uid.slice(0, 6).toUpperCase()}` : 'TASKVIP');
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://taskearn.app';
  const referralUrl = `${appOrigin}?ref=${refCode}`;

  // Find users referred by current user
  const invitedUsers = fbUser 
    ? allUsers.filter((u) => u.referredBy === fbUser.uid || u.referredBy === refCode)
    : [];

  const commissionPercent = 5; // 5% performance commission on approved advertiser tasks

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Join Task & Earn to complete verified micro-tasks and earn rewards with bKash/Nagad payout! Use my code ${refCode} to get a 50 ৳ welcome gift: ${referralUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `Join Task & Earn to complete verified micro-tasks! Use code ${refCode}: ${referralUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Direct Affiliate Program
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold">
              1-Tier Performance Based
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'bn' ? 'রেফার করুন ও আজীবন কমিশন পান' : 'Invite Friends, Earn 5% Forever'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-purple-100 leading-relaxed">
            {language === 'bn' 
              ? 'আপনার বন্ধুদের আমন্ত্রণ জানান। আপনার রেফারে যোগ দেওয়া বন্ধুরা যখনই অনুমোদিত টাস্ক সম্পন্ন করবে, আপনি তাদের আয়ের ৫% রিয়েল কমিশন পাবেন।'
              : 'Earn a 5% performance reward each time your invited friends successfully complete verified advertiser tasks.'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Friends Invited
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {invitedUsers.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Direct 1st-level referees</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Referral Commissions Earned
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {(userProfile?.referralEarnings || 0).toLocaleString()}
            </span>
            <span className="font-bold text-emerald-600 text-sm">৳</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Paid from advertiser budgets</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commission Rate
            </span>
            <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-indigo-600 dark:text-indigo-400">
            5.0%
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Lifetime on approved work</p>
        </div>
      </div>

      {/* Share Box & Link */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="font-black text-base text-slate-900 dark:text-white">
            {language === 'bn' ? 'আপনার ইউনিক রেফারেল কোড ও লিঙ্ক' : 'Your Unique Referral Link & Code'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Share this link across social media or direct message to earn automatic credit
          </p>
        </div>

        {!fbUser ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please sign in to generate and track your personal referral code and earnings.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Sign In to View Referral Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Copyable Link Box */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                <span className="truncate">{referralUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Copyable Code Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Referral Code
                </span>
                <p className="font-mono font-black text-xl text-slate-900 dark:text-white tracking-widest">
                  {refCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Fast Share via Messaging:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleShareTelegram}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Anti-Fraud & Regulatory Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Anti-Abuse & Zero-Pyramid Policy:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
            <li>Self-referrals, fake accounts, or multiple registrations on the same device/IP are automatically flagged by anti-fraud scanners.</li>
            <li>No recruitment fee is charged or earned. Commissions are funded purely by advertiser task budgets upon verified completion.</li>
            <li>Single-tier structure only. No multi-level marketing (MLM), binary trees, or downline guarantees.</li>
          </ul>
        </div>
      </div>

      {/* Invited Friends List */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {language === 'bn' ? 'আমন্ত্রিত বন্ধুদের তালিকা' : 'Invited Friends List'}
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {invitedUsers.length} Friends
          </span>
        </div>

        {invitedUsers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No invited friends yet. Share your link above to begin earning 5% commission!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {invitedUsers.map((friend) => (
              <div key={friend.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={friend.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.id}`}
                    alt=""
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{friend.fullName}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{friend.membershipTier} Member</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
