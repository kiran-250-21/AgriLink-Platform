const Harvest = require('../models/Harvest');
const AuditLog = require('../models/AuditLog');

// @desc    Create new harvest declaration
// @route   POST /api/harvests
// @access  Private (Farmer only)
const createHarvest = async (req, res) => {
  try {
    const { cropName, category, expectedQuantity, availableQuantity, unit, quality, farmLocation, expectedHarvestDate } = req.body;

    const qty = availableQuantity !== undefined ? availableQuantity : expectedQuantity;

    const harvest = await Harvest.create({
      farmerId: req.user._id,
      cropName,
      category: category || 'Spices',
      expectedQuantity,
      availableQuantity: qty,
      unit: unit || 'Kg',
      quality: quality || 'GRADE_A',
      farmLocation: farmLocation || req.user.farmerProfile?.farmLocation || 'Guntur',
      expectedHarvestDate: expectedHarvestDate || new Date(),
      status: 'AVAILABLE',
    });

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'HARVEST_CREATED',
      targetResource: `Harvest:${harvest._id}`,
      details: `Created harvest for ${qty} Kg ${cropName}`,
    });

    res.status(201).json(harvest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get authenticated farmer's own harvests
// @route   GET /api/harvests/my
// @access  Private (Farmer only)
const getMyHarvests = async (req, res) => {
  try {
    // Explicit RBAC isolation rule: farmerId MUST equal loggedInUser.id
    const harvests = await Harvest.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(harvests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available harvests across all farmers (Global Buyer Marketplace)
// @route   GET /api/harvests/available
// @access  Private (Buyer / Admin / Driver)
const getAvailableHarvests = async (req, res) => {
  try {
    // Global Buyer Marketplace query: status AVAILABLE and availableQuantity > 0 (NO buyer ID filtering)
    const filter = {
      status: 'AVAILABLE',
      availableQuantity: { $gt: 0 },
    };

    if (req.query.crop) {
      filter.cropName = new RegExp(req.query.crop, 'i');
    }

    const harvests = await Harvest.find(filter)
      .populate('farmerId', 'name farmerProfile phone')
      .sort({ createdAt: -1 });

    res.json(harvests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single harvest by ID
// @route   GET /api/harvests/:id
// @access  Private
const getHarvestById = async (req, res) => {
  try {
    const harvest = await Harvest.findById(req.params.id).populate('farmerId', 'name phone farmerProfile');
    if (!harvest) return res.status(404).json({ message: 'Harvest not found' });
    res.json(harvest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update harvest status or details
// @route   PUT /api/harvests/:id
// @access  Private (Farmer owner or Admin)
const updateHarvest = async (req, res) => {
  try {
    const harvest = await Harvest.findById(req.params.id);
    if (!harvest) return res.status(404).json({ message: 'Harvest not found' });

    if (harvest.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to edit this harvest' });
    }

    Object.assign(harvest, req.body);
    const updatedHarvest = await harvest.save();

    res.json(updatedHarvest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHarvest,
  getMyHarvests,
  getAvailableHarvests,
  getHarvestById,
  updateHarvest,
};
