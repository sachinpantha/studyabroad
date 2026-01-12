import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
    } else {
      setSelectedBlog(null);
      fetchBlogs();
    }
  }, [id, category, pagination.page]);

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 6,
        ...(category && { category })
      });
      
      const response = await axios.get(`/api/blog?${params}`);
      setBlogs(response.data.blogs);
      setPagination(prev => ({
        ...prev,
        pages: response.data.pages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogById = async (blogId) => {
    try {
      const response = await axios.get(`/api/blog/${blogId}`);
      setSelectedBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'tips', label: 'Tips & Advice' },
    { value: 'success-stories', label: 'Success Stories' },
    { value: 'updates', label: 'Updates' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  // Single blog view
  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate('/blog')}
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to Blog
          </button>
          
          <article className="bg-white rounded-lg shadow p-8">
            <header className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {selectedBlog.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-gray-500 text-sm">{selectedBlog.views} views</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
              
              <div className="flex items-center text-gray-600 text-sm">
                <span>By {selectedBlog.author?.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(selectedBlog.publishDate)}</span>
              </div>
            </header>

            {selectedBlog.image && (
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="prose max-w-none">
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content.replace(/\n/g, '<br>') }} 
              />
            </div>

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  // Blog list view
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Study Abroad News & Updates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and success stories from the study abroad community.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <article key={blog._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {blog.category.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">{blog.views} views</span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <p>By {blog.author?.name}</p>
                        <p>{formatDate(blog.publishDate)}</p>
                      </div>
                      
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-4 py-2 rounded ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;