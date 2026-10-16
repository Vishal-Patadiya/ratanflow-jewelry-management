import React, { useState } from 'react';
import PartnerBanner from '../components/PartnerBanner';
import {
  Gem,
  Sparkles,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  ArrowRight,
  MapPin,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

// Viva Note: Public Customer Portal (Default Landing Page).
// Open to all guests without authentication; allows browsing collection,
// reading live counter presence, and dispatching VIP appointment requests.
export default function PublicHome({ products = [], partners = [], onNavigateToLogin }) {
  const [selectedMetal, setSelectedMetal] = useState('All');
  const [search, setSearch] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VIP Visit Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    interestCategory: 'Bridal Diamond Choker Set',
    budgetRange: '₹ 2,00,000 - ₹ 5,00,000',
    visitTime: 'Today, 4:30 PM',
    notes: ''
  });

  const availablePartners = partners.filter(p => p.isAvailableToday);

  // Currency format
  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  // Metal filters
  const metalPills = ['All', 'Gold 22K', 'Platinum 950', 'Rose Gold', 'Silver 925'];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.metalType.toLowerCase().includes(search.toLowerCase());

    const matchesMetal = selectedMetal === 'All' || p.metalType === selectedMetal;
    return matchesSearch && matchesMetal;
  });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Viva Note: Guest submission directly writes to MongoDB Inquiries queue
      const res = await axios.post('/api/inquiries', formData);
      if (res.data.success) {
        setInquirySuccess(true);
        setFormData({
          customerName: '',
          phone: '',
          interestCategory: 'Bridal Diamond Choker Set',
          budgetRange: '₹ 2,00,000 - ₹ 5,00,000',
          visitTime: 'Today, 4:30 PM',
          notes: ''
        });
      }
    } catch (err) {
      console.error('Error submitting VIP inquiry:', err);
      alert('Failed to register inquiry. Please try again or call our atelier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProductForVisit = (prod) => {
    setFormData(prev => ({
      ...prev,
      interestCategory: `${prod.name} (${prod.metalType})`
    }));
    const visitElement = document.getElementById('vip-appointment');
    if (visitElement) {
      visitElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 flex flex-col">
      {/* 1. TODAY AT COUNTER - LIVE PARTNER PRESENCE BANNER */}
      <PartnerBanner availablePartners={availablePartners} />

      {/* 2. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden border-b border-charcoal-800">
        {/* Ambient luxury lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exquisite Indian Fine Jewelry & Vault Solitaires</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-slate-100 max-w-4xl leading-tight">
            The Pinnacle of <span className="gold-gradient-text">Royal Heritage</span> & Certified Brilliance
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
            Every gemstone hand-inspected by certified gemologists. Browse master artisan necklaces,
            solitaire rings, and antique temple chokers, or request a private vault viewing session.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#collections"
              className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 shadow-lg shadow-gold-500/20 transition transform active:scale-95"
            >
              Explore Showroom Vault
            </a>
            <a
              href="#vip-appointment"
              className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-charcoal-900 border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 transition"
            >
              Book Private Consultation
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              100% BIS 916 Hallmarked Gold
            </span>
            <span className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-gold-400" />
              GIA & IGI Certified Solitaires
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              Live Vault Consultation
            </span>
          </div>
        </div>
      </section>

      {/* 3. SHOWROOM CATALOGUE & JEWELRY COLLECTIONS */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Gem className="w-4 h-4" />
              <span>Available Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-1">
              Curated Showroom Vault Collection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time available items at our flagship showroom counter.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search collections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-charcoal-900 border border-charcoal-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Metal Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {metalPills.map(metal => (
            <button
              key={metal}
              onClick={() => setSelectedMetal(metal)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedMetal === metal
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-charcoal-900 text-slate-400 hover:text-slate-200 border border-charcoal-800'
              }`}
            >
              {metal}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="card-glass rounded-2xl border border-charcoal-800 p-5 flex flex-col justify-between card-glass-hover group relative overflow-hidden"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-charcoal-900 border border-charcoal-700 text-gold-400">
                    {prod.category}
                  </span>

                  {prod.stockCount <= prod.minThreshold ? (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">
                      Only {prod.stockCount} left
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      In Vault Stock
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-serif font-bold text-slate-100 text-base group-hover:text-gold-300 transition line-clamp-2">
                  {prod.name}
                </h3>

                {/* Details */}
                <div className="mt-3 pt-3 border-t border-charcoal-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Purity / Metal:</span>
                    <span className="text-slate-200 font-medium">{prod.metalType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Weight:</span>
                    <span className="text-slate-200 font-medium">{prod.weightGrams} grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SKU Code:</span>
                    <span className="text-gold-400 font-mono text-[11px]">{prod.sku}</span>
                  </div>
                </div>
              </div>

              {/* Price & Book CTA */}
              <div className="mt-6 pt-3 border-t border-charcoal-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Retail Price</span>
                  <span className="font-serif font-bold text-lg text-slate-100 text-gold-gradient">
                    {formatINR(prod.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectProductForVisit(prod)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-gold-300 border border-gold-500/30 transition flex items-center gap-1"
                >
                  <span>Request View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VIP VISIT & INQUIRY BOOKING FORM (FEATURE 4 PUBLIC INTEGRATION) */}
      <section id="vip-appointment" className="bg-charcoal-900 border-y border-charcoal-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto card-glass p-6 sm:p-10 rounded-3xl border border-gold-500/30 shadow-2xl relative">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-semibold text-gold-400 tracking-wider">
              Private Showroom Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-1">
              Book a VIP Viewing Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Reserve our private viewing lounge. Our master valuers will prepare requested pieces in advance of your visit.
            </p>
          </div>

          {inquirySuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-100 font-serif">
                Appointment Registered Successfully
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you! Our showroom concierge has received your request and notified the co-owners on duty.
                Your requested jewelry pieces are now being prepared for inspection.
              </p>
              <button
                onClick={() => setInquirySuccess(false)}
                className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-charcoal-950 hover:bg-emerald-400"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Merchant"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Jewelry Interest / Piece</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Kundan Polki Choker"
                  value={formData.interestCategory}
                  onChange={(e) => setFormData({ ...formData, interestCategory: e.target.value })}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Date & Visit Time</label>
                <input
                  type="text"
                  required
                  placeholder="Today at 4:30 PM"
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Special Preferences / Custom Sizing Notes</label>
                <textarea
                  rows="2"
                  placeholder="Looking for GIA certified stones, ring size 14, or bridal set matching..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 shadow-lg shadow-gold-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Registering Appointment...' : 'Confirm VIP Reservation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 5. ATELIER FOOTER */}
      <footer id="contact" className="mt-auto bg-charcoal-950 border-t border-charcoal-800 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Gem className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="font-serif font-bold text-slate-100 text-sm">RATANFLOW ATELIER</p>
              <p className="text-[11px] text-slate-500">Zaveri Bazaar, Mumbai • Flagship Showroom</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <span>Customer Desk: +91 98200 12345</span>
            <button
              onClick={onNavigateToLogin}
              className="text-gold-400 hover:text-gold-300 font-semibold"
            >
              Management Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
