import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profile, setProfile] = useState({
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    address: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    academic: { highestQualification: '', institution: '', gpa: '', graduationYear: '', fieldOfStudy: '' }
  });
  const [documents, setDocuments] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchPendingDocs();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.profile) {
        setProfile(response.data.profile);
        setDocuments(response.data.profile.documents || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDocs = async () => {
    try {
      const response = await axios.get('/api/profile/pending-documents');
      setPendingDocs(response.data.pending);
    } catch (error) {
      console.error('Error fetching pending docs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/profile', profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDocumentUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    try {
      await axios.post('/api/profile/documents', formData);
      toast.success('Document uploaded successfully');
      fetchProfile();
      fetchPendingDocs();
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={profile.nationality || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={profile.passportNumber || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={profile.address || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="2"
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
                  name="academic.highestQualification"
                  value={profile.academic?.highestQualification || ''}
                  onChange={handleInputChange}
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
                  name="academic.institution"
                  value={profile.academic?.institution || ''}
                  onChange={handleInputChange}
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
                  name="academic.gpa"
                  value={profile.academic?.gpa || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  name="academic.graduationYear"
                  value={profile.academic?.graduationYear || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            
            {pendingDocs.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 font-medium">Pending Documents: {pendingDocs.join(', ')}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {['passport', 'transcript', 'certificate', 'ielts', 'toefl'].map((docType) => (
                <div key={docType} className="border rounded-lg p-4">
                  <h3 className="font-medium capitalize mb-2">{docType.replace('-', ' ')}</h3>
                  {documents.find(doc => doc.type === docType) ? (
                    <div className="text-green-600">
                      <div>✓ Uploaded: {documents.find(doc => doc.type === docType)?.name}</div>
                      {documents.find(doc => doc.type === docType)?.cloudinaryUrl && (
                        <a 
                          href={documents.find(doc => doc.type === docType)?.cloudinaryUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload(e, docType)}
                      className="w-full text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;