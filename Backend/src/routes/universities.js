const express = require('express');
const router = express.Router();
const University = require('../models/University');
const { auth } = require('../middleware/auth');

// Get all universities with filters
router.get('/', async (req, res) => {
  try {
    const { country, course, minGPA, search, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };
    
    if (country) query.country = new RegExp(country, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { 'courses.name': new RegExp(search, 'i') }
      ];
    }
    
    const universities = await University.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ ranking: 1 });
    
    const total = await University.countDocuments(query);
    res.json({ universities, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get university by ID
router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    res.json(university);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Scholarship calculator
router.get('/scholarships/calculate', auth, async (req, res) => {
  try {
    const { gpa } = req.query;
    const userGPA = parseFloat(gpa);
    
    const eligibleUniversities = await University.find({
      isActive: true,
      'scholarships.minGPA': { $lte: userGPA }
    });
    
    const results = eligibleUniversities.map(uni => ({
      _id: uni._id,
      name: uni.name,
      country: uni.country,
      scholarships: uni.scholarships.filter(s => s.minGPA <= userGPA)
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search universities (for choose college feature)
router.get('/search/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    const universities = await University.find({
      name: new RegExp(q, 'i'),
      isActive: true
    }).select('name country').limit(10);
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;