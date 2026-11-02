import React, { useState } from 'react';
import { 
  AppVersionInfo, 
  PromotedApp, 
  FirestoreSettings 
} from '../../services/firebaseService';
import { 
  Smartphone, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Star, 
  Coins, 
  Save, 
  AlertCircle,
  Layers,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppUpdateSectionProps {
  settings: FirestoreSettings | null;
  language: 'en' | 'bn';
  onUpdateAppVersion: (versionInfo: AppVersionInfo, webAppDownloadUrl?: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const AppUpdateSection: React.FC<AppUpdateSectionProps> = ({
  settings,
  language,
  onUpdateAppVersion,
  showToast
}) => {
  const currentInfo = settings?.appVersionInfo;

  const [version, setVersion] = useState(currentInfo?.version || '2.5.0');
  const [versionCode, setVersionCode] = useState(currentInfo?.versionCode || 250);
  const [title, setTitle] = useState(currentInfo?.title || 'নতুন মেগা আপডেট ও দ্রুত ক্যাশআউট সুবিধা!');
  const [forceUpdate, setForceUpdate] = useState(currentInfo?.forceUpdate || false);
  const [active, setActive] = useState(currentInfo?.active !== false);
  const [downloadUrl, setDownloadUrl] = useState(settings?.webAppDownloadUrl || currentInfo?.downloadUrl || '');
  const [notes, setNotes] = useState<string[]>(
    currentInfo?.releaseNotes || [
      'নতুন অ্যাপস হাব যুক্ত হয়েছে — যে কেউ অ্যাপ যুক্ত করে প্রমোট করতে পারবে',
      'ওয়েবসাইট থেকেই সরাসরি ১-ক্লিকে ওয়েব অ্যাপ ইনস্টল ও আপডেট নোটিফিকেশন',
      'বিকাশ ও নগদ ক্যাশআউট আরও দ্রুত এবং তাৎক্ষণিক ট্র্যাকিং',
      'উন্নত পারফরম্যান্স ও বাগমুক্ত স্মুথ মোবাইল ইন্টারফেস'
    ]
  );
  const [newNoteInput, setNewNoteInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    setNotes([...notes, newNoteInput.trim()]);
    setNewNoteInput('');
  };

  const handleRemoveNote = (idx: number) => {
    setNotes(notes.filter((_, i) => i !== idx));
  };

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: AppVersionInfo = {
        version: version.trim(),
        versionCode: Number(versionCode),
        title: title.trim(),
        releaseNotes: notes,
        forceUpdate,
        downloadUrl: downloadUrl.trim(),
        publishedAt: new Date().toISOString().split('T')[0],
        active
      };

      await onUpdateAppVersion(payload, downloadUrl.trim());
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      showToast(language === 'bn' ? 'সফল হয়েছে! নতুন অ্যাপ ভার্সন পাবলিশ হয়েছে।' : 'Success! New app update published.');
    } catch (err) {
      console.error(err);
      showToast('Error publishing app update.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewModal = () => {
    window.dispatchEvent(new Event('taskearn_preview_update_modal'));
    showToast(language === 'bn' ? 'আপডেট নোটিফিকেশন পপআপ টেস্ট করা হচ্ছে' : 'Testing update popup on screen');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Smartphone className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950">
                PWA & Web App Engine
              </span>
              <span className="text-xs text-indigo-200">
                Current Version: <strong className="text-white">{currentInfo?.version || 'v2.5.0'}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              ওয়েব অ্যাপ ভার্সন ও আপডেট ম্যানেজার
            </h2>
          </div>
        </div>

        <button
          onClick={handlePreviewModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition active:scale-95"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>পপআপ প্রিভিউ টেস্ট করুন</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handlePublishUpdate} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ভার্সন নাম (e.g. 2.5.0) *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="2.5.0"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ভার্সন কোড (Numeric e.g. 250) *
              </label>
              <input
                type="number"
                required
                value={versionCode}
                onChange={(e) => setVersionCode(Number(e.target.value))}
                placeholder="250"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপডেট সক্রিয় স্ট্যাটাস
              </label>
              <select
                value={active ? 'active' : 'inactive'}
                onChange={(e) => setActive(e.target.value === 'active')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="active">🟢 Active (সবার জন্য নোটিফিকেশন চালু)</option>
                <option value="inactive">⚪ Paused (পপআপ বন্ধ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              আপডেট টাইটেল / হেডলাইন *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. নতুন মেগা আপডেট ও দ্রুত ক্যাশআউট সুবিধা!"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              সরাসরি APK বা এক্সটার্নাল ডাউনলোড লিংক (Optional)
            </label>
            <input
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://example.com/taskearn.apk (খালি রাখলে স্বয়ংক্রিয়ভাবে ওয়েব অ্যাপ ইনস্টল হবে)"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              এটি খালি রাখলে ব্যবহারকারীরা সরাসরি ওয়েবসাইট থেকেই পিডব্লিউএ (Web App) হিসেবে ১-ক্লিকে ইনস্টল করতে পারবে।
            </p>
          </div>

          {/* Release Notes List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              নতুন ফিচার ও চেঞ্জলগ (Release Notes / What's New)
            </label>
            
            <div className="space-y-2 mb-3">
              {notes.map((note, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 ml-1" />
                  <span className="flex-1 text-xs text-slate-700 dark:text-slate-200">{note}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNote(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="নতুন পয়েন্ট লিখুন (e.g. নতুন বোনাস অফার যুক্ত হয়েছে)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Force Update Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                বাধ্যতামূলক আপডেট (Force Update)
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                এটি চালু করলে ব্যবহারকারী আপডেট না করা পর্যন্ত অ্যাপ ব্যবহার চালিয়ে যেতে পারবে না।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={forceUpdate}
                onChange={(e) => setForceUpdate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              <span>পাবলিশ করার সাথে সাথে সকল ব্যবহারকারীর স্ক্রিনে নতুন আপডেট পপআপ চলে যাবে।</span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'আপডেট পাবলিশ করুন (Publish)'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

interface PromotedAppsSectionProps {
  promotedApps: PromotedApp[];
  language: 'en' | 'bn';
  onUpdateApp: (appId: string, updates: Partial<PromotedApp>) => Promise<void>;
  onDeleteApp: (appId: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const PromotedAppsSection: React.FC<PromotedAppsSectionProps> = ({
  promotedApps,
  language,
  onUpdateApp,
  onDeleteApp,
  showToast
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            App Store & Promotion Control
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            অ্যাপ প্রমোশন ও ডিরেক্টরি ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ব্যবহারকারী এবং বিজ্ঞাপনদাতাদের সাবমিট করা অ্যাপস পর্যালোচনা, অনুমোদন ও পুরস্কার নির্ধারণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <Layers className="w-4 h-4" />
          <span>মোট অ্যাপ: {promotedApps.length} টি</span>
        </div>
      </div>

      {/* Apps Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">অ্যাপ ও বিবরণ</th>
                <th className="p-4">ক্যাটাগরি ও টাইপ</th>
                <th className="p-4">পুরস্কার (৳)</th>
                <th className="p-4">সাবমিটকারী</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {promotedApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.iconUrl}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{app.title}</span>
                          {app.featured && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Featured
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">By {app.developer}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[9px]">
                      {app.category}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 uppercase">
                      {app.appType.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      +{app.rewardAmount} ৳
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{app.submittedByName || 'User'}</p>
                    <p className="text-[10px] text-slate-400">{app.submittedAt?.split('T')[0] || 'Recently'}</p>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={async () => {
                          const next = app.status === 'active' ? 'paused' : 'active';
                          await onUpdateApp(app.id, { status: next });
                          showToast(`App status changed to ${next}`);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {app.status === 'active' ? 'Pause' : 'Activate'}
                      </button>

                      <button
                        onClick={async () => {
                          await onUpdateApp(app.id, { featured: !app.featured });
                          showToast(`Featured status toggled!`);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-bold transition ${
                          app.featured
                            ? 'border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${app.title}"?`)) {
                            await onDeleteApp(app.id);
                            showToast('App deleted successfully.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete App"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
