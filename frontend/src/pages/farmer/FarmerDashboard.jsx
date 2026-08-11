import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { getMyHarvests } from '../../services/harvestApi';
import { getMyOrders } from '../../services/orderApi';
import { getMyDeliveries } from '../../services/deliveryApi';
import { analyzeRecommendation } from '../../services/recommendationApi';
import { Package, TrendingUp, ShoppingBag, Truck, Award, ArrowRight, PlusCircle } from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [harvests, setHarvests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [topOpportunity, setTopOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [hData, oData, dData] = await Promise.all([
        getMyHarvests(),
        getMyOrders(),
        getMyDeliveries(),
      ]);

      setHarvests(hData || []);
      setOrders(oData || []);
      setDeliveries(dData || []);

      // If farmer has an active harvest, run recommendation for the first harvest
      if (hData && hData.length > 0) {
        const availableH = hData.find(h => h.status === 'AVAILABLE') || hData[0];
        const recResult = await analyzeRecommendation(availableH._id, availableH.availableQuantity);
        setTopOpportunity({
          harvest: availableH,
          bestOption: recResult.recommendedOption,
        });
      }
    } catch (err) {
      console.error('Failed to load farmer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const activeHarvestsCount = harvests.filter(h => h.status === 'AVAILABLE').length;
  const activeSalesCount = orders.filter(o => o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'REJECTED').length;
  const activeDeliveriesCount = deliveries.filter(d => d.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Good morning, <span className="text-emerald-400">{user?.name}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Farm Location: <span className="text-slate-200 font-medium">{user?.farmerProfile?.farmLocation || 'Guntur'}</span> •{' '}
            {user?.farmerProfile?.farmName || 'My Farm'}
          </p>
        </div>

        <Link
          to="/farmer/intelligence"
          className="py-3 px-5 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" /> Run Market Intelligence
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Harvests" value={activeHarvestsCount} subtitle="Ready to sell" icon={Package} color="emerald" />
        <StatCard title="Market Opportunities" value={topOpportunity ? 'Available' : '0'} subtitle="Calculated net options" icon={TrendingUp} color="amber" />
        <StatCard title="Active Sales & Orders" value={activeSalesCount} subtitle="In transactions" icon={ShoppingBag} color="indigo" />
        <StatCard title="Logistics & Deliveries" value={activeDeliveriesCount} subtitle="In transport" icon={Truck} color="purple" />
      </div>

      {/* 🏆 Current Best Opportunity Feature Card */}
      {topOpportunity && topOpportunity.bestOption && (
        <div className="glass-card-gold p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider">
              <Award className="w-4 h-4" /> 🏆 Current Best Market Opportunity
            </span>
            <span className="text-xs text-slate-400">
              Crop: <strong className="text-white">{topOpportunity.harvest.cropName}</strong> ({topOpportunity.harvest.availableQuantity} Kg)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-xs text-slate-400">Top Rated Destination</p>
              <h3 className="text-xl font-bold font-heading text-white mt-0.5">
                {topOpportunity.bestOption.destinationName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selling Price: <strong className="text-emerald-400">₹{topOpportunity.bestOption.sellingPrice}/Kg</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Gross Revenue</p>
                <p className="text-sm font-bold text-slate-200">₹{topOpportunity.bestOption.grossRevenue?.toLocaleString('en-IN')}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Est. Transport</p>
                <p className="text-sm font-bold text-rose-400">-₹{topOpportunity.bestOption.estimatedLogisticsCost?.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right border-l border-slate-800 pl-4">
                <p className="text-[10px] uppercase font-bold text-amber-400">Estimated Net Revenue</p>
                <p className="text-xl font-extrabold text-amber-400">
                  ₹{topOpportunity.bestOption.estimatedNetRevenue?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate('/farmer/intelligence', { state: { harvestId: topOpportunity.harvest._id } })}
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                View Full Intelligence Comparison <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Harvests Overview & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvests Preview */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">My Declared Harvests</h3>
            <Link to="/farmer/harvests/new" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5" /> Plan Harvest
            </Link>
          </div>

          <div className="space-y-3">
            {harvests.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No harvests created yet.</p>
            ) : (
              harvests.slice(0, 4).map((h) => (
                <div key={h._id} className="glass-card p-4 rounded-2xl flex items-center justify-between border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">{h.cropName}</h4>
                    <p className="text-xs text-slate-400">
                      Available: <strong className="text-slate-200">{h.availableQuantity} {h.unit}</strong> • Quality: {h.quality}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={h.status} />
                    <button
                      onClick={() => navigate('/farmer/intelligence', { state: { harvestId: h._id } })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      Compare Markets
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sales & Orders Preview */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">Recent Sales & Orders</h3>
            <Link to="/farmer/orders" className="text-xs font-semibold text-slate-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No transactions initiated yet.</p>
            ) : (
              orders.slice(0, 4).map((o) => (
                <div key={o._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{o.cropName} → {o.destinationName}</h4>
                    <p className="text-xs text-slate-400">
                      Qty: {o.quantity} Kg • Agreed Price: ₹{o.agreedPricePerUnit}/Kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-400 mb-1">
                      Net: ₹{o.estimatedNetRevenue?.toLocaleString('en-IN')}
                    </p>
                    <StatusBadge status={o.orderStatus} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
