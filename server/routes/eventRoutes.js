const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createEvent);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateEvent);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteEvent);

module.exports = router;
