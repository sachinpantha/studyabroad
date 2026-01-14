const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profile: {
    dateOfBirth: Date,
    nationality: String,
    passportNumber: String,
    address: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    academic: {
      highestQualification: String,
      institution: String,
      gpa: Number,
      graduationYear: Number,
      fieldOfStudy: String
    },
    documents: [{
      type: { type: String, enum: ['passport', 'transcript', 'certificate', 'ielts', 'toefl', 'transcripts', 'englishTest', 'sop', 'cv', 'citizenship', 'other'] },
      name: String,
      path: String,
      cloudinaryUrl: String,
      status: { type: String, enum: ['pending', 'uploaded', 'verified'], default: 'pending' },
      uploadDate: Date
    }],
    profileComplete: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.checkProfileCompletion = function() {
  const required = ['dateOfBirth', 'nationality', 'academic.gpa', 'academic.institution'];
  const hasRequired = required.every(field => {
    const keys = field.split('.');
    let value = this.profile;
    for (let key of keys) {
      value = value?.[key];
    }
    return value !== undefined && value !== null && value !== '';
  });
  
  const hasDocuments = this.profile.documents && this.profile.documents.length > 0;
  this.profile.profileComplete = hasRequired;
  return this.profile.profileComplete;
};

module.exports = mongoose.model('User', userSchema);