const mongoose = require('mongoose');
const University = require('./src/models/University');
require('dotenv').config();

const universities = [
  {
    name: "Indian Institute of Technology Delhi",
    country: "India",
    city: "New Delhi",
    ranking: 1,
    description: "Premier engineering institute in India",
    website: "https://iitd.ac.in",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg",
    courses: [
      { name: "Computer Science Engineering", duration: "4 years", tuitionFee: 200000, requirements: { minGPA: 3.8, englishTest: "IELTS", minScore: 6.5 } },
      { name: "Mechanical Engineering", duration: "4 years", tuitionFee: 200000, requirements: { minGPA: 3.7, englishTest: "IELTS", minScore: 6.0 } }
    ],
    scholarships: [
      { name: "Merit Scholarship", amount: 100000, percentage: 50, minGPA: 3.8, criteria: "Top 10% students" },
      { name: "Nepal Student Scholarship", amount: 80000, percentage: 40, minGPA: 3.5, criteria: "Nepali nationals" }
    ],
    admissionRequirements: { minGPA: 3.5, englishTest: "IELTS", documents: ["transcript", "passport", "SOP"] }
  },
  {
    name: "All India Institute of Medical Sciences",
    country: "India",
    city: "New Delhi",
    ranking: 1,
    description: "Top medical college in India",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7d/All_India_Institute_of_Medical_Sciences%2C_New_Delhi_Logo.png",
    courses: [
      { name: "MBBS", duration: "5.5 years", tuitionFee: 150000, requirements: { minGPA: 3.9, englishTest: "IELTS", minScore: 7.0 } }
    ],
    scholarships: [
      { name: "Medical Merit Scholarship", amount: 75000, percentage: 50, minGPA: 3.8, criteria: "Medical students" }
    ],
    admissionRequirements: { minGPA: 3.8, englishTest: "IELTS" }
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    country: "India",
    city: "Ahmedabad",
    ranking: 1,
    description: "Premier management institute",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/4e/Indian_Institute_of_Management_Ahmedabad_Logo.svg",
    courses: [
      { name: "MBA", duration: "2 years", tuitionFee: 2500000, requirements: { minGPA: 3.6, englishTest: "IELTS", minScore: 6.5 } }
    ],
    scholarships: [
      { name: "Management Scholarship", amount: 500000, percentage: 20, minGPA: 3.7, criteria: "Outstanding academics" }
    ],
    admissionRequirements: { minGPA: 3.5, englishTest: "IELTS" }
  },
  {
    name: "Manipal Academy of Higher Education",
    country: "India",
    city: "Manipal",
    ranking: 15,
    description: "Leading private university",
    logo: "https://upload.wikimedia.org/wikipedia/en/e/e4/Manipal_Academy_of_Higher_Education_logo.png",
    courses: [
      { name: "Computer Science", duration: "4 years", tuitionFee: 400000, requirements: { minGPA: 3.2, englishTest: "IELTS", minScore: 6.0 } },
      { name: "Medicine", duration: "5.5 years", tuitionFee: 1800000, requirements: { minGPA: 3.5, englishTest: "IELTS", minScore: 6.5 } }
    ],
    scholarships: [
      { name: "Nepal Scholarship", amount: 200000, percentage: 50, minGPA: 3.0, criteria: "Nepali students" },
      { name: "Merit Scholarship", amount: 150000, percentage: 30, minGPA: 3.5, criteria: "Academic excellence" }
    ],
    admissionRequirements: { minGPA: 3.0, englishTest: "IELTS" }
  },
  {
    name: "Lovely Professional University",
    country: "India",
    city: "Phagwara",
    ranking: 25,
    description: "Large private university with diverse programs",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/14/Lovely_Professional_University_logo.png",
    courses: [
      { name: "Engineering", duration: "4 years", tuitionFee: 300000, requirements: { minGPA: 2.8, englishTest: "IELTS", minScore: 5.5 } },
      { name: "Management", duration: "3 years", tuitionFee: 250000, requirements: { minGPA: 2.5, englishTest: "IELTS", minScore: 5.5 } }
    ],
    scholarships: [
      { name: "International Scholarship", amount: 150000, percentage: 50, minGPA: 2.8, criteria: "International students" },
      { name: "Sports Scholarship", amount: 100000, percentage: 40, minGPA: 2.5, criteria: "Sports achievements" }
    ],
    admissionRequirements: { minGPA: 2.5, englishTest: "IELTS" }
  }
];

async function seedUniversities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await University.deleteMany({});
    await University.insertMany(universities);
    
    console.log('Universities seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding universities:', error);
    process.exit(1);
  }
}

seedUniversities();