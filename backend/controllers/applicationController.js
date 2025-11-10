const Application = require('../models/Application');
const University = require('../models/University');
const Program = require('../models/Program');

//POST->   Create new application
const createApplication = async (req, res) => {
  try {
    const { universityId, programId, personalStatement, recommendationLetters } = req.body;

    // Check if university and program exist
    const university = await University.findById(universityId);
    const program = await Program.findById(programId);

    if (!university || !program) {
      return res.status(404).json({
        success: false,
        message: 'University or program not found'
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      universityId,
      programId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Application already exists for this program'
      });
    }

    // Create new application
    const application = new Application({
      userId: req.user._id,
      universityId,
      programId,
      personalStatement,
      recommendationLetters: recommendationLetters || [],
      deadline: program.applicationDeadline,
      applicationFee: program.tuitionFee?.amount ? program.tuitionFee.amount * 0.1 : 100 // 10% of tuition or default 100
    });

    await application.save();

    // Populate the application with university and program details
    await application.populate('universityId', 'name country logoUrl');
    await application.populate('programId', 'name degreeType fieldOfStudy tuitionFee');

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET->   Get applications with optional filters
const getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = { userId: req.user._id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('universityId', 'name country logoUrl city')
      .populate('programId', 'name degreeType fieldOfStudy tuitionFee duration')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });
  }
};

//GET->   Get single application by ID
const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('universityId')
      .populate('programId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Increment view count
    application.views += 1;
    application.lastViewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application'
    });
  }
};

//PUT->   Update application
const updateApplication = async (req, res) => {
  try {
    const {
      personalStatement,
      recommendationLetters,
      progress,
      notes
    } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(personalStatement && { personalStatement }),
        ...(recommendationLetters && { recommendationLetters }),
        ...(progress && { progress }),
        ...(notes && { 
          $push: { 
            notes: {
              content: notes,
              addedBy: 'student',
              addedAt: new Date()
            }
          }
        }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('universityId', 'name country logoUrl')
      .populate('programId', 'name degreeType fieldOfStudy tuitionFee');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application'
    });
  }
};

//DELETE->   Delete application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application'
    });
  }
};

//POST->   Submit application
const submitApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Application already submitted'
      });
    }

    // Check if application is complete (basic validation)
    const requiredProgress = ['personalInfo', 'academicInfo', 'documents'];
    const isComplete = requiredProgress.every(step => application.progress[step]);

    if (!isComplete) {
      return res.status(400).json({
        success: false,
        message: 'Application is not complete. Please complete all required sections.'
      });
    }

    // Update application status
    application.status = 'submitted';
    application.submittedAt = new Date();
    application.progress.submitted = true;
    await application.save();

    await application.populate('universityId', 'name country');
    await application.populate('programId', 'name degreeType');

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application'
    });
  }
};

// GET->   Get documents for an application
const getApplicationDocuments = async (req, res) => {
  try {
    const Document = require('../models/Document');
    
    const documents = await Document.find({
      applicationId: req.params.id,
      userId: req.user._id
    }).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: {
        documents,
        count: documents.length
      }
    });

  } catch (error) {
    console.error('Get application documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application documents'
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  getApplicationDocuments
};