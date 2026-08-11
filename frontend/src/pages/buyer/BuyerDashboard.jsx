import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { getMyBuyerRequirements, getIncomingSaleRequests } from '../../services/buyerApi';
import { getAvailableHarvests } from '../../services/harvestApi';
import { getMyOrders, createOrder, respondToSaleRequest } from '../../services/orderApi';
import { ShoppingBag, Tag, Store, ListCheck, PlusCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [saleRequests, setSaleRequests] = useState([]);
  const [availableHarvests, setAvailableHarvests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Direct Purchase Modal
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1000);
  const [offeredPrice, setOfferedPrice] = useState(52);
  const [deliveryAddress, setDeliveryAddress] = useState('Vijayawada Central Warehouse');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [reqData, srData, hData, oData] = await Promise.all([
        getMyBuyerRequirements(),
        getIncomingSaleRequests(),
        getAvailableHarvests(),
        getMyOrders(),
      ]);

      setRequirements(reqData || []);
      setSaleRequests(srData || []);
      setAvailableHarvests(hData || []);
      setOrders(oData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (orderId, action) => {
    try {
      await respondToSaleRequest(orderId, action);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to request.');
    }
  };

  const handleOpenPurchaseModal = (h) => {
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
      alert(err.response?.data?.message || 'Failed to submit purchase order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Buyer Dashboard — <span className="text-indigo-400">{user?.buyerProfile?.businessName || user?.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Procurement Hub • Location: <strong className="text-slate-200">{user?.buyerProfile?.businessLocation || 'Vijayawada'}</strong>
          </p>
        </div>

        <Link
          to="/buyer/requirements/new"
          className="py-3 px-5 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Publish Buying Requirement Offer
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Buy Offers" value={requirements.length} subtitle="Published offers" icon={Tag} color="indigo" />
        <StatCard title="Incoming Requests" value={saleRequests.length} subtitle="Farmers awaiting confirmation" icon={ListCheck} color="amber" />
        <StatCard title="Global Marketplace" value={availableHarvests.length} subtitle="Farmer crops available" icon={Store} color="emerald" />
        <StatCard title="Total Purchases" value={orders.length} subtitle="Initiated orders" icon={ShoppingBag} color="purple" />
      </div>

      {/* INCOMING SALE REQUESTS ACTION PANEL */}
      {saleRequests.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-amber-400 flex items-center gap-2">
              <ListCheck className="w-5 h-5" /> Pending Farmer Sale Intents ({saleRequests.length})
            </h3>
            <Link to="/buyer/requests" className="text-xs font-semibold text-amber-400 hover:underline">
              View All Requests
            </Link>
          </div>

          <div className="space-y-3">
            {saleRequests.map((req) => (
              <div key={req._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base">
                    {req.farmerId?.name || 'Farmer'} wants to sell {req.quantity} Kg {req.cropName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Offered Price: <strong className="text-emerald-400">₹{req.agreedPricePerUnit}/Kg</strong> • Gross: ₹{req.grossRevenue?.toLocaleString('en-IN')} • Est. Net: ₹{req.estimatedNetRevenue?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespond(req._id, 'REJECT')}
                    className="py-2 px-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleRespond(req._id, 'ACCEPT')}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Farmer Marketplace Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-white">Global Farmer Marketplace</h3>
          <Link to="/buyer/marketplace" className="text-xs font-semibold text-emerald-400 hover:underline">
            Browse All Crops
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableHarvests.slice(0, 3).map((h) => (
            <div key={h._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base">{h.cropName}</h4>
                  <StatusBadge status={h.status} />
                </div>
                <p className="text-xs text-slate-400">
                  Stock: <strong className="text-emerald-400 font-bold">{h.availableQuantity} {h.unit}</strong>
                </p>
                <p className="text-xs text-slate-400">
                  Farmer: <strong className="text-slate-200">{h.farmerId?.name || 'Farmer'}</strong> ({h.farmLocation})
                </p>
              </div>

              <button
                onClick={() => handleOpenPurchaseModal(h)}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Request Purchase from Farmer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DIRECT PURCHASE MODAL */}
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
