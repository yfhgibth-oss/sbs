import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
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

export const INITIAL_TASKS: FirestoreTask[] = [
  {
    id: 'task_video_1',
    title: 'Financial Security: Spotting Guaranteed-Return Scams (Video & Quiz)',
    titleBn: 'আর্থিক নিরাপত্তা: নিশ্চিত রিটার্ন প্রতারণা শনাক্তকরণ (ভিডিও ও কুইজ)',
    description: 'Watch the full 90-second educational clip by Bangladesh Consumer Defense and complete the 1-question verification quiz to confirm attentiveness.',
    descriptionBn: 'বাংলাদেশ কনজিউমার ডিফেন্সের ৯০ সেকেন্ডের সচেতনতামূলক ভিডিওটি সম্পূর্ণ দেখুন এবং মনোযোগ যাচাইয়ের জন্য ১টি কুইজের সঠিক উত্তর দিন।',
    taskType: 'video',
    externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    rewardAmount: 35,
    xpReward: 60,
    eligibleTiers: ['free', 'silver', 'gold', 'premium'],
    minTimeOnTaskSeconds: 90,
    dailyLimit: 500,
    totalLimit: 5000,
    completedCount: 384,
    instructions: '1. Watch the video for at least 90 seconds.\n2. Answer the anti-fraud question below.\n3. Submit your response.',
    instructionsBn: '১. ভিডিওটি কমপক্ষে ৯০ সেকেন্ড সম্পূর্ণ দেখুন।\n২. নিচে দেওয়া প্রতারণা-রোধী প্রশ্নের সঠিক উত্তর দিন।\n৩. উত্তর সাবমিট করে পুরস্কার বুঝে নিন।',
    proofType: 'text',
    quizQuestion: 'Why should members avoid schemes promising 100% daily guaranteed returns?',
    quizQuestionBn: 'ব্যবহারকারীদের কেন প্রতিদিন ১০০% নিশ্চিত আয়ের প্রলোভনযুক্ত স্কিম পরিহার করা উচিত?',
    quizOptions: [
      'Because genuine investments always carry market risk, and guaranteed returns indicate unbacked Ponzi structures',
      'Because banks only work on weekends',
      'Because cryptocurrency is backed by gold'
    ],
    quizOptionsBn: [
      'কারণ বাস্তবসম্মত সব বিনিয়োগেই ঝুঁকি থাকে, আর ১০০% নিশ্চিত আয়ের প্রলোভন মূলত অনিরাপদ পঞ্জি প্রতারণার লক্ষণ',
      'কারণ ব্যাংক কেবল ছুটির দিনে কাজ করে',
      'কারণ ক্রিপ্টোকারেন্সি সোনার ওপর প্রতিষ্ঠিত'
    ],
    correctOptionIndex: 0,
    status: 'active',
    createdAt: '2026-10-31'
  },
  {
    id: 'task_web_1',
    title: 'Visit AmarTech E-Commerce Platform & Review Navigation',
    titleBn: 'অমরটেক ই-কমার্স প্ল্যাটফর্ম পরিদর্শন ও নেভিগেশন রিভিউ',
    description: 'Browse the new AmarTech gadget portal for at least 60 seconds. Test search filters and submit your feedback note.',
    descriptionBn: 'নতুন অমরটেক গ্যাজেট পোর্টালে কমপক্ষে ৬০ সেকেন্ড সময় কাটান। সার্চ ফিল্টার পরীক্ষা করুন এবং আপনার মতামত লিখে জমা দিন।',
    taskType: 'website',
    externalUrl: 'https://example.com/amartech-store',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    rewardAmount: 25,
    xpReward: 40,
    eligibleTiers: ['free', 'silver', 'gold', 'premium'],
    minTimeOnTaskSeconds: 60,
    dailyLimit: 300,
    totalLimit: 3000,
    completedCount: 192,
    instructions: '1. Click "Open Website".\n2. Explore at least 2 product pages.\n3. Return here and write what item you browsed.',
    instructionsBn: '১. "ওপেন ওয়েবসাইট" বাটনে ক্লিক করুন।\n২. কমপক্ষে ২টি পণ্যের বিবরণ দেখুন।\n৩. এখানে ফিরে এসে আপনি যে পণ্যটি ব্রাউজ করেছেন তার নাম লিখুন।',
    proofType: 'text',
    status: 'active',
    createdAt: '2026-10-31'
  },
  {
    id: 'task_app_1',
    title: 'FinTech App Biometric Sign-in Review (Screenshot Proof)',
    titleBn: 'ফিনটেক অ্যাপের বায়োমেট্রিক সাইন-ইন রিভিউ (স্ক্রিনশট প্রমাণ)',
    description: 'Download the sandbox APK of AmarWallet and test the fingerprint login screen. Capture a screenshot of the login confirmation.',
    descriptionBn: 'অমরওয়ালেট-এর স্যান্ডবক্স টেস্ট অ্যাপ ডাউনলোড করে ফিঙ্গারপ্রিন্ট লগইন স্ক্রিন পরীক্ষা করুন। লগইন সফল হওয়ার একটি স্ক্রিনশট আপলোড করুন।',
    taskType: 'image',
    externalUrl: 'https://example.com/amarwallet-test',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
    rewardAmount: 70,
    xpReward: 100,
    eligibleTiers: ['silver', 'gold', 'premium'],
    minTimeOnTaskSeconds: 120,
    dailyLimit: 150,
    totalLimit: 1000,
    completedCount: 88,
    instructions: '1. Install sandbox test app.\n2. Complete biometric test.\n3. Upload screenshot image URL.',
    instructionsBn: '১. স্যান্ডবক্স টেস্ট অ্যাপটি ডাউনলোড/ওপেন করুন।\n২. বায়োমেট্রিক লগইন পরীক্ষা সম্পন্ন করুন।\n৩. সফল লগইন স্ক্রিনের স্ক্রিনশট আপলোড করুন।',
    proofType: 'screenshot',
    status: 'active',
    createdAt: '2026-10-31'
  },
  {
    id: 'task_surv_1',
    title: 'National Digital Wallet Usage Survey 2026',
    titleBn: 'জাতীয় ডিজিটাল ওয়ালেট ব্যবহার জরিপ ২০২৬',
    description: 'Provide honest feedback regarding your preferred mobile banking method (bKash vs Nagad) and cash-out fee preferences.',
    descriptionBn: 'আপনার পছন্দের মোবাইল ব্যাংকিং পদ্ধতি (বিকাশ বনাম নগদ) এবং ক্যাশ-আউট চার্জ সম্পর্কে সঠিক ও বাস্তবসম্মত মতামত দিন।',
    taskType: 'survey',
    externalUrl: 'https://example.com/mfs-survey-2026',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    rewardAmount: 45,
    xpReward: 70,
    eligibleTiers: ['free', 'silver', 'gold', 'premium'],
    minTimeOnTaskSeconds: 90,
    dailyLimit: 400,
    totalLimit: 2000,
    completedCount: 240,
    instructions: 'Complete all 8 survey questions on the form and paste the final receipt confirmation code.',
    instructionsBn: 'জরিপ ফর্মের সকল প্রশ্নের সঠিক উত্তর দিন এবং প্রাপ্ত কনফার্মেশন কোডটি এখানে পেস্ট করুন।',
    proofType: 'text',
    status: 'active',
    createdAt: '2026-10-31'
  },
  {
    id: 'task_spon_1',
    title: 'Green Energy Bangladesh Brand Advocacy',
    titleBn: 'গ্রিন এনার্জি বাংলাদেশ সামাজিক প্রচারণা',
    description: 'Share SolarTech BD clean energy infographic on your public social media handle and paste the live post URL.',
    descriptionBn: 'সোলারটেক বিডির পরিবেশবান্ধব বিদ্যুৎ বিষয়ক ইনফোগ্রাফিক আপনার সোশ্যাল মিডিয়ায় শেয়ার করুন এবং পোস্টের লিংক জমা দিন।',
    taskType: 'sponsored',
    externalUrl: 'https://example.com/solartech-advocacy',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80',
    rewardAmount: 50,
    xpReward: 80,
    eligibleTiers: ['gold', 'premium'],
    minTimeOnTaskSeconds: 60,
    dailyLimit: 100,
    totalLimit: 500,
    completedCount: 64,
    instructions: 'Post publicly with hashtag #GreenEnergyBD and paste your post link.',
    instructionsBn: 'হ্যাশট্যাগ #GreenEnergyBD সহ ফেসবুকে বা সোশ্যাল মিডিয়ায় পোস্ট করুন এবং পোস্টের লাইভ লিংক জমা দিন।',
    proofType: 'url',
    status: 'active',
    createdAt: '2026-10-31'
  }
];

