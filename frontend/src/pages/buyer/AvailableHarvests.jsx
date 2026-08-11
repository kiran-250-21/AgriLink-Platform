import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableHarvests } from '../../services/harvestApi';
import { createOrder } from '../../services/orderApi';
import StatusBadge from '../../components/StatusBadge';
import { Store, Search, ShoppingBag, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AvailableHarvests() {
  const [harvests, setHarvests] = useState([]);
  const [filterCrop, setFilterCrop] = useState('');
  const [loading, setLoading] = useState(true);

  // Direct Purchase Modal State
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1000);
  const [offeredPrice, setOfferedPrice] = useState(52);
  const [deliveryAddress, setDeliveryAddress] = useState('Vijayawada Central Warehouse');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketplace();
  }, [filterCrop]);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const data = await getAvailableHarvests(filterCrop);
      setHarvests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPurchaseModal = (h) => {
    setModalError('');
    setSelectedHarvest(h);
    setPurchaseQty(h.availableQuantity);
    let price = 52;
    if (/chilli/i.test(h.cropName)) price = 185;
    else if (/turmeric/i.test(h.cropName)) price = 122;
    setOfferedPrice(price);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedHarvest) return;
    setSubmitting(true);
    setModalError('');
    try {
      await createOrder({
        harvestId: selectedHarvest._id,
        quantity: Number(purchaseQty),
        agreedPricePerUnit: Number(offeredPrice),
        deliveryAddress: deliveryAddress || 'Buyer Warehouse Hub',
      });

      setSelectedHarvest(null);
      navigate('/buyer/orders');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit purchase order.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Global Farmer Marketplace</h1>
          <p className="text-xs text-slate-400">Browse live farmer crop listings and initiate direct purchases</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            placeholder="Search crop (e.g. Ginger)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harvests.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-2">
            <Store className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No available farmer harvests match criteria.</p>
          </div>
        ) : (
          harvests.map((h) => (
            <div key={h._id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{h.category || 'Crop'}</span>
                  <StatusBadge status={h.status} />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{h.cropName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Farmer:{' '}
                    <strong className="text-slate-200">{h.farmerId?.name || 'Farmer'}</strong> ({h.farmLocation})
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <p>Available Stock: <strong className="text-emerald-400 font-bold">{h.availableQuantity} {h.unit}</strong></p>
                  <p>Quality Grade: <strong className="text-slate-300">{h.quality}</strong></p>
                  {h.farmerId?.phone && <p className="text-slate-400">Contact: 📞 {h.farmerId.phone}</p>}
                </div>
              </div>

              <button
                onClick={() => handleOpenPurchaseModal(h)}
                className="w-full py-2.5 px-4 rounded-xl font-bold font-heading text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Request Purchase from Farmer
              </button>
            </div>
          ))
        )}
      </div>

      {/* DIRECT PURCHASE CONFIRMATION MODAL */}
      {selectedHarvest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">
                Purchase Order from Farmer
              </h3>
              <button
                onClick={() => setSelectedHarvest(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <p className="text-slate-400">Target Crop & Farmer:</p>
              <p className="text-base font-bold text-white">{selectedHarvest.cropName}</p>
              <p className="text-emerald-400 font-semibold">
                Farmer {selectedHarvest.farmerId?.name || 'Kiran'} ({selectedHarvest.farmLocation})
              </p>
              <p className="text-slate-400 mt-2">Available Stock: {selectedHarvest.availableQuantity} Kg</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Purchase Qty (Kg)</label>
                <input
                  type="number"
                  max={selectedHarvest.availableQuantity}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Offered Price (₹ / Kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Total Purchase Value:</span>
              <span className="font-bold text-slate-200">₹{(purchaseQty * offeredPrice).toLocaleString('en-IN')}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedHarvest(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmPurchase}
                className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                {submitting ? 'Confirming...' : 'Confirm Purchase'} <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
