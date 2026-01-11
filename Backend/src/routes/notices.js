const express = require('express');
const multer = require('multer');
const path = require('path');
const Notice = require('../models/Notice');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/notices/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get active notices (for logged users)
router.get('/', auth, async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('title content createdAt');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice (admin only)
router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = new Notice({
      title,
      content,
      image: req.file ? req.file.filename : null,
      createdBy: req.user.id
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notices (admin only)
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notice (admin only)
router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const notice = await Notice.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;