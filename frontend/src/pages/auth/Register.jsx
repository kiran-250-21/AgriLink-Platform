import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, Mail, User, Phone, MapPin, Briefcase, ArrowRight } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('FARMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Farmer specific
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('Guntur');

  // Buyer specific
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('Vijayawada');

  // Driver specific
  const [vehicleType, setVehicleType] = useState('Medium Truck 5T');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [maxCapacityKg, setMaxCapacityKg] = useState(5000);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        farmerProfile: role === 'FARMER' ? { farmName, farmLocation } : undefined,
        buyerProfile: role === 'BUYER' ? { businessName, businessLocation } : undefined,
        driverProfile: role === 'DRIVER' ? { licenseNumber: 'DL-AP-NEW' } : undefined,
        vehicleInfo:
          role === 'DRIVER'
            ? {
                vehicleType,
                registrationNumber: registrationNumber || `AP-07-NEW-${Math.floor(1000 + Math.random() * 8999)}`,
                maxCapacityKg: Number(maxCapacityKg),
              }
            : undefined,
      };

      const user = await registerUser(payload);
      if (user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (user.role === 'BUYER') navigate('/buyer/dashboard');
      else if (user.role === 'DRIVER') navigate('/driver/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-white">Join AgriLink Platform</h2>
        <p className="mt-1 text-xs text-slate-400">Select your account role and setup your profile</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'FARMER', label: '🌾 Farmer' },
                  { id: 'BUYER', label: '🏢 Buyer' },
                  { id: 'DRIVER', label: '🚛 Driver' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      role === r.id
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  placeholder="Kiran Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="kiran@agrilink.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>

            {/* Role Profile Specific Fields */}
            {role === 'FARMER' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Farm Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    placeholder="Green Acres"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Farm District/Location</label>
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    placeholder="Guntur"
                  />
                </div>
              </div>
            )}

            {role === 'BUYER' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    placeholder="Agro Trading Co"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Business Location</label>
                  <input
                    type="text"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    placeholder="Vijayawada"
                  />
                </div>
              </div>
            )}

            {role === 'DRIVER' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    <option value="Mini Truck 1.5T">Mini Truck 1.5T</option>
                    <option value="Medium Truck 5T">Medium Truck 5T</option>
                    <option value="Heavy Truck 10T">Heavy Truck 10T</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Max Capacity (Kg)</label>
                  <input
                    type="number"
                    value={maxCapacityKg}
                    onChange={(e) => setMaxCapacityKg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold font-heading text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Register & Enter Workspace'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
