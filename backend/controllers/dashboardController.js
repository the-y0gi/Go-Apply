const Application = require("../models/Application");
const Document = require("../models/Document");
const UserProfile = require("../models/UserProfile");
const University = require("../models/University");
const Program = require("../models/Program");

exports.getDashboardProgress  = async (req, res) => {
  try {
    const userId = req.user._id;

    // Parallel queries for better performance
    const [applications, documents, userProfile] = await Promise.all([
      Application.find({ userId }).select("status paymentStatus progress").lean(),
      Document.find({ userId }).select("type").lean(),
      UserProfile.findOne({ userId }).select("educationHistory").lean()
    ]);

    // Calculate stats efficiently
    const submittedApps = applications.filter(app => 
      ["submitted", "under_review"].includes(app.status)
    ).length;

    const paidApps = applications.filter(app => 
      app.paymentStatus === "paid"
    ).length;

    const acceptedApps = applications.filter(app => 
      app.status === "accepted"
    ).length;

    const profileComplete = !!(userProfile?.educationHistory?.length > 0);

    res.json({
      success: true,
      data: {
        stats: {
          applicationsSubmitted: submittedApps,
          programsTracked: applications.length,
          documentsUploaded: documents.length,
          profileCompletion: profileComplete ? "100%" : "0%"
        },
        progress: {
          profileComplete,
          hasApplications: applications.length > 0,
          hasDocuments: documents.length > 0,
          hasPaidApplications: paidApps > 0,
          hasAcceptedApplications: acceptedApps > 0
        }
      }
    });

  } catch (error) {
    console.error("Dashboard progress error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch dashboard data" 
    });
  }
};

 exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate("universityId", "name country")
      .populate("programId", "name degreeType duration")
      .select("status paymentStatus progress intake deadline submittedAt")
      .sort({ updatedAt: -1 })
      .lean();

    if (!applications.length) {
      return res.json({
        success: true,
        data: {
          applications: [],
          total: 0
        }
      });
    }

    // Transform data efficiently
    const transformedApplications = applications.map(app => {
      const currentStep = getCurrentStep(app.status, app.paymentStatus);
      const progressPercentage = calculateProgressPercentage(app.progress);
      
      return {
        id: app._id,
        university: app.universityId?.name || "Unknown University",
        program: app.programId?.name || "Unknown Program", 
        country: app.universityId?.country || "Unknown",
        status: mapStatus(app.status),
        statusColor: getStatusColor(app.status),
        deadline: app.deadline ? formatDate(app.deadline) : "Not set",
        progress: progressPercentage,
        currentStep: currentStep,
        appliedDate: app.submittedAt ? formatDate(app.submittedAt) : "Not submitted",
        degreeType: app.programId?.degreeType || "Unknown"
      };
    });

    res.json({
      success: true,
      data: {
        applications: transformedApplications,
        total: applications.length
      }
    });

  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch applications" 
    });
  }
};

// Helper functions
const mapStatus = (status) => {
  const statusMap = {
    draft: "Draft",
    submitted: "Submitted", 
    under_review: "Under Review",
    accepted: "Accepted",
    rejected: "Rejected"
  };
  return statusMap[status] || "Draft";
};

const getStatusColor = (status) => {
  const colors = {
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    submitted: "bg-blue-100 text-blue-800 border-blue-200", 
    under_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[status] || colors.draft;
};

const calculateProgressPercentage = (progress) => {
  if (!progress) return 0;
  const total = Object.keys(progress).length;
  const completed = Object.values(progress).filter(Boolean).length;
  return Math.round((completed / total) * 100);
};

const getCurrentStep = (status, paymentStatus) => {
  const stepMap = {
    draft: 1,
    submitted: paymentStatus === "paid" ? 3 : 2,
    under_review: 4,
    accepted: 5,
    rejected: 5
  };
  return stepMap[status] || 1;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};


exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const documents = await Document.find({ userId })
      .select("type filename originalName url size status uploadedAt")
      .sort({ uploadedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        documents,
        total: documents.length
      }
    });

  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents"
    });
  }
};

exports.getDocumentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Document.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    console.error("Document stats error:", error);
    res.status(500).json({
      success: false, 
      message: "Failed to fetch document stats"
    });
  }
};
