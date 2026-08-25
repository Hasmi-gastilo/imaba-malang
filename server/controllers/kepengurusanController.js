const { db } = require('../config/firebase');
const { uploadToCloudinary } = require('../config/cloudinary');
const path = require('path');
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });



exports.getKepengurusan = async (req, res) => {
  try {
    // In NoSQL Firestore, we might have members with 'position' and 'department'
    const snapshot = await db.collection('members').where('isActive', '==', true).get();
    const members = snapshot.docs.map(formatDoc);
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const snapshot = await db.collection('departments').get();
    const depts = snapshot.docs.map(formatDoc);
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const docRef = await db.collection('departments').add(req.body);
    res.status(201).json({ success: true, data: { _id: docRef.id, ...req.body }, message: 'Departemen berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const docRef = db.collection('departments').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Departemen tidak ditemukan' });
    
    await docRef.update(req.body);
    const updated = await docRef.get();
    res.json({ success: true, data: formatDoc(updated), message: 'Departemen berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await db.collection('departments').doc(req.params.id).delete();
    res.json({ success: true, message: 'Departemen berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPositions = async (req, res) => {
  try {
    const snapshot = await db.collection('positions').get();
    const pos = snapshot.docs.map(formatDoc);
    res.json({ success: true, data: pos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
