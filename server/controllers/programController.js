const { db } = require('../config/firebase');
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

exports.getAllPrograms = async (req, res) => {
  try {
    const snapshot = await db.collection('programs').get();
    const programs = snapshot.docs.map(formatDoc);
    res.json({ success: true, count: programs.length, data: programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const doc = await db.collection('programs').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
    res.json({ success: true, data: formatDoc(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      progress: parseInt(req.body.progress) || 0,
      budget: parseInt(req.body.budget) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await db.collection('programs').add(payload);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...payload } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const docRef = db.collection('programs').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
    
    const payload = { ...req.body, updatedAt: new Date().toISOString() };
    if (payload.progress !== undefined) payload.progress = parseInt(payload.progress) || 0;
    if (payload.budget !== undefined) payload.budget = parseInt(payload.budget) || 0;
    
    await docRef.update(payload);
    const updated = await docRef.get();
    res.json({ success: true, data: formatDoc(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    await db.collection('programs').doc(req.params.id).delete();
    res.json({ success: true, message: 'Program berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
