const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@studyabroad.com' });
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@studyabroad.com',
      password: 'admin123',
      phone: '1234567890',
      isAdmin: true
    });

    await admin.save();
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();