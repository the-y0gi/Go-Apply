const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
require('dotenv').config();

// const University = require('./models/University');
// const Program = require('./models/Program');
// require('dotenv').config();


// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('../backend/routes/users');
const documentRoutes = require('../backend/routes/documents');
const paymentRoutes = require('../backend/routes/payments');
const dashboardRoutes = require('../backend/routes/dashboard');
const searchRoutes = require('../backend/routes/search');
const staticRoutes = require('../backend/routes/static');
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');


const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(limiter);
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded documents)
app.use('/uploads', express.static('uploads'));



// const seedData = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');

//     // Clear existing data
//     await University.deleteMany({});
//     await Program.deleteMany({});

//     // Create universities
//     const universities = await University.insertMany([
//       {
//         name: 'University of Melbourne',
//         country: 'Australia',
//         city: 'Melbourne',
//         logoUrl: 'https://example.com/melbourne-logo.jpg',
//         description: 'A leading international university with a outstanding reputation for excellence in teaching and research.',
//         ranking: { global: 33 },
//         website: 'https://www.unimelb.edu.au',
//         contactEmail: 'admissions@unimelb.edu.au',
//         establishedYear: 1853,
//         totalStudents: 50000,
//         internationalStudents: 18000,
//         applicationFee: 100,
//         featured: true
//       },
//       {
//         name: 'University of Toronto',
//         country: 'Canada', 
//         city: 'Toronto',
//         logoUrl: 'https://example.com/toronto-logo.jpg',
//         description: 'One of Canada\'s top universities, located in the heart of Toronto.',
//         ranking: { global: 21 },
//         website: 'https://www.utoronto.ca',
//         contactEmail: 'admissions@utoronto.ca',
//         establishedYear: 1827,
//         totalStudents: 90000,
//         internationalStudents: 25000,
//         applicationFee: 120,
//         featured: true
//       },
//       {
//         name: 'Imperial College London',
//         country: 'United Kingdom',
//         city: 'London',
//         logoUrl: 'https://example.com/imperial-logo.jpg',
//         description: 'A world-class university with a focus on science, engineering, medicine, and business.',
//         ranking: { global: 6 },
//         website: 'https://www.imperial.ac.uk',
//         contactEmail: 'admissions@imperial.ac.uk',
//         establishedYear: 1907,
//         totalStudents: 20000,
//         internationalStudents: 9000,
//         applicationFee: 80,
//         featured: true
//       }
//     ]);

//     console.log('Universities created:', universities.length);

//     // Create programs
//     const programs = await Program.insertMany([
//       {
//         universityId: universities[0]._id, // Melbourne
//         name: 'Master of Data Science',
//         degreeType: 'masters',
//         fieldOfStudy: 'Data Science',
//         duration: '2 years',
//         tuitionFee: {
//           amount: 45924,
//           currency: 'AUD',
//           frequency: 'per_year'
//         },
//         applicationDeadline: new Date('2025-02-28'),
//         intake: ['fall', 'spring'],
//         requirements: {
//           minGPA: 3.5,
//           englishTests: [
//             {
//               testType: 'IELTS',
//               minScore: 6.5
//             }
//           ],
//           workExperience: {
//             required: true,
//             minYears: 2
//           },
//           documentsRequired: ['transcript', 'sop', 'lor', 'resume']
//         },
//         description: 'A comprehensive data science program focusing on machine learning, statistics, and data analysis.',
//         totalSeats: 50,
//         internationalSeats: 25,
//         acceptanceRate: 15,
//         featured: true
//       },
//       {
//         universityId: universities[1]._id, // Toronto
//         name: 'Bachelor of Science in Computer Science',
//         degreeType: 'bachelors',
//         fieldOfStudy: 'Computer Science',
//         duration: '4 years',
//         tuitionFee: {
//           amount: 45000,
//           currency: 'CAD', 
//           frequency: 'per_year'
//         },
//         applicationDeadline: new Date('2025-01-15'),
//         intake: ['fall'],
//         requirements: {
//           minGPA: 3.7,
//           englishTests: [
//             {
//               testType: 'IELTS',
//               minScore: 6.5
//             }
//           ],
//           standardizedTests: [
//             {
//               testType: 'SAT',
//               minScore: 1400
//             }
//           ],
//           documentsRequired: ['transcript', 'sop', 'lor']
//         },
//         description: 'A rigorous computer science program covering algorithms, software engineering, and systems design.',
//         totalSeats: 200,
//         internationalSeats: 60,
//         acceptanceRate: 12,
//         featured: true
//       }
//     ]);

//     console.log('Programs created:', programs.length);
//     console.log('Seed data completed successfully!');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('Seed data error:', error);
//     process.exit(1);
//   }
// };

// seedData();

// Health check route

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GoApply Backend Server is running!',
    timestamp: new Date().toISOString()
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


// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});


// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` GoApply Backend Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;