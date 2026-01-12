const express = require('express');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create application without files
router.post('/simple', auth, async (req, res) => {
  try {
    console.log('=== SIMPLE APPLICATION DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user._id);
    
    // Validate required fields
    const { personalInfo, academicInfo, preferredCourse, intake } = req.body;
    
    if (!personalInfo || !personalInfo.fullName) {
      return res.status(400).json({ success: false, message: 'Personal info is required' });
    }
    if (!academicInfo || !academicInfo.highestQualification) {
      return res.status(400).json({ success: false, message: 'Academic info is required' });
    }
    if (!preferredCourse) {
      return res.status(400).json({ success: false, message: 'Course is required' });
    }
    if (!intake) {
      return res.status(400).json({ success: false, message: 'Intake is required' });
    }
    
    const application = new Application({
      userId: req.user._id,
      personalInfo: {
        fullName: personalInfo.fullName,
        dateOfBirth: personalInfo.dateOfBirth,
        nationality: personalInfo.nationality,
        passportNumber: personalInfo.passportNumber
      },
      academicInfo: {
        highestQualification: academicInfo.highestQualification,
        institution: academicInfo.institution,
        gpa: parseFloat(academicInfo.gpa),
        graduationYear: parseInt(academicInfo.graduationYear)
      },
      course: preferredCourse,
      intake: intake,
      customUniversity: req.body.customUniversityName || 'General Application',
      documents: []
    });
    
    console.log('Application data before save:', JSON.stringify(application.toObject(), null, 2));
    
    await application.save();
    console.log('Application saved successfully');
    
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('=== APPLICATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: `Validation failed: ${validationErrors.join(', ')}` });
    }
    
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Create application with files
router.post('/', auth, (req, res) => {
  upload.fields([
    { name: 'transcripts', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'citizenship', maxCount: 1 },
    { name: 'englishTest', maxCount: 1 },
    { name: 'sop', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ])(req, res, async (err) => {
    try {
      console.log('=== FILE UPLOAD DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      console.log('Upload error:', err);
      
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
      }
      
      let applicationData;
      try {
        applicationData = req.body.applicationData ? JSON.parse(req.body.applicationData) : req.body;
      } catch (parseError) {
        return res.status(400).json({ success: false, message: 'Invalid JSON in applicationData' });
      }
      
      const course = applicationData.course || applicationData.preferredCourse;
      const intake = applicationData.intake;
      
      if (!course) {
        return res.status(400).json({ success: false, message: 'Course is required' });
      }
      if (!intake) {
        return res.status(400).json({ success: false, message: 'Intake is required' });
      }
      
      const documents = [];
      if (req.files && Object.keys(req.files).length > 0) {
        Object.keys(req.files).forEach(key => {
          if (req.files[key] && req.files[key][0]) {
            documents.push({
              name: key,
              path: req.files[key][0].path,
              cloudinaryUrl: req.files[key][0].path,
              originalName: req.files[key][0].originalname
            });
          }
        });
      }
      
      const appData = {
        userId: req.user._id,
        personalInfo: applicationData.personalInfo,
        academicInfo: applicationData.academicInfo,
        course: course,
        intake: intake,
        customUniversity: applicationData.customUniversityName || 'General Application',
        documents
      };
      
      const application = new Application(appData);
      await application.save();
      
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      console.error('=== FILE APPLICATION ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ success: false, message: `Validation failed: ${validationErrors.join(', ')}` });
      }
      
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  });
});

// Get user applications
router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload documents
router.post('/:id/documents', auth, upload.array('documents', 5), async (req, res) => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      path: file.path
    }));

    application.documents.push(...documents);
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;