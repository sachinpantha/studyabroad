import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await axios.get(`/api/applications/${id}`);
      setApplication(response.data.data || response.data);
    } catch (error) {
      console.error('Fetch application error:', error);
      toast.error('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    
    for (let file of files) {
      formData.append('documents', file);
    }

    try {
      const response = await axios.post(`/api/applications/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApplication(response.data.data || response.data);
      toast.success('Documents uploaded successfully!');
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!application) {
    return <div className="text-center py-8">Application not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Application Details</h1>
            <div className="flex items-center mt-2">
              <span className="text-gray-600 mr-4">Status:</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                {application.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Full Name:</span>
                <p className="text-gray-600">{application.personalInfo.fullName}</p>
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>
                <p className="text-gray-600">{new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Nationality:</span>
                <p className="text-gray-600">{application.personalInfo.nationality}</p>
              </div>
              <div>
                <span className="font-medium">Passport Number:</span>
                <p className="text-gray-600">{application.personalInfo.passportNumber}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Academic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Highest Qualification:</span>
                <p className="text-gray-600">{application.academicInfo.highestQualification}</p>
              </div>
              <div>
                <span className="font-medium">Institution:</span>
                <p className="text-gray-600">{application.academicInfo.institution}</p>
              </div>
              <div>
                <span className="font-medium">GPA:</span>
                <p className="text-gray-600">{application.academicInfo.gpa}</p>
              </div>
              <div>
                <span className="font-medium">Graduation Year:</span>
                <p className="text-gray-600">{application.academicInfo.graduationYear}</p>
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Study Preferences</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Preferred Country:</span>
                <p className="text-gray-600">{application.preferredCountry}</p>
              </div>
              <div>
                <span className="font-medium">Preferred Course:</span>
                <p className="text-gray-600">{application.preferredCourse}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Documents</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents (PDF, DOC, DOCX, Images)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}
            </div>

            {application.documents.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium">Uploaded Documents:</h3>
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>{doc.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No documents uploaded yet</p>
            )}
          </div>

          {/* Admin Notes */}
          {application.adminNotes && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Admin Notes</h2>
              <p className="text-gray-600">{application.adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;