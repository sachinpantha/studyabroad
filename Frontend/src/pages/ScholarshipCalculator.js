import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const ScholarshipCalculator = () => {
  const [gpa, setGpa] = useState('');
  const [eligibleUniversities, setEligibleUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.profile?.academic?.gpa) {
        setGpa(response.data.profile.academic.gpa.toString());
      }
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const calculateScholarships = async () => {
    if (!gpa || gpa < 0 || gpa > 4) {
      alert('Please enter a valid GPA between 0 and 4');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/universities/scholarships/calculate?gpa=${gpa}`);
      setEligibleUniversities(response.data);
    } catch (error) {
      console.error('Error calculating scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarship Calculator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your GPA to discover universities where you're eligible for scholarships. 
            We'll show you potential savings and scholarship opportunities.
          </p>
        </div>

        {/* GPA Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your GPA (0.0 - 4.0 scale)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="Enter your GPA"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              <button
                onClick={calculateScholarships}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
            </div>
            {!userProfile?.profile?.academic?.gpa && (
              <p className="text-sm text-gray-500 mt-2">
                Complete your <Link to="/profile" className="text-blue-600 hover:underline">profile</Link> to auto-fill your GPA
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {eligibleUniversities.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Scholarship Opportunities for GPA {gpa}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleUniversities.map((university) => (
                <div key={university._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{university.name}</h3>
                    <p className="text-gray-600 mb-4">{university.country}</p>
                    
                    <div className="space-y-3">
                      {university.scholarships.map((scholarship, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-gray-900">{scholarship.name}</h4>
                          <div className="text-sm text-gray-600">
                            <p>Amount: {formatCurrency(scholarship.amount)}</p>
                            <p>Coverage: {scholarship.percentage}%</p>
                            <p>Min GPA: {scholarship.minGPA}</p>
                            <p className="text-xs mt-1">{scholarship.criteria}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Total Savings: 
                          <span className="font-semibold text-green-600 ml-1">
                            {formatCurrency(
                              university.scholarships.reduce((sum, s) => sum + s.amount, 0)
                            )}
                          </span>
                        </div>
                        <Link
                          to={`/apply/${university._id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {eligibleUniversities.length === 0 && gpa && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Scholarships Found</h3>
              <p className="text-gray-600 mb-6">
                Unfortunately, no scholarships are available for GPA {gpa}. 
                Consider improving your GPA or explore other funding options.
              </p>
              <Link
                to="/universities"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Browse All Universities
              </Link>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Scholarship Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Improve Your Chances:</h4>
              <ul className="space-y-1">
                <li>• Maintain a high GPA</li>
                <li>• Participate in extracurricular activities</li>
                <li>• Write compelling personal statements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Application Process:</h4>
              <ul className="space-y-1">
                <li>• Apply early for better chances</li>
                <li>• Submit all required documents</li>
                <li>• Follow up on your applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCalculator;