const express = require('express');
const router = express.Router();
const {
  getAllMarkets,
  createMarket,
  getMarketPrices,
  updateMarketPrice,
} = require('../controllers/marketController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', getAllMarkets);
router.post('/', protect, requireRole('ADMIN'), createMarket);
router.get('/prices', getMarketPrices);
router.post('/prices', protect, requireRole('ADMIN'), updateMarketPrice);

module.exports = router;
