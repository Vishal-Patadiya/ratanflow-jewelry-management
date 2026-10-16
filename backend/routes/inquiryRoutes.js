const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// ==========================================
// 1. GET ALL VIP CUSTOMER INQUIRIES
// ==========================================
// Viva Note: Displays queue of high-value appointments for showroom staff
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    const pendingCount = inquiries.filter(i => i.status === 'Pending').length;
    const preparedCount = inquiries.filter(i => i.status === 'Stock Prepared').length;

    res.json({
      success: true,
      count: inquiries.length,
      metrics: {
        pendingCount,
        preparedCount,
        completedCount: inquiries.filter(i => i.status === 'Completed').length
      },
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ==========================================
// 2. DISPATCH NEW VIP INQUIRY (CUSTOMER FORM)
// ==========================================
// Viva Note: Submitted by customers or floor sales staff
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, interestCategory, budgetRange, visitTime, notes, assignedPartner } = req.body;

    const newInquiry = new Inquiry({
      customerName,
      phone,
      interestCategory,
      budgetRange: budgetRange || '₹ 1,00,000 - ₹ 3,00,000',
      visitTime,
      notes: notes || '',
      status: 'Pending',
      assignedPartner: assignedPartner || 'General Floor'
    });

    const saved = await newInquiry.save();
    res.status(201).json({
      success: true,
      message: 'VIP appointment scheduled successfully',
      data: saved
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. ADVANCE INQUIRY STATUS (ADMIN DISPATCHER)
// ==========================================
// Viva Note: Admin clicks button to advance "Pending" -> "Stock Prepared" -> "Completed"
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Stock Prepared', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: `Inquiry status changed to ${status}`,
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. DELETE INQUIRY
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
