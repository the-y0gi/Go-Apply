const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getDashboardProgress,
  getUserApplications,
  getUserDocuments,
  getDocumentStats
} = require('../controllers/dashboardController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard routes
router.get("/progress", getDashboardProgress);
router.get("/applications", getUserApplications);
router.get("/documents", getUserDocuments);
router.get("/documents/stats", getDocumentStats);


module.exports = router;