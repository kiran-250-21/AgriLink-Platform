const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: 'Spices',
    },
    expectedQuantity: {
      type: Number,
      required: [true, 'Expected quantity is required'],
      min: [1, 'Quantity must be positive'],
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'Kg',
    },
    quality: {
      type: String,
      enum: ['GRADE_A', 'GRADE_B', 'GRADE_C'],
      default: 'GRADE_A',
    },
    farmLocation: {
      type: String,
      required: [true, 'Farm location is required'],
    },
    expectedHarvestDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'READY', 'AVAILABLE', 'PARTIALLY_SOLD', 'SOLD_OUT', 'CANCELLED', 'EXPIRED'],
      default: 'AVAILABLE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Harvest', harvestSchema);
