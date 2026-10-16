import React from 'react';
import StatCards from '../components/StatCards';
import SimpleCharts from '../components/SimpleCharts';
import PartnerToggle from '../components/PartnerToggle';
import { CalendarClock, CheckCircle, Clock, AlertCircle, ShoppingBag, ArrowUpRight, Flame } from 'lucide-react';
import axios from 'axios';

// Viva Note: Main Dashboard View summarizing store sales metrics,
// velocity heuristics, VIP appointments queue, and partner floor readiness.
export default function DashboardPage({
  metrics,
  products,
  partners,
  inquiries,
  onPartnerUpdated,
  onInquiryUpdated,
  onNavigateTab
}) {
  const advanceInquiryStatus = async (inquiry) => {
    const nextStatus = inquiry.status === 'Pending' ? 'Stock Prepared' : 'Completed';
    try {
      // Viva Note: Dispatcher status transition
      const res = await axios.patch(`/api/inquiries/${inquiry._id}/status`, {
        status: nextStatus
      });
      if (res.data.success && onInquiryUpdated) {
        onInquiryUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Error advancing inquiry status:', err);
      alert('Failed to update inquiry status');
    }
  };

  // Recent simulated showroom sales matching the ₹ 4,28,350 total
  const recentSalesRecords = [
    {
      invoice: 'RF-INV-2026-089',
      item: 'Royal Heritage Kundan Polki Choker',
      customer: 'Mrs. S. Singhania',
      amount: '₹ 3,65,000',
      time: '12 mins ago',
      mode: 'NEFT / RTGS'
    },
    {
      invoice: 'RF-INV-2026-088',
      item: 'Classic 22K Floral Jhumka Earrings',
      customer: 'Pooja Agarwal',
      amount: '₹ 45,350',
      time: '45 mins ago',
      mode: 'HDFC Card'
    },
    {
      invoice: 'RF-INV-2026-087',
      item: 'Antique Oxidized Silver Payal',
      customer: 'Karan Malhotra',
      amount: '₹ 18,000',
      time: '1 hr ago',
      mode: 'UPI'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP SALES & INVENTORY KPI CARDS */}
      <StatCards
        metrics={metrics}
        onFilterLowStock={() => onNavigateTab('inventory', { filter: 'lowStock' })}
        onFilterHighDemand={() => onNavigateTab('inventory', { filter: 'highDemand' })}
      />

      {/* 2. RECHARTS SALES & VELOCITY VISUALIZATIONS */}
      <SimpleCharts products={products} />

      {/* 3. CO-OWNER COUNTER AVAILABILITY SECTION */}
      <PartnerToggle partners={partners} onPartnerUpdated={onPartnerUpdated} />

      {/* 4. SPLIT ROW: VIP CUSTOMER DISPATCHER & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* VIP Customer Inquiry Dispatcher */}
        {/* 4. VIP Customer Inquiry Dispatcher requirement */}
        <div className="card-glass rounded-xl border border-charcoal-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100 font-serif">
                  VIP Customer Dispatcher
                </h3>
                <p className="text-[11px] text-slate-400">
                  Prioritized appointments queue for vault viewing
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inq) => {
              const isPending = inq.status === 'Pending';
              const isPrepared = inq.status === 'Stock Prepared';
              const isCompleted = inq.status === 'Completed';

              return (
                <div
                  key={inq._id}
                  className="p-3 rounded-lg bg-charcoal-900/90 border border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {inq.customerName}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        isPending
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : isPrepared
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-gold-400/90 font-medium">
                      {inq.interestCategory}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {inq.visitTime}
                      </span>
                      <span>•</span>
                      <span>Assigned: {inq.assignedPartner || 'Floor Staff'}</span>
                    </div>
                  </div>

                  {/* Dispatch Action Button */}
                  <div>
                    {!isCompleted ? (
                      <button
                        onClick={() => advanceInquiryStatus(inq)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          isPending
                            ? 'bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40'
                            : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isPending ? 'Mark Stock Prepared' : 'Mark Completed'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Showroom Sales Stream */}
        <div className="card-glass rounded-xl border border-charcoal-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100 font-serif">
                  Showroom Invoices & Orders (56 Today)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Total billed volume: ₹ 4,28,350
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              ₹ 4,28,350 Gross
            </span>
          </div>

          <div className="space-y-2.5">
            {recentSalesRecords.map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-charcoal-900/90 border border-charcoal-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      {rec.item}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rec.invoice}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Customer: {rec.customer} • {rec.time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gold-400 font-serif">
                    {rec.amount}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {rec.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Demand Velocity Heuristic Viva Callout */}
          <div className="p-3 rounded-lg bg-gold-500/5 border border-gold-500/20 text-xs text-slate-300 flex items-start gap-2">
            <Flame className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gold-300">Viva Defense Note: </span>
              "Demand Velocity is computed dynamically via Mongoose schema virtuals. Items with (Recent Sales + VIP Inquiries) ≥ 5 automatically get flagged as High Demand without external ML libraries."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
