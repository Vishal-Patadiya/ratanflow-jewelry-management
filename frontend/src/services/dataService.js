import axios from 'axios';

// Initial seed data fallback for standalone Vercel deployment or offline demo
const initialProducts = [
  {
    _id: 'prod-001',
    name: 'Royal Heritage Kundan Polki Choker',
    sku: 'RF-NCK-101',
    category: 'Bridal Sets',
    metalType: 'Gold 22K',
    weightGrams: 48.5,
    price: 365000,
    stockCount: 2,
    minThreshold: 3,
    recentSalesCount: 4,
    inquiryCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-002',
    name: 'Eternal Solitaire Diamond Ring (1.2ct)',
    sku: 'RF-RNG-202',
    category: 'Rings',
    metalType: 'Platinum 950',
    weightGrams: 5.8,
    price: 185000,
    stockCount: 4,
    minThreshold: 2,
    recentSalesCount: 3,
    inquiryCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-003',
    name: 'Traditional Temple Lakshmi Bangle (Pair)',
    sku: 'RF-BNG-303',
    category: 'Bangles',
    metalType: 'Gold 22K',
    weightGrams: 36.2,
    price: 275000,
    stockCount: 1,
    minThreshold: 2,
    recentSalesCount: 2,
    inquiryCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-004',
    name: 'Classic 22K Floral Jhumka Earrings',
    sku: 'RF-EAR-404',
    category: 'Earrings',
    metalType: 'Gold 22K',
    weightGrams: 14.2,
    price: 108000,
    stockCount: 9,
    minThreshold: 3,
    recentSalesCount: 0,
    inquiryCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-005',
    name: 'Imperial Rose Gold Tennis Bracelet',
    sku: 'RF-BNG-505',
    category: 'Bangles',
    metalType: 'Rose Gold',
    weightGrams: 18.0,
    price: 142000,
    stockCount: 5,
    minThreshold: 2,
    recentSalesCount: 2,
    inquiryCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-006',
    name: 'Antique Oxidized Silver Payal / Anklet',
    sku: 'RF-CHN-606',
    category: 'Chains',
    metalType: 'Silver 925',
    weightGrams: 85.0,
    price: 18500,
    stockCount: 12,
    minThreshold: 4,
    recentSalesCount: 5,
    inquiryCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-007',
    name: 'Modern Geometric Platinum Band',
    sku: 'RF-RNG-707',
    category: 'Rings',
    metalType: 'Platinum 950',
    weightGrams: 6.4,
    price: 64000,
    stockCount: 10,
    minThreshold: 3,
    recentSalesCount: 0,
    inquiryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod-008',
    name: 'Navratna Gemstone Pendant Necklace',
    sku: 'RF-PDT-808',
    category: 'Pendants',
    metalType: 'Gold 18K',
    weightGrams: 12.5,
    price: 94500,
    stockCount: 3,
    minThreshold: 3,
    recentSalesCount: 1,
    inquiryCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialPartners = [
  {
    _id: 'part-001',
    name: 'Ratan Verma',
    role: 'Founder & Master Valuer',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 08:00 PM',
    counterNumber: 1,
    contactPhone: '+91 98201 11223'
  },
  {
    _id: 'part-002',
    name: 'Aarav Patel',
    role: 'Senior Gemologist (Diamonds)',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 07:30 PM',
    counterNumber: 2,
    contactPhone: '+91 98202 22334'
  },
  {
    _id: 'part-003',
    name: 'Devika Shah',
    role: 'Bridal Couture Consultant',
    isAvailableToday: false,
    shiftHours: '11:00 AM - 08:30 PM',
    counterNumber: 3,
    contactPhone: '+91 98203 33445'
  },
  {
    _id: 'part-004',
    name: 'Kavita Soni',
    role: 'Billing & Hallmarking Head',
    isAvailableToday: true,
    shiftHours: '10:00 AM - 08:00 PM',
    counterNumber: 4,
    contactPhone: '+91 98204 44556'
  }
];

const initialInquiries = [
  {
    _id: 'inq-001',
    customerName: 'Mrs. Ananya Singhania',
    phone: '+91 98920 44112',
    interestCategory: 'Bridal Diamond Choker Set',
    budgetRange: '₹ 5,00,000 - ₹ 8,00,000',
    visitTime: 'Today at 4:30 PM',
    notes: 'Requested GIA certified stones with rose-cut accents.',
    status: 'Pending',
    assignedPartner: 'Devika Shah',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'inq-002',
    customerName: 'Mr. Rajesh Mehta',
    phone: '+91 98211 99881',
    interestCategory: '22K Solid Gold Men’s Chain & Kada',
    budgetRange: '₹ 3,50,000 - ₹ 4,50,000',
    visitTime: 'Today at 6:00 PM',
    notes: 'Checking hallmark certification and weight discrepancy in person.',
    status: 'Stock Prepared',
    assignedPartner: 'Ratan Verma',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'inq-003',
    customerName: 'Dr. Priya Kulkarni',
    phone: '+91 97690 12389',
    interestCategory: '1.5ct Solitaire Ring (VVS1 / E Color)',
    budgetRange: '₹ 2,00,000 - ₹ 3,00,000',
    visitTime: 'Tomorrow at 11:30 AM',
    notes: 'Engagement ceremony next week. Needs fast sizing to Ring Size 12.',
    status: 'Pending',
    assignedPartner: 'Aarav Patel',
    createdAt: new Date().toISOString()
  }
];

const initialSales = [
  {
    _id: 'sale-001',
    invoiceNumber: 'RF-INV-2026-001',
    customerName: 'Mrs. S. Singhania',
    itemName: 'Royal Heritage Kundan Polki Choker',
    category: 'Bridal Sets',
    metalType: 'Gold 22K',
    amount: 185000,
    paymentMode: 'NEFT / RTGS',
    billedBy: 'Ratan Verma'
  },
  {
    _id: 'sale-002',
    invoiceNumber: 'RF-INV-2026-002',
    customerName: 'Rajesh Agarwal',
    itemName: 'Eternal Solitaire Diamond Ring',
    category: 'Rings',
    metalType: 'Platinum 950',
    amount: 98000,
    paymentMode: 'HDFC Card',
    billedBy: 'Aarav Patel'
  },
  {
    _id: 'sale-003',
    invoiceNumber: 'RF-INV-2026-003',
    customerName: 'Kavita Joshi',
    itemName: 'Traditional Temple Lakshmi Bangle',
    category: 'Bangles',
    metalType: 'Gold 22K',
    amount: 72500,
    paymentMode: 'UPI',
    billedBy: 'Kavita Soni'
  },
  {
    _id: 'sale-004',
    invoiceNumber: 'RF-INV-2026-004',
    customerName: 'Vikram Rajput',
    itemName: 'Antique Oxidized Silver Payal',
    category: 'Chains',
    metalType: 'Silver 925',
    amount: 36850,
    paymentMode: 'Cash',
    billedBy: 'Ratan Verma'
  },
  {
    _id: 'sale-005',
    invoiceNumber: 'RF-INV-2026-005',
    customerName: 'Pooja Sharma',
    itemName: 'Classic 22K Floral Jhumka Earrings',
    category: 'Earrings',
    metalType: 'Gold 22K',
    amount: 36000,
    paymentMode: 'UPI',
    billedBy: 'Devika Shah'
  }
];

// Helper to compute virtual properties for any product item
export function enrichProduct(item) {
  const stockCount = Number(item.stockCount || 0);
  const minThreshold = Number(item.minThreshold || 3);
  const recentSalesCount = Number(item.recentSalesCount || 0);
  const inquiryCount = Number(item.inquiryCount || 0);

  // 1. Low stock alert flag
  const lowStock = stockCount <= minThreshold;

  // 2. Demand Status Velocity Heuristic
  let demandStatus = 'Normal';
  if (recentSalesCount + inquiryCount >= 5) {
    demandStatus = 'High Demand';
  } else if (stockCount > 8 && recentSalesCount === 0) {
    demandStatus = 'Slow Moving';
  }

  return {
    ...item,
    stockCount,
    minThreshold,
    recentSalesCount,
    inquiryCount,
    lowStock,
    demandStatus
  };
}

// Local Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'ratanflow_products_v2',
  PARTNERS: 'ratanflow_partners_v2',
  INQUIRIES: 'ratanflow_inquiries_v2',
  SALES: 'ratanflow_sales_v2'
};

function getLocal(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
  }
  return defaultVal;
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

// ====================================================
// HYBRID DATA SERVICE: Tries API, smoothly falls back to LocalStorage
// ====================================================

export const dataService = {
  // PRODUCTS
  async getProducts() {
    try {
      const res = await axios.get('/api/products', { timeout: 2500 });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const enriched = res.data.data.map(enrichProduct);
        setLocal(STORAGE_KEYS.PRODUCTS, enriched);
        return { success: true, data: enriched, metrics: res.data.metrics };
      }
    } catch (err) {
      // API unavailable or running on standalone Vercel
    }

    // Fallback to local storage or initial seed
    const raw = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
    const enriched = raw.map(enrichProduct);
    const totalInventoryValue = enriched.reduce((s, p) => s + (p.price * p.stockCount), 0);
    const lowStockCount = enriched.filter(p => p.lowStock).length;
    const highDemandCount = enriched.filter(p => p.demandStatus === 'High Demand').length;

    return {
      success: true,
      data: enriched,
      metrics: {
        totalProducts: enriched.length,
        totalInventoryValue,
        lowStockCount,
        highDemandCount
      }
    };
  },

  async addProduct(productData) {
    try {
      const res = await axios.post('/api/products', productData, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const enriched = enrichProduct(res.data.data);
        const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
        setLocal(STORAGE_KEYS.PRODUCTS, [enriched, ...current]);
        return { success: true, data: enriched };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
    const newProduct = enrichProduct({
      _id: `prod-${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const updated = [newProduct, ...current];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return { success: true, data: newProduct };
  },

  async updateProduct(id, productData) {
    try {
      const res = await axios.put(`/api/products/${id}`, productData, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const enriched = enrichProduct(res.data.data);
        const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
        setLocal(STORAGE_KEYS.PRODUCTS, current.map(p => p._id === id ? enriched : p));
        return { success: true, data: enriched };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
    const target = current.find(p => p._id === id);
    const updatedProduct = enrichProduct({
      ...(target || {}),
      ...productData,
      _id: id,
      updatedAt: new Date().toISOString()
    });

    const updated = current.map(p => p._id === id ? updatedProduct : p);
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return { success: true, data: updatedProduct };
  },

  async updateStock(id, { delta, stockCount }) {
    try {
      const res = await axios.patch(`/api/products/${id}/stock`, { delta, stockCount }, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const enriched = enrichProduct(res.data.data);
        const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
        setLocal(STORAGE_KEYS.PRODUCTS, current.map(p => p._id === id ? enriched : p));
        return { success: true, data: enriched };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
    const target = current.find(p => p._id === id);
    if (!target) return { success: false, message: 'Item not found' };

    let newStock = target.stockCount;
    if (typeof stockCount === 'number') {
      newStock = Math.max(0, stockCount);
    } else if (typeof delta === 'number') {
      newStock = Math.max(0, target.stockCount + delta);
    }

    const updatedProduct = enrichProduct({
      ...target,
      stockCount: newStock,
      updatedAt: new Date().toISOString()
    });

    const updated = current.map(p => p._id === id ? updatedProduct : p);
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return { success: true, data: updatedProduct };
  },

  async deleteProduct(id) {
    try {
      await axios.delete(`/api/products/${id}`, { timeout: 2500 });
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.PRODUCTS, initialProducts);
    const updated = current.filter(p => p._id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return { success: true };
  },

  // INQUIRIES (VIP APPOINTMENTS)
  async getInquiries() {
    try {
      const res = await axios.get('/api/inquiries', { timeout: 2500 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setLocal(STORAGE_KEYS.INQUIRIES, res.data.data);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      // Fallback
    }

    const localInq = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
    return { success: true, data: localInq };
  },

  async createInquiry(inquiryData) {
    try {
      const res = await axios.post('/api/inquiries', inquiryData, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const current = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
        setLocal(STORAGE_KEYS.INQUIRIES, [res.data.data, ...current]);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
    const newInquiry = {
      _id: `inq-${Date.now()}`,
      status: 'Pending',
      budgetRange: '₹ 2,00,000 - ₹ 5,00,000',
      assignedPartner: 'General Floor',
      ...inquiryData,
      createdAt: new Date().toISOString()
    };

    const updated = [newInquiry, ...current];
    setLocal(STORAGE_KEYS.INQUIRIES, updated);
    return { success: true, data: newInquiry };
  },

  async updateInquiryStatus(id, newStatus) {
    try {
      const res = await axios.patch(`/api/inquiries/${id}/status`, { status: newStatus }, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const current = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
        setLocal(STORAGE_KEYS.INQUIRIES, current.map(i => i._id === id ? res.data.data : i));
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
    const updated = current.map(i => i._id === id ? { ...i, status: newStatus } : i);
    setLocal(STORAGE_KEYS.INQUIRIES, updated);
    const found = updated.find(i => i._id === id);
    return { success: true, data: found };
  },

  async deleteInquiry(id) {
    try {
      await axios.delete(`/api/inquiries/${id}`, { timeout: 2500 });
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.INQUIRIES, initialInquiries);
    const updated = current.filter(i => i._id !== id);
    setLocal(STORAGE_KEYS.INQUIRIES, updated);
    return { success: true };
  },

  // PARTNERS
  async getPartners() {
    try {
      const res = await axios.get('/api/partners', { timeout: 2500 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setLocal(STORAGE_KEYS.PARTNERS, res.data.data);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      // Fallback
    }

    const localPart = getLocal(STORAGE_KEYS.PARTNERS, initialPartners);
    return { success: true, data: localPart };
  },

  async togglePartner(id) {
    try {
      const res = await axios.patch(`/api/partners/${id}/toggle`, {}, { timeout: 2500 });
      if (res.data && res.data.success && res.data.data) {
        const current = getLocal(STORAGE_KEYS.PARTNERS, initialPartners);
        setLocal(STORAGE_KEYS.PARTNERS, current.map(p => p._id === id ? res.data.data : p));
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocal(STORAGE_KEYS.PARTNERS, initialPartners);
    const target = current.find(p => p._id === id);
    if (!target) return { success: false };

    const updatedPartner = { ...target, isAvailableToday: !target.isAvailableToday };
    const updated = current.map(p => p._id === id ? updatedPartner : p);
    setLocal(STORAGE_KEYS.PARTNERS, updated);
    return { success: true, data: updatedPartner };
  },

  // SALES
  async getSales() {
    try {
      const res = await axios.get('/api/sales', { timeout: 2500 });
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (err) {
      // Fallback
    }

    return {
      success: true,
      metrics: {
        totalSales: 428350,
        totalOrders: 56,
        totalCustomers: 124,
        avgOrderValue: 7649
      },
      salesTrend: [
        { hour: '10 AM', sales: 38500, orders: 4 },
        { hour: '12 PM', sales: 72400, orders: 9 },
        { hour: '02 PM', sales: 54200, orders: 7 },
        { hour: '04 PM', sales: 118000, orders: 15 },
        { hour: '06 PM', sales: 86250, orders: 12 },
        { hour: '08 PM', sales: 59000, orders: 9 }
      ],
      categoryShare: [
        { name: 'Bridal Sets', value: 185 },
        { name: 'Rings', value: 98 },
        { name: 'Bangles', value: 72 },
        { name: 'Chains', value: 37 },
        { name: 'Earrings', value: 36 }
      ],
      data: initialSales
    };
  }
};
