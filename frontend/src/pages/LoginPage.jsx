import React, { useState } from 'react';
import { Gem, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

// Viva Note: Showroom Authentication Page.
// Features 1-click demo logins so students don't fuddle with passwords during viva.
export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('ratan.verma');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Founder & Master Valuer');

  const handleLogin = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: username === 'ratan.verma' ? 'Ratan Verma' : username === 'aarav.patel' ? 'Aarav Patel' : 'Showroom Partner',
      username,
      role
    });
  };

  const handleQuickDemo = (demoName, demoRole) => {
    onLoginSuccess({
      name: demoName,
      username: demoName.toLowerCase().replace(' ', '.'),
      role: demoRole
    });
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md card-glass p-8 rounded-2xl border border-gold-500/30 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 shadow-lg shadow-gold-500/20 mb-3">
            <div className="w-full h-full bg-charcoal-950 rounded-[14px] flex items-center justify-center">
              <Gem className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-wider text-slate-100 font-serif">
            RATAN<span className="text-gold-400">FLOW</span>
          </h2>
          <p className="text-xs text-slate-400 tracking-wider uppercase mt-1">
            Jewelry Store Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Co-Owner ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-gold-500 transition"
                placeholder="co-owner.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Vault Access PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-gold-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" defaultChecked className="rounded bg-charcoal-900 border-charcoal-700 text-gold-500 focus:ring-0" />
              <span>Remember shift session</span>
            </label>
            <span className="text-gold-400/80 hover:text-gold-300 cursor-pointer">
              Forgot PIN?
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/25 transition transform active:scale-[0.99]"
          >
            <span>Authenticate & Access Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles for Viva Examiners */}
        <div className="mt-8 pt-6 border-t border-charcoal-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick Viva Demo Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickDemo('Ratan Verma', 'Founder & Master Valuer')}
              className="p-2.5 rounded-lg bg-charcoal-900/90 border border-gold-500/20 hover:border-gold-500/60 text-left transition"
            >
              <p className="text-xs font-semibold text-gold-300">Ratan Verma</p>
              <p className="text-[10px] text-slate-400">Master Valuer</p>
            </button>
            <button
              onClick={() => handleQuickDemo('Aarav Patel', 'Senior Gemologist')}
              className="p-2.5 rounded-lg bg-charcoal-900/90 border border-gold-500/20 hover:border-gold-500/60 text-left transition"
            >
              <p className="text-xs font-semibold text-gold-300">Aarav Patel</p>
              <p className="text-[10px] text-slate-400">Senior Gemologist</p>
            </button>
          </div>
        </div>

        {/* Certification badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500/60" />
          <span>BIS 916 & GIA Certified Retail Terminal</span>
        </div>
      </div>
    </div>
  );
}
