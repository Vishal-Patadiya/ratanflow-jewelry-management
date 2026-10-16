const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// ==========================================
// 1. GET ALL CO-OWNER PARTNERS
// ==========================================
// Viva Note: Supplies counter presence for both Top Banner and Admin checklist
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ counterNumber: 1 });
    const available = partners.filter(p => p.isAvailableToday);

    res.json({
      success: true,
      count: partners.length,
      availableCount: available.length,
      availableNames: available.map(p => p.name),
      data: partners
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ==========================================
// 2. TOGGLE COUNTER AVAILABILITY STATUS
// ==========================================
// Viva Note: Instantly toggles presence when co-owner checks in at the showroom
router.patch('/:id/toggle', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    partner.isAvailableToday = !partner.isAvailableToday;
    await partner.save();

    res.json({
      success: true,
      message: `${partner.name} status updated to ${partner.isAvailableToday ? 'Available' : 'Off-duty'}`,
      data: partner
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. SEED OR ADD NEW PARTNER
// ==========================================
router.post('/', async (req, res) => {
  try {
    const newPartner = new Partner(req.body);
    const saved = await newPartner.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
