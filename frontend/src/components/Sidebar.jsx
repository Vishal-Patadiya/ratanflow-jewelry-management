import React from 'react';
import { LayoutDashboard, Package, CalendarClock, Users, Sparkles } from 'lucide-react';

// Viva Note: Sidebar navigation allowing students to transition seamlessly between
// Dashboard overview, Inventory stock table, VIP customer inquiries, and Partner rosters.
export default function Sidebar({ activeTab, setActiveTab, pendingInquiriesCount, lowStockCount }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Store Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Inventory & Stock',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Alert` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    },
    {
      id: 'inquiries',
      label: 'VIP Inquiries',
      icon: CalendarClock,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} New` : null,
      badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/30'
    },
    {
      id: 'partners',
      label: 'Counter Roster',
      icon: Users,
      badge: null
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-charcoal-900 border-r border-charcoal-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation items */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 border border-gold-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Gold Rates Widget (Classic Indian Retail feature) */}
        <div className="p-3.5 rounded-xl bg-charcoal-950/80 border border-charcoal-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Live Gold Spot (MCX)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
          </div>
          <div className="space-y-1 pt-1 border-t border-charcoal-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">22K Gold (10g)</span>
              <span className="font-semibold text-gold-300">₹ 68,450</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">24K Gold (10g)</span>
              <span className="font-semibold text-gold-400">₹ 74,680</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Silver 925 (1kg)</span>
              <span className="font-semibold text-slate-200">₹ 91,200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project info footer */}
      <div className="pt-4 border-t border-charcoal-800/80 text-center">
        <p className="text-[11px] text-slate-500">
          Final Year Semester 4 Project
        </p>
        <p className="text-[10px] text-gold-500/80 font-medium mt-0.5">
          MERN Stack • RatanFlow v1.0
        </p>
      </div>
    </aside>
  );
}
