import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import FileUpload from '../components/FileUpload';

const Apply = () => {
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
    preferredCountry: '',
    preferredCourse: '',
    intake: '',
    customUniversityName: ''
  });
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if any files are selected
      const hasFiles = Object.values(documents).some(file => file instanceof File);
      
      if (hasFiles) {
        // Submit with files
        const formDataToSend = new FormData();
        formDataToSend.append('applicationData', JSON.stringify(formData));
        
        Object.keys(documents).forEach(key => {
          if (documents[key] && documents[key] instanceof File) {
            formDataToSend.append(key, documents[key]);
          }
        });
        
        const response = await axios.post('/api/applications', formDataToSend, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });
        toast.success('Application submitted successfully!');
        navigate(`/application/${response.data.data._id}`);
      } else {
        // Submit without files (regular JSON)
        console.log('Submitting form data:', formData);
        const response = await axios.post('/api/applications/simple', formData, {
          timeout: 30000
        });
        toast.success('Application submitted successfully!');
        navigate(`/application/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Frontend submission error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Server is currently unavailable. Please try again in a few minutes.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection and try again.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Study Abroad Application</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo.nationality}
                    onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo.passportNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'passportNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Academic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.academicInfo.highestQualification}
                    onChange={(e) => handleInputChange('academicInfo', 'highestQualification', e.target.value)}
                  >
                    <option value="">Select Qualification</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.academicInfo.institution}
                    onChange={(e) => handleInputChange('academicInfo', 'institution', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA/Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.academicInfo.gpa}
                    onChange={(e) => handleInputChange('academicInfo', 'gpa', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.academicInfo.graduationYear}
                    onChange={(e) => handleInputChange('academicInfo', 'graduationYear', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Documents (Optional)</h2>
              <p className="text-gray-600 mb-6">You can upload documents now or later from your dashboard.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <FileUpload
                  label="Academic Transcripts"
                  name="transcripts"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments({...documents, transcripts: e.target.files[0]})}
                  uploaded={!!documents.transcripts}
                  fileName={documents.transcripts?.name}
                />
                <FileUpload
                  label="Passport Copy"
                  name="passport"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments({...documents, passport: e.target.files[0]})}
                  uploaded={!!documents.passport}
                  fileName={documents.passport?.name}
                />
                <FileUpload
                  label="Citizenship Certificate"
                  name="citizenship"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments({...documents, citizenship: e.target.files[0]})}
                  uploaded={!!documents.citizenship}
                  fileName={documents.citizenship?.name}
                />
                <FileUpload
                  label="English Proficiency Test (IELTS/TOEFL)"
                  name="englishTest"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments({...documents, englishTest: e.target.files[0]})}
                  uploaded={!!documents.englishTest}
                  fileName={documents.englishTest?.name}
                />
                <FileUpload
                  label="Statement of Purpose"
                  name="sop"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setDocuments({...documents, sop: e.target.files[0]})}
                  uploaded={!!documents.sop}
                  fileName={documents.sop?.name}
                />
                <FileUpload
                  label="CV/Resume"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setDocuments({...documents, cv: e.target.files[0]})}
                  uploaded={!!documents.cv}
                  fileName={documents.cv?.name}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Study Preferences</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Country</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.preferredCountry}
                    onChange={(e) => setFormData({...formData, preferredCountry: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Course</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.preferredCourse}
                    onChange={(e) => setFormData({...formData, preferredCourse: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intake</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.intake || ''}
                    onChange={(e) => setFormData({...formData, intake: e.target.value})}
                  >
                    <option value="">Select Intake</option>
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter specific university or leave blank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.customUniversityName || ''}
                    onChange={(e) => setFormData({...formData, customUniversityName: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;