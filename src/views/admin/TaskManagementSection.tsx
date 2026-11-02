import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pause, 
  Play, 
  Edit3, 
  Trash2, 
  Coins, 
  ExternalLink, 
  Clock 
} from 'lucide-react';
import { FirestoreTask } from '../../services/firebaseService';

interface TaskManagementSectionProps {
  tasks: FirestoreTask[];
  language: 'bn' | 'en';
  onOpenNewTask: () => void;
  onOpenEditTask: (task: FirestoreTask) => void;
  onUpdateTask: (id: string, data: Partial<FirestoreTask>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const TaskManagementSection: React.FC<TaskManagementSectionProps> = ({
  tasks,
  language,
  onOpenNewTask,
  onOpenEditTask,
  onUpdateTask,
  onDeleteTask,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.taskType === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
      {/* Top Header */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{language === 'bn' ? 'টাস্ক ক্যাটালগ ও পরিচালনা' : 'Task Catalog'}</span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredTasks.length}/{tasks.length}
            </span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
            {language === 'bn' 
              ? 'টাস্ক তৈরি, রিওয়ার্ড কয়েন এডিট ও লিমিট নিয়ন্ত্রণ।' 
              : 'Create, edit coins, pause, and delete micro-tasks.'}
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] sm:text-xs transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{language === 'bn' ? 'নতুন টাস্ক' : 'Create Task'}</span>
        </button>
      </div>

      {/* Filter Bar (Compact on mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
          {/* Status Filter */}
          <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
            {(['all', 'active', 'paused'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-colors whitespace-nowrap ${
                  statusFilter === st 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {st === 'all' ? (language === 'bn' ? 'সব' : 'All') : st === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'পজড' : 'Paused')}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Types'}</option>
            <option value="video">Video Watching</option>
            <option value="app_install">App Install</option>
            <option value="web_visit">Web Visit</option>
            <option value="survey">Survey</option>
            <option value="social_follow">Social Follow</option>
            <option value="ad_click">Ad Click</option>
            <option value="quiz">Quiz</option>
            <option value="daily_bonus">Daily Bonus</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'টাস্ক খুঁজুন...' : 'Search tasks...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 sm:pl-8 pr-2.5 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Task Cards Grid (Compact on mobile, 2-col on tablet, 3-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-400">
            {language === 'bn' ? 'কোনো টাস্ক খুঁজে পাওয়া যায়নি' : 'No matching tasks found.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completedCount = task.completedCount || 0;
            const totalLimit = task.totalLimit || 1000;
            const progressPercent = Math.min(100, Math.round((completedCount / totalLimit) * 100));

            return (
              <div
                key={task.id}
                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-2xs overflow-hidden"
              >
                {/* Image Banner if exists (Compact height on mobile) */}
                {task.imageUrl && (
                  <div className="h-16 sm:h-24 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <img 
                      src={task.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold uppercase tracking-wider">
                      {task.taskType}
                    </div>
                  </div>
                )}

                {/* Card Content (Tighter padding on mobile) */}
                <div className="p-2.5 sm:p-3.5 space-y-2 flex-1">
                  {!task.imageUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                        {task.taskType}
                      </span>
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${task.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Progress Bar (Compact on mobile) */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{completedCount}/{totalLimit} ({progressPercent}%)</span>
                      <span className="text-[9px]">{language === 'bn' ? 'সম্পন্ন' : 'Done'}</span>
                    </div>
                    <div className="h-1 sm:h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta (Compact on mobile) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
                    <span className="flex items-center gap-0.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-3 h-3" />
                      +{task.rewardAmount} ৳
                    </span>
                    <span>·</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      +{task.xpReward} XP
                    </span>
                    {task.minTimeOnTaskSeconds && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          {task.minTimeOnTaskSeconds}s
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer (Smaller compact buttons on mobile) */}
                <div className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {task.externalUrl && (
                      <a
                        href={task.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                        title="URL"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      task.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {task.status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'পজড' : 'Paused')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={async () => {
                        const newStatus = task.status === 'active' ? 'paused' : 'active';
                        await onUpdateTask(task.id, { status: newStatus });
                        showToast(`Task ${newStatus === 'active' ? 'Activated' : 'Paused'}`);
                      }}
                      className="p-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title={task.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {task.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => onOpenEditTask(task)}
                      className="p-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Edit"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete task "${task.title}"?`)) {
                          await onDeleteTask(task.id);
                          showToast('Task deleted successfully.');
                        }
                      }}
                      className="p-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
