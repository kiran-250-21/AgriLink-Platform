import React, { useState, useEffect } from 'react';
import { getMyDeliveries, updateDeliveryStatus } from '../../services/deliveryApi';
import StatusBadge from '../../components/StatusBadge';
import { Truck, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

export default function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await getMyDeliveries();
      setDeliveries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await updateDeliveryStatus(id, nextStatus);
      fetchDeliveries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Active Deliveries & Job Progress</h1>
        <p className="text-xs text-slate-400">Update your shipment state as you progress through pickup, transit, and delivery</p>
      </div>

      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-2">
            <Truck className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No active or past deliveries assigned.</p>
          </div>
        ) : (
          deliveries.map((d) => (
            <div key={d._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Shipment: {d.pickupLocation} → {d.dropoffLocation}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Farmer Contact: <strong className="text-slate-200">{d.farmerId?.name} (📞 {d.farmerId?.phone})</strong>
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Distance</p>
                  <p className="font-bold text-slate-200 text-sm mt-0.5">{d.totalDistanceKm} Km</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-amber-400">Logistics Earnings</p>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">₹{d.estimatedCost?.toLocaleString('en-IN')}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Status</p>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">{d.status}</p>
                </div>
              </div>

              {/* Status State Machine Controls */}
              {d.status !== 'COMPLETED' && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 justify-end">
                  {d.status === 'DRIVER_ASSIGNED' && (
                    <button
                      onClick={() => handleUpdateStatus(d._id, 'PICKED_UP')}
                      className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Cargo Picked Up
                    </button>
                  )}

                  {d.status === 'PICKED_UP' && (
                    <button
                      onClick={() => handleUpdateStatus(d._id, 'IN_TRANSIT')}
                      className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Truck className="w-4 h-4" /> Mark In Transit
                    </button>
                  )}

                  {d.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleUpdateStatus(d._id, 'DELIVERED')}
                      className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Cargo Delivered
                    </button>
                  )}

                  {d.status === 'DELIVERED' && (
                    <button
                      onClick={() => handleUpdateStatus(d._id, 'COMPLETED')}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Job & Release Earnings
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
