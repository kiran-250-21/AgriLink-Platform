const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Market name is required'],
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    district: {
      type: String,
      default: 'Guntur',
    },
    state: {
      type: String,
      default: 'Andhra Pradesh',
    },
    supportedCrops: [{ type: String }],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Market', marketSchema);
