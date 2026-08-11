const Order = require('../models/Order');
const Harvest = require('../models/Harvest');
const Delivery = require('../models/Delivery');
const AuditLog = require('../models/AuditLog');
const { calculateDistanceKm, calculateLogisticsCost } = require('../utils/calculations');
const { createNotification } = require('../services/notificationService');

// @desc    Create a sale order (by Farmer choosing destination OR Buyer purchasing from Marketplace)
// @route   POST /api/orders
// @access  Private (Farmer or Buyer)
const createOrder = async (req, res) => {
  try {
    const {
      harvestId,
      destinationType, // 'MARKET' or 'BUYER'
      destinationName,
      buyerId: paramBuyerId,
      marketId,
      quantity,
      agreedPricePerUnit,
      deliveryAddress,
    } = req.body;

    if (!harvestId) {
      return res.status(400).json({ message: 'harvestId is required' });
    }

    const harvest = await Harvest.findById(harvestId);
    if (!harvest) {
      return res.status(404).json({ message: 'Harvest document not found' });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Invalid purchase quantity specified' });
    }

    if (harvest.availableQuantity < qty) {
      return res.status(400).json({ message: `Insufficient harvest stock. Available: ${harvest.availableQuantity} Kg` });
    }

    const price = Number(agreedPricePerUnit) || 50;
    const grossRevenue = Math.round(price * qty);
    const farmLoc = harvest.farmLocation || 'Guntur';

    // PATHWAY 1: Request comes from a logged-in BUYER purchasing directly from marketplace
    if (req.user.role === 'BUYER') {
      const buyerLoc = req.user.buyerProfile?.businessLocation || 'Vijayawada';
      const distance = calculateDistanceKm(farmLoc, buyerLoc);
      const logisticsCost = calculateLogisticsCost(qty, distance);
      const netRevenue = Math.max(0, grossRevenue - logisticsCost);
      const bName = req.user.buyerProfile?.businessName || req.user.name || 'Verified Buyer';

      // Execute atomic inventory deduction
      const updatedHarvest = await Harvest.findOneAndUpdate(
        { _id: harvestId, availableQuantity: { $gte: qty } },
        { $inc: { availableQuantity: -qty } },
        { new: true }
      );

      if (!updatedHarvest) {
        return res.status(400).json({ message: 'Atomic inventory check failed. Quantity no longer available.' });
      }

      if (updatedHarvest.availableQuantity === 0) updatedHarvest.status = 'SOLD_OUT';
      else updatedHarvest.status = 'PARTIALLY_SOLD';
      await updatedHarvest.save();

      const order = await Order.create({
        farmerId: harvest.farmerId,
        buyerId: req.user._id,
        harvestId: harvest._id,
        cropName: harvest.cropName,
        quantity: qty,
        agreedPricePerUnit: price,
        grossRevenue,
        estimatedLogisticsCost: logisticsCost,
        estimatedNetRevenue: netRevenue,
        destinationType: 'BUYER',
        destinationName: `Buyer: ${bName}`,
        deliveryAddress: deliveryAddress || buyerLoc,
        orderStatus: 'LOGISTICS_REQUIRED',
      });

      // Create Delivery document
      const delivery = await Delivery.create({
        orderId: order._id,
        farmerId: harvest.farmerId,
        buyerId: req.user._id,
        pickupLocation: farmLoc,
        dropoffLocation: deliveryAddress || buyerLoc,
        totalDistanceKm: distance,
        estimatedCost: logisticsCost,
        status: 'LOGISTICS_REQUIRED',
        timeline: [{ status: 'LOGISTICS_REQUIRED', note: `Buyer ${bName} confirmed purchase. Awaiting driver.` }],
      });

      order.deliveryId = delivery._id;
      await order.save();

      // Notify farmer
      if (harvest.farmerId) {
        await createNotification({
          recipientId: harvest.farmerId,
          recipientRole: 'FARMER',
          title: 'Crop Purchase Confirmed! 🛒',
          message: `Buyer ${bName} purchased ${qty} Kg of your ${harvest.cropName}! Shipment created.`,
          type: 'BUYER_ACCEPTED',
        });
      }

      await AuditLog.create({
        userId: req.user._id,
        userRole: req.user.role,
        action: 'BUYER_DIRECT_PURCHASE',
        targetResource: `Order:${order._id}`,
        details: `Buyer ${bName} purchased ${qty} Kg ${harvest.cropName} from Farmer`,
      });

      return res.status(201).json(order);
    }

    // PATHWAY 2: Request comes from FARMER choosing a destination
    if (destinationType === 'MARKET') {
      const destName = destinationName || 'APMC Market';
      const dist = req.body.distanceKm || calculateDistanceKm(farmLoc, destName);
      const logisticsCost = req.body.estimatedLogisticsCost || calculateLogisticsCost(qty, dist);
      const netRevenue = req.body.estimatedNetRevenue || Math.max(0, grossRevenue - logisticsCost);

      const updatedHarvest = await Harvest.findOneAndUpdate(
        { _id: harvestId, availableQuantity: { $gte: qty } },
        { $inc: { availableQuantity: -qty } },
        { new: true }
      );

      if (!updatedHarvest) {
        return res.status(400).json({ message: 'Atomic inventory deduction failed.' });
      }

      if (updatedHarvest.availableQuantity === 0) updatedHarvest.status = 'SOLD_OUT';
      else updatedHarvest.status = 'PARTIALLY_SOLD';
      await updatedHarvest.save();

      const order = await Order.create({
        farmerId: req.user._id,
        marketId,
        harvestId,
        cropName: harvest.cropName,
        quantity: qty,
        agreedPricePerUnit: price,
        grossRevenue,
        estimatedLogisticsCost: logisticsCost,
        estimatedNetRevenue: netRevenue,
        destinationType: 'MARKET',
        destinationName: destName,
        deliveryAddress: deliveryAddress || destName,
        orderStatus: 'LOGISTICS_REQUIRED',
      });

      const delivery = await Delivery.create({
        orderId: order._id,
        farmerId: req.user._id,
        pickupLocation: farmLoc,
        dropoffLocation: destName,
        totalDistanceKm: dist,
        estimatedCost: logisticsCost,
        status: 'LOGISTICS_REQUIRED',
        timeline: [{ status: 'LOGISTICS_REQUIRED', note: 'Market destination selected by farmer. Awaiting driver.' }],
      });

      order.deliveryId = delivery._id;
      await order.save();

      await AuditLog.create({
        userId: req.user._id,
        userRole: req.user.role,
        action: 'ORDER_CREATED_MARKET',
        targetResource: `Order:${order._id}`,
        details: `Created direct market order for ${qty} Kg ${harvest.cropName} to ${destName}`,
      });

      return res.status(201).json(order);
    } else {
      // Farmer selects Buyer offer
      const destName = destinationName || 'Buyer Offer';
      const dist = req.body.distanceKm || calculateDistanceKm(farmLoc, destName);
      const logisticsCost = req.body.estimatedLogisticsCost || calculateLogisticsCost(qty, dist);
      const netRevenue = req.body.estimatedNetRevenue || Math.max(0, grossRevenue - logisticsCost);

      const order = await Order.create({
        farmerId: req.user._id,
        buyerId: paramBuyerId,
        harvestId,
        cropName: harvest.cropName,
        quantity: qty,
        agreedPricePerUnit: price,
        grossRevenue,
        estimatedLogisticsCost: logisticsCost,
        estimatedNetRevenue: netRevenue,
        destinationType: 'BUYER',
        destinationName: destName,
        deliveryAddress: deliveryAddress || destName,
        orderStatus: 'PENDING_BUYER_CONFIRMATION',
      });

      if (paramBuyerId) {
        await createNotification({
          recipientId: paramBuyerId,
          recipientRole: 'BUYER',
          title: 'New Crop Sale Request',
          message: `Farmer ${req.user.name} wants to sell ${qty} Kg ${harvest.cropName} @ ₹${price}/Kg`,
          type: 'SALE_REQUEST',
        });
      }

      await AuditLog.create({
        userId: req.user._id,
        userRole: req.user.role,
        action: 'ORDER_CREATED_BUYER_INTENT',
        targetResource: `Order:${order._id}`,
        details: `Submitted sale intent to ${destName} for ${qty} Kg ${harvest.cropName}`,
      });

      return res.status(201).json(order);
    }
  } catch (error) {
    console.error('[createOrder Error]', error);
    res.status(500).json({ message: error.message || 'Server error processing order' });
  }
};

