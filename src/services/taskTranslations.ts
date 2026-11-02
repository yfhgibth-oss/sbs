import { FirestoreTask } from './firebaseService';
import { Task } from '../types';

export interface TaskBilingualData {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  instructionsEn: string[];
  instructionsBn: string[];
  categoryEn: string;
  categoryBn: string;
  proofTypeEn: string;
  proofTypeBn: string;
  quizQuestionEn?: string;
  quizQuestionBn?: string;
  quizOptionsEn?: string[];
  quizOptionsBn?: string[];
}

export const KNOWN_TASK_TRANSLATIONS: Record<string, TaskBilingualData> = {
  task_video_1: {
    titleEn: 'Financial Security: Spotting Guaranteed-Return Scams (Video & Quiz)',
    titleBn: 'আর্থিক নিরাপত্তা: নিশ্চিত রিটার্ন প্রতারণা শনাক্তকরণ (ভিডিও ও কুইজ)',
    descriptionEn: 'Watch the full 90-second educational clip by Bangladesh Consumer Defense and complete the 1-question verification quiz to confirm attentiveness.',
    descriptionBn: 'বাংলাদেশ কনজিউমার ডিফেন্সের ৯০ সেকেন্ডের সচেতনতামূলক ভিডিওটি সম্পূর্ণ দেখুন এবং মনোযোগ যাচাইয়ের জন্য ১টি কুইজের সঠিক উত্তর দিন।',
    instructionsEn: [
      'Watch the educational video for at least 90 seconds.',
      'Answer the anti-fraud verification question below.',
      'Submit your response to claim your reward.'
    ],
    instructionsBn: [
      '১. সচেতনতামূলক ভিডিওটি কমপক্ষে ৯০ সেকেন্ড সম্পূর্ণ দেখুন।',
      '২. প্রতারণা-রোধী যাচাইকরণ কুইজের সঠিক উত্তর নির্বাচন করুন।',
      '৩. উত্তর সাবমিট করে তাৎক্ষণিক কয়েন রিওয়ার্ড সংগ্রহ করুন।'
    ],
    categoryEn: 'Video & Education',
    categoryBn: 'ভিডিও ও শিক্ষা',
    proofTypeEn: 'Answer & Code',
    proofTypeBn: 'উত্তর ও কোড প্রমাণ',
    quizQuestionEn: 'Why should members avoid schemes promising 100% daily guaranteed returns?',
    quizQuestionBn: 'ব্যবহারকারীদের কেন প্রতিদিন ১০০% নিশ্চিত আয়ের প্রলোভনযুক্ত স্কিম বা প্ল্যাটফর্ম এড়িয়ে চলা উচিত?',
    quizOptionsEn: [
      'Because genuine investments always carry market risk, and guaranteed returns indicate unbacked Ponzi structures',
      'Because banks only work on weekends',
      'Because cryptocurrency is backed by gold'
    ],
    quizOptionsBn: [
      'কারণ বাস্তবসম্মত সব বিনিয়োগেই ঝুঁকি থাকে, আর ১০০% নিশ্চিত আয়ের প্রলোভন মূলত অনিরাপদ পঞ্জি প্রতারণার লক্ষণ',
      'কারণ ব্যাংক কেবল সাপ্তাহিক ছুটির দিনে কাজ করে',
      'কারণ ক্রিপ্টোকারেন্সি সোনার ওপর প্রতিষ্ঠিত'
    ]
  },
  task_web_1: {
    titleEn: 'Visit AmarTech E-Commerce Platform & Review Navigation',
    titleBn: 'অমরটেক ই-কমার্স প্ল্যাটফর্ম পরিদর্শন ও নেভিগেশন রিভিউ',
    descriptionEn: 'Browse the new AmarTech gadget portal for at least 60 seconds. Test search filters and submit your feedback note.',
    descriptionBn: 'নতুন অমরটেক গ্যাজেট পোর্টালে কমপক্ষে ৬০ সেকেন্ড সময় কাটান। সার্চ ফিল্টার ও ক্যাটাগরি ব্রাউজ করে আপনার অভিজ্ঞতা লিখে জমা দিন।',
    instructionsEn: [
      'Click "Open Website" to access the sponsor portal.',
      'Explore at least 2 product pages and check filter speed.',
      'Return here and write what item you browsed.'
    ],
    instructionsBn: [
      '১. "ওপেন ওয়েবসাইট" বাটনে ক্লিক করে স্পন্সর পোর্টাল ভিজিট করুন।',
      '২. কমপক্ষে ২টি ভিন্ন ভিন্ন পণ্যের পেজ দেখুন এবং ব্রাউজ করুন।',
      '৩. এখানে ফিরে এসে আপনি যে পণ্যটি দেখেছেন তার নাম বা সংক্ষিপ্ত মতামত লিখুন।'
    ],
    categoryEn: 'Website Visit',
    categoryBn: 'ওয়েবসাইট ভিজিট',
    proofTypeEn: 'Text Note',
    proofTypeBn: 'টেক্সট মতামত প্রমাণ'
  },
  task_app_1: {
    titleEn: 'FinTech App Biometric Sign-in Review (Screenshot Proof)',
    titleBn: 'ফিনটেক অ্যাপের বায়োমেট্রিক সাইন-ইন রিভিউ (স্ক্রিনশট প্রমাণ)',
    descriptionEn: 'Download the sandbox APK of AmarWallet and test the fingerprint login screen. Capture a screenshot of the login confirmation.',
    descriptionBn: 'অমরওয়ালেট-এর স্যান্ডবক্স টেস্ট অ্যাপ ডাউনলোড করে ফিঙ্গারপ্রিন্ট লগইন স্ক্রিন পরীক্ষা করুন। লগইন সফল হওয়ার একটি স্ক্রিনশট আপলোড করুন।',
    instructionsEn: [
      'Install the sandbox test application.',
      'Complete the biometric login authentication test.',
      'Upload the verification screenshot link.'
    ],
    instructionsBn: [
      '১. স্যান্ডবক্স টেস্ট অ্যাপ্লিকেশনটি ডাউনলোড বা ওপেন করুন।',
      '২. বায়োমেট্রিক ফিঙ্গারপ্রিন্ট লগইন স্ক্রিন সফলভাবে পরীক্ষা করুন।',
      '৩. সফল ভেরিফিকেশন স্ক্রিনের স্ক্রিনশট লিংক এখানে সাবমিট করুন।'
    ],
    categoryEn: 'App Testing',
    categoryBn: 'অ্যাপ টেস্টিং',
    proofTypeEn: 'Screenshot URL',
    proofTypeBn: 'স্ক্রিনশট লিংক প্রমাণ'
  },
  task_surv_1: {
    titleEn: 'National Digital Wallet Usage Survey 2026',
    titleBn: 'জাতীয় ডিজিটাল ওয়ালেট ব্যবহার জরিপ ২০২৬',
    descriptionEn: 'Provide honest feedback regarding your preferred mobile banking method (bKash vs Nagad) and cash-out fee preferences.',
    descriptionBn: 'আপনার পছন্দের মোবাইল ব্যাংকিং পদ্ধতি (বিকাশ বনাম নগদ) এবং ক্যাশ-আউট চার্জ সম্পর্কে সঠিক ও বাস্তবসম্মত মতামত দিন।',
    instructionsEn: [
      'Complete all demographic and delivery experience questions.',
      'Submit the Google Forms/Typeform link receipt upon conclusion.',
      'Only genuine completed response IDs are credited.'
    ],
    instructionsBn: [
      '১. জরিপ ফর্মের সকল প্রশ্ন মনোযোগ সহকারে পূরণ করুন।',
      '২. জরিপ সমাপ্তির রসিদ বা কনফার্মেশন কোডটি এখানে পেস্ট করুন।',
      '৩. শুধুমাত্র প্রকৃত উত্তরের জন্যই রিওয়ার্ড ক্রেডিট করা হবে।'
    ],
    categoryEn: 'Market Survey',
    categoryBn: 'ভোক্তা জরিপ',
    proofTypeEn: 'Receipt Link / Code',
    proofTypeBn: 'রসিদ লিংক / কোড প্রমাণ'
  },
  task_spon_1: {
    titleEn: 'Green Energy Bangladesh Brand Advocacy',
    titleBn: 'গ্রিন এনার্জি বাংলাদেশ সামাজিক প্রচারণা',
    descriptionEn: 'Share SolarTech BD clean energy infographic on your public social media handle and paste the live post URL.',
    descriptionBn: 'সোলারটেক বিডির পরিবেশবান্ধব বিদ্যুৎ বিষয়ক ইনফোগ্রাফিক আপনার সোশ্যাল মিডিয়ায় শেয়ার করুন এবং পোস্টের লিংক জমা দিন।',
    instructionsEn: [
      'Post publicly with hashtag #GreenEnergyBD.',
      'The post must remain publicly visible.',
      'Paste your live public post link.'
    ],
    instructionsBn: [
      '১. হ্যাশট্যাগ #GreenEnergyBD সহ আপনার ব্যক্তিগত প্রোফাইলে পাবলিক পোস্ট করুন।',
      '২. পোস্টটি অবশ্যই দৃশ্যমান ও উন্মুক্ত থাকতে হবে।',
      '৩. আপনার লাইভ পোস্টের সরাসরি লিংকটি এখানে পেস্ট করুন।'
    ],
    categoryEn: 'Social Media',
    categoryBn: 'সোশ্যাল শেয়ার',
    proofTypeEn: 'Public Post Link',
    proofTypeBn: 'পাবলিক পোস্ট লিংক'
  },
  task_edu_1: {
    titleEn: 'Financial Literacy: Identifying Ponzi Schemes Quiz',
    titleBn: 'আর্থিক শিক্ষা: পঞ্জি স্কিম ও ভুয়া সাইট চিহ্নিতকরণ কুইজ',
    descriptionEn: 'Complete our certified 5-question micro-lesson on avoiding unbacked guaranteed-return schemes and safe digital finance habits in Bangladesh.',
    descriptionBn: 'বাংলাদেশে অনিরাপদ নিশ্চিত আয়ের ভুয়া সাইট এড়ানো এবং নিরাপদ ডিজিটাল আর্থিক অভ্যাসের ওপর ৫টি প্রশ্নের মাইক্রো-লেসন সম্পন্ন করুন।',
    instructionsEn: [
      'Read the 2-minute overview on legal multi-party finance.',
      'Answer all 5 questions correctly.',
      'Type your final completion certificate reference code.'
    ],
    instructionsBn: [
      '১. আইনসম্মত ডিজিটাল অর্থ লেনদেনের ওপর সংক্ষিপ্ত বিবরণী পড়ুন।',
      '২. কুইজের সবগুলো প্রশ্নের সঠিক উত্তর দিন।',
      '৩. আপনার প্রাপ্ত সার্টিফিকেটের রেফারেন্স কোডটি লিখে সাবমিট করুন।'
    ],
    categoryEn: 'Education & Quizzes',
    categoryBn: 'শিক্ষা ও কুইজ',
    proofTypeEn: 'Reference Code',
    proofTypeBn: 'রেফারেন্স কোড'
  },
  task_edu_2: {
    titleEn: 'Cyber Security Essentials: Phishing Awareness',
    titleBn: 'সাইবার নিরাপত্তা মূলনীতি: ফিশিং ও ওটিপি সচেতনতা',
    descriptionEn: 'Learn how to identify fake OTP requests, spoofed SMS senders, and fake banking domains with practical case studies.',
    descriptionBn: 'বাস্তব কেস স্টাডির সাহায্যে ভুয়া ওটিপি (OTP) মেসেজ, স্পুফড এসএমএস প্রেরক ও ভুয়া ব্যাংকিং ডোমেইন শনাক্ত করার কৌশল শিখুন।',
    instructionsEn: [
      'Review the 4 sample fraudulent SMS screenshots.',
      'Identify the suspicious indicators and fraudulent URLs.',
      'Submit the 3 red flags identified in Case Study #3.'
    ],
    instructionsBn: [
      '১. প্রদত্ত ৪টি নমুনা প্রতারণামূলক এসএমএস স্ক্রিনশট পর্যালোচনা করুন।',
      '২. ওটিপি চুরি করার সন্দেহজনক লিংক ও সংকেতগুলো খেয়াল করুন।',
      '৩. কেস স্টাডি #৩ এ প্রাপ্ত ৩টি সতর্কবার্তা লিখে জমা দিন।'
    ],
    categoryEn: 'Cyber Security',
    categoryBn: 'সাইবার নিরাপত্তা',
    proofTypeEn: 'Analysis Text',
    proofTypeBn: 'বিশ্লেষণমূলক টেক্সট'
  },
  task_content_1: {
    titleEn: 'Bengali Product Translation & Grammar Review',
    titleBn: 'বাংলা প্রোডাক্ট অনুবাদ ও ব্যাকরণ রিভিউ',
    descriptionEn: 'Review and correct 10 translated tech product catalog titles into natural, idiomatic Bangla for an upcoming electronics launch.',
    descriptionBn: 'আসন্ন ইলেকট্রনিক্স পণ্যের জন্য ১০টি অনুবাদকৃত টেক প্রোডাক্ট শিরোনাম স্বাভাবিক ও প্রমিত বাংলায় সংশোধন ও রিভিউ করুন।',
    instructionsEn: [
      'Ensure standard Bangla vocabulary without awkward machine translation.',
      'Maintain correct technical terminology.',
      'Submit the reviewed title catalog.'
    ],
    instructionsBn: [
      '১. রোবোটিক বা যান্ত্রিক অনুবাদের পরিবর্তে সহজ ও প্রাঞ্জল বাংলা ব্যবহার করুন।',
      '২. টেকনিক্যাল পারিভাষিক শব্দাবলি সঠিকভাবে ঠিক রাখুন।',
      '৩. সংশোধিত ১০টি শিরোনামের তালিকা নিচে পেস্ট করে সাবমিট করুন।'
    ],
    categoryEn: 'Content & Review',
    categoryBn: 'কন্টেন্ট ও অনুবাদ',
    proofTypeEn: 'Translated Text',
    proofTypeBn: 'অনূদিত টেক্সট'
  }
};

