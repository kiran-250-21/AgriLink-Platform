import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableJobs, acceptDeliveryJob } from '../../services/deliveryApi';
import StatusBadge from '../../components/StatusBadge';
import { Truck, MapPin, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAvailableJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    setAcceptingId(jobId);
    try {
      await acceptDeliveryJob(jobId);
      navigate('/driver/deliveries');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept delivery job.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Available Delivery Jobs</h1>
          <p className="text-xs text-slate-400">Select delivery shipments matching your vehicle capacity and route</p>
        </div>

        <button
          onClick={fetchJobs}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 space-y-2">
            <Truck className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No open delivery jobs available right now.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    Crop Shipment: {job.orderId?.cropName || 'Produce'} ({job.orderId?.quantity || 5000} Kg)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Farmer Pickup: <strong className="text-slate-200">{job.pickupLocation}</strong> • Destination:{' '}
                    <strong className="text-white">{job.dropoffLocation}</strong>
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Distance</p>
                  <p className="font-bold text-slate-200 text-sm mt-0.5">{job.totalDistanceKm} Km</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Farmer Contact</p>
                  <p className="font-semibold text-slate-200 text-sm mt-0.5">{job.farmerId?.name || 'Farmer'}</p>
                  <p className="text-[10px] text-slate-400">📞 {job.farmerId?.phone}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-amber-400">Est. Transport Fare</p>
                  <p className="font-extrabold text-amber-400 text-base mt-0.5">
                    ₹{job.estimatedCost?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleAcceptJob(job._id)}
                  disabled={acceptingId === job._id}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold font-heading text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> {acceptingId === job._id ? 'Accepting...' : 'ACCEPT DELIVERY JOB'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
