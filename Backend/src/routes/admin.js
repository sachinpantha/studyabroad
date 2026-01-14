const express = require('express');
const Application = require('../models/Application');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all applications
router.get('/applications', auth, adminAuth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate('universityId', 'name country')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.patch('/applications/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    ).populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'applied' });
    const approvedApplications = await Application.countDocuments({ status: 'offer-received' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }
    
    // Delete user's documents from Cloudinary
    const cloudinary = require('cloudinary').v2;
    if (user.profile?.documents?.length > 0) {
      for (const doc of user.profile.documents) {
        if (doc.cloudinaryUrl) {
          const publicId = doc.cloudinaryUrl.split('/').slice(-2).join('/').split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          } catch (err) {
            console.error('Error deleting document:', err);
          }
        }
      }
    }
    
    // Delete application documents
    const applications = await Application.find({ userId: req.params.id });
    for (const app of applications) {
      if (app.documents?.length > 0) {
        for (const doc of app.documents) {
          if (doc.cloudinaryUrl) {
            const publicId = doc.cloudinaryUrl.split('/').slice(-2).join('/').split('.')[0];
            try {
              await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            } catch (err) {
              console.error('Error deleting document:', err);
            }
          }
        }
      }
    }
    
    await Application.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application
router.delete('/applications/:id', auth, adminAuth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Delete application documents from Cloudinary
    const cloudinary = require('cloudinary').v2;
    if (application.documents?.length > 0) {
      for (const doc of application.documents) {
        if (doc.cloudinaryUrl && doc.source === 'upload') {
          const publicId = doc.cloudinaryUrl.split('/').slice(-2).join('/').split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          } catch (err) {
            console.error('Error deleting document:', err);
          }
        }
      }
    }
    
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;