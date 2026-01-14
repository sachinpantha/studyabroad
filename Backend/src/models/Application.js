const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
  customUniversity: { type: String },
  course: { type: String, required: true },
  intake: { type: String, required: true },
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
  documents: [{
    name: String,
    path: String,
    cloudinaryUrl: String,
    originalName: String,
    uploadDate: { type: Date, default: Date.now },
    source: { type: String, enum: ['kyc', 'upload'], default: 'upload' }
  }],
  status: { 
    type: String, 
    enum: ['applied', 'under-review', 'offer-received', 'enrolled', 'reported-to-college', 'rejected'], 
    default: 'applied' 
  },
  adminNotes: { type: String, default: '' },
  applicationFee: Number,
  isPaid: { type: Boolean, default: false },
  offerLetter: String,
  enrollmentDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);