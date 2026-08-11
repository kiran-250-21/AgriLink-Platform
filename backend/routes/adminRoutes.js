const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getPlatformAnalytics,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/users', protect, requireRole('ADMIN'), getAllUsers);
router.put('/users/:id/status', protect, requireRole('ADMIN'), updateUserStatus);
router.get('/analytics', protect, requireRole('ADMIN'), getPlatformAnalytics);
router.get('/audit-logs', protect, requireRole('ADMIN'), getAuditLogs);

module.exports = router;
