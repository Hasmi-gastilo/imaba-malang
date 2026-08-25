const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Username atau email sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username,
      email,
      password: hashedPassword,
      role: role || 'MEMBER',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users').add(payload);

    await db.collection('auditLogs').add({
      userId: docRef.id,
      action: 'REGISTER',
      targetModel: 'User',
      targetId: docRef.id,
      details: `User ${username} registered`,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: { id: docRef.id, username, email, role: payload.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    user._id = userDoc.id;

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Akun Anda tidak aktif. Silakan hubungi admin.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.AUTH_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    await db.collection('auditLogs').add({
      userId: user._id,
      action: 'LOGIN',
      targetModel: 'User',
      targetId: user._id,
      details: `User ${user.username} logged in`,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // req.user is populated from authMiddleware
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userDoc = await db.collection('users').doc(req.user.id).get();
    if (!userDoc.exists) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    
    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(req.user.id).update({ password: hashedPassword });

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
