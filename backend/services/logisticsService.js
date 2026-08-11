const Vehicle = require('../models/Vehicle');
const Delivery = require('../models/Delivery');

/**
 * Finds eligible vehicles/drivers for a delivery of given quantity
 */
const findEligibleDrivers = async (quantityKg) => {
  const vehicles = await Vehicle.find({
    active: true,
    maxCapacityKg: { $gte: quantityKg },
  }).populate('driverId', 'name phone status');

  return vehicles.filter(v => v.driverId && v.driverId.status === 'ACTIVE');
};

/**
 * Updates delivery status and appends timeline log
 */
const updateDeliveryTimeline = async (deliveryId, status, note = '') => {
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) throw new Error('Delivery document not found');

  delivery.status = status;
  delivery.timeline.push({
    status,
    timestamp: new Date(),
    note,
  });

  await delivery.save();
  return delivery;
};

module.exports = {
  findEligibleDrivers,
  updateDeliveryTimeline,
};
