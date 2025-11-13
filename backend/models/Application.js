// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   universityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'University',
//     required: true
//   },
//   programId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Program',
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
//     default: 'draft'
//   },

//   progress: {
//     personalInfo: { type: Boolean, default: false },
//     academicInfo: { type: Boolean, default: false },
//     documents: { type: Boolean, default: false },
//     payment: { type: Boolean, default: false },
//     submitted: { type: Boolean, default: false }
//   },

//   // applicationFee: {
//   //   type: Number,
//   //   default: 0
//   // },
//    tuitionFee: {
//     type: Number,
//     default: 0
//   },

//   submittedAt: Date,
//   deadline: Date,

//   // Application specific data
//   // personalStatement: String,

//   // recommendationLetters: [{
//   //   name: String,
//   //   email: String,
//   //   position: String,
//   //   institution: String,
//   //   status: {
//   //     type: String,
//   //     enum: ['requested', 'submitted', 'completed'],
//   //     default: 'requested'
//   //   },
//   //   requestedAt: Date,
//   //   submittedAt: Date
//   // }],

// // Tracking
// views: {
//   type: Number,
//   default: 0
// },

// lastViewedAt: Date,

//   // notes: [{
//   //   content: String,
//   //   addedBy: {
//   //     type: String,
//   //     enum: ['student', 'university', 'system']
//   //   },
//   //   addedAt: {
//   //     type: Date,
//   //     default: Date.now
//   //   }
//   // }],

//   // // Communication
//   // messages: [{
//   //   type: {
//   //     type: String,
//   //     enum: ['email', 'notification', 'reminder']
//   //   },
//   //   subject: String,
//   //   content: String,
//   //   sentAt: {
//   //     type: Date,
//   //     default: Date.now
//   //   },
//   //   read: {
//   //     type: Boolean,
//   //     default: false
//   //   }
//   // }]
// }, {
//   timestamps: true
// });

// // Compound indexes for better query performance
// applicationSchema.index({ userId: 1, status: 1 });
// applicationSchema.index({ universityId: 1 });
// applicationSchema.index({ deadline: 1 });
// applicationSchema.index({ createdAt: -1 });

// // Virtual for application completion percentage
// applicationSchema.virtual('completionPercentage').get(function() {
//   const totalSteps = Object.keys(this.progress).length;
//   const completedSteps = Object.values(this.progress).filter(Boolean).length;
//   return Math.round((completedSteps / totalSteps) * 100);
// });

// module.exports = mongoose.model('Application', applicationSchema);

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
