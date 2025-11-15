const applicationService = require("../services/applicationService");

// POST -> create application
exports.createApplication = async (req, res) => {
  try {
    const application = await applicationService.createNewApplication(req.user._id, req.body);
    res.status(201).json({ success: true, message: "Application created successfully", data: { application } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Error creating application" });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const data = await applicationService.getAllApplications(req.user._id, req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await applicationService.getApplicationById(req.user._id, req.params.id);
    res.json({ success: true, data: { application } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await applicationService.updateApplicationById(req.user._id, req.params.id, req.body);
    res.json({ success: true, message: "Application updated successfully", data: { application } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateApplicationProgress = async (req, res) => {
  try {
    const application = await applicationService.updateProgress(req.params.id, req.body.progress);
    res.json({ success: true, message: "Application progress updated successfully", data: { application } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    await applicationService.deleteApplicationById(req.user._id, req.params.id);
    res.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const application = await applicationService.submitApplicationById(req.user._id, req.params.id);
    res.json({ success: true, message: "Application submitted successfully", data: { application } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getApplicationDocuments = async (req, res) => {
  try {
    const data = await applicationService.getDocumentsForApplication(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const program = await applicationService.getProgramById(req.params.id);
    res.json({ success: true, data: { program } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
