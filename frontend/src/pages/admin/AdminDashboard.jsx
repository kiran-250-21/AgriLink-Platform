import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import { getPlatformAnalytics } from '../../services/adminApi';
import { Users, Store, ShoppingBag, Truck, DollarSign, ShieldAlert, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getPlatformAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uStats = analytics?.userStats || {};
  const mStats = analytics?.marketplaceStats || {};
  const fMetrics = analytics?.financialMetrics || {};

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">AgriLink Admin Control Plane</h1>
          <p className="text-xs text-slate-400 mt-1">Platform-wide role-based access control, APMC market management, and transaction auditing</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
          ADMIN ACCESS
        </span>
      </div>

      {/* User Statistics Row */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">User Registry Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Platform Users" value={uStats.totalUsers || 0} subtitle="Registered accounts" icon={Users} color="purple" />
          <StatCard title="Farmers" value={uStats.totalFarmers || 0} subtitle="Verified growers" icon={Users} color="emerald" />
          <StatCard title="Buyers" value={uStats.totalBuyers || 0} subtitle="Wholesalers & Processors" icon={Users} color="indigo" />
          <StatCard title="Drivers" value={uStats.totalDrivers || 0} subtitle="Logistics providers" icon={Users} color="amber" />
        </div>
      </div>

      {/* Financial & Operations Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Marketplace Operations & Financial Volume</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Gross Transaction Value" value={`₹${fMetrics.totalGrossRevenue?.toLocaleString('en-IN') || 0}`} subtitle="Total trade volume" icon={DollarSign} color="emerald" />
          <StatCard title="Logistics Haulage Cost" value={`₹${fMetrics.totalLogisticsCost?.toLocaleString('en-IN') || 0}`} subtitle="Transport fees" icon={Truck} color="amber" />
          <StatCard title="Total Net Revenue" value={`₹${fMetrics.totalNetRevenue?.toLocaleString('en-IN') || 0}`} subtitle="Combined net return" icon={BarChart3} color="purple" />
          <StatCard title="Active Harvest Stocks" value={mStats.activeHarvests || 0} subtitle="Crops in market" icon={Store} color="cyan" />
        </div>
      </div>
    </div>
  );
}
