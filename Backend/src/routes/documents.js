const express = require('express');
const path = require('path');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Serve uploaded documents (admin only)
router.get('/:filename', auth, adminAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;