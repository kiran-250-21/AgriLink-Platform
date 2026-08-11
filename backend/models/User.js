const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['FARMER', 'BUYER', 'DRIVER', 'ADMIN'],
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
      default: 'ACTIVE',
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'UNVERIFIED', 'PENDING'],
      default: 'VERIFIED',
    },
    farmerProfile: {
      farmName: { type: String, default: '' },
      farmLocation: { type: String, default: 'Guntur' },
      village: { type: String, default: '' },
      district: { type: String, default: 'Guntur' },
      state: { type: String, default: 'Andhra Pradesh' },
      pincode: { type: String, default: '' },
      farmSize: { type: Number, default: 5 }, // acres
      primaryCrops: [{ type: String }],
    },
    buyerProfile: {
      businessName: { type: String, default: '' },
      businessType: { type: String, default: 'Wholesaler' }, // Wholesaler, Processor, Retailer, Exporter
      businessLocation: { type: String, default: 'Vijayawada' },
      district: { type: String, default: 'Krishna' },
      state: { type: String, default: 'Andhra Pradesh' },
      pincode: { type: String, default: '' },
      gstNumber: { type: String, default: '' },
      preferredCrops: [{ type: String }],
    },
    driverProfile: {
      licenseNumber: { type: String, default: '' },
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
      serviceAreas: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  if (!this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
});

module.exports = mongoose.model('User', userSchema);
