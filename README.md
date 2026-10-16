# 💎 RatanFlow — Fine Jewelry Store Management System
> **Final Year (Semester 4) MERN Stack Project**  
> Developed as a practical, production-ready retail and vault inventory ERP designed specifically for Indian fine jewelry showrooms.

---

## 📖 Project Overview
**RatanFlow** solves the four most critical operational bottlenecks faced by brick-and-mortar jewelry retailers:
1. **Live Vault Inventory & Threshold Alerts**: Real-time stock counting and dynamic low-stock warnings before high-ticket items run out.
2. **Demand Status Velocity Heuristic**: Automatic item tagging into *High Demand*, *Slow Moving*, or *Normal* velocity without heavy external machine learning models.
3. **Co-Owner Counter Presence Roster**: Floor check-in controls for partners and a public banner displaying available gemologists and master valuers.
4. **VIP Customer Appointment Dispatcher**: Workflow tracking for private locker viewing appointments (`Pending` ➔ `Stock Prepared` ➔ `Completed`).

---

## 🏗️ System Architecture & File Structure

```text
ratanflow/
├── backend/
│   ├── models/
│   │   ├── Product.js          # Inventory schema with lowStock and demandStatus virtuals
│   │   ├── Partner.js          # Co-Owner counter schema with shift timings & availability
│   │   └── Inquiry.js          # VIP appointment schema with status lifecycle
│   ├── routes/
│   │   ├── productRoutes.js    # CRUD, live stock PATCH, and KPI metrics calculations
│   │   ├── partnerRoutes.js    # Floor presence roster & counter availability toggle
│   │   └── inquiryRoutes.js    # VIP customer booking & status workflow progression
│   ├── seedData.js             # Presentation sample data (₹ 4,28,350 sales & realistic jewelry)
│   ├── server.js               # Express app, CORS, REST routes, and auto-fallback database
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Brand header + dynamic "Today at Counter" banner
│   │   │   ├── Sidebar.jsx         # Navigation menu & live MCX gold spot rate widget
│   │   │   ├── StatCards.jsx       # Sales KPIs (₹ 4,28,350 Sales, 56 Orders, Vault Value)
│   │   │   ├── SimpleCharts.jsx    # Recharts category distribution & velocity correlation
│   │   │   ├── PartnerToggle.jsx   # Interactive toggle switches for 4 co-owners
│   │   │   ├── EditProductModal.jsx# Live stock increment/decrement modal for teacher demo
│   │   │   └── AddProductModal.jsx # New jewelry item creation modal
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Luxury authentication page with 1-click demo profiles
│   │   │   ├── DashboardPage.jsx   # Store overview, sales stream, charts & dispatcher
│   │   │   ├── InventoryPage.jsx   # Master stock table, search, category pills & actions
│   │   │   └── InquiriesPage.jsx   # Full appointment dispatcher queue & booking form
│   │   ├── App.jsx                 # Central React state hub syncing with Express APIs
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Luxury charcoal & warm gold retail design tokens
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Step-by-Step Setup & Running Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **MongoDB**: Optional (RatanFlow includes an automatic in-memory MongoDB fallback so it runs 100% reliably during presentations even if the local MongoDB daemon is not started).

---

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# (Optional) Seed realistic sample jewelry records
npm run seed

# Start the Express server
npm start
```
> The backend will listen at: `http://localhost:5000`

---

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
> The frontend will open at: `http://localhost:5173`

---

## 🔍 The 4 Core Features & How to Demonstrate in Viva

### Feature 1: Inventory & Low-Stock Alert
- **Where to demo**: Navigate to **Inventory & Stock** on the sidebar.
- **How to test live in front of the teacher**:
  1. Find any item (e.g. *Traditional Temple Lakshmi Bangle*).
  2. Notice the stock count is `1` and threshold is `2`, triggering the red pulsating **`LOW STOCK`** badge.
  3. Click **`Edit Stock`** or the quick `+` button to raise stock to `3`.
  4. Notice the badge instantly flips to **`Healthy`** and the Low Stock KPI card count updates from `3` to `2` without reloading the page!

### Feature 2: Demand Status Heuristic
- **Where to demo**: Look at the **Demand Heuristic** column in the Inventory table.
- **The Heuristic Rule**:
  - If `(recentSalesCount + inquiryCount) >= 5` ➔ Tagged as **High Demand** (Gold/Amber Badge).
  - If `stockCount > 8` and `recentSalesCount === 0` ➔ Tagged as **Slow Moving** (Gray Badge).
  - Otherwise ➔ Tagged as **Normal Velocity**.

