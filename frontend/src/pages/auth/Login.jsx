import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      if (user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (user.role === 'BUYER') navigate('/buyer/dashboard');
      else if (user.role === 'DRIVER') navigate('/driver/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl gradient-emerald flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-4">
          <Sprout className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight">AgriLink Platform</h2>
        <p className="mt-2 text-sm text-slate-400">
          Find the Best Market. Calculate the Real Return. Sell Smarter.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="email@agrilink.com or 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">
              One-Click Role Demo Sign-In
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('kiran@farmer.com', 'farmer123')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🌾 Farmer (Kiran)
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ravi@buyer.com', 'buyer123')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🏢 Buyer (Ravi)
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('arun@driver.com', 'driver123')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🚛 Driver (Arun)
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@agrilink.com', 'adminPass123!')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🛡️ Admin Control
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-400 hover:underline">
              Create AgriLink Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
