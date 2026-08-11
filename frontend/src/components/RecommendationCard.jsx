import React from 'react';
import { Award, ArrowRight, Truck, Store, UserCheck, ShieldCheck } from 'lucide-react';

export default function RecommendationCard({ option, onSelectOption, isSelecting }) {
  const isBest = option.isRecommended || option.rank === 1;

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
        isBest
          ? 'glass-card-gold ring-2 ring-amber-500/50 shadow-2xl shadow-amber-500/10'
          : 'glass-card hover:border-slate-600'
      }`}
    >
      {/* Top Banner / Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isBest ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider shadow-md">
              <Award className="w-4 h-4" /> 🏆 Best Net Return Option
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Rank #{option.rank}
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              option.destinationType === 'MARKET'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}
          >
            {option.destinationType === 'MARKET' ? (
              <>
                <Store className="w-3 h-3" /> Direct APMC Market
              </>
            ) : (
              <>
                <UserCheck className="w-3 h-3" /> Verified Buyer Offer
              </>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Transport Dist.</span>
          <span className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1">
            <Truck className="w-3 h-3 text-slate-400" /> {option.distanceKm} Km
          </span>
        </div>
      </div>

      {/* Destination Title & Offered Price */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold font-heading text-white">{option.destinationName}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Location: {option.location || 'Regional Hub'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Crop Unit Price</div>
          <div className="text-xl font-extrabold font-heading text-emerald-400">
            ₹{option.sellingPrice} <span className="text-xs font-normal text-slate-400">/ Kg</span>
          </div>
        </div>
      </div>

      {/* Financial Net Breakdown Matrix */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Gross Revenue</p>
          <p className="text-base font-bold text-slate-200 mt-0.5">
            ₹{option.grossRevenue ? option.grossRevenue.toLocaleString('en-IN') : '0'}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Est. Logistics</p>
          <p className="text-base font-bold text-rose-400 mt-0.5">
            -₹{option.estimatedLogisticsCost ? option.estimatedLogisticsCost.toLocaleString('en-IN') : '0'}
          </p>
        </div>
        <div className="border-l border-slate-800 pl-3">
          <p className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Estimated Net</p>
          <p className="text-base font-extrabold text-amber-400 mt-0.5">
            ₹{option.estimatedNetRevenue ? option.estimatedNetRevenue.toLocaleString('en-IN') : '0'}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelectOption(option)}
        disabled={isSelecting}
        className={`w-full py-3 px-4 rounded-xl font-bold font-heading text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
          isBest
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
        }`}
      >
        {option.destinationType === 'MARKET' ? (
          <>
            Sell at this Market <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            Submit Offer to Buyer <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
