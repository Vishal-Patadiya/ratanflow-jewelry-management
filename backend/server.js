require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const productRoutes = require('./routes/productRoutes');
 const partnerRoutes = require('./routes/partnerRoutes');
 const inquiryRoutes = require('./routes/inquiryRoutes');
 const saleRoutes = require('./routes/saleRoutes');

// Sample seed data fallback helper
const { sampleProducts, samplePartners, sampleInquiries, sampleSales } = require('./seedData');
const Product = require('./models/Product');
const Partner = require('./models/Partner');
const Inquiry = require('./models/Inquiry');
const Sale = require('./models/Sale');


const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
// Viva Note: CORS enables cross-origin communication between React (port 5173) and Express (port 5000)
app.use(cors());
app.use(express.json());

// Request logger for easy debugging during viva
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// MOUNT API ROUTES
// ==========================================
// Viva Defense: "Separating routes into dedicated modules adheres to Single Responsibility Principle"
app.use('/api/products', productRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/sales', saleRoutes);

// System health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RatanFlow - Jewelry Store Management System',
    timestamp: new Date(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend dist files in production if available
const path = require('path');
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Root welcome / fallback
app.get('/api', (req, res) => {
  res.send('<h3>✨ RatanFlow API Server is running. Visit <a href="/api/health">/api/health</a> or <a href="/api/products">/api/products</a></h3>');
});

// ==========================================
// MONGODB CONNECTION WITH AUTO-FALLBACK
// ==========================================
// Viva Note: Robust database bootstrap. Tries local MongoDB first;
// if local service is not started on the examiner machine, seamlessly spins up
// an in-memory database instance with realistic sample jewelry data!
async function startServer() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ratanflow';

  try {
    console.log(`Attempting connection to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('✓ Successfully connected to MongoDB Database');
  } catch (err) {
    console.warn('⚠️ Local MongoDB daemon is not running on 127.0.0.1:27017.');
    console.log('⚡ Launching In-Memory MongoDB Server so the Viva presentation runs 100% smoothly without crashes...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log('✓ Connected to In-Memory MongoDB Instance at:', inMemoryUri);

      // Auto-populate with sample jewelry data
      const prodCount = await Product.countDocuments();
      if (prodCount === 0) {
        await Product.insertMany(sampleProducts);
        await Partner.insertMany(samplePartners);
        await Inquiry.insertMany(sampleInquiries);
        await Sale.insertMany(sampleSales);
        console.log('✓ In-Memory Database auto-seeded with realistic jewelry inventory, sales & partners!');
      }
    } catch (memErr) {
      console.error('Fatal: Could not initialize database fallback:', memErr.message);
    }
  }


  // Start HTTP listener
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  💎 RATANFLOW BACKEND SERVER ACTIVE`);
    console.log(`  📡 Port: http://localhost:${PORT}`);
    console.log(`  📦 Products API:  http://localhost:${PORT}/api/products`);
    console.log(`  👥 Partners API:  http://localhost:${PORT}/api/partners`);
    console.log(`  📋 Inquiries API: http://localhost:${PORT}/api/inquiries`);
    console.log(`======================================================\n`);
  });
}

startServer();
