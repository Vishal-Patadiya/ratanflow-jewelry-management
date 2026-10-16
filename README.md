# 💎 RatanFlow — Fine Jewelry Retail & Vault ERP
> **Final-Year (Semester 4) MERN Stack Project**  
> Developed as a production-ready, mobile-first fine jewelry showroom management system with role-based access control, real-time counter presence, and stock threshold alerts.

---

## 🌟 Access Control & Role Specifications

### 1. Public User View (Default Landing Page)
- When any visitor opens the application URL, they land directly on the **Customer Portal** as a guest.
- **Public Features**:
  * **Curated Vault Collections**: Browse Gold 22K, Platinum 950, Rose Gold, and Silver 925 pieces with search and metal filter pills.
  * **Live "Today at Counter" Banner**: Displays co-owners on duty today with shift hours (10:00 AM - 08:00 PM) and BIS 916 hallmarking assurance.
  * **VIP Visit & Private Lounge Booking**: Submit private consultation requests directly into the MongoDB inquiries queue.
  * **Admin Access Link**: Located in the top navigation bar.

---

### 2. Admin Access Barrier (Management Suite)
- **Login Interface**: Split-screen luxury barrier.
- **Evaluation Admin Credentials**:
  * **User ID / Email**: `deep soni`
  * **Password**: `SONIHERE@1234`
- **Validation**:
  * If credentials match ➔ Switches to the **Admin Management Suite** (`/admin/dashboard`) and persists session in `localStorage`.
  * If credentials fail ➔ Displays inline error: `"Invalid ID or Password"`.
  * **1-Click Auto-Fill**: Includes a quick-fill button for evaluators.
  * **Explicit Logout**: Clicking logout clears stored credentials and resets view back to the Public User Portal.

---

## 📱 Responsiveness & Mobile-First Architecture

- **Off-Canvas Drawer Navigation**: On screens `< 1024px` (tablets and mobile phones), the admin sidebar automatically collapses into an animated off-canvas drawer triggered by the hamburger icon.
- **Auto-Wrapping KPI Cards**: Responsive CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) adapts cleanly to any viewport width.
- **Horizontal Scroll Protection**: All inventory ledgers and sales tables are enclosed in `overflow-x-auto` wrappers so columns stay horizontally scrollable on mobile touchscreens without breaking layout.
- **Responsive Visual Analytics**: All Recharts graphs are wrapped inside `<ResponsiveContainer width="100%" height="100%">`.

---

## 💎 The 4 Core Semester Features

### 1. Smart Inventory & Stock Threshold Manager (Reorder Radar)
- **Pre-Seeded Catalog**: Pre-populated with master jewelry pieces (Gold Kundan Polki Chokers, Solitaire Engagement Rings, Temple Lakshmi Bangles, Silver Payals, Platinum Bands).
- **Threshold Alerting**: If `stockCount <= minThreshold`, the item receives a pulsating red **`Critical Low / Reorder`** alert flag.
- **Live Modal Editor**: Evaluators can open the **Edit Stock** modal or click quick `+` / `−` buttons to modify stock live and observe immediate threshold badge updates.

### 2. Rule-Based Demand Heuristic & Sales Reports
- **Executive Sales KPIs**: Total Sales (**₹ 4,28,350**), Showroom Orders (**56**), Registered Clients (**124**), and Avg. Order Value (**₹ 7,649**).
- **Visual Analytics**: Hourly billing progression (Area Chart) and Department share (Donut Chart).
- **Velocity Heuristic Rule**:
  $$\text{Combined Interest} = \text{Recent Orders} + \text{Inquiries}$$
  * If $\text{Combined Interest} \ge 5$ ➔ **High Demand** *(Amber flame badge)*
  * If $\text{Stock Count} > 8 \text{ and } \text{Recent Orders} = 0$ ➔ **Slow Moving** *(Gray badge)*
  * Otherwise ➔ **Normal**

