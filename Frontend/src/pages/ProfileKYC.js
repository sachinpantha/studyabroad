import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ProfileKYC = () => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: '',
    nationality: 'Nepali',
    passportNumber: '',
    address: '',
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    
    // Academic Information
    academic: {
      highestQualification: '',
      institution: '',
      gpa: '',
      graduationYear: '',
      fieldOfStudy: ''
    }
  });
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        dateOfBirth: user.profile.dateOfBirth?.split('T')[0] || '',
        nationality: user.profile.nationality || 'Nepali',
        passportNumber: user.profile.passportNumber || '',
        address: user.profile.address || '',
        emergencyContact: user.profile.emergencyContact || { name: '', phone: '', relationship: '' },
        academic: user.profile.academic || { highestQualification: '', institution: '', gpa: '', graduationYear: '', fieldOfStudy: '' }
      });
    }
  }, [user]);

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
    if (files[0]) {
      setDocuments(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const saveStep = async () => {
    setLoading(true);
    try {
      await axios.put('/api/profile/kyc', formData);
      toast.success('Information saved successfully');
    } catch (error) {
      toast.error('Failed to save information');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocuments = async () => {
    if (Object.keys(documents).length === 0) {
      toast.success('Profile completed successfully');
      return;
    }
    
    setLoading(true);
    try {
      // Upload documents one by one but check for existing documents first
      for (const [documentType, file] of Object.entries(documents)) {
        const formDataObj = new FormData();
        formDataObj.append('document', file);
        formDataObj.append('documentType', documentType);
        
        await axios.post('/api/profile/documents', formDataObj);
      }
      
      toast.success('Documents uploaded successfully');
      // Clear documents state to prevent re-upload
      setDocuments({});
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error(`Failed to upload documents: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    await saveStep();
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const completeKYC = async () => {
    await uploadDocuments();
    await saveStep();
  };

  const steps = [
    { title: 'Personal Info', icon: '👤' },
    { title: 'Emergency Contact', icon: '📞' },
    { title: 'Academic Details', icon: '🎓' },
    { title: 'Documents', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Complete Your Profile</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-2">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality</label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Nepali">Nepali</option>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Passport Number</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="2"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Emergency Contact */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <select
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Highest Qualification</label>
                  <select
                    name="academic.highestQualification"
                    value={formData.academic.highestQualification}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Qualification</option>
                    <option value="10+2">10+2</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    name="academic.institution"
                    value={formData.academic.institution}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GPA/Percentage</label>
                  <input
                    type="text"
                    name="academic.gpa"
                    value={formData.academic.gpa}
                    onChange={handleInputChange}
                    placeholder="e.g., 3.5 or 75%"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Graduation Year</label>
                  <input
                    type="number"
                    name="academic.graduationYear"
                    value={formData.academic.graduationYear}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Field of Study</label>
                  <input
                    type="text"
                    name="academic.fieldOfStudy"
                    value={formData.academic.fieldOfStudy}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <p className="text-gray-600 text-sm mb-6">Upload your documents to speed up future applications</p>
              <div className="space-y-4">
                {[
                  { key: 'transcripts', label: 'Academic Transcripts' },
                  { key: 'passport', label: 'Passport Copy' },
                  { key: 'englishTest', label: 'English Test Score' },
                  { key: 'sop', label: 'Statement of Purpose' },
                  { key: 'cv', label: 'CV/Resume' }
                ].map((doc) => (
                  <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                          <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        name={doc.key}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      {documents[doc.key] ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <span className="text-blue-600 text-sm font-medium">Choose File</span>
                      )}
                    </label>
                    {documents[doc.key] && (
                      <p className="text-xs text-gray-600 mt-2 ml-9">{documents[doc.key].name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            ) : (
              <button
                onClick={completeKYC}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileKYC;