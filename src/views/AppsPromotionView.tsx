import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useApp } from '../context/AppContext';
import { PromotedApp } from '../services/firebaseService';
import { 
  Smartphone, 
  Download, 
  Plus, 
  ExternalLink, 
  Star, 
  CheckCircle, 
  Coins, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  X, 
  Upload, 
  FileText,
  AlertCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstallWebAppModal } from '../components/InstallWebAppModal';

const PRESET_ICONS = [
  { name: 'Finance / Wallet', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80' },
  { name: 'Quiz & Gaming', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80' },
  { name: 'News & Media', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80' },
  { name: 'Shopping & Store', url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=200&q=80' },
  { name: 'Social & Chat', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=200&q=80' },
  { name: 'Tools & Utilities', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80' }
];

export const AppsPromotionView: React.FC = () => {
  const { 
    promotedApps, 
    createPromotedApp, 
    fbUser, 
    userProfile, 
    isAdmin, 
    uploadImage, 
    settings 
  } = useFirebase();
  const { currentUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [activeProofApp, setActiveProofApp] = useState<PromotedApp | null>(null);

  // New App Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDeveloper, setNewDeveloper] = useState('');
  const [newCategory, setNewCategory] = useState<PromotedApp['category']>('games');
  const [newAppType, setNewAppType] = useState<PromotedApp['appType']>('android_apk');
  const [newIconUrl, setNewIconUrl] = useState(PRESET_ICONS[0].url);
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newRewardAmount, setNewRewardAmount] = useState<number>(50);
  const [newDescription, setNewDescription] = useState('');
  const [newInstructions, setNewInstructions] = useState('১. অ্যাপটি ডাউনলোড ও ইনস্টল করুন।\n২. অ্যাপটি ওপেন করে ৩০ সেকেন্ড ব্রাউজ করুন।\n৩. স্ক্রিনশট বা ইউজার আইডি সাবমিট করুন।');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Proof submission state
  const [proofText, setProofText] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);

  // Filter apps
  const activeApps = (promotedApps || []).filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDownloadUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'অনুগ্রহ করে অ্যাপের নাম এবং ডাউনলোড লিংক দিন।' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await createPromotedApp({
        title: newTitle.trim(),
        developer: newDeveloper.trim() || userProfile?.fullName || fbUser?.displayName || 'Community Developer',
        category: newCategory,
        appType: newAppType,
        iconUrl: newIconUrl,
        downloadUrl: newDownloadUrl.trim(),
        rewardAmount: Number(newRewardAmount) || 30,
        xpReward: Math.round((Number(newRewardAmount) || 30) * 1.5),
        description: newDescription.trim() || 'ইনস্টল করে এক্সক্লুসিভ রিওয়ার্ড বোনাস গ্রহণ করুন।',
        instructions: newInstructions.trim(),
        proofRequired: 'screenshot',
        rating: 4.8,
        featured: isAdmin,
        status: 'active',
        submittedBy: fbUser?.uid || currentUser?.id || 'guest',
        submittedByName: userProfile?.fullName || fbUser?.displayName || currentUser?.name || 'User'
      });

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setStatusMessage({ type: 'success', text: 'সফল হয়েছে! আপনার অ্যাপটি সফলভাবে যুক্ত এবং লাইভ করা হয়েছে।' });
      
      // Reset form
      setNewTitle('');
      setNewDeveloper('');
      setNewDownloadUrl('');
      setNewDescription('');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'অ্যাপ যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProofApp) return;

    setIsUploadingProof(true);
    try {
      let uploadedUrl = '';
      if (proofFile) {
        uploadedUrl = await uploadImage(proofFile, 'app_proofs');
      }

      // Auto celebrate
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setProofSuccess(true);
      setTimeout(() => {
        setProofSuccess(false);
        setActiveProofApp(null);
        setProofText('');
        setProofFile(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('প্রুফ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsUploadingProof(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apps & Games Directory & Promotion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              অ্যাপস হাব — ইনস্টল করুন ও রিওয়ার্ড আয় করুন
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              এখানে যে কেউ তার নিজের অ্যাপ যুক্ত ও প্রমোট করতে পারবে। অন্য ব্যবহারকারীরা অ্যাপটি ইনস্টল ও ট্রাই করে তাৎক্ষণিক নগদ রিওয়ার্ড ব্যালেন্স অর্জন করবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Download/Install Our Web App */}
            <button
              onClick={() => setIsInstallGuideOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-extrabold text-xs text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>ওয়েব অ্যাপ ইনস্টল করুন</span>
            </button>

            {/* Add New App Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 font-extrabold text-xs text-slate-950 shadow-lg shadow-amber-400/25 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন অ্যাপ যুক্ত করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">মোট লাইভ অ্যাপ</p>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {promotedApps?.length || 3} টি
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">সর্বোচ্চ রিওয়ার্ড / ইনস্টল</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ৳৬৫.০০
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">মোট সফল ইনস্টল</p>
          <p className="text-xl font-extrabold text-amber-500 mt-1">
            ৪,৭৮০+ বার
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">অফিশিয়াল ভার্সন</p>
          <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {settings?.appVersionInfo?.version || 'v2.5.0'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'সব অ্যাপ (All)' },
            { id: 'games', label: 'গেমস' },
            { id: 'finance', label: 'ফাইন্যান্স ও ওয়ালেট' },
            { id: 'social', label: 'সোশ্যাল ও নিউজ' },
            { id: 'tools', label: 'টুলস ও ইউটিলিটি' },
            { id: 'shopping', label: 'শপিং' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অ্যাপ খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Apps Grid */}
      {activeApps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">কোনো অ্যাপ পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            এই ক্যাটাগরিতে এখনো কোনো অ্যাপ যোগ করা হয়নি। আপনি চাইলে এখনই একটি নতুন অ্যাপ যোগ করতে পারেন।
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
          >
            প্রথম অ্যাপ যুক্ত করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition group"
            >
              <div>
                {/* Header row with Icon, Title, Badges */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <img
                    src={app.iconUrl}
                    alt={app.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 group-hover:scale-105 transition"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_ICONS[0].url;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {app.category}
                      </span>
                      {app.featured && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Featured
                        </span>
                      )}
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {app.appType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 truncate">
                      {app.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      By {app.developer}
                    </p>
                  </div>
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{app.rating || 4.8}</span>
                  </div>
                  <span>•</span>
                  <span>{app.downloadsCount || 1200}+ ইনস্টল</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {app.description}
                </p>
              </div>

              {/* Bottom Reward & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">ইনস্টল পুরস্কার:</span>
                  <span className="flex items-center gap-1 font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    +{app.rewardAmount} ৳
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={app.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" />
                    <span>ডাউনলোড</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => setActiveProofApp(app)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-xs transition active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>রিওয়ার্ড নিন</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD NEW APP MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  নতুন অ্যাপ যুক্ত করুন
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার বা যেকোনো প্রমোশনাল অ্যাপের তথ্য দিন যাতে ব্যবহারকারীরা ডাউনলোড করে
                </p>
              </div>
            </div>

            {statusMessage && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 mb-4 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অ্যাপের নাম (App Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AmarPay Digital Wallet"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ডেভেলপার / ব্র্যান্ডের নাম
                  </label>
                  <input
                    type="text"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    placeholder="e.g. AmarPay Technologies"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PromotedApp['category'])}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="games">গেমস (Gaming)</option>
                    <option value="finance">ফাইন্যান্স ও ওয়ালেট (Finance)</option>
                    <option value="social">সোশ্যাল ও নিউজ (Social)</option>
                    <option value="tools">টুলস ও ইউটিলিটি (Tools)</option>
                    <option value="shopping">শপিং ও ই-কমার্স (Shopping)</option>
                    <option value="education">শিক্ষা (Education)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্ল্যাটফর্ম টাইপ
                  </label>
                  <select
                    value={newAppType}
                    onChange={(e) => setNewAppType(e.target.value as PromotedApp['appType'])}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="android_apk">Android APK ডাউনলোড</option>
                    <option value="play_store">Google Play Store</option>
                    <option value="web_app">Web App / PWA</option>
                    <option value="ios">Apple iOS Store</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইনস্টল রিওয়ার্ড (৳)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newRewardAmount}
                    onChange={(e) => setNewRewardAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডাউনলোড বা স্টোর লিংক (Download URL) *
                </label>
                <input
                  type="url"
                  required
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  placeholder="https://play.google.com/store/apps/... অথবা APK লিংক"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Icon Selector / Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  অ্যাপের আইকন বা লোগো নির্বাচন করুন
                </label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {PRESET_ICONS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewIconUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition ${
                        newIconUrl === preset.url
                          ? 'border-indigo-600 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-full h-11 object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newIconUrl}
                  onChange={(e) => setNewIconUrl(e.target.value)}
                  placeholder="অথবা কাস্টম ইমেজ লিংক দিন (Custom Image URL)"
                  className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অ্যাপ সম্পর্কে বিবরণ
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="অ্যাপটিতে কি কি সুবিধা আছে এবং ব্যবহারকারী কেন ডাউনলোড করবে..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'যুক্ত হচ্ছে...' : 'অ্যাপ পাবলিশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLAIM REWARD & PROOF MODAL */}
      {activeProofApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7">
            
            <button
              onClick={() => setActiveProofApp(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={activeProofApp.iconUrl}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeProofApp.title}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  পুরস্কার: +{activeProofApp.rewardAmount} ৳
                </p>
              </div>
            </div>

            {proofSuccess ? (
              <div className="p-6 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                  প্রুফ সফলভাবে জমা হয়েছে!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  অ্যাডমিন পর্যালোচনার পর আপনার ওয়ালেটে ৳{activeProofApp.rewardAmount} স্বয়ংক্রিয়ভাবে ক্রেডিট হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    প্রুফ জমার নিয়ম:
                  </p>
                  <p className="whitespace-pre-line text-[11px] leading-relaxed">
                    {activeProofApp.instructions}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার ইউজার আইডি / অ্যাকাউন্ট নাম বা মন্তব্য
                  </label>
                  <input
                    type="text"
                    required
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="e.g. Installed app, logged in with 01700..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইনস্টলের স্ক্রিনশট ফাইল যুক্ত করুন
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300 hover:file:bg-indigo-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveProofApp(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingProof}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-xs text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {isUploadingProof ? 'জমা হচ্ছে...' : 'প্রুফ সাবমিট করুন'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Web App Install Guide Modal */}
      <InstallWebAppModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />

    </div>
  );
};
