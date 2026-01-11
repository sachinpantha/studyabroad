const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get published blogs
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 6 } = req.query;
    let query = { isPublished: true };
    
    if (category) query.category = category;
    
    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    res.json({ blogs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog || !blog.isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test route
router.post('/test', auth, async (req, res) => {
  try {
    console.log('User:', req.user);
    console.log('Body:', req.body);
    res.json({ message: 'Test successful', user: req.user.name, isAdmin: req.user.isAdmin });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    
    const blog = new Blog({
      ...req.body,
      author: req.user._id,
      publishDate: req.body.isPublished ? new Date() : null
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/all', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Blog fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, publishDate: req.body.isPublished ? new Date() : null },
      { new: true }
    );
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;