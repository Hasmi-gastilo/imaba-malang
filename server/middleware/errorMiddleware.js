/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} sudah digunakan.`
    });
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File terlalu besar. Maksimal 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // JWT errors are handled in authMiddleware

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server.'
  });
};

module.exports = errorMiddleware;
