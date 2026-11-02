import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

// Types matching blueprint
export interface FirestoreUser {
  uid: string;
  fullName: string;
  mobileNumber?: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin' | 'task_manager' | 'payment_manager' | 'support_manager' | 'analyst';
  membershipTier: 'free' | 'silver' | 'gold' | 'premium';
  membershipExpiresAt?: string;
  referralCode: string;
  referredBy?: string;
  status: 'active' | 'suspended' | 'pending';
  level: number;
  xp: number;
  streakDays: number;
  longestStreak?: number;
  lastLoginDate: string;
  streakClaimedToday: boolean;
  isAgeVerified: boolean;
  guardianConsent: boolean;
  privacyLeaderboard: 'public' | 'alias' | 'hidden';
  avatarUrl?: string;
  avatar?: string;
  id?: string;
  phone?: string;
  balance?: number;
  totalEarned?: number;
  totalWithdrawn?: number;
  tasksCompleted?: number;
  referralEarnings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreWallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  totalWithdrawn: number;
  updatedAt: string;
}

export interface FirestoreTask {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  taskType: 'video' | 'website' | 'education' | 'image' | 'survey' | 'qa' | 'sponsored' | 'custom';
  externalUrl?: string;
  imageUrl?: string;
  rewardAmount: number;
  xpReward: number;
  eligibleTiers: string[];
  minTimeOnTaskSeconds: number;
  dailyLimit: number;
  totalLimit: number;
  completedCount: number;
  instructions: string;
  instructionsBn?: string;
  guidelines?: string[];
  guidelinesBn?: string[];
  category?: string;
  proofType: 'screenshot' | 'text' | 'url';
  status: 'active' | 'paused' | 'expired';
  quizQuestion?: string;
  quizQuestionBn?: string;
  quizOptions?: string[];
  quizOptionsBn?: string[];
  correctOptionIndex?: number;
  createdAt: string;
}

export interface FirestoreSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  proofType: 'screenshot' | 'text' | 'url';
  proofUrl?: string;
  proofText?: string;
  evidenceUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  rewardAmount: number;
  xpReward: number;
  adminNotes?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  timeSpentSeconds: number;
  submittedAt: string;
}

export interface FirestoreWithdrawal {
  id: string;
  userId: string;
  userName: string;
  method: 'bkash' | 'nagad' | 'rocket' | 'bank';
  accountNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  transactionReference?: string;
  trxReference?: string;
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface FirestoreMembershipPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  rewardMultiplier: number;
  dailyTaskLimit: number;
  benefits: string[];
  active: boolean;
}

export interface FirestoreMembershipPayment {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  price: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank';
  senderAccount: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface FirestoreAdvertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'popup' | 'banner' | 'slider' | 'offer_card' | 'sidebar';
  active: boolean;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
}

export interface FirestoreBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  active: boolean;
}

export interface FirestoreNotice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'tasks' | 'payment' | 'membership' | 'update';
  important: boolean;
  createdAt: string;
}

export interface FirestoreSupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  status: 'open' | 'in_progress' | 'awaiting_user' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'user' | 'admin';
    text: string;
    timestamp: string;
  }[];
}

export interface AppVersionInfo {
  version: string; // e.g. "2.4.0"
  versionCode: number; // e.g. 240
  title: string; // "নতুন মেগা আপডেট ও দ্রুত ক্যাশআউট সুবিধা!"
  titleEn?: string;
  releaseNotes: string[];
  forceUpdate: boolean;
  downloadUrl: string; // APK / Web App download link
  publishedAt: string;
  active: boolean;
}

export interface PromotedApp {
  id: string;
  title: string;
  developer: string;
  iconUrl: string;
  category: 'games' | 'finance' | 'social' | 'tools' | 'shopping' | 'education' | 'utility';
  downloadUrl: string;
  appType: 'android_apk' | 'play_store' | 'web_app' | 'ios';
  rewardAmount: number; // Reward in BDT for installing
  xpReward: number;
  description: string;
  instructions: string;
  proofRequired: 'screenshot' | 'package_verification' | 'user_account';
  rating: number; // e.g. 4.9
  downloadsCount: number;
  featured: boolean;
  status: 'active' | 'pending' | 'rejected' | 'paused';
  submittedBy: string;
  submittedByName?: string;
  submittedAt: string;
}

export interface FirestoreSettings {
  websiteName: string;
  siteName?: string;
  websiteLogo: string;
  whatsAppNumber: string;
  supportEmail: string;
  minimumWithdrawal: number;
  minWithdrawal?: number;
  maxWithdrawal?: number;
  referralReward: number;
  popupAnnouncement: string;
  popupActive: boolean;
  popupImageUrl?: string;
  popupTargetUrl?: string;
  maintenanceMode: boolean;
  currency: string;
  termsUrl?: string;
  privacyUrl?: string;
  bkashMerchant?: string;
  nagadMerchant?: string;
  rocketMerchant?: string;
  bankDetails?: string;
  webAppDownloadUrl?: string; // Direct APK or Web App download link
  appVersionInfo?: AppVersionInfo; // Live version info for update notification popup
}

export interface FirestoreAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

// Storage Image Uploader
export async function uploadImageToStorage(file: File, folder = 'uploads'): Promise<string> {
  try {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.warn('Storage upload error, falling back to data URL preview:', error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
