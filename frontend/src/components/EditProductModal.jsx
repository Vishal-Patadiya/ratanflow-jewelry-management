import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus, AlertTriangle, Sparkles } from 'lucide-react';
import { dataService } from '../services/dataService';

// Viva Note: Live Stock & Item Editor Modal.
// Designed specifically for live examination demonstration so teachers can watch
// stock changes reflect immediately across MongoDB, table badges, and KPI cards.
export default function EditProductModal({ isOpen, onClose, product, onProductSaved }) {
  const [formData, setFormData] = useState({
    stockCount: 0,
    price: 0,
    minThreshold: 3,
    recentSalesCount: 0,
    inquiryCount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        stockCount: product.stockCount || 0,
        price: product.price || 0,
        minThreshold: product.minThreshold || 3,
        recentSalesCount: product.recentSalesCount || 0,
        inquiryCount: product.inquiryCount || 0
      });
      setError('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Viva Note: Computed preview of whether stock is below threshold
  const isPreviewLowStock = formData.stockCount <= formData.minThreshold;
  const combinedInterest = Number(formData.recentSalesCount) + Number(formData.inquiryCount);
  const isPreviewHighDemand = combinedInterest >= 5;
  const isPreviewSlowMoving = formData.stockCount > 8 && Number(formData.recentSalesCount) === 0;

  const handleStockDelta = (delta) => {
    setFormData(prev => ({
      ...prev,
      stockCount: Math.max(0, prev.stockCount + delta)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await dataService.updateProduct(product._id, {
        stockCount: Number(formData.stockCount),
        price: Number(formData.price),
        minThreshold: Number(formData.minThreshold),
        recentSalesCount: Number(formData.recentSalesCount),
        inquiryCount: Number(formData.inquiryCount)
      });

      if (res.success && res.data && onProductSaved) {
        onProductSaved(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product details');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="card-glass w-full max-w-lg rounded-2xl border border-gold-500/30 p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gold-400 tracking-wider">
              Live Stock Adjustment • SKU: {product.sku}
            </span>
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              {product.name}
            </h3>
            <p className="text-xs text-slate-400">
              {product.category} • {product.metalType} • {product.weightGrams}g
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-charcoal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Live Heuristic Preview Box (Viva Highlight) */}
        <div className="mt-4 p-3.5 rounded-xl bg-charcoal-950/90 border border-charcoal-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Live Heuristic Evaluation:</span>
            <div className="flex items-center gap-2">
              {isPreviewLowStock ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  Low Stock Flag Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Stock Healthy
                </span>
              )}

              {isPreviewHighDemand && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" />
                  High Demand
                </span>
              )}

              {isPreviewSlowMoving && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
                  Slow Moving
                </span>
              )}
            </div>
          </div>

          <div className="text-right text-xs">
            <p className="text-slate-500">Threshold: {formData.minThreshold} units</p>
            <p className="text-gold-400 font-semibold">{formData.stockCount} in Vault</p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Quick Stock Controls */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Available Vault Stock Units
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleStockDelta(-1)}
                className="w-10 h-10 rounded-lg bg-charcoal-800 border border-charcoal-700 text-slate-200 hover:bg-charcoal-700 flex items-center justify-center font-bold"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="0"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: Math.max(0, parseInt(e.target.value) || 0) })}
                className="flex-1 text-center font-serif text-xl font-bold bg-charcoal-900 border border-gold-500/40 rounded-lg py-2 text-gold-300 focus:outline-none focus:border-gold-400"
              />

              <button
                type="button"
                onClick={() => handleStockDelta(1)}
                className="w-10 h-10 rounded-lg bg-charcoal-800 border border-charcoal-700 text-slate-200 hover:bg-charcoal-700 flex items-center justify-center font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Threshold and Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Min. Threshold Alert (Units)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Retail Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Velocity Controls for testing heuristic live */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-charcoal-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Recent Sales (Heuristic)
              </label>
              <input
                type="number"
                min="0"
                value={formData.recentSalesCount}
                onChange={(e) => setFormData({ ...formData, recentSalesCount: parseInt(e.target.value) || 0 })}
                className="w-full bg-charcoal-900 border border-charcoal-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Inquiry Count (Heuristic)
              </label>
              <input
                type="number"
                min="0"
                value={formData.inquiryCount}
                onChange={(e) => setFormData({ ...formData, inquiryCount: parseInt(e.target.value) || 0 })}
                className="w-full bg-charcoal-900 border border-charcoal-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-charcoal-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-gold-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving to Database...' : 'Save Live Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
