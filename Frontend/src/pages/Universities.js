import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({ country: '', course: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchUniversities();
  }, [filters, pagination.page]);

  const fetchUniversities = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: 9
      });
      
      const response = await axios.get(`/api/universities?${params}`);
      setUniversities(response.data.universities);
      setPagination(prev => ({
        ...prev,
        pages: response.data.pages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Netherlands'];
  const courses = ['Computer Science', 'Business Administration', 'Engineering', 'Medicine', 'Law'];

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Universities</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search universities..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ country: '', course: '', search: '' });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">Showing {universities.length} of {pagination.total} universities</p>
        </div>

        {/* Universities Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {universities.map((university) => (
            <div key={university._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{university.name}</h3>
                  {university.ranking && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      #{university.ranking}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">{university.city}, {university.country}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{university.description}</p>
                
                {university.courses && university.courses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Popular Courses:</p>
                    <div className="flex flex-wrap gap-1">
                      {university.courses.slice(0, 2).map((course, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {course.name}
                        </span>
                      ))}
                      {university.courses.length > 2 && (
                        <span className="text-xs text-gray-500">+{university.courses.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Link
                    to={`/university/${university._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/apply/${university._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Universities;