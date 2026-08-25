const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getKepengurusan, getAllDepartments, createDepartment, updateDepartment,
  deleteDepartment, getAllPositions
} = require('../controllers/kepengurusanController');

// Publik
router.get('/', getKepengurusan);
router.get('/departments', getAllDepartments);
router.get('/positions', getAllPositions);

// Admin
router.post('/departments', protect, authorize('SUPER_ADMIN', 'ADMIN'), createDepartment);
router.put('/departments/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateDepartment);
router.delete('/departments/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteDepartment);

module.exports = router;
