import React from 'react';
import { Clock, ShieldCheck, MapPin } from 'lucide-react';

// Viva Note: Live Counter Presence Banner.
// Visible on both public customer portal and admin suite.
// Displays only co-owners who are currently marked available today.
export default function PartnerBanner({ availablePartners = [], shiftHours = '10:00 AM - 08:00 PM' }) {
  const availableNames = availablePartners.length > 0
    ? availablePartners.map(p => p.name).join(', ')
    : 'All Partners Currently in Vault Consultation';

  return (
    <div className="bg-gradient-to-r from-charcoal-950 via-amber-950/40 to-charcoal-950 border-y border-gold-500/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left side: Live Pulse & Available Names */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-gold-400 tracking-wide uppercase text-[11px] shrink-0">
            Today at Counter:
          </span>
          <span className="text-slate-100 font-medium truncate">
            {availableNames}
          </span>
        </div>

        {/* Right side: Timings & BIS Hallmark Badge */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            <span>Timings: {shiftHours}</span>
          </span>
          <span className="hidden sm:inline-block text-charcoal-700">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BIS 916 & GIA Certified</span>
          </span>
        </div>
      </div>
    </div>
  );
}
