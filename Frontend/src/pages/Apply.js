import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import FileUpload from '../components/FileUpload';

const Apply = () => {
  const { user } = useAuth();
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
  const [kycData, setKycData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    try {
      const response = await axios.get('/api/profile/status');
      if (response.data.profile) {
        const profile = response.data.profile;
        setKycData(profile);
        
        // Auto-fill form with KYC data
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            fullName: user?.name || '',
            dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
            nationality: profile.nationality || '',
            passportNumber: profile.passportNumber || ''
          },
          academicInfo: {
            highestQualification: profile.academic?.highestQualification || '',
            institution: profile.academic?.institution || '',
            gpa: profile.academic?.gpa || '',
            graduationYear: profile.academic?.graduationYear || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hasFiles = Object.values(documents).some(file => file instanceof File);
      let response;
      
      if (hasFiles) {
        const formDataToSend = new FormData();
        formDataToSend.append('applicationData', JSON.stringify(formData));
        
        Object.entries(documents).forEach(([key, file]) => {
          if (file instanceof File) {
            formDataToSend.append(key, file);
          }
        });
        
        response = await axios.post('/api/applications', formDataToSend, { timeout: 30000 });
      } else {
        response = await axios.post('/api/applications/simple', formData, { timeout: 30000 });
      }
      
      const applicationId = response.data?.data?._id || response.data?._id;
      if (!applicationId) throw new Error('Invalid response format');
      
      toast.success('Application submitted successfully!');
      navigate(`/application/${applicationId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Submission failed';
      toast.error(errorMessage);
      console.error('Submission error:', error);
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
              {kycData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    ✓ Information auto-filled from your KYC profile. These fields cannot be edited.
                  </p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.personalInfo.fullName}
                    onChange={(e) => !kycData && handleInputChange('personalInfo', 'fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => !kycData && handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.personalInfo.nationality}
                    onChange={(e) => !kycData && handleInputChange('personalInfo', 'nationality', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    type="text"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.personalInfo.passportNumber}
                    onChange={(e) => !kycData && handleInputChange('personalInfo', 'passportNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Academic Information</h2>
              {kycData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    ✓ Information auto-filled from your KYC profile. These fields cannot be edited.
                  </p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                  <select
                    required
                    disabled={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.academicInfo.highestQualification}
                    onChange={(e) => !kycData && handleInputChange('academicInfo', 'highestQualification', e.target.value)}
                  >
                    <option value="">Select Qualification</option>
                    <option value="High School">High School</option>
                    <option value="10+2">10+2</option>
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
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.academicInfo.institution}
                    onChange={(e) => !kycData && handleInputChange('academicInfo', 'institution', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA/Percentage</label>
                  <input
                    type="text"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.academicInfo.gpa}
                    onChange={(e) => !kycData && handleInputChange('academicInfo', 'gpa', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input
                    type="number"
                    required
                    readOnly={!!kycData}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      kycData ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.academicInfo.graduationYear}
                    onChange={(e) => !kycData && handleInputChange('academicInfo', 'graduationYear', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Documents</h2>
              {kycData?.documents?.length > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 text-sm">
                    ✓ Documents auto-loaded from your KYC profile. You can upload additional documents if needed.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">You can upload documents now or later from your dashboard.</p>
              )}
              
              {/* Show KYC Documents */}
              {kycData?.documents?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Documents from KYC Profile:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {kycData.documents.map((doc, index) => (
                      <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm capitalize">{doc.type?.replace('_', ' ') || 'Document'}</p>
                            <p className="text-xs text-gray-600">{doc.name}</p>
                          </div>
                          <span className="text-green-600 text-xs">✓ Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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