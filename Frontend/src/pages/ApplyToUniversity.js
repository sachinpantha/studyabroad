import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ApplyToUniversity = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [customUniversity, setCustomUniversity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: ''
    },
    academicInfo: {
      highestQualification: '',
      institution: '',
      gpa: '',
      graduationYear: ''
    },
    course: '',
    intake: ''
  });
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (universityId) {
      fetchUniversity();
      setSelectedUniversity(universityId);
    }
    fetchUniversities();
  }, [universityId]);

  const fetchUniversity = async () => {
    try {
      const response = await axios.get(`/api/universities/${universityId}`);
      setUniversity(response.data);
    } catch (error) {
      console.error('Error fetching university:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('/api/universities/search/autocomplete?q=');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const searchUniversities = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/universities/search/autocomplete?q=${query}`);
        setUniversities(response.data);
      } catch (error) {
        console.error('Error searching universities:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleUniversitySelect = (uniId) => {
    setSelectedUniversity(uniId);
    setShowCustomInput(false);
    const selected = universities.find(u => u._id === uniId);
    if (selected) {
      setSearchTerm(selected.name);
    }
  };

  const handleCustomUniversity = () => {
    setShowCustomInput(true);
    setSelectedUniversity('');
    setSearchTerm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicationData = {
        ...formData,
        universityId: selectedUniversity || null,
        customUniversityName: showCustomInput ? customUniversity : null
      };

      const formDataToSend = new FormData();
      formDataToSend.append('applicationData', JSON.stringify(applicationData));

      // Append documents
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formDataToSend.append(key, documents[key]);
        }
      });

      await axios.post('/api/applications', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {university ? `Apply to ${university.name}` : 'University Application'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University Selection */}
          {!universityId && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Choose University</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Universities
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchUniversities(e.target.value);
                  }}
                  placeholder="Type to search universities..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              {searchTerm && filteredUniversities.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  {filteredUniversities.map((uni) => (
                    <button
                      key={uni._id}
                      type="button"
                      onClick={() => handleUniversitySelect(uni._id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="font-medium">{uni.name}</div>
                      <div className="text-sm text-gray-600">{uni.country}</div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Can't find your university?
                </span>
                <button
                  type="button"
                  onClick={handleCustomUniversity}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Enter manually
                </button>
              </div>

              {showCustomInput && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    placeholder="Enter university name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="personalInfo.fullName"
                  value={formData.personalInfo.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="personalInfo.dateOfBirth"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="personalInfo.nationality"
                  value={formData.personalInfo.nationality}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  name="personalInfo.passportNumber"
                  value={formData.personalInfo.passportNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                <select
                  name="academicInfo.highestQualification"
                  value={formData.academicInfo.highestQualification}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  name="academicInfo.institution"
                  value={formData.academicInfo.institution}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="academicInfo.gpa"
                  value={formData.academicInfo.gpa}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  name="academicInfo.graduationYear"
                  value={formData.academicInfo.graduationYear}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Course and Intake */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intake</label>
                <select
                  name="intake"
                  value={formData.intake}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Intake</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'transcripts', label: 'Academic Transcripts' },
                { key: 'passport', label: 'Passport Copy' },
                { key: 'englishTest', label: 'English Test Score' },
                { key: 'sop', label: 'Statement of Purpose' },
                { key: 'cv', label: 'CV/Resume' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="file"
                    name={key}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!selectedUniversity && !showCustomInput)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyToUniversity;