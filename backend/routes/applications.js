const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  getApplicationDocuments
} = require('../controllers/applicationController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/submit', submitApplication);
router.get('/:id/documents', getApplicationDocuments);

module.exports = router;