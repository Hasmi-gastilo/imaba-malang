const express = require('express');
const router = express.Router();
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');

router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }
    
    const fileUrl = await uploadToCloudinary(req.file.buffer, 'uploads');
    
    res.status(200).json({ 
      success: true, 
      message: 'File berhasil diunggah',
      data: { url: fileUrl } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
