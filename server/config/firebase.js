const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');

let app;

try {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  } else {
    try {
      const serviceAccount = require('../../firebase-key.json');
      credential = cert(serviceAccount);
    } catch (e) {
      console.warn("⚠️ Peringatan: firebase-key.json tidak ditemukan. Menggunakan kredensial default sementara.");
      credential = undefined; 
    }
  }

  app = initializeApp({
    credential: credential,
    storageBucket: 'imaba-malang-db.appspot.com'
  });
  console.log("🔥 Firebase Admin SDK berhasil diinisialisasi.");
} catch (error) {
  console.error("❌ Gagal menginisialisasi Firebase Admin SDK:", error.message);
}

let db, auth, bucket;
try {
  db = getFirestore();
  auth = getAuth();
  bucket = getStorage().bucket();
} catch (e) {
  console.error("Firebase services not initialized:", e.message);
}

module.exports = { db, auth, bucket };
