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
      let username = userCredential.user.email;
      
      if (docSnap.exists()) {
        role = docSnap.data().role || 'MEMBER';
        username = docSnap.data().username || docSnap.data().email || 'Admin';
      } else {
        // Fallback: Check if they have a legacy user doc with this email
        const usersCol = collection(db, "users");
        const q = query(usersCol, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const legacyDoc = querySnapshot.docs[0];
          role = legacyDoc.data().role || 'MEMBER';
          username = legacyDoc.data().username || email;
          
          // Optionally, we could migrate the doc to the new UID here, but for safety we just grant the role.
        } else if (email.includes('admin') || email.includes('imaba')) {
          // Hard fallback for admin emails if collection is empty
          role = 'SUPER_ADMIN';
          username = 'Super Admin';
        }
      }
      
      const userObj = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: role,
        username: username
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
      
      const querySnapshot = await getDocs(q);
      const newsList = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: newsList };
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }

  async createNews(data) {
    try {
      const docRef = await addDoc(collection(db, "news"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: { _id: docRef.id } };
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  }

  async updateNews(id, data) {
    try {
      await updateDoc(doc(db, "news", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  }

  async deleteNews(id) {
    try {
      await deleteDoc(doc(db, "news", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting news:", error);
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
      const eventsList = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: eventsList };
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  async createEvent(data) {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: { _id: docRef.id } };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async updateEvent(id, data) {
    try {
      await updateDoc(doc(db, "events", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      await deleteDoc(doc(db, "events", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // ===================================
  // PROGRAM APIs
  // ===================================

  async getAllPrograms(params = {}) {
    try {
      const progCol = collection(db, "programs");
      const querySnapshot = await getDocs(progCol);
      const programsList = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: programsList };
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  }

  async createProgram(data) {
    try {
      const docRef = await addDoc(collection(db, "programs"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: { _id: docRef.id } };
    } catch (error) {
      console.error("Error creating program:", error);
      throw error;
    }
  }

  async updateProgram(id, data) {
    try {
      await updateDoc(doc(db, "programs", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  }

  async deleteProgram(id) {
    try {
      await deleteDoc(doc(db, "programs", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  }

  // ===================================
  // PENGURUS APIs
  // ===================================

  async getAllPengurus(params = {}) {
    try {
      const colRef = collection(db, "pengurus");
      const querySnapshot = await getDocs(colRef);
      const list = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: list };
    } catch (error) {
      console.error("Error fetching pengurus:", error);
      throw error;
    }
  }

  async createPengurus(data) {
    try {
      const docRef = await addDoc(collection(db, "pengurus"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: { _id: docRef.id } };
    } catch (error) {
      console.error("Error creating pengurus:", error);
      throw error;
    }
  }

  async updatePengurus(id, data) {
    try {
      await updateDoc(doc(db, "pengurus", id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating pengurus:", error);
      throw error;
    }
  }

  async deletePengurus(id) {
    try {
      await deleteDoc(doc(db, "pengurus", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting pengurus:", error);
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
      const list = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: { members: list, pagination: { total: list.length, page: 1, pages: 1 } } };
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }

  async deleteMember(id) {
    try {
      await deleteDoc(doc(db, "members", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting member:", error);
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
