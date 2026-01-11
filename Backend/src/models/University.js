const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  ranking: Number,
  description: String,
  website: String,
  logo: String,
  courses: [{
    name: String,
    duration: String,
    tuitionFee: Number,
    requirements: {
      minGPA: Number,
      englishTest: String,
      minScore: Number
    }
  }],
  scholarships: [{
    name: String,
    amount: Number,
    percentage: Number,
    minGPA: Number,
    criteria: String
  }],
  facilities: [String],
  admissionRequirements: {
    minGPA: Number,
    englishTest: String,
    documents: [String]
  },
  applicationDeadlines: [{
    intake: String,
    deadline: Date
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);