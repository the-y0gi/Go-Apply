const Application = require('../models/Application');
const Document = require('../models/Document');
const Payment = require('../models/Payment');
const Program = require('../models/Program');

//GET->   Get dashboard overview
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Convert to object for easier access
    const stats = {};
    applicationStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });

    // Get total documents
    const totalDocuments = await Document.countDocuments({ userId });

    // Get total spent
    const totalSpent = await Payment.aggregate([
      { $match: { userId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get upcoming deadlines (applications due in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingDeadlines = await Application.find({
      userId,
      deadline: { $lte: thirtyDaysFromNow, $gte: new Date() },
      status: { $in: ['draft', 'submitted'] }
    })
      .populate('universityId', 'name country logoUrl')
      .populate('programId', 'name applicationDeadline')
      .sort({ deadline: 1 })
      .limit(5);

    // Get recent applications
    const recentApplications = await Application.find({ userId })
      .populate('universityId', 'name country logoUrl')
      .populate('programId', 'name degreeType')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get recommended programs (based on user's field of study)
    const UserProfile = require('../models/UserProfile');
    const userProfile = await UserProfile.findOne({ userId });
    
    let recommendedPrograms = [];
    if (userProfile?.fieldOfStudy) {
      recommendedPrograms = await Program.find({
        fieldOfStudy: userProfile.fieldOfStudy,
        isActive: true
      })
        .populate('universityId', 'name country logoUrl ranking')
        .limit(6)
        .sort({ 'ranking.global': 1 });
    } else {
      // Fallback: get featured programs
      recommendedPrograms = await Program.find({ isActive: true })
        .populate('universityId', 'name country logoUrl ranking')
        .limit(6)
        .sort({ 'ranking.global': 1 });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalApplications: Object.values(stats).reduce((a, b) => a + b, 0),
          applicationsSubmitted: stats.submitted || 0,
          applicationsInDraft: stats.draft || 0,
          applicationsAccepted: stats.accepted || 0,
          totalDocuments,
          totalSpent: totalSpent[0]?.total || 0
        },
        upcomingDeadlines,
        recentApplications,
        recommendedPrograms
      }
    });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

//GET->   Get dashboard deadlines with filters
const getDashboardDeadlines = async (req, res) => {
  try {
    const { type = 'upcoming', page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    let dateFilter = {};
    const currentDate = new Date();

    if (type === 'upcoming') {
      dateFilter = { 
        deadline: { $gte: currentDate } 
      };
    } else if (type === 'overdue') {
      dateFilter = { 
        deadline: { $lt: currentDate } 
      };
    } else if (type === 'all') {
      dateFilter = {};
    }

    const deadlines = await Application.find({
      userId,
      ...dateFilter,
      status: { $in: ['draft', 'submitted'] }
    })
      .populate('universityId', 'name country logoUrl')
      .populate('programId', 'name applicationDeadline duration')
      .sort({ deadline: type === 'overdue' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments({
      userId,
      ...dateFilter,
      status: { $in: ['draft', 'submitted'] }
    });

    // Count by type for summary
    const upcomingCount = await Application.countDocuments({
      userId,
      deadline: { $gte: currentDate },
      status: { $in: ['draft', 'submitted'] }
    });

    const overdueCount = await Application.countDocuments({
      userId,
      deadline: { $lt: currentDate },
      status: { $in: ['draft', 'submitted'] }
    });

    res.json({
      success: true,
      data: {
        deadlines,
        summary: {
          upcoming: upcomingCount,
          overdue: overdueCount,
          total
        },
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard deadlines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deadlines'
    });
  }
};

//GET->   Get dashboard recommendations
const getDashboardRecommendations = async (req, res) => {
  try {
    const UserProfile = require('../models/UserProfile');
    const userProfile = await UserProfile.findOne({ userId: req.user._id });

    let recommendedPrograms = [];
    let filter = { isActive: true };

    // If user has completed questionnaire, recommend based on their preferences
    if (userProfile) {
      const { fieldOfStudy, studyLevel, preferredCountries, budgetRange } = userProfile;

      if (fieldOfStudy) {
        filter.fieldOfStudy = fieldOfStudy;
      }

      if (studyLevel) {
        filter.degreeType = studyLevel;
      }

      if (preferredCountries && preferredCountries.length > 0) {
        const University = require('../models/University');
        const universities = await University.find({
          country: { $in: preferredCountries }
        }).select('_id');
        
        filter.universityId = { $in: universities.map(u => u._id) };
      }

      if (budgetRange) {
        filter['tuitionFee.amount'] = {
          $gte: budgetRange.min || 0,
          $lte: budgetRange.max || 100000
        };
      }
    }

    recommendedPrograms = await Program.find(filter)
      .populate('universityId', 'name country logoUrl ranking city')
      .sort({ 'ranking.global': 1, 'tuitionFee.amount': 1 })
      .limit(12);

    res.json({
      success: true,
      data: {
        recommendations: recommendedPrograms,
        count: recommendedPrograms.length,
        basedOn: userProfile ? 'your_preferences' : 'popular_programs'
      }
    });

  } catch (error) {
    console.error('Get dashboard recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations'
    });
  }
};

module.exports = {
  getDashboardOverview,
  getDashboardDeadlines,
  getDashboardRecommendations
};