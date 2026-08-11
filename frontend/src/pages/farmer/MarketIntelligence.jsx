import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyHarvests } from '../../services/harvestApi';
import { analyzeRecommendation } from '../../services/recommendationApi';
import { createOrder } from '../../services/orderApi';
import RecommendationCard from '../../components/RecommendationCard';
import { TrendingUp, Award, Calculator, ArrowRight, Store, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MarketIntelligence() {
  const location = useLocation();
  const navigate = useNavigate();

  const [harvests, setHarvests] = useState([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState('');
  const [quantity, setQuantity] = useState(5000);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [activeModalOption, setActiveModalOption] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    loadHarvestsAndAnalyze();
  }, []);

  const loadHarvestsAndAnalyze = async () => {
    try {
      const myHarvests = await getMyHarvests();
      setHarvests(myHarvests || []);

      const initialId = location.state?.harvestId || (myHarvests.length > 0 ? myHarvests[0]._id : '');
      if (initialId) {
        setSelectedHarvestId(initialId);
        const currentH = myHarvests.find(h => h._id === initialId);
        if (currentH) {
          setQuantity(currentH.availableQuantity);
          runAnalysis(initialId, currentH.availableQuantity);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runAnalysis = async (hId, qty) => {
    if (!hId) return;
    setLoading(true);
    try {
      const res = await analyzeRecommendation(hId, qty);
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHarvestSelectChange = (e) => {
    const id = e.target.value;
    setSelectedHarvestId(id);
    const targetH = harvests.find(h => h._id === id);
    if (targetH) {
      setQuantity(targetH.availableQuantity);
      runAnalysis(id, targetH.availableQuantity);
    }
  };

  const handleConfirmDestinationSelection = async () => {
    if (!activeModalOption || !selectedHarvestId) return;
    setSubmittingOrder(true);

    try {
      const currentH = harvests.find(h => h._id === selectedHarvestId);
      const isMarket = activeModalOption.destinationType === 'MARKET';

      const payload = {
        harvestId: selectedHarvestId,
        destinationType: activeModalOption.destinationType,
        destinationName: activeModalOption.destinationName,
        marketId: activeModalOption.marketId,
        buyerId: activeModalOption.buyerId,
        quantity: Number(quantity),
        agreedPricePerUnit: activeModalOption.sellingPrice,
        grossRevenue: activeModalOption.grossRevenue,
        estimatedLogisticsCost: activeModalOption.estimatedLogisticsCost,
        estimatedNetRevenue: activeModalOption.estimatedNetRevenue,
        distanceKm: activeModalOption.distanceKm,
        deliveryAddress: deliveryAddress || activeModalOption.location || 'Regional Market Yard',
      };

      const newOrder = await createOrder(payload);

      setActiveModalOption(null);
      if (isMarket) {
        // Direct Market Destination -> Immediately assigned to logistics tracking
        navigate('/farmer/deliveries');
      } else {
        // Buyer Destination -> Sent as pending confirmation sale intent
        navigate('/farmer/orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit sale selection.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold font-heading text-white">Market Intelligence & Net Return Calculator</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compares live APMC market prices and buyer offers against distance-based transportation costs to calculate real net revenue.
          </p>
        </div>

        {/* Harvest Selector Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Harvest</label>
            <select
              value={selectedHarvestId}
              onChange={handleHarvestSelectChange}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:ring-2 focus:ring-amber-500"
            >
              {harvests.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.cropName} ({h.availableQuantity} Kg @ {h.farmLocation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity (Kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                runAnalysis(selectedHarvestId, e.target.value);
              }}
              className="w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold">Running AgriLink Intelligence & Net Return Engine...</p>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6">
          {/* Analysis Context Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div>
              Analyzing: <strong className="text-white">{analysisResult.harvest?.cropName}</strong> • Quantity:{' '}
              <strong className="text-emerald-400">{analysisResult.quantityAnalyzed} Kg</strong> • Origin:{' '}
              <strong className="text-slate-200">{analysisResult.harvest?.farmLocation}</strong>
            </div>
            <div className="text-slate-400">
              Total Options Analyzed: <strong className="text-amber-400">{analysisResult.allOptions?.length}</strong>
            </div>
          </div>

          {/* 🏆 BEST OPTION FEATURE DISPLAY */}
          {analysisResult.recommendedOption && (
            <div>
              <h2 className="text-sm uppercase tracking-wider font-extrabold text-amber-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" /> 🏆 Top Recommended Destination
              </h2>
              <RecommendationCard
                option={analysisResult.recommendedOption}
                onSelectOption={(opt) => {
                  setActiveModalOption(opt);
                  setDeliveryAddress(opt.location || 'Regional Yard');
                }}
              />
            </div>
          )}

          {/* ALL RANKED OPTIONS MATRIX */}
          <div>
            <h2 className="text-sm uppercase tracking-wider font-extrabold text-slate-300 mb-3">
              All Analyzed Market & Buyer Options (Ranked by Estimated Net Revenue)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.allOptions
                ?.filter(opt => !opt.isRecommended)
                .map((opt) => (
                  <RecommendationCard
                    key={opt.rank}
                    option={opt}
                    onSelectOption={(o) => {
                      setActiveModalOption(o);
                      setDeliveryAddress(o.location || 'Regional Yard');
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 glass-panel rounded-3xl">
          Please declare a harvest to run market intelligence analysis.
        </div>
      )}

      {/* CONFIRMATION DESTINATION MODAL */}
      {activeModalOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-md w-full space-y-5 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">
                Confirm Destination Choice
              </h3>
              <button
                onClick={() => setActiveModalOption(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-400">Destination:</p>
              <p className="text-base font-bold text-white">{activeModalOption.destinationName}</p>
              <p className="text-slate-400 mt-2">Destination Category:</p>
              <span className="inline-block font-bold text-emerald-400">
                {activeModalOption.destinationType === 'MARKET' ? 'Direct APMC Market Sale' : 'Buyer Offer Purchase Intent'}
              </span>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400">Offered Price</p>
                  <p className="font-bold text-slate-200">₹{activeModalOption.sellingPrice}/Kg</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-400">Est. Net Revenue</p>
                  <p className="font-extrabold text-amber-400">₹{activeModalOption.estimatedNetRevenue?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dropoff / Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                placeholder="Market Yard / Buyer Warehouse Address"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalOption(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submittingOrder}
                onClick={handleConfirmDestinationSelection}
                className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-lg shadow-emerald-600/20"
              >
                {submittingOrder ? 'Processing...' : 'Confirm & Initiate'} <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
