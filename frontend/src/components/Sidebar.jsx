import React from 'react';
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  Users,
  Sparkles,
  X,
  FileSpreadsheet
} from 'lucide-react';

// Viva Note: Responsive Admin Sidebar.
// Renders static panel on >= 1024px (desktop) and animated off-canvas drawer on < 1024px.
export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingInquiriesCount,
  lowStockCount,
  isOpen,
  onClose
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Stock & Thresholds',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Reorder` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
    },
    {
      id: 'sales',
      label: 'Sales Ledger & Reports',
      icon: FileSpreadsheet,
      badge: '56 Invoices',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    },
    {
      id: 'inquiries',
      label: 'VIP Inquiries Dispatcher',
      icon: CalendarClock,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} New` : null,
      badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/40'
    },
    {
      id: 'partners',
      label: 'Partner Counter Roster',
      icon: Users,
      badge: null
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-charcoal-800">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            Management Suite
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Store Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 border border-gold-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
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

        {/* Live MCX Gold Spot Widget */}
        <div className="p-3.5 rounded-xl bg-charcoal-950/80 border border-charcoal-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Live Gold Spot (MCX)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div className="space-y-1 pt-1 border-t border-charcoal-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">22K Gold (10g)</span>
              <span className="font-semibold text-gold-300">₹ 68,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">24K Gold (10g)</span>
              <span className="font-semibold text-gold-400">₹ 74,680</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Silver 925 (1kg)</span>
              <span className="font-semibold text-slate-200">₹ 91,200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-charcoal-800 text-center">
        <p className="text-[11px] text-slate-500">
          RatanFlow Management ERP
        </p>
        <p className="text-[10px] text-gold-500/80 font-medium mt-0.5">
          Semester 4 Final Project • v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden lg:block w-64 bg-charcoal-900 border-r border-charcoal-800 shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Off-Canvas Drawer (< 1024px) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-charcoal-900 h-full shadow-2xl border-r border-charcoal-800 flex flex-col z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
