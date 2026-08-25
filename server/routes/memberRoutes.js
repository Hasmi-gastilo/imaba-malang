const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes (with optional auth for admin fields)
const { optionalAuth } = require('../middleware/authMiddleware');
router.get('/', optionalAuth, memberController.getAllMembers);
router.get('/verify/:memberId', memberController.getMemberByMemberId);
router.post('/apply', upload.single('photo'), memberController.createApplication);

// Protected routes
router.get('/stats', authMiddleware, memberController.getMemberStats);
router.get('/:id', authMiddleware, memberController.getMemberById);

// Admin routes
router.get('/applications/all', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), memberController.getAllApplications);
router.post('/applications/:id/approve', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), memberController.approveApplication);
router.post('/applications/:id/reject', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), memberController.rejectApplication);
router.put('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), memberController.updateMember);
router.delete('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), memberController.deleteMember);

module.exports = router;
