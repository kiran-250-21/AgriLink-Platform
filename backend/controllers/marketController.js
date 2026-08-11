const Market = require('../models/Market');
const MarketPrice = require('../models/MarketPrice');
const AuditLog = require('../models/AuditLog');

// @desc    Get all active markets
// @route   GET /api/markets
// @access  Public
const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find({ active: true });
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new market hub
// @route   POST /api/markets
// @access  Private (Admin only)
const createMarket = async (req, res) => {
  try {
    const { name, location, district, state, supportedCrops } = req.body;

    const marketExists = await Market.findOne({ name });
    if (marketExists) return res.status(400).json({ message: 'Market with this name already exists' });

    const market = await Market.create({
      name,
      location,
      district: district || 'Guntur',
      state: state || 'Andhra Pradesh',
      supportedCrops: supportedCrops || ['Ginger', 'Chilli', 'Turmeric', 'Cotton', 'Paddy'],
    });

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'MARKET_CREATED',
      targetResource: `Market:${market._id}`,
      details: `Created market ${name} at ${location}`,
    });

    res.status(201).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get market prices for all or specific crop/market
// @route   GET /api/markets/prices
// @access  Public
const getMarketPrices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.crop) filter.crop = new RegExp(req.query.crop, 'i');
    if (req.query.marketId) filter.marketId = req.query.marketId;

    const prices = await MarketPrice.find(filter).populate('marketId').sort({ updatedAt: -1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or insert a market price for a crop
// @route   POST /api/markets/prices
// @access  Private (Admin only)
const updateMarketPrice = async (req, res) => {
  try {
    const { marketId, crop, pricePerUnit, quality, unit } = req.body;

    let marketPrice = await MarketPrice.findOne({ marketId, crop, quality: quality || 'GRADE_A' });

    const oldPrice = marketPrice ? marketPrice.pricePerUnit : null;

    if (marketPrice) {
      marketPrice.pricePerUnit = pricePerUnit;
      marketPrice.updatedBy = req.user._id;
      marketPrice.updatedAt = new Date();
      await marketPrice.save();
    } else {
      marketPrice = await MarketPrice.create({
        marketId,
        crop,
        quality: quality || 'GRADE_A',
        pricePerUnit,
        unit: unit || 'Kg',
        updatedBy: req.user._id,
      });
    }

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'MARKET_PRICE_UPDATED',
      targetResource: `MarketPrice:${marketPrice._id}`,
      details: `Updated ${crop} price in market ${marketId}: ₹${oldPrice || 0} -> ₹${pricePerUnit}`,
    });

    res.json(marketPrice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMarkets,
  createMarket,
  getMarketPrices,
  updateMarketPrice,
};
