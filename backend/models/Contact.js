const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  preferredCountry: {
    type: String,
    required: [true, 'Preferred country is required'],
    trim: true
  },
  studyGoals: {
    type: String,
    required: [true, 'Study goals are required'],
    trim: true,
    maxlength: 1000
  },
  // Additional fields from screenshot
  consultationType: {
    type: String,
    enum: ['free_consultation', 'general_inquiry', 'application_help'],
    default: 'free_consultation'
  },
  source: {
    type: String,
    default: 'website_landing'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // For admin assignment
  },
  notes: [{
    content: String,
    addedBy: {
      type: String,
      enum: ['admin', 'system']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  responseTime: {
    promised: {
      type: Number,
      default: 24 // 24 hours guarantee
    },
    actual: Number // Actual response time in hours
  },
  followUpDate: Date
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);