const express = require('express');
const router = express.Router();
const {
  createOrder,
  respondToSaleRequest,
  getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', protect, requireRole('FARMER', 'BUYER'), createOrder);
router.put('/:id/respond', protect, requireRole('BUYER', 'ADMIN'), respondToSaleRequest);
router.get('/my', protect, getMyOrders);

module.exports = router;
