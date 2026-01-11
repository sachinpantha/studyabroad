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

        {/* Conversion Guide */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Nepal to India Grade Conversion Guide</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-blue-800">Percentage to GPA:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>90%+ = 4.0 GPA (Distinction)</li>
                <li>85-89% = 3.7 GPA (First Division)</li>
                <li>80-84% = 3.4 GPA (First Division)</li>
                <li>75-79% = 3.0 GPA (Second Division)</li>
                <li>70-74% = 2.7 GPA (Second Division)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-800">Scholarship Tiers:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>3.8+ GPA = Up to 100% scholarship</li>
                <li>3.5+ GPA = Up to 75% scholarship</li>
                <li>3.0+ GPA = Up to 50% scholarship</li>
                <li>2.5+ GPA = Up to 25% scholarship</li>
              </ul>
            </div>
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
                <div key={university._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{university.name}</h3>
                    <p className="text-gray-600 mb-4">{university.country}</p>
                    
                    <div className="space-y-3">
                      {university.scholarships.map((scholarship, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-gray-900">{scholarship.name}</h4>
                          <div className="text-sm text-gray-600">
                            <p>Amount: {formatINR(scholarship.amount)}</p>
                            <p className="text-green-600">NPR: {formatNPR(scholarship.amount)}</p>
                            <p>Coverage: {scholarship.percentage}%</p>
                            <p>Min Required: {scholarship.minGPA} GPA ({convertGPAToPercentage(scholarship.minGPA)}%)</p>
                            <p className="text-xs mt-1 italic">{scholarship.criteria}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Total Savings: 
                          <div className="font-semibold text-green-600">
                            {formatINR(university.scholarships.reduce((sum, s) => sum + s.amount, 0))}
                          </div>
                          <div className="text-xs text-green-500">
                            {formatNPR(university.scholarships.reduce((sum, s) => sum + s.amount, 0))}
                          </div>
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