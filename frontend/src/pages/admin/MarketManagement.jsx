import React, { useState, useEffect } from 'react';
import { getMarkets, createMarket, getMarketPrices, updateMarketPrice } from '../../services/adminApi';
import { Store, PlusCircle, Edit3, CheckCircle2 } from 'lucide-react';

export default function MarketManagement() {
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Market Form
  const [mName, setMName] = useState('');
  const [mLocation, setMLocation] = useState('Guntur');

  // Update Price Form
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [crop, setCrop] = useState('Ginger');
  const [pricePerUnit, setPricePerUnit] = useState(55);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([getMarkets(), getMarketPrices()]);
      setMarkets(mRes || []);
      setPrices(pRes || []);
      if (mRes && mRes.length > 0) setSelectedMarketId(mRes[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarket = async (e) => {
    e.preventDefault();
    try {
      await createMarket({ name: mName, location: mLocation });
      setMName('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create market');
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await updateMarketPrice({
        marketId: selectedMarketId,
        crop,
        pricePerUnit: Number(pricePerUnit),
      });
      loadData();
      alert(`Updated ${crop} market price to ₹${pricePerUnit}/Kg`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update price');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">APMC Market & Price Feed Management</h1>
        <p className="text-xs text-slate-400">Admin control panel to manage market trading hubs and update crop market price feeds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Market Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" /> Register APMC Market Hub
          </h3>

          <form onSubmit={handleCreateMarket} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Market Name</label>
              <input
                type="text"
                required
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                placeholder="Vizag Central APMC"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Location / City</label>
              <input
                type="text"
                required
                value={mLocation}
                onChange={(e) => setMLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                placeholder="Visakhapatnam"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Market
            </button>
          </form>
        </div>

        {/* Update Price Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-400" /> Update Live Crop Price Feed
          </h3>

          <form onSubmit={handleUpdatePrice} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Target Market</label>
              <select
                value={selectedMarketId}
                onChange={(e) => setSelectedMarketId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              >
                {markets.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Ginger">Ginger</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Paddy">Paddy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Price (₹ / Kg)</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Price Feed Update
            </button>
          </form>
        </div>
      </div>

      {/* Live Market Price Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-heading text-white">Current Market Price Feed Registry</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Price Per Kg</th>
                <th className="px-4 py-3">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {prices.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-bold text-white">{p.marketId?.name || 'APMC Market'}</td>
                  <td className="px-4 py-3 text-slate-200">{p.crop}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-400">₹{p.pricePerUnit}/Kg</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{new Date(p.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
