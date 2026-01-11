import React from 'react';

const FileUpload = ({ 
  label, 
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx", 
  onChange, 
  name, 
  uploaded = false, 
  fileName = null,
  viewUrl = null 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {uploaded ? (
        <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">✓ {fileName}</p>
              <p className="text-xs text-green-600">Document uploaded successfully</p>
            </div>
          </div>
          {viewUrl && (
            <a 
              href={viewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View
            </a>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id={`file-${name}`}
          />
          <label 
            htmlFor={`file-${name}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (MAX. 10MB)</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUpload;