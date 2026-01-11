const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile = { ...user.profile, ...req.body };
    user.checkProfileCompletion();
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload document
router.post('/documents', auth, upload.single('document'), async (req, res) => {
  try {
    const { type } = req.body;
    const user = await User.findById(req.user.id);
    
    const document = {
      type,
      name: req.file.filename,
      path: req.file.path,
      cloudinaryUrl: req.file.path,
      status: 'uploaded',
      uploadDate: new Date()
    };
    
    user.profile.documents.push(document);
    user.checkProfileCompletion();
    await user.save();
    
    res.json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending documents
router.get('/pending-documents', auth, async (req, res) => {
  try {
    const requiredDocs = ['passport', 'transcript', 'certificate'];
    const user = await User.findById(req.user.id);
    const uploadedTypes = user.profile.documents?.map(doc => doc.type) || [];
    const pending = requiredDocs.filter(type => !uploadedTypes.includes(type));
    res.json({ pending, total: requiredDocs.length, uploaded: uploadedTypes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;