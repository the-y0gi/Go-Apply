const documentService = require('../services/documentService');


// POST → Upload
exports.uploadDocument = async (req, res) => {
  try {
    const document = await documentService.uploadDocumentService(req.file, req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error uploading document'
    });
  }
};

// GET → All documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await documentService.getDocumentsService(req.user._id, req.query);
    res.json({
      success: true,
      data: { documents, count: documents.length }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET → Single document
exports.getDocumentById = async (req, res) => {
  try {
    const document = await documentService.getDocumentByIdService(req.user._id, req.params.id);
    res.json({ success: true, data: { document } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// PUT → Update document
exports.updateDocument = async (req, res) => {
  try {
    const document = await documentService.updateDocumentService(req.user._id, req.params.id, req.body);
    res.json({ success: true, message: 'Document updated successfully', data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE → Delete document
exports.deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocumentService(req.user._id, req.params.id);
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
