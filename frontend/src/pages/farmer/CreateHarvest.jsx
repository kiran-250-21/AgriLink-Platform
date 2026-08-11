import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHarvest } from '../../services/harvestApi';
import { useAuth } from '../../context/AuthContext';
import { Sprout, PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CreateHarvest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cropName, setCropName] = useState('Ginger');
  const [category, setCategory] = useState('Spices');
  const [expectedQuantity, setExpectedQuantity] = useState(5000);
  const [quality, setQuality] = useState('GRADE_A');
  const [farmLocation, setFarmLocation] = useState(user?.farmerProfile?.farmLocation || 'Guntur');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newHarvest = await createHarvest({
        cropName,
        category,
        expectedQuantity: Number(expectedQuantity),
        availableQuantity: Number(expectedQuantity),
        quality,
        farmLocation,
      });

      // Navigate immediately to Market Intelligence tool for this newly created harvest!
      navigate('/farmer/intelligence', { state: { harvestId: newHarvest._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create harvest');
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
          <h1 className="text-2xl font-bold font-heading text-white">Plan & Declare Harvest</h1>
          <p className="text-xs text-slate-400">Declare your harvest details to analyze estimated net returns across markets</p>
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
                Crop Name
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500"
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
                Crop Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Quantity (Kg)
              </label>
              <input
                type="number"
                required
                min="100"
                value={expectedQuantity}
                onChange={(e) => setExpectedQuantity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Quality Grade
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
              Farm Location / Origin District
            </label>
            <input
              type="text"
              required
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Guntur"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Declaring Harvest...' : 'Save & Calculate Best Market Net Return'} <CheckCircle2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
