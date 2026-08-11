import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBuyerRequirement } from '../../services/buyerApi';
import { useAuth } from '../../context/AuthContext';
import { Tag, PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CreateRequirement() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState('Ginger');
  const [requiredQuantity, setRequiredQuantity] = useState(5000);
  const [offeredPrice, setOfferedPrice] = useState(52);
  const [quality, setQuality] = useState('GRADE_A');
  const [location, setLocation] = useState(user?.buyerProfile?.businessLocation || 'Vijayawada');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBuyerRequirement({
        crop,
        requiredQuantity: Number(requiredQuantity),
        offeredPrice: Number(offeredPrice),
        quality,
        location,
      });

      navigate('/buyer/requirements');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish requirement offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Publish Buying Requirement Offer</h1>
          <p className="text-xs text-slate-400">Published buy offers feed into AgriLink Market Intelligence calculations</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Target Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ginger">Ginger</option>
                <option value="Chilli">Chilli</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Cotton">Cotton</option>
                <option value="Paddy">Paddy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Required Quantity (Kg)
              </label>
              <input
                type="number"
                required
                min="100"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Offered Price (₹ / Kg)
              </label>
              <input
                type="number"
                required
                step="0.5"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Required Grade
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              >
                <option value="GRADE_A">Grade A (Premium)</option>
                <option value="GRADE_B">Grade B (Standard)</option>
                <option value="GRADE_C">Grade C (Fair)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Procurement Location / Warehouse Hub
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Publishing Offer...' : 'Publish Buy Offer'} <CheckCircle2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
