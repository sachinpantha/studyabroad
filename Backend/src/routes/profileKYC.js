const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Update KYC profile information
router.put('/kyc', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    user.profile = {
      ...user.profile,
      ...req.body,
      emergencyContact: {
        ...user.profile.emergencyContact,
        ...req.body.emergencyContact
      },
      academic: {
        ...user.profile.academic,
        ...req.body.academic
      }
    };

    // Check profile completion
    user.checkProfileCompletion();
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('KYC update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload KYC documents - MulterError occurs when field names don't match between frontend formData.append() and backend upload.fields()
router.post('/documents', auth, upload.single('document'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      file: req.file ? 'File present' : 'No file',
      body: req.body,
      documentType: req.body.documentType
    });
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.body.documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    // Process uploaded file
    if (req.file) {
      const documentType = req.body.documentType; // Get document type from form data
      const existingDocIndex = user.profile.documents.findIndex(doc => doc.type === documentType);
      const docData = {
        type: documentType,
        name: req.file.originalname,
        path: req.file.path,
        cloudinaryUrl: req.file.path,
        status: 'uploaded',
        uploadDate: new Date()
      };

      if (existingDocIndex >= 0) {
        user.profile.documents[existingDocIndex] = docData;
      } else {
        user.profile.documents.push(docData);
      }
    }

    // Check profile completion
    user.checkProfileCompletion();
    
    await user.save();
    res.json({ message: 'Documents uploaded successfully', user });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile completion status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isComplete = user.checkProfileCompletion();
    res.json({ 
      profileComplete: isComplete,
      profile: user.profile 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;