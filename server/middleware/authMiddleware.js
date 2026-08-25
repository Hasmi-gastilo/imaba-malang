const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

/**
 * Middleware to verify JWT token
 * (Jika Anda migrasi full ke Firebase Auth, ini bisa diganti dengan admin.auth().verifyIdToken.
 * Namun karena permintaan hanya migrasi database, kita tetapkan JWT tetapi ambil user dari Firestore)
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    // Ambil user dari Firestore collection 'users'
    const userDoc = await db.collection('users').doc(decoded.userId).get();

    if (!userDoc.exists) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const user = userDoc.data();
    user.id = userDoc.id; // Tambahkan id doc ke object user

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Akun Anda tidak aktif.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token tidak valid.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token telah kadaluarsa.' });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

const protect = authMiddleware;

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk aksi ini.' });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (userDoc.exists) {
      const user = userDoc.data();
      user.id = userDoc.id;
      if (user.isActive) req.user = user;
    }
    next();
  } catch (error) {
    // If token is invalid or expired, just proceed as public user
    next();
  }
};

module.exports = authMiddleware;
module.exports.protect = protect;
module.exports.authorize = authorize;
module.exports.optionalAuth = optionalAuth;