### 3. Co-Owner Attendance & Presence Bar
- **4 Showroom Partners**: Ratan Verma (Master Valuer), Aarav Patel (Diamond Gemologist), Devika Shah (Bridal Consultant), and Kavita Soni (Hallmarking Head).
- **Admin Control**: Live toggle switches to check partners in/out.
- **Public Synchronization**: Public top banner dynamically reflects only active co-owners on duty.

### 4. VIP Appointment & Customer Inquiry Dispatcher
- **Public Ingestion**: Customers submit viewing appointments from the home page.
- **Admin Workflow**: Showroom managers view appointment submissions and advance status through the lifecycle:
  $$\mathbf{Pending} \longrightarrow \mathbf{Stock\ Prepared} \longrightarrow \mathbf{Completed}$$

---

## 🏗️ Repository Structure

```text
ratanflow/
├── backend/
│   ├── models/
│   │   ├── Product.js          # Inventory schema with lowStock and demandStatus virtuals
│   │   ├── Partner.js          # Co-Owner attendance schema with shift timings
│   │   ├── Inquiry.js          # VIP appointment schema with workflow statuses
│   │   └── Sale.js             # Showroom transaction & sales ledger schema
│   ├── routes/
│   │   ├── productRoutes.js    # Inventory CRUD & live stock PATCH
│   │   ├── partnerRoutes.js    # Floor presence roster & toggle
│   │   ├── inquiryRoutes.js    # VIP customer booking & status workflow
│   │   └── saleRoutes.js       # Sales ledger & KPI computations (₹ 4,28,350)
│   ├── seedData.js             # Realistic sample jewelry data matching presentations
│   ├── server.js               # Express app, CORS, routes & auto-fallback database
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Public navbar with "Admin Login" & mobile hamburger
│   │   │   ├── Sidebar.jsx         # Responsive admin sidebar with off-canvas drawer
│   │   │   ├── PartnerBanner.jsx   # Live presence display banner
│   │   │   ├── InventoryTable.jsx  # Editable stock threshold manager (Reorder Radar)
│   │   │   ├── SalesCharts.jsx     # Responsive Recharts sales trend & category share
│   │   │   └── Modals/
│   │   │       ├── EditProductModal.jsx
│   │   │       └── AddProductModal.jsx
│   │   ├── pages/
│   │   │   ├── PublicHome.jsx      # Customer portal (default view)
│   │   │   ├── AdminLogin.jsx      # Split-screen luxury login interface
│   │   │   └── AdminDashboard.jsx  # Management suite with sales reports
│   │   ├── App.jsx                 # Role gateway & state hub
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Luxury charcoal & warm gold retail tokens
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Running Locally

### Step 1: Backend
```bash
cd backend
npm install
npm start
```
> Running on `http://localhost:5000` (includes automatic in-memory MongoDB fallback with pre-seeded data).

### Step 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
> Running on `http://127.0.0.1:5173`

---

## 🌐 Public Deployment Guide

### Option A: Deploying Frontend to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `ratanflow` GitHub repository.
4. Set **Root Directory** to `frontend`.
5. In **Build Settings**:
   * Build Command: `npm run build`
   * Output Directory: `dist`
6. In **Environment Variables**, add:
   * `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
7. Click **Deploy**. Vercel will generate your live, publicly shareable link (e.g., `https://ratanflow.vercel.app`).

### Option B: Deploying Backend to Render / Railway
1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `node server.js`.
5. Set Environment Variables:
   * `PORT`: `5000`
   * `MONGO_URI`: Your MongoDB Atlas URI (or leave blank to use the built-in in-memory fallback).

---

## 💻 Exact Git Terminal Commands

```bash
# 1. Stage all new components, models, and routes
git add .

# 2. Commit the updates
git commit -m "feat: complete RatanFlow with public customer portal, admin access barrier, and responsive drawer"

# 3. Rename default branch to main
git branch -M main

# 4. Link to your remote GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ratanflow-jewelry-management.git

# 5. Push code to GitHub
git push -u origin main
```

---

## 👥 Evaluation Team
- Semester 4 Final Year Project
- Candidate: **Deep Soni**
- Evaluator Credentials: `deep soni` / `SONIHERE@1234`
