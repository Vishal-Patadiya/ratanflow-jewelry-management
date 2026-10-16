import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Viva Note: Executive Visual Analytics Component.
// Renders responsive Sales Velocity Trend (Area) and Category Revenue Share (Donut).
export default function SalesCharts({ salesTrend = [], categoryShare = [] }) {
  // Fallback realistic daily sales trend if API is hydrating
  const defaultTrend = [
    { hour: '10 AM', sales: 38500, orders: 4 },
    { hour: '12 PM', sales: 72400, orders: 9 },
    { hour: '02 PM', sales: 54200, orders: 7 },
    { hour: '04 PM', sales: 118000, orders: 15 },
    { hour: '06 PM', sales: 86250, orders: 12 },
    { hour: '08 PM', sales: 59000, orders: 9 }
  ];

  const trendData = salesTrend.length > 0 ? salesTrend : defaultTrend;

  // Fallback category breakdown
  const defaultCategories = [
    { name: 'Bridal Sets', value: 185 },
    { name: 'Rings', value: 98 },
    { name: 'Bangles', value: 72 },
    { name: 'Chains', value: 37 },
    { name: 'Earrings', value: 36 }
  ];

  const catData = categoryShare.length > 0 ? categoryShare : defaultCategories;
  const GOLD_PALETTE = ['#f59e0b', '#d97706', '#fbbf24', '#b45309', '#fde68a', '#78350f'];

  // Indian currency formatter
  const formatINR = (val) => `₹ ${Number(val).toLocaleString('en-IN')}`;

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal-900 border border-gold-500/30 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-gold-300">{label}</p>
          <p className="text-slate-200 mt-1">
            Billed Revenue: <span className="font-bold text-amber-400">{formatINR(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal-900 border border-gold-500/30 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-gold-300">{payload[0].name}</p>
          <p className="text-slate-200 mt-0.5">
            Revenue: <span className="font-bold text-amber-400">₹ {payload[0].value}K</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Showroom Sales Trend Area Chart */}
      <div className="card-glass p-4 sm:p-5 rounded-2xl border border-charcoal-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-serif">
              Today's Hourly Sales Velocity
            </h3>
            <p className="text-[11px] text-slate-400">
              Gross billing progression across showroom business hours
            </p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
            ₹ 4,28,350 Total
          </span>
        </div>

        <div className="h-60 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Share Donut Chart */}
      <div className="card-glass p-4 sm:p-5 rounded-2xl border border-charcoal-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-serif">
              Department Revenue Share
            </h3>
            <p className="text-[11px] text-slate-400">
              Distribution of billed value by jewelry department (₹ in Thousands)
            </p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-charcoal-800 text-slate-300 border border-charcoal-700">
            5 Departments
          </span>
        </div>

        <div className="h-60 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={catData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
              >
                {catData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GOLD_PALETTE[index % GOLD_PALETTE.length]}
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                formatter={(val) => <span className="text-slate-300 text-xs">{val}</span>}
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
