const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAllAsRead
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.post('/mark-all-read', markAllAsRead);

module.exports = router;