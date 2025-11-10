// const UserProfile = require('../models/UserProfile');
// const User = require('../models/User');

// // POST->   Save user questionnaire data
// const saveQuestionnaire = async (req, res) => {
//   try {
//     const {
//       fieldOfStudy,
//       studyLevel,
//       nationality,
//       englishProficiency,
//       availableFunds,
//       visaRefusalHistory,
//       intendedStartDate,
//       education,
//       standardizedTests
//     } = req.body;

//     // Find or create user profile
//     let userProfile = await UserProfile.findOne({ userId: req.user._id });

//     if (userProfile) {
//       // Update existing profile
//       userProfile = await UserProfile.findOneAndUpdate(
//         { userId: req.user._id },
//         {
//           fieldOfStudy,
//           studyLevel,
//           nationality,
//           englishProficiency,
//           availableFunds,
//           visaRefusalHistory,
//           intendedStartDate,
//           education,
//           standardizedTests,
//           updatedAt: new Date()
//         },
//         { new: true, runValidators: true }
//       );
//     } else {
//       // Create new profile
//       userProfile = new UserProfile({
//         userId: req.user._id,
//         fieldOfStudy,
//         studyLevel,
//         nationality,
//         englishProficiency,
//         availableFunds,
//         visaRefusalHistory,
//         intendedStartDate,
//         education,
//         standardizedTests
//       });
//       await userProfile.save();
//     }

//     // Update user's registration progress
//     await User.findByIdAndUpdate(req.user._id, {
//       profileCompleted: true,
//       registrationStep: 8 // Completed all steps
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Questionnaire saved successfully',
//       data: {
//         profile: userProfile
//       }
//     });

//   } catch (error) {
//     console.error('Save questionnaire error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error saving questionnaire',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // GET->   Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const userProfile = await UserProfile.findOne({ userId: req.user._id })
//       .populate('userId', 'firstName lastName email');

//     if (!userProfile) {
//       return res.status(404).json({
//         success: false,
//         message: 'User profile not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         profile: userProfile
//       }
//     });

//   } catch (error) {
//     console.error('Get user profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user profile'
//     });
//   }
// };

// // PUT->   Update user profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const updateData = req.body;

