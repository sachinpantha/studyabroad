import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';

const UniversityDetail = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const fetchUniversity = async () => {
    try {
      const response = await axios.get(`/api/universities/${id}`);
      setUniversity(response.data);
    } catch (error) {
      console.error('Error fetching university:', error);
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!university) return <div className="text-center py-12">University not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/universities" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Universities
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
                {university.ranking && (
                  <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">
                    Rank #{university.ranking}
                  </span>
                )}
              </div>
              <p className="text-xl text-gray-600 mb-2">{university.city}, {university.country}</p>
              <p className="text-gray-700">{university.description}</p>
              {university.website && (
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  Visit Website →
                </a>
              )}
            </div>
            <Link
              to={`/apply/${university._id}`}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Apply Now
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses */}
            {university.courses && university.courses.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Courses</h2>
                <div className="space-y-4">
                  {university.courses.map((course, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(course.tuitionFee)}/year
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">Duration: {course.duration}</p>
                      {course.requirements && (
                        <div className="text-sm text-gray-700">
                          <p>Min GPA: {course.requirements.minGPA}</p>
                          <p>English Test: {course.requirements.englishTest} (Min Score: {course.requirements.minScore})</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scholarships */}
            {university.scholarships && university.scholarships.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scholarships Available</h2>
                <div className="space-y-4">
                  {university.scholarships.map((scholarship, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <h3 className="text-lg font-medium text-gray-900">{scholarship.name}</h3>
                      <div className="text-gray-700">
                        <p>Amount: {formatCurrency(scholarship.amount)} ({scholarship.percentage}% coverage)</p>
                        <p>Min GPA Required: {scholarship.minGPA}</p>
                        <p className="text-sm text-gray-600 mt-1">{scholarship.criteria}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {university.facilities && university.facilities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Campus Facilities</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {university.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admission Requirements */}
            {university.admissionRequirements && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Admission Requirements</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Min GPA: {university.admissionRequirements.minGPA}</p>
                  <p>English Test: {university.admissionRequirements.englishTest}</p>
                  {university.admissionRequirements.documents && (
                    <div>
                      <p className="font-medium mt-3 mb-2">Required Documents:</p>
                      <ul className="space-y-1">
                        {university.admissionRequirements.documents.map((doc, index) => (
                          <li key={index} className="text-sm">• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Deadlines */}
            {university.applicationDeadlines && university.applicationDeadlines.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Deadlines</h3>
                <div className="space-y-3">
                  {university.applicationDeadlines.map((deadline, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{deadline.intake}</span>
                      <span className="text-gray-600">
                        {new Date(deadline.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Apply */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Ready to Apply?</h3>
              <p className="text-blue-800 text-sm mb-4">
                Start your application process now and take the first step towards your dream education.
              </p>
              <Link
                to={`/apply/${university._id}`}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-center block"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;