export const CATEGORY_NAMES: Record<string, { en: string; bn: string }> = {
  all: { en: 'All Categories', bn: 'সব ক্যাটাগরি' },
  education: { en: 'Education & Quizzes', bn: 'শিক্ষা ও কুইজ' },
  app_test: { en: 'App Testing', bn: 'অ্যাপ টেস্টিং' },
  survey: { en: 'Consumer Surveys', bn: 'ভোক্তা জরিপ' },
  social: { en: 'Social Advocacy', bn: 'সোশ্যাল মিডিয়া' },
  content: { en: 'Translation & Review', bn: 'কন্টেন্ট ও অনুবাদ' },
  video: { en: 'Video & Education', bn: 'ভিডিও ও শিক্ষা' },
  website: { en: 'Website Visit', bn: 'ওয়েবসাইট ভিজিট' },
  qa: { en: 'Q&A Evaluation', bn: 'প্রশ্নোত্তর মূল্যায়ন' },
  sponsored: { en: 'Sponsored Campaign', bn: 'স্পন্সর ক্যাম্পেইন' },
  custom: { en: 'Special Tasks', bn: 'বিশেষ টাস্ক' }
};

export const PROOF_TYPE_NAMES: Record<string, { en: string; bn: string }> = {
  screenshot: { en: 'Screenshot Proof', bn: 'স্ক্রিনশট প্রমাণ' },
  text: { en: 'Text / Code Proof', bn: 'টেক্সট / কোড প্রমাণ' },
  url: { en: 'URL / Link Proof', bn: 'লিংক / রসিদ প্রমাণ' }
};

