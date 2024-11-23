const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ossItems',
    allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp', 'svg']
  }
});

const storageProfilePicture = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ossProfilePictures',
    allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp', 'svg']
  }
})

// Function to upload a file to Cloudinary
const uploadFileToCloudinary = async (filePath) => {
  try {
    const uploadParams = {
      folder: 'ossItems',
      allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp', 'svg'],
      timestamp: Math.floor(Date.now() / 1000), // Current timestamp
    };

    const result = await cloudinary.uploader.upload(filePath, uploadParams);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};



module.exports = { cloudinary, storage, storageProfilePicture, uploadFileToCloudinary }