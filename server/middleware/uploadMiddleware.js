const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('application/pdf') ||
                   file.mimetype.includes('document') ||
                   file.mimetype.includes('spreadsheet') ||
                   file.mimetype.includes('presentation');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: File type not supported!'));
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
