import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orderApi';
import StatusBadge from '../../components/StatusBadge';
import { ShoppingBag, RefreshCw, Truck } from 'lucide-react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Purchases & Order Tracking</h1>
          <p className="text-xs text-slate-400">All confirmed procurement purchases and shipment statuses</p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No confirmed purchases yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Crop & Qty</th>
                  <th className="px-6 py-4">Agreed Price</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Est. Net Revenue</th>
                  <th className="px-6 py-4">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{o.farmerId?.name || 'Farmer'}</div>
                      <div className="text-[10px] text-slate-400">{o.farmerId?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{o.cropName}</div>
                      <div className="text-[10px] text-slate-400">{o.quantity} Kg</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">₹{o.agreedPricePerUnit}/Kg</td>
                    <td className="px-6 py-4 text-slate-300">₹{o.grossRevenue?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-extrabold text-amber-400">₹{o.estimatedNetRevenue?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
