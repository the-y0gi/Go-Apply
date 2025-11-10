const express = require('express');
const {
  searchUniversities,
  searchPrograms,
  getProgramById,
  getUniversityById
} = require('../controllers/searchController');

const router = express.Router();

router.get('/universities', searchUniversities);
router.get('/programs', searchPrograms);
router.get('/programs/:id', getProgramById);
router.get('/universities/:id', getUniversityById);

module.exports = router;