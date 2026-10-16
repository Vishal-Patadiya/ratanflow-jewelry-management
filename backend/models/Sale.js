const mongoose = require('mongoose');

// Viva Note: Schema for jewelry sales transactions and invoice records.
// Supports executive KPI calculations: Gross Revenue, Ticket Size, and Department Performance.
const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    itemName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Chains', 'Pendants', 'Bridal Sets']
    },
    metalType: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMode: {
      type: String,
      enum: ['NEFT / RTGS', 'HDFC Card', 'UPI', 'Cash', 'Split Payment'],
      default: 'UPI'
    },
    billedBy: {
      type: String,
      default: 'Ratan Verma'
    },
    saleDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sale', saleSchema);
