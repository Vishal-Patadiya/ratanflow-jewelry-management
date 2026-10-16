import React from 'react';
import { IndianRupee, ShoppingBag, AlertTriangle, Flame, Layers } from 'lucide-react';

// Viva Note: Displays high-level sales KPIs and inventory metrics.
// Combines fixed retail sales figures with live aggregated MongoDB metrics.
export default function StatCards({ metrics, onFilterLowStock, onFilterHighDemand }) {
  // Format currency in Indian numbering format
  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const cards = [
    {
      title: "Today's Gross Sales",
      value: "₹ 4,28,350",
      subtext: "+14.8% vs yesterday",
      subtextColor: "text-emerald-400",
      icon: IndianRupee,
      glowColor: "from-gold-500/20 to-amber-600/10",
      borderColor: "border-gold-500/30",
      iconColor: "text-gold-400"
    },
    {
      title: "Showroom Invoices",
      value: "56 Orders",
      subtext: "Avg. ticket: ₹ 76,491",
      subtextColor: "text-slate-400",
      icon: ShoppingBag,
      glowColor: "from-blue-500/20 to-cyan-600/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400"
    },
    {
      title: "Catalog Valuation",
      value: formatRupees(metrics?.totalInventoryValue || 4572500),
      subtext: `${metrics?.totalProducts || 8} Master jewelry designs`,
      subtextColor: "text-slate-400",
      icon: Layers,
      glowColor: "from-indigo-500/20 to-purple-600/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400"
    },
    {
      title: "Low Stock Alerts",
      value: `${metrics?.lowStockCount || 0} Items`,
      subtext: "StockCount <= MinThreshold",
      subtextColor: metrics?.lowStockCount > 0 ? "text-rose-400 font-semibold" : "text-slate-400",
      icon: AlertTriangle,
      glowColor: "from-rose-500/20 to-red-600/10",
      borderColor: metrics?.lowStockCount > 0 ? "border-rose-500/50" : "border-charcoal-700",
      iconColor: "text-rose-400",
      onClick: onFilterLowStock,
      clickable: true
    },
    {
      title: "High Demand Velocity",
      value: `${metrics?.highDemandCount || 0} Pieces`,
      subtext: "(Sales + Inquiries) ≥ 5",
      subtextColor: "text-amber-400 font-semibold",
      icon: Flame,
      glowColor: "from-amber-500/20 to-yellow-600/10",
      borderColor: "border-amber-500/40",
      iconColor: "text-amber-400",
      onClick: onFilterHighDemand,
      clickable: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.clickable ? card.onClick : undefined}
            className={`card-glass p-4 rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.glowColor} relative overflow-hidden transition-all duration-200 ${
              card.clickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 tracking-wide">
                {card.title}
              </span>
              <div className="p-2 rounded-lg bg-charcoal-900/80 border border-charcoal-700/60">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-bold text-slate-100 tracking-tight font-serif">
                {card.value}
              </div>
              <p className={`text-[11px] mt-1 ${card.subtextColor}`}>
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
