import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/AnimatedCounter';
import Testimonials from '../components/Testimonials';
import { AcademicCapIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section Defined */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-aos="fade-up">
              Your Gateway to
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Global Education
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 font-light" data-aos="fade-up" data-aos-delay="200">
              Transform your dreams into reality with expert guidance for studying abroad
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 animate-ping"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support for your study abroad journey
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg card-hover text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <AcademicCapIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Expert Guidance</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Professional consultancy with personalized support</p>
              <ul className="text-left space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  University Selection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  Course Matching
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  Visa Assistance
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  Career Counseling
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg card-hover text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <GlobeAltIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Global Network</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Partnerships with top universities worldwide</p>
              <ul className="text-left space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  500+ Universities
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  25+ Countries
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Scholarship Programs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  Direct Admissions
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg card-hover text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrophyIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Success Stories</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Proven track record of successful placements</p>
              <ul className="text-left space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  98% Success Rate
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  10K+ Students Placed
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  Top University Admits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  Alumni Network
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div>
              <AnimatedCounter end={10} suffix="K+" />
              <div className="text-lg sm:text-xl text-blue-100">Students Helped</div>
            </div>
            <div>
              <AnimatedCounter end={50} suffix="+" />
              <div className="text-lg sm:text-xl text-blue-100">Universities</div>
            </div>
            <div>
              <AnimatedCounter end={25} suffix="+" />
              <div className="text-lg sm:text-xl text-blue-100">Countries</div>
            </div>
            <div>
              <AnimatedCounter end={98} suffix="%" />
              <div className="text-lg sm:text-xl text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Study Destinations
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Choose from top study destinations worldwide</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                country: 'USA',
                flag: '🇺🇸',
                unis: '4000+',
                image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop&auto=format',
                landmark: 'Statue of Liberty'
              },
              {
                country: 'UK',
                flag: '🇬🇧',
                unis: '150+',
                image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&auto=format',
                landmark: 'Big Ben'
              },
              {
                country: 'Canada',
                flag: '🇨🇦',
                unis: '100+',
                image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&auto=format',
                landmark: 'CN Tower'
              },
              {
                country: 'Australia',
                flag: '🇦🇺',
                unis: '40+',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
                landmark: 'Sydney Opera House'
              },
              {
                country: 'Germany',
                flag: '🇩🇪',
                unis: '400+',
                image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop&auto=format',
                landmark: 'Brandenburg Gate'
              },
              {
                country: 'France',
                flag: '🇫🇷',
                unis: '300+',
                image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop&auto=format',
                landmark: 'Eiffel Tower'
              }
            ].map((dest, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group" data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.landmark}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                    <div className="text-2xl sm:text-3xl mb-1">{dest.flag}</div>
                    <p className="text-xs sm:text-sm opacity-90">{dest.landmark}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2">{dest.country}</h3>
                  <p className="text-blue-600 font-semibold text-sm sm:text-base">{dest.unis} Universities</p>
                  <button className="mt-3 sm:mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium hover:shadow-lg transition-all">
                    Explore Programs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-400 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of students who achieved their dreams with us
          </p>
          {isAuthenticated ? (
            <Link
              to="/apply"
              className="bg-white text-orange-500 px-10 py-4 rounded-full text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Apply Now →
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-orange-500 px-10 py-4 rounded-full text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Get Started Today →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                StudyAbroad
              </h3>
              <p className="text-gray-400">
                Your trusted partner for international education
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Application Assistance</li>
                <li>Document Verification</li>
                <li>Visa Guidance</li>
                <li>University Selection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@studyabroad.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Education St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyAbroad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;