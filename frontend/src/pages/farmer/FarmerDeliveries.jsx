import React, { useState, useEffect } from 'react';
import { getMyDeliveries } from '../../services/deliveryApi';
import StatusBadge from '../../components/StatusBadge';
import { Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';

export default function FarmerDeliveries() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Logistics & Delivery Tracking</h1>
        <p className="text-xs text-slate-400">Live shipment updates synchronized across Farmer, Buyer, Driver, and Admin</p>
      </div>

      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-2">
            <Truck className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No shipments in transit yet.</p>
          </div>
        ) : (
          deliveries.map((d) => (
            <div key={d._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Shipment to {d.dropoffLocation}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pickup Origin: <strong className="text-slate-200">{d.pickupLocation}</strong> • Distance:{' '}
                    <strong className="text-emerald-400">{d.totalDistanceKm} Km</strong>
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>

              {/* Driver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Driver</p>
                  <p className="font-semibold text-white mt-0.5">{d.driverId?.name || 'Awaiting Driver Assignment'}</p>
                  {d.driverId?.phone && <p className="text-slate-400 text-[11px]">📞 {d.driverId.phone}</p>}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Vehicle Type</p>
                  <p className="font-semibold text-white mt-0.5">{d.vehicleId?.vehicleType || 'Standard Truck'}</p>
                  {d.vehicleId?.registrationNumber && (
                    <p className="text-amber-400 text-[11px]">Reg: {d.vehicleId.registrationNumber}</p>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Est. Logistics Cost</p>
                  <p className="font-bold text-rose-400 text-sm mt-0.5">₹{d.estimatedCost?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Timeline progression */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Delivery State Timeline</p>
                <div className="space-y-2">
                  {d.timeline?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-slate-200">{step.status}</span>
                      <span className="text-[10px] text-slate-500">{new Date(step.timestamp).toLocaleString()}</span>
                      {step.note && <span className="text-slate-400 italic text-[11px]">- {step.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
