const mongoose = require('mongoose');

// Viva Note: Schema for Co-Owners and Counter partners managing physical counters.
const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    isAvailableToday: {
      type: Boolean,
      default: false
    },
    shiftHours: {
      type: String,
      default: '10:00 AM - 08:00 PM'
    },
    counterNumber: {
      type: Number,
      required: true
    },
    contactPhone: {
      type: String,
      default: '+91 98200 12345'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Partner', partnerSchema);
