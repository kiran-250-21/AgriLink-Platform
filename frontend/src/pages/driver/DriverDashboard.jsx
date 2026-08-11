import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { getAvailableJobs, getMyDeliveries } from '../../services/deliveryApi';
import { Truck, PackageCheck, DollarSign, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();

  const [availableJobs, setAvailableJobs] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      const [jData, dData] = await Promise.all([
        getAvailableJobs(),
        getMyDeliveries(),
      ]);

      setAvailableJobs(jData || []);
      setMyDeliveries(dData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeDeliveries = myDeliveries.filter(d => d.status !== 'COMPLETED');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'COMPLETED' || d.status === 'DELIVERED');
  
  // Total Freight Earnings: Sum of all assigned & accepted transport jobs
  const totalContractedEarnings = myDeliveries.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);
  const completedEarnings = completedDeliveries.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Greeting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Driver Hub — <span className="text-amber-400">{user?.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            License: <strong className="text-slate-200">{user?.driverProfile?.licenseNumber || 'Verified Driver'}</strong> • Logistics Fleet Ready
          </p>
        </div>

        <Link
          to="/driver/jobs"
          className="py-3 px-5 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Truck className="w-4 h-4" /> View Available Jobs ({availableJobs.length})
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Jobs" value={availableJobs.length} subtitle="Open transport offers" icon={Truck} color="amber" />
        <StatCard title="Active Shipments" value={activeDeliveries.length} subtitle="Hauls in progress" icon={PackageCheck} color="purple" />
        <StatCard title="Completed Trips" value={completedDeliveries.length} subtitle="Delivered hauls" icon={Tag} color="emerald" />
        <StatCard title="Total Haul Earnings" value={`₹${totalContractedEarnings.toLocaleString('en-IN')}`} subtitle={`₹${completedEarnings.toLocaleString('en-IN')} settled payout`} icon={DollarSign} color="indigo" />
      </div>

      {/* Active Jobs & Available Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipments in Progress */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">My Active Transport Jobs</h3>
            <Link to="/driver/deliveries" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              Update Status <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myDeliveries.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No transport jobs accepted yet. Go to Job Marketplace to accept jobs.</p>
            ) : (
              myDeliveries.slice(0, 4).map((d) => (
                <div key={d._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {d.pickupLocation} → {d.dropoffLocation}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Distance: <strong className="text-slate-200">{d.totalDistanceKm} Km</strong>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusBadge status={d.status} />
                    <p className="text-xs font-bold text-amber-400">₹{d.estimatedCost?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Jobs Preview */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">Open Jobs Marketplace</h3>
            <Link to="/driver/jobs" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {availableJobs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No open delivery jobs currently awaiting drivers.</p>
            ) : (
              availableJobs.slice(0, 4).map((job) => (
                <div key={job._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Shipment to {job.dropoffLocation}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Pickup: <strong className="text-slate-200">{job.pickupLocation}</strong> • {job.totalDistanceKm} Km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-amber-400">₹{job.estimatedCost?.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-400 block">Freight Revenue</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
