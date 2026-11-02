import React from 'react';
import { 
  CheckSquare, 
  Megaphone, 
  Image as ImageIcon, 
  Bell, 
  Wallet, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { FirestoreTask, FirestoreAdvertisement, FirestoreNotice } from '../../services/firebaseService';
import { ImageUploadField } from '../../components/ImageUploadField';

// 1. Task Modal (Create / Edit)
interface TaskModalProps {
  open: boolean;
  editingTask: FirestoreTask | null;
  taskTitle: string;
  setTaskTitle: (v: string) => void;
  taskTitleBn?: string;
  setTaskTitleBn?: (v: string) => void;
  taskDesc: string;
  setTaskDesc: (v: string) => void;
  taskDescBn?: string;
  setTaskDescBn?: (v: string) => void;
  taskType: FirestoreTask['taskType'];
  setTaskType: (v: FirestoreTask['taskType']) => void;
  taskReward: number;
  setTaskReward: (v: number) => void;
  taskXp: number;
  setTaskXp: (v: number) => void;
  taskUrl: string;
  setTaskUrl: (v: string) => void;
  taskImg: string;
  setTaskImg: (v: string) => void;
  taskProofType: FirestoreTask['proofType'];
  setTaskProofType: (v: FirestoreTask['proofType']) => void;
  taskInstructions: string;
  setTaskInstructions: (v: string) => void;
  taskInstructionsBn?: string;
  setTaskInstructionsBn?: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  editingTask,
  taskTitle,
  setTaskTitle,
  taskTitleBn = '',
  setTaskTitleBn,
  taskDesc,
  setTaskDesc,
  taskDescBn = '',
  setTaskDescBn,
  taskType,
  setTaskType,
  taskReward,
  setTaskReward,
  taskXp,
  setTaskXp,
  taskUrl,
  setTaskUrl,
  taskImg,
  setTaskImg,
  taskProofType,
  setTaskProofType,
  taskInstructions,
  setTaskInstructions,
  taskInstructionsBn = '',
  setTaskInstructionsBn,
  onClose,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingTask ? 'Edit Task Specification' : 'Publish New Micro Task'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title (English):</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Subscribe to Official Channel"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title (বাংলা):</label>
              <input
                type="text"
                value={taskTitleBn}
                onChange={(e) => setTaskTitleBn && setTaskTitleBn(e.target.value)}
                placeholder="যেমন: অফিসিয়াল চ্যানেলে সাবস্ক্রাইব করুন"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Description (English):</label>
              <textarea
                rows={2}
                required
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Brief description of the activity..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Description (বাংলা):</label>
              <textarea
                rows={2}
                value={taskDescBn}
                onChange={(e) => setTaskDescBn && setTaskDescBn(e.target.value)}
                placeholder="কাজের সংক্ষিপ্ত বাংলা বিবরণ..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Task Category:</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="video">Video Content</option>
                <option value="website">Website Visit</option>
                <option value="education">Educational Content</option>
                <option value="image">Image Engagement</option>
                <option value="survey">Market Survey</option>
                <option value="qa">Question & Answer</option>
                <option value="sponsored">Sponsored Campaign</option>
                <option value="custom">Custom Activity</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Required Proof Type:</label>
              <select
                value={taskProofType}
                onChange={(e) => setTaskProofType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="screenshot">Screenshot Upload</option>
                <option value="text">Verification Code / Text</option>
                <option value="url">External Profile / Post URL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Coin Reward (৳):</label>
              <input
                type="number"
                min="5"
                required
                value={taskReward}
                onChange={(e) => setTaskReward(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">XP Reward:</label>
              <input
                type="number"
                min="10"
                value={taskXp}
                onChange={(e) => setTaskXp(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">External Destination URL:</label>
            <input
              type="url"
              value={taskUrl}
              onChange={(e) => setTaskUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 bg-slate-50/60 dark:bg-slate-800/40">
            <ImageUploadField
              value={taskImg}
              onChange={setTaskImg}
              label="টাস্কের ছবি / স্ক্রিনশট (ফোন বা কম্পিউটার থেকে সরাসরি আপলোড):"
              placeholder="https://... অথবা ডিভাইস ফাইল"
              folder="tasks"
              language="bn"
              helpText="কম্পিউটার বা ফোনের গ্যালারি থেকে যেকোনো ছবি বা স্ক্রিনশট সরাসরি আপলোড করুন।"
              demoPresets={[
                { label: 'YouTube Video', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80' },
                { label: 'Website Visit', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
                { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80' },
                { label: 'Survey / Form', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Instructions (English):</label>
              <textarea
                rows={2}
                value={taskInstructions}
                onChange={(e) => setTaskInstructions(e.target.value)}
                placeholder="Step-by-step instructions..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Instructions (বাংলা):</label>
              <textarea
                rows={2}
                value={taskInstructionsBn}
                onChange={(e) => setTaskInstructionsBn && setTaskInstructionsBn(e.target.value)}
                placeholder="ধাপে ধাপে কাজের বাংলা নির্দেশিকা..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-xs"
            >
              {editingTask ? 'Save Changes' : 'Publish Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Advertisement Modal
interface AdModalProps {
  open: boolean;
  adTitle: string;
  setAdTitle: (v: string) => void;
  adImg: string;
  setAdImg: (v: string) => void;
  adUrl: string;
  setAdUrl: (v: string) => void;
  adPlacement: FirestoreAdvertisement['placement'];
  setAdPlacement: (v: FirestoreAdvertisement['placement']) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdModal: React.FC<AdModalProps> = ({
  open,
  adTitle,
  setAdTitle,
  adImg,
  setAdImg,
  adUrl,
  setAdUrl,
  adPlacement,
  setAdPlacement,
  onClose,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Advertisement</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Campaign Title:</label>
            <input
              type="text"
              required
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="e.g. VIP Promo Bonus"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Placement:</label>
            <select
              value={adPlacement}
              onChange={(e) => setAdPlacement(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 uppercase"
            >
              <option value="popup">Homepage Popup</option>
              <option value="banner">Banner Slide</option>
              <option value="offer_card">Offer Card</option>
              <option value="slider">Carousel Slider</option>
              <option value="sidebar">Sidebar Widget</option>
            </select>
          </div>

          <div>
            <ImageUploadField
              value={adImg}
              onChange={setAdImg}
              label="অ্যাড ব্যানার ছবি (ডিভাইস থেকে আপলোড করুন):"
              placeholder="https://... অথবা ডিভাইস ফাইল"
              folder="advertisements"
              language="bn"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Click Destination URL:</label>
            <input
              type="url"
              required
              value={adUrl}
              onChange={(e) => setAdUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Create Ad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Banner Modal
interface BannerModalProps {
  open: boolean;
  bannerTitle: string;
  setBannerTitle: (v: string) => void;
  bannerImg: string;
  setBannerImg: (v: string) => void;
  bannerLink: string;
  setBannerLink: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BannerModal: React.FC<BannerModalProps> = ({
  open,
  bannerTitle,
  setBannerTitle,
  bannerImg,
  setBannerImg,
  bannerLink,
  setBannerLink,
  onClose,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Graphic Carousel Banner</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Banner Title:</label>
            <input
              type="text"
              required
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="e.g. Special Mega Task Event"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <ImageUploadField
              value={bannerImg}
              onChange={setBannerImg}
              label="ব্যানার গ্রাফিক ইমেজ (ডিভাইস থেকে আপলোড করুন):"
              placeholder="https://... অথবা ডিভাইস ফাইল"
              folder="banners"
              language="bn"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Target Click URL (Optional):</label>
            <input
              type="text"
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Save Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Notice Modal
interface NoticeModalProps {
  open: boolean;
  noticeTitle: string;
  setNoticeTitle: (v: string) => void;
  noticeContent: string;
  setNoticeContent: (v: string) => void;
  noticeCategory: FirestoreNotice['category'];
  setNoticeCategory: (v: FirestoreNotice['category']) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  open,
  noticeTitle,
  setNoticeTitle,
  noticeContent,
  setNoticeContent,
  noticeCategory,
  setNoticeCategory,
  onClose,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Broadcast Announcement</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Notice Headline:</label>
            <input
              type="text"
              required
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g. Server Maintenance Notice"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category:</label>
            <select
              value={noticeCategory}
              onChange={(e) => setNoticeCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 uppercase"
            >
              <option value="general">General Platform Notice</option>
              <option value="tasks">New High-Reward Tasks</option>
              <option value="payment">Payment & Payout Update</option>
              <option value="membership">Membership Offer</option>
              <option value="update">System Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Message Content:</label>
            <textarea
              rows={3}
              required
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              placeholder="Type broadcast message..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Manual Wallet Adjustment Modal
interface WalletModalProps {
  open: boolean;
  targetUserId: string;
  setTargetUserId: (v: string) => void;
  adjustAmount: number;
  setAdjustAmount: (v: number) => void;
  adjustType: 'credit' | 'debit';
  setAdjustType: (v: 'credit' | 'debit') => void;
  adjustReason: string;
  setAdjustReason: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  open,
  targetUserId,
  setTargetUserId,
  adjustAmount,
  setAdjustAmount,
  adjustType,
  setAdjustType,
  adjustReason,
  setAdjustReason,
  onClose,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manual Wallet Adjustment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Target User UID:</label>
            <input
              type="text"
              required
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Paste user UID..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Adjustment Type:</label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2"
              >
                <option value="credit">Credit (Add Balance)</option>
                <option value="debit">Debit (Deduct Balance)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Amount (৳):</label>
              <input
                type="number"
                min="1"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 font-bold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Mandatory Audit Reason:</label>
            <input
              type="text"
              required
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Campaign correction, referral bonus"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. Confirm Payout Modal
interface PayoutModalProps {
  open: boolean;
  customTrxId: string;
  setCustomTrxId: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  open,
  customTrxId,
  setCustomTrxId,
  onClose,
  onConfirm
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Confirm Cashout Disbursement</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block font-medium mb-1">Transaction Reference (TrxID):</label>
          <input
            type="text"
            value={customTrxId}
            onChange={(e) => setCustomTrxId(e.target.value)}
            placeholder="e.g. BKASH-9842104"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 font-mono font-bold text-slate-900 dark:text-white"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            This TrxID will be permanently recorded and visible to the earner as verification.
          </span>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            Confirm & Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};
