import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  X, 
  Search, 
  ExternalLink, 
  Eye, 
  Clock, 
  Coins, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { FirestoreSubmission } from '../../services/firebaseService';

interface SubmissionsSectionProps {
  submissions: FirestoreSubmission[];
  language: 'bn' | 'en';
  onReviewSubmission: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  onBulkApprove: () => Promise<void>;
  showToast: (msg: string) => void;
}

export const SubmissionsSection: React.FC<SubmissionsSectionProps> = ({
  submissions,
  language,
  onReviewSubmission,
  onBulkApprove,
  showToast
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesSearch = !searchQuery || 
      (sub.taskTitle && sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.userName && sub.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.proofText && sub.proofText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-5">
      {/* Evidence Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-xl overflow-hidden bg-slate-900 p-1.5 sm:p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <img 
              src={previewImage} 
              alt="Proof Evidence" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg mx-auto" 
            />
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? 'টাস্ক সাবমিশন ও প্রুফ যাচাইকরণ' : 'Proof Verification & Review'}</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">
            {language === 'bn' 
              ? 'ইউজারদের আপলোড করা স্ক্রিনশট ও কোড প্রুফ যাচাই করে একাউন্টে কয়েন রিওয়ার্ড অনুমোদন করুন।' 
              : 'Inspect submitted screenshots, answers, and time logs before releasing reward coins.'}
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={onBulkApprove}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>
              {language === 'bn' ? `সকল পেন্ডিং অনুমোদন (${pendingCount})` : `Bulk Approve All (${pendingCount})`}
            </span>
          </button>
        )}
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-0.5 sm:p-1 rounded-lg border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
          {[
            { id: 'pending', label: language === 'bn' ? 'অপেক্ষমান' : 'Pending', count: pendingCount, color: 'text-amber-600 dark:text-amber-400' },
            { id: 'approved', label: language === 'bn' ? 'অনুমোদিত' : 'Approved', count: approvedCount, color: 'text-emerald-600 dark:text-emerald-400' },
            { id: 'rejected', label: language === 'bn' ? 'বাতিল' : 'Rejected', count: rejectedCount, color: 'text-rose-600 dark:text-rose-400' },
            { id: 'all', label: language === 'bn' ? 'সকল' : 'All', count: submissions.length, color: 'text-slate-600 dark:text-slate-400' }
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                  active 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`font-mono text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full ${active ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-200/60 dark:bg-slate-800/80'} ${tab.color}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'টাস্ক বা ইউজারের নাম খুঁজুন...' : 'Search task or earner...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 sm:pl-8 pr-2.5 sm:pr-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-1">
            <CheckCircle2 className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-medium text-slate-600 dark:text-slate-400">
              {language === 'bn' ? 'কোনো সাবমিশন মেলেনি' : 'No submissions found in this view.'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const proofLink = sub.proofUrl || sub.evidenceUrl;
            const isImage = proofLink && (proofLink.startsWith('http') || proofLink.startsWith('data:image'));

            return (
              <div
                key={sub.id}
                className="p-2.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 shadow-xs"
              >
                {/* Info block */}
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className={`text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md ${
                      sub.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60' 
                        : sub.status === 'pending' 
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60' 
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60'
                    }`}>
                      {sub.status}
                    </span>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {sub.taskTitle || 'Micro Task'}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-slate-500">
                    <span>
                      {language === 'bn' ? 'ইউজার:' : 'Earner:'} <strong className="text-slate-700 dark:text-slate-300 font-medium">{sub.userName || sub.userId.slice(0, 8)}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 sm:gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      +{sub.rewardAmount} ৳
                    </span>
                    {sub.timeSpentSeconds && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
                          {sub.timeSpentSeconds}s
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span className="font-mono text-slate-400">
                      {sub.submittedAt ? sub.submittedAt.substring(0, 16) : 'Recent'}
                    </span>
                  </div>

                  {/* Evidence Display */}
                  <div className="p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-[11px] sm:text-xs space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium">
                      <span>{language === 'bn' ? 'জমা দেওয়া প্রমাণ:' : 'Submitted Evidence'} ({sub.proofType || 'proof'}):</span>
                      {proofLink && (
                        <a
                          href={proofLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 sm:gap-1"
                        >
                          <span>{language === 'bn' ? 'লিংক খুলুন' : 'Open Link'}</span>
                          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </a>
                      )}
                    </div>

                    {isImage ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => setPreviewImage(proofLink)}
                          className="group relative h-12 w-16 sm:h-16 sm:w-24 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shrink-0 cursor-pointer"
                        >
                          <img src={proofLink} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        </button>
                        <span className="text-[10px] sm:text-[11px] text-slate-500">
                          {language === 'bn' ? 'স্ক্রিনশট দেখতে ক্লিক করুন' : 'Click thumbnail to inspect full screenshot'}
                        </span>
                      </div>
                    ) : (
                      sub.proofText && (
                        <p className="font-mono text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-md border border-slate-200 dark:border-slate-700 select-all">
                          {sub.proofText}
                        </p>
                      )
                    )}

                    {sub.reviewNotes && (
                      <p className="text-[10px] sm:text-[11px] text-slate-500 italic">
                        Review note: "{sub.reviewNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Inline Action Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 md:self-center">
                  {sub.status === 'pending' ? (
                    <>
                      <button
                        onClick={async () => {
                          await onReviewSubmission(sub.id, 'approved', 'Verified and approved by Admin');
                          showToast(`Approved (+${sub.rewardAmount} ৳) for ${sub.userName || 'Earner'}!`);
                        }}
                        className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs"
                      >
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{language === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                      </button>
                      <button
                        onClick={async () => {
                          const reason = prompt('Reason for rejection:', 'Evidence does not match instructions.');
                          if (reason !== null) {
                            await onReviewSubmission(sub.id, 'rejected', reason || 'Evidence insufficient');
                            showToast('Submission rejected.');
                          }
                        }}
                        className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[11px] sm:text-xs transition-colors"
                      >
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{language === 'bn' ? 'বাতিল' : 'Reject'}</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1">
                      {sub.status === 'approved' ? '✓ Completed' : '✕ Rejected'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
