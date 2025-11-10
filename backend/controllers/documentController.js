const Document = require('../models/Document');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// POST->   Upload document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type, description, applicationId } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Create document record
    const document = new Document({
      userId: req.user._id,
      applicationId: applicationId || null,
      type,
      filename: uploadResult.original_filename,
      originalName: req.file.originalname,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url,
      size: uploadResult.bytes,
      mimeType: req.file.mimetype,
      description: description || ''
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document
      }
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET->   Get documents with optional filters
const getDocuments = async (req, res) => {
  try {
    const { type, applicationId } = req.query;
    
    let filter = { userId: req.user._id };
    
    if (type) {
      filter.type = type;
    }
    
    if (applicationId) {
      filter.applicationId = applicationId;
    }

    const documents = await Document.find(filter)
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: {
        documents,
        count: documents.length
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// DELETE->   Delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(document.cloudinaryId);

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};

//GET->   Get document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: {
        document
      }
    });

  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching document'
    });
  }
};

// PUT->   Update document
const updateDocument = async (req, res) => {
  try {
    const { type, description, isPublic } = req.body;

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(type && { type }),
        ...(description && { description }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: {
        document
      }
    });

  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document'
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  getDocumentById,
  updateDocument
};