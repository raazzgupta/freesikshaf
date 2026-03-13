require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const lectureRoutes = require('./src/routes/lectureRoutes');
const sectionRoutes = require('./src/routes/sectionRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const discussionRoutes = require('./src/routes/discussionRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting (as requested by user)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

/////////////////////////////////////////////////////////////////////

console.log("authRoutes:", typeof authRoutes);
console.log("courseRoutes:", typeof courseRoutes);
console.log("enrollmentRoutes:", typeof enrollmentRoutes);
console.log("certificateRoutes:", typeof certificateRoutes);
console.log("aiRoutes:", typeof aiRoutes);
console.log("adminRoutes:", typeof adminRoutes);
console.log("lectureRoutes:", typeof lectureRoutes);
console.log("sectionRoutes:", typeof sectionRoutes);
console.log("reviewRoutes:", typeof reviewRoutes);
console.log("discussionRoutes:", typeof discussionRoutes);



















































////////////////////////////////////////////////////////










// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discussions', discussionRoutes);

// Root route for basic health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
