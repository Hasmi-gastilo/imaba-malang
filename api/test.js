// Diagnostic endpoint - test if server.js loads correctly
module.exports = async (req, res) => {
  const errors = [];
  const successes = [];

  // Test 1: Firebase Admin loading
  try {
    const { initializeApp, cert, getApps } = require('firebase-admin/app');
    const fbEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    const parsed = JSON.parse(fbEnv);
    
    if (getApps().length === 0) {
      initializeApp({ credential: cert(parsed), storageBucket: 'imaba-malang-db.appspot.com' });
    }
    successes.push('Firebase Admin init: OK');
  } catch (e) {
    errors.push('Firebase Admin init: ' + e.message);
  }

  // Test 2: Firestore
  try {
    const { getFirestore } = require('firebase-admin/firestore');
    const db = getFirestore();
    successes.push('Firestore get: OK');
  } catch (e) {
    errors.push('Firestore: ' + e.message);
  }

  // Test 3: Storage
  try {
    const { getStorage } = require('firebase-admin/storage');
    const bucket = getStorage().bucket();
    successes.push('Storage bucket: OK');
  } catch (e) {
    errors.push('Storage: ' + e.message);
  }

  // Test 4: Try loading full server.js
  try {
    const app = require('../server/server.js');
    successes.push('server.js loaded: OK');
  } catch (e) {
    errors.push('server.js load error: ' + e.message + ' | stack: ' + (e.stack ? e.stack.split('\n')[1] : 'no stack'));
  }

  res.json({ successes, errors });
};
