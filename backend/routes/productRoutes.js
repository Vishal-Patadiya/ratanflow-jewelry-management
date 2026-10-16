const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ==========================================
// 1. GET ALL PRODUCTS & KPI METRICS
// ==========================================
// Viva Note: Route modularity keeps server.js clean and separates product concerns.
// Returns list of jewelry items along with computed store metrics.
router.get('/', async (req, res) => {
  try {
    const { category, search, filterLowStock } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { metalType: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Viva Note: Calculate executive KPIs on the fly for the dashboard cards
    const allProducts = await Product.find();
    const totalInventoryValue = allProducts.reduce((sum, item) => sum + (item.price * item.stockCount), 0);
    const lowStockItems = allProducts.filter(item => item.lowStock);
    const highDemandItems = allProducts.filter(item => item.demandStatus === 'High Demand');

    res.json({
      success: true,
      count: products.length,
      metrics: {
        totalProducts: allProducts.length,
        totalInventoryValue,
        lowStockCount: lowStockItems.length,
        highDemandCount: highDemandItems.length
      },
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching products', error: error.message });
  }
});

// ==========================================
// 2. GET SINGLE PRODUCT BY ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Jewelry item not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ==========================================
// 3. ADD NEW JEWELRY ITEM
// ==========================================
// Viva Note: Used during live demonstration to show real-time MongoDB insertion
router.post('/', async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      metalType,
      weightGrams,
      price,
      stockCount,
      minThreshold,
      recentSalesCount,
      inquiryCount
    } = req.body;

    // Check if SKU already exists
    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({ success: false, message: 'A product with this SKU already exists.' });
    }

    const newProduct = new Product({
      name,
      sku: sku || `RF-${Date.now().toString().slice(-4)}`,
      category,
      metalType,
      weightGrams: Number(weightGrams),
      price: Number(price),
      stockCount: Number(stockCount || 0),
      minThreshold: Number(minThreshold || 3),
      recentSalesCount: Number(recentSalesCount || 0),
      inquiryCount: Number(inquiryCount || 0)
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, message: 'Jewelry piece added successfully', data: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. UPDATE PRODUCT (FULL EDIT)
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Jewelry item not found' });
    }

    res.json({ success: true, message: 'Jewelry details updated', data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. QUICK STOCK EDIT (LIVE TEACHER DEMO)
// ==========================================
// Viva Note: Quick endpoint specifically designed to alter stock count live in front of examiner
router.patch('/:id/stock', async (req, res) => {
  try {
    const { stockCount, delta } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (typeof stockCount === 'number') {
      product.stockCount = Math.max(0, stockCount);
    } else if (typeof delta === 'number') {
      product.stockCount = Math.max(0, product.stockCount + delta);
    }

    await product.save();
    res.json({
      success: true,
      message: `Stock updated for ${product.name}. Current stock: ${product.stockCount}`,
      data: product
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. DELETE PRODUCT
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Product removed from catalog' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
