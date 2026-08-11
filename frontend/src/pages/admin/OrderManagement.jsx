import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orderApi';
import StatusBadge from '../../components/StatusBadge';
import { ShoppingBag, RefreshCw } from 'lucide-react';

export default function OrderManagement() {
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
          <h1 className="text-2xl font-bold font-heading text-white">Platform Transaction Master List</h1>
          <p className="text-xs text-slate-400">All system transactions across Farmers, Buyers, and Markets</p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Farmer</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Crop & Qty</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Gross</th>
                <th className="px-6 py-4">Est. Net</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{o.farmerId?.name || 'Farmer'}</td>
                  <td className="px-6 py-4 text-slate-200">{o.destinationName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-800 text-slate-300">
                      {o.destinationType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {o.cropName} ({o.quantity} Kg)
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">₹{o.agreedPricePerUnit}/Kg</td>
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
      </div>
    </div>
  );
}
