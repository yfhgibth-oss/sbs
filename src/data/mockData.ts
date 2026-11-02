import { 
  User, 
  Task, 
  TaskSubmission, 
  Mission, 
  Campaign, 
  FraudFlag, 
  PromoCode, 
  SupportTicket, 
  Withdrawal, 
  AdminAuditLog, 
  SystemHealthState, 
  NotificationItem,
  BadgeDefinition 
} from '../types';

export const INITIAL_BADGES: BadgeDefinition[] = [
  {
    id: 'first_task',
    name: 'First Step',
    nameBn: 'প্রথম পদক্ষেপ',
    description: 'Complete your first approved micro-task',
    descriptionBn: 'আপনার প্রথম অনুমোদিত মাইক্রো-টাস্ক সম্পন্ন করুন',
    icon: '🎯',
    requirement: '1 Approved Task',
    perk: '+5% XP on tasks',
    perkBn: '+৫% অতিরিক্ত XP'
  },
  {
    id: 'streak_master_7',
    name: 'Streak Pioneer',
    nameBn: 'স্ট্রিক অগ্রদূত',
    description: 'Maintain a 7-day daily login streak',
    descriptionBn: 'টানা ৭ দিন লগইন স্ট্রিক বজায় রাখুন',
    icon: '🔥',
    requirement: '7 Days Streak',
    perk: '1 Free Streak Freeze per month',
    perkBn: 'মাসে ১টি ফ্রি স্ট্রিক ফ্রিজ'
  },
  {
    id: 'edu_scholar',
    name: 'Knowledge Scholar',
    nameBn: 'জ্ঞান অন্বেষী',
    description: 'Complete 10 verified educational micro-tasks',
    descriptionBn: '১০টি যাচাইকৃত শিক্ষামূলক মাইক্রো-টাস্ক সম্পন্ন করুন',
    icon: '🎓',
    requirement: '10 Educational Tasks',
    perk: 'Access to High-Yield Educational Quizzes',
    perkBn: 'উচ্চ মূল্যের শিক্ষণীয় টাস্কে অগ্রাধিকার'
  },
  {
    id: 'speedy_solver',
    name: 'Lightning Earner',
    nameBn: 'তড়িৎ আর্নার',
    description: 'Submit 5 high-accuracy tasks within 24 hours',
    descriptionBn: '২৪ ঘণ্টার মধ্যে ৫টি নিখুঁত টাস্ক সাবমিট করুন',
    icon: '⚡',
    requirement: '5 Tasks in 1 Day',
    perk: 'Fast-track task verification',
    perkBn: 'দ্রুত টাস্ক অনুমোদন সুবিধা'
  },
  {
    id: 'mission_champion',
    name: 'Mission Champion',
    nameBn: 'মিশন চ্যাম্পিয়ন',
    description: 'Successfully complete 3 platform challenge missions',
    descriptionBn: '৩টি প্ল্যাটফর্ম চ্যালেঞ্জ মিশন সফলভাবে শেষ করুন',
    icon: '🏆',
    requirement: '3 Missions Completed',
    perk: '+50 Coins Bonus per Mission',
    perkBn: 'প্রতি মিশনে ৫০ কয়েন বোনাস'
  },
  {
    id: 'trusted_earner',
    name: 'Gold Reputation',
    nameBn: 'বিশ্বস্ত উপভোক্তা',
    description: 'Achieve 100% approval rate across 20+ tasks with zero fraud flags',
    descriptionBn: 'কোনো জালিয়াতি ছাড়া ১০০% অনুমোদনের রেকর্ড অর্জন করুন',
    icon: '🛡️',
    requirement: '20 Approved, 0 Flags',
    perk: 'Zero withdrawal processing fees',
    perkBn: 'উত্তোলনে শূন্য প্রসেসিং ফি'
  },
  {
    id: 'social_influencer',
    name: 'Digital Ambassador',
    nameBn: 'ডিজিটাল দূত',
    description: 'Promote 5 sponsored social campaigns with verified engagement',
    descriptionBn: '৫টি স্পন্সর করা সামাজিক প্রচারণা সফলভাবে প্রচার করুন',
    icon: '📣',
    requirement: '5 Social Tasks',
    perk: 'Exclusive Campaign Invitations',
    perkBn: 'এক্সক্লুসিভ স্পন্সর ক্যাম্পেইন নিমন্ত্রণ'
  },
  {
    id: 'veteran_level_5',
    name: 'Level 5 Veteran',
    nameBn: 'লেভেল ৫ প্রবীণ',
    description: 'Reach user Level 5 through consistent quality contributions',
    descriptionBn: 'ধারাবাহিক অবদানের মাধ্যমে লেভেল ৫ অর্জন করুন',
    icon: '⭐',
    requirement: 'Reach Level 5',
    perk: '1.25x Platform Reward Multiplier',
    perkBn: '১.২৫ গুণ স্থায়ী প্ল্যাটফর্ম রিওয়ার্ড'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_tanvir',
    name: 'Tanvir Ahmed',
    email: 'tanvir.earner@gmail.com',
    phone: '+880 1712-345678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    membershipTier: 'silver',
    balance: 485,
    totalEarned: 2420,
    level: 3,
    xp: 680,
    xpNextLevel: 1000,
    streakDays: 4,
    longestStreak: 9,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: false,
    streakFreezeRemaining: 1,
    badges: ['first_task', 'speedy_solver'],
    savedTaskIds: ['task_edu_2', 'task_app_1'],
    recentlyViewedTaskIds: ['task_surv_1', 'task_social_1', 'task_edu_1'],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'alias',
    notificationPrefs: {
      rewards: true,
      missions: true,
      announcements: true,
      emailDigest: false
    },
    riskScore: 8,
    isFlagged: false,
    registeredAt: '2026-09-15'
  },
  {
    id: 'usr_campaign_mgr',
    name: 'Apex Digital Marketing',
    email: 'campaigns@apexdigital.io',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    role: 'campaign_manager',
    membershipTier: 'platinum',
    balance: 14500,
    totalEarned: 0,
    level: 7,
    xp: 4200,
    xpNextLevel: 5000,
    streakDays: 12,
    longestStreak: 25,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 3,
    badges: ['trusted_earner'],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'public',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 2,
    isFlagged: false,
    registeredAt: '2026-08-01'
  },
  {
    id: 'usr_super_admin',
    name: 'Dr. Sabrina Khan (Super Admin)',
    email: 'admin.sabrina@taskearn.gov.bd',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    role: 'super_admin',
    membershipTier: 'platinum',
    balance: 50000,
    totalEarned: 0,
    level: 10,
    xp: 9999,
    xpNextLevel: 10000,
    streakDays: 45,
    longestStreak: 45,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 5,
    badges: ['trusted_earner', 'mission_champion', 'veteran_level_5'],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'hidden',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 0,
    isFlagged: false,
    registeredAt: '2026-01-01'
  },
  {
    id: 'usr_task_mgr',
    name: 'Farhan Islam (Task Manager)',
    email: 'farhan.tasks@taskearn.internal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'task_manager',
    membershipTier: 'gold',
    balance: 1200,
    totalEarned: 0,
    level: 5,
    xp: 2200,
    xpNextLevel: 3000,
    streakDays: 8,
    longestStreak: 14,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 2,
    badges: ['trusted_earner'],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'public',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 1,
    isFlagged: false,
    registeredAt: '2026-04-10'
  },
  {
    id: 'usr_payment_mgr',
    name: 'Nusrat Jahan (Payment Manager)',
    email: 'nusrat.finance@taskearn.internal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'payment_manager',
    membershipTier: 'gold',
    balance: 2400,
    totalEarned: 0,
    level: 6,
    xp: 3100,
    xpNextLevel: 4000,
    streakDays: 19,
    longestStreak: 21,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 2,
    badges: ['trusted_earner'],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'public',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 0,
    isFlagged: false,
    registeredAt: '2026-03-22'
  },
  {
    id: 'usr_support_mgr',
    name: 'Rashid Karim (Support Manager)',
    email: 'rashid.helpdesk@taskearn.internal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'support_manager',
    membershipTier: 'gold',
    balance: 800,
    totalEarned: 0,
    level: 4,
    xp: 1600,
    xpNextLevel: 2000,
    streakDays: 6,
    longestStreak: 11,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 1,
    badges: ['trusted_earner'],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'public',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 0,
    isFlagged: false,
    registeredAt: '2026-05-18'
  },
  {
    id: 'usr_analyst',
    name: 'Ayesha Siddiqua (Read-Only Analyst)',
    email: 'ayesha.data@taskearn.internal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    role: 'analyst',
    membershipTier: 'silver',
    balance: 300,
    totalEarned: 0,
    level: 3,
    xp: 900,
    xpNextLevel: 1200,
    streakDays: 3,
    longestStreak: 5,
    lastLoginDate: '2026-10-31',
    streakClaimedToday: true,
    streakFreezeRemaining: 1,
    badges: [],
    savedTaskIds: [],
    recentlyViewedTaskIds: [],
    isAgeVerified: true,
    guardianConsent: false,
    privacyLeaderboard: 'hidden',
    notificationPrefs: { rewards: true, missions: true, announcements: true, emailDigest: true },
    riskScore: 0,
    isFlagged: false,
    registeredAt: '2026-07-01'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_edu_1',
    title: 'Financial Literacy: Identifying Ponzi Schemes Quiz',
    titleBn: 'আর্থিক শিক্ষা: পঞ্জি স্কিম ও ভুয়া সাইট চিহ্নিতকরণ কুইজ',
    description: 'Complete our certified 5-question micro-lesson on avoiding unbacked guaranteed-return schemes and safe digital finance habits in Bangladesh.',
    descriptionBn: 'বাংলাদেশে অনিরাপদ নিশ্চিত আয়ের ভুয়া সাইট এড়ানো এবং নিরাপদ ডিজিটাল আর্থিক অভ্যাসের ওপর ৫টি প্রশ্নের মাইক্রো-লেসন সম্পন্ন করুন।',
    category: 'education',
    reward: 25,
    xpReward: 50,
    timeEstimateMinutes: 4,
    requiredTier: 'free',
    proofType: 'text',
    maxCompletions: 1000,
    completedCount: 684,
    active: true,
    tags: ['Safety', 'Education', 'Certified'],
    guidelines: [
      'Read the 2-minute overview on legal multi-party finance.',
      'Answer all 5 questions correctly.',
      'Type your final completion certificate reference code.'
    ],
    guidelinesBn: [
      '১. আইনসম্মত ডিজিটাল অর্থ লেনদেনের ওপর সংক্ষিপ্ত বিবরণী পড়ুন।',
      '২. কুইজের সবগুলো প্রশ্নের সঠিক উত্তর দিন।',
      '৩. আপনার প্রাপ্ত সার্টিফিকেটের রেফারেন্স কোডটি টাইপ করে সাবমিট করুন।'
    ],
    minTimeOnTaskSeconds: 90,
    scheduledDate: '2026-10-31',
    rating: 4.9
  },
  {
    id: 'task_app_1',
    title: 'FinTech App Onboarding & Bug Review',
    titleBn: 'ফিনটেক অ্যাপের বায়োমেট্রিক সাইন-ইন রিভিউ (স্ক্রিনশট প্রমাণ)',
    description: 'Test the registration and Bangla biometric flow on the staging release of AmarWallet APK. Document any UI clipping or slow response.',
    descriptionBn: 'অমরওয়ালেট-এর স্যান্ডবক্স টেস্ট অ্যাপ ডাউনলোড করে ফিঙ্গারপ্রিন্ট লগইন স্ক্রিন পরীক্ষা করুন। লগইন সফল হওয়ার একটি স্ক্রিনশট আপলোড করুন।',
    category: 'app_test',
    reward: 60,
    xpReward: 90,
    timeEstimateMinutes: 8,
    requiredTier: 'silver',
    campaignId: 'cmp_1',
    sponsorName: 'AmarWallet FinTech Ltd.',
    proofType: 'screenshot',
    maxCompletions: 300,
    completedCount: 142,
    active: true,
    tags: ['App Testing', 'Mobile', 'High Reward'],
    guidelines: [
      'Install the sandbox app via test link.',
      'Navigate through the KYC step in Bangla mode.',
      'Take a screenshot of the completed verification screen.',
      'Duplicate screenshots will be automatically detected and rejected.'
    ],
    guidelinesBn: [
      '১. স্যান্ডবক্স টেস্ট অ্যাপটি ডাউনলোড/ওপেন করুন।',
      '২. বায়োমেট্রিক লগইন পরীক্ষা সম্পন্ন করুন।',
      '৩. সফল লগইন স্ক্রিনের স্ক্রিনশট লিংক এখানে সাবমিট করুন।'
    ],
    minTimeOnTaskSeconds: 180,
    scheduledDate: '2026-10-31',
    rating: 4.8
  },
  {
    id: 'task_surv_1',
    title: 'Consumer E-Commerce Delivery Satisfaction Survey',
    titleBn: 'জাতীয় ডিজিটাল ওয়ালেট ব্যবহার জরিপ ২০২৬',
    description: 'Provide genuine feedback on parcel delivery speeds, tracking accuracy, and payment options used in Dhaka and divisional cities.',
    descriptionBn: 'আপনার পছন্দের মোবাইল ব্যাংকিং পদ্ধতি (বিকাশ বনাম নগদ) এবং ক্যাশ-আউট চার্জ সম্পর্কে সঠিক ও বাস্তবসম্মত মতামত দিন।',
    category: 'survey',
    reward: 35,
    xpReward: 40,
    timeEstimateMinutes: 5,
    requiredTier: 'free',
    campaignId: 'cmp_2',
    sponsorName: 'DeshiCourier Network',
    proofType: 'url',
    maxCompletions: 800,
    completedCount: 512,
    active: true,
    tags: ['Survey', 'Market Research'],
    guidelines: [
      'Complete all demographic and delivery experience questions.',
      'Submit the Google Forms/Typeform link receipt upon conclusion.',
      'Only genuine completed response IDs are credited.'
    ],
    guidelinesBn: [
      '১. জরিপ ফর্মের সকল প্রশ্নের সঠিক উত্তর দিন।',
      '২. প্রাপ্ত কনফার্মেশন কোড বা লিংকটি এখানে পেস্ট করুন।'
    ],
    minTimeOnTaskSeconds: 120,
    scheduledDate: '2026-11-01',
    rating: 4.7
  },
  {
    id: 'task_social_1',
    title: 'Organic Engagement on Clean Energy Initiative',
    titleBn: 'গ্রিন এনার্জি বাংলাদেশ সামাজিক প্রচারণা',
    description: 'Read the Solar Bangladesh report and share an authentic takeaway on LinkedIn or Facebook with hashtag #GreenEnergyBD.',
    descriptionBn: 'সোলারটেক বিডির পরিবেশবান্ধব বিদ্যুৎ বিষয়ক ইনফোগ্রাফিক আপনার সোশ্যাল মিডিয়ায় শেয়ার করুন এবং পোস্টের লিংক জমা দিন।',
    category: 'social',
    reward: 40,
    xpReward: 60,
    timeEstimateMinutes: 6,
    requiredTier: 'silver',
    campaignId: 'cmp_3',
    sponsorName: 'SolarTech Solutions',
    proofType: 'url',
    maxCompletions: 500,
    completedCount: 289,
    active: true,
    tags: ['Social', 'Campaign', 'Green Energy'],
    guidelines: [
      'Share the public post on your genuine personal profile.',
      'Post must remain public for at least 48 hours.',
      'Paste your live public post URL.'
    ],
    guidelinesBn: [
      '১. হ্যাশট্যাগ #GreenEnergyBD সহ আপনার ব্যক্তিগত প্রোফাইলে পাবলিক পোস্ট করুন।',
      '২. আপনার পোস্টের সরাসরি লাইভ লিংকটি এখানে পেস্ট করুন।'
    ],
    minTimeOnTaskSeconds: 100,
    scheduledDate: '2026-11-02',
    rating: 4.6
  },
  {
    id: 'task_edu_2',
    title: 'Cyber Security Essentials: Phishing Awareness',
    titleBn: 'সাইবার নিরাপত্তা মূলনীতি: ফিশিং ও ওটিপি সচেতনতা',
    description: 'Learn how to identify fake OTP requests, spoofed SMS senders, and fake banking domains with practical case studies.',
    descriptionBn: 'বাস্তব কেস স্টাডির সাহায্যে ভুয়া ওটিপি (OTP) মেসেজ, স্পুফড এসএমএস প্রেরক ও ভুয়া ব্যাংকিং ডোমেইন শনাক্ত করার কৌশল শিখুন।',
    category: 'education',
    reward: 30,
    xpReward: 55,
    timeEstimateMinutes: 5,
    requiredTier: 'free',
    proofType: 'text',
    maxCompletions: 1200,
    completedCount: 890,
    active: true,
    tags: ['Cybersecurity', 'Education'],
    guidelines: [
      'Review the 4 sample fraudulent SMS screenshots.',
      'Submit the 3 red flags identified in Case Study #3.'
    ],
    guidelinesBn: [
      '১. প্রদত্ত ৪টি নমুনা প্রতারণামূলক এসএমএস স্ক্রিনশট পর্যালোচনা করুন।',
      '২. কেস স্টাডি #৩ এ প্রাপ্ত ৩টি সতর্কবার্তা লিখে জমা দিন।'
    ],
    minTimeOnTaskSeconds: 80,
    scheduledDate: '2026-11-03',
    rating: 4.95
  },
  {
    id: 'task_content_1',
    title: 'Bengali Product Translation & Grammar Review',
    titleBn: 'বাংলা প্রোডাক্ট অনুবাদ ও ব্যাকরণ রিভিউ',
    description: 'Review and correct 10 translated tech product catalog titles into natural, idiomatic Bangla for an upcoming electronics launch.',
    descriptionBn: 'আসন্ন ইলেকট্রনিক্স পণ্যের জন্য ১০টি অনুবাদকৃত টেক প্রোডাক্ট শিরোনাম স্বাভাবিক ও প্রমিত বাংলায় সংশোধন ও রিভিউ করুন।',
    category: 'content',
    reward: 75,
    xpReward: 120,
    timeEstimateMinutes: 10,
    requiredTier: 'gold',
    proofType: 'text',
    maxCompletions: 150,
    completedCount: 68,
    active: true,
    tags: ['Translation', 'Gold Tier', 'Language'],
    guidelines: [
      'Ensure standard Bangla vocabulary without awkward machine translation.',
      'Submit the reviewed title catalog.'
    ],
    guidelinesBn: [
      '১. যান্ত্রিক অনুবাদের পরিবর্তে সহজ ও প্রাঞ্জল বাংলা ব্যবহার করুন।',
      '২. সংশোধিত ১০টি শিরোনামের তালিকা নিচে পেস্ট করে সাবমিট করুন।'
    ],
    minTimeOnTaskSeconds: 240,
    scheduledDate: '2026-11-04',
    rating: 4.85
  }
];

