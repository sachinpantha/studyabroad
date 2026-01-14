import React, { useState } from 'react';

const DocumentPreview = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!document) return null;

  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const isImage = (filename) => {
    const ext = getFileExtension(filename);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(ext);
  };

  const isPDF = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

  const getDocumentUrl = () => {
    if (document.cloudinaryUrl) {
      const url = document.cloudinaryUrl;
      const filename = document.originalName || document.name || '';
      
      // For PDFs on Cloudinary, convert to proper format
      if (isPDF(filename) && url.includes('cloudinary.com')) {
        // Replace /image/upload/ with /image/upload/fl_attachment/
        return url.replace('/upload/', '/upload/fl_attachment/');
      }
      return url;
    }
    const filename = document.path?.split('/').pop() || document.path;
    const token = localStorage.getItem('token');
    return `http://localhost:5000/api/documents/${filename}?token=${token}`;
  };

  const documentUrl = getDocumentUrl();
  const filename = document.originalName || document.name || 'Document';
  const fileExt = getFileExtension(filename);

  const handleLoad = () => setLoading(false);
  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{filename}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg mb-2">Cannot preview this file</p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download File
              </a>
            </div>
          )}

          {!error && (
            <>
              {isImage(filename) && (
                <div className="flex justify-center">
                  <img
                    src={documentUrl}
                    alt={filename}
                    className="max-w-full max-h-full object-contain"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{ display: loading ? 'none' : 'block' }}
                  />
                </div>
              )}

              {isPDF(filename) && (
                <iframe
                  src={`${documentUrl}#toolbar=0`}
                  className="w-full h-full min-h-[500px] border-0"
                  onLoad={handleLoad}
                  onError={handleError}
                  style={{ display: loading ? 'none' : 'block' }}
                  title={filename}
                />
              )}

              {!isImage(filename) && !isPDF(filename) && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg mb-2">Preview not available</p>
                  <p className="text-sm mb-4">File type: {fileExt.toUpperCase() || 'Unknown'}</p>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download File
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            File type: {fileExt.toUpperCase() || 'Unknown'}
          </div>
          <div className="flex gap-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;