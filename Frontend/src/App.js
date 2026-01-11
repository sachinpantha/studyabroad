import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import NepalHome from './pages/NepalHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import NepalScholarshipCalculator from './pages/NepalScholarshipCalculator';
import Blog from './pages/Blog';
import Apply from './pages/Apply';
import ApplyToUniversity from './pages/ApplyToUniversity';
import ApplicationDetails from './pages/ApplicationDetails';
import EnhancedAdminPanel from './pages/EnhancedAdminPanel';
import Notices from './pages/Notices';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<NepalHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/universities" element={
              <ProtectedRoute>
                <Universities />
              </ProtectedRoute>
            } />
            <Route path="/university/:id" element={
              <ProtectedRoute>
                <UniversityDetail />
              </ProtectedRoute>
            } />
            <Route path="/apply/:universityId" element={
              <ProtectedRoute>
                <ApplyToUniversity />
              </ProtectedRoute>
            } />
            <Route path="/scholarship-calculator" element={
              <ProtectedRoute>
                <NepalScholarshipCalculator />
              </ProtectedRoute>
            } />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/apply" element={
              <ProtectedRoute>
                <Apply />
              </ProtectedRoute>
            } />
            <Route path="/application/:id" element={
              <ProtectedRoute>
                <ApplicationDetails />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <EnhancedAdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/notices" element={
              <ProtectedRoute>
                <Notices />
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;