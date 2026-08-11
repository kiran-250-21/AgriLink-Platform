import React, { useState, useEffect } from 'react';
import { getIncomingSaleRequests } from '../../services/buyerApi';
import { respondToSaleRequest } from '../../services/orderApi';
import StatusBadge from '../../components/StatusBadge';
import { ListCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function SaleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getIncomingSaleRequests();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, action) => {
    try {
      await respondToSaleRequest(id, action);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Incoming Farmer Sale Requests</h1>
          <p className="text-xs text-slate-400">Review and accept crop purchase intents submitted by farmers</p>
        </div>

        <button
          onClick={fetchRequests}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-2">
            <ListCheck className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No pending farmer sale requests.</p>
          </div>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {r.farmerId?.name || 'Farmer'} — {r.quantity} Kg {r.cropName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Farm Location: <strong className="text-slate-200">{r.farmerId?.farmerProfile?.farmLocation || 'Guntur'}</strong> • Phone: {r.farmerId?.phone}
                  </p>
                </div>
                <StatusBadge status={r.orderStatus} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Agreed Price</p>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">₹{r.agreedPricePerUnit}/Kg</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Gross Revenue</p>
                  <p className="font-bold text-slate-200 text-sm mt-0.5">₹{r.grossRevenue?.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Est. Logistics</p>
                  <p className="font-bold text-rose-400 text-sm mt-0.5">-₹{r.estimatedLogisticsCost?.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-amber-400">Est. Net Revenue</p>
                  <p className="font-extrabold text-amber-400 text-sm mt-0.5">₹{r.estimatedNetRevenue?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => handleRespond(r._id, 'REJECT')}
                  className="py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Decline Request
                </button>
                <button
                  onClick={() => handleRespond(r._id, 'ACCEPT')}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Accept Purchase & Assign Driver
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
