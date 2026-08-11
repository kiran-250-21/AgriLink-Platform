import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBuyerRequirements } from '../../services/buyerApi';
import StatusBadge from '../../components/StatusBadge';
import { Tag, PlusCircle, RefreshCw } from 'lucide-react';

export default function BuyerRequirementsList() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReqs();
  }, []);

  const fetchReqs = async () => {
    setLoading(true);
    try {
      const data = await getMyBuyerRequirements();
      setRequirements(data || []);
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
          <h1 className="text-2xl font-bold font-heading text-white">Active Buy Requirements</h1>
          <p className="text-xs text-slate-400">Manage your published procurement offers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReqs}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/buyer/requirements/new"
            className="py-2.5 px-4 rounded-xl font-bold font-heading text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Publish New Buy Offer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requirements.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-3">
            <Tag className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No procurement offers published yet.</p>
          </div>
        ) : (
          requirements.map((r) => (
            <div key={r._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{r.quality}</span>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="text-xl font-bold font-heading text-white">{r.crop}</h3>
              <div className="space-y-1 text-xs text-slate-300">
                <p>Required Quantity: <strong className="text-white">{r.requiredQuantity} Kg</strong></p>
                <p>Offered Price: <strong className="text-emerald-400 font-bold">₹{r.offeredPrice}/Kg</strong></p>
                <p>Location: <strong className="text-slate-200">{r.location}</strong></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
