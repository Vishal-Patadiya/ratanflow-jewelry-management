import React, { useState } from 'react';
import { CalendarClock, Plus, CheckCircle, Clock, Trash2, User, Phone, Sparkles, Filter } from 'lucide-react';
import axios from 'axios';

// Viva Note: VIP Customer Inquiry Dispatcher Page.
// Allows floor managers to capture high-ticket appointments and prepare vault inventory ahead of visits.
export default function InquiriesPage({ inquiries, onInquiryCreated, onInquiryUpdated, onInquiryDeleted, partners }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    interestCategory: 'Bridal Diamond Choker Set',
    budgetRange: '₹ 3,00,000 - ₹ 5,00,000',
    visitTime: 'Today at 5:00 PM',
    notes: '',
    assignedPartner: partners?.[0]?.name || 'Ratan Verma'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status transition handler
  const handleAdvanceStatus = async (inquiry, newStatus) => {
    try {
      const res = await axios.patch(`/api/inquiries/${inquiry._id}/status`, { status: newStatus });
      if (res.data.success && onInquiryUpdated) {
        onInquiryUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      alert('Failed to update inquiry status');
    }
  };

  // Delete inquiry
  const handleDelete = async (inquiry) => {
    if (!window.confirm(`Delete appointment for ${inquiry.customerName}?`)) return;
    try {
      const res = await axios.delete(`/api/inquiries/${inquiry._id}`);
      if (res.data.success && onInquiryDeleted) {
        onInquiryDeleted(inquiry._id);
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry');
    }
  };

  // Create new appointment
  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/inquiries', formData);
      if (res.data.success && onInquiryCreated) {
        onInquiryCreated(res.data.data);
        setShowAddForm(false);
        setFormData({
          customerName: '',
          phone: '',
          interestCategory: 'Bridal Diamond Choker Set',
          budgetRange: '₹ 3,00,000 - ₹ 5,00,000',
          visitTime: 'Today at 5:00 PM',
          notes: '',
          assignedPartner: partners?.[0]?.name || 'Ratan Verma'
        });
      }
    } catch (err) {
      console.error('Error creating inquiry:', err);
      alert('Failed to create VIP appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter === 'All') return true;
    return inq.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-gold-400" />
            <h2 className="text-xl font-bold text-slate-100 font-serif">
              VIP Customer Inquiry Dispatcher
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track private vault viewings, stock readiness, and assign consulting partners.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-gold-500 to-amber-600 text-charcoal-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Book VIP Appointment'}</span>
        </button>
      </div>

      {/* New Appointment Form (Collapsible) */}
      {showAddForm && (
        <div className="card-glass p-5 rounded-xl border border-gold-500/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-4 border-b border-charcoal-800 pb-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-serif">
              Schedule New VIP Client Appointment
            </h3>
          </div>

          <form onSubmit={handleCreateInquiry} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Maharani Gayatri Devi"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
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
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Interest Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Polki Emerald Necklace"
                value={formData.interestCategory}
                onChange={(e) => setFormData({ ...formData, interestCategory: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Budget Expectation</label>
              <input
                type="text"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Scheduled Visit Time</label>
              <input
                type="text"
                required
                placeholder="Today at 4:30 PM"
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Co-Owner</label>
              <select
                value={formData.assignedPartner}
                onChange={(e) => setFormData({ ...formData, assignedPartner: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              >
                {partners.map(p => (
                  <option key={p._id} value={p.name}>{p.name} ({p.role})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1">Specific Vault Requests / Notes</label>
              <input
                type="text"
                placeholder="Client requested to view GIA certified stones with round brilliant cut"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-charcoal-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-gold-500 text-charcoal-950 hover:bg-gold-400 transition"
              >
                {isSubmitting ? 'Registering...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filter by Status:
        </span>
        {['All', 'Pending', 'Stock Prepared', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              statusFilter === st
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 font-semibold'
                : 'bg-charcoal-900 text-slate-400 hover:text-slate-200 border border-charcoal-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Admin Dispatcher Table */}
      <div className="card-glass rounded-xl border border-charcoal-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-900 border-b border-charcoal-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Client Name & Phone</th>
                <th className="py-3 px-4 font-semibold">Interest & Budget</th>
                <th className="py-3 px-4 font-semibold">Scheduled Visit</th>
                <th className="py-3 px-4 font-semibold">Assigned Partner</th>
                <th className="py-3 px-4 font-semibold">Dispatcher Status</th>
                <th className="py-3 px-4 font-semibold text-right">Workflow Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-charcoal-800/70">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                    No VIP appointments found for status "{statusFilter}".
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isPending = inq.status === 'Pending';
                  const isPrepared = inq.status === 'Stock Prepared';
                  const isCompleted = inq.status === 'Completed';

                  return (
                    <tr key={inq._id} className="hover:bg-charcoal-800/40 transition">
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 font-serif text-[13px]">
                          {inq.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{inq.phone}</span>
                        </div>
                      </td>

                      {/* Interest & Budget */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gold-300">
                          {inq.interestCategory}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Budget: {inq.budgetRange}
                        </div>
                        {inq.notes && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-xs truncate">
                            "{inq.notes}"
                          </div>
                        )}
                      </td>

                      {/* Visit Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          <span>{inq.visitTime}</span>
                        </div>
                      </td>

                      {/* Assigned Partner */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-charcoal-800 text-slate-300 border border-charcoal-700">
                          {inq.assignedPartner || 'General Floor'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                          isPending
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : isPrepared
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPending ? 'bg-amber-400' : isPrepared ? 'bg-blue-400' : 'bg-emerald-400'
                          }`} />
                          {inq.status}
                        </span>
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <button
                              onClick={() => handleAdvanceStatus(inq, 'Stock Prepared')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 flex items-center gap-1 transition"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Stock Prepared</span>
                            </button>
                          )}

                          {isPrepared && (
                            <button
                              onClick={() => handleAdvanceStatus(inq, 'Completed')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Mark Completed</span>
                            </button>
                          )}

                          {isCompleted && (
                            <button
                              onClick={() => handleAdvanceStatus(inq, 'Pending')}
                              className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-slate-200 bg-charcoal-800"
                            >
                              Re-open
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(inq)}
                            title="Delete appointment"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
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
