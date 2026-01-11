import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://studyabroad-krny.onrender.com'
  : 'http://localhost:5000';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotice, setExpandedNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  const truncateText = (text, maxLength = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Notices</h1>
        
        {notices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No notices available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => {
              const isExpanded = expandedNotice === notice._id;
              const shouldTruncate = notice.content.length > 200;
              
              return (
                <div key={notice._id} className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{notice.title}</h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {isExpanded ? notice.content : truncateText(notice.content)}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(notice._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                  {notice.image && (
                    <img 
                      src={`${API_BASE_URL}/uploads/notices/${notice.image}`}
                      alt="Notice"
                      className="mb-4 max-w-full h-auto rounded border shadow-sm"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;