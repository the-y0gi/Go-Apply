const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  type: {
    type: String,
    enum: [
      'transcript', 
      'sop', // Statement of Purpose
      'lor', // Letter of Recommendation
      'resume', 
      'english_test', 
      'passport', 
      'financial_documents',
      'other'
    ],
    required: true
  },
  
  filename: {
    type: String,
    required: true
  },
  
  originalName: String,
  
  cloudinaryId: {
    type: String,
    required: true
  },
  
  url: {
    type: String,
    required: true
  },
  
  size: Number,
  mimeType: String,
  
  status: {
    type: String,
    enum: ['uploaded', 'verified', 'rejected'],
    default: 'verified'
  },
  
  // verifiedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  
  // verifiedAt: Date,
  
  // rejectionReason: String,
  
  // // Metadata
  // description: String,
  // tags: [String],
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  sharedWithApplications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ applicationId: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('Document', documentSchema);