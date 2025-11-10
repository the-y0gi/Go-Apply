const express = require('express');
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  getDocumentById,
  updateDocument
} = require('../controllers/documentController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/upload', upload.single('document'), handleUploadError, uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;