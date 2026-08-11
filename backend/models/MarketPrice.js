const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      required: true,
      index: true,
    },
    crop: {
      type: String,
      required: true,
      index: true,
    },
    quality: {
      type: String,
      enum: ['GRADE_A', 'GRADE_B', 'GRADE_C'],
      default: 'GRADE_A',
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'Kg',
    },
    source: {
      type: String,
      default: 'APMC Official Feed',
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
