import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Truck, Tag, ShieldCheck } from 'lucide-react';

export default function VehicleSetup() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Vehicle Specifications</h1>
        <p className="text-xs text-slate-400">Registered logistics transport vehicle details for automated job matching</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Registered Haulage Vehicle</h3>
            <p className="text-xs text-slate-400">Status: <strong className="text-emerald-400">Active for Dispatch</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-slate-400">License Number</p>
            <p className="text-sm font-bold text-white mt-1">{user?.driverProfile?.licenseNumber || 'AP-07-DL-55'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-slate-400">Vehicle Capacity</p>
            <p className="text-sm font-bold text-amber-400 mt-1">Up to 6,000 Kg (6 Tons)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-slate-400">Base Transport Tariff</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">₹12 / Km / Ton</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-slate-400">Service Coverage Hubs</p>
            <p className="text-sm font-bold text-slate-200 mt-1">Guntur, Vijayawada, Tenali, Kurnool</p>
          </div>
        </div>
      </div>
    </div>
  );
}
