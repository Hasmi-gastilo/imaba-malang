// Vercel Serverless Function - Single file handler
// This bypasses the complex server.js setup

module.exports = async (req, res) => {
  // Test if this function even runs
  const path = req.url || '';
  
  if (path.includes('/api/test')) {
    return res.json({ 
      success: true, 
      message: 'Vercel serverless function is working!',
      env: {
        hasFbEnv: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        fbLength: process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0,
        hasCloudinary: !!process.env.CLOUDINARY_API_KEY,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
  
  res.json({ success: false, message: 'Endpoint not found', path });
};
