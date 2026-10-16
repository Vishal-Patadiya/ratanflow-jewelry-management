require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Partner = require('./models/Partner');
const Inquiry = require('./models/Inquiry');
const Sale = require('./models/Sale');


const sampleProducts = [
  {
    name: 'Royal Heritage Kundan Polki Choker',
    sku: 'RF-NCK-101',
    category: 'Bridal Sets',
    metalType: 'Gold 22K',
    weightGrams: 48.5,
    price: 365000,
    stockCount: 2,
    minThreshold: 3, // Low stock: 2 <= 3 -> TRUE
    recentSalesCount: 4,
    inquiryCount: 3 // Combined = 7 -> High Demand
  },
  {
    name: 'Eternal Solitaire Diamond Ring (1.2ct)',
    sku: 'RF-RNG-202',
    category: 'Rings',
    metalType: 'Platinum 950',
    weightGrams: 5.8,
    price: 185000,
    stockCount: 4,
    minThreshold: 2,
    recentSalesCount: 3,
    inquiryCount: 4 // Combined = 7 -> High Demand
  },
  {
    name: 'Traditional Temple Lakshmi Bangle (Pair)',
    sku: 'RF-BNG-303',
    category: 'Bangles',
    metalType: 'Gold 22K',
    weightGrams: 36.2,
    price: 275000,
    stockCount: 1,
    minThreshold: 2, // Low stock: 1 <= 2 -> TRUE
    recentSalesCount: 2,
    inquiryCount: 1
  },
  {
    name: 'Classic 22K Floral Jhumka Earrings',
    sku: 'RF-EAR-404',
    category: 'Earrings',
    metalType: 'Gold 22K',
    weightGrams: 14.2,
    price: 108000,
    stockCount: 9,
    minThreshold: 3,
    recentSalesCount: 0,
    inquiryCount: 1 // stockCount > 8 and recentSales === 0 -> Slow Moving
  },
  {
    name: 'Imperial Rose Gold Tennis Bracelet',
    sku: 'RF-BNG-505',
    category: 'Bangles',
    metalType: 'Rose Gold',
    weightGrams: 18.0,
    price: 142000,
    stockCount: 5,
    minThreshold: 2,
    recentSalesCount: 2,
    inquiryCount: 2 // Normal
  },
  {
    name: 'Antique Oxidized Silver Payal / Anklet',
    sku: 'RF-CHN-606',
    category: 'Chains',
    metalType: 'Silver 925',
    weightGrams: 85.0,
    price: 18500,
    stockCount: 12,
    minThreshold: 4,
    recentSalesCount: 5,
    inquiryCount: 2 // High Demand
  },
  {
    name: 'Modern Geometric Platinum Band',
    sku: 'RF-RNG-707',
    category: 'Rings',
    metalType: 'Platinum 950',
    weightGrams: 6.4,
    price: 64000,
    stockCount: 10,
    minThreshold: 3,
    recentSalesCount: 0,
    inquiryCount: 0 // Slow Moving
  },
  {
    name: 'Navratna Gemstone Pendant Necklace',
    sku: 'RF-PDT-808',
    category: 'Pendants',
    metalType: 'Gold 18K',
    weightGrams: 12.5,
    price: 94500,
    stockCount: 3,
    minThreshold: 3, // Low stock: 3 <= 3 -> TRUE
    recentSalesCount: 1,
    inquiryCount: 2
  }
];

const samplePartners = [
  {
    name: 'Ratan Verma',
    role: 'Founder & Master Valuer',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 08:00 PM',
    counterNumber: 1,
    contactPhone: '+91 98201 11223'
  },
  {
    name: 'Aarav Patel',
    role: 'Senior Gemologist (Diamonds)',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 07:30 PM',
    counterNumber: 2,
    contactPhone: '+91 98202 22334'
  },
  {
    name: 'Devika Shah',
    role: 'Bridal Couture Consultant',
    isAvailableToday: false,
    shiftHours: '11:00 AM - 08:30 PM',
    counterNumber: 3,
    contactPhone: '+91 98203 33445'
  },
  {
    name: 'Kavita Soni',
    role: 'Billing & Hallmarking Head',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 08:00 PM',
    counterNumber: 4,
    contactPhone: '+91 98204 44556'
  }
];

