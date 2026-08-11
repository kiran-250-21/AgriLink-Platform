require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Harvest = require('../models/Harvest');
const Market = require('../models/Market');
const MarketPrice = require('../models/MarketPrice');
const BuyerRequirement = require('../models/BuyerRequirement');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const seedCoreData = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount > 0) {
      console.log('[Seed Engine] Database already populated with records.');
      return;
    }

    console.log('[Seed Engine] Seeding initial SDE platform database records...');
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@agrilink.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPass123!';

    const admin = await User.create({
      name: 'System Admin',
      email: adminEmail,
      phone: '9900000000',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
    });

    const farmer1 = await User.create({
      name: 'Kiran Farmer',
      email: 'kiran@farmer.com',
      phone: '9876543210',
      passwordHash: 'farmer123',
      role: 'FARMER',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      farmerProfile: {
        farmName: 'Kiran Spices Estate',
        farmLocation: 'Guntur',
        village: 'Pedakakani',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        pincode: '522509',
        farmSize: 12,
        primaryCrops: ['Ginger', 'Chilli', 'Turmeric'],
      },
    });

    const farmer2 = await User.create({
      name: 'Ramesh Farmer',
      email: 'ramesh@farmer.com',
      phone: '9876543211',
      passwordHash: 'farmer123',
      role: 'FARMER',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      farmerProfile: {
        farmName: 'Ramesh Green Fields',
        farmLocation: 'Tenali',
        village: 'Angalakuduru',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        pincode: '522201',
        farmSize: 8,
        primaryCrops: ['Turmeric', 'Paddy'],
      },
    });

    const buyer1 = await User.create({
      name: 'Ravi Wholesalers',
      email: 'ravi@buyer.com',
      phone: '9123456780',
      passwordHash: 'buyer123',
      role: 'BUYER',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      buyerProfile: {
        businessName: 'Ravi Agro Trading Co.',
        businessType: 'Wholesaler',
        businessLocation: 'Vijayawada',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        pincode: '520001',
        gstNumber: '37AAAAA0000A1Z5',
        preferredCrops: ['Ginger', 'Turmeric', 'Chilli'],
      },
    });

    const buyer2 = await User.create({
      name: 'Sita Processors',
      email: 'sita@buyer.com',
      phone: '9123456781',
      passwordHash: 'buyer123',
      role: 'BUYER',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      buyerProfile: {
        businessName: 'Sita Spice Mills Ltd',
        businessType: 'Processor',
        businessLocation: 'Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        pincode: '522001',
        gstNumber: '37BBBBB1111B2Z6',
        preferredCrops: ['Chilli', 'Spices'],
      },
    });

    const driver1 = await User.create({
      name: 'Arun Driver',
      email: 'arun@driver.com',
      phone: '9555112233',
      passwordHash: 'driver123',
      role: 'DRIVER',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      driverProfile: {
        licenseNumber: 'AP07-2022-009988',
        serviceAreas: ['Guntur', 'Vijayawada', 'Tenali', 'Kurnool'],
      },
    });

    const vehicle1 = await Vehicle.create({
      driverId: driver1._id,
      vehicleType: 'Medium Truck 5T',
      registrationNumber: 'AP-07-TJ-5544',
      maxCapacityKg: 6000,
      ratePerKmPerTon: 12,
      active: true,
    });

    driver1.driverProfile.vehicleId = vehicle1._id;
    await driver1.save();

    console.log('[Seed Engine] Creating Regional Markets...');
    const marketGuntur = await Market.create({
      name: 'Guntur APMC Market',
      location: 'Guntur',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      supportedCrops: ['Ginger', 'Chilli', 'Turmeric', 'Cotton', 'Paddy'],
    });

    const marketVijayawada = await Market.create({
      name: 'Vijayawada Wholesale Hub',
      location: 'Vijayawada',
      district: 'Krishna',
      state: 'Andhra Pradesh',
      supportedCrops: ['Ginger', 'Chilli', 'Turmeric', 'Fruits'],
    });

    const marketTenali = await Market.create({
      name: 'Tenali Agricultural Yard',
      location: 'Tenali',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      supportedCrops: ['Turmeric', 'Paddy', 'Ginger'],
    });

    const marketKurnool = await Market.create({
      name: 'Kurnool Commercial APMC',
      location: 'Kurnool',
      district: 'Kurnool',
      state: 'Andhra Pradesh',
      supportedCrops: ['Ginger', 'Chilli', 'Cotton'],
    });

    console.log('[Seed Engine] Seeding Live Market Prices...');
    await MarketPrice.create([
      { marketId: marketGuntur._id, crop: 'Ginger', quality: 'GRADE_A', pricePerUnit: 50, updatedBy: admin._id },
      { marketId: marketGuntur._id, crop: 'Chilli', quality: 'GRADE_A', pricePerUnit: 180, updatedBy: admin._id },
      { marketId: marketGuntur._id, crop: 'Turmeric', quality: 'GRADE_A', pricePerUnit: 120, updatedBy: admin._id },
      { marketId: marketVijayawada._id, crop: 'Ginger', quality: 'GRADE_A', pricePerUnit: 51, updatedBy: admin._id },
      { marketId: marketVijayawada._id, crop: 'Chilli', quality: 'GRADE_A', pricePerUnit: 185, updatedBy: admin._id },
      { marketId: marketVijayawada._id, crop: 'Turmeric', quality: 'GRADE_A', pricePerUnit: 122, updatedBy: admin._id },
      { marketId: marketTenali._id, crop: 'Ginger', quality: 'GRADE_A', pricePerUnit: 48, updatedBy: admin._id },
      { marketId: marketTenali._id, crop: 'Turmeric', quality: 'GRADE_A', pricePerUnit: 118, updatedBy: admin._id },
      { marketId: marketKurnool._id, crop: 'Ginger', quality: 'GRADE_A', pricePerUnit: 55, updatedBy: admin._id },
      { marketId: marketKurnool._id, crop: 'Chilli', quality: 'GRADE_A', pricePerUnit: 190, updatedBy: admin._id },
    ]);

    console.log('[Seed Engine] Creating Buyer Requirement Offers...');
    await BuyerRequirement.create([
      {
        buyerId: buyer1._id,
        crop: 'Ginger',
        requiredQuantity: 5000,
        offeredPrice: 52,
        quality: 'GRADE_A',
        location: 'Vijayawada',
        status: 'ACTIVE',
      },
      {
        buyerId: buyer2._id,
        crop: 'Chilli',
        requiredQuantity: 2000,
        offeredPrice: 188,
        quality: 'GRADE_A',
        location: 'Guntur',
        status: 'ACTIVE',
      },
      {
        buyerId: buyer1._id,
        crop: 'Turmeric',
        requiredQuantity: 3000,
        offeredPrice: 125,
        quality: 'GRADE_A',
        location: 'Vijayawada',
        status: 'ACTIVE',
      },
    ]);

    console.log('[Seed Engine] Creating Sample Farmer Harvests...');
    await Harvest.create({
      farmerId: farmer1._id,
      cropName: 'Ginger',
      category: 'Spices',
      expectedQuantity: 5000,
      availableQuantity: 5000,
      unit: 'Kg',
      quality: 'GRADE_A',
      farmLocation: 'Guntur',
      status: 'AVAILABLE',
    });

    await Harvest.create({
      farmerId: farmer1._id,
      cropName: 'Chilli',
      category: 'Spices',
      expectedQuantity: 2000,
      availableQuantity: 2000,
      unit: 'Kg',
      quality: 'GRADE_A',
      farmLocation: 'Guntur',
      status: 'AVAILABLE',
    });

    await Harvest.create({
      farmerId: farmer2._id,
      cropName: 'Turmeric',
      category: 'Spices',
      expectedQuantity: 3000,
      availableQuantity: 3000,
      unit: 'Kg',
      quality: 'GRADE_A',
      farmLocation: 'Tenali',
      status: 'AVAILABLE',
    });

    console.log('[Seed Engine] Seeding Audit Log entry...');
    await AuditLog.create({
      userId: admin._id,
      userRole: 'ADMIN',
      action: 'DATABASE_SEEDED',
      details: 'Populated initial SDE startup database records cleanly.',
    });

    console.log('---------------------------------------------------------');
    console.log('✅ AgriLink Database Seeded Successfully!');
    console.log(`Admin User:   ${adminEmail}  /  ${adminPassword}`);
    console.log('Farmer User:  kiran@farmer.com  /  farmer123');
    console.log('Buyer User:   ravi@buyer.com   /  buyer123');
    console.log('Driver User:  arun@driver.com  /  driver123');
    console.log('---------------------------------------------------------');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

module.exports = { seedCoreData };

// If executed directly from CLI: node utils/seedData.js
if (require.main === module) {
  const runCliSeed = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrilink';
    console.log(`[Seed Script] Connecting to ${mongoUri}...`);
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    } catch (err) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
    }
    await seedCoreData();
    process.exit(0);
  };
  runCliSeed();
}