/**
 * Get task title localized in the desired language
 */
export function getTaskTitle(task: Partial<FirestoreTask> | Partial<Task>, lang: 'bn' | 'en'): string {
  if (lang === 'bn') {
    if (task.titleBn && task.titleBn.trim()) return task.titleBn;
    if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.titleBn) {
      return KNOWN_TASK_TRANSLATIONS[task.id].titleBn;
    }
  }
  return task.title || '';
}

/**
 * Get task description localized in the desired language
 */
export function getTaskDescription(task: Partial<FirestoreTask> | Partial<Task>, lang: 'bn' | 'en'): string {
  if (lang === 'bn') {
    if (task.descriptionBn && task.descriptionBn.trim()) return task.descriptionBn;
    if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.descriptionBn) {
      return KNOWN_TASK_TRANSLATIONS[task.id].descriptionBn;
    }
  }
  return task.description || '';
}

/**
 * Get task instructions or guidelines localized in the desired language
 */
export function getTaskGuidelines(task: Partial<FirestoreTask> | Partial<Task>, lang: 'bn' | 'en'): string[] {
  if (lang === 'bn') {
    if (task.guidelinesBn && task.guidelinesBn.length > 0) return task.guidelinesBn;
    if (task.instructionsBn && task.instructionsBn.trim()) {
      return task.instructionsBn.split('\n').filter(Boolean);
    }
    if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.instructionsBn) {
      return KNOWN_TASK_TRANSLATIONS[task.id].instructionsBn;
    }
  }

  if (task.guidelines && task.guidelines.length > 0) return task.guidelines;
  if (task.instructions && task.instructions.trim()) {
    return task.instructions.split('\n').filter(Boolean);
  }
  if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.instructionsEn) {
    return KNOWN_TASK_TRANSLATIONS[task.id].instructionsEn;
  }

  return lang === 'bn' 
    ? ['কাজের সঠিক প্রমাণ নির্দেশিকা মেনে জমা দিন।']
    : ['Follow instructions and submit valid completion proof.'];
}

