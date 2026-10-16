import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PublicHome from './pages/PublicHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EditProductModal from './components/Modals/EditProductModal';
import AddProductModal from './components/Modals/AddProductModal';
import { dataService, enrichProduct } from './services/dataService';
import { Loader2 } from 'lucide-react';

// Viva Note: Central State Hub & Role Gateway.
// Defaults to Public User View for all visitors.
// Enforces hardcoded credential check for Admin suite access with session persistence.
export default function App() {
  // Access control state: 'public' (default) | 'login' | 'admin'
  const [currentView, setCurrentView] = useState('public');
  const [adminUser, setAdminUser] = useState(null);

  // Admin sub-module tab
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Core Data States
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 8,
    totalInventoryValue: 4572500,
    lowStockCount: 3,
    highDemandCount: 3
  });

  const [salesMetrics, setSalesMetrics] = useState({
    totalSales: 428350,
    totalOrders: 56,
    totalCustomers: 124,
    avgOrderValue: 7649
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [categoryShare, setCategoryShare] = useState([]);
  const [salesList, setSalesList] = useState([]);

  const [partners, setPartners] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Check persisted admin session on initial load
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('ratanflow_admin_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.user) {
          setAdminUser(parsed);
          const savedView = sessionStorage.getItem('ratanflow_view');
          if (savedView === 'admin') {
            setCurrentView('admin');
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse persisted auth session');
    }
  }, []);

  // Fetch all showroom data via hybrid dataService (API with automatic persistent fallback)
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Products & Inventory KPIs
      const prodRes = await dataService.getProducts();
      if (prodRes && prodRes.data) {
        setProducts(prodRes.data);
        if (prodRes.metrics) {
          setMetrics(prodRes.metrics);
        }
      }

      // 2. Fetch Partners & Floor Availability
      const partRes = await dataService.getPartners();
      if (partRes && partRes.data) {
        setPartners(partRes.data);
      }

      // 3. Fetch VIP Inquiries
      const inqRes = await dataService.getInquiries();
      if (inqRes && inqRes.data) {
        setInquiries(inqRes.data);
      }

      // 4. Fetch Sales Metrics & Ledger
      const salesRes = await dataService.getSales();
      if (salesRes) {
        if (salesRes.metrics) setSalesMetrics(salesRes.metrics);
        if (salesRes.salesTrend) setSalesTrend(salesRes.salesTrend);
        if (salesRes.categoryShare) setCategoryShare(salesRes.categoryShare);
        if (salesRes.data) setSalesList(salesRes.data);
      }
    } catch (err) {
      console.error('Error hydrating showroom data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // View navigation handler
  const handleNavigate = (view) => {
    setCurrentView(view);
    sessionStorage.setItem('ratanflow_view', view);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin login success callback
  const handleLoginSuccess = (userPayload) => {
    setAdminUser(userPayload);
    handleNavigate('admin');
  };

  // Explicit Logout callback
  const handleLogout = () => {
    localStorage.removeItem('ratanflow_admin_auth');
    sessionStorage.removeItem('ratanflow_view');
    setAdminUser(null);
    handleNavigate('public');
  };

  // Optimistic update handlers
  const handleProductUpdated = (updated) => {
    const enriched = enrichProduct(updated);
    setProducts(prev => {
      const next = prev.map(p => p._id === enriched._id ? enriched : p);
      const lowStockCount = next.filter(p => p.lowStock).length;
      const highDemandCount = next.filter(p => p.demandStatus === 'High Demand').length;
      const totalInventoryValue = next.reduce((s, p) => s + (p.price * p.stockCount), 0);
      setMetrics({
        totalProducts: next.length,
        totalInventoryValue,
        lowStockCount,
        highDemandCount
      });
      return next;
    });
  };

  const handleProductCreated = (created) => {
    const enriched = enrichProduct(created);
    setProducts(prev => {
      const next = [enriched, ...prev.filter(p => p._id !== enriched._id)];
      const lowStockCount = next.filter(p => p.lowStock).length;
      const highDemandCount = next.filter(p => p.demandStatus === 'High Demand').length;
      const totalInventoryValue = next.reduce((s, p) => s + (p.price * p.stockCount), 0);
      setMetrics({
        totalProducts: next.length,
        totalInventoryValue,
        lowStockCount,
        highDemandCount
      });
      return next;
    });
  };

  const handleProductDeleted = (deletedId) => {
    setProducts(prev => {
      const next = prev.filter(p => p._id !== deletedId);
      const lowStockCount = next.filter(p => p.lowStock).length;
      const highDemandCount = next.filter(p => p.demandStatus === 'High Demand').length;
      const totalInventoryValue = next.reduce((s, p) => s + (p.price * p.stockCount), 0);
      setMetrics({
        totalProducts: next.length,
        totalInventoryValue,
        lowStockCount,
        highDemandCount
      });
      return next;
    });
  };

  const handlePartnerUpdated = (updated) => {
    setPartners(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  const handleInquiryUpdated = (updated) => {
    setInquiries(prev => prev.map(i => i._id === updated._id ? updated : i));
  };

  const handleInquiryCreated = (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const handleInquiryDeleted = (deletedId) => {
    setInquiries(prev => prev.filter(i => i._id !== deletedId));
  };

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-charcoal-950 font-sans text-slate-100 flex flex-col selection:bg-gold-500 selection:text-charcoal-950 overflow-x-hidden w-full">
      {/* 1. UNIVERSAL NAVBAR */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        adminUser={adminUser}
        onLogout={handleLogout}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
      />

      {/* 2. MAIN ROUTING VIEW */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-gold-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Synchronizing RatanFlow Atelier Records...
          </p>
        </div>
      ) : (
        <>
          {/* VIEW 1: PUBLIC CUSTOMER PORTAL (DEFAULT) */}
          {currentView === 'public' && (
            <PublicHome
              products={products}
              partners={partners}
              onNavigateToLogin={() => handleNavigate('login')}
              onInquiryCreated={handleInquiryCreated}
            />
          )}

          {/* VIEW 2: ADMIN LOGIN BARRIER */}
          {currentView === 'login' && (
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onBackToPublic={() => handleNavigate('public')}
            />
          )}

          {/* VIEW 3: ADMIN MANAGEMENT SUITE */}
          {currentView === 'admin' && (
            <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
              {/* Responsive Sidebar (off-canvas drawer on mobile/tablet <1024px) */}
              <Sidebar
                activeTab={activeAdminTab}
                setActiveTab={setActiveAdminTab}
                pendingInquiriesCount={pendingInquiriesCount}
                lowStockCount={metrics.lowStockCount}
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
              />

              {/* Admin Main Viewport */}
              <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
                <AdminDashboard
                  activeTab={activeAdminTab}
                  salesMetrics={salesMetrics}
                  salesTrend={salesTrend}
                  categoryShare={categoryShare}
                  salesList={salesList}
                  products={products}
                  partners={partners}
                  inquiries={inquiries}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onOpenEditModal={(prod) => {
                    setSelectedProduct(prod);
                    setIsEditModalOpen(true);
                  }}
                  onProductUpdated={handleProductUpdated}
                  onProductDeleted={handleProductDeleted}
                  onPartnerUpdated={handlePartnerUpdated}
                  onInquiryUpdated={handleInquiryUpdated}
                  onInquiryDeleted={handleInquiryDeleted}
                />
              </main>
            </div>
          )}
        </>
      )}

      {/* 3. MODALS */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductSaved={handleProductUpdated}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
}
