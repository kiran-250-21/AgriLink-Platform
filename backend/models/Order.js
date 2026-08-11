const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
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
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      index: true,
    },
    harvestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Harvest',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    agreedPricePerUnit: {
      type: Number,
      required: true,
    },
    grossRevenue: {
      type: Number,
      required: true,
    },
    estimatedLogisticsCost: {
      type: Number,
      required: true,
    },
    estimatedNetRevenue: {
      type: Number,
      required: true,
    },
    destinationType: {
      type: String,
      enum: ['MARKET', 'BUYER'],
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'PENDING_BUYER_CONFIRMATION',
        'BUYER_ACCEPTED',
        'REJECTED',
        'LOGISTICS_REQUIRED',
        'DRIVER_ASSIGNED',
        'IN_DELIVERY',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING_BUYER_CONFIRMATION',
      index: true,
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
