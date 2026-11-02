import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportTicket } from '../types';
import { 
  Headphones, 
  Plus, 
  MessageCircle, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Settings, 
  User, 
  ShieldCheck, 
  X
} from 'lucide-react';

export const SupportCenterView: React.FC = () => {
  const { 
    tickets, 
    createTicket, 
    replyTicket, 
    updateTicketStatus, 
    whatsAppConfig, 
    setWhatsAppConfig, 
    currentUser 
  } = useApp();
  const { t } = useLanguage();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [isOpenNewTicket, setIsOpenNewTicket] = useState(false);
  const [isWhatsAppConfigOpen, setIsWhatsAppConfigOpen] = useState(false);

  // New ticket state
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('task_dispute');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('medium');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  // WhatsApp config edit state
  const [waPhone, setWaPhone] = useState(whatsAppConfig.phone);
  const [waMsg, setWaMsg] = useState(whatsAppConfig.defaultMessage);

  const isAdminOrSupport = currentUser.role.includes('admin') || currentUser.role === 'support_manager';

  // Visible tickets: Users only see their own tickets; Support managers/Admins see all
  const visibleTickets = isAdminOrSupport
    ? tickets
    : tickets.filter((t) => t.userId === currentUser.id);

  const activeTicket = visibleTickets.find((t) => t.id === activeTicketId) || visibleTickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    replyTicket(activeTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    createTicket(newCategory, newPriority, newSubject.trim(), newMessage.trim(), newAttachment.trim() || undefined);
    setIsOpenNewTicket(false);
    setNewSubject('');
    setNewMessage('');
    setNewAttachment('');
  };

  const handleSaveWhatsAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsAppConfig({ phone: waPhone, defaultMessage: waMsg });
    setIsWhatsAppConfigOpen(false);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsAppConfig.defaultMessage);
    const cleanNumber = whatsAppConfig.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.supportCenterTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            24/7 Resolution Desk for task disputes, payment verifications, and direct WhatsApp escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct WhatsApp Callout Button */}
          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t.whatsAppDirect}</span>
          </button>

          {isAdminOrSupport && (
            <button
              onClick={() => setIsWhatsAppConfigOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Configure WhatsApp support number & message"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsOpenNewTicket(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.openTicket}</span>
          </button>
        </div>
      </div>

      {/* Main Support Workspace (Tickets List + Chat Thread) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs min-h-[580px]">
        
        {/* Left Column: Tickets Queue */}
        <div className="lg:border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Tickets ({visibleTickets.length})
            </span>
            <span className="text-[10px] text-slate-400">
              {isAdminOrSupport ? 'All Users' : 'My Requests'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {visibleTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No tickets open. Need help? Click "Open New Ticket".
              </div>
            ) : (
              visibleTickets.map((tkt) => {
                const isSelected = activeTicket?.id === tkt.id;
                return (
                  <button
                    key={tkt.id}
                    onClick={() => setActiveTicketId(tkt.id)}
                    className={`w-full text-left p-4 transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        tkt.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : tkt.priority === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tkt.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">{tkt.updatedAt}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {tkt.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{tkt.userName}</span>
                      <span className="font-semibold capitalize text-indigo-600 dark:text-indigo-400">
                        {tkt.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Columns: Conversation & Reply Panel */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      #{activeTicket.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeTicket.subject}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Category: <span className="font-semibold capitalize">{activeTicket.category.replace(/_/g, ' ')}</span> • Created by {activeTicket.userName} ({activeTicket.userEmail})
                  </p>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2">
                  {isAdminOrSupport ? (
                    <select
                      value={activeTicket.status}
                      onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value as any)}
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="awaiting_user">Awaiting User</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase">
                      {activeTicket.status.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px]">
                {activeTicket.attachmentUrl && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Paperclip className="w-3.5 h-3.5" />
                      Attached Verification Evidence:
                    </span>
                    <img
                      src={activeTicket.attachmentUrl}
                      alt="Attachment"
                      className="max-h-40 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}

                {activeTicket.messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                        {isAdmin ? (
                          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            {msg.senderName} (Official Support)
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {msg.senderName}
                          </span>
                        )}
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                            : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isAdminOrSupport ? 'Type official resolution reply...' : 'Type message to support desk...'}
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-16 text-center text-xs text-slate-400">
              Select a ticket on the left to view the conversation.
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {isOpenNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsOpenNewTicket(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-indigo-600" />
              <span>Submit New Support Ticket</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="task_dispute">Task Dispute / Verification</option>
                    <option value="payment_withdrawal">Payment / Withdrawal Inquiry</option>
                    <option value="account">Account & KYC Verification</option>
                    <option value="campaign">Advertiser Campaign Issue</option>
                    <option value="bug">Bug Report / Technical Issue</option>
                    <option value="general">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Summary of the issue..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Details:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your request in detail, including task IDs or transaction references..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attachment Image URL (Optional):
                </label>
                <input
                  type="url"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="https://... screenshot URL"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenNewTicket(false)}
                  className="px-3.5 py-1.5 text-slate-500 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Configuration Modal */}
      {isWhatsAppConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsWhatsAppConfigOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Configure WhatsApp Official Support</span>
            </h3>

            <form onSubmit={handleSaveWhatsAppConfig} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Support Phone Number (with Country Code):
                </label>
                <input
                  type="text"
                  required
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+8801700112233"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Pre-filled Message:
                </label>
                <textarea
                  rows={3}
                  required
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsAppConfigOpen(false)}
                  className="px-3.5 py-1.5 text-slate-500 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Save WhatsApp Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
