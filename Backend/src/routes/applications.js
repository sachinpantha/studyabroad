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
    
    // Get user's KYC documents
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const kycDocuments = user?.profile?.documents || [];
    
    // Copy KYC documents to application documents
    const applicationDocuments = kycDocuments.map(doc => ({
      name: doc.type,
      path: doc.path || doc.cloudinaryUrl,
      cloudinaryUrl: doc.cloudinaryUrl || doc.path,
      originalName: doc.name,
      uploadDate: new Date(),
      source: 'kyc'
    }));
    
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
      documents: applicationDocuments // Include KYC documents
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
  // Skip file upload if no files, use simple route
  const hasFiles = req.headers['content-type']?.includes('multipart/form-data');
  
  if (!hasFiles) {
    return res.status(400).json({ 
      success: false, 
      message: 'Use /simple endpoint for applications without files' 
    });
  }
  
  const uploadMiddleware = upload.fields([
    { name: 'transcripts', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'citizenship', maxCount: 1 },
    { name: 'englishTest', maxCount: 1 },
    { name: 'sop', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, async (uploadError) => {
    try {
      console.log('Cloudinary config check:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
        api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
      });
      
      if (uploadError) {
        console.error('Multer upload error:', uploadError);
        return res.status(400).json({ 
          success: false, 
          message: `Upload error: ${uploadError.message || 'File processing failed'}` 
        });
      }
      
      if (!req.body.applicationData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Application data is required' 
        });
      }
      
      let applicationData;
      try {
        applicationData = JSON.parse(req.body.applicationData);
      } catch (parseError) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid application data format' 
        });
      }
      
      const { personalInfo, academicInfo, preferredCourse, intake } = applicationData;
      
      if (!personalInfo?.fullName || !academicInfo?.highestQualification || !preferredCourse || !intake) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      
      // Get user's KYC documents
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      const kycDocuments = user?.profile?.documents || [];
      
      const documents = [];
      
      // Add KYC documents first
      kycDocuments.forEach(doc => {
        documents.push({
          name: doc.type,
          path: doc.path || doc.cloudinaryUrl,
          cloudinaryUrl: doc.cloudinaryUrl || doc.path,
          originalName: doc.name,
          source: 'kyc'
        });
      });
      
      // Add newly uploaded documents
      if (req.files) {
        Object.entries(req.files).forEach(([key, fileArray]) => {
          if (fileArray?.[0]) {
            documents.push({
              name: key,
              path: fileArray[0].path,
              cloudinaryUrl: fileArray[0].path,
              originalName: fileArray[0].originalname,
              source: 'upload'
            });
          }
        });
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
        customUniversity: applicationData.customUniversityName || 'General Application',
        documents
      });
      
      await application.save();
      res.status(201).json({ success: true, data: application });
      
    } catch (error) {
      console.error('Application creation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during application creation' 
      });
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
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;