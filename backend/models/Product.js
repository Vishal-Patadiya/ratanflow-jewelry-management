const mongoose = require('mongoose');

// Viva Note: Schema definition for Jewelry inventory items.
// We keep data types intuitive: Strings for labels, Numbers for pricing and weights.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Jewelry item name is required'],
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Chains', 'Pendants', 'Bridal Sets']
    },
    metalType: {
      type: String,
      required: true,
      enum: ['Gold 22K', 'Gold 18K', 'Rose Gold', 'Silver 925', 'Platinum 950']
    },
    weightGrams: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stockCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 3
    },
    recentSalesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    inquiryCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    // Viva Note: Enable virtuals in JSON outputs so our computed fields automatically travel to the React frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==========================================
// 1. LOW STOCK VIRTUAL PROPERTY
// ==========================================
// Viva Note: Checking if stock is lower than minimum threshold to set alert flag.
// A virtual property avoids storing redundant flags in the MongoDB database.
productSchema.virtual('lowStock').get(function () {
  return this.stockCount <= this.minThreshold;
});

// ==========================================
// 2. DEMAND STATUS HEURISTIC (BUSINESS LOGIC)
// ==========================================
// Viva Defense: "We implemented a lightweight heuristic rule to flag inventory velocity without needing external ML libraries."
// Rule 1: High Demand -> If (recentSales + inquiries) >= 5
// Rule 2: Slow Moving -> If stockCount > 8 AND recentSales === 0
// Rule 3: Normal      -> Default fallback
productSchema.virtual('demandStatus').get(function () {
  const combinedInterest = (this.recentSalesCount || 0) + (this.inquiryCount || 0);

  if (combinedInterest >= 5) {
    return 'High Demand';
  } else if (this.stockCount > 8 && (this.recentSalesCount || 0) === 0) {
    return 'Slow Moving';
  }
  return 'Normal';
});

module.exports = mongoose.model('Product', productSchema);
