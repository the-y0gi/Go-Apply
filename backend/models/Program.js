const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    degreeType: {
      type: String,
      enum: ["bachelors", "masters", "phd", "diploma", "certificate"],
      required: true,
    },

    fieldOfStudy: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    // ⭐ Final Correct Fee Structure
    tuitionFee: {
      amount: { type: Number },
      currency: { type: String, default: "USD" },
      frequency: {
        type: String,
        enum: ["per_year", "per_semester", "total"],
        default: "per_year",
      },
    },

    applicationFee: {
      type: Number,
      default: 100,
    },

    applicationDeadline: Date,

  intake: [
  {
    season: {
      type: String,
      enum: ["fall", "spring"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
],


    requirements: {
      minGPA: Number,

      englishTests: [
        {
          testType: String,
          minScore: Number,
          minReading: Number,
          minWriting: Number,
          minListening: Number,
          minSpeaking: Number,
        },
      ],

      standardizedTests: [
        {
          testType: String,
          minScore: Number,
        },
      ],

      documentsRequired: [String],

      workExperience: {
        required: Boolean,
        minYears: Number,
      },

      prerequisites: [String],
    },

    description: { type: String, maxlength: 3000 },

    curriculum: [
      {
        semester: String,
        courses: [String],
      },
    ],

    careerOpportunities: [String],

    totalSeats: Number,
    internationalSeats: Number,
    acceptanceRate: Number,

    scholarships: [
      {
        name: String,
        description: String,
        amount: Number,
        eligibility: String,
        deadline: Date,
      },
    ],

    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
programSchema.index({ universityId: 1 });
programSchema.index({ fieldOfStudy: 1 });
programSchema.index({ degreeType: 1 });
programSchema.index({ "tuitionFee.amount": 1 });
programSchema.index({ applicationDeadline: 1 });

programSchema.index({
  name: "text",
  fieldOfStudy: "text",
  description: "text",
});

module.exports = mongoose.model("Program", programSchema);
