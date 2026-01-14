import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://studyabroad-krny.onrender.com'
  : 'http://localhost:5000';

const EnhancedAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [noticeImage, setNoticeImage] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deleteNoticeModal, setDeleteNoticeModal] = useState({ show: false, noticeId: null, noticeTitle: '' });
  const [deleteBlogModal, setDeleteBlogModal] = useState({ show: false, blogId: null, blogTitle: '' });
  const [deleteApplicationModal, setDeleteApplicationModal] = useState({ show: false, appId: null, appName: '' });
  const [universityForm, setUniversityForm] = useState({ name: '', country: '', city: '' });
  const [pdfPreview, setPdfPreview] = useState(null);

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
      const [appsRes, blogsRes, statsRes, usersRes, noticesRes, universitiesRes] = await Promise.all([
        axios.get('/api/admin/applications'),
        axios.get('/api/blog/admin/all'),
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/notices/admin/all'),
        axios.get('/api/universities/admin/all')
      ]);
      
      setApplications(appsRes.data);
      setBlogs(blogsRes.data);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setNotices(noticesRes.data);
      setUniversities(universitiesRes.data);
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

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted successfully');
      setDeleteModal({ show: false, userId: null, userName: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const confirmDelete = (userId, userName) => {
    setDeleteModal({ show: true, userId, userName });
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', noticeForm.title);
      formData.append('content', noticeForm.content);
      if (noticeImage) {
        formData.append('image', noticeImage);
      }
      
      await axios.post('/api/notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Notice created successfully');
      setNoticeForm({ title: '', content: '' });
      setNoticeImage(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to create notice');
    }
  };

  const toggleNotice = async (id) => {
    try {
      await axios.patch(`/api/notices/${id}/toggle`);
      toast.success('Notice status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update notice');
    }
  };

  const editNotice = (notice) => {
    setEditingNotice(notice);
    setNoticeForm({ title: notice.title, content: notice.content });
  };

  const updateNotice = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', noticeForm.title);
      formData.append('content', noticeForm.content);
      if (noticeImage) {
        formData.append('image', noticeImage);
      }
      
      await axios.put(`/api/notices/${editingNotice._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Notice updated successfully');
      setEditingNotice(null);
      setNoticeForm({ title: '', content: '' });
      setNoticeImage(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update notice');
    }
  };

  const deleteNotice = async (id) => {
    try {
      await axios.delete(`/api/notices/${id}`);
      toast.success('Notice deleted successfully');
      setDeleteNoticeModal({ show: false, noticeId: null, noticeTitle: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const confirmDeleteNotice = (id, title) => {
    setDeleteNoticeModal({ show: true, noticeId: id, noticeTitle: title });
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags.join(', '),
      isPublished: blog.isPublished
    });
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await axios.put(`/api/blog/${editingBlog._id}`, blogData);
      toast.success('Blog updated successfully');
      setEditingBlog(null);
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
      toast.error('Failed to update blog');
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/api/blog/${id}`);
      toast.success('Blog deleted successfully');
      setDeleteBlogModal({ show: false, blogId: null, blogTitle: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const confirmDeleteBlog = (id, title) => {
    setDeleteBlogModal({ show: true, blogId: id, blogTitle: title });
  };

  const handleUniversitySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/universities/admin', universityForm);
      toast.success('University added successfully');
      setUniversityForm({ name: '', country: '', city: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add university');
    }
  };

  const deleteUniversity = async (id) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await axios.delete(`/api/universities/admin/${id}`);
        toast.success('University deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete university');
      }
    }
  };

  const confirmDeleteApplication = (appId, appName) => {
    setDeleteApplicationModal({ show: true, appId, appName });
  };

  const deleteApplication = async (appId) => {
    try {
      await axios.delete(`/api/admin/applications/${appId}`);
      toast.success('Application deleted successfully');
      setDeleteApplicationModal({ show: false, appId: null, appName: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to delete application');
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
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'applications', label: 'Applications' },
                { id: 'users', label: 'Users' },
                { id: 'notices', label: 'Notices' },
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
            {/* Notices Tab */}
            {activeTab === 'notices' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notice Management</h2>
                
                {/* Create Notice Form */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                  </h3>
                  <form onSubmit={editingNotice ? updateNotice : handleNoticeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={noticeForm.content}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                        required
                        rows="4"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNoticeImage(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingNotice ? 'Update Notice' : 'Create Notice'}
                    </button>
                    {editingNotice && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotice(null);
                          setNoticeForm({ title: '', content: '' });
                          setNoticeImage(null);
                        }}
                        className="ml-3 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>

                {/* Existing Notices */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Notices</h3>
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div key={notice._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{notice.title}</h4>
                            <p className="text-gray-600 mt-2">{notice.content}</p>
                            {notice.image && (
                              <img 
                                src={`${API_BASE_URL}/uploads/notices/${notice.image}`}
                                alt="Notice"
                                className="mt-3 max-w-xs h-auto rounded border"
                              />
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                              <span>Created: {new Date(notice.createdAt).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded text-xs ${notice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {notice.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editNotice(notice)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDeleteNotice(notice._id, notice.title)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Joined</th>
                        <th className="px-4 py-2 text-left">Applications</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        const userApplications = applications.filter(app => app.userId?._id === user._id);
                        return (
                          <tr key={user._id} className="border-b">
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{userApplications.length}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => confirmDelete(user._id, user.name)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                              <button
                                onClick={() => confirmDeleteApplication(app._id, app.personalInfo?.fullName || app.userId?.name)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                              >
                                Delete
                              </button>
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
                  <h3 className="text-lg font-semibold mb-4">
                    {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h3>
                  <form onSubmit={editingBlog ? updateBlog : handleBlogSubmit} className="space-y-4">
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
                      {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                    </button>
                    {editingBlog && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogForm({
                            title: '',
                            content: '',
                            excerpt: '',
                            category: 'news',
                            tags: '',
                            isPublished: false
                          });
                        }}
                        className="ml-3 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => editBlog(blog)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDeleteBlog(blog._id, blog.title)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-right mt-2">
                          <p className="text-sm text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
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
                
                {/* Add University Form */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New University</h3>
                  <form onSubmit={handleUniversitySubmit} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={universityForm.name}
                          onChange={(e) => setUniversityForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={universityForm.country}
                          onChange={(e) => setUniversityForm(prev => ({ ...prev, country: e.target.value }))}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={universityForm.city}
                          onChange={(e) => setUniversityForm(prev => ({ ...prev, city: e.target.value }))}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add University
                    </button>
                  </form>
                </div>

                {/* Existing Universities */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Universities ({universities.length})</h3>
                  <div className="space-y-4">
                    {universities.map((university) => (
                      <div key={university._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{university.name}</h4>
                            <p className="text-gray-600">{university.city}, {university.country}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                              <span>Added: {new Date(university.createdAt).toLocaleDateString()}</span>
                              <span>Courses: {university.courses?.length || 0}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteUniversity(university._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {pdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button
                onClick={() => setPdfPreview(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfPreview)}&embedded=true`}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Application Confirmation Modal */}
      {deleteApplicationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the application from <strong>{deleteApplicationModal.appName}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteApplicationModal({ show: false, appId: null, appName: '' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteApplication(deleteApplicationModal.appId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Blog Confirmation Modal */}
      {deleteBlogModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Blog Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteBlogModal.blogTitle}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteBlogModal({ show: false, blogId: null, blogTitle: '' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBlog(deleteBlogModal.blogId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Notice Confirmation Modal */}
      {deleteNoticeModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Notice</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteNoticeModal.noticeTitle}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteNoticeModal({ show: false, noticeId: null, noticeTitle: '' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteNotice(deleteNoticeModal.noticeId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.userName}</strong>? 
              This will also delete all their applications.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, userId: null, userName: '' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(deleteModal.userId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                      selectedApplication.documents.map((doc, index) => {
                        const url = doc.cloudinaryUrl || doc.path;
                        const isImage = url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        return (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-sm capitalize">{doc.name}</span>
                            {isImage ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Preview
                              </a>
                            ) : (
                              <button
                                onClick={() => setPdfPreview(url)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Preview
                              </button>
                            )}
                          </div>
                        );
                      })
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