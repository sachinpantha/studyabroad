const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    passportNumber: { type: String, required: true }
  },
  academicInfo: {
    highestQualification: { type: String, required: true },
    institution: { type: String, required: true },
    gpa: { type: Number, required: true },
    graduationYear: { type: Number, required: true }
  },
  preferredCountry: { type: String, required: true },
  preferredCourse: { type: String, required: true },
  documents: [{
    name: String,
    path: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'under-review', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);