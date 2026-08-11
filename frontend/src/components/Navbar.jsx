import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, Bell, User, ShieldCheck } from 'lucide-react';
import API from '../services/api';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleColors = {
    FARMER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    BUYER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    DRIVER: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-heading tracking-tight text-white">AgriLink</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Find the Best Market. Calculate the Real Return. Sell Smarter.
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel bg-slate-900 border border-slate-800 p-4 shadow-2xl z-50">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <h4 className="text-sm font-bold font-heading text-white">Notifications</h4>
                      <span className="text-xs text-slate-400">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">No notifications yet</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n._id}
                            className={`p-3 rounded-xl text-xs border ${
                              n.isRead ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-200'
                            }`}
                          >
                            <p className="font-semibold text-slate-200">{n.title}</p>
                            <p className="mt-0.5 text-slate-400">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Role Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleColors[user.role]}`}>
                {user.role}
              </span>

              {/* User Name & Logout */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>

                <button
                  onClick={logoutUser}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
