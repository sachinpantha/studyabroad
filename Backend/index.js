const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();

// Compression middleware
app.use(compression());

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://studyabroad-pi.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/applications', require('./src/routes/applications'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/documents', require('./src/routes/documents'));
app.use('/api/profile', require('./src/routes/profile'));
app.use('/api/profile', require('./src/routes/profileKYC'));
app.use('/api/universities', require('./src/routes/universities'));
app.use('/api/blog', require('./src/routes/blog'));
app.use('/api/notices', require('./src/routes/notices'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));