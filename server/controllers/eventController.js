const { db } = require('../config/firebase');
const { uploadToCloudinary } = require('../config/cloudinary');
const path = require('path');
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });



exports.getAllEvents = async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const events = snapshot.docs.map(formatDoc);
    res.json({ success: true, count: events.length, data: { events } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const doc = await db.collection('events').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Event tidak ditemukan' });
    res.json({ success: true, data: formatDoc(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await db.collection('events').add(payload);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...payload } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const docRef = db.collection('events').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Event tidak ditemukan' });
    
    const payload = { ...req.body, updatedAt: new Date().toISOString() };
    await docRef.update(payload);
    
    const updated = await docRef.get();
    res.json({ success: true, data: formatDoc(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await db.collection('events').doc(req.params.id).delete();
    res.json({ success: true, message: 'Event berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
