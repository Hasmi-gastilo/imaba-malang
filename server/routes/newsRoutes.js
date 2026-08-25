const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllNews, getNewsBySlug, adminGetAllNews, getNewsById,
  createNews, updateNews, deleteNews
} = require('../controllers/newsController');

// Publik
router.get('/', getAllNews);
router.get('/slug/:slug', getNewsBySlug);

// Admin only
router.get('/admin/all', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), adminGetAllNews);
router.get('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getNewsById);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createNews);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateNews);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteNews);

module.exports = router;
