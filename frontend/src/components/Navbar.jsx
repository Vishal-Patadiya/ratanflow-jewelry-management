import React from 'react';
import { Gem, Users, Clock, ShieldCheck, LogOut, Bell } from 'lucide-react';

// Viva Note: Top Navigation Component displaying brand header and
// the dynamic "Co-Owner Counter Availability" banner fetched from MongoDB.
export default function Navbar({ availablePartners, user, onLogout, lowStockCount }) {
  // Format available partner names
  const availableNamesString = availablePartners && availablePartners.length > 0
    ? availablePartners.map(p => p.name).join(', ')
    : 'No co-owners checked in yet';

  return (
    <header className="sticky top-0 z-40 bg-charcoal-900/90 backdrop-blur-md border-b border-charcoal-800">
      {/* 3. CO-OWNER COUNTER AVAILABILITY - TOP BANNER */}
      {/* Viva Defense: "Displays real-time floor presence so customers and staff know who is at the counters" */}
      <div className="bg-gradient-to-r from-charcoal-900 via-amber-950/40 to-charcoal-900 border-b border-gold-500/20 px-4 py-2 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="font-semibold text-gold-400 tracking-wide uppercase text-[11px]">
              Today at Counter:
            </span>
            <span className="text-slate-200 font-medium">
              {availableNamesString}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              <span>Timings: 10:00 AM - 8:00 PM</span>
            </span>
            <span className="hidden sm:inline-block text-charcoal-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              BIS 916 Hallmarked
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAV BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <div className="w-full h-full bg-charcoal-950 rounded-[7px] flex items-center justify-center">
              <Gem className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-slate-100 font-serif">
                RATAN<span className="text-gold-400">FLOW</span>
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30 rounded">
                JEWELRY ERP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase">
              Retail & Inventory Management System
            </p>
          </div>
        </div>

        {/* Right side user info & action */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Low Stock Indicator */}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-pulse">
              <Bell className="w-3.5 h-3.5" />
              <span>{lowStockCount} Items Low Stock</span>
            </div>
          )}

          {/* User badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-charcoal-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user?.name || 'Co-Owner Admin'}</p>
              <p className="text-[10px] text-gold-400/90 capitalize">{user?.role || 'Partner'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-charcoal-800 border border-gold-500/40 flex items-center justify-center text-xs font-bold text-gold-400">
              {user?.name ? user.name[0] : 'R'}
            </div>
            <button
              onClick={onLogout}
              title="Logout from session"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
