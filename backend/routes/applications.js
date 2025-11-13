const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  getApplicationDocuments,
  getProgramById,
  updateApplicationProgress
} = require('../controllers/applicationController');

const router = express.Router();

router.get("/program/:id", getProgramById); 
// All routes are protected
router.use(protect);

router.post('/', createApplication);

router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.patch("/:id/update-progress", updateApplicationProgress);

router.delete('/:id', deleteApplication);
router.post('/:id/submit', submitApplication);
router.get('/:id/documents', getApplicationDocuments);

module.exports = router;