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
  Sparkles,
  ArrowUpDown,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import axios from 'axios';

// Viva Note: Main Inventory Table Page.
// Displays catalog items with dynamic low-stock alerts and demand heuristics.
export default function InventoryPage({
  products,
  onOpenAddModal,
  onOpenEditModal,
  onProductUpdated,
  onProductDeleted,
  initialFilter
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'all'); // 'all', 'lowStock', 'highDemand', 'slowMoving'
  const [isUpdatingStockId, setIsUpdatingStockId] = useState(null);

  const categories = ['All', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Chains', 'Pendants', 'Bridal Sets'];

  // Indian currency formatter
  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Quick live delta stock update (Instant Viva Demo button)
  const handleQuickStock = async (product, delta) => {
    try {
      setIsUpdatingStockId(product._id);
      // Viva Note: Calls PATCH /api/products/:id/stock
      const res = await axios.patch(`/api/products/${product._id}/stock`, { delta });
      if (res.data.success && onProductUpdated) {
        onProductUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Error updating stock quick:', err);
      alert('Failed to update stock');
    } finally {
      setIsUpdatingStockId(null);
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}" from showroom catalog?`)) {
      return;
    }
    try {
      const res = await axios.delete(`/api/products/${product._id}`);
      if (res.data.success && onProductDeleted) {
        onProductDeleted(product._id);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  // Filter products based on search, category, and heuristic flags
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.metalType.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesStatus = true;
    if (activeFilter === 'lowStock') {
      matchesStatus = p.lowStock === true;
    } else if (activeFilter === 'highDemand') {
      matchesStatus = p.demandStatus === 'High Demand';
    } else if (activeFilter === 'slowMoving') {
      matchesStatus = p.demandStatus === 'Slow Moving';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Add Product Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-400" />
            <h2 className="text-xl font-bold text-slate-100 font-serif">
              Master Jewelry Vault & Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock ledger with automatic threshold alerts & demand velocity heuristics.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jewelry Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-glass p-4 rounded-xl border border-charcoal-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by article name, SKU (e.g. RF-RNG), or metal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-charcoal-900 border border-charcoal-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Quick Filter Status Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-gold-500 text-charcoal-950 font-semibold'
                  : 'bg-charcoal-900 text-slate-400 hover:text-slate-200 border border-charcoal-700'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setActiveFilter('lowStock')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition ${
                activeFilter === 'lowStock'
                  ? 'bg-rose-500 text-white font-semibold'
                  : 'bg-charcoal-900 text-rose-400 hover:bg-rose-500/10 border border-rose-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Alerts ({products.filter(p => p.lowStock).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('highDemand')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition ${
                activeFilter === 'highDemand'
                  ? 'bg-amber-500 text-charcoal-950 font-semibold'
                  : 'bg-charcoal-900 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>High Demand ({products.filter(p => p.demandStatus === 'High Demand').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('slowMoving')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === 'slowMoving'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-charcoal-900 text-slate-400 hover:bg-slate-800 border border-charcoal-700'
              }`}
            >
              Slow Moving ({products.filter(p => p.demandStatus === 'Slow Moving').length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-charcoal-800/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50 font-semibold'
                  : 'bg-charcoal-900/60 text-slate-400 hover:text-slate-200 border border-charcoal-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory & Sales Table */}
      <div className="card-glass rounded-xl border border-charcoal-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-900 border-b border-charcoal-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Jewelry Piece & SKU</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Metal & Weight</th>
                <th className="py-3.5 px-4 font-semibold">Retail Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock / Threshold</th>
                <th className="py-3.5 px-4 font-semibold">Demand Heuristic</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-charcoal-800/70">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500 text-xs">
                    No jewelry items match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.lowStock;
                  const demand = product.demandStatus;
                  const isUpdating = isUpdatingStockId === product._id;

                  return (
                    <tr
                      key={product._id}
                      className={`hover:bg-charcoal-800/40 transition duration-150 ${
                        isLow ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 font-serif text-[13px]">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-gold-400 bg-charcoal-900 px-1.5 py-0.5 rounded border border-charcoal-700">
                            {product.sku}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Updated {new Date(product.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-charcoal-800 border border-charcoal-700 text-slate-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Metal & Weight */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-medium">
                          {product.metalType}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {product.weightGrams} grams
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 font-serif text-[13px]">
                          {formatRupees(product.price)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Gross Vault Value: {formatRupees(product.price * product.stockCount)}
                        </div>
                      </td>

                      {/* Stock Count & Threshold (1. INVENTORY & LOW-STOCK ALERT) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono font-bold text-sm text-slate-100">
                            {product.stockCount} <span className="text-[10px] font-normal text-slate-400">units</span>
                          </div>

                          {/* Viva Defense: "Checking if stock is lower than minimum threshold to set alert flag" */}
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              LOW STOCK
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Healthy
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Alert Threshold: ≤ {product.minThreshold} units
                        </div>
                      </td>

                      {/* Demand Status Heuristic (2. DEMAND STATUS HEURISTIC) */}
                      {/* Viva Defense: "If (recentSalesCount + inquiryCount) >= 5 -> High Demand; if stockCount > 8 and recentSales === 0 -> Slow Moving; else Normal" */}
                      <td className="py-3.5 px-4">
                        {demand === 'High Demand' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 inline-flex items-center gap-1 shadow-sm shadow-amber-500/10">
                            <Flame className="w-3.5 h-3.5" />
                            High Demand
                          </span>
                        )}
                        {demand === 'Slow Moving' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            Slow Moving
                          </span>
                        )}
                        {demand === 'Normal' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-800/80 text-slate-400 border border-charcoal-700">
                            Normal Velocity
                          </span>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Sales: {product.recentSalesCount || 0} • Inquiries: {product.inquiryCount || 0}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Quick Stock +/- Buttons for fast viva demonstration */}
                          <button
                            type="button"
                            disabled={isUpdating || product.stockCount <= 0}
                            onClick={() => handleQuickStock(product, -1)}
                            title="Decrease stock by 1"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickStock(product, 1)}
                            title="Increase stock by 1"
                            className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          {/* Edit Stock Modal Trigger */}
                          <button
                            onClick={() => onOpenEditModal(product)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-charcoal-800 hover:bg-gold-500/20 text-slate-200 hover:text-gold-300 border border-charcoal-700 hover:border-gold-500/40 flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Stock</span>
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleDelete(product)}
                            title="Delete jewelry item"
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
