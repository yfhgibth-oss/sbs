import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LegalModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyContent: React.FC = () => (
  <div className="space-y-3">
    <p>
      <strong>1. Minimal Personal Data Collection Principle:</strong> We only collect data essential to verify genuine task completion and process financial disbursements (NID/phone for MFS verification, submission screenshots, and telemetry timestamps). We never sell your personal data.
    </p>
    <p>
      <strong>2. Anti-Fraud Telemetry & Privacy Safeguards:</strong> Our fraud detection algorithms calculate risk scores based on content fingerprints (e.g. duplicate hashes, rate patterns). Automated indicators never lead to automatic bans; every flagged action is subjected to manual human administrative review.
    </p>
    <p>
      <strong>3. Data Export & Erasure (GDPR Compliance):</strong> Users have the right to request a full machine-readable JSON export of their activity or demand permanent account erasure with a 14-day statutory revocation window.
    </p>
    <p>
      <strong>4. Age Verification & Child Protection:</strong> Users must be 18 years of age or older or operate under verified written guardian consent. Financial payouts and paid memberships are strictly restricted for unverified minors.
    </p>
  </div>
);

export const TermsOfServiceContent: React.FC = () => (
  <div className="space-y-3">
    <p>
      <strong>1. Performance-Based Micro-Work:</strong> Task & Earn is a micro-task and digital campaign marketplace. We do not promise, guarantee, or advertise fixed investment returns. All rewards are performance-contingent upon approved quality.
    </p>
    <p>
      <strong>2. Strict Prohibition on Ponzi / Multi-Level Structures:</strong> User rewards are 100% funded by advertiser escrow budgets. We strictly prohibit the use of membership fees or incoming earner deposits to subsidize older members.
    </p>
    <p>
      <strong>3. Prohibited Engagement:</strong> The use of bots, emulators, automated clickers, recycled screenshot proofs, duplicate transaction IDs, and fake video views will result in immediate task forfeiture and account restrictions.
    </p>
    <p>
      <strong>4. Financial Withdrawals:</strong> Disbursements are processed via authorized Bangladeshi Mobile Financial Services (bKash, Nagad, Rocket) and direct bank clearing. Processing fees are explicitly disclosed before execution.
    </p>
  </div>
);
