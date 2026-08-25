const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllPrograms, getProgramById, createProgram, updateProgram, deleteProgram } = require('../controllers/programController');

router.get('/', getAllPrograms);
router.get('/:id', getProgramById);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createProgram);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateProgram);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteProgram);

module.exports = router;
