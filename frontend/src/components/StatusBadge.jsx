import React from 'react';

const STATUS_CONFIG = {
  // Harvest Statuses
  AVAILABLE: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Available' },
  PARTIALLY_SOLD: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', label: 'Partially Sold' },
  SOLD_OUT: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'Sold Out' },

  // Order Statuses
  PENDING_BUYER_CONFIRMATION: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Pending Buyer Confirmation' },
  BUYER_ACCEPTED: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'Buyer Accepted' },
  REJECTED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Rejected' },
  LOGISTICS_REQUIRED: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', label: 'Logistics Required' },
  DRIVER_ASSIGNED: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', label: 'Driver Assigned' },
  IN_DELIVERY: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: 'In Delivery' },
  COMPLETED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Completed' },

  // Delivery Statuses
  PICKUP_SCHEDULED: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', label: 'Pickup Scheduled' },
  PICKED_UP: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'Picked Up' },
  IN_TRANSIT: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: 'In Transit' },
  DELIVERED: { bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30', label: 'Delivered' },

  // Account Statuses
  ACTIVE: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Active' },
  SUSPENDED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Suspended' },
  VERIFIED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Verified' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {config.label}
    </span>
  );
}