/**
 * Localized Category Label
 */
export function getCategoryLabel(categoryKey: string, lang: 'bn' | 'en'): string {
  const normalized = categoryKey.toLowerCase();
  const entry = CATEGORY_NAMES[normalized];
  if (entry) {
    return lang === 'bn' ? entry.bn : entry.en;
  }
  return categoryKey.replace('_', ' ');
}

/**
 * Localized Proof Type Label
 */
export function getProofTypeLabel(proofType: string, lang: 'bn' | 'en'): string {
  const normalized = proofType.toLowerCase();
  const entry = PROOF_TYPE_NAMES[normalized];
  if (entry) {
    return lang === 'bn' ? entry.bn : entry.en;
  }
  return proofType;
}

/**
 * Localized Quiz details
 */
export function getTaskQuiz(task: any, lang: 'bn' | 'en'): { question: string; options: string[] } | null {
  if (!task.quizQuestion && !task.id) return null;

  if (lang === 'bn') {
    if (task.quizQuestionBn && task.quizOptionsBn && task.quizOptionsBn.length > 0) {
      return { question: task.quizQuestionBn, options: task.quizOptionsBn };
    }
    if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.quizQuestionBn) {
      const known = KNOWN_TASK_TRANSLATIONS[task.id];
      return {
        question: known.quizQuestionBn!,
        options: known.quizOptionsBn || []
      };
    }
  }

  if (task.quizQuestion && task.quizOptions && task.quizOptions.length > 0) {
    return { question: task.quizQuestion, options: task.quizOptions };
  }

  if (task.id && KNOWN_TASK_TRANSLATIONS[task.id]?.quizQuestionEn) {
    const known = KNOWN_TASK_TRANSLATIONS[task.id];
    return {
      question: known.quizQuestionEn!,
      options: known.quizOptionsEn || []
    };
  }

  return null;
}
