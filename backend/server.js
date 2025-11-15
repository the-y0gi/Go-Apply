const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const University = require('./models/University');
const Program = require('./models/Program');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const paymentRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const staticRoutes = require('./routes/static');
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const progressRoutes = require("./routes/progress");
const notificationRoutes = require("./routes/notification");
const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: { error: 'Too many requests from this IP, please try again later.' },
});

// Middleware
app.use(limiter);
app.use(morgan('dev'));
app.use(
  cors({
    // origin: process.env.CLIENT_URL || 'http://localhost:3000',
    // credentials: true,
    origin: "*"
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GoApply Backend Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/static', staticRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/progress", progressRoutes);
app.use('/api/notifications', notificationRoutes);


// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};


// Seed Data (Run manually once if needed)
const seedData = async () => {
  try {
    console.log('Starting seed process...');

    await University.deleteMany({});
    await Program.deleteMany({});

    // ---------------- UNIVERSITY SEED ----------------
    const universities = await University.insertMany([
      {
        name: 'University of Melbourne',
        country: 'Australia',
        city: 'Melbourne',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/en/7/7e/University_of_Melbourne_coat_of_arms.svg',
        description:
          'A leading international university with a strong focus on research, innovation, and teaching excellence.',
        ranking: { global: 33 },
        website: 'https://www.unimelb.edu.au',
        contactEmail: 'admissions@unimelb.edu.au',
        establishedYear: 1853,
        totalStudents: 50000,
        internationalStudents: 18000,
        featured: true,
      },
      {
        name: 'Monash University',
        country: 'Australia',
        city: 'Melbourne',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/en/6/6d/Monash_University_coat_of_arms.svg',
        description:
          'Monash University is a leading Australian institution known for innovation and global connections.',
        ranking: { global: 42 },
        website: 'https://www.monash.edu',
        contactEmail: 'admissions@monash.edu',
        establishedYear: 1958,
        totalStudents: 86000,
        internationalStudents: 30000,
        featured: true,
      },
      {
        name: 'Australian National University',
        country: 'Australia',
        city: 'Canberra',
        logoUrl:
          'https://upload.wikimedia.org/wikipedia/en/5/5e/Australian_National_University_coat_of_arms.svg',
        description:
          'Australia’s top-ranked research university offering a diverse range of programs and disciplines.',
        ranking: { global: 34 },
        website: 'https://www.anu.edu.au',
        contactEmail: 'admissions@anu.edu.au',
        establishedYear: 1946,
        totalStudents: 25000,
        internationalStudents: 9000,
        featured: true,
      },
    
    ]);

    console.log('Universities created:', universities.length);

    // ---------------- PROGRAM SEED ----------------
    const programs = await Program.insertMany([
      {
        universityId: universities[0]._id, // Melbourne
        name: 'Master of Data Science',
        degreeType: 'masters',
        fieldOfStudy: 'Data Science',
        duration: '2 years',

        tuitionFee: {
          amount: 45924,
          currency: 'AUD',
          frequency: 'per_year',
        },

        applicationFee: 100,

        applicationDeadline: new Date('2025-12-28'),
        intake: ['fall', 'spring'],

        requirements: {
          minGPA: 3.5,
          englishTests: [{ testType: 'IELTS', minScore: 6.5 }],
          workExperience: { required: true, minYears: 2 },
          documentsRequired: ['transcript', 'sop', 'lor', 'resume'],
        },

        description:
          'A comprehensive data science program focusing on ML, AI, statistics, and big data analytics.',

        totalSeats: 50,
        internationalSeats: 25,
        acceptanceRate: 15,
        featured: true,
      },

      {
        universityId: universities[1]._id, // Monash
        name: 'Bachelor of Engineering (Software)',
        degreeType: 'bachelors',
        fieldOfStudy: 'Software Engineering',
        duration: '4 years',

        tuitionFee: {
          amount: 42000,
          currency: 'AUD',
          frequency: 'per_year',
        },

        applicationFee: 120,

        applicationDeadline: new Date('2025-12-01'),
        intake: ['fall'],

        requirements: {
          minGPA: 3.2,
          englishTests: [{ testType: 'IELTS', minScore: 6.0 }],
          documentsRequired: ['transcript', 'sop'],
        },

        description:
          'Core software development degree covering programming, AI, and system design.',

        totalSeats: 150,
        internationalSeats: 60,
        acceptanceRate: 20,
        featured: true,
      },
    ]);

    console.log('Programs created:', programs.length);
    console.log('Seed data completed successfully!');
  } catch (error) {
    console.error('Seed data error:', error);
  }
};

// Uncomment this line ONCE when you want to seed
// seedData();



// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`GoApply Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
