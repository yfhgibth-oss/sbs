import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  limit, 
  query 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  FirestoreTask, 
  FirestoreMembershipPlan, 
  FirestoreSettings, 
  FirestoreAdvertisement, 
  FirestoreBanner, 
  FirestoreNotice 
} from './firebaseService';

export const INITIAL_PLANS: FirestoreMembershipPlan[] = [
  {
    id: 'free',
    name: 'Free Member',
    price: 0,
    durationDays: 3650,
    rewardMultiplier: 1.0,
    dailyTaskLimit: 5,
    benefits: ['Standard reward rates', 'Up to 5 daily tasks', 'Standard 2% withdrawal fee', 'Access to community support'],
    active: true
  },
  {
    id: 'silver',
    name: 'Silver Member',
    price: 450,
    durationDays: 30,
    rewardMultiplier: 1.25,
    dailyTaskLimit: 12,
    benefits: ['1.25x Task Reward Multiplier', 'Up to 12 daily tasks', 'Fast-track verification', '1 Free streak freeze'],
    active: true
  },
  {
    id: 'gold',
    name: 'Gold Member',
    price: 950,
    durationDays: 30,
    rewardMultiplier: 1.6,
    dailyTaskLimit: 25,
    benefits: ['1.6x Task Reward Multiplier', 'Up to 25 daily tasks', 'Zero withdrawal fee', 'Priority payout channel', 'Exclusive survey tasks'],
    active: true
  },
  {
    id: 'premium',
    name: 'Premium VIP Member',
    price: 1800,
    durationDays: 60,
    rewardMultiplier: 2.2,
    dailyTaskLimit: 50,
    benefits: ['2.2x High-Yield Multiplier', '50 daily tasks', 'Dedicated WhatsApp manager', 'Highest priority settlement', 'VIP Gold Leaderboard Badge'],
    active: true
  }
];

export const INITIAL_SETTINGS: FirestoreSettings = {
  websiteName: 'Task & Earn — Official Reward Platform',
  websiteLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  whatsAppNumber: '+8801700112233',
  supportEmail: 'support@taskearn.gov.bd',
  minimumWithdrawal: 200,
  referralReward: 50,
  popupAnnouncement: 'Welcome to Task & Earn! Verified micro-rewards with bKash, Nagad, and Bank withdrawals.',
  popupActive: false,
  maintenanceMode: false,
  currency: '৳',
  termsUrl: '#terms',
  privacyUrl: '#privacy',
  bkashMerchant: '01700-112233 (Merchant)',
  nagadMerchant: '01800-445566 (Merchant)',
  rocketMerchant: '01900-778899-2',
  bankDetails: 'City Bank Ltd, Principal Branch, A/C: 110293847501',
  webAppDownloadUrl: 'https://ais-pre-r46akyszv23xyjcgvrwkfo-107022711082.asia-northeast1.run.app',
  appVersionInfo: {
    version: '2.5.0',
    versionCode: 250,
    title: 'নতুন মেগা আপডেট ও সুপার ফাস্ট ক্যাশআউট সুবিধা!',
    titleEn: 'New Mega Update & Ultra-Fast Cashout!',
    releaseNotes: [
      '⚡ নতুন অ্যাপস হাব যুক্ত হয়েছে — যে কেউ অ্যাপ যুক্ত করে প্রমোট করতে পারবে',
      '📲 ওয়েবসাইট থেকেই সরাসরি ওয়েব অ্যাপ ইনস্টল ও আপডেট নোটিফিকেশন',
      '💰 বিকাশ ও নগদ ক্যাশআউট আরও দ্রুত এবং তাৎক্ষণিক ট্র্যাকিং',
      '🛡️ সুপার স্মুথ ও সম্পূর্ণ রেসপন্সিভ মোবাইল ইউজার ইন্টারফেস'
    ],
    forceUpdate: false,
    downloadUrl: '',
    publishedAt: '2026-11-02',
    active: true
  }
};

// Clean arrays: No demo data seeded
export const INITIAL_TASKS: FirestoreTask[] = [];
export const INITIAL_PROMOTED_APPS: any[] = [];
export const INITIAL_ADS: FirestoreAdvertisement[] = [];
export const INITIAL_BANNERS: FirestoreBanner[] = [];
export const INITIAL_NOTICES: FirestoreNotice[] = [];

/**
 * Purge all placeholder/demo records from Firestore collections
 */
