import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orderApi';
import StatusBadge from '../../components/StatusBadge';
import { ShoppingBag, RefreshCw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmerOrders() {
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
          <h1 className="text-2xl font-bold font-heading text-white">Sales & Transactions</h1>
          <p className="text-xs text-slate-400">Track incoming buyer responses and confirmed market orders</p>
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
            <p className="text-sm font-semibold">No active sales initiated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Crop & Qty</th>
                  <th className="px-6 py-4">Agreed Price</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Est. Net Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Logistics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-white">{o.destinationName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          o.destinationType === 'MARKET'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {o.destinationType}
                      </span>
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
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/farmer/deliveries"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track Transport
                      </Link>
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