export const INITIAL_SUBMISSIONS: TaskSubmission[] = [
  {
    id: 'sub_101',
    taskId: 'task_edu_1',
    taskTitle: 'Financial Literacy: Identifying Ponzi Schemes Quiz',
    category: 'education',
    userId: 'usr_tanvir',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.earner@gmail.com',
    submittedAt: '2026-10-30 14:22',
    proofData: {
      text: 'Completion Code: FINLIT-BD-98214 - Answered all 5 questions correctly on pyramid prevention.'
    },
    status: 'approved',
    reward: 25,
    xpReward: 50,
    reviewNotes: 'Verified score 100%.',
    duplicateHash: 'hash_finlit_tanvir_98214',
    timeSpentSeconds: 145
  },
  {
    id: 'sub_102',
    taskId: 'task_app_1',
    taskTitle: 'FinTech App Onboarding & Bug Review',
    category: 'app_test',
    userId: 'usr_tanvir',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.earner@gmail.com',
    submittedAt: '2026-10-30 18:45',
    proofData: {
      screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
      text: 'Found slight label overlap in Bangla font under the NID camera scanner preview.'
    },
    status: 'pending',
    reward: 60,
    xpReward: 90,
    duplicateHash: 'hash_screenshot_9941a',
    timeSpentSeconds: 210
  },
  {
    id: 'sub_103',
    taskId: 'task_app_1',
    taskTitle: 'FinTech App Onboarding & Bug Review',
    category: 'app_test',
    userId: 'usr_suspicious_1',
    userName: 'Hasan Ali',
    userEmail: 'hasan.ali.alt@mail.com',
    submittedAt: '2026-10-30 19:10',
    proofData: {
      screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80', // Identical screenshot image!
      text: 'Done testing.'
    },
    status: 'flagged',
    reward: 60,
    xpReward: 90,
    duplicateHash: 'hash_screenshot_9941a', // DUPLICATE DETECTED!
    reviewNotes: 'Auto-flagged: Exact image fingerprint match with submission sub_102.',
    timeSpentSeconds: 12
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mis_1',
    title: 'Task Master Sprint: 5 Approved Tasks',
    description: 'Complete and receive approval for at least 5 standard micro-tasks across any category within the sprint period.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    startDate: '2026-10-25',
    endDate: '2026-11-07',
    reqType: 'approved_tasks',
    reqTarget: 5,
    rewardCoins: 100,
    rewardXP: 250,
    eligibleMembership: ['free', 'silver', 'gold', 'platinum'],
    maxParticipants: 500,
    currentParticipants: 312,
    campaignBudget: 50000,
    budgetSpent: 18400,
    status: 'active',
    claimedUserIds: []
  },
  {
    id: 'mis_2',
    title: 'Knowledge Builder: 10 Educational Tasks',
    description: 'Enhance your skills by completing 10 verified educational and cybersecurity awareness micro-tasks.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    startDate: '2026-10-20',
    endDate: '2026-11-15',
    reqType: 'education_tasks',
    reqTarget: 10,
    rewardCoins: 180,
    rewardXP: 450,
    eligibleMembership: ['silver', 'gold', 'platinum'],
    maxParticipants: 300,
    currentParticipants: 164,
    campaignBudget: 54000,
    budgetSpent: 21600,
    status: 'active',
    claimedUserIds: []
  },
  {
    id: 'mis_3',
    title: 'Sponsored Brand Ambassador Campaign',
    description: 'Participate in official advertiser campaigns and submit high-fidelity feedback for verified brand sponsors.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    startDate: '2026-10-28',
    endDate: '2026-11-12',
    reqType: 'campaign_tasks',
    reqTarget: 3,
    rewardCoins: 150,
    rewardXP: 300,
    eligibleMembership: ['free', 'silver', 'gold', 'platinum'],
    maxParticipants: 400,
    currentParticipants: 210,
    campaignBudget: 60000,
    budgetSpent: 19500,
    status: 'active',
    claimedUserIds: []
  },
  {
    id: 'mis_4',
    title: 'Consistency Star: 7-Day Login Streak',
    description: 'Log in and claim your daily streak reward for 7 consecutive days without break.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    reqType: 'login_streak',
    reqTarget: 7,
    rewardCoins: 80,
    rewardXP: 200,
    eligibleMembership: ['free', 'silver', 'gold', 'platinum'],
    maxParticipants: 2000,
    currentParticipants: 1140,
    campaignBudget: 160000,
    budgetSpent: 52000,
    status: 'active',
    claimedUserIds: []
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_1',
    managerId: 'usr_campaign_mgr',
    managerName: 'Apex Digital Marketing',
    title: 'AmarWallet FinTech App Onboarding Drive',
    category: 'app_test',
    targetUrl: 'https://example.com/amarwallet-apk-test',
    bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    budgetTotal: 18000,
    budgetSpent: 8520,
    costPerAction: 60,
    maxActions: 300,
    actionsCompleted: 142,
    eligibleTiers: ['silver', 'gold', 'platinum'],
    eligibleAudience: 'Active Smartphone Users in Bangladesh aged 18-40',
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    status: 'active',
    impressions: 2420,
    clicks: 680
  },
  {
    id: 'cmp_2',
    managerId: 'usr_campaign_mgr',
    managerName: 'Apex Digital Marketing',
    title: 'DeshiCourier Delivery Experience Research',
    category: 'survey',
    targetUrl: 'https://example.com/deshicourier-survey',
    bannerUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    budgetTotal: 28000,
    budgetSpent: 17920,
    costPerAction: 35,
    maxActions: 800,
    actionsCompleted: 512,
    eligibleTiers: ['free', 'silver', 'gold', 'platinum'],
    eligibleAudience: 'Online Shoppers in Dhaka, Chittagong, Sylhet',
    startDate: '2026-10-10',
    endDate: '2026-11-20',
    status: 'active',
    impressions: 4890,
    clicks: 1420
  },
  {
    id: 'cmp_3',
    managerId: 'usr_campaign_mgr',
    managerName: 'Apex Digital Marketing',
    title: 'SolarTech Clean Power Social Advocacy',
    category: 'social',
    targetUrl: 'https://example.com/solartech-advocacy',
    bannerUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80',
    budgetTotal: 20000,
    budgetSpent: 11560,
    costPerAction: 40,
    maxActions: 500,
    actionsCompleted: 289,
    eligibleTiers: ['silver', 'gold', 'platinum'],
    eligibleAudience: 'Environmental awareness advocates & college students',
    startDate: '2026-10-22',
    endDate: '2026-11-30',
    status: 'active',
    impressions: 3100,
    clicks: 890
  }
];

