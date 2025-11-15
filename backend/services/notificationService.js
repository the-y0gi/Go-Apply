const Notification = require('../models/Notification');


//create notification using some controllers
exports.createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

//  Get user notifications
exports.getUserNotifications = async (userId, limit = 20) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    return {
      notifications,
      unreadCount
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// mark all as read once bell icon open automatic notication are marked
exports.markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    return true;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};