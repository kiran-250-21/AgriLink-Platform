import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/adminApi';
import StatusBadge from '../../components/StatusBadge';
import { Users, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(roleFilter);
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">User Registry Management</h1>
          <p className="text-xs text-slate-400">View, verify, suspend, or reactivate user accounts across all platform roles</p>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          {['', 'FARMER', 'BUYER', 'DRIVER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                roleFilter === r ? 'bg-purple-500/20 text-purple-300 border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {r || 'ALL USERS'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location / Org</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border bg-slate-800 text-slate-200 border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400">📞 {u.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {u.farmerProfile?.farmLocation || u.buyerProfile?.businessLocation || 'Andhra Pradesh'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {u.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(u._id, 'SUSPENDED')}
                        className="py-1 px-2.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-[11px] font-semibold cursor-pointer"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(u._id, 'ACTIVE')}
                        className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
