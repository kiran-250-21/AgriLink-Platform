const express = require('express');
const router = express.Router();
const {
  getAvailableJobs,
  acceptDeliveryJob,
  updateDeliveryStatus,
  getMyDeliveries,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/available', protect, requireRole('DRIVER', 'ADMIN'), getAvailableJobs);
router.put('/:id/accept', protect, requireRole('DRIVER'), acceptDeliveryJob);
router.put('/:id/status', protect, updateDeliveryStatus);
router.get('/my', protect, getMyDeliveries);

module.exports = router;
