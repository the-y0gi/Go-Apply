const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const Document = require("../models/Document");
const Application = require("../models/Application");

// GLOBAL STUDENT PROGRESS
exports.calculateGlobalProgress = async (userId) => {
  const user = await User.findById(userId);
  const profile = await UserProfile.findOne({ userId });
  const documents = await Document.find({ userId });

  //profile completed?
  const profileCompleted = user?.profileCompleted || false;

  //questionnaire filled?
  const questionnaireCompleted = !!profile?.fieldOfStudy;

  //minimum required docs BEFORE applying
  const minimumDocsNeeded = ["passport", "resume"]; // you can edit list anytime
  const uploadedTypes = documents.map((d) => d.type);

  const documentsCompleted = minimumDocsNeeded.every((docType) =>
    uploadedTypes.includes(docType)
  );

  //global permission to apply
  const canApply = profileCompleted && questionnaireCompleted && documentsCompleted;

  return {
    profileCompleted,
    questionnaireCompleted,
    documentsCompleted,
    canApply,
  };
};

//APPLICATION PROGRESS
exports.calculateApplicationProgress = async (userId, applicationId) => {
  const application = await Application.findOne({ _id: applicationId, userId })
    .populate("programId");

  if (!application) throw new Error("Application not found");

  // All docs uploaded for this PROGRAM?
  const requiredDocs = application.programId?.requirements?.documentsRequired || [];

  const uploadedDocs = await Document.find({
    userId,
    applicationId,
  });

  const uploadedTypes = uploadedDocs.map((d) => d.type);
  const hasAllDocs = requiredDocs.every((docType) => uploadedTypes.includes(docType));

  // Payment finished?
  const paymentCompleted = application.paymentStatus === "paid";

  // All conditions for final SUBMIT
  const canSubmit =
    application.progress.personalInfo &&
    application.progress.academicInfo &&
    hasAllDocs &&
    paymentCompleted;

  return {
    progress: application.progress,
    requiredDocs,
    uploadedDocs,
    hasAllDocs,
    paymentCompleted,
    canSubmit,
  };
};
