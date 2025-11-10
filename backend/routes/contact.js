const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus,
  getContactById
} = require('../controllers/contactController');

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', submitContactForm);

// Admin routes - protected
router.use(protect);
router.use(admin);

router.get('/', getContactSubmissions);
router.get('/:id', getContactById);
router.put('/:id', updateContactStatus);

module.exports = router;