import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, CheckCircle, Shield, X, Gift } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakClaimModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, claimStreakReward, useStreakFreeze } = useApp();
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const currentDayInCycle = (currentUser.streakDays % 7) + 1;

  const ladder = [
    { day: 1, coins: 10, xp: 20 },
    { day: 2, coins: 15, xp: 30 },
    { day: 3, coins: 20, xp: 40 },
    { day: 4, coins: 25, xp: 60 },
    { day: 5, coins: 35, xp: 80 },
    { day: 6, coins: 50, xp: 100 },
    { day: 7, coins: 80, xp: 200, special: '🏆 Bonus Badge + Free Freeze' },
  ];

  const handleClaim = () => {
    claimStreakReward();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25">
            <Flame className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t.streakTitle}
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                {currentUser.streakDays} {language === 'bn' ? 'দিন ধারাবাহিক' : 'Days Streak'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.streakBest}: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.longestStreak} days</span>
            </p>
          </div>
        </div>

        {/* Day 1 - 7 Ladder */}
        <div className="mt-6 grid grid-cols-7 gap-2">
          {ladder.map((item) => {
            const isPast = item.day < currentDayInCycle || (item.day === currentDayInCycle && currentUser.streakClaimedToday);
            const isToday = item.day === currentDayInCycle;
            return (
              <div
                key={item.day}
                className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/30 scale-105'
                    : isPast
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {language === 'bn' ? `দিন ${item.day}` : `D${item.day}`}
                </span>
                <div className="my-1.5 flex flex-col items-center">
                  {isPast ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : isToday ? (
                    <Gift className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-bounce" />
                  ) : (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">+{item.coins}</span>
                  )}
                </div>
                <span className="text-[9px] font-medium text-slate-500">
                  {item.xp} XP
                </span>
              </div>
            );
          })}
        </div>

        {/* Claim / Claimed Button */}
        <div className="mt-6">
          {currentUser.streakClaimedToday ? (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.streakClaimed}</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition"
            >
              <Flame className="w-5 h-5" />
              <span>{t.streakClaim} (+{ladder[currentDayInCycle - 1]?.coins || 15} Coins)</span>
            </button>
          )}
        </div>

        {/* Streak Freeze Perk */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{t.streakFreeze}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Protects streak if you miss a single day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              {currentUser.streakFreezeRemaining} Left
            </span>
            {currentUser.streakFreezeRemaining > 0 && (
              <button
                onClick={useStreakFreeze}
                className="px-2 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Use
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
