const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const generateToken = require('../utils/generateToken');
const AuditLog = require('../models/AuditLog');

// @desc    Register a new user (FARMER, BUYER, DRIVER)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, farmerProfile, buyerProfile, driverProfile, vehicleInfo } = req.body;

    if (role === 'ADMIN') {
      return res.status(403).json({ message: 'Admin registration is restricted. Contact system administrator.' });
    }

    if (!['FARMER', 'BUYER', 'DRIVER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPhone = phone ? phone.trim() : '';

    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: password,
      role,
      farmerProfile: role === 'FARMER' ? farmerProfile : undefined,
      buyerProfile: role === 'BUYER' ? buyerProfile : undefined,
      driverProfile: role === 'DRIVER' ? driverProfile : undefined,
    });

    if (role === 'DRIVER' && vehicleInfo) {
      const vehicle = await Vehicle.create({
        driverId: user._id,
        vehicleType: vehicleInfo.vehicleType || 'Medium Truck 5T',
        registrationNumber: vehicleInfo.registrationNumber || `AP-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
        maxCapacityKg: vehicleInfo.maxCapacityKg || 5000,
        ratePerKmPerTon: vehicleInfo.ratePerKmPerTon || 12,
      });

      user.driverProfile = {
        ...user.driverProfile,
        vehicleId: vehicle._id,
        licenseNumber: driverProfile?.licenseNumber || 'DL-AP-998877',
      };
      await user.save();
    }

    await AuditLog.create({
      userId: user._id,
      userRole: user.role,
      action: 'USER_REGISTERED',
      details: `Registered account as ${user.role}`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Accepts Email or Phone)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const input = (email || '').trim();

    // Query user by either email or phone number
    const user = await User.findOne({
      $or: [
        { email: input.toLowerCase() },
        { phone: input },
        { phone: input.replace(/^\+91\s?/, '') }, // strip +91 prefix if entered
      ],
    });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'SUSPENDED') {
        return res.status(403).json({ message: 'Your account has been suspended by Admin.' });
      }

      await AuditLog.create({
        userId: user._id,
        userRole: user.role,
        action: 'USER_LOGGED_IN',
        details: `Logged into ${user.role} workspace`,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        verificationStatus: user.verificationStatus,
        farmerProfile: user.farmerProfile,
        buyerProfile: user.buyerProfile,
        driverProfile: user.driverProfile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