// @desc    Buyer responds (Accept/Reject) to farmer sale intent
// @route   PUT /api/orders/:id/respond
// @access  Private (Buyer only)
const respondToSaleRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to respond to this order' });
    }

    if (order.orderStatus !== 'PENDING_BUYER_CONFIRMATION') {
      return res.status(400).json({ message: `Order cannot be responded to in status ${order.orderStatus}` });
    }

    if (action === 'REJECT') {
      order.orderStatus = 'REJECTED';
      await order.save();

      await createNotification({
        recipientId: order.farmerId,
        recipientRole: 'FARMER',
        title: 'Sale Request Declined',
        message: `Buyer declined your sale request for ${order.quantity} Kg ${order.cropName}`,
        type: 'SALE_REQUEST',
      });

      return res.json({ message: 'Sale request rejected', order });
    }

    if (action === 'ACCEPT') {
      const harvest = await Harvest.findOneAndUpdate(
        { _id: order.harvestId, availableQuantity: { $gte: order.quantity } },
        { $inc: { availableQuantity: -order.quantity } },
        { new: true }
      );

      if (!harvest) {
        order.orderStatus = 'REJECTED';
        await order.save();
        return res.status(400).json({
          message: 'Order acceptance failed: Harvest inventory is no longer sufficient.',
        });
      }

      if (harvest.availableQuantity === 0) harvest.status = 'SOLD_OUT';
      else harvest.status = 'PARTIALLY_SOLD';
      await harvest.save();

      const delivery = await Delivery.create({
        orderId: order._id,
        farmerId: order.farmerId,
        buyerId: req.user._id,
        pickupLocation: harvest.farmLocation || 'Farm',
        dropoffLocation: order.deliveryAddress,
        totalDistanceKm: 30,
        estimatedCost: order.estimatedLogisticsCost,
        status: 'LOGISTICS_REQUIRED',
        timeline: [{ status: 'LOGISTICS_REQUIRED', note: 'Buyer accepted offer. Awaiting driver assignment.' }],
      });

      order.deliveryId = delivery._id;
      order.orderStatus = 'LOGISTICS_REQUIRED';
      await order.save();

      await createNotification({
        recipientId: order.farmerId,
        recipientRole: 'FARMER',
        title: 'Sale Request Accepted! 🏆',
        message: `Buyer accepted your ${order.quantity} Kg ${order.cropName} sale! Driver dispatch in progress.`,
        type: 'BUYER_ACCEPTED',
      });

      await AuditLog.create({
        userId: req.user._id,
        userRole: req.user.role,
        action: 'BUYER_ACCEPTED_ORDER',
        targetResource: `Order:${order._id}`,
        details: `Buyer accepted order for ${order.quantity} Kg ${order.cropName}`,
      });

      return res.json({ message: 'Sale request accepted and delivery created', order, delivery });
    }

    res.status(400).json({ message: 'Invalid action parameter' });
  } catch (error) {
    console.error('[respondToSaleRequest Error]', error);
    res.status(500).json({ message: error.message || 'Server error responding to order' });
  }
};

// @desc    Get user's orders (Farmer, Buyer, or Admin)
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'FARMER') {
      filter = { farmerId: req.user._id };
    } else if (req.user.role === 'BUYER') {
      filter = { buyerId: req.user._id };
    } else if (req.user.role === 'ADMIN') {
      filter = {};
    }

    const orders = await Order.find(filter)
      .populate('farmerId', 'name phone farmerProfile')
      .populate('buyerId', 'name phone buyerProfile')
      .populate('harvestId')
      .populate('deliveryId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  respondToSaleRequest,
  getMyOrders,
};
