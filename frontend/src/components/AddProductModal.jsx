import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import axios from 'axios';

// Viva Note: Add New Item Modal to demonstrate real-time Mongoose document insertion
export default function AddProductModal({ isOpen, onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: `RF-${Math.floor(100 + Math.random() * 900)}`,
    category: 'Rings',
    metalType: 'Gold 22K',
    weightGrams: 8.5,
    price: 65000,
    stockCount: 5,
    minThreshold: 3,
    recentSalesCount: 1,
    inquiryCount: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Viva Note: Sending POST request to /api/products
      const res = await axios.post('/api/products', {
        ...formData,
        weightGrams: Number(formData.weightGrams),
        price: Number(formData.price),
        stockCount: Number(formData.stockCount),
        minThreshold: Number(formData.minThreshold),
        recentSalesCount: Number(formData.recentSalesCount),
        inquiryCount: Number(formData.inquiryCount)
      });

      if (res.data.success && onProductCreated) {
        onProductCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Failed to add jewelry piece');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="card-glass w-full max-w-lg rounded-2xl border border-gold-500/30 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              Add New Jewelry Master Piece
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Design / Article Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Rajputi Kundan Haar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                SKU Tag Code
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-gold-400 font-mono focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Bangles">Bangles</option>
                <option value="Earrings">Earrings</option>
                <option value="Chains">Chains</option>
                <option value="Pendants">Pendants</option>
                <option value="Bridal Sets">Bridal Sets</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Metal / Purity
              </label>
              <select
                value={formData.metalType}
                onChange={(e) => setFormData({ ...formData, metalType: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="Gold 22K">Gold 22K (916)</option>
                <option value="Gold 18K">Gold 18K (750)</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="Platinum 950">Platinum 950</option>
                <option value="Silver 925">Silver 925</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Net Weight (Grams)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.weightGrams}
                onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Min. Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

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
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Saving to Vault...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