export const INITIAL_FRAUD_FLAGS: FraudFlag[] = [
  {
    id: 'frd_1',
    userId: 'usr_suspicious_1',
    userName: 'Hasan Ali',
    userEmail: 'hasan.ali.alt@mail.com',
    flagType: 'duplicate_submission',
    riskScore: 84,
    evidenceSummary: 'Exact duplicate screenshot hash (hash_screenshot_9941a) uploaded across 2 separate accounts within 25 minutes.',
    timestamp: '2026-10-30 19:10',
    status: 'pending_review',
    adminNotes: 'Automated hash match. Task sub_103 halted pending manual inspection.'
  },
  {
    id: 'frd_2',
    userId: 'usr_suspicious_2',
    userName: 'Kawsar Mahmud',
    userEmail: 'kawsar992@proton.me',
    flagType: 'duplicate_trx',
    riskScore: 92,
    evidenceSummary: 'bKash TrxID "9J4K2L18BD" was previously registered on withdrawal record wth_089 on Oct 28.',
    timestamp: '2026-10-30 11:05',
    status: 'pending_review',
    adminNotes: 'Reused transaction reference. Hold withdrawal until telecom statement verified.'
  },
  {
    id: 'frd_3',
    userId: 'usr_suspicious_3',
    userName: 'Faridul Hoque',
    userEmail: 'farid_bot01@tempmail.plus',
    flagType: 'suspicious_signup',
    riskScore: 68,
    evidenceSummary: '4 accounts registered from identical IP /24 subnet within 180 seconds using disposable email provider.',
    timestamp: '2026-10-29 08:30',
    status: 'restricted',
    adminNotes: 'Automated payout limit enforced. User requested to provide valid NID or phone OTP.'
  },
  {
    id: 'frd_4',
    userId: 'usr_suspicious_4',
    userName: 'Shakil Ahmed',
    userEmail: 'shakil.ref@gmail.com',
    flagType: 'self_referral',
    riskScore: 55,
    evidenceSummary: 'Referral link used from identical browser fingerprint and local cookie storage session.',
    timestamp: '2026-10-28 16:40',
    status: 'warning_issued',
    adminNotes: 'Referral commission withheld. Primary user issued educational warning.'
  },
  {
    id: 'frd_5',
    userId: 'usr_suspicious_5',
    userName: 'Rezaul Karim',
    userEmail: 'reza.speed@fastmail.com',
    flagType: 'unusual_withdrawal',
    riskScore: 78,
    evidenceSummary: '3 maximum threshold withdrawals requested in 4 hours immediately following sudden tier upgrade.',
    timestamp: '2026-10-31 02:15',
    status: 'pending_review',
    adminNotes: 'Velocity rule triggered. Queued for Payment Manager audit.'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'prm_1',
    code: 'WELCOME2026',
    rewardType: 'balance',
    rewardValue: 50,
    expiresAt: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 428,
    perUserLimit: 1,
    eligibleTiers: ['all'],
    active: true,
    usedByUsers: [],
    description: 'Welcome gift for all registered task earners! +50 Coins directly into your balance.'
  },
  {
    id: 'prm_2',
    code: 'BOOST50',
    rewardType: 'bonus_xp',
    rewardValue: 150,
    expiresAt: '2026-11-30',
    usageLimit: 500,
    timesUsed: 182,
    perUserLimit: 1,
    eligibleTiers: ['all'],
    active: true,
    usedByUsers: [],
    description: 'Instant +150 XP booster to accelerate your next Level promotion.'
  },
  {
    id: 'prm_3',
    code: 'GOLDPRO',
    rewardType: 'task_multiplier',
    rewardValue: 20, // 20% bonus
    expiresAt: '2026-11-15',
    usageLimit: 200,
    timesUsed: 64,
    perUserLimit: 1,
    eligibleTiers: ['gold', 'platinum'],
    active: true,
    usedByUsers: [],
    description: 'Exclusive 20% reward booster on all approved tasks for Gold and Platinum members.'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_001',
    userId: 'usr_tanvir',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.earner@gmail.com',
    category: 'task_dispute',
    priority: 'medium',
    subject: 'Task #task_app_1 pending verification clarification',
    status: 'in_progress',
    createdAt: '2026-10-30 19:30',
    updatedAt: '2026-10-31 01:15',
    attachmentUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80',
    messages: [
      {
        id: 'msg_1',
        senderRole: 'user',
        senderName: 'Tanvir Ahmed',
        text: 'Hello, I submitted my bug report screenshot for AmarWallet yesterday evening. Could you let me know if the bug description was sufficiently detailed?',
        timestamp: '2026-10-30 19:30'
      },
      {
        id: 'msg_2',
        senderRole: 'admin',
        senderName: 'Farhan Islam (Task Manager)',
        text: 'Hi Tanvir, thank you for checking in. We inspected your submission and the UI clipping screenshot is very clear. It has been passed to the advertiser for final sign-off and will be approved shortly.',
        timestamp: '2026-10-31 01:15'
      }
    ]
  },
  {
    id: 'tkt_002',
    userId: 'usr_user_89',
    userName: 'Mehedi Hasan',
    userEmail: 'mehedi.h@yahoo.com',
    category: 'payment_withdrawal',
    priority: 'high',
    subject: 'bKash withdrawal inquiry - Account verification confirmation',
    status: 'open',
    createdAt: '2026-10-31 03:00',
    updatedAt: '2026-10-31 03:00',
    messages: [
      {
        id: 'msg_3',
        senderRole: 'user',
        senderName: 'Mehedi Hasan',
        text: 'I requested 500 BDT via bKash Personal Number 01819-XXXXXX. I am attaching my personal statement screenshot for verification.',
        timestamp: '2026-10-31 03:00'
      }
    ]
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wth_001',
    userId: 'usr_tanvir',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.earner@gmail.com',
    method: 'bkash',
    accountNo: '01712-345678',
    amount: 500,
    fee: 10,
    netAmount: 490,
    trxId: 'BKASH-8A9F42D1',
    status: 'approved',
    requestedAt: '2026-10-25 10:14',
    reviewedAt: '2026-10-25 12:30',
    isDuplicateTrx: false
  },
  {
    id: 'wth_002',
    userId: 'usr_tanvir',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.earner@gmail.com',
    method: 'nagad',
    accountNo: '01712-345678',
    amount: 400,
    fee: 8,
    netAmount: 392,
    trxId: 'NAGAD-3B7C90E2',
    status: 'pending',
    requestedAt: '2026-10-30 21:00',
    isDuplicateTrx: false
  },
  {
    id: 'wth_003',
    userId: 'usr_suspicious_2',
    userName: 'Kawsar Mahmud',
    userEmail: 'kawsar992@proton.me',
    method: 'bkash',
    accountNo: '01911-223344',
    amount: 1000,
    fee: 20,
    netAmount: 980,
    trxId: '9J4K2L18BD', // DUPLICATE TRX ID
    status: 'flagged',
    requestedAt: '2026-10-30 11:00',
    isDuplicateTrx: true
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'aud_1',
    adminId: 'usr_super_admin',
    adminName: 'Dr. Sabrina Khan',
    role: 'Super Admin',
    action: 'POLICY_UPDATE',
    targetType: 'SYSTEM_SETTINGS',
    targetId: 'FINANCIAL_ZERO_PONZI',
    details: 'Enforced zero-Ponzi disclosure and advertiser budget isolation rule v2.4.',
    timestamp: '2026-10-30 09:15:20',
    ipAddress: '103.205.180.42'
  },
  {
    id: 'aud_2',
    adminId: 'usr_task_mgr',
    adminName: 'Farhan Islam',
    role: 'Task Manager',
    action: 'CHALLENGE_CREATE',
    targetType: 'MISSION',
    targetId: 'mis_1',
    details: 'Published 5-Task Sprint with 50,000 BDT allocated budget.',
    timestamp: '2026-10-25 10:00:00',
    ipAddress: '103.205.180.45'
  },
  {
    id: 'aud_3',
    adminId: 'usr_payment_mgr',
    adminName: 'Nusrat Jahan',
    role: 'Payment Manager',
    action: 'TRANSACTION_FLAG',
    targetType: 'WITHDRAWAL',
    targetId: 'wth_003',
    details: 'Flagged duplicate TrxID 9J4K2L18BD and notified anti-fraud engine.',
    timestamp: '2026-10-30 11:06:12',
    ipAddress: '103.205.180.88'
  },
  {
    id: 'aud_4',
    adminId: 'usr_super_admin',
    adminName: 'Dr. Sabrina Khan',
    role: 'Super Admin',
    action: 'CLOUD_BACKUP_EXEC',
    targetType: 'DATABASE_BACKUP',
    targetId: 'SNAP-20261030-N2',
    details: 'Automated GCP Firestore daily cold storage snapshot (142.6 MB) verified.',
    timestamp: '2026-10-30 23:59:00',
    ipAddress: '103.205.180.42'
  }
];

