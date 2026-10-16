import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Clock, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

// Viva Note: Admin roster component for showroom partners.
// Allows instantaneous toggle of partner floor duty with optimistic UI updates.
export default function PartnerToggle({ partners, onPartnerUpdated }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleToggle = async (partner) => {
    try {
      setLoadingId(partner._id);
      // Viva Note: Sending PATCH request to backend to flip boolean isAvailableToday
      const res = await axios.patch(`/api/partners/${partner._id}/toggle`);
      if (res.data.success && onPartnerUpdated) {
        onPartnerUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Error toggling partner status:', err);
      alert('Failed to update counter availability.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="card-glass rounded-xl border border-charcoal-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" />
            <h3 className="text-base font-semibold text-slate-100 font-serif">
              Co-Owner Counter Presence Roster
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Check or uncheck partners to update the live public showroom banner instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            {partners.filter(p => p.isAvailableToday).length} Available Today
          </span>
          <span className="px-2.5 py-1 rounded-full bg-charcoal-800 text-slate-400 border border-charcoal-700">
            {partners.length} Total Partners
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {partners.map((partner) => {
          const isAvailable = partner.isAvailableToday;
          const isLoading = loadingId === partner._id;

          return (
            <div
              key={partner._id}
              className={`p-4 rounded-xl border transition-all duration-200 relative ${
                isAvailable
                  ? 'bg-gradient-to-b from-charcoal-850 to-charcoal-900 border-gold-500/40 shadow-md shadow-gold-500/5'
                  : 'bg-charcoal-900/60 border-charcoal-800/90 opacity-75'
              }`}
            >
              {/* Counter Pill */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-charcoal-950 border border-charcoal-700 text-gold-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-500" />
                  Counter {partner.counterNumber}
                </span>

                {/* Status indicator */}
                <span className={`flex items-center gap-1 text-[11px] font-medium ${
                  isAvailable ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Off-duty
                    </>
                  )}
                </span>
              </div>

              {/* Partner Name & Role */}
              <h4 className="text-sm font-bold text-slate-100 tracking-wide font-serif">
                {partner.name}
              </h4>
              <p className="text-xs text-gold-400/90 mt-0.5">
                {partner.role}
              </p>

              {/* Shift timings */}
              <div className="mt-3 pt-2.5 border-t border-charcoal-800/80 space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{partner.shiftHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{partner.contactPhone || '+91 98200 12345'}</span>
                </div>
              </div>

              {/* Interactive Toggle Control */}
              <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Counter Presence:
                </span>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleToggle(partner)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAvailable ? 'bg-gold-500' : 'bg-charcoal-700'
                  } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-charcoal-950 shadow ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
