const express = require('express');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create application without files
router.post('/simple', auth, async (req, res) => {
  try {
    const application = new Application({
      userId: req.user._id,
      ...req.body,
      documents: []
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Simple application creation error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
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
    
    const documents = [];
    if (req.files && Object.keys(req.files).length > 0) {
      Object.keys(req.files).forEach(key => {
        if (req.files[key] && req.files[key][0]) {
          documents.push({
            name: key,
            path: req.files[key][0].path,
            originalName: req.files[key][0].originalname
          });
        }
      });
    }
    
    const application = new Application({
      userId: req.user._id,
      ...applicationData,
      documents
    });
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