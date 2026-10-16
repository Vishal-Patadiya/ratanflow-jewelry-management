import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Flame,
  Edit3,
  Trash2,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';

// Viva Note: Reorder Radar & Stock Threshold Manager Component.
// Encapsulates real-time inventory ledger with horizontal scroll-lock protection for mobile viewports.
export default function InventoryTable({
  products = [],
  onOpenAddModal,
  onOpenEditModal,
  onProductUpdated,
  onProductDeleted
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'reorder', 'highDemand', 'slowMoving'
  const [isUpdatingId, setIsUpdatingId] = useState(null);

  const categories = ['All', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Chains', 'Pendants', 'Bridal Sets'];

  // Indian Rupee currency format
  const formatINR = (num) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num || 0);

  // Quick live delta stock update
  const handleQuickStock = async (product, delta) => {
    try {
      setIsUpdatingId(product._id);
      const res = await dataService.updateStock(product._id, { delta });
      if (res.success && res.data && onProductUpdated) {
        onProductUpdated(res.data);
      }
    } catch (err) {
      console.error('Error updating stock quick:', err);
      alert('Failed to update stock');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from showroom catalog?`)) return;
    try {
      const res = await dataService.deleteProduct(product._id);
      if (res.success && onProductDeleted) {
        onProductDeleted(product._id);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete item');
    }
  };


  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.metalType.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesFilter = true;
    if (activeFilter === 'reorder') {
      matchesFilter = p.lowStock === true;
    } else if (activeFilter === 'highDemand') {
      matchesFilter = p.demandStatus === 'High Demand';
    } else if (activeFilter === 'slowMoving') {
      matchesFilter = p.demandStatus === 'Slow Moving';
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Quick Filter Chips & Add Button */}
      <div className="card-glass p-4 rounded-2xl border border-charcoal-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by design, SKU (e.g. RF-RNG), metal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-charcoal-900 border border-charcoal-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Add Jewelry Master Piece Button */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md shadow-gold-500/20 shrink-0 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-charcoal-800/80">
          {/* Quick status tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-gold-500 text-charcoal-950 font-semibold'
                  : 'bg-charcoal-900 text-slate-400 hover:text-slate-200 border border-charcoal-700'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setActiveFilter('reorder')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                activeFilter === 'reorder'
                  ? 'bg-rose-500 text-white font-semibold'
                  : 'bg-charcoal-900 text-rose-400 hover:bg-rose-500/10 border border-rose-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reorder Radar ({products.filter(p => p.lowStock).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('highDemand')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                activeFilter === 'highDemand'
                  ? 'bg-amber-500 text-charcoal-950 font-semibold'
                  : 'bg-charcoal-900 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>High Demand ({products.filter(p => p.demandStatus === 'High Demand').length})</span>
            </button>
          </div>

          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50 font-semibold'
                    : 'bg-charcoal-900/60 text-slate-400 border border-charcoal-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      {/* Viva Note: overflow-x-auto ensures table stays horizontally touch-scrollable without breaking mobile layout */}
      <div className="card-glass rounded-2xl border border-charcoal-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-charcoal-900/90 border-b border-charcoal-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Jewelry Article & SKU</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Metal / Weight</th>
                <th className="py-3 px-4 font-semibold">Retail Price</th>
                <th className="py-3 px-4 font-semibold">Vault Stock / Reorder Threshold</th>
                <th className="py-3 px-4 font-semibold">Demand Heuristic</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-charcoal-800/70">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500 text-xs">
                    No jewelry pieces match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isCriticalLow = p.lowStock;
                  const isUpdating = isUpdatingId === p._id;

                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-charcoal-800/40 transition duration-150 ${
                        isCriticalLow ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 font-serif text-[13px]">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-gold-400 bg-charcoal-900 px-1.5 py-0.5 rounded border border-charcoal-700">
                            {p.sku}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-charcoal-800 border border-charcoal-700 text-slate-300">
                          {p.category}
                        </span>
                      </td>

                      {/* Metal & Weight */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-medium">{p.metalType}</div>
                        <div className="text-[11px] text-slate-500">{p.weightGrams}g</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-serif font-bold text-slate-100 text-[13px]">
                        {formatINR(p.price)}
                      </td>

                      {/* Stock Count & Reorder Radar Badge */}
                      {/* Viva Defense: "If stockCount <= minThreshold, display Critical Low / Reorder badge" */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-100 text-sm">
                            {p.stockCount} <span className="text-[10px] font-normal text-slate-400">units</span>
                          </span>

                          {isCriticalLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Critical Low / Reorder
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Optimal
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Min Alert Level: ≤ {p.minThreshold} units
                        </div>
                      </td>

                      {/* Demand Heuristic */}
                      {/* Viva Defense: "If recentOrders + inquiries >= 5 -> High Demand; if stockCount > 8 and recentOrders === 0 -> Slow Moving" */}
                      <td className="py-3 px-4">
                        {p.demandStatus === 'High Demand' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 inline-flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            High Demand
                          </span>
                        )}
                        {p.demandStatus === 'Slow Moving' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-800 text-slate-400 border border-charcoal-700">
                            Slow Moving
                          </span>
                        )}
                        {p.demandStatus === 'Normal' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-800/80 text-slate-400 border border-charcoal-700">
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isUpdating || p.stockCount <= 0}
                            onClick={() => handleQuickStock(p, -1)}
                            title="Decrease stock by 1"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickStock(p, 1)}
                            title="Increase stock by 1"
                            className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(p)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-charcoal-800 hover:bg-gold-500/20 text-slate-200 hover:text-gold-300 border border-charcoal-700 hover:border-gold-500/40 flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Stock</span>
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
