import React, { useState } from 'react';
import { 
  Award, 
  Megaphone, 
  Image as ImageIcon, 
  Share2, 
  Trophy, 
  Bell, 
  Headphones, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Send,
  Sliders
} from 'lucide-react';
import { 
  FirestoreMembershipPlan,
  FirestoreMembershipPayment,
  FirestoreAdvertisement,
  FirestoreBanner,
  FirestoreNotice,
  FirestoreSupportTicket,
  FirestoreSettings,
  FirestoreAuditLog,
  FirestoreUser
} from '../../services/firebaseService';

// 1. Memberships
interface MembershipsSectionProps {
  memberships: FirestoreMembershipPlan[];
  membershipPayments: FirestoreMembershipPayment[];
  language: 'bn' | 'en';
  onReviewPayment: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onUpdatePlan: (id: string, data: Partial<FirestoreMembershipPlan>) => Promise<void>;
  showToast: (msg: string) => void;
}

export const MembershipsSection: React.FC<MembershipsSectionProps> = ({
  memberships,
  membershipPayments,
  language,
  onReviewPayment,
  onUpdatePlan,
  showToast
}) => {
  const pendingPayments = membershipPayments.filter((p) => p.status === 'pending');

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-6">
      <div>
        <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'bn' ? 'মেম্বারশিপ প্যাকেজ ও আপগ্রেড পেমেন্ট' : 'Membership Tiers & Subscriptions'}</span>
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
          {language === 'bn' 
            ? 'ইউজারদের প্রিমিয়াম মেম্বারশিপ ফি যাচাই করে অনুমোদন করুন এবং রিওয়ার্ড মাল্টিপ্লায়ার পরিচালনা করুন।' 
            : 'Review upgrade subscription payments and configure tier multipliers.'}
        </p>
      </div>

      {/* Pending Payment Verification Queue */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
          <span>{language === 'bn' ? 'আপগ্রেড পেমেন্ট যাচাই' : 'Pending Upgrades'}</span>
          <span className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {pendingPayments.length}
          </span>
        </h4>

        {membershipPayments.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 sm:py-4 text-center">
            {language === 'bn' ? 'কোনো মেম্বারশিপ আপগ্রেড পেমেন্ট জমা নেই।' : 'No membership upgrade payments submitted yet.'}
          </p>
        ) : (
          membershipPayments.map((p) => (
            <div
              key={p.id}
              className="p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs shadow-xs"
            >
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">{p.userName || 'Earner'}</span>
                  <span className="text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                    {p.planName} ({p.price} ৳)
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md ${
                    p.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : p.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  Method: <strong className="uppercase font-medium text-slate-700 dark:text-slate-300">{p.paymentMethod}</strong> · Account: <span className="font-mono">{p.senderAccount}</span> · TrxID: <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{p.transactionId}</span>
                </p>
              </div>

              {p.status === 'pending' && (
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      await onReviewPayment(p.id, 'approved');
                      showToast(`Approved ${p.planName} upgrade for ${p.userName}!`);
                    }}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[10px] sm:text-xs transition-colors"
                  >
                    ✓ {language === 'bn' ? 'অনুমোদন' : 'Approve'}
                  </button>
                  <button
                    onClick={async () => {
                      await onReviewPayment(p.id, 'rejected');
                      showToast('Membership payment rejected.');
                    }}
                    className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-[10px] sm:text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Tier Plans Config */}
      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {language === 'bn' ? 'সক্রিয় মেম্বারশিপ টায়ার ও সুবিধা' : 'Active Tier Plans & Multipliers'}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
          {memberships.map((plan) => (
            <div
              key={plan.id}
              className="p-2.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 sm:space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white capitalize truncate">
                    {plan.name}
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs">
                    {plan.price === 0 ? 'FREE' : `${plan.price} ৳`}
                  </span>
                </div>
                <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-slate-500">
                  <p>Multiplier: <strong className="text-slate-800 dark:text-slate-200">{plan.rewardMultiplier}x</strong></p>
                  <p>Daily Tasks: <strong className="text-slate-800 dark:text-slate-200">{plan.dailyTaskLimit}</strong></p>
                  <p>Validity: <strong className="text-slate-800 dark:text-slate-200">{plan.durationDays} days</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={async () => {
                    const newPrice = prompt(`Enter new price in BDT for ${plan.name}:`, String(plan.price));
                    if (newPrice !== null && !isNaN(Number(newPrice))) {
                      await onUpdatePlan(plan.id, { price: Number(newPrice) });
                      showToast(`Price updated to ${newPrice} ৳`);
                    }
                  }}
                  className="flex-1 py-0.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px] font-medium hover:bg-slate-100"
                >
                  Price
                </button>
                <button
                  onClick={async () => {
                    const newMult = prompt(`Enter reward multiplier (e.g. 1.5, 2.0):`, String(plan.rewardMultiplier));
                    if (newMult !== null && !isNaN(Number(newMult))) {
                      await onUpdatePlan(plan.id, { rewardMultiplier: Number(newMult) });
                      showToast(`Multiplier updated to ${newMult}x`);
                    }
                  }}
                  className="flex-1 py-0.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px] font-medium hover:bg-slate-100"
                >
                  Multiplier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Advertisements
interface AdvertisementsSectionProps {
  advertisements: FirestoreAdvertisement[];
  language: 'bn' | 'en';
  onOpenNewAd: () => void;
  onUpdateAd: (id: string, data: Partial<FirestoreAdvertisement>) => Promise<void>;
  onDeleteAd: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const AdvertisementsSection: React.FC<AdvertisementsSectionProps> = ({
  advertisements,
  language,
  onOpenNewAd,
  onUpdateAd,
  onDeleteAd,
  showToast
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{language === 'bn' ? 'বিজ্ঞাপন ও স্পন্সর ক্যাম্পেইন' : 'Advertisements & Popups'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'ওয়েবসাইটে পপআপ ও স্পন্সর ব্যানার প্রদর্শন এবং ক্লিক লিংক পরিচালনা করুন।' 
              : 'Deploy modal popups and banner placements linking to external advertiser targets.'}
          </p>
        </div>

        <button
          onClick={onOpenNewAd}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{language === 'bn' ? 'নতুন বিজ্ঞাপন' : 'Create Ad'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {advertisements.length === 0 ? (
          <div className="col-span-full py-10 text-center text-xs text-slate-400">
            {language === 'bn' ? 'কোনো বিজ্ঞাপন ক্যাম্পেইন নেই।' : 'No advertisements created yet.'}
          </div>
        ) : (
          advertisements.map((ad) => (
            <div
              key={ad.id}
              className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="h-20 sm:h-32 w-full bg-slate-100 dark:bg-slate-800 relative">
                <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-semibold uppercase">
                  {ad.placement}
                </div>
              </div>

              <div className="p-2 sm:p-3.5 space-y-1 sm:space-y-2 flex-1">
                <h4 className="font-semibold text-[11px] sm:text-xs text-slate-900 dark:text-white line-clamp-1">{ad.title}</h4>
                <a
                  href={ad.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
                >
                  {ad.targetUrl}
                </a>
              </div>

              <div className="px-2 py-1.5 sm:px-3.5 sm:py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={async () => {
                    await onUpdateAd(ad.id, { active: !ad.active });
                    showToast(`Ad ${!ad.active ? 'Activated' : 'Paused'}`);
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md font-medium text-[9px] sm:text-[10px] uppercase ${
                    ad.active 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {ad.active ? 'Active' : 'Paused'}
                </button>

                <button
                  onClick={async () => {
                    if (confirm('Delete this advertisement?')) {
                      await onDeleteAd(ad.id);
                      showToast('Ad deleted.');
                    }
                  }}
                  className="p-1 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 3. Homepage Banners
interface BannersSectionProps {
  banners: FirestoreBanner[];
  language: 'bn' | 'en';
  onOpenNewBanner: () => void;
  onUpdateBanner: (id: string, data: Partial<FirestoreBanner>) => Promise<void>;
  onDeleteBanner: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const BannersSection: React.FC<BannersSectionProps> = ({
  banners,
  language,
  onOpenNewBanner,
  onUpdateBanner,
  onDeleteBanner,
  showToast
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
            <span>{language === 'bn' ? 'হোমপেজ ক্যারোসেল ব্যানার' : 'Homepage Hero Banners'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'ইউজার ড্যাশবোর্ডের শীর্ষ স্লাইডার ব্যানার গ্রাফিক্স ও প্রমোশন পরিচালনা করুন।' 
              : 'Add promo slides shown prominently in the user dashboard hero carousel.'}
          </p>
        </div>

        <button
          onClick={onOpenNewBanner}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{language === 'bn' ? 'নতুন ব্যানার' : 'Add Banner'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        {banners.map((ban) => (
          <div
            key={ban.id}
            className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="h-24 sm:h-36 w-full bg-slate-100 dark:bg-slate-800">
              <img src={ban.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="p-2 sm:p-3.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-semibold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">{ban.title}</h4>
                {ban.linkUrl && (
                  <span className="text-[10px] sm:text-[11px] text-slate-400 truncate block">{ban.linkUrl}</span>
                )}
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={async () => {
                    await onUpdateBanner(ban.id, { active: !ban.active });
                    showToast(`Banner ${!ban.active ? 'Enabled' : 'Disabled'}`);
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md font-medium text-[9px] sm:text-[10px] ${
                    ban.active 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {ban.active ? 'Live' : 'Hidden'}
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete banner?')) {
                      await onDeleteBanner(ban.id);
                      showToast('Banner deleted.');
                    }
                  }}
                  className="p-1 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Referrals
interface ReferralsSectionProps {
  settings: FirestoreSettings | null;
  language: 'bn' | 'en';
  onUpdateSettings: (data: Partial<FirestoreSettings>) => Promise<void>;
  showToast: (msg: string) => void;
}

export const ReferralsSection: React.FC<ReferralsSectionProps> = ({
  settings,
  language,
  onUpdateSettings,
  showToast
}) => {
  const [commRate, setCommRate] = useState(settings?.referralReward || 5);
  const [welcomeBonus, setWelcomeBonus] = useState(50);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      <div>
        <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          <span>{language === 'bn' ? 'এফিলিয়েট ও রেফারেল কমিশন পলিসি' : 'Affiliate & Referral Engine'}</span>
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
          {language === 'bn' 
            ? 'ইউজারদের রেফারেল ইনকাম শতকরা হার ও জয়েনিং ওয়েলকাম বোনাস কনফিগার করুন।' 
            : 'Configure lifetime commission tiers and sign-up bonus credits.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300 block">
            Commission Rate (%):
          </label>
          <input
            type="number"
            value={commRate}
            onChange={(e) => setCommRate(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 font-mono text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300 block">
            Referral Welcome Bonus (৳):
          </label>
          <input
            type="number"
            value={welcomeBonus}
            onChange={(e) => setWelcomeBonus(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 bg-white dark:bg-slate-800 font-mono text-[11px] sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={async () => {
          await onUpdateSettings({ referralReward: commRate });
          showToast('Referral commission rates saved!');
        }}
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs"
      >
        <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{language === 'bn' ? 'সেটিংস সংরক্ষণ' : 'Save Parameters'}</span>
      </button>
    </div>
  );
};

// 5. Leaderboard Moderation
interface LeaderboardSectionProps {
  allUsers: FirestoreUser[];
  language: 'bn' | 'en';
  onTogglePrivacy: (uid: string, current: string | undefined) => Promise<void>;
  showToast: (msg: string) => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  allUsers,
  language,
  onTogglePrivacy,
  showToast
}) => {
  const sorted = [...allUsers].sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0));

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{language === 'bn' ? 'লিডারবোর্ড ও টপ আর্নার মডারেশন' : 'Leaderboard Moderation'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'পাবলিক লিডারবোর্ড র‍্যাঙ্কিং পর্যবেক্ষণ এবং সন্দেহজনক একাউন্ট হাইড বা আনহাইড করুন।' 
            : 'Moderate public leaderboards and toggle visibility of flagged earner profiles.'}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[480px]">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2.5 px-3">Rank & Earner</th>
              <th className="py-2.5 px-3">Total Earned</th>
              <th className="py-2.5 px-3">Visibility</th>
              <th className="py-2.5 px-3 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {sorted.map((u, i) => (
              <tr key={u.uid} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                  <span className="font-mono text-slate-400 mr-2">#{i + 1}</span>
                  {u.fullName || 'Earner'}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {(u.totalEarned ?? 50).toLocaleString()} ৳
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
                    u.privacyLeaderboard === 'hidden'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {u.privacyLeaderboard || 'Public'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={async () => {
                      await onTogglePrivacy(u.uid, u.privacyLeaderboard);
                      showToast(`Visibility toggled for ${u.fullName}`);
                    }}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    {u.privacyLeaderboard === 'hidden' ? 'Unhide' : 'Hide from Public'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Broadcast Notices
interface NoticesSectionProps {
  notices: FirestoreNotice[];
  language: 'bn' | 'en';
  onOpenNewNotice: () => void;
  onDeleteNotice: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({
  notices,
  language,
  onOpenNewNotice,
  onDeleteNotice,
  showToast
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span>{language === 'bn' ? 'ব্রডকাস্ট ঘোষণা ও পুশ নোটিশ' : 'Broadcast Announcements & Notices'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'সকল ব্যবহারকারীর অ্যাপ ও ওয়েবসাইটে জরুরি নোটিশ ও পেমেন্ট আপডেট ব্রডকাস্ট করুন।' 
              : 'Dispatch urgent notices visible instantaneously to all earners.'}
          </p>
        </div>

        <button
          onClick={onOpenNewNotice}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{language === 'bn' ? 'নতুন নোটিশ' : 'Publish Notice'}</span>
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {notices.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 sm:py-8 text-center">
            {language === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No broadcast notices published.'}
          </p>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className="p-2.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-2.5 sm:gap-3 text-xs shadow-xs"
            >
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60">
                    {n.category}
                  </span>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{n.title}</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] sm:text-xs">{n.content}</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">
                  {n.createdAt ? n.createdAt.substring(0, 16) : 'Recent'}
                </span>
              </div>

              <button
                onClick={async () => {
                  if (confirm('Delete notice?')) {
                    await onDeleteNotice(n.id);
                    showToast('Notice deleted.');
                  }
                }}
                className="p-1 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors shrink-0"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 7. Support Helpdesk
interface SupportSectionProps {
  supportTickets: FirestoreSupportTicket[];
  language: 'bn' | 'en';
  onReplyTicket: (id: string, text: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  supportTickets,
  language,
  onReplyTicket,
  showToast
}) => {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Headphones className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'bn' ? 'গ্রাহক সহায়তা ও হেল্পডেস্ক টিকিট' : 'Support Helpdesk Tickets'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'ইউজারদের পাঠানো অভিযোগ বা জিজ্ঞাসা সরাসরি রিপ্লাই দিন।' 
            : 'Resolve earner inquiries with threaded conversations.'}
        </p>
      </div>

      <div className="space-y-4">
        {supportTickets.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            {language === 'bn' ? 'কোনো সাপোর্ট টিকিট নেই।' : 'No support tickets open.'}
          </p>
        ) : (
          supportTickets.map((tkt) => (
            <div
              key={tkt.id}
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{tkt.userName || 'Earner'}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {tkt.category}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  tkt.status === 'resolved' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {tkt.status}
                </span>
              </div>

              <p className="font-semibold text-slate-900 dark:text-white text-xs">{tkt.subject}</p>

              {/* Messages Feed */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 max-h-44 overflow-y-auto space-y-2">
                {tkt.messages.map((m) => (
                  <div key={m.id} className="text-[11px] leading-relaxed">
                    <strong className={m.senderRole === 'admin' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-800 dark:text-slate-200 font-semibold'}>
                      {m.senderName}:
                    </strong>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{m.text}</span>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'সাপোর্ট রিপ্লাই লিখুন...' : 'Type response to earner...'}
                  value={activeTicketId === tkt.id ? replyText : ''}
                  onFocus={() => setActiveTicketId(tkt.id)}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={async () => {
                    if (replyText.trim()) {
                      await onReplyTicket(tkt.id, replyText.trim());
                      setReplyText('');
                      showToast('Reply dispatched to earner!');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পাঠান' : 'Reply'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 8. Website Settings
interface WebsiteSettingsSectionProps {
  settings: FirestoreSettings | null;
  language: 'bn' | 'en';
  onSaveSettings: (data: Partial<FirestoreSettings>) => Promise<void>;
  showToast: (msg: string) => void;
}

export const WebsiteSettingsSection: React.FC<WebsiteSettingsSectionProps> = ({
  settings,
  language,
  onSaveSettings,
  showToast
}) => {
  const [formData, setFormData] = useState<Partial<FirestoreSettings>>({
    websiteName: settings?.websiteName || 'Task & Earn BD',
    whatsAppNumber: settings?.whatsAppNumber || '+8801700000000',
    supportEmail: settings?.supportEmail || 'support@taskearn.com',
    minimumWithdrawal: settings?.minimumWithdrawal || 200,
    maintenanceMode: settings?.maintenanceMode || false,
    popupAnnouncement: settings?.popupAnnouncement || 'Welcome to Task & Earn BD! Complete tasks to earn real money daily.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
    showToast('Platform settings saved successfully!');
  };

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>{language === 'bn' ? 'ওয়েবসাইট ও ব্র্যান্ডিং সেটিংস' : 'Website & Brand Configuration'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'ওয়েবসাইটের নাম, হোয়াটসঅ্যাপ হেল্পলাইন, মিনিমাম উইথড্রয়াল লিমিট ও মেইনটেন্যান্স মোড নিয়ন্ত্রণ।' 
            : 'Configure site-wide parameters, support hotlines, and cashout thresholds.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">Website Name:</label>
            <input
              type="text"
              value={formData.websiteName || ''}
              onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">WhatsApp Hotline:</label>
            <input
              type="text"
              value={formData.whatsAppNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">Support Email:</label>
            <input
              type="email"
              value={formData.supportEmail || ''}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">Minimum Withdrawal (৳):</label>
            <input
              type="number"
              value={formData.minimumWithdrawal || 200}
              onChange={(e) => setFormData({ ...formData, minimumWithdrawal: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">Popup Modal Announcement:</label>
            <textarea
              rows={2}
              value={formData.popupAnnouncement || ''}
              onChange={(e) => setFormData({ ...formData, popupAnnouncement: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-white block">Maintenance Mode</span>
              <p className="text-[11px] text-slate-500">Temporarily freeze earner logins and tasks for maintenance</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
                formData.maintenanceMode ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {formData.maintenanceMode ? 'Active (Maintenance ON)' : 'Disabled (Live)'}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'সকল সেটিংস সংরক্ষণ করুন' : 'Save Platform Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// 9. Admin Staff Management
interface AdminManagementSectionProps {
  allUsers: FirestoreUser[];
  language: 'bn' | 'en';
  onUpdateRole: (uid: string, role: any) => Promise<void>;
  showToast: (msg: string) => void;
}

export const AdminManagementSection: React.FC<AdminManagementSectionProps> = ({
  allUsers,
  language,
  onUpdateRole,
  showToast
}) => {
  const staff = allUsers.filter((u) => u.role !== 'user');

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'bn' ? 'স্টাফ ও অ্যাডমিন এক্সেস কন্ট্রোল' : 'Staff Access & Administration'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'সুপার অ্যাডমিন, ম্যানেজার এবং মডারেটর একাউন্টসমূহের তালিকা ও অনুমতি নিয়ন্ত্রণ।' 
            : 'Super Admins, Managers, and privileged credentials directory.'}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2.5 px-3">Staff Member</th>
              <th className="py-2.5 px-3">Email</th>
              <th className="py-2.5 px-3">Assigned Role</th>
              <th className="py-2.5 px-3 text-right">Access Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
              <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                Super Administrator
              </td>
              <td className="py-3 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                yfhgibth@gmail.com
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold uppercase text-[10px] border border-amber-200/60">
                  Super Admin
                </span>
              </td>
              <td className="py-3 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                Full Master Access
              </td>
            </tr>

            {staff.map((u) => (
              <tr key={u.uid} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{u.fullName}</td>
                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold uppercase text-[10px]">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={async () => {
                      await onUpdateRole(u.uid, 'user');
                      showToast(`Revoked staff role from ${u.fullName}`);
                    }}
                    className="text-rose-600 dark:text-rose-400 font-medium hover:underline text-[11px]"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 10. Immutable Activity Logs
interface ActivityLogsSectionProps {
  auditLogs: FirestoreAuditLog[];
  language: 'bn' | 'en';
}

export const ActivityLogsSection: React.FC<ActivityLogsSectionProps> = ({
  auditLogs,
  language
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'bn' ? 'অপরিবর্তনযোগ্য প্রশাসনিক অ্যাক্টিভিটি লগ' : 'Activity & Audit Trail'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'সকল অ্যাডমিন কার্যক্রম ও সিদ্ধান্তের স্বয়ংক্রিয় কালানুক্রমিক প্রমাণ।' 
            : 'Immutable, chronological record of all administrative operations.'}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[500px]">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-700 z-10">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2.5 px-3">Operator</th>
              <th className="py-2.5 px-3">Action Type</th>
              <th className="py-2.5 px-3">Event Details</th>
              <th className="py-2.5 px-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs text-slate-400">
                  {language === 'bn' ? 'কোনো লগ পাওয়া যায়নি।' : 'No audit records logged yet.'}
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {log.adminName || 'Admin'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-md truncate">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp ? log.timestamp.substring(0, 19).replace('T', ' ') : 'Just now'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