export async function purgeAllDemoData(): Promise<{ success: boolean; message: string }> {
  try {
    const demoTaskIds = [
      'task_video_1', 'task_web_1', 'task_app_1', 'task_surv_1', 
      'task_spon_1', 'task_edu_1', 'task_edu_2', 'task_content_1'
    ];
    const demoAdIds = ['ad_pop_1', 'ad_card_1'];
    const demoBannerIds = ['ban_1', 'ban_2'];
    const demoNoticeIds = ['not_1', 'not_2'];
    const demoAppIds = ['app_1', 'app_2', 'app_3'];
    const demoSubIds = ['sub_101', 'sub_102', 'sub_103'];
    const demoUserIds = ['usr_tanvir', 'usr_campaign_mgr', 'usr_super_admin', 'usr_task_mgr', 'usr_payment_mgr', 'usr_support_mgr', 'usr_analyst', 'usr_suspicious_1'];

    const deletes: Promise<any>[] = [];

    // Delete known demo tasks
    for (const id of demoTaskIds) {
      deletes.push(deleteDoc(doc(db, 'tasks', id)).catch(() => {}));
    }

    // Delete any tasks with demo ID prefixes
    try {
      const tasksSnap = await getDocs(collection(db, 'tasks'));
      tasksSnap.forEach((d) => {
        if (demoTaskIds.includes(d.id) || d.id.startsWith('task_demo_')) {
          deletes.push(deleteDoc(doc(db, 'tasks', d.id)).catch(() => {}));
        }
      });
    } catch {}

    // Delete demo ads
    for (const id of demoAdIds) {
      deletes.push(deleteDoc(doc(db, 'advertisements', id)).catch(() => {}));
    }

    // Delete demo banners
    for (const id of demoBannerIds) {
      deletes.push(deleteDoc(doc(db, 'banners', id)).catch(() => {}));
    }

    // Delete demo notices
    for (const id of demoNoticeIds) {
      deletes.push(deleteDoc(doc(db, 'notices', id)).catch(() => {}));
    }

    // Delete demo apps
    for (const id of demoAppIds) {
      deletes.push(deleteDoc(doc(db, 'promotedApps', id)).catch(() => {}));
    }

    // Delete demo submissions
    for (const id of demoSubIds) {
      deletes.push(deleteDoc(doc(db, 'taskSubmissions', id)).catch(() => {}));
    }

    // Delete demo users
    for (const id of demoUserIds) {
      deletes.push(deleteDoc(doc(db, 'users', id)).catch(() => {}));
      deletes.push(deleteDoc(doc(db, 'wallets', id)).catch(() => {}));
    }

    await Promise.allSettled(deletes);

    // Clear local storage demo items
    if (typeof window !== 'undefined') {
      const keysToClear = [
        'taskearn_users',
        'taskearn_tasks',
        'taskearn_submissions',
        'taskearn_withdrawals',
        'taskearn_missions',
        'taskearn_campaigns',
        'taskearn_fraud_flags',
        'taskearn_promo_codes',
        'taskearn_tickets',
        'taskearn_audit_logs'
      ];
      for (const k of keysToClear) {
        localStorage.removeItem(k);
      }
      localStorage.setItem('taskearn_demo_purged_flag', 'true');
    }

    return { success: true, message: 'All demo data successfully removed.' };
  } catch (err) {
    console.error('Failed to purge demo data:', err);
    return { success: false, message: 'Failed to purge demo data' };
  }
}

// Seed function: Ensures core settings and plans exist, and purges demo data
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const settingsRef = doc(db, 'settings', 'global');
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      console.log('Seeding initial platform configuration (settings and plans)...');
      await setDoc(settingsRef, INITIAL_SETTINGS);

      // Seed plans
      for (const plan of INITIAL_PLANS) {
        await setDoc(doc(db, 'memberships', plan.id), plan);
      }
    } else {
      const data = settingsSnap.data() as FirestoreSettings;
      if (!data.appVersionInfo) {
        await setDoc(settingsRef, {
          ...data,
          appVersionInfo: INITIAL_SETTINGS.appVersionInfo,
          webAppDownloadUrl: INITIAL_SETTINGS.webAppDownloadUrl
        }, { merge: true });
      }
    }

    // Purge any legacy demo data from previous runs if not yet purged
    if (typeof window !== 'undefined') {
      const alreadyPurged = localStorage.getItem('taskearn_demo_purged_flag');
      if (!alreadyPurged) {
        await purgeAllDemoData();
      }
    }
  } catch (err) {
    console.warn('Seed operation notice:', err);
  }
}
