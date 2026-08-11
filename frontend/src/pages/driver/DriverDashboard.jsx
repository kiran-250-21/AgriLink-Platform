import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { getAvailableJobs, getMyDeliveries } from '../../services/deliveryApi';
import { Truck, PackageCheck, DollarSign, Tag, ArrowRight } from 'lucide-react';

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
  const completedDeliveries = myDeliveries.filter(d => d.status === 'COMPLETED');
  const totalEarnings = completedDeliveries.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Greeting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Driver Hub — <span className="text-amber-400">{user?.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            License: <strong className="text-slate-200">{user?.driverProfile?.licenseNumber || 'Verified'}</strong> • Vehicle Specs Registered
          </p>
        </div>

        <Link
          to="/driver/jobs"
          className="py-3 px-5 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Truck className="w-4 h-4" /> View Available Transport Jobs ({availableJobs.length})
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Jobs" value={availableJobs.length} subtitle="Open delivery tasks" icon={Truck} color="amber" />
        <StatCard title="Active Deliveries" value={activeDeliveries.length} subtitle="In progress" icon={PackageCheck} color="purple" />
        <StatCard title="Completed Hauls" value={completedDeliveries.length} subtitle="Delivered shipments" icon={Tag} color="emerald" />
        <StatCard title="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} subtitle="Logistics revenue" icon={DollarSign} color="indigo" />
      </div>

      {/* Available Jobs Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-white">Available Delivery Jobs</h3>
          <Link to="/driver/jobs" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
            View Marketplace Marketplace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {availableJobs.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No open delivery jobs currently awaiting drivers.</p>
          ) : (
            availableJobs.slice(0, 3).map((job) => (
              <div key={job._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Shipment to {job.dropoffLocation}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Pickup: <strong className="text-slate-200">{job.pickupLocation}</strong> • Distance:{' '}
                    <strong className="text-emerald-400">{job.totalDistanceKm} Km</strong>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-amber-400">₹{job.estimatedCost?.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-slate-400 block">Est. Earnings</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
