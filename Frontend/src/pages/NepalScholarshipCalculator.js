import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const NepalScholarshipCalculator = () => {
  const [gpa, setGpa] = useState('');
  const [percentage, setPercentage] = useState('');
  const [inputType, setInputType] = useState('percentage');
  const [eligibleUniversities, setEligibleUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  const convertPercentageToGPA = (percent) => {
    if (percent >= 90) return 4.0;
    if (percent >= 85) return 3.7;
    if (percent >= 80) return 3.4;
    if (percent >= 75) return 3.0;
    if (percent >= 70) return 2.7;
    if (percent >= 65) return 2.3;
    if (percent >= 60) return 2.0;
    return 1.5;
  };

  const convertGPAToPercentage = (gpaValue) => {
    if (gpaValue >= 4.0) return 90;
    if (gpaValue >= 3.7) return 85;
    if (gpaValue >= 3.4) return 80;
    if (gpaValue >= 3.0) return 75;
    if (gpaValue >= 2.7) return 70;
    if (gpaValue >= 2.3) return 65;
    if (gpaValue >= 2.0) return 60;
    return 55;
  };

  const handleInputChange = (value, type) => {
    if (type === 'percentage') {
      setPercentage(value);
      setGpa(convertPercentageToGPA(parseFloat(value)).toFixed(1));
    } else {
      setGpa(value);
      setPercentage(convertGPAToPercentage(parseFloat(value)).toString());
    }
  };

  const calculateScholarships = async () => {
    const gpaValue = inputType === 'percentage' ? convertPercentageToGPA(parseFloat(percentage)) : parseFloat(gpa);
    
    if (!gpaValue || gpaValue < 0 || gpaValue > 4) {
      alert('Please enter a valid GPA or percentage');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/universities/scholarships/calculate?gpa=${gpaValue}`);
      setEligibleUniversities(response.data);
    } catch (error) {
      console.error('Error calculating scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatNPR = (inrAmount) => {
    const nprAmount = inrAmount * 1.6; // Approximate conversion rate
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR'
    }).format(nprAmount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nepal Student Scholarship Calculator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your scholarship eligibility for Indian universities based on your academic performance.
            Enter your marks in percentage or GPA - we'll show you both!
          </p>
        </div>

        {/* GPA/Percentage Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="percentage"
                    checked={inputType === 'percentage'}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  Percentage (Nepal System)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="gpa"
                    checked={inputType === 'gpa'}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  GPA (4.0 Scale)
                </label>
              </div>
            </div>

            {inputType === 'percentage' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => handleInputChange(e.target.value, 'percentage')}
                  placeholder="Enter your percentage"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {gpa && (
                  <p className="text-sm text-gray-600 mt-1">
                    Equivalent GPA: {gpa}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your GPA (4.0 Scale)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={gpa}
                  onChange={(e) => handleInputChange(e.target.value, 'gpa')}
                  placeholder="Enter your GPA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {percentage && (
                  <p className="text-sm text-gray-600 mt-1">
                    Equivalent Percentage: {percentage}%
                  </p>
                )}
              </div>
            )}

            <button
              onClick={calculateScholarships}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Find My Scholarships'}
            </button>
          </div>
        </div>

        {/* Results */}
        {eligibleUniversities.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Scholarship Opportunities for {inputType === 'percentage' ? `${percentage}%` : `${gpa} GPA`}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleUniversities.map((university) => (
                <div key={university._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                    {university.logo ? (
                      <img src={university.logo} alt={university.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-700">{university.name}</h3>
                        <p className="text-gray-500 mt-2">{university.country}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{university.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{university.country}</p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Scholarship</span>
                        <span className="text-2xl font-bold text-green-600">
                          {university.scholarships[0]?.percentage}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Save up to {formatINR(university.scholarships.reduce((sum, s) => sum + s.amount, 0))}
                      </div>
                    </div>
                    <Link
                      to={`/apply/${university._id}`}
                      className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {eligibleUniversities.length === 0 && (gpa || percentage) && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Keep Working Hard!</h3>
              <p className="text-gray-600 mb-6">
                No scholarships available for current grades, but don't give up! 
                Improve your scores and check back, or explore other funding options.
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
      </div>
    </div>
  );
};

export default NepalScholarshipCalculator;