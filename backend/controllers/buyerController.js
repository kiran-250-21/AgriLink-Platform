const BuyerRequirement = require('../models/BuyerRequirement');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');

// @desc    Publish a new buyer procurement requirement
// @route   POST /api/buyer/requirements
// @access  Private (Buyer only)
const createRequirement = async (req, res) => {
  try {
    const { crop, requiredQuantity, offeredPrice, quality, location, validUntil } = req.body;

    const requirement = await BuyerRequirement.create({
      buyerId: req.user._id,
      crop,
      requiredQuantity,
      offeredPrice,
      quality: quality || 'GRADE_A',
      location: location || req.user.buyerProfile?.businessLocation || 'Vijayawada',
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    });

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'BUYER_REQUIREMENT_CREATED',
      targetResource: `BuyerRequirement:${requirement._id}`,
      details: `Published offer for ${requiredQuantity} Kg ${crop} @ ₹${offeredPrice}/Kg`,
    });

    res.status(201).json(requirement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get authenticated buyer's own published requirements
// @route   GET /api/buyer/requirements/my
// @access  Private (Buyer only)
const getMyRequirements = async (req, res) => {
  try {
    const requirements = await BuyerRequirement.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get incoming sale requests from farmers (Pending Buyer Confirmation)
// @route   GET /api/buyer/sale-requests
// @access  Private (Buyer only)
const getIncomingSaleRequests = async (req, res) => {
  try {
    const requests = await Order.find({
      buyerId: req.user._id,
      orderStatus: 'PENDING_BUYER_CONFIRMATION',
    })
      .populate('farmerId', 'name phone farmerProfile')
      .populate('harvestId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequirement,
  getMyRequirements,
  getIncomingSaleRequests,
};