const sampleInquiries = [
  {
    customerName: 'Mrs. Ananya Singhania',
    phone: '+91 98920 44112',
    interestCategory: 'Bridal Diamond Choker Set',
    budgetRange: '₹ 5,00,000 - ₹ 8,00,000',
    visitTime: 'Today at 4:30 PM',
    notes: 'Requested GIA certified stones with rose-cut accents for wedding reception.',
    status: 'Pending',
    assignedPartner: 'Devika Shah'
  },
  {
    customerName: 'Mr. Rajesh Mehta',
    phone: '+91 98211 99881',
    interestCategory: '22K Solid Gold Men’s Chain & Kada',
    budgetRange: '₹ 3,50,000 - ₹ 4,50,000',
    visitTime: 'Today at 6:00 PM',
    notes: 'Checking hallmark certification and weight discrepancy in person.',
    status: 'Stock Prepared',
    assignedPartner: 'Ratan Verma'
  },
  {
    customerName: 'Dr. Priya Kulkarni',
    phone: '+91 97690 12389',
    interestCategory: '1.5ct Solitaire Ring (VVS1 / E Color)',
    budgetRange: '₹ 2,00,000 - ₹ 3,00,000',
    visitTime: 'Tomorrow at 11:30 AM',
    notes: 'Engagement ceremony next week. Needs fast sizing to Ring Size 12.',
    status: 'Pending',
    assignedPartner: 'Aarav Patel'
  },
  {
    customerName: 'Vikramaditya Rathore',
    phone: '+91 98110 55443',
    interestCategory: 'Antique Royal Polki Necklace',
    budgetRange: '₹ 4,00,000 - ₹ 6,00,000',
    visitTime: 'Yesterday at 3:00 PM',
    notes: 'Purchased and billed under invoice #RF-2026-441. Advised locker vault delivery.',
    status: 'Completed',
    assignedPartner: 'Ratan Verma'
  }
];

const sampleSales = [
  {
    invoiceNumber: 'RF-INV-2026-001',
    customerName: 'Mrs. S. Singhania',
    itemName: 'Royal Heritage Kundan Polki Choker',
    category: 'Bridal Sets',
    metalType: 'Gold 22K',
    amount: 185000,
    paymentMode: 'NEFT / RTGS',
    billedBy: 'Ratan Verma',
    saleDate: new Date(Date.now() - 3600000 * 2)
  },
  {
    invoiceNumber: 'RF-INV-2026-002',
    customerName: 'Rajesh Agarwal',
    itemName: 'Eternal Solitaire Diamond Ring',
    category: 'Rings',
    metalType: 'Platinum 950',
    amount: 98000,
    paymentMode: 'HDFC Card',
    billedBy: 'Aarav Patel',
    saleDate: new Date(Date.now() - 3600000 * 4)
  },
  {
    invoiceNumber: 'RF-INV-2026-003',
    customerName: 'Kavita Joshi',
    itemName: 'Traditional Temple Lakshmi Bangle',
    category: 'Bangles',
    metalType: 'Gold 22K',
    amount: 72500,
    paymentMode: 'UPI',
    billedBy: 'Kavita Soni',
    saleDate: new Date(Date.now() - 3600000 * 5)
  },
  {
    invoiceNumber: 'RF-INV-2026-004',
    customerName: 'Vikram Rajput',
    itemName: 'Antique Oxidized Silver Payal',
    category: 'Chains',
    metalType: 'Silver 925',
    amount: 36850,
    paymentMode: 'Cash',
    billedBy: 'Ratan Verma',
    saleDate: new Date(Date.now() - 3600000 * 7)
  },
  {
    invoiceNumber: 'RF-INV-2026-005',
    customerName: 'Pooja Sharma',
    itemName: 'Classic 22K Floral Jhumka Earrings',
    category: 'Earrings',
    metalType: 'Gold 22K',
    amount: 36000,
    paymentMode: 'UPI',
    billedBy: 'Devika Shah',
    saleDate: new Date(Date.now() - 3600000 * 8)
  }
];

async function seedDatabase() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ratanflow';
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clean existing records
    await Product.deleteMany({});
    await Partner.deleteMany({});
    await Inquiry.deleteMany({});
    await Sale.deleteMany({});
    console.log('✓ Cleared old collections');

    // Insert sample records
    const insertedProducts = await Product.insertMany(sampleProducts);
    const insertedPartners = await Partner.insertMany(samplePartners);
    const insertedInquiries = await Inquiry.insertMany(sampleInquiries);
    const insertedSales = await Sale.insertMany(sampleSales);

    console.log(`✓ Inserted ${insertedProducts.length} jewelry products`);
    console.log(`✓ Inserted ${insertedPartners.length} co-owner partners`);
    console.log(`✓ Inserted ${insertedInquiries.length} VIP customer inquiries`);
    console.log(`✓ Inserted ${insertedSales.length} sample sales transactions`);

    console.log('\n--- RATANFLOW SEED COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

// Allow direct execution
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, samplePartners, sampleInquiries, sampleSales };

