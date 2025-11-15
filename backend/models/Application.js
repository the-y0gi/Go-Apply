const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
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

    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "accepted", "rejected"],
      default: "draft",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    progress: {
      personalInfo: { type: Boolean, default: false },
      academicInfo: { type: Boolean, default: false },
      documents: { type: Boolean, default: false },
      payment: { type: Boolean, default: false },
    },

    // Tracking
    views: {
      type: Number,
      default: 0,
    },

    lastViewedAt: Date,

    submittedAt: Date,
    deadline: Date,
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ universityId: 1 });
applicationSchema.index({ deadline: 1 });

// Virtual completion %
applicationSchema.virtual("completionPercentage").get(function () {
  const total = Object.keys(this.progress).length;
  const done = Object.values(this.progress).filter(Boolean).length;
  return Math.round((done / total) * 100);
});

module.exports = mongoose.model("Application", applicationSchema);
