import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  PlusCircle,
  PackageCheck,
  ShoppingBag,
  Truck,
  Store,
  FileSpreadsheet,
  Users,
  BarChart3,
  ShieldAlert,
  Tag,
  ListCheck,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const roleMenus = {
    FARMER: [
      { path: '/farmer/dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
      { path: '/farmer/intelligence', label: 'Market Intelligence', icon: TrendingUp, highlight: true },
      { path: '/farmer/harvests/new', label: 'Plan My Harvest', icon: PlusCircle },
      { path: '/farmer/harvests', label: 'My Harvests', icon: PackageCheck },
      { path: '/farmer/orders', label: 'Sales & Orders', icon: ShoppingBag },
      { path: '/farmer/deliveries', label: 'Logistics Tracking', icon: Truck },
    ],
    BUYER: [
      { path: '/buyer/dashboard', label: 'Buyer Dashboard', icon: LayoutDashboard },
      { path: '/buyer/marketplace', label: 'Farmer Harvests', icon: Store },
      { path: '/buyer/requests', label: 'Incoming Sale Requests', icon: ListCheck, highlight: true },
      { path: '/buyer/requirements/new', label: 'Publish Buy Offer', icon: PlusCircle },
      { path: '/buyer/requirements', label: 'Active Requirements', icon: Tag },
      { path: '/buyer/orders', label: 'Purchases & Tracking', icon: ShoppingBag },
    ],
    DRIVER: [
      { path: '/driver/dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
      { path: '/driver/jobs', label: 'Available Delivery Jobs', icon: Truck, highlight: true },
      { path: '/driver/deliveries', label: 'Active Deliveries', icon: PackageCheck },
      { path: '/driver/vehicle', label: 'Vehicle Specifications', icon: Tag },
    ],
    ADMIN: [
      { path: '/admin/dashboard', label: 'Control Plane', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Registry', icon: Users },
      { path: '/admin/markets', label: 'Markets & Price Feed', icon: Store },
      { path: '/admin/orders', label: 'Platform Transactions', icon: ShoppingBag },
      { path: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
      { path: '/admin/audit-logs', label: 'Security Audit Logs', icon: ShieldAlert },
    ],
  };

  const navItems = roleMenus[user.role] || [];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 bg-slate-900/60 p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="space-y-1">
        <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
          {user.role} Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300">Logged in as:</p>
          <p className="text-emerald-400 truncate font-mono mt-0.5">{user.name}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
            RBAC Role: {user.role}
          </p>
        </div>
      </div>
    </aside>
  );
}
