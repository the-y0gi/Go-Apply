const University = require('../models/University');
const Program = require('../models/Program');

//GET->   Search universities
const searchUniversities = async (req, res) => {
  try {
    const { q, country, page = 1, limit = 10, sortBy = 'name' } = req.query;

    let filter = { isActive: true };
    let sort = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Country filter
    if (country) {
      filter.country = new RegExp(country, 'i');
    }

    // Sort options
    switch (sortBy) {
      case 'ranking':
        sort = { 'ranking.global': 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'country':
        sort = { country: 1, name: 1 };
        break;
      default:
        sort = { name: 1 };
    }

    const universities = await University.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await University.countDocuments(filter);

    res.json({
      success: true,
      data: {
        universities,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Search universities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching universities'
    });
  }
};
//GET->   Search programs
const searchPrograms = async (req, res) => {
  try {
    const { 
      q, 
      fieldOfStudy, 
      degreeType, 
      country,
      minTuition, 
      maxTuition,
      page = 1, 
      limit = 10,
      sortBy = 'name'
    } = req.query;

    let filter = { isActive: true };
    let sort = {};
    let universityFilter = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Field of study filter
    if (fieldOfStudy) {
      filter.fieldOfStudy = new RegExp(fieldOfStudy, 'i');
    }

    // Degree type filter
    if (degreeType) {
      filter.degreeType = degreeType;
    }

    // Tuition fee range
    if (minTuition || maxTuition) {
      filter['tuitionFee.amount'] = {};
      if (minTuition) filter['tuitionFee.amount'].$gte = parseInt(minTuition);
      if (maxTuition) filter['tuitionFee.amount'].$lte = parseInt(maxTuition);
    }

    // Country filter (through university)
    if (country) {
      universityFilter.country = new RegExp(country, 'i');
    }

    // Sort options
    switch (sortBy) {
      case 'tuition':
        sort = { 'tuitionFee.amount': 1 };
        break;
      case 'ranking':
        sort = { 'universityId.ranking.global': 1 };
        break;
      case 'deadline':
        sort = { applicationDeadline: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { name: 1 };
    }

    let programs;
    let total;

    if (Object.keys(universityFilter).length > 0) {
      // If country filter is applied, we need to join with universities
      const universities = await University.find(universityFilter).select('_id');
      const universityIds = universities.map(u => u._id);
      
      filter.universityId = { $in: universityIds };
      
      programs = await Program.find(filter)
        .populate('universityId', 'name country city logoUrl ranking')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Program.countDocuments(filter);
    } else {
      programs = await Program.find(filter)
        .populate('universityId')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Program.countDocuments(filter);
    }

    res.json({
      success: true,
      data: {
        programs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Search programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching programs'
    });
  }
};

//GET->   Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('universityId');

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      data: {
        program
      }
    });

  } catch (error) {
    console.error('Get program by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching program'
    });
  }
};

//GET->   Get university by ID
const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Get university programs
    const programs = await Program.find({ 
      universityId: req.params.id,
      isActive: true 
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: {
        university,
        programs
      }
    });

  } catch (error) {
    console.error('Get university by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching university'
    });
  }
};

module.exports = {
  searchUniversities,
  searchPrograms,
  getProgramById,
  getUniversityById
};