// const Application = require('../models/Application');
// const Document = require('../models/Document');
// const Payment = require('../models/Payment');
// const Program = require('../models/Program');

// //GET->   Get dashboard overview
// const getDashboardOverview = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Get application statistics
//     const applicationStats = await Application.aggregate([
//       { $match: { userId } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     // Convert to object for easier access
//     const stats = {};
//     applicationStats.forEach(stat => {
//       stats[stat._id] = stat.count;
//     });

//     // Get total documents
//     const totalDocuments = await Document.countDocuments({ userId });

//     // Get total spent
//     const totalSpent = await Payment.aggregate([
//       { $match: { userId, status: 'paid' } },
//       { $group: { _id: null, total: { $sum: '$amount' } } }
//     ]);

//     // Get upcoming deadlines (applications due in next 30 days)
//     const thirtyDaysFromNow = new Date();
//     thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

//     const upcomingDeadlines = await Application.find({
//       userId,
//       deadline: { $lte: thirtyDaysFromNow, $gte: new Date() },
//       status: { $in: ['draft', 'submitted'] }
//     })
//       .populate('universityId', 'name country logoUrl')
//       .populate('programId', 'name applicationDeadline')
//       .sort({ deadline: 1 })
//       .limit(5);

//     // Get recent applications
//     const recentApplications = await Application.find({ userId })
//       .populate('universityId', 'name country logoUrl')
//       .populate('programId', 'name degreeType')
//       .sort({ updatedAt: -1 })
//       .limit(5);

//     // Get recommended programs (based on user's field of study)
//     const UserProfile = require('../models/UserProfile');
//     const userProfile = await UserProfile.findOne({ userId });
    
//     let recommendedPrograms = [];
//     if (userProfile?.fieldOfStudy) {
//       recommendedPrograms = await Program.find({
//         fieldOfStudy: userProfile.fieldOfStudy,
//         isActive: true
//       })
//         .populate('universityId', 'name country logoUrl ranking')
//         .limit(6)
//         .sort({ 'ranking.global': 1 });
//     } else {
//       // Fallback: get featured programs
//       recommendedPrograms = await Program.find({ isActive: true })
//         .populate('universityId', 'name country logoUrl ranking')
//         .limit(6)
//         .sort({ 'ranking.global': 1 });
//     }

//     res.json({
//       success: true,
//       data: {
//         overview: {
//           totalApplications: Object.values(stats).reduce((a, b) => a + b, 0),
//           applicationsSubmitted: stats.submitted || 0,
//           applicationsInDraft: stats.draft || 0,
//           applicationsAccepted: stats.accepted || 0,
//           totalDocuments,
//           totalSpent: totalSpent[0]?.total || 0
//         },
//         upcomingDeadlines,
//         recentApplications,
//         recommendedPrograms
//       }
//     });

//   } catch (error) {
//     console.error('Get dashboard overview error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard data'
//     });
//   }
// };

// //GET->   Get dashboard deadlines with filters
// const getDashboardDeadlines = async (req, res) => {
//   try {
//     const { type = 'upcoming', page = 1, limit = 10 } = req.query;
//     const userId = req.user._id;

//     let dateFilter = {};
//     const currentDate = new Date();

//     if (type === 'upcoming') {
//       dateFilter = { 
//         deadline: { $gte: currentDate } 
//       };
//     } else if (type === 'overdue') {
//       dateFilter = { 
//         deadline: { $lt: currentDate } 
//       };
//     } else if (type === 'all') {
//       dateFilter = {};
//     }

//     const deadlines = await Application.find({
//       userId,
//       ...dateFilter,
//       status: { $in: ['draft', 'submitted'] }
//     })
//       .populate('universityId', 'name country logoUrl')
//       .populate('programId', 'name applicationDeadline duration')
//       .sort({ deadline: type === 'overdue' ? -1 : 1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Application.countDocuments({
//       userId,
//       ...dateFilter,
//       status: { $in: ['draft', 'submitted'] }
//     });

//     // Count by type for summary
//     const upcomingCount = await Application.countDocuments({
//       userId,
//       deadline: { $gte: currentDate },
//       status: { $in: ['draft', 'submitted'] }
//     });

//     const overdueCount = await Application.countDocuments({
//       userId,
//       deadline: { $lt: currentDate },
//       status: { $in: ['draft', 'submitted'] }
//     });

//     res.json({
//       success: true,
//       data: {
//         deadlines,
//         summary: {
//           upcoming: upcomingCount,
//           overdue: overdueCount,
//           total
//         },
//         pagination: {
//           current: parseInt(page),
//           pages: Math.ceil(total / limit),
//           total
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Get dashboard deadlines error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching deadlines'
//     });
//   }
// };

// //GET->   Get dashboard recommendations
// const getDashboardRecommendations = async (req, res) => {
//   try {
//     const UserProfile = require('../models/UserProfile');
//     const userProfile = await UserProfile.findOne({ userId: req.user._id });

//     let recommendedPrograms = [];
//     let filter = { isActive: true };

//     // If user has completed questionnaire, recommend based on their preferences
//     if (userProfile) {
//       const { fieldOfStudy, studyLevel, preferredCountries, budgetRange } = userProfile;

//       if (fieldOfStudy) {
//         filter.fieldOfStudy = fieldOfStudy;
//       }

//       if (studyLevel) {
//         filter.degreeType = studyLevel;
//       }

//       if (preferredCountries && preferredCountries.length > 0) {
//         const University = require('../models/University');
//         const universities = await University.find({
//           country: { $in: preferredCountries }
//         }).select('_id');
        
//         filter.universityId = { $in: universities.map(u => u._id) };
//       }

//       if (budgetRange) {
//         filter['tuitionFee.amount'] = {
//           $gte: budgetRange.min || 0,
//           $lte: budgetRange.max || 100000
//         };
//       }
//     }

//     recommendedPrograms = await Program.find(filter)
//       .populate('universityId', 'name country logoUrl ranking city')
//       .sort({ 'ranking.global': 1, 'tuitionFee.amount': 1 })
//       .limit(12);

//     res.json({
//       success: true,
//       data: {
//         recommendations: recommendedPrograms,
//         count: recommendedPrograms.length,
//         basedOn: userProfile ? 'your_preferences' : 'popular_programs'
//       }
//     });

//   } catch (error) {
//     console.error('Get dashboard recommendations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching recommendations'
//     });
//   }
// };

// module.exports = {
//   getDashboardOverview,
//   getDashboardDeadlines,
//   getDashboardRecommendations
// };


// controllers/dashboardController.js
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
