const express = require('express');
const router = express.Router();
const {
  createRequirement,
  getMyRequirements,
  getIncomingSaleRequests,
} = require('../controllers/buyerController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/requirements', protect, requireRole('BUYER'), createRequirement);
router.get('/requirements/my', protect, requireRole('BUYER'), getMyRequirements);
router.get('/sale-requests', protect, requireRole('BUYER'), getIncomingSaleRequests);

module.exports = router;
