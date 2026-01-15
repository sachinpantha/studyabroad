import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, t, toggleLanguage } = useLanguage();
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
        
        <div className="flex items-center gap-4">
          {/* Language Toggle - Desktop */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-200"
            title={language === 'en' ? 'Switch to Nepali' : 'अंग्रेजीमा स्विच गर्नुहोस्'}
          >
            <span className="text-lg">{language === 'en' ? '🇳🇵' : '🇬🇧'}</span>
            <span className="font-medium text-gray-700">{language === 'en' ? 'नेपाली' : 'English'}</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {!user?.isAdmin && (
                  <>
                    <Link to="/universities" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('universities')}
                    </Link>
                    <Link to="/scholarship-calculator" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('scholarships')}
                    </Link>
                    <Link to="/notices" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('notices')}
                    </Link>
                    <Link to="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('faq')}
                    </Link>
                    <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('blog')}
                    </Link>
                  </>
                )}
                <span className="text-gray-700 font-medium">{t('hi')}, {user?.name}!</span>
                {user?.isAdmin ? (
                  <Link to="/admin" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    {t('adminPanel')}
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      {t('dashboard')}
                    </Link>
                    <Link to="/apply" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                      {t('applyNow')}
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  {t('faq')}
                </Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  {t('blog')}
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                  {t('getStarted')}
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
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-6 space-y-3">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-200 mb-4"
            >
              <span className="text-lg">{language === 'en' ? '🇳🇵' : '🇬🇧'}</span>
              <span className="font-medium text-gray-700">{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>
            
            {isAuthenticated ? (
              <>
                <div className="text-gray-700 font-medium border-b border-gray-100 pb-3 mb-3">{t('hi')}, {user?.name}!</div>
                {user?.isAdmin ? (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-blue-600 hover:text-blue-800 font-medium py-3 px-2 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    {t('adminPanel')}
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/universities" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('universities')}
                    </Link>
                    <Link 
                      to="/scholarship-calculator" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('scholarships')}
                    </Link>
                    <Link 
                      to="/notices" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('notices')}
                    </Link>
                    <Link 
                      to="/faq" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('faq')}
                    </Link>
                    <Link 
                      to="/blog" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('blog')}
                    </Link>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t('dashboard')}
                    </Link>
                    <Link 
                      to="/apply" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all mt-4"
                    >
                      {t('applyNow')}
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-800 font-medium py-3 px-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full text-center font-medium shadow-md hover:shadow-lg transition-all mt-3"
                >
                  {t('getStarted')}
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
