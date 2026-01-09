const express = require('express');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create application
router.post('/', auth, async (req, res) => {
  try {
    const application = new Application({
      userId: req.user._id,
      ...req.body
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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