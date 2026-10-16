import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PublicHome from './pages/PublicHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EditProductModal from './components/Modals/EditProductModal';
import AddProductModal from './components/Modals/AddProductModal';
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
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    highDemandCount: 0
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
          // If the user refreshed while in admin, retain admin view; otherwise default is public
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

  // Fetch all showroom data
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Products & Inventory KPIs
      const prodRes = await axios.get('/api/products');
      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
        setMetrics(prodRes.data.metrics);
      }

      // 2. Fetch Partners & Floor Availability
      const partRes = await axios.get('/api/partners');
      if (partRes.data.success) {
        setPartners(partRes.data.data);
      }

      // 3. Fetch VIP Inquiries
      const inqRes = await axios.get('/api/inquiries');
      if (inqRes.data.success) {
        setInquiries(inqRes.data.data);
      }

      // 4. Fetch Sales Metrics & Ledger
      const salesRes = await axios.get('/api/sales');
      if (salesRes.data.success) {
        setSalesMetrics(salesRes.data.metrics);
        setSalesTrend(salesRes.data.salesTrend || []);
        setCategoryShare(salesRes.data.categoryShare || []);
        setSalesList(salesRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching data from RatanFlow API:', err);
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
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    setProducts(all => {
      const lowStockCount = all.filter(p => p.lowStock).length;
      setMetrics(m => ({ ...m, lowStockCount }));
      return all;
    });
  };

  const handleProductCreated = (created) => {
    setProducts(prev => [created, ...prev]);
    fetchData();
  };

  const handleProductDeleted = (deletedId) => {
    setProducts(prev => prev.filter(p => p._id !== deletedId));
  };

  const handlePartnerUpdated = (updated) => {
    setPartners(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  const handleInquiryUpdated = (updated) => {
    setInquiries(prev => prev.map(i => i._id === updated._id ? updated : i));
  };

  const handleInquiryDeleted = (deletedId) => {
    setInquiries(prev => prev.filter(i => i._id !== deletedId));
  };

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-charcoal-950 font-sans text-slate-100 flex flex-col selection:bg-gold-500 selection:text-charcoal-950">
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
            <div className="flex-1 flex max-w-7xl w-full mx-auto">
              {/* Responsive Sidebar (off-canvas on mobile/tablet <1024px) */}
              <Sidebar
                activeTab={activeAdminTab}
                setActiveTab={setActiveAdminTab}
                pendingInquiriesCount={pendingInquiriesCount}
                lowStockCount={metrics.lowStockCount}
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
              />

              {/* Admin Main Viewport */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
