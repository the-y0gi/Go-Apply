const express = require('express');
const { protect } = require('../middleware/auth');
const {
  saveQuestionnaire,
  getUserProfile,
  updateUserProfile,
  getUserDocuments,
  getUserApplications
} = require('../controllers/userController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/questionnaire', saveQuestionnaire);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/documents', getUserDocuments);
router.get('/applications', getUserApplications);

module.exports = router;