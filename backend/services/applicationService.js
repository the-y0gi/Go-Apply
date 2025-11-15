const Application = require("../models/Application");
const University = require("../models/University");
const Program = require("../models/Program");
const Document = require("../models/Document");
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const notificationService = require("../services/notificationService");

exports.createNewApplication = async (userId, data) => {
  const { universityId, programId,intake, personalStatement, recommendationLetters } = data;

  const university = await University.findById(universityId);
  const program = await Program.findById(programId);

  //UserProfile check for actual data
  const userProfile = await UserProfile.findOne({ userId });

  if (!userProfile || !isProfileComplete(userProfile)) {
    throw new Error(
      "Please complete your profile with education history, experience, and languages before applying to programs"
    );
  }

  if (!university || !program)
    throw new Error("University or program not found");

   if (intake && intake.season && intake.year) {
    const existing = await Application.findOne({
      userId,
      universityId,
      programId,
      "intake.season": intake.season,
      "intake.year": intake.year,
    });
  if (existing) throw new Error(`You already applied for the ${intake.season} ${intake.year} intake`);
  }
  // Initial progress object
  const initialProgress = {
    personalInfo: true,
    academicInfo: true,
    documents: false,
    payment: false,
  };

  const application = new Application({
    userId,
    universityId,
    programId,
    personalStatement,
    recommendationLetters: recommendationLetters || [],
    deadline: program.applicationDeadline,
    applicationFee: program.applicationFee || 100,
    progress: initialProgress,
    intake: intake ? [intake] : [],
  });

  await application.save();

  // Attach user's previously uploaded global documents to this application (if any)
  await Document.updateMany(
    { userId, applicationId: null },
    { $set: { applicationId: application._id } }
  );

  await application.populate("universityId", "name country logoUrl");
  await application.populate(
    "programId",
    "name degreeType fieldOfStudy tuitionFee applicationFee"
  );

  //add notification...
  await notificationService.createNotification(
    userId,
    "application",
    "Application Draft Created",
    `Application draft created for ${application.universityId.name} - ${application.programId.name}. Upload required documents and payment to submit.`,
    application._id
  );

  return application;
};

//Helper function to check profile completeness
const isProfileComplete = (profile) => {
  const hasEducation =
    profile.educationHistory && profile.educationHistory.length > 0;
  const hasLanguages = profile.languages && profile.languages.length > 0;
  const hasBasicInfo = profile.nationality && profile.dateOfBirth;

  return hasEducation && hasLanguages && hasBasicInfo;
};

exports.getAllApplications = async (
  userId,
  { status, page = 1, limit = 10 }
) => {
  const filter = { userId };
  if (status && status !== "all") filter.status = status;

  const applications = await Application.find(filter)
    .populate("universityId", "name country logoUrl city")
    .populate(
      "programId",
      "name degreeType fieldOfStudy tuitionFee duration applicationFee requirements"
    )
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Application.countDocuments(filter);

  return {
    applications,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    },
  };
};

exports.getApplicationById = async (userId, id) => {
  const app = await Application.findOne({ _id: id, userId })
    .populate("universityId")
    .populate("programId");

  if (!app) throw new Error("Application not found");

  // optional telemetry
  app.views = (app.views || 0) + 1;
  app.lastViewedAt = new Date();
  await app.save();

  return app;
};

exports.updateApplicationById = async (userId, id, body) => {
  const { personalStatement, recommendationLetters, progress, notes } = body;

  const update = {
    ...(personalStatement && { personalStatement }),
    ...(recommendationLetters && { recommendationLetters }),
    updatedAt: new Date(),
  };

  // If frontend sends a *partial* progress, merge server-side to avoid overwrite
  if (progress) {
    const app = await Application.findOne({ _id: id, userId });
    if (!app) throw new Error("Application not found");
    app.progress = { ...(app.progress || {}), ...progress };
    if (notes) {
      app.notes = app.notes || [];
      app.notes.push({
        content: notes,
        addedBy: "student",
        addedAt: new Date(),
      });
    }
    await app.save();
    await app
      .populate("universityId", "name country logoUrl")
      .populate("programId", "name degreeType fieldOfStudy tuitionFee");
    return app;
  }

  if (notes) {
    update.$push = {
      notes: { content: notes, addedBy: "student", addedAt: new Date() },
    };
  }

  const app = await Application.findOneAndUpdate({ _id: id, userId }, update, {
    new: true,
    runValidators: true,
  })
    .populate("universityId", "name country logoUrl")
    .populate("programId", "name degreeType fieldOfStudy tuitionFee");
  if (!app) throw new Error("Application not found");
  return app;
};

// PATCH-> Progress update
exports.updateProgress = async (id, progressPartial) => {
  // fetch, merge, save — prevents overwriting unknown fields
  const app = await Application.findById(id)
    .populate("universityId", "name country logoUrl city")
    .populate("programId", "name degreeType fieldOfStudy tuitionFee duration");

  if (!app) throw new Error("Application not found");

  app.progress = { ...(app.progress || {}), ...(progressPartial || {}) };
  await app.save();

  await app.populate("universityId", "name country logoUrl city");
  await app.populate(
    "programId",
    "name degreeType fieldOfStudy tuitionFee duration"
  );
  return app;
};

exports.deleteApplicationById = async (userId, id) => {
  const app = await Application.findOne({ _id: id, userId });

  if (!app) throw new Error("Application not found");

  //Prevent deletion of submitted applications
  if (app.status !== "draft") {
    throw new Error("Cannot delete submitted application");
  }

  await Application.findOneAndDelete({ _id: id, userId });
  await Document.updateMany(
    { applicationId: id },
    { $set: { applicationId: null } }
  );
  return app;
};

exports.submitApplicationById = async (userId, id) => {
  const app = await Application.findOne({ _id: id, userId });
  if (!app) throw new Error("Application not found");
  if (app.status === "submitted")
    throw new Error("Application already submitted");

  const requiredSteps = [
    "personalInfo",
    "academicInfo",
    "documents",
    "payment",
  ];
  const isComplete = requiredSteps.every((s) => !!app.progress?.[s]);
  if (!isComplete)
    throw new Error(
      "Application not complete. Please complete all required sections."
    );

  app.status = "submitted";
  app.submittedAt = new Date();
  await app.save();

  await app.populate("universityId", "name country logoUrl city");
  await app.populate(
    "programId",
    "name degreeType fieldOfStudy tuitionFee duration"
  );
  return app;
};

exports.getDocumentsForApplication = async (userId, id) => {
  const app = await Application.findOne({ _id: id, userId }).populate(
    "programId"
  );
  if (!app) throw new Error("Application not found");

  const requiredDocs = app.programId?.requirements?.documentsRequired || [];
  const uploadedDocs = await Document.find({ userId, applicationId: id });
  const uploadedTypes = uploadedDocs.map((d) => d.type);
  const missing = requiredDocs.filter((d) => !uploadedTypes.includes(d));

  return { uploaded: uploadedDocs, required: requiredDocs, missing };
};

exports.getProgramById = async (id) => {
  const program = await Program.findById(id).populate(
    "universityId",
    "name country city applicationFee requirements"
  );
  if (!program) throw new Error("Program not found");
  return program;
};
