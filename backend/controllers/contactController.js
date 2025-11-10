const Contact = require('../models/Contact');
const {  sendAdminNotification, sendContactConfirmation } = require('../utils/emailService');


const submitContactForm = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      preferredCountry,
      studyGoals,
      consultationType = 'free_consultation'
    } = req.body;

    // Basic validation
    if (!name || !email || !preferredCountry || !studyGoals) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, preferred country and study goals are required'
      });
    }

    // Create contact entry
    const contact = new Contact({
      name,
      email,
      phone,
      preferredCountry,
      studyGoals,
      consultationType,
      source: 'website_landing'
    });

    await contact.save();

    // Send confirmation email to user
    try {
      await sendContactConfirmation(contact);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    // Send notification to admin (in real scenario)
    try {
      await sendAdminNotification(contact);
    } catch (adminEmailError) {
      console.error('Admin notification failed:', adminEmailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your interest! We will contact you within 24 hours.',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          preferredCountry: contact.preferredCountry,
          consultationType: contact.consultationType
        }
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a request with this email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const getContactSubmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(filter);

    // Statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        stats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submissions'
    });
  }
};


const updateContactStatus = async (req, res) => {
  try {
    const { status, notes, assignedTo, followUpDate } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(assignedTo && { assignedTo }),
        ...(followUpDate && { followUpDate }),
        ...(notes && {
          $push: {
            notes: {
              content: notes,
              addedBy: 'admin',
              addedAt: new Date()
            }
          }
        })
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: {
        contact
      }
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status'
    });
  }
};


const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        contact
      }
    });

  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submission'
    });
  }
};

module.exports = {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus,
  getContactById
};