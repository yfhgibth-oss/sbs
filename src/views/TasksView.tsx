import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Task, TaskCategory, MembershipTier } from '../types';
import { 
  CheckSquare, 
  Clock, 
  Coins, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  History, 
  Search, 
  ShieldAlert, 
  ExternalLink, 
  Camera, 
  FileText, 
  Link as LinkIcon, 
  X, 
  AlertCircle,
  Star,
  CheckCircle2,
  Clock4,
  Globe,
  Languages
} from 'lucide-react';
import { 
  getTaskTitle, 
  getTaskDescription, 
  getTaskGuidelines, 
  getCategoryLabel, 
  getProofTypeLabel,
  getTaskQuiz 
} from '../services/taskTranslations';
import { ImageUploadField } from '../components/ImageUploadField';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    currentUser, 
    savedTasks, 
    recentlyViewedTasks, 
    recommendedTasks, 
    saveTask, 
    unsaveTask, 
    trackViewTask, 
    submitTaskProof: appSubmitTaskProof,
    submissions 
  } = useApp();
  const { tasks: fbTasks, submitTaskProof: fbSubmitTaskProof, fbUser } = useFirebase();
  const { t, language } = useLanguage();

  const [taskLang, setTaskLang] = useState<'bn' | 'en'>(language);

  // Sync with global language if switched via header
  React.useEffect(() => {
    setTaskLang(language);
  }, [language]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'saved' | 'recent' | 'recommended'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  // Map live Firestore tasks created/modified by Admin
  const liveTasks: Task[] = fbTasks.length > 0 
    ? fbTasks.map((ft) => ({
        id: ft.id,
        title: ft.title,
        titleBn: ft.titleBn,
        description: ft.description,
        descriptionBn: ft.descriptionBn,
        category: (ft.taskType === 'video' ? 'social' : ft.taskType === 'education' ? 'education' : ft.taskType === 'survey' ? 'survey' : ft.taskType === 'image' ? 'app_test' : 'content') as TaskCategory,
        reward: ft.rewardAmount,
        xpReward: ft.xpReward || 50,
        requiredTier: 'free' as MembershipTier,
        proofType: ft.proofType === 'screenshot' ? 'screenshot' : ft.proofType === 'text' ? 'text' : 'url',
        timeEstimateMinutes: Math.ceil((ft.minTimeOnTaskSeconds || 180) / 60) || 3,
        tags: [ft.taskType, 'verified', 'escrow'],
        guidelines: [ft.instructions || 'Follow guidelines and submit verified proof.'],
        guidelinesBn: ft.instructionsBn ? [ft.instructionsBn] : undefined,
        instructions: ft.instructions,
        instructionsBn: ft.instructionsBn,
        quizQuestion: ft.quizQuestion,
        quizQuestionBn: ft.quizQuestionBn,
        quizOptions: ft.quizOptions,
        quizOptionsBn: ft.quizOptionsBn,
        correctOptionIndex: ft.correctOptionIndex,
        minTimeOnTaskSeconds: ft.minTimeOnTaskSeconds || 60,
        maxCompletions: ft.totalLimit || 1000,
        completedCount: ft.completedCount || 0,
        active: ft.status === 'active',
        rating: 4.9,
        sponsorName: 'Verified Partner Escrow'
      }))
    : tasks;

  // Evidence submission state
  const [proofText, setProofText] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofScreenshot, setProofScreenshot] = useState('');
  const [submitMessage, setSubmitMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [timeSpent, setTimeSpent] = useState(120);

  const categories: { id: TaskCategory | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Categories', labelBn: 'সব ক্যাটাগরি' },
    { id: 'education', labelEn: 'Education & Quizzes', labelBn: 'শিক্ষা ও কুইজ' },
    { id: 'app_test', labelEn: 'App Testing', labelBn: 'অ্যাপ টেস্টিং' },
    { id: 'survey', labelEn: 'Consumer Surveys', labelBn: 'ভোক্তা জরিপ' },
    { id: 'social', labelEn: 'Social Advocacy', labelBn: 'সোশ্যাল মিডিয়া' },
    { id: 'content', labelEn: 'Translation & Review', labelBn: 'কন্টেন্ট ও অনুবাদ' }
  ];

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    trackViewTask(task.id);
    setProofText('');
    setProofUrl('');
    setProofScreenshot('');
    setSubmitMessage(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (selectedTask.proofType === 'screenshot' && !proofScreenshot.trim()) {
      setSubmitMessage({ 
        text: taskLang === 'bn' ? 'দয়া করে আপনার ফোন বা কম্পিউটার থেকে স্ক্রিনশট বা প্রমাণের ছবি আপলোড করুন।' : 'Please upload or provide your completion screenshot proof.', 
        isError: true 
      });
      return;
    }
    if (selectedTask.proofType === 'text' && !proofText.trim()) {
      setSubmitMessage({ 
        text: taskLang === 'bn' ? 'দয়া করে কমপ্লিশন কোড বা কাজের বিবরণ লিখুন।' : 'Please enter your completion text or code.', 
        isError: true 
      });
      return;
    }
    if (selectedTask.proofType === 'url' && !proofUrl.trim()) {
      setSubmitMessage({ 
        text: taskLang === 'bn' ? 'দয়া করে কাজের পাবলিক লিংক বা রসিদের URL দিন।' : 'Please provide the submission link or URL receipt.', 
        isError: true 
      });
      return;
    }

    if (fbUser) {
      fbSubmitTaskProof(
        selectedTask.id,
        selectedTask.proofType,
        {
          screenshotUrl: proofScreenshot.trim() || undefined,
          text: proofText.trim() || undefined,
          url: proofUrl.trim() || undefined
        },
        timeSpent
      );
    }

    const res = appSubmitTaskProof(
      selectedTask.id,
      {
        screenshotUrl: proofScreenshot.trim() || undefined,
        text: proofText.trim() || undefined,
        link: proofUrl.trim() || undefined,
      },
      timeSpent
    );

    setSubmitMessage({
      text: res.message,
      isError: res.flagged
    });

    if (res.success && !res.flagged) {
      setTimeout(() => {
        setSelectedTask(null);
      }, 1500);
    }
  };

  // Filter tasks
  let displayedTasks: Task[] = liveTasks;
  if (activeFilter === 'saved') displayedTasks = savedTasks;
  if (activeFilter === 'recent') displayedTasks = recentlyViewedTasks;
  if (activeFilter === 'recommended') displayedTasks = liveTasks.filter((t) => t.reward >= 30);

  if (selectedCategory !== 'all') {
    displayedTasks = displayedTasks.filter((t) => t.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedTasks = displayedTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.titleBn && t.titleBn.toLowerCase().includes(q)) ||
        getTaskTitle(t, 'bn').toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.descriptionBn && t.descriptionBn.toLowerCase().includes(q)) ||
        getTaskDescription(t, 'bn').toLowerCase().includes(q) ||
        t.sponsorName?.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  const userSubmissions = submissions.filter((s) => s.userId === currentUser.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner with Recommendations & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="md:col-span-3 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-3.5 sm:p-6 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.recommendations}
            </span>
            <h1 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Verified Micro-Tasks Hub
            </h1>
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-indigo-100 leading-relaxed line-clamp-2 sm:line-clamp-none">
              Earn BDT & XP by completing real advertiser tasks, education quizzes, and app evaluations. Every task is backed by real brand escrow reserves.
            </p>
            <div className="mt-2.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/20 border border-white/10 font-medium">
                🎯 {tasks.length} Active Tasks
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/20 border border-white/10 font-medium">
                🛡️ Zero-Ponzi Guaranteed
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/20 border border-white/10 font-medium">
                ⚡ Instant Anti-Fraud Check
              </span>
            </div>
          </div>
        </div>

        {/* User Quick Stats Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 p-3 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-400">My Activity</span>
            <div className="mt-1.5 sm:mt-2 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-slate-500">Completed Tasks:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {userSubmissions.filter((s) => s.status === 'approved').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-slate-500">Pending Review:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {userSubmissions.filter((s) => s.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-slate-500">Saved Tasks:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {savedTasks.length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveFilter('recommended')}
            className="w-full mt-2 sm:mt-3 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold text-[10px] sm:text-xs hover:bg-indigo-100 transition"
          >
            Explore Recommendations
          </button>
        </div>
      </div>

      {/* Filter Tabs, Language Switcher & Search Bar */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 items-stretch lg:items-center justify-between">
          {/* Main Tab Switches */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {taskLang === 'bn' ? 'সব টাস্ক' : t.allTasks} ({tasks.length})
            </button>
            <button
              onClick={() => setActiveFilter('recommended')}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'recommended'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
              <span>{taskLang === 'bn' ? 'সুপারিশকৃত' : 'Recommended'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('saved')}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'saved'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{taskLang === 'bn' ? 'সেভ করা' : t.savedTasks} ({savedTasks.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('recent')}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'recent'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{taskLang === 'bn' ? 'সম্প্রতি দেখা' : t.recentlyViewed} ({recentlyViewedTasks.length})</span>
            </button>
          </div>

          {/* Bilingual Switcher & Search Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Task Language Direct Toggle */}
            <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
              <span className="text-[10px] font-bold text-slate-500 px-1 hidden sm:inline flex items-center gap-1">
                <Languages className="w-3 h-3 text-indigo-500" />
                <span>{taskLang === 'bn' ? 'ভাষা:' : 'Lang:'}</span>
              </span>
              <button
                type="button"
                onClick={() => setTaskLang('bn')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition flex items-center gap-1 ${
                  taskLang === 'bn'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="টাস্ক বাংলায় দেখুন"
              >
                <span>🇧🇩 বাংলা</span>
              </button>
              <button
                type="button"
                onClick={() => setTaskLang('en')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition flex items-center gap-1 ${
                  taskLang === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="View tasks in English"
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[130px] sm:min-w-[190px]">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={taskLang === 'bn' ? 'টাস্ক খুঁজুন...' : t.searchPlaceholder}
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {taskLang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {displayedTasks.length === 0 ? (
        <div className="py-12 sm:py-20 text-center rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CheckSquare className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">No tasks found</p>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Try switching categories or clearing search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {displayedTasks.map((task) => {
            const isSaved = currentUser.savedTaskIds.includes(task.id);
            const userSub = userSubmissions.find((s) => s.taskId === task.id);
            const isCompleted = userSub?.status === 'approved';
            const isPending = userSub?.status === 'pending';
            const isFlagged = userSub?.status === 'flagged';

            return (
              <div
                key={task.id}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition"
              >
                <div>
                  {/* Card Header: Category & Save button */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/50 truncate">
                        {getCategoryLabel(task.category, taskLang)}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {taskLang === 'bn' ? 'বাংলা' : 'EN'}
                      </span>
                    </div>
                    <button
                      onClick={() => (isSaved ? unsaveTask(task.id) : saveTask(task.id))}
                      className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title={isSaved ? t.unsaveTask : t.saveTask}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600/20" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title & Sponsor */}
                  <h3 className="mt-1.5 sm:mt-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 sm:line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {getTaskTitle(task, taskLang)}
                  </h3>
                  {task.sponsorName && (
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {taskLang === 'bn' ? `স্পন্সর: ${task.sponsorName}` : `By ${task.sponsorName}`}
                    </p>
                  )}

                  {/* Description preview */}
                  <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {getTaskDescription(task, taskLang)}
                  </p>

                  {/* Badges: Time, Proof, Tier */}
                  <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      {taskLang === 'bn' ? `${task.timeEstimateMinutes} মিনিট` : `${task.timeEstimateMinutes} min`}
                    </span>
                    <span>•</span>
                    <span>{getProofTypeLabel(task.proofType, taskLang)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      {task.rating}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Reward, XP & Action Button */}
                <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>+{task.reward} ৳</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">+{task.xpReward} XP</span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{taskLang === 'bn' ? 'সম্পন্ন' : 'Completed'}</span>
                      </span>
                    ) : isPending ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] sm:text-xs font-bold">
                        <Clock4 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{taskLang === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>
                      </span>
                    ) : isFlagged ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[10px] sm:text-xs font-bold">
                        <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{taskLang === 'bn' ? 'ফ্ল্যাগড' : 'Flagged'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenTask(task)}
                        className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] sm:text-xs shadow-xs active:scale-95 transition"
                      >
                        {taskLang === 'bn' ? 'টাস্ক শুরু করুন' : t.startTask}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal: Submission, Guidelines & Anti-Duplicate Warning */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-6 shadow-2xl">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header: Category, Tier & In-Modal Language Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-7">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {getCategoryLabel(selectedTask.category, taskLang)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  {taskLang === 'bn' ? 'প্রয়োজনীয় টিয়ার:' : 'Required Tier:'} <span className="uppercase font-bold">{selectedTask.requiredTier}</span>
                </span>
              </div>

              {/* In-Modal Quick Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => setTaskLang('bn')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    taskLang === 'bn'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🇧🇩 বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setTaskLang('en')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    taskLang === 'en'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <h2 className="mt-2.5 sm:mt-3 text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {getTaskTitle(selectedTask, taskLang)}
            </h2>

            {selectedTask.sponsorName && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {taskLang === 'bn' ? `স্পন্সর ক্যাম্পেইন: ${selectedTask.sponsorName}` : `Sponsored Campaign by ${selectedTask.sponsorName}`}
              </p>
            )}

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {getTaskDescription(selectedTask, taskLang)}
            </p>

            {/* Task Guidelines */}
            <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {taskLang === 'bn' ? 'কাজের নির্দেশিকা ও নিয়মাবলী:' : 'Submission Guidelines & Rules:'}
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {getTaskGuidelines(selectedTask, taskLang).map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
                <li>
                  {taskLang === 'bn'
                    ? `কাজে ন্যূনতম সততাপূর্ণ সময়: ${selectedTask.minTimeOnTaskSeconds} সেকেন্ড।`
                    : `Minimum honest time on task: ${selectedTask.minTimeOnTaskSeconds} seconds.`}
                </li>
              </ul>
            </div>

            {/* Interactive Quiz if task has quiz */}
            {(() => {
              const quiz = getTaskQuiz(selectedTask, taskLang);
              if (!quiz) return null;
              return (
                <div className="mt-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 p-3.5 sm:p-4 border border-indigo-200/80 dark:border-indigo-900/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    {taskLang === 'bn' ? 'যাচাইকরণ কুইজ প্রশ্ন:' : 'Verification Quiz Question:'}
                  </span>
                  <p className="mt-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {quiz.question}
                  </p>
                  <div className="mt-2.5 space-y-1.5">
                    {quiz.options.map((opt, i) => (
                      <label
                        key={i}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                          selectedQuizOption === i
                            ? 'border-indigo-600 bg-white dark:bg-slate-900 font-semibold shadow-xs'
                            : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                        }`}
                      >
                        <input
                          type="radio"
                          name="taskQuiz"
                          checked={selectedQuizOption === i}
                          onChange={() => setSelectedQuizOption(i)}
                          className="mt-0.5 text-indigo-600"
                        />
                        <span className="text-slate-800 dark:text-slate-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Anti-Fraud Warning Callout */}
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3.5 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {taskLang === 'bn' ? 'অ্যান্টি-ফ্রড ফিঙ্গারপ্রিন্ট চেকিং সক্রিয়' : 'Anti-Fraud Fingerprint Check Enabled'}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  {taskLang === 'bn'
                    ? 'সকল সাবমিশন স্বয়ংক্রিয় ইমেজ হ্যাশ ও ডুপ্লিকেট চেকের মাধ্যমে নিরীক্ষা করা হয়। বৈধ ও সঠিক কাজ দ্রুত অনুমোদিত হবে।'
                    : 'Submissions are screened against known image hashes, duplicate URLs, and recycled references. Legitimate submissions are swiftly approved.'}
                </p>
              </div>
            </div>

            {/* Evidence Submission Form */}
            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              {selectedTask.proofType === 'screenshot' && (
                <div className="space-y-2">
                  <ImageUploadField
                    value={proofScreenshot}
                    onChange={setProofScreenshot}
                    label={taskLang === 'bn' ? 'কাজের স্ক্রিনশট বা প্রমাণের ছবি আপলোড করুন:' : 'Upload Task Screenshot / Proof:'}
                    placeholder={taskLang === 'bn' ? 'ইমেজ লিংক পেস্ট করুন (ঐচ্ছিক)' : 'Paste image URL (optional)'}
                    folder="submissions"
                    required
                    language={taskLang}
                    helpText={taskLang === 'bn' 
                      ? 'মোবাইল বা কম্পিউটার থেকে সরাসরি স্ক্রিনশট সিলেক্ট বা ড্রপ করুন। কোনো লিংকের প্রয়োজন নেই।' 
                      : 'Select or drag & drop a screenshot directly from your phone or PC. No external link needed.'}
                    demoPresets={[
                      {
                        label: taskLang === 'bn' ? 'নমুনা স্ক্রিনশট ১' : 'Demo Screenshot 1',
                        url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80'
                      },
                      {
                        label: taskLang === 'bn' ? 'নমুনা স্ক্রিনশট ২' : 'Demo Screenshot 2',
                        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
                      }
                    ]}
                  />
                </div>
              )}

              {selectedTask.proofType === 'text' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{taskLang === 'bn' ? 'কমপ্লিশন কোড বা উত্তরের বিবরণ:' : 'Completion Code or Answer Text:'}</span>
                  </label>
                  <textarea
                    rows={3}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder={taskLang === 'bn' ? 'সার্টিফিকেট রেফারেন্স কোড বা কাজের বিবরণ লিখুন...' : 'Enter the reference certificate code, answers, or bug report description...'}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setProofText('FINLIT-CERT-BD-' + Math.floor(10000 + Math.random() * 90000))}
                    className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline block"
                  >
                    {taskLang === 'bn' ? 'নমুনা কমপ্লিশন কোড বসান' : 'Insert Valid Completion Code'}
                  </button>
                </div>
              )}

              {selectedTask.proofType === 'url' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{taskLang === 'bn' ? 'পাবলিক পোস্ট বা রসিদের লিংক:' : 'Public Receipt / Post URL:'}</span>
                  </label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://facebook.com/posts/... or https://forms.gle/..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setProofUrl(`https://social.example.com/share/usr_${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline block"
                  >
                    {taskLang === 'bn' ? 'নমুনা পোস্ট লিংক বসান' : 'Insert Sample Post URL'}
                  </button>
                </div>
              )}

              {/* Status Message */}
              {submitMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    submitMessage.isError
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitMessage.text}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white">+{selectedTask.reward} ৳</span>
                  <span className="text-[10px] sm:text-xs">({selectedTask.xpReward} XP)</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {taskLang === 'bn' ? 'বাতিল' : t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] sm:text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
                  >
                    {taskLang === 'bn' ? 'প্রমাণ সাবমিট করুন' : t.submitProof}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
