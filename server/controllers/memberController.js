const { db } = require('../config/firebase');
const { uploadToCloudinary } = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const path = require('path');

const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

exports.getAllMembers = async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;
    
    let query = db.collection('members');
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    let members = snapshot.docs.map(formatDoc);
    
    if (search) {
      const s = search.toLowerCase();
      members = members.filter(m => 
        (m.fullName || '').toLowerCase().includes(s) || 
        (m.nim || '').toLowerCase().includes(s)
      );
    }

    // Hide sensitive data if NOT an admin
    const isAdmin = req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN');
    if (!isAdmin) {
      members = members.map(m => {
        return {
          _id: m._id,
          fullName: m.fullName,
          university: m.university,
          batch: m.batch,
          address: m.address,
          photo: m.photo,
          status: m.status
        };
      });
    }

    res.json({ success: true, data: { members, total: members.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const doc = await db.collection('members').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    
    const member = formatDoc(doc);
    if (req.user && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
      delete member.address;
      delete member.whatsapp;
      delete member.birthDate;
      delete member.birthPlace;
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMemberByMemberId = async (req, res) => {
  try {
    const snapshot = await db.collection('members').where('memberId', '==', req.params.memberId).limit(1).get();
    if (snapshot.empty) return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    
    const member = formatDoc(snapshot.docs[0]);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    let photoUrl = '';
    
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer, 'members');
    }

    const applicationData = {
      ...req.body,
      photo: photoUrl || req.body.photo,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('applications').add(applicationData);
    res.status(201).json({ success: true, message: 'Pendaftaran berhasil.', data: { _id: docRef.id, ...applicationData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const { status = 'PENDING' } = req.query;
    const snapshot = await db.collection('applications').where('status', '==', status).get();
    const applications = snapshot.docs.map(formatDoc);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveApplication = async (req, res) => {
  try {
    const docRef = db.collection('applications').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
    
    const application = doc.data();
    if (application.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Aplikasi sudah diproses' });

    const memberId = 'IMABA-' + Math.floor(Math.random() * 1000000);
    const memberData = {
      ...application, // Salin semua data dari form pendaftaran (NIM, univ, photo, dll)
      memberId,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString()
    };

    const memberRef = await db.collection('members').add(memberData);

    const tempPassword = await bcrypt.hash('imaba123', 10);
    await db.collection('users').add({
      username: memberId,
      email: application.email,
      password: tempPassword,
      role: 'MEMBER',
      memberId: memberRef.id,
      isActive: true
    });

    await docRef.update({
      status: 'APPROVED',
      reviewedBy: req.user.id,
      reviewedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Disetujui', data: memberData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    await db.collection('applications').doc(req.params.id).update({
      status: 'REJECTED',
      rejectionReason: reason,
      reviewedBy: req.user.id,
      reviewedAt: new Date().toISOString()
    });
    res.json({ success: true, message: 'Pendaftaran ditolak.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    await db.collection('members').doc(req.params.id).update(req.body);
    const updated = await db.collection('members').doc(req.params.id).get();
    res.json({ success: true, data: formatDoc(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await db.collection('members').doc(req.params.id).delete();
    res.json({ success: true, message: 'Anggota berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMemberStats = async (req, res) => {
  try {
    const snapshot = await db.collection('members').get();
    const members = snapshot.docs.map(formatDoc);
    
    const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
    const alumniMembers = members.filter(m => m.status === 'ALUMNI').length;

    res.json({
      success: true,
      data: {
        totalMembers: members.length,
        activeMembers,
        alumniMembers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
