import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, Flame, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, currentUser } = useApp();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || currentUser.role.includes('admin')
  );

  const displayed = filter === 'unread' ? userNotifications.filter((n) => !n.read) : userNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'mission':
        return <Award className="w-4 h-4 text-indigo-500" />;
      case 'reward':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'fraud':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.notifications}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {userNotifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Mark All */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded-md font-semibold transition ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2 py-1 rounded-md font-semibold transition ${
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {displayed.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No notifications to display.
            </div>
          ) : (
            displayed.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer ${
                  item.read
                    ? 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 opacity-80'
                    : 'border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