export const INITIAL_SETTINGS: FirestoreSettings = {
  websiteName: 'Task & Earn — Official Reward Platform',
  websiteLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  whatsAppNumber: '+8801700112233',
  supportEmail: 'support@taskearn.gov.bd',
  minimumWithdrawal: 200,
  referralReward: 50,
  popupAnnouncement: '🎉 Welcome to Task & Earn! 100% verified, advertiser-escrowed rewards with instant bKash, Nagad, and Bank withdrawals.',
  popupActive: true,
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

export const INITIAL_PROMOTED_APPS = [
  {
    id: 'app_1',
    title: 'AmarPay — Smart Digital Wallet & MFS',
    developer: 'AmarPay FinTech BD',
    iconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
    category: 'finance',
    downloadUrl: 'https://play.google.com',
    appType: 'android_apk',
    rewardAmount: 65,
    xpReward: 90,
    description: 'স্মার্ট ওয়ালেট ও দ্রুত পেমেন্ট সুবিধা। অ্যাপটি ইনস্টল করে ওপেন করুন এবং ৩০ সেকেন্ড ব্রাউজ করুন।',
    instructions: '১. অ্যাপটি ইনস্টল করুন।\n২. অ্যাপ ওপেন করে স্ক্রিনশট নিন।\n৩. প্রুফ বক্সে স্ক্রিনশট জমা দিন।',
    proofRequired: 'screenshot',
    rating: 4.8,
    downloadsCount: 1420,
    featured: true,
    status: 'active',
    submittedBy: 'admin',
    submittedByName: 'TaskEarn Official',
    submittedAt: '2026-11-01'
  },
  {
    id: 'app_2',
    title: 'QuizMaster BD — General Knowledge & Brain Game',
    developer: 'Deshi Gaming Studios',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    category: 'games',
    downloadUrl: 'https://play.google.com',
    appType: 'play_store',
    rewardAmount: 45,
    xpReward: 70,
    description: 'মজার সাধারণ জ্ঞান কুইজ খেলে প্রতিদিন পয়েন্ট জিতুন। ইনস্টল করে লেভেল ১ শেষ করুন।',
    instructions: '১. প্লে স্টোর থেকে ডাউনলোড করুন।\n২. লেভেল ১ শেষ করে প্রোফাইল স্ক্রিনশট দিন।',
    proofRequired: 'screenshot',
    rating: 4.9,
    downloadsCount: 2380,
    featured: true,
    status: 'active',
    submittedBy: 'admin',
    submittedByName: 'TaskEarn Official',
    submittedAt: '2026-11-01'
  },
  {
    id: 'app_3',
    title: 'Shadhin News — Bangladesh Live News Reader',
    developer: 'Dhaka Media Labs',
    iconUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80',
    category: 'social',
    downloadUrl: 'https://play.google.com',
    appType: 'android_apk',
    rewardAmount: 35,
    xpReward: 50,
    description: 'সবচেয়ে দ্রুত ব্রেকিং নিউজ ও আবহাওয়া আপডেট পান। ইনস্টল করে অ্যাকাউন্ট খুলুন।',
    instructions: 'অ্যাপ ডাউনলোড করে ওপেন করুন এবং প্রুফ জমা দিন।',
    proofRequired: 'screenshot',
    rating: 4.7,
    downloadsCount: 980,
    featured: false,
    status: 'active',
    submittedBy: 'admin',
    submittedByName: 'TaskEarn Official',
    submittedAt: '2026-11-02'
  }
];

export const INITIAL_ADS: FirestoreAdvertisement[] = [
  {
    id: 'ad_pop_1',
    title: 'Double XP Weekend Sprint!',
    description: 'Complete any 3 educational quizzes this weekend to unlock an automatic 2x XP booster.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    targetUrl: '#tasks',
    placement: 'popup',
    active: true,
    impressions: 1240,
    clicks: 410
  },
  {
    id: 'ad_card_1',
    title: 'Special Gold Membership Discount',
    description: 'Upgrade to Gold tier today to eliminate all withdrawal processing fees permanently.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    targetUrl: '#membership',
    placement: 'offer_card',
    active: true,
    impressions: 890,
    clicks: 195
  }
];

export const INITIAL_BANNERS: FirestoreBanner[] = [
  {
    id: 'ban_1',
    title: 'Fair Digital Micro-Work in Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#tasks',
    order: 1,
    active: true
  },
  {
    id: 'ban_2',
    title: 'Fast bKash & Nagad Withdrawals',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d998?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#wallet',
    order: 2,
    active: true
  }
];

export const INITIAL_NOTICES: FirestoreNotice[] = [
  {
    id: 'not_1',
    title: 'Scheduled MFS Settlement Windows',
    content: 'All withdrawal requests submitted before 6:00 PM BST are processed same-day. Ensure your bKash/Nagad wallet numbers are active.',
    category: 'payment',
    important: true,
    createdAt: '2026-10-31 09:00'
  },
  {
    id: 'not_2',
    title: 'Anti-Fake Engagement Policy Enforcement',
    content: 'Submitting recycled screenshots or using automated bots will lead to immediate task rejection. We value authentic user engagement.',
    category: 'general',
    important: false,
    createdAt: '2026-10-30 14:00'
  }
];

// Seed function
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    // Check if settings doc exists
    const settingsRef = doc(db, 'settings', 'global');
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      console.log('Seeding initial Firestore database collections...');
      await setDoc(settingsRef, INITIAL_SETTINGS);

      // Seed plans
      for (const plan of INITIAL_PLANS) {
        await setDoc(doc(db, 'memberships', plan.id), plan);
      }

      // Seed tasks
      for (const task of INITIAL_TASKS) {
        await setDoc(doc(db, 'tasks', task.id), task);
      }

      // Seed ads
      for (const ad of INITIAL_ADS) {
        await setDoc(doc(db, 'advertisements', ad.id), ad);
      }

      // Seed banners
      for (const banner of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }

      // Seed notices
      for (const notice of INITIAL_NOTICES) {
        await setDoc(doc(db, 'notices', notice.id), notice);
      }

      // Seed promoted apps
      for (const app of INITIAL_PROMOTED_APPS) {
        await setDoc(doc(db, 'promotedApps', app.id), app);
      }

      console.log('Firestore seed completed successfully.');
    } else {
      // Ensure settings has appVersionInfo if upgrading from previous version
      const data = settingsSnap.data() as FirestoreSettings;
      if (!data.appVersionInfo) {
        await setDoc(settingsRef, {
          ...data,
          appVersionInfo: INITIAL_SETTINGS.appVersionInfo,
          webAppDownloadUrl: INITIAL_SETTINGS.webAppDownloadUrl
        }, { merge: true });
      }

      // Check if promotedApps collection is empty
      const appsSnap = await getDocs(query(collection(db, 'promotedApps'), limit(1)));
      if (appsSnap.empty) {
        for (const app of INITIAL_PROMOTED_APPS) {
          await setDoc(doc(db, 'promotedApps', app.id), app);
        }
      }
    }
  } catch (err) {
    console.warn('Seed operation caught error (likely permission or already seeded):', err);
  }
}
