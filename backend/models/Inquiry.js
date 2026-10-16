const mongoose = require('mongoose');

// Viva Note: Schema for VIP customer appointments and custom jewelry inquiries.
// Allows owners to prepare stock before the customer arrives at the showroom.
const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    interestCategory: {
      type: String,
      required: true,
      trim: true
    },
    budgetRange: {
      type: String,
      default: '₹ 1,00,000 - ₹ 3,00,000'
    },
    visitTime: {
      type: String,
      required: [true, 'Visit time/date is required'],
      trim: true
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Stock Prepared', 'Completed'],
      default: 'Pending'
    },
    assignedPartner: {
      type: String,
      default: 'General Floor'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
