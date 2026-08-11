const User = require('../models/User');
const Harvest = require('../models/Harvest');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Market = require('../models/Market');
const AuditLog = require('../models/AuditLog');

// @desc    Get all registered users across roles
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user account status or verification
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { status, verificationStatus } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (status) user.status = status;
    if (verificationStatus) user.verificationStatus = verificationStatus;

    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'ADMIN_USER_STATUS_CHANGE',
      targetResource: `User:${user._id}`,
      details: `Changed ${user.name} (${user.email}) status to ${status || user.status}`,
    });

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform-wide analytics and performance metrics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'FARMER' });
    const totalBuyers = await User.countDocuments({ role: 'BUYER' });
    const totalDrivers = await User.countDocuments({ role: 'DRIVER' });

    const activeHarvests = await Harvest.countDocuments({ status: 'AVAILABLE' });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'COMPLETED' });
    const activeDeliveries = await Delivery.countDocuments({
      status: { $in: ['LOGISTICS_REQUIRED', 'DRIVER_ASSIGNED', 'IN_TRANSIT'] },
    });
    const totalMarkets = await Market.countDocuments({ active: true });

    // Financial volume aggregate
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalGrossRevenue: { $sum: '$grossRevenue' },
          totalLogisticsCost: { $sum: '$estimatedLogisticsCost' },
          totalNetRevenue: { $sum: '$estimatedNetRevenue' },
          totalVolumeKg: { $sum: '$quantity' },
        },
      },
    ]);

    const financialMetrics = revenueStats.length > 0 ? revenueStats[0] : {
      totalGrossRevenue: 0,
      totalLogisticsCost: 0,
      totalNetRevenue: 0,
      totalVolumeKg: 0,
    };

    res.json({
      userStats: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalDrivers,
      },
      marketplaceStats: {
        activeHarvests,
        totalOrders,
        completedOrders,
        activeDeliveries,
        totalMarkets,
      },
      financialMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name role email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  getPlatformAnalytics,
  getAuditLogs,
};
