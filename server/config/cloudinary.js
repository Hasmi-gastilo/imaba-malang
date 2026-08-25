const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generic upload function using streamifier for buffer uploads
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `imaba-malang/${folder}` },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
