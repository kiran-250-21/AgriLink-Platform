const Notification = require('../models/Notification');

const createNotification = async ({ recipientId, recipientRole, title, message, type = 'GENERAL' }) => {
  try {
    return await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error('[Notification Error]', error.message);
  }
};

module.exports = { createNotification };
