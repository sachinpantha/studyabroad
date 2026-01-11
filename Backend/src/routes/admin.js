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

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;