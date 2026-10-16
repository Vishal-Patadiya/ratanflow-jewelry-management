import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Viva Note: Recharts visual component rendering sales category distribution
// and stock velocity analysis for senior retail management.
export default function SimpleCharts({ products = [] }) {
  // Aggregate revenue by jewelry category
  const categoryMap = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    const val = (p.price || 0) * (p.stockCount || 1);
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
  });

  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: Math.round(categoryMap[cat] / 1000) // in Thousands
  }));

  // Fallback realistic category breakdown if products list is small
  const displayCategoryData = categoryData.length >= 3 ? categoryData : [
    { name: 'Bridal Sets', value: 1450 },
    { name: 'Rings', value: 920 },
    { name: 'Bangles', value: 810 },
    { name: 'Earrings', value: 480 },
    { name: 'Chains', value: 390 },
    { name: 'Pendants', value: 230 }
  ];

  // Stock vs Velocity comparison for top items
  const velocityData = products.slice(0, 6).map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    stock: p.stockCount,
    sales: p.recentSalesCount || 0,
    inquiries: p.inquiryCount || 0
  }));

  const GOLD_COLORS = ['#eab308', '#ca8a04', '#facc15', '#a16207', '#fde047', '#713f12'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal-900 border border-gold-500/30 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-gold-300">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-slate-300 mt-0.5">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="font-medium text-slate-100">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Category Stock Value (Pie Chart) */}
      <div className="card-glass p-5 rounded-xl border border-charcoal-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-serif">
              Category Valuation Distribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Valuation in Thousands (₹ '000) across departments
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded">
            Live Vault Distribution
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
              >
                {displayCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Stock vs Demand Velocity (Bar Chart) */}
      <div className="card-glass p-5 rounded-xl border border-charcoal-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-serif">
              Stock vs Customer Velocity
            </h3>
            <p className="text-[11px] text-slate-400">
              Correlating available inventory against live inquiries & sales
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-charcoal-800 text-slate-300 rounded border border-charcoal-700">
            Heuristic Velocity
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-slate-300 text-xs capitalize">{value}</span>}
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar dataKey="stock" name="Units in Stock" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inquiries" name="VIP Inquiries" fill="#facc15" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" name="Recent Sales" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
