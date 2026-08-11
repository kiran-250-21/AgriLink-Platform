import React, { useState, useEffect } from 'react';
import { getPlatformAnalytics } from '../../services/adminApi';
import StatCard from '../../components/StatCard';
import { BarChart3, TrendingUp, DollarSign, Truck } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPlatformAnalytics().then(setData).catch(console.error);
  }, []);

  const f = data?.financialMetrics || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Platform Performance Analytics</h1>
        <p className="text-xs text-slate-400">Financial throughput, net revenue optimization metrics, and haulage summaries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Volume Trade" value={`${f.totalVolumeKg?.toLocaleString('en-IN') || 0} Kg`} subtitle="Aggregated harvest weight" icon={TrendingUp} color="emerald" />
        <StatCard title="Gross Platform Revenue" value={`₹${f.totalGrossRevenue?.toLocaleString('en-IN') || 0}`} subtitle="Gross trade sum" icon={DollarSign} color="amber" />
        <StatCard title="Total Net Return to Farmers" value={`₹${f.totalNetRevenue?.toLocaleString('en-IN') || 0}`} subtitle="Net revenue delivered" icon={BarChart3} color="purple" />
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="text-lg font-bold font-heading text-white">Value Distribution Summary</h3>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Gross Sales Revenue:</span>
            <span className="font-bold text-white">₹{f.totalGrossRevenue?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="flex justify-between text-rose-400">
            <span>Estimated Transport Costs Deducted:</span>
            <span className="font-bold">-₹{f.totalLogisticsCost?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="flex justify-between text-amber-400 border-t border-slate-800 pt-2 font-bold text-sm">
            <span>Real Estimated Net Farmer Return:</span>
            <span>₹{f.totalNetRevenue?.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
