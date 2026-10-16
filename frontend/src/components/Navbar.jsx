import React, { useState } from 'react';
import { Gem, Lock, LogOut, Menu, X, Eye, Sparkles } from 'lucide-react';

// Viva Note: Universal Navbar supporting both Public Guest view and Authenticated Admin view.
// Fully responsive with mobile hamburger and off-canvas drawer triggers.
export default function Navbar({
  currentView,
  onNavigate,
  adminUser,
  onLogout,
  onToggleMobileDrawer
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger button ONLY for Admin Drawer on screens (<1024px) */}
          {currentView === 'admin' && (
            <button
              onClick={onToggleMobileDrawer}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-gold-400 hover:bg-charcoal-800 transition shrink-0"
              title="Open Admin Sidebar"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5 text-gold-400" />
            </button>
          )}

          {/* Brand Identity */}
          <div
            onClick={() => onNavigate('public')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:scale-105 transition shrink-0">
              <div className="w-full h-full bg-charcoal-950 rounded-[10px] flex items-center justify-center">
                <Gem className="w-4 h-4 text-gold-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-wider text-slate-100 font-serif whitespace-nowrap">
                  RATAN<span className="text-gold-400">FLOW</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30 rounded">
                  FINE JEWELRY
                </span>
              </div>
              <p className="hidden md:block text-[9px] text-slate-400 tracking-wider uppercase truncate">
                Artisanal Gold • Solitaires • Polki
              </p>
            </div>
          </div>
        </div>

        {/* Center / Navigation Links (Desktop only in Public View) */}
        {currentView === 'public' && (
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button
              onClick={() => onNavigate('public')}
              className="transition text-gold-400 font-semibold"
            >
              Showroom Vault
            </button>
            <a href="#collections" className="transition hover:text-gold-400">
              Gold & Diamond Sets
            </a>
            <a href="#vip-appointment" className="transition hover:text-gold-400 flex items-center gap-1 text-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Book VIP Visit
            </a>
            <a href="#contact" className="transition hover:text-gold-400">
              Flagship Atelier
            </a>
          </div>
        )}

        {/* Right Action: Admin Login or Admin Session */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {adminUser ? (
            /* Logged-in Admin Controls */
            <div className="flex items-center gap-1.5 sm:gap-3">
              {currentView === 'public' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20 transition flex items-center gap-1.5 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Suite</span>
                  <span className="sm:hidden text-[11px]">Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('public')}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-charcoal-800 text-slate-300 hover:text-slate-100 border border-charcoal-700 hover:bg-charcoal-700 transition flex items-center gap-1.5 shrink-0"
                  title="Switch to Customer Store View"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Public View</span>
                  <span className="sm:hidden text-[11px]">Store</span>
                </button>
              )}

              {/* Admin Name Pill (hidden on small mobile screens to prevent overflow) */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-charcoal-800">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-200 capitalize">{adminUser.user || 'deep soni'}</p>
                  <p className="text-[10px] text-gold-400/80">Store Administrator</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout of Admin Session"
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Public Visitor view: Admin Login button */
            <button
              onClick={() => onNavigate('login')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-gold-500/20 transition transform active:scale-95 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger ONLY for public links when in Public view */}
          {currentView === 'public' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-charcoal-800 shrink-0"
              aria-label="Toggle Public Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu for Public Links (Only rendered when in public view) */}
      {currentView === 'public' && mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-950 border-b border-charcoal-800 px-4 py-3 space-y-2 text-xs animate-fade-in">
          <button
            onClick={() => {
              onNavigate('public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-gold-400 font-semibold"
          >
            Showroom Vault
          </button>
          <a
            href="#collections"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-gold-300"
          >
            Gold & Diamond Sets
          </a>
          <a
            href="#vip-appointment"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gold-400 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Book VIP Visit
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-gold-300"
          >
            Flagship Atelier
          </a>
        </div>
      )}
    </nav>
  );
}
