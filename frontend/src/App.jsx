import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MarketIntelligence from './pages/farmer/MarketIntelligence';
import HarvestsList from './pages/farmer/HarvestsList';
import CreateHarvest from './pages/farmer/CreateHarvest';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerDeliveries from './pages/farmer/FarmerDeliveries';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import AvailableHarvests from './pages/buyer/AvailableHarvests';
import SaleRequests from './pages/buyer/SaleRequests';
import BuyerRequirementsList from './pages/buyer/BuyerRequirementsList';
import CreateRequirement from './pages/buyer/CreateRequirement';
import BuyerOrders from './pages/buyer/BuyerOrders';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import AvailableJobs from './pages/driver/AvailableJobs';
import ActiveDeliveries from './pages/driver/ActiveDeliveries';
import VehicleSetup from './pages/driver/VehicleSetup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MarketManagement from './pages/admin/MarketManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Analytics from './pages/admin/Analytics';
import AuditLogs from './pages/admin/AuditLogs';

// Layout wrapper for authenticated workspaces
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

// Smart Root Redirect based on user role
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const routes = {
    FARMER: '/farmer/dashboard',
    BUYER: '/buyer/dashboard',
    DRIVER: '/driver/dashboard',
    ADMIN: '/admin/dashboard',
  };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Workspace */}
          <Route
            path="/farmer/*"
            element={
              <ProtectedRoute allowedRoles={['FARMER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<FarmerDashboard />} />
                    <Route path="intelligence" element={<MarketIntelligence />} />
                    <Route path="harvests" element={<HarvestsList />} />
                    <Route path="harvests/new" element={<CreateHarvest />} />
                    <Route path="orders" element={<FarmerOrders />} />
                    <Route path="deliveries" element={<FarmerDeliveries />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Buyer Workspace */}
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<BuyerDashboard />} />
                    <Route path="marketplace" element={<AvailableHarvests />} />
                    <Route path="requests" element={<SaleRequests />} />
                    <Route path="requirements" element={<BuyerRequirementsList />} />
                    <Route path="requirements/new" element={<CreateRequirement />} />
                    <Route path="orders" element={<BuyerOrders />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Driver Workspace */}
          <Route
            path="/driver/*"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<DriverDashboard />} />
                    <Route path="jobs" element={<AvailableJobs />} />
                    <Route path="deliveries" element={<ActiveDeliveries />} />
                    <Route path="vehicle" element={<VehicleSetup />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Workspace */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="markets" element={<MarketManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="audit-logs" element={<AuditLogs />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Catch-all */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
