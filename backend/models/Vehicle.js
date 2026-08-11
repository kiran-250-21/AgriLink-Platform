const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    maxCapacityKg: {
      type: Number,
      required: true,
    },
    ratePerKmPerTon: {
      type: Number,
      default: 12, // Rupees per Km per Ton
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
