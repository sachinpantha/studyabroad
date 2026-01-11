import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [pendingDocs, setPendingDocs] = useState({ pending: [], total: 0, uploaded: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, profileRes, docsRes] = await Promise.all([
        axios.get('/api/applications/my'),
        axios.get('/api/profile'),
        axios.get('/api/profile/pending-documents')
      ]);
      
      setApplications(appsRes.data);
      setProfile(profileRes.data);
      setPendingDocs(docsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'offer-received': 'bg-green-100 text-green-800',
      'enrolled': 'bg-purple-100 text-purple-800',
      'reported-to-college': 'bg-indigo-100 text-indigo-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.name}</h1>
        
        {/* Profile Completion Status */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Profile Completion</p>
              <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${profile?.profile?.profileComplete ? 100 : 60}%` }}
                ></div>
              </div>
            </div>
            <Link 
              to="/profile" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Complete Profile
            </Link>
          </div>
          
          {pendingDocs.pending.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 font-medium">Pending Documents:</p>
              <p className="text-yellow-700">{pendingDocs.pending.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Applications Overview */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Applications</h2>
            <Link 
              to="/universities" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Apply to Universities
            </Link>
          </div>
          
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applications yet. Start by applying to universities!</p>
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{app.universityId?.name || 'University'}</h3>
                      <p className="text-gray-600">{app.course}</p>
                      <p className="text-sm text-gray-500">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <Link 
                        to={`/application/${app._id}`} 
                        className="block mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/universities" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Browse Universities</h3>
            <p className="text-gray-600">Explore universities and courses</p>
          </Link>
          
          <Link to="/scholarship-calculator" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Scholarship Calculator</h3>
            <p className="text-gray-600">Find scholarships based on your GPA</p>
          </Link>
          
          <Link to="/blog" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">News & Updates</h3>
            <p className="text-gray-600">Latest study abroad news</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;