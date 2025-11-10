const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: Date,
    nationality: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },

    // Questionnaire Data
    fieldOfStudy: String,
    studyLevel: {
      type: String,
      enum: ["bachelors", "masters", "diploma", "phd", "other"],
    },

    englishProficiency: {
      hasTestResults: Boolean,
      examType: {
        type: String,
        enum: ["IELTS", "TOEFL", "PTE", "Duolingo", "Other"],
      },
      examScore: String,
      proficiencyLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Native"],
      },
    },

    availableFunds: Number,

    visaRefusalHistory: {
      hasBeenRefused: Boolean,
      details: String,
    },

    intendedStartDate: Date,

    education: {
      highestLevel: {
        type: String,
        enum: ["graduated", "studying"],
      },
      country: String,
      level: {
        type: String,
        enum: ["primary", "secondary", "undergraduate", "postgraduate"],
      },
      grade: String,
      institution: String,
      completionYear: Number,
      gpa: Number,
      gradingScale: {
        type: String,
        default: "4.0",
      },
    },

    standardizedTests: [
      {
        type: String,
        enum: ["GMAT", "GRE", "SAT", "ACT", "None"],
      },
    ],

    workExperience: [
      {
        company: String,
        position: String,
        duration: String, // "2 years", "6 months"
        description: String,
        isCurrent: Boolean,
        startDate: Date,
        endDate: Date,
      },
    ],

    // Preferences
    preferredCountries: [String],
    preferredUniversities: [String],
    budgetRange: {
      min: Number,
      max: Number,
    },

    //add new fields below
    educationHistory: [
      {
        degree: String,
        institution: String,
        graduationYear: String,
        gpa: String,
        honors: String,
      },
    ],

    experience: [
      {
        title: String,
        company: String,
        startYear: String,
        endYear: String,
        description: String,
        duration: String,
      },
    ],

    technicalSkills: [String],

    languages: [
      {
        language: String,
        proficiency: String,
      },
    ],

    achievements: [String],
  },
  {
    timestamps: true,
  }
);

// Index for better performance
userProfileSchema.index({ userId: 1 });

module.exports = mongoose.model("UserProfile", userProfileSchema);
