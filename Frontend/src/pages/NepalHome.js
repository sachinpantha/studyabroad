import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/AnimatedCounter';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    course: '',
    level: '',
    gpa: '',
    startDate: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchForm);
    navigate(`/universities?${params}`);
  };

  const handleInputChange = (e) => {
    setSearchForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Guided Search */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Study in India from Nepal
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find your perfect Indian university with scholarships up to 100%
          </p>

          {/* Guided Search Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left min-h-[3rem] flex items-start">What do you want to study?</label>
                  <select
                    name="course"
                    value={searchForm.course}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option value="">Select Course</option>
                    <option value="engineering">Engineering</option>
                    <option value="medical">Medical</option>
                    <option value="management">Management</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="pharmacy">Pharmacy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left min-h-[3rem] flex items-start">Level of Study</label>
                  <select
                    name="level"
                    value={searchForm.level}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option value="">Select Level</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left min-h-[3rem] flex items-start">Your GPA/Percentage</label>
                  <input
                    type="text"
                    name="gpa"
                    value={searchForm.gpa}
                    onChange={handleInputChange}
                    placeholder="e.g., 3.5 or 75%"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left min-h-[3rem] flex items-start">When to start?</label>
                  <select
                    name="startDate"
                    value={searchForm.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option value="">Select Intake</option>
                    <option value="2024-july">July 2024</option>
                    <option value="2024-september">September 2024</option>
                    <option value="2025-january">January 2025</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
                >
                  Find My Best Options
                </button>
                <Link
                  to="/apply"
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-all text-center"
                >
                  Apply for Free
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <AnimatedCounter end={500} duration={2000} />
              <p className="text-gray-600 mt-2">Nepali Students Placed</p>
            </div>
            <div>
              <AnimatedCounter end={200} duration={2000} />
              <p className="text-gray-600 mt-2">Indian Universities</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <p className="text-gray-600 mt-2">Scholarship Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">FREE</div>
              <p className="text-gray-600 mt-2">Application Process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in India */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose India for Higher Education?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Education</h3>
              <p className="text-gray-600">World-class universities with international recognition and affordable fees</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Scholarships Available</h3>
              <p className="text-gray-600">Merit-based scholarships up to 100% for Nepali students</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cultural Similarity</h3>
              <p className="text-gray-600">Similar culture, language, and easy adaptation for Nepali students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Universities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Indian Universities for Nepali Students</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "IIT Delhi", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg", courses: "Engineering, Technology", scholarship: "Up to 100%" },
              { name: "AIIMS Delhi", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg/500px-All_India_Institute_of_Medical_Sciences%2C_Delhi.svg.png", courses: "Medical, MBBS", scholarship: "Up to 75%" },
              { name: "IIM Ahmedabad", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/IIM%2C_Ahmedabad_Logo.svg/330px-IIM%2C_Ahmedabad_Logo.svg.png", courses: "Management, MBA", scholarship: "Up to 50%" },
              { name: "Manipal University", logo: "https://upload.wikimedia.org/wikipedia/en/3/30/Logo_of_Sikkim_Manipal_University.jpg", courses: "Multi-disciplinary", scholarship: "Up to 60%" },
              { name: "LPU Punjab", logo: "https://www.lpu.in/images/logo.png", courses: "All Streams", scholarship: "Up to 100%" },
              { name: "Amity University", logo: "https://www.amity.edu/images/amity-logo.png", courses: "Engineering, Management", scholarship: "Up to 40%" }
            ].map((uni, index) => (
              <div key={index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  <img src={uni.logo} alt={uni.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{uni.name}</h3>
                  <p className="text-gray-600 mb-3">{uni.courses}</p>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Scholarship: {uni.scholarship}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/universities" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              View All Universities
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />



      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Search & Filter", desc: "Find universities based on your preferences", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, color: "bg-blue-500" },
                { step: "2", title: "Check Eligibility", desc: "See scholarships you qualify for", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-green-500" },
                { step: "3", title: "Apply Online", desc: "Submit applications with our guidance", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: "bg-purple-500" },
                { step: "4", title: "Get Admission", desc: "Receive offers and start your journey", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>, color: "bg-orange-500" }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg relative z-10`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                StudyIndia Nepal
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner for studying in India from Nepal
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-xl">📧</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-xl">📞</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="text-xl">📍</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/universities" className="hover:text-white transition-colors">Universities</Link></li>
                <li><Link to="/scholarship-calculator" className="hover:text-white transition-colors">Scholarships</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Popular Courses</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Engineering</li>
                <li>Medical (MBBS)</li>
                <li>Management (MBA)</li>
                <li>Computer Science</li>
                <li>Pharmacy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@studyindia-nepal.com</li>
                <li>📞 +977-1-4567890</li>
                <li>📍 Kathmandu, Nepal</li>
                <li>🕒 Mon-Fri: 9AM-6PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyIndia Nepal. All rights reserved. | Helping Nepali students achieve their dreams in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;