import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Campaign, TaskCategory, MembershipTier } from '../types';
import { 
  Megaphone, 
  Plus, 
  BarChart, 
  Coins, 
  ExternalLink, 
  Eye, 
  MousePointer, 
  CheckCircle, 
  Pause, 
  Play, 
  X,
  Target,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const CampaignManagerView: React.FC = () => {
  const { campaigns, createCampaign, toggleCampaignStatus, submissions, currentUser } = useApp();
  const { t } = useLanguage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaignForProof, setSelectedCampaignForProof] = useState<Campaign | null>(null);

  // New Campaign Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('app_test');
  const [targetUrl, setTargetUrl] = useState('https://example.com/brand-promo');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80');
  const [budgetTotal, setBudgetTotal] = useState(25000);
  const [costPerAction, setCostPerAction] = useState(50);
  const [eligibleAudience, setEligibleAudience] = useState('Tech-savvy smartphone users in divisional cities');
  const [eligibleTiers, setEligibleTiers] = useState<MembershipTier[]>(['free', 'silver', 'gold', 'platinum']);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-30');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Role isolation: Campaign managers only see their own campaigns unless Super Admin
  const visibleCampaigns = isSuperAdmin
    ? campaigns
    : campaigns.filter((c) => c.managerId === currentUser.id);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const maxActions = Math.floor(budgetTotal / costPerAction);

    createCampaign({
      managerId: currentUser.id,
      managerName: currentUser.name,
      title: title.trim(),
      category,
      targetUrl: targetUrl.trim(),
      bannerUrl: bannerUrl.trim(),
      budgetTotal: Number(budgetTotal),
      costPerAction: Number(costPerAction),
      maxActions,
      eligibleTiers,
      eligibleAudience: eligibleAudience.trim(),
      startDate,
      endDate,
      status: 'active'
    });

    setIsCreateOpen(false);
    setTitle('');
  };

  const toggleTier = (tier: MembershipTier) => {
    if (eligibleTiers.includes(tier)) {
      if (eligibleTiers.length > 1) {
        setEligibleTiers(eligibleTiers.filter((t) => t !== tier));
      }
    } else {
      setEligibleTiers([...eligibleTiers, tier]);
    }
  };

  // Proofs associated with selected campaign
  const campaignProofs = selectedCampaignForProof
    ? submissions.filter((s) => s.category === selectedCampaignForProof.category)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Advertiser Campaign Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isSuperAdmin
              ? 'Super Admin View: Full platform campaign oversight & escrow tracking.'
              : `Managing campaigns for ${currentUser.name}. Role-isolated advertiser workspace.`}
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createCampaign}</span>
        </button>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Allocated Budget</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {visibleCampaigns.reduce((acc, c) => acc + c.budgetTotal, 0).toLocaleString()} ৳
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Escrow Deposited</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {visibleCampaigns.reduce((acc, c) => acc + c.budgetSpent, 0).toLocaleString()} ৳
          </p>
          <span className="text-[10px] text-slate-400">Verified payouts</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Verified Actions</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {visibleCampaigns.reduce((acc, c) => acc + c.actionsCompleted, 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-cyan-600 font-semibold">High accuracy conversions</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Ad Impressions</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {visibleCampaigns.reduce((acc, c) => acc + c.impressions, 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-purple-600 font-semibold">
            {visibleCampaigns.reduce((acc, c) => acc + c.clicks, 0).toLocaleString()} clicks
          </span>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {visibleCampaigns.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No campaigns found</p>
            <p className="text-xs text-slate-500 mt-1">Launch your first advertising campaign to start receiving verified engagements.</p>
          </div>
        ) : (
          visibleCampaigns.map((camp) => {
            const budgetPercent = Math.min(Math.round((camp.budgetSpent / camp.budgetTotal) * 100), 100);
            const remainingBudget = Math.max(0, camp.budgetTotal - camp.budgetSpent);
            const remainingActions = Math.max(0, camp.maxActions - camp.actionsCompleted);

            return (
              <div
                key={camp.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
                  
                  {/* Left: Banner & Title info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={camp.bannerUrl}
                      alt={camp.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {camp.category}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {camp.status}
                        </span>
                        {isSuperAdmin && (
                          <span className="text-[10px] text-slate-400">
                            Owner: {camp.managerName}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white truncate">
                        {camp.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Target: {camp.eligibleAudience}</span>
                        <span>•</span>
                        <span>Schedule: {camp.startDate} to {camp.endDate}</span>
                      </p>

                      <a
                        href={camp.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{camp.targetUrl}</span>
                      </a>
                    </div>
                  </div>

                  {/* Right: Stats & Action buttons */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    
                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold">Budget Spent</span>
                        <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {camp.budgetSpent.toLocaleString()} / {camp.budgetTotal.toLocaleString()} ৳
                        </p>
                        <span className="text-[10px] text-indigo-600 font-bold">{budgetPercent}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold">CPA / Action</span>
                        <p className="font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                          {camp.costPerAction} ৳
                        </p>
                        <span className="text-[10px] text-slate-400">Fixed CPA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold">Actions / Left</span>
                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {camp.actionsCompleted} / {camp.maxActions}
                        </p>
                        <span className="text-[10px] text-slate-400">{remainingActions} remaining</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCampaignForProof(camp)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                      >
                        View Proofs ({camp.actionsCompleted})
                      </button>
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className={`p-2 rounded-xl text-white font-bold text-xs shadow-xs transition ${
                          camp.status === 'active' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        title={camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                      >
                        {camp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Campaign Proofs Modal */}
      {selectedCampaignForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedCampaignForProof(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Verified Submissions for {selectedCampaignForProof.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review individual user completions and verification timestamps.
            </p>

            <div className="mt-4 space-y-2.5">
              {campaignProofs.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No submissions recorded yet.</p>
              ) : (
                campaignProofs.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{sub.userName}</p>
                      <p className="text-[11px] text-slate-400">{sub.submittedAt} • {sub.timeSpentSeconds}s spent</p>
                      {sub.proofData.text && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 italic">
                          "{sub.proofData.text}"
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                      <p className="text-[11px] font-bold text-amber-600 mt-1">+{sub.reward} ৳</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <span>Launch New Advertising Campaign</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define your budget, eligible audiences, cost per action, and target links.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bangladesh FinTech Beta Testing & Bug Drive"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="app_test">App Testing</option>
                    <option value="survey">Consumer Survey</option>
                    <option value="social">Social Engagement</option>
                    <option value="education">Educational Lesson</option>
                    <option value="content">Content Translation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    External Target URL:
                  </label>
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Banner Image URL:
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Campaign Budget (৳):
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={budgetTotal}
                    onChange={(e) => setBudgetTotal(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Per Action / CPA (৳):
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={costPerAction}
                    onChange={(e) => setCostPerAction(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
                Calculated Maximum Verified Conversions: <span className="font-extrabold">{Math.floor(budgetTotal / costPerAction)} actions</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Eligible Audience / Demographics:
                </label>
                <input
                  type="text"
                  value={eligibleAudience}
                  onChange={(e) => setEligibleAudience(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Eligible Membership Tiers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Eligible Earner Tiers:
                </label>
                <div className="flex items-center gap-2">
                  {(['free', 'silver', 'gold', 'platinum'] as MembershipTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => toggleTier(tier)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition ${
                        eligibleTiers.includes(tier)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
                >
                  Confirm Escrow & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
