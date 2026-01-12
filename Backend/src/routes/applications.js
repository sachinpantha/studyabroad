const express = require('express');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create application without files
router.post('/simple', auth, async (req, res) => {
  try {
    console.log('Simple application request:', req.body);
    
    const application = new Application({
      userId: req.user._id,
      personalInfo: req.body.personalInfo,
      academicInfo: req.body.academicInfo,
      course: req.body.preferredCourse,
      intake: req.body.intake,
      customUniversity: req.body.customUniversityName,
      documents: []
    });
    
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Simple application creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create application
router.post('/', auth, upload.fields([
  { name: 'transcripts', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'citizenship', maxCount: 1 },
  { name: 'englishTest', maxCount: 1 },
  { name: 'sop', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    let applicationData;
    if (req.body.applicationData) {
      applicationData = JSON.parse(req.body.applicationData);
    } else {
      applicationData = req.body;
    }
    
    // Validate required fields
    console.log('Received applicationData:', applicationData);
    
    // Map preferredCourse to course if it exists
    const course = applicationData.course || applicationData.preferredCourse;
    const intake = applicationData.intake;
    
    console.log('Course value:', course);
    console.log('Intake value:', intake);
    console.log('UniversityId:', applicationData.universityId);
    console.log('CustomUniversityName:', applicationData.customUniversityName);
    
    if (!course || course.trim() === '') {
      return res.status(400).json({ message: 'Course is required' });
    }
    if (!intake || intake.trim() === '') {
      return res.status(400).json({ message: 'Intake is required' });
    }
    if (!applicationData.universityId && (!applicationData.customUniversityName || applicationData.customUniversityName.trim() === '')) {
      return res.status(400).json({ message: 'University selection is required' });
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
    
    // Prepare application data
    const appData = {
      userId: req.user._id,
      ...applicationData,
      course: course, // Use mapped course value
      documents
    };
    
    // Handle custom university case
    if (!applicationData.universityId && applicationData.customUniversityName) {
      // Create a temporary universityId or handle custom university
      appData.customUniversity = applicationData.customUniversityName;
      // Set universityId to null for custom universities
      delete appData.universityId;
    }
    
    const application = new Application(appData);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Backend application creation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('Request files:', req.files);
    res.status(500).json({ message: error.message || 'Server error' });
  }
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