const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  country: {
    type: String,
    required: true
  },
  
  city: String,
  state: String,
  
  logoUrl: String,
  
  description: {
    type: String,
    maxlength: 2000
  },
  
  ranking: {
    global: Number,
    country: Number,
    subject: Number
  },
  
  website: String,
  contactEmail: String,
  phone: String,
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // University stats
  establishedYear: Number,
  totalStudents: Number,
  internationalStudents: Number,
  studentFacultyRatio: Number,
  
  // Features
  campusFacilities: [String],
  accreditation: [String],
  
  // Social media
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  
  // Admission info
  applicationFee: Number,
  applicationPortal: String,
  
  // Additional info
  climate: String,
  livingCost: {
    accommodation: Number,
    food: Number,
    transportation: Number,
    other: Number
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
universitySchema.index({ name: 1 });
universitySchema.index({ country: 1 });
universitySchema.index({ ranking: 1 });
universitySchema.index({ featured: 1 });

// Text search index
universitySchema.index({
  name: 'text',
  country: 'text',
  city: 'text',
  description: 'text'
});

module.exports = mongoose.model('University', universitySchema);