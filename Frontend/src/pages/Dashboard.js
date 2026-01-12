import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [deleteModal, setDeleteModal] = useState({ show: false, appId: null, appName: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (appId) => {
    try {
      await axios.delete(`/api/applications/${appId}`);
      toast.success('Application deleted successfully');
      setDeleteModal({ show: false, appId: null, appName: '' });
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const confirmDelete = (appId, appName) => {
    setDeleteModal({ show: true, appId, appName });
  };

  const getSortedApplications = () => {
    const sorted = [...applications];
    switch (sortBy) {
      case 'status':
        return sorted.sort((a, b) => {
          const statusOrder = ['applied', 'under-review', 'offer-received', 'enrolled', 'reported-to-college', 'rejected'];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
      case 'date':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'course':
        return sorted.sort((a, b) => (a.course || a.preferredCourse || '').localeCompare(b.course || b.preferredCourse || ''));
      default:
        return sorted;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'offer-received': 'bg-green-100 text-green-800',
      'enrolled': 'bg-purple-100 text-purple-800',
      'reported-to-college': 'bg-indigo-100 text-indigo-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage your study abroad applications</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link to="/apply" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-center">
            <h3 className="text-xl font-semibold mb-2">Apply Now</h3>
            <p>Start new application</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'pending').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {applications.filter(app => app.status === 'approved').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-semibold">My Applications</h2>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="date">Date Applied</option>
                <option value="status">Status</option>
                <option value="course">Course</option>
              </select>
            </div>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No applications yet</p>
              <Link to="/apply" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Create Your First Application
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getSortedApplications().map((app) => (
                    <tr key={app._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{app.course || app.preferredCourse}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.preferredCountry}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link 
                            to={`/application/${app._id}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => confirmDelete(app._id, app.course || app.preferredCourse)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the application for <strong>{deleteModal.appName}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, appId: null, appName: '' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteApplication(deleteModal.appId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;