import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyHarvests } from '../../services/harvestApi';
import StatusBadge from '../../components/StatusBadge';
import { Package, PlusCircle, TrendingUp, RefreshCw } from 'lucide-react';

export default function HarvestsList() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    setLoading(true);
    try {
      const data = await getMyHarvests();
      setHarvests(data || []);
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
          <h1 className="text-2xl font-bold font-heading text-white">My Declared Harvests</h1>
          <p className="text-xs text-slate-400">Manage your active farm yields and analyze market options</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHarvests}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/farmer/harvests/new"
            className="py-2.5 px-4 rounded-xl font-bold font-heading text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Plan New Harvest
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harvests.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-3">
            <Package className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No harvests declared yet.</p>
            <Link
              to="/farmer/harvests/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
            >
              <PlusCircle className="w-4 h-4" /> Add Your First Harvest
            </Link>
          </div>
        ) : (
          harvests.map((h) => (
            <div key={h._id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{h.category || 'Crop'}</span>
                  <StatusBadge status={h.status} />
                </div>
                <h3 className="text-xl font-bold font-heading text-white">{h.cropName}</h3>
                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <p>
                    Available Stock: <strong className="text-white">{h.availableQuantity} {h.unit}</strong> / {h.expectedQuantity} {h.unit}
                  </p>
                  <p>Quality Grade: <strong className="text-slate-200">{h.quality}</strong></p>
                  <p>Origin Location: <strong className="text-slate-200">{h.farmLocation}</strong></p>
                </div>
              </div>

              <button
                onClick={() => navigate('/farmer/intelligence', { state: { harvestId: h._id } })}
                className="w-full py-2.5 px-3 rounded-xl font-bold font-heading text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <TrendingUp className="w-4 h-4" /> Calculate Market Net Return
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
