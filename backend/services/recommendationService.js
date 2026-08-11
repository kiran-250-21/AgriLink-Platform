const Harvest = require('../models/Harvest');
const Market = require('../models/Market');
const MarketPrice = require('../models/MarketPrice');
const BuyerRequirement = require('../models/BuyerRequirement');
const Recommendation = require('../models/Recommendation');
const { calculateNetRevenue, calculateDistanceKm } = require('../utils/calculations');

/**
 * AgriLink Core Recommendation Engine
 * Analyzes market prices and buyer offers for a specific harvest,
 * subtracts estimated logistics costs, and ranks options by Estimated Net Revenue.
 */
const analyzeHarvestOptions = async (harvestId, requestedQuantity) => {
  const harvest = await Harvest.findById(harvestId);
  if (!harvest) throw new Error('Harvest not found');

  const qty = Number(requestedQuantity) || harvest.availableQuantity;
  const farmLoc = harvest.farmLocation || 'Guntur';
  const crop = harvest.cropName;

  const options = [];

  // Case-insensitive regex for crop matching
  const cropRegex = new RegExp(`^${crop.trim()}$`, 'i');

  // 1. Fetch official Market Prices for this crop (case-insensitive)
  const marketPrices = await MarketPrice.find({ crop: cropRegex }).populate('marketId');
  
  for (const mp of marketPrices) {
    if (mp.marketId && mp.marketId.active) {
      const distance = calculateDistanceKm(farmLoc, mp.marketId.location);
      const metrics = calculateNetRevenue(mp.pricePerUnit, qty, distance);

      options.push({
        destinationName: mp.marketId.name,
        destinationType: 'MARKET',
        marketId: mp.marketId._id,
        location: mp.marketId.location,
        sellingPrice: mp.pricePerUnit,
        grossRevenue: metrics.grossRevenue,
        estimatedLogisticsCost: metrics.estimatedLogisticsCost,
        estimatedNetRevenue: metrics.estimatedNetRevenue,
        distanceKm: distance,
      });
    }
  }

  // Also include all active markets with regional pricing if not already included
  const existingMarketIds = options.map(o => o.marketId ? o.marketId.toString() : '');
  const allMarkets = await Market.find({ active: true });

  for (const m of allMarkets) {
    if (!existingMarketIds.includes(m._id.toString())) {
      const distance = calculateDistanceKm(farmLoc, m.location);
      // Fallback base price based on crop type
      let fallbackPrice = 50;
      if (/chilli/i.test(crop)) fallbackPrice = 180;
      else if (/turmeric/i.test(crop)) fallbackPrice = 120;
      else if (/cotton/i.test(crop)) fallbackPrice = 70;
      else if (/paddy/i.test(crop)) fallbackPrice = 30;

      const metrics = calculateNetRevenue(fallbackPrice, qty, distance);

      options.push({
        destinationName: m.name,
        destinationType: 'MARKET',
        marketId: m._id,
        location: m.location,
        sellingPrice: fallbackPrice,
        grossRevenue: metrics.grossRevenue,
        estimatedLogisticsCost: metrics.estimatedLogisticsCost,
        estimatedNetRevenue: metrics.estimatedNetRevenue,
        distanceKm: distance,
      });
    }
  }

  // 2. Fetch active Buyer Requirements for this crop (case-insensitive)
  const buyerReqs = await BuyerRequirement.find({
    crop: cropRegex,
    status: 'ACTIVE',
    validUntil: { $gte: new Date() },
  }).populate('buyerId', 'name buyerProfile status');

  for (const br of buyerReqs) {
    if (br.buyerId && br.buyerId.status === 'ACTIVE') {
      const buyerLoc = br.location || br.buyerId.buyerProfile?.businessLocation || 'Vijayawada';
      const distance = calculateDistanceKm(farmLoc, buyerLoc);
      const metrics = calculateNetRevenue(br.offeredPrice, qty, distance);
      const buyerName = br.buyerId.buyerProfile?.businessName || br.buyerId.name || 'Verified Buyer';

      options.push({
        destinationName: `Buyer: ${buyerName}`,
        destinationType: 'BUYER',
        buyerId: br.buyerId._id,
        requirementId: br._id,
        location: buyerLoc,
        sellingPrice: br.offeredPrice,
        grossRevenue: metrics.grossRevenue,
        estimatedLogisticsCost: metrics.estimatedLogisticsCost,
        estimatedNetRevenue: metrics.estimatedNetRevenue,
        distanceKm: distance,
      });
    }
  }

  // 3. Sort options DESCENDING by Estimated Net Revenue
  options.sort((a, b) => b.estimatedNetRevenue - a.estimatedNetRevenue);

  // Assign ranks and recommendation flags
  const rankedOptions = options.map((opt, index) => ({
    ...opt,
    rank: index + 1,
    isRecommended: index === 0,
  }));

  const bestOption = rankedOptions.length > 0 ? rankedOptions[0] : null;

  // Persist Recommendation in database
  const recommendationDoc = await Recommendation.create({
    harvestId: harvest._id,
    farmerId: harvest.farmerId,
    quantityAnalyzed: qty,
    recommendedOption: bestOption,
    allOptions: rankedOptions,
  });

  return {
    harvest: {
      id: harvest._id,
      cropName: harvest.cropName,
      availableQuantity: harvest.availableQuantity,
      farmLocation: harvest.farmLocation,
      quality: harvest.quality,
    },
    quantityAnalyzed: qty,
    recommendedOption: bestOption,
    allOptions: rankedOptions,
    recommendationId: recommendationDoc._id,
  };
};

module.exports = { analyzeHarvestOptions };
