import { auth, db } from './firebase-init.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { storage } from './firebase-init.js';

/**
 * API Communication Handler (Firebase Client SDK Version)
 * Centralized API calls for the application
 */

class API {
  constructor() {
    this.user = null;
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        // Optionally fetch role from firestore
      } else {
        this.user = null;
      }
    });
  }

  // ===================================
  // AUTH APIs
  // ===================================

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user profile to get role
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      let role = 'MEMBER';
      if (docSnap.exists()) {
        role = docSnap.data().role || 'MEMBER';
      }
      
      const userObj = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: role
      };
      
      localStorage.setItem('user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message);
    }
  }

  async register(userData) {
    // Note: Creating a user via client SDK automatically signs them in.
    // If you need admin to create users without signing in, you need Cloud Functions.
    // For now, assuming basic user registration.
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Save extra data to Firestore
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        name: userData.name,
        role: 'MEMBER',
        createdAt: new Date().toISOString()
      });
      
      return { success: true, message: "User registered successfully" };
    } catch (error) {
      console.error("Register error:", error);
      throw new Error(error.message);
    }
  }

  async getProfile() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: true, data: { email: user.email } };
    }
  }

  // ===================================
  // HOMEPAGE APIs
  // ===================================

  async getHomepageData() {
    try {
      const docRef = doc(db, "settings", "homepage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: true, data: {} };
    } catch (error) {
      console.error("Error fetching homepage:", error);
      throw error;
    }
  }

  async updateHomepageData(data) {
    try {
      const docRef = doc(db, "settings", "homepage");
      await updateDoc(docRef, data);
      return { success: true, message: "Homepage updated" };
    } catch (error) {
      console.error("Error updating homepage:", error);
      throw error;
    }
  }

  // ===================================
  // NEWS APIs
  // ===================================

  async getAllNews(params = {}) {
    try {
      const newsCol = collection(db, "news");
      let q = query(newsCol, orderBy("createdAt", "desc"));
      // Add pagination/filtering to query if needed based on params
      
      const querySnapshot = await getDocs(q);
      const newsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: newsList };
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }

  async getNewsById(id) {
    try {
      const docRef = doc(db, "news", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      throw new Error("News not found");
    } catch (error) {
      console.error("Error fetching news by id:", error);
      throw error;
    }
  }

  // ===================================
  // EVENTS APIs
  // ===================================

  async getAllEvents(params = {}) {
    try {
      const eventsCol = collection(db, "events");
      let q = query(eventsCol, orderBy("date", "desc"));
      
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: eventsList };
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  // ===================================
  // MEMBER APIs
  // ===================================

  async getAllMembers(params = {}) {
    try {
      const memCol = collection(db, "members");
      const querySnapshot = await getDocs(memCol);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: list, pagination: { total: list.length, page: 1, pages: 1 } };
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }

  async getMemberStats() {
    try {
      const memCol = collection(db, "members");
      const snapshot = await getDocs(memCol);
      return { success: true, data: { totalMembers: snapshot.size } };
    } catch (error) {
      console.error("Error fetching member stats:", error);
      return { success: true, data: { totalMembers: 0 } };
    }
  }

  // ===================================
  // STORAGE APIs
  // ===================================

  async uploadImage(file, path = 'uploads') {
    try {
      const extension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

}

// Create a global API instance and expose it
const api = new API();
window.api = api;

// Helper functions (exposed globally for backward compatibility)
window.isAuthenticated = function() {
  return !!localStorage.getItem('user');
}

window.getCurrentUser = function() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

window.logout = async function() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error", error);
  }
  localStorage.removeItem('user');
  const path = window.location.pathname;
  window.location.href = path.includes('/admin/') ? '../login.html' : 'login.html';
}

window.hasRole = function(requiredRoles) {
  const user = window.getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  return user.role === requiredRoles;
}

window.requireAuth = function() {
  if (!window.isAuthenticated()) {
    const path = window.location.pathname;
    window.location.href = path.includes('/admin/') ? '../login.html' : 'login.html';
    return false;
  }
  return true;
}

window.requireAdmin = function() {
  if (!window.requireAuth()) return false;
  
  if (!window.hasRole(['SUPER_ADMIN', 'ADMIN'])) {
    alert('Anda tidak memiliki akses ke halaman ini.');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}
