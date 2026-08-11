const express = require('express');
const router = express.Router();
const { analyzeRecommendation } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeRecommendation);

module.exports = router;