### Feature 3: Co-Owner Counter Availability
- **Where to demo**: Look at the **Top Banner** ("Today at Counter: ...") and the **Counter Presence Roster**.
- **How to test live in front of the teacher**:
  1. On the Dashboard or Counter Roster, flip the toggle switch next to *Devika Shah* (Counter 3).
  2. Watch her status instantly change from *Off-duty* to *Active*, and observe her name immediately appear on the top public showroom banner.

### Feature 4: VIP Customer Inquiry Dispatcher
- **Where to demo**: Navigate to **VIP Inquiries** on the sidebar.
- **How to test live in front of the teacher**:
  1. Click **`Book VIP Appointment`** to enter a new client (e.g., Mrs. Kapoor interested in a Diamond Solitaire).
  2. Find the client in the dispatcher table.
  3. Click **`Stock Prepared`** ➔ The status chip turns Blue.
  4. Click **`Mark Completed`** ➔ The status chip turns Green, archiving the consultation.

---

## 🎓 Viva Defense Cheat-Sheet (Examiner Q&A)

### Q1: Why did you split your Express routes into separate files (`productRoutes.js`, `partnerRoutes.js`, `inquiryRoutes.js`)?
> **Answer**: "We implemented the **Separation of Concerns (SoC)** principle and modular routing using `express.Router()`. If all routes were kept in `server.js`, the code would become a monolithic, unmaintainable file. Modular route files allow us to isolate database models, apply route-specific validation, and facilitate clean unit testing without side effects across features."

---

### Q2: How does your Demand Velocity Heuristic work mathematically?
> **Answer**: "Instead of introducing unnecessary complexity and dependency on heavy external Machine Learning libraries (like TensorFlow.js or Python microservices) for a standard retail store, we engineered a deterministic velocity heuristic directly inside the Mongoose schema:
> $$\text{Total Interest} = \text{Recent Sales Count} + \text{Inquiry Count}$$
> - **Condition 1 (High Demand)**: If $\text{Total Interest} \ge 5$, it indicates high buyer velocity, signaling staff to restock.
> - **Condition 2 (Slow Moving)**: If $\text{Stock Count} > 8$ and $\text{Recent Sales} = 0$, capital is locked in non-moving stock.
> - **Condition 3 (Normal)**: Default baseline inventory.
> This runs in $\mathcal{O}(1)$ time complexity on every query."

---

### Q3: Why did you use Mongoose Virtual Properties instead of saving `lowStock` and `demandStatus` as fields in MongoDB?
> **Answer**: "Virtual properties prevent **data redundancy** and avoid **stale data anomalies**. If we stored `lowStock: Boolean` as a hardcoded column in the database, every time a cashier sells an item, we would have to remember to execute a second update query just to toggle the flag. By computing it as a virtual getter (`this.stockCount <= this.minThreshold`), the flag is guaranteed to be 100% mathematically consistent at query time."

---

### Q4: How does React state synchronize with MongoDB through Express?
> **Answer**: "We utilize a standard unidirectional data-flow:
> 1. On component mount, React executes an `axios.get('/api/products')` call inside `useEffect`.
> 2. Express processes the request, queries MongoDB via Mongoose, attaches virtual properties via `{ virtuals: true }`, and returns JSON.
> 3. React sets the response payload into component state (`setProducts(...)`).
> 4. When a user edits stock or toggles a counter, React makes a `PATCH`/`PUT` request to the Express endpoint, awaits the updated document, and executes an **optimistic state update** so the UI re-renders instantaneously."

---

## 💻 Exact Git Terminal Commands (Pushing to GitHub)

Open your terminal in the root project folder (`d:\FINAL_PROJECT_SEM4`) and run:

```bash
# 1. Initialize local git repository
git init

# 2. Stage all project files (node_modules and .env are automatically ignored by .gitignore)
git add .

# 3. Create your first milestone commit
git commit -m "feat: complete RatanFlow Jewelry Store Management System for Final Year Semester 4"

# 4. Rename default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ratanflow-jewelry-management.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 👥 Student Developers
- Final Year Project Candidates — Semester 4
- Project Title: **RatanFlow (Jewelry Store Management System)**
- Built with React.js, Express.js, Node.js, MongoDB, and Tailwind CSS.
