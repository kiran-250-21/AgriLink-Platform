# AgriLink — Farmer-Centric Market Intelligence, Marketplace & Logistics Platform

> **Tagline**: *Find the Best Market. Calculate the Real Return. Sell Smarter.*

AgriLink is a farmer-centric agricultural market intelligence platform. Unlike traditional e-commerce or simple ordering websites, AgriLink prioritizes the farmer's real net return by calculating:

$$\text{Estimated Net Revenue} = \text{Gross Revenue} - \text{Estimated Logistics Cost}$$

It compares live regional APMC market price listings against buyer procurement offers, factors in distance-based transportation haulage costs, ranks all selling options descending by real net return, and connects Farmers, Buyers, and Drivers through a unified transaction workflow.

---

## 🌟 Key Product Features & Architectural Engines

1. **Market Intelligence & Net Return Recommendation Engine**:
   - Calculates $\text{Selling Price} \times \text{Quantity}$ across all APMC markets and buyer procurement offers.
   - Computes distance-based transport costs between origin farm and destination hubs.
   - Ranks destinations descending by Estimated Net Revenue and tags the 🏆 **Best Net Return Option**.

2. **Dual Destination Decision Pathways**:
   - **Direct APMC Market**: Immediate order lock with status `LOGISTICS_REQUIRED` and direct driver matching.
   - **Buyer Procurement Offer**: Generates a sale intent request (`PENDING_BUYER_CONFIRMATION`), allowing the buyer to accept/reject before shipment dispatch.

3. **Concurrency-Safe Atomic Inventory Engine**:
   - Executes atomic MongoDB updates (`$inc: { availableQuantity: -qty }` with `{ availableQuantity: { $gte: qty } }`) upon buyer acceptance or market choice, guaranteeing zero overselling.

4. **Synchronized Role-Based Workspaces (RBAC)**:
   - 🌾 **Farmer**: Declare harvests, run market net return analysis, choose destination, track sales & shipments.
   - 🏢 **Buyer**: Publish procurement buy offers, browse global farmer marketplace, accept incoming sale requests.
   - 🚛 **Driver**: Browse available delivery jobs matching vehicle capacity, accept jobs, advance status state machine (`PICKED_UP` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `DELIVERED`).
   - 🛡️ **Admin**: APMC market management, live crop price updates, user verification, platform metrics & security audit logs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide React Icons, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, CORS, Dotenv
- **Deployment**: Render / Vercel / Netlify + MongoDB Atlas

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/AgriLink.git
cd AgriLink

# Install Backend
cd backend
npm install

# Install Frontend
cd ../frontend
npm install
```

### 2. Environment Variables (`backend/.env`)
Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agrilink
JWT_SECRET=your_agrilink_secret_jwt_key_2026
NODE_ENV=development
ADMIN_EMAIL=admin@agrilink.com
ADMIN_PASSWORD=adminPass123!
```

### 3. Run Locally
```bash
# Start Backend (Port 5000)
cd backend
npm start

# Start Frontend (Port 3000)
cd ../frontend
npm run dev
```

---

## 📤 How to Push to GitHub

```bash
# 1. Initialize Git repository
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "Initial commit: AgriLink master platform codebase"

# 4. Link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AgriLink.git

# 5. Push code to GitHub
git push -u origin main
```

---

## ☁️ How to Deploy on Render

### Option A: 1-Click Render Blueprint Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **Blueprints** $\rightarrow$ **New Blueprint Instance**.
2. Connect your GitHub repository `AgriLink`.
3. Render will read `render.yaml` and automatically create both the **Backend Web Service** and **Frontend Static Site**.
4. In the Render Dashboard under `agrilink-backend` environment settings, set `MONGO_URI` to your **MongoDB Atlas connection string**.

### Option B: Manual Service Creation on Render

#### 1. Backend Web Service:
- **Repository**: Your AgriLink repo
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `PORT`: `5000`
  - `NODE_ENV`: `production`
  - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/agrilink?retryWrites=true&w=majority`
  - `JWT_SECRET`: `your_secure_jwt_secret`
  - `ADMIN_EMAIL`: `admin@agrilink.com`
  - `ADMIN_PASSWORD`: `adminPass123!`

#### 2. Frontend Static Site:
- **Repository**: Your AgriLink repo
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrite Rule**: Source `/*` $\rightarrow$ Destination `/index.html`
- **Environment Variable**: `VITE_API_URL` = `https://your-agrilink-backend.onrender.com/api`

---

## 🔑 One-Click Demo Credentials

| Role | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- |
| 🌾 **Farmer** | `kiran@farmer.com` | `farmer123` | Declare harvest, run net return intelligence, choose destination |
| 🏢 **Buyer** | `ravi@buyer.com` | `buyer123` | Publish procurement offer, accept incoming sale requests |
| 🚛 **Driver** | `arun@driver.com` | `driver123` | Accept delivery job, advance shipment timeline |
| 🛡️ **Admin** | `admin@agrilink.com` | `adminPass123!` | Update APMC market prices, verify users, inspect audit logs |
