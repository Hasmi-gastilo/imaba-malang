const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to get homepage content
router.get('/', homepageController.getHomepageData);

// Protected admin route to update homepage content
router.put('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'aboutImage', maxCount: 1 }]), homepageController.updateHomepageData);

module.exports = router;
