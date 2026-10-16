import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import InquiriesPage from './pages/InquiriesPage';
import PartnerToggle from './components/PartnerToggle';
import EditProductModal from './components/EditProductModal';
import AddProductModal from './components/AddProductModal';
import LoginPage from './pages/LoginPage';
import { Loader2 } from 'lucide-react';

// Viva Defense: "App.jsx acts as the central state hub connecting React components to Express REST APIs via Axios"
export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState({
    name: 'Ratan Verma',
    role: 'Founder & Master Valuer'
  });

  // Navigation tab state: 'dashboard' | 'inventory' | 'inquiries' | 'partners'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryInitialFilter, setInventoryInitialFilter] = useState('all');

  // Core Data States
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    highDemandCount: 0
  });
  const [partners, setPartners] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ==========================================
  // FETCH ALL DATA FROM BACKEND API
  // ==========================================
  // Viva Note: Standard React useEffect hook executing on mount to populate initial state
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch products and computed store metrics
      const prodRes = await axios.get('/api/products');
      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
        setMetrics(prodRes.data.metrics);
      }

      // Fetch partners and floor presence
      const partRes = await axios.get('/api/partners');
      if (partRes.data.success) {
        setPartners(partRes.data.data);
      }

      // Fetch VIP inquiries queue
      const inqRes = await axios.get('/api/inquiries');
      if (inqRes.data.success) {
        setInquiries(inqRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching RatanFlow store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter available partners for Top Banner
  const availablePartners = partners.filter(p => p.isAvailableToday);

  // Pending inquiries count for sidebar badge
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending').length;

  // ==========================================
  // STATE SYNC HANDLERS (OPTIMISTIC UPDATES)
  // ==========================================
  // When a product is updated via EditStock or QuickStock
  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));

    // Recalculate metrics on the fly
    setProducts(currentProducts => {
      const all = currentProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p);
      const totalInventoryValue = all.reduce((sum, item) => sum + (item.price * item.stockCount), 0);
      const lowStockCount = all.filter(item => item.lowStock).length;
      const highDemandCount = all.filter(item => item.demandStatus === 'High Demand').length;

      setMetrics({
        totalProducts: all.length,
        totalInventoryValue,
        lowStockCount,
        highDemandCount
      });
      return all;
    });
  };

  // When a new product is added via AddProductModal
  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    fetchAllData(); // Refresh complete counts
  };

  // When a product is deleted
  const handleProductDeleted = (deletedId) => {
    setProducts(prev => prev.filter(p => p._id !== deletedId));
    fetchAllData();
  };

  // When a partner status is toggled
  const handlePartnerUpdated = (updatedPartner) => {
    setPartners(prev => prev.map(p => p._id === updatedPartner._id ? updatedPartner : p));
  };

  // When an inquiry status changes
  const handleInquiryUpdated = (updatedInquiry) => {
    setInquiries(prev => prev.map(i => i._id === updatedInquiry._id ? updatedInquiry : i));
  };

  const handleInquiryCreated = (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const handleInquiryDeleted = (deletedId) => {
    setInquiries(prev => prev.filter(i => i._id !== deletedId));
  };

  // Navigation shortcut with filter option
  const handleNavigateTab = (tab, options = {}) => {
    setActiveTab(tab);
    if (options.filter) {
      setInventoryInitialFilter(options.filter);
    }
  };

  // If logged out
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col font-sans text-slate-100">
      {/* 1. TOP NAVBAR WITH CO-OWNER AVAILABILITY BANNER */}
      <Navbar
        availablePartners={availablePartners}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        lowStockCount={metrics.lowStockCount}
      />

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setInventoryInitialFilter('all');
          }}
          pendingInquiriesCount={pendingInquiriesCount}
          lowStockCount={metrics.lowStockCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-gold-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs tracking-wider uppercase text-slate-400">
                Synchronizing RatanFlow Master Vault...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  metrics={metrics}
                  products={products}
                  partners={partners}
                  inquiries={inquiries}
                  onPartnerUpdated={handlePartnerUpdated}
                  onInquiryUpdated={handleInquiryUpdated}
                  onNavigateTab={handleNavigateTab}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryPage
                  products={products}
                  initialFilter={inventoryInitialFilter}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onOpenEditModal={(prod) => {
                    setSelectedProduct(prod);
                    setIsEditModalOpen(true);
                  }}
                  onProductUpdated={handleProductUpdated}
                  onProductDeleted={handleProductDeleted}
                />
              )}

              {activeTab === 'inquiries' && (
                <InquiriesPage
                  inquiries={inquiries}
                  partners={partners}
                  onInquiryCreated={handleInquiryCreated}
                  onInquiryUpdated={handleInquiryUpdated}
                  onInquiryDeleted={handleInquiryDeleted}
                />
              )}

              {activeTab === 'partners' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 font-serif">
                      Showroom Partners & Floor Management
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure co-owner counter assignments and check-in status.
                    </p>
                  </div>
                  <PartnerToggle
                    partners={partners}
                    onPartnerUpdated={handlePartnerUpdated}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. LIVE STOCK & PRODUCT EDIT MODAL */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductSaved={handleProductUpdated}
      />

      {/* 4. ADD NEW JEWELRY PIECE MODAL */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
}
