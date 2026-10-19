import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const AdminLoginGate: React.FC = () => {
  const { signInAdmin, authError, clearAuthError, setActiveView } = usePortfolio();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInAdmin();
    } catch {
      // Error handled in state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-6 text-[#F5F5F5]">
      <div className="w-full max-w-sm p-8 rounded-xl bg-[#111114] border border-white/[0.08] shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#18181C] border border-white/[0.08] flex items-center justify-center mx-auto text-[#668CFF]">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#F5F5F5]">
            Admin Gateway
          </h2>
          <p className="text-xs text-[#929292]">
            Protected portfolio management console
          </p>
        </div>

        {/* Security Policy Notice (Whitelisted email completely hidden for privacy) */}
        <div className="p-3.5 rounded-lg bg-[#161619] border border-white/[0.06] space-y-1.5 text-xs text-[#929292] leading-relaxed">
          <div className="flex items-center gap-1.5 font-mono text-[#668CFF] text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Restricted Access</span>
          </div>
          <p>
            Protected by Google Authentication and Cloud Firestore rules. Only whitelisted administrators are granted access.
          </p>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Authentication Rejected</span>
            </div>
            <p className="text-xs text-red-200/80 leading-relaxed">
              {authError}
            </p>
            <button
              onClick={clearAuthError}
              className="text-[11px] font-mono text-red-400 hover:underline pt-1 block"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Sign In Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#F5F5F5] bg-[#18181C] hover:bg-[#202026] border border-white/[0.1] rounded-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{loading ? 'Verifying...' : 'Sign In with Google'}</span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('public')}
            className="w-full text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Return to Portfolio</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
