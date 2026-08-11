const express = require('express');
const router = express.Router();
const {
  createHarvest,
  getMyHarvests,
  getAvailableHarvests,
  getHarvestById,
  updateHarvest,
} = require('../controllers/harvestController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', protect, requireRole('FARMER'), createHarvest);
router.get('/my', protect, requireRole('FARMER'), getMyHarvests);
router.get('/available', protect, getAvailableHarvests);
router.get('/:id', protect, getHarvestById);
router.put('/:id', protect, updateHarvest);

module.exports = router;
