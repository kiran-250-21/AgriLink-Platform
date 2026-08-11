const mongoose = require('mongoose');

const buyerRequirementSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      index: true,
    },
    requiredQuantity: {
      type: Number,
      required: [true, 'Required quantity is required'],
    },
    offeredPrice: {
      type: Number,
      required: [true, 'Offered price is required'],
    },
    quality: {
      type: String,
      enum: ['GRADE_A', 'GRADE_B', 'GRADE_C'],
      default: 'GRADE_A',
    },
    location: {
      type: String,
      required: true,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'FULFILLED', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BuyerRequirement', buyerRequirementSchema);
