import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colorMap = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
  };

  const style = colorMap[color] || colorMap.emerald;

  return (
    <div className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${style}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-heading text-white">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/50`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