//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: req.user._id },
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true, upsert: true }
//     );

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: {
//         profile: userProfile
//       }
//     });

//   } catch (error) {
//     console.error('Update user profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating profile',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // GET->   Get user documents
// const getUserDocuments = async (req, res) => {
//   try {
//     const Document = require('../models/Document');
    
//     const documents = await Document.find({ userId: req.user._id })
//       .sort({ uploadedAt: -1 });

//     res.json({
//       success: true,
//       data: {
//         documents,
//         count: documents.length
//       }
//     });

//   } catch (error) {
//     console.error('Get user documents error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching documents'
//     });
//   }
// };

// // GET->   Get user applications
// const getUserApplications = async (req, res) => {
//   try {
//     const Application = require('../models/Application');
    
//     const applications = await Application.find({ userId: req.user._id })
//       .populate('universityId', 'name country logoUrl')
//       .populate('programId', 'name degreeType fieldOfStudy tuitionFee')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: {
//         applications,
//         count: applications.length
//       }
//     });

//   } catch (error) {
//     console.error('Get user applications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching applications'
//     });
//   }
// };

// module.exports = {
//   saveQuestionnaire,
//   getUserProfile,
//   updateUserProfile,
//   getUserDocuments,
//   getUserApplications
// };

const User = require("../models/User");
const UserProfile = require("../models/UserProfile");

// POST->   Save user questionnaire data
const saveQuestionnaire = async (req, res) => {
  try {
    const {
      fieldOfStudy,
      studyLevel,
      nationality,
      englishProficiency,
      availableFunds,
      visaRefusalHistory,
      intendedStartDate,
      education,
      standardizedTests
    } = req.body;

    // Find or create user profile
    let userProfile = await UserProfile.findOne({ userId: req.user._id });

    if (userProfile) {
      // Update existing profile
      userProfile = await UserProfile.findOneAndUpdate(
        { userId: req.user._id },
        {
          fieldOfStudy,
          studyLevel,
          nationality,
          englishProficiency,
          availableFunds,
          visaRefusalHistory,
          intendedStartDate,
          education,
          standardizedTests,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      userProfile = new UserProfile({
        userId: req.user._id,
        fieldOfStudy,
        studyLevel,
        nationality,
        englishProficiency,
        availableFunds,
        visaRefusalHistory,
        intendedStartDate,
        education,
        standardizedTests
      });
      await userProfile.save();
    }

    // Update user's registration progress
    await User.findByIdAndUpdate(req.user._id, {
      profileCompleted: true,
      registrationStep: 8 // Completed all steps
    });

    res.status(200).json({
      success: true,
      message: 'Questionnaire saved successfully',
      data: {
        profile: userProfile
      }
    });

  } catch (error) {
    console.error('Save questionnaire error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving questionnaire',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



//GET -> Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user._id })
      .populate("userId", "firstName lastName email");

    // If profile not found, create a new one with valid enum values
    if (!profile) {
      profile = new UserProfile({
        userId: req.user._id,
        phone: "",
        dateOfBirth: "",
        nationality: "Indian",
        address: "",
        bio: "",
        fieldOfStudy: "",
        // ENUM FIELDS - either omit or set to valid values
        // studyLevel: undefined, // Don't set this field
        englishProficiency: {
          hasTestResults: false,
          // examType: undefined, // Don't set
          examScore: "",
          // proficiencyLevel: undefined // Don't set
        },
        availableFunds: 0,
        visaRefusalHistory: {
          hasBeenRefused: false,
          details: ""
        },
        intendedStartDate: "",
        education: {
          // highestLevel: undefined, // Don't set
          country: "",
          // level: undefined, // Don't set
          grade: "",
          institution: "",
          completionYear: 0,
          gpa: 0,
          gradingScale: "4.0"
        },
        standardizedTests: [],
        workExperience: [],
        preferredCountries: [],
        preferredUniversities: [],
        budgetRange: {
          min: 0,
          max: 0
        },
        educationHistory: [],
        experience: [],
        technicalSkills: [],
        languages: [],
        achievements: []
      });
      
      await profile.save();
      
      // Populate the newly created profile
      await profile.populate("userId", "firstName lastName email");
    }

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

// PUT -> Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      "phone",
      "dateOfBirth",
      "nationality",
      "address",
      "bio",
      "educationHistory",
      "experience",
      "technicalSkills",
      "languages",
      "achievements",
    ];

    const updateData = {};
    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // Update or create the profile document
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true, upsert: true }
    );

    // Also allow updating name/email if sent
    if (req.body.firstName || req.body.lastName || req.body.email) {
      await User.findByIdAndUpdate(req.user._id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { profile: updatedProfile },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

//GET -> Get user documents
const getUserDocuments = async (req, res) => {
  try {
    const Document = require("../models/Document");
    const documents = await Document.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        documents,
        count: documents.length,
      },
    });
  } catch (error) {
    console.error("Get user documents error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching documents",
      error: error.message,
    });
  }
};

// GET -> Get user applications
const getUserApplications = async (req, res) => {
  try {
    const Application = require("../models/Application");
    const applications = await Application.find({ userId: req.user._id })
      .populate("universityId", "name country logoUrl")
      .populate("programId", "name degreeType fieldOfStudy tuitionFee")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        applications,
        count: applications.length,
      },
    });
  } catch (error) {
    console.error("Get user applications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: error.message,
    });
  }
};


module.exports = {
  saveQuestionnaire,
  getUserProfile,
  updateUserProfile,
  getUserDocuments,
  getUserApplications,
};
