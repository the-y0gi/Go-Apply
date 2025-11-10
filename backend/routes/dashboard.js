const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getDashboardOverview,
  getDashboardDeadlines,
  getDashboardRecommendations
} = require('../controllers/dashboardController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/overview', getDashboardOverview);
router.get('/deadlines', getDashboardDeadlines);
router.get('/recommendations', getDashboardRecommendations);

module.exports = router;