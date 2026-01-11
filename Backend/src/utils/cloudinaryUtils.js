const getCloudinaryUrl = (publicId, resourceType = 'image', format = null) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  if (resourceType === 'raw') {
    // For PDFs and other raw files
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}${format ? '.' + format : ''}`;
  } else {
    // For images
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
};

const isPDF = (filename) => {
  return filename?.toLowerCase().endsWith('.pdf');
};

module.exports = { getCloudinaryUrl, isPDF };