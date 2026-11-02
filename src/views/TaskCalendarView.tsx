import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Coins
} from 'lucide-react';

export const TaskCalendarView: React.FC = () => {
  const { tasks, submissions, currentUser } = useApp();
  const { t, language } = useLanguage();

  // Current calendar view state: October/November 2026
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Oct, 10 = Nov
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-31');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate calendar days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const formatDayDate = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const selectedDateTasks = tasks.filter((t) => t.scheduledDate === selectedDateStr);
  const selectedDateSubmissions = submissions.filter(
    (s) => s.userId === currentUser.id && s.submittedAt.startsWith(selectedDateStr)
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Task & Streak Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track daily drop schedules, streak verification checkpoints, and active mission deadlines.
          </p>
        </div>

        {/* Streak summary pill */}
        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 px-3.5 py-2 text-xs font-bold text-orange-800 dark:text-orange-300">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          <span>Active Streak: {currentUser.streakDays} Consecutive Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          
          {/* Calendar Header with Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {language === 'bn' ? monthNamesBn[currentMonth] : monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(9);
                  setCurrentYear(2026);
                  setSelectedDateStr('2026-10-31');
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16 rounded-2xl bg-slate-50/50 dark:bg-slate-800/10" />;
              }

              const dateStr = formatDayDate(day);
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === '2026-10-31';
              const dayTasks = tasks.filter((t) => t.scheduledDate === dateStr);
              const hasSubmissions = submissions.some((s) => s.userId === currentUser.id && s.submittedAt.startsWith(dateStr));
              
              // Simulate streak active on recent days up to today
              const isStreakDay = currentMonth === 9 && day >= 28 && day <= 31;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 p-1.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                      : isToday
                      ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {day}
                    </span>
                    {isStreakDay && (
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {dayTasks.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" title={`${dayTasks.length} drops`} />
                    )}
                    {hasSubmissions && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Completed Task" />
                    )}
                    {isToday && (
                      <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400">TODAY</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              Streak Maintained
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Scheduled Task Drop
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Completed Submission
            </span>
          </div>
        </div>

        {/* Selected Date Details Panel (1 Col) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Date</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedDateStr}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {selectedDateTasks.length} drops scheduled
              </span>
            </div>

            {/* Scheduled Tasks for date */}
            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Scheduled Tasks:
              </h4>

              {selectedDateTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 italic">No specific task drops scheduled on this date.</p>
              ) : (
                selectedDateTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {t.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                        <Coins className="w-3.5 h-3.5" />
                        +{t.reward} ৳
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {t.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Est. {t.timeEstimateMinutes} min</span>
                      <span className="capitalize">{t.proofType} proof</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed on this date */}
            {selectedDateSubmissions.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Your Completions:
                </h4>
                {selectedDateSubmissions.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-emerald-900 dark:text-emerald-200 truncate max-w-[170px]">
                        {s.taskTitle}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">+{s.reward} ৳</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Tip: Completing tasks on scheduled drop days awards an extra 10% XP bonus toward your next level.
          </div>
        </div>

      </div>

    </div>
  );
};
