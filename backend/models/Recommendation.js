const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    harvestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Harvest',
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantityAnalyzed: {
      type: Number,
      required: true,
    },
    recommendedOption: {
      destinationName: String,
      destinationType: { type: String, enum: ['MARKET', 'BUYER'] },
      buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' },
      sellingPrice: Number,
      grossRevenue: Number,
      estimatedLogisticsCost: Number,
      estimatedNetRevenue: Number,
      distanceKm: Number,
    },
    allOptions: [
      {
        rank: Number,
        destinationName: String,
        destinationType: { type: String, enum: ['MARKET', 'BUYER'] },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' },
        sellingPrice: Number,
        grossRevenue: Number,
        estimatedLogisticsCost: Number,
        estimatedNetRevenue: Number,
        distanceKm: Number,
        isRecommended: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
