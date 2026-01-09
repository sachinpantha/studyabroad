import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          StudyAbroad
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">Hi, {user?.name}!</span>
              {user?.isAdmin ? (
                <Link to="/admin" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/apply" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                    Apply Now
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-6 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="text-gray-700 font-medium border-b border-gray-100 pb-3 mb-3">Hi, {user?.name}!</div>
                {user?.isAdmin ? (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-blue-600 hover:text-blue-800 font-medium py-3 px-2 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/apply" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all mt-4"
                    >
                      Apply Now
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-800 font-medium py-3 px-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all text-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all text-lg mt-3"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;