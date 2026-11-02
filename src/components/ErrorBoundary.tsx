import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Task & Earn Caught Runtime Error:', error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('taskearn_users');
      localStorage.removeItem('taskearn_current_user_id');
      localStorage.removeItem('taskearn_tasks');
      localStorage.removeItem('taskearn_submissions');
      localStorage.removeItem('taskearn_system_health');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              অ্যাপ লোড হতে সাময়িক সমস্যা হয়েছে। ক্যাশ রিসেট করে আবার রিলোড করুন।
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-700/60 text-left text-[11px] font-mono text-red-400 overflow-x-auto max-h-32 mb-5">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs text-white transition active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleResetCache}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-xs text-slate-200 transition active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
