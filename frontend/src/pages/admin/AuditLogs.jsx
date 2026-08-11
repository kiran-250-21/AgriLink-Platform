import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/adminApi';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">System Security & Audit Logs</h1>
          <p className="text-xs text-slate-400">Timestamped ledger of critical admin modifications, price updates, and authentication events</p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Resource</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((l) => (
                <tr key={l._id} className="hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="px-6 py-3 text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-3 font-bold text-white">{l.userId?.name || 'System'}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {l.userRole || 'SYSTEM'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-emerald-400 font-semibold">{l.action}</td>
                  <td className="px-6 py-3 text-slate-400">{l.targetResource || 'N/A'}</td>
                  <td className="px-6 py-3 text-slate-300">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
