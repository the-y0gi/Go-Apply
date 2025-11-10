const express = require('express');

const router = express.Router();

// Static data for dropdowns and filters
const FIELD_OF_STUDY_OPTIONS = [
  'Computer Science',
  'Data Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Mathematics',
  'Education',
  'Health Sciences',
  'Architecture',
  'Agriculture',
  'Environmental Science',
  'Other'
];

const NATIONALITY_OPTIONS = [
  'Indian',
  'Chinese',
  'American',
  'British',
  'Canadian',
  'Australian',
  'German',
  'French',
  'Japanese',
  'Korean',
  'Brazilian',
  'Mexican',
  'Russian',
  'South African',
  'Other'
];

const STUDY_LEVEL_OPTIONS = [
  'bachelors',
  'masters', 
  'phd',
  'diploma',
  'certificate'
];

const ENGLISH_EXAM_OPTIONS = [
  'IELTS',
  'TOEFL',
  'PTE',
  'Duolingo',
  'Other'
];

//GET->   Get field of study options
router.get('/fields-of-study', (req, res) => {
  res.json({
    success: true,
    data: FIELD_OF_STUDY_OPTIONS
  });
});

//GET->   Get nationality options
router.get('/nationalities', (req, res) => {
  res.json({
    success: true,
    data: NATIONALITY_OPTIONS
  });
});

//GET->   Get study level options
router.get('/study-levels', (req, res) => {
  res.json({
    success: true,
    data: STUDY_LEVEL_OPTIONS
  });
});

//GET->   Get English exam options
router.get('/english-exams', (req, res) => {
  res.json({
    success: true,
    data: ENGLISH_EXAM_OPTIONS
  });
});

//GET->   Get all static data
router.get('/all', (req, res) => {
  res.json({
    success: true,
    data: {
      fieldsOfStudy: FIELD_OF_STUDY_OPTIONS,
      nationalities: NATIONALITY_OPTIONS,
      studyLevels: STUDY_LEVEL_OPTIONS,
      englishExams: ENGLISH_EXAM_OPTIONS
    }
  });
});

module.exports = router;