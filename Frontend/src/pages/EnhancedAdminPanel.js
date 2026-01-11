import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const EnhancedAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'news',
    tags: '',
    isPublished: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, blogsRes, statsRes] = await Promise.all([
        axios.get('/api/admin/applications'),
        axios.get('/api/blog/admin/all'),
        axios.get('/api/admin/stats')
      ]);
      
      setApplications(appsRes.data);
      setBlogs(blogsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewApplication = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/applications/${id}/status`, { status });
      toast.success('Application status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await axios.post('/api/blog', blogData);
      toast.success('Blog post created successfully');
      setBlogForm({
        title: '',
        content: '',
        excerpt: '',
        category: 'news',
        tags: '',
        isPublished: false
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create blog post');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalApplications || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Offers Sent</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approvedApplications || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
            <p className="text-3xl font-bold text-purple-600">{blogs.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'applications', label: 'Applications' },
                { id: 'blog', label: 'Blog Management' },
                { id: 'universities', label: 'Universities' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Application Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Applied</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} className="border-b">
                          <td className="px-4 py-2">
                            {app.personalInfo?.fullName || app.userId?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-2">
                            {app.userId?.email || 'N/A'}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-2">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => viewApplication(app)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                              >
                                View
                              </button>
                              <select
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="applied">Applied</option>
                                <option value="under-review">Under Review</option>
                                <option value="offer-received">Offer Received</option>
                                <option value="enrolled">Enrolled</option>
                                <option value="reported-to-college">Reported to College</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Blog Management Tab */}
            {activeTab === 'blog' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Blog Management</h2>
                
                {/* Create New Blog Post */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Create New Blog Post</h3>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                      <textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows="2"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                        required
                        rows="6"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="news">News</option>
                          <option value="tips">Tips & Advice</option>
                          <option value="success-stories">Success Stories</option>
                          <option value="updates">Updates</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="study abroad, tips, usa"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={blogForm.isPublished}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Blog Post
                    </button>
                  </form>
                </div>

                {/* Existing Blog Posts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Blog Posts</h3>
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{blog.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Category: {blog.category}</span>
                              <span>Views: {blog.views}</span>
                              <span>Status: {blog.isPublished ? 'Published' : 'Draft'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Universities Tab */}
            {activeTab === 'universities' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">University Management</h2>
                <p className="text-gray-600">
                  University management features can be added here. Currently, universities are seeded via the backend script.
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    <strong>To add universities:</strong> Run <code>npm run seed-universities</code> in the backend directory.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.personalInfo?.fullName || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {selectedApplication.personalInfo?.dateOfBirth || 'N/A'}</p>
                    <p><strong>Nationality:</strong> {selectedApplication.personalInfo?.nationality || 'N/A'}</p>
                    <p><strong>Passport:</strong> {selectedApplication.personalInfo?.passportNumber || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedApplication.userId?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Academic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Qualification:</strong> {selectedApplication.academicInfo?.highestQualification || 'N/A'}</p>
                    <p><strong>Institution:</strong> {selectedApplication.academicInfo?.institution || 'N/A'}</p>
                    <p><strong>GPA:</strong> {selectedApplication.academicInfo?.gpa || 'N/A'}</p>
                    <p><strong>Graduation Year:</strong> {selectedApplication.academicInfo?.graduationYear || 'N/A'}</p>
                  </div>
                </div>

                {/* Application Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Application Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>University:</strong> {selectedApplication.universityId?.name || selectedApplication.customUniversity || 'Not specified'}</p>
                    <p><strong>Course:</strong> {selectedApplication.course || 'N/A'}</p>
                    <p><strong>Intake:</strong> {selectedApplication.intake || 'N/A'}</p>
                    <p><strong>Country:</strong> {selectedApplication.preferredCountry || 'N/A'}</p>
                    <p><strong>Applied:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Documents ({selectedApplication.documents?.length || 0})</h3>
                  <div className="space-y-2">
                    {selectedApplication.documents?.length > 0 ? (
                      selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                          <span className="text-sm">{doc.originalName || doc.name}</span>
                          <a
                            href={doc.cloudinaryUrl || `http://localhost:5000/api/documents/${doc.path?.split('/').pop() || doc.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No documents uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminPanel;