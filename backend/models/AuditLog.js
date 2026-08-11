const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userRole: {
      type: String,
    },
    action: {
      type: String,
      required: true,
    },
    targetResource: {
      type: String,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
