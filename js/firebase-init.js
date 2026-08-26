import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// TODO: REPLACE THIS ENTIRE CONFIG OBJECT WITH YOUR FIREBASE WEB APP CONFIG
// You can find this in Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyDLuB5i6QsKzh3E9Ri1sGXm9AKYNEhIafc",
  authDomain: "imaba-malang-db.firebaseapp.com",
  projectId: "imaba-malang-db",
  storageBucket: "imaba-malang-db.firebasestorage.app",
  messagingSenderId: "591652789353",
  appId: "1:591652789353:web:afd5ca38e30d0471c5d6f8",
  measurementId: "G-KTFCNF5ZF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, auth, db, storage };