export const INITIAL_SYSTEM_HEALTH: SystemHealthState = {
  firebaseConnected: true,
  authStatus: 'healthy',
  firestoreLatencyMs: 38,
  storageStatus: 'healthy',
  cloudFunctionsLatencyMs: 82,
  lastBackupDate: '2026-10-30 23:59 UTC',
  backupSizeMb: 142.6,
  backupStatus: 'completed',
  restorePoints: [
    {
      id: 'rst_1',
      timestamp: '2026-10-30 23:59:00',
      snapshotName: 'SNAP-20261030-DAILY',
      sizeMb: 142.6,
      tables: ['users', 'tasks', 'submissions', 'campaigns', 'audit_logs']
    },
    {
      id: 'rst_2',
      timestamp: '2026-10-29 23:59:00',
      snapshotName: 'SNAP-20261029-DAILY',
      sizeMb: 139.8,
      tables: ['users', 'tasks', 'submissions', 'campaigns', 'audit_logs']
    },
    {
      id: 'rst_3',
      timestamp: '2026-10-28 23:59:00',
      snapshotName: 'SNAP-20261028-DAILY',
      sizeMb: 136.2,
      tables: ['users', 'tasks', 'submissions', 'campaigns', 'audit_logs']
    }
  ],
  recentErrors: [
    {
      id: 'err_101',
      code: 'AUTH_TIMEOUT_RECOVERED',
      message: 'Token verification refreshed after 240ms network stutter on bKash webhook listener.',
      timestamp: '2026-10-30 18:12:04',
      severity: 'warning',
      service: 'Firebase Auth Proxy'
    },
    {
      id: 'err_102',
      code: 'RATE_LIMIT_PREVENTED',
      message: 'Blocked burst connection attempt from IP 182.16.24.99 (42 requests in 5 sec).',
      timestamp: '2026-10-29 08:31:10',
      severity: 'warning',
      service: 'Cloud Armor & Rate Limiter'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_tanvir',
    title: 'Daily Streak Available!',
    message: 'Day 4 streak reward is ready to claim. Keep your momentum going for the 7-day bonus!',
    type: 'streak',
    read: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'notif_2',
    userId: 'usr_tanvir',
    title: 'Task Approved (+25 Coins)',
    message: 'Your submission for Financial Literacy Quiz has been verified and credited.',
    type: 'reward',
    read: false,
    timestamp: 'Yesterday'
  },
  {
    id: 'notif_3',
    userId: 'usr_tanvir',
    title: 'New Mission Launched: Task Master Sprint',
    message: 'Complete 5 approved tasks before Nov 7 to unlock a 100 Coin bonus + 250 XP.',
    type: 'mission',
    read: true,
    timestamp: '2 days ago'
  }
];
