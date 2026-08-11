const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const AuditLog = require('../models/AuditLog');
const { updateDeliveryTimeline } = require('../services/logisticsService');
const { createNotification } = require('../services/notificationService');

// @desc    Get available logistics jobs awaiting driver assignment
// @route   GET /api/deliveries/available
// @access  Private (Driver / Admin)
const getAvailableJobs = async (req, res) => {
  try {
    // Driver query visibility rule: status = LOGISTICS_REQUIRED
    const deliveries = await Delivery.find({ status: 'LOGISTICS_REQUIRED' })
      .populate('orderId')
      .populate('farmerId', 'name phone farmerProfile')
      .populate('buyerId', 'name phone buyerProfile')
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Driver accepts an available delivery job
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Driver only)
const acceptDeliveryJob = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery job not found' });

    if (delivery.status !== 'LOGISTICS_REQUIRED') {
      return res.status(400).json({ message: 'Delivery job has already been assigned or updated' });
    }

    const vehicle = await Vehicle.findOne({ driverId: req.user._id, active: true });

    delivery.driverId = req.user._id;
    if (vehicle) delivery.vehicleId = vehicle._id;

    await updateDeliveryTimeline(delivery._id, 'DRIVER_ASSIGNED', `Assigned to driver ${req.user.name}`);

    // Update parent order status
    await Order.findByIdAndUpdate(delivery.orderId, { orderStatus: 'DRIVER_ASSIGNED' });

    // Notify farmer & buyer
    await createNotification({
      recipientId: delivery.farmerId,
      recipientRole: 'FARMER',
      title: 'Driver Assigned 🚛',
      message: `Driver ${req.user.name} (${req.user.phone}) has accepted your shipment job.`,
      type: 'DRIVER_ASSIGNED',
    });

    if (delivery.buyerId) {
      await createNotification({
        recipientId: delivery.buyerId,
        recipientRole: 'BUYER',
        title: 'Driver Assigned 🚛',
        message: `Driver ${req.user.name} is handling delivery of your order.`,
        type: 'DRIVER_ASSIGNED',
      });
    }

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'DRIVER_ACCEPTED_JOB',
      targetResource: `Delivery:${delivery._id}`,
      details: `Driver ${req.user.name} accepted job for Delivery ${delivery._id}`,
    });

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery state (PICKED_UP, IN_TRANSIT, DELIVERED, COMPLETED)
// @route   PUT /api/deliveries/:id/status
// @access  Private (Assigned Driver / Buyer / Admin)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery record not found' });

    const validStatuses = [
      'PICKUP_SCHEDULED',
      'PICKED_UP',
      'IN_TRANSIT',
      'DELIVERED',
      'BUYER_CONFIRMED',
      'COMPLETED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status state' });
    }

    await updateDeliveryTimeline(delivery._id, status, note || `Status updated to ${status}`);

    // Update associated order status
    let orderState = 'IN_DELIVERY';
    if (status === 'COMPLETED' || status === 'BUYER_CONFIRMED') {
      orderState = 'COMPLETED';
    }
    await Order.findByIdAndUpdate(delivery.orderId, { orderStatus: orderState });

    // Notify farmer & buyer of status change
    await createNotification({
      recipientId: delivery.farmerId,
      recipientRole: 'FARMER',
      title: `Delivery Update: ${status}`,
      message: `Your crop shipment status is now: ${status}`,
      type: 'DELIVERY_UPDATE',
    });

    if (delivery.buyerId) {
      await createNotification({
        recipientId: delivery.buyerId,
        recipientRole: 'BUYER',
        title: `Delivery Update: ${status}`,
        message: `Order delivery status updated to: ${status}`,
        type: 'DELIVERY_UPDATE',
      });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's deliveries (Driver, Farmer, Buyer, or Admin)
// @route   GET /api/deliveries/my
// @access  Private
const getMyDeliveries = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'DRIVER') {
      filter = { driverId: req.user._id };
    } else if (req.user.role === 'FARMER') {
      filter = { farmerId: req.user._id };
    } else if (req.user.role === 'BUYER') {
      filter = { buyerId: req.user._id };
    } else if (req.user.role === 'ADMIN') {
      filter = {};
    }

    const deliveries = await Delivery.find(filter)
      .populate('orderId')
      .populate('farmerId', 'name phone farmerProfile')
      .populate('buyerId', 'name phone buyerProfile')
      .populate('driverId', 'name phone driverProfile')
      .populate('vehicleId')
      .sort({ updatedAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableJobs,
  acceptDeliveryJob,
  updateDeliveryStatus,
  getMyDeliveries,
};
