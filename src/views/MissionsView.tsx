import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Mission, MembershipTier } from '../types';
import { 
  Award, 
  Plus, 
  Calendar, 
  Users, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X,
  Target
} from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { missions, createMission, claimMissionReward, getMissionProgress, currentUser } = useApp();
  const { t, language } = useLanguage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [claimFeedback, setClaimFeedback] = useState<{ id: string; msg: string; isError: boolean } | null>(null);

  // New Mission Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [reqType, setReqType] = useState<Mission['reqType']>('approved_tasks');
  const [reqTarget, setReqTarget] = useState(5);
  const [rewardCoins, setRewardCoins] = useState(120);
  const [rewardXP, setRewardXP] = useState(300);
  const [eligibleTiers, setEligibleTiers] = useState<MembershipTier[]>(['free', 'silver', 'gold', 'platinum']);
  const [maxParticipants, setMaxParticipants] = useState(500);
  const [campaignBudget, setCampaignBudget] = useState(60000);

  const isAdmin = currentUser.role.includes('admin') || currentUser.role === 'task_manager';

  const handleClaim = (missionId: string) => {
    const res = claimMissionReward(missionId);
    setClaimFeedback({
      id: missionId,
      msg: res.message,
      isError: !res.success
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createMission({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl.trim(),
      startDate,
      endDate,
      reqType,
      reqTarget: Number(reqTarget),
      rewardCoins: Number(rewardCoins),
      rewardXP: Number(rewardXP),
      eligibleMembership: eligibleTiers,
      maxParticipants: Number(maxParticipants),
      campaignBudget: Number(campaignBudget),
      status: 'active'
    });

    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Mission & Challenge Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Participate in high-yield campaigns, complete task milestones, and earn verified bonus reserves.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createMission}</span>
          </button>
        )}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => {
          const progress = getMissionProgress(mission, currentUser.id);
          const feedback = claimFeedback?.id === mission.id ? claimFeedback : null;

          return (
            <div
              key={mission.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition"
            >
              <div>
                {/* Banner Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Status & Tier badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                      {mission.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white font-medium text-[10px]">
                      {mission.eligibleMembership.join(', ').toUpperCase()}
                    </span>
                  </div>

                  {/* Reward floating pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg">
                    <Coins className="w-4 h-4" />
                    <span>+{mission.rewardCoins} ৳</span>
                    <span className="text-[10px] opacity-80">({mission.rewardXP} XP)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {mission.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {mission.description}
                  </p>

                  {/* Requirements & Info */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Goal: {mission.reqTarget} completions</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{mission.currentParticipants} / {mission.maxParticipants} slots</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>End: {mission.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Budget: {mission.budgetSpent} / {mission.campaignBudget} ৳</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Your Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {progress.current} / {progress.target} ({progress.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action area */}
              <div className="p-5 pt-0">
                {feedback && (
                  <div
                    className={`mb-3 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      feedback.isError
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{feedback.msg}</span>
                  </div>
                )}

                {progress.isClaimed ? (
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Reward Already Claimed</span>
                  </div>
                ) : progress.canClaim ? (
                  <button
                    onClick={() => handleClaim(mission.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Claim {mission.rewardCoins} ৳ Reward Now</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{progress.isEligible ? 'In Progress' : 'Requires Higher Tier'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Create Challenge Modal */}
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
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Create Custom Platform Challenge</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure title, requirements, eligible tiers, and budget allocation.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Challenge Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Edu Sprint: Complete 10 Educational Tasks"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what participants must accomplish..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Image URL:
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Requirement Type:
                  </label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="approved_tasks">Approved Tasks</option>
                    <option value="education_tasks">Educational Tasks</option>
                    <option value="campaign_tasks">Sponsored Campaigns</option>
                    <option value="weekly_tasks">Weekly Challenge</option>
                    <option value="login_streak">Login Streak Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Count:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reqTarget}
                    onChange={(e) => setReqTarget(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reward (Coins / BDT):
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={rewardCoins}
                    onChange={(e) => setRewardCoins(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reward XP:
                  </label>
                  <input
                    type="number"
                    min="20"
                    value={rewardXP}
                    onChange={(e) => setRewardXP(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Max Participants:
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campaign Budget (৳):
                  </label>
                  <input
                    type="number"
                    min="1000"
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Eligible Membership Tiers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Eligible Membership Tiers:
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
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
