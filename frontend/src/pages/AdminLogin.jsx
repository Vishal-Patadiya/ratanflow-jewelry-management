import React, { useState } from 'react';
import { Gem, Lock, User, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

// Viva Note: Admin Authentication Gateway.
// Features hardcoded credentials validation (`deep soni` / `SONIHERE@1234`)
// with inline error handling and session persistence in localStorage.
export default function AdminLogin({ onLoginSuccess, onBackToPublic }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded evaluation credentials
  const EXPECTED_USER = 'deep soni';
  const EXPECTED_PASS = 'SONIHERE@1234';

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Check credentials (case-insensitive for username, exact match for password)
    if (userId.trim().toLowerCase() === EXPECTED_USER.toLowerCase() && password === EXPECTED_PASS) {
      const authPayload = {
        user: 'deep soni',
        role: 'Store Administrator & Owner',
        timestamp: new Date().toISOString()
      };

      // Persist admin session in localStorage
      localStorage.setItem('ratanflow_admin_auth', JSON.stringify(authPayload));

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(authPayload);
      }, 300);
    } else {
      setIsLoading(false);
      setErrorMessage('Invalid ID or Password');
    }
  };

  // 1-Click Fill helper for quick evaluation
  const handleAutoFill = () => {
    setUserId(EXPECTED_USER);
    setPassword(EXPECTED_PASS);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Showroom</span>
        </button>
      </div>

      {/* Split-Screen Luxury Modal Container */}
      <div className="w-full max-w-4xl card-glass rounded-3xl border border-gold-500/30 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        {/* Left Panel: Showroom Luxury Branding & Project Context */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-amber-950/40 border-b md:border-b-0 md:border-r border-charcoal-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 shadow-lg shadow-gold-500/25 mb-5">
              <div className="w-full h-full bg-charcoal-950 rounded-[14px] flex items-center justify-center">
                <Gem className="w-6 h-6 text-gold-400" />
              </div>
            </div>

            <span className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase">
              Management Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-1">
              RATAN<span className="text-gold-400">FLOW</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Fine Jewelry Retail & Vault ERP. Access stock velocity reports, live reorder threshold radar,
              VIP appointments queue, and partner floor presence controls.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal-800/80 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Restricted to Authorized Store Owners</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <KeyRound className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Role: Store Administrator & Owner</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form Barrier */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Admin Authentication
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter master credentials to access the management dashboard.
            </p>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                User ID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="deep soni"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="SONIHERE@1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/25 transition transform active:scale-98 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Open Vault'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fill Helper for Evaluator */}
          <div className="mt-6 pt-5 border-t border-charcoal-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              Evaluating the project? Click below to prefill credentials:
            </p>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-charcoal-800 hover:bg-gold-500/10 text-gold-300 border border-charcoal-700 hover:border-gold-500/40 transition"
            >
              Auto-Fill: <span className="font-mono text-gold-400">deep soni / SONIHERE@1234</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
