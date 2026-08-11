const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
    totalDistanceKm: {
      type: Number,
      required: true,
    },
    estimatedCost: {
      type: Number,
      required: true,
    },
    actualCost: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        'LOGISTICS_REQUIRED',
        'DRIVER_ASSIGNED',
        'PICKUP_SCHEDULED',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'BUYER_CONFIRMED',
        'COMPLETED',
      ],
      default: 'LOGISTICS_REQUIRED',
      index: true,
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Delivery', deliverySchema);
