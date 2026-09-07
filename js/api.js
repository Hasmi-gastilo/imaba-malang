import { supabase } from './supabase-init.js?v=1788698000';

class API {
  constructor() {
    this.user = null;
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        this.user = session.user;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      const user = data.user;
      
      // Fetch user profile to get role
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      let role = 'MEMBER';
      let username = user.email;
      
      if (profileData) {
        role = profileData.role || 'MEMBER';
        username = profileData.username || profileData.email || 'Admin';
      } else {
        if (email.includes('admin') || email.includes('imaba')) {
          role = 'SUPER_ADMIN';
          username = 'Super Admin';
        }
      }
      
      const userObj = {
        uid: user.id,
        email: user.email,
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

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: error.message };
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  hasRole(requiredRoles) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (typeof requiredRoles === 'string') {
      return user.role === requiredRoles;
    }
    
    return requiredRoles.includes(user.role);
  }

  // ===================================
  // HOMEPAGE APIs
  // ===================================
  
  async getHomepageData() {
    try {
      const { data, error } = await supabase
        .from('homepage_data')
        .select('*')
        .eq('id', 'main')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      return { success: true, data: data || {} };
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      return { success: true, data: {} };
    }
  }

  async updateHomepageData(data) {
    try {
      const { error } = await supabase
        .from('homepage_data')
        .upsert({ id: 'main', ...data, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error updating homepage data:", error);
      return { success: false, message: error.message };
    }
  }

  // ===================================
  // BERITA / NEWS APIs
  // ===================================

  _mapNewsFromDB(dbRow) {
    if (!dbRow) return null;
    return {
      _id: dbRow.id,
      id: dbRow.id,
      title: dbRow.title,
      category: dbRow.category,
      isPublished: dbRow.is_published,
      publishedAt: dbRow.published_at,
      thumbnail: dbRow.thumbnail,
      excerpt: dbRow.excerpt,
      content: dbRow.content,
      tags: dbRow.tags ? (typeof dbRow.tags === 'string' ? dbRow.tags.split(',').map(s=>s.trim()) : dbRow.tags) : [],
      createdAt: dbRow.created_at,
    };
  }

  _mapNewsToDB(payload) {
    const dbPayload = {};
    if (payload.title !== undefined) dbPayload.title = payload.title;
    if (payload.category !== undefined) dbPayload.category = payload.category;
    if (payload.thumbnail !== undefined) dbPayload.thumbnail = payload.thumbnail;
    if (payload.excerpt !== undefined) dbPayload.excerpt = payload.excerpt;
    if (payload.content !== undefined) dbPayload.content = payload.content;
    
    if (payload.isPublished !== undefined) {
      dbPayload.is_published = payload.isPublished;
      if (payload.isPublished) {
        dbPayload.published_at = new Date().toISOString();
      } else {
        dbPayload.published_at = null;
      }
    }
    if (payload.tags !== undefined) {
      dbPayload.tags = Array.isArray(payload.tags) ? payload.tags.join(', ') : payload.tags;
    }
    return dbPayload;
  }

  async getAllNews(params = {}) {
    try {
      let query = supabase.from('news').select('*').order('created_at', { ascending: false });
      
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data: data.map(this._mapNewsFromDB) };
    } catch (error) {
      console.error("Get all news error:", error);
      return { success: false, data: [] };
    }
  }

  async createNews(data) {
    try {
      const dbPayload = this._mapNewsToDB(data);
      dbPayload.created_at = new Date().toISOString();
      
      const { data: resData, error } = await supabase
        .from('news')
        .insert([dbPayload])
        .select();
        
      if (error) throw error;
      return { success: true, id: resData[0].id };
    } catch (error) {
      console.error("Create news error:", error);
      return { success: false, message: error.message };
    }
  }

  async updateNews(id, data) {
    try {
      const dbPayload = this._mapNewsToDB(data);
      
      const { error } = await supabase
        .from('news')
        .update(dbPayload)
        .eq('id', id);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Update news error:", error);
      return { success: false, message: error.message };
    }
  }

  async deleteNews(id) {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Delete news error:", error);
      return { success: false, message: error.message };
    }
  }

  async getNewsById(id) {
    try {
      const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
      if (error) throw error;
      return { success: true, data: this._mapNewsFromDB(data) };
    } catch (error) {
      console.error("Get news by ID error:", error);
      return { success: false, message: error.message };
    }
  }

  // ===================================
  // PAGES (HALAMAN) APIs
  // ===================================
  
  async getPageBySlug(slug) {
    try {
      const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Get page error:", error);
      return { success: false, message: error.message };
    }
  }

  async updatePage(slug, data) {
    try {
      data.updated_at = new Date().toISOString();
      const { error } = await supabase.from('pages').update(data).eq('slug', slug);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Update page error:", error);
      return { success: false, message: error.message };
    }
  }

  // ===================================
  _mapEventToDB(payload) {
    const dbPayload = {};
    if (payload.title !== undefined) dbPayload.title = payload.title;
    if (payload.category !== undefined) dbPayload.category = payload.category;
    if (payload.status !== undefined) dbPayload.status = payload.status;
    if (payload.date !== undefined) dbPayload.date = payload.date;
    if (payload.startTime !== undefined) dbPayload.start_time = payload.startTime;
    if (payload.endTime !== undefined) dbPayload.end_time = payload.endTime;
    if (payload.location !== undefined) dbPayload.location = payload.location;
    if (payload.pic !== undefined) dbPayload.pic = payload.pic;
    if (payload.picContact !== undefined) dbPayload.pic_contact = payload.picContact;
    if (payload.description !== undefined) dbPayload.description = payload.description;
    if (payload.poster !== undefined) dbPayload.poster = payload.poster;
    return dbPayload;
  }

  _mapEventFromDB(db) {
    return {
      _id: db.id,
      title: db.title,
      category: db.category,
      status: db.status,
      date: db.date,
      startTime: db.start_time,
      endTime: db.end_time,
      location: db.location,
      pic: db.pic,
      picContact: db.pic_contact,
      description: db.description,
      poster: db.poster,
      created_at: db.created_at
    };
  }

  _mapProgramToDB(payload) {
    const dbPayload = {};
    if (payload.name !== undefined) dbPayload.title = payload.name;
    if (payload.status !== undefined) dbPayload.status = payload.status;
    if (payload.startDate !== undefined) dbPayload.start_date = payload.startDate;
    if (payload.endDate !== undefined) dbPayload.end_date = payload.endDate;
    if (payload.pic !== undefined) dbPayload.pic = payload.pic;
    if (payload.picContact !== undefined) dbPayload.pic_contact = payload.picContact;
    if (payload.progress !== undefined) dbPayload.progress = payload.progress;
    if (payload.budget !== undefined) dbPayload.budget = payload.budget;
    if (payload.description !== undefined) dbPayload.description = payload.description;
    if (payload.image !== undefined) dbPayload.poster = payload.image;
    return dbPayload;
  }

  _mapProgramFromDB(db) {
    return {
      _id: db.id,
      name: db.title,
      status: db.status,
      startDate: db.start_date,
      endDate: db.end_date,
      pic: db.pic,
      picContact: db.pic_contact,
      progress: db.progress,
      budget: db.budget,
      description: db.description,
      image: db.poster,
      created_at: db.created_at
    };
  }

  // EVENTS (AGENDA) APIs
  // ===================================

  async getAllEvents(params = {}) {
    try {
      let query = supabase.from('events').select('*').order('date', { ascending: true });
      if (params.limit) query = query.limit(params.limit);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data: { events: data.map(this._mapEventFromDB) } };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { success: true, data: [] };
    }
  }

  async getEventById(id) {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) throw error;
      return { success: true, data: this._mapEventFromDB(data) };
    } catch (error) {
      console.error("Error fetching event:", error);
      return { success: false, message: error.message };
    }
  }

  async createEvent(data) {
    try {
      const dbPayload = this._mapEventToDB(data);
      dbPayload.created_at = new Date().toISOString();
      const { data: resData, error } = await supabase
        .from('events')
        .insert([dbPayload])
        .select();
      if (error) throw error;
      return { success: true, id: resData[0].id };
    } catch (error) {
      console.error("Create event error:", error);
      return { success: false, message: error.message };
    }
  }

  async updateEvent(id, data) {
    try {
      const dbPayload = this._mapEventToDB(data);
      const { error } = await supabase.from('events').update(dbPayload).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Update event error:", error);
      return { success: false, message: error.message };
    }
  }

  async deleteEvent(id) {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Delete event error:", error);
      return { success: false, message: error.message };
    }
  }

  // ===================================
  // PROGRAMS APIs
  // ===================================

  async getAllPrograms(params = {}) {
    try {
      let query = supabase.from('programs').select('*').order('created_at', { ascending: true });
      if (params.limit) query = query.limit(params.limit);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data: data.map(this._mapProgramFromDB) };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  async getProgramById(id) {
    try {
      const { data, error } = await supabase.from('programs').select('*').eq('id', id).single();
      if (error) throw error;
      return { success: true, data: this._mapProgramFromDB(data) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createProgram(data) {
    try {
      const dbPayload = this._mapProgramToDB(data);
      dbPayload.created_at = new Date().toISOString();
      const { data: resData, error } = await supabase.from('programs').insert([dbPayload]).select();
      if (error) throw error;
      return { success: true, id: resData[0].id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProgram(id, data) {
    try {
      const dbPayload = this._mapProgramToDB(data);
      const { error } = await supabase.from('programs').update(dbPayload).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteProgram(id) {
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ===================================
  // PENGURUS APIs
  // ===================================

  async getAllPengurus(params = {}) {
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return { success: true, data: data.map(d => ({ _id: d.id, id: d.id, ...d })) };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  async createPengurus(data) {
    try {
      const { data: resData, error } = await supabase
        .from('pengurus')
        .insert([{ ...data, created_at: new Date().toISOString() }])
        .select();
      if (error) throw error;
      return { success: true, id: resData[0].id };
    } catch (error) {
      throw new Error(error.message || 'Gagal menyimpan pengurus');
    }
  }

  async updatePengurus(id, data) {
    try {
      const { error } = await supabase.from('pengurus').update(data).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Gagal memperbarui pengurus');
    }
  }

  async deletePengurus(id) {
    try {
      const { error } = await supabase.from('pengurus').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ===================================
  // PENDAFTARAN / APPLICATIONS APIs
  // ===================================

  async getAllApplications(status = null) {
    try {
      let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data.map(d => ({ _id: d.id, id: d.id, ...d })) };
    } catch (error) {
      console.error("Error fetching applications:", error);
      return { success: true, data: [] };
    }
  }

  async approveApplication(id) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'ACTIVE' })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error approving application:", error);
      return { success: false, message: error.message };
    }
  }

  async rejectApplication(id, reason) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'REJECTED', rejectReason: reason })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error rejecting application:", error);
      return { success: false, message: error.message };
    }
  }

  async createApplication(formData) {
    try {
      // Convert FormData to a plain object
      const data = {};
      for (const [key, value] of formData.entries()) {
        if (key !== 'photo') {
          data[key] = value;
        }
      }

      // Handle photo upload
      const photoFile = formData.get('photo');
      if (photoFile && photoFile.size > 0) {
        try {
          const photoUrlRes = await this.uploadImage(photoFile, 'pendaftaran');
          data.photoUrl = photoUrlRes.url;
        } catch (uploadErr) {
          console.warn("Photo upload failed:", uploadErr);
          data.photoUrl = '';
        }
      }

      // Add metadata
      data.status = 'PENDING';
      data.created_at = new Date().toISOString();

      // Save to Supabase
      const { data: resData, error } = await supabase
        .from('applications')
        .insert([data])
        .select();
        
      if (error) throw error;
      
      return { success: true, message: "Pendaftaran berhasil dikirim.", id: resData[0].id };
    } catch (error) {
      console.error("Create application error:", error);
      return { success: false, message: error.message || "Gagal mengirim pendaftaran." };
    }
  }

  // ===================================
  // MEMBERS (ANGGOTA) APIs
  // Anggota = pendaftar yang sudah disetujui (status ACTIVE/ALUMNI)
  // ===================================

  async getAllMembers(params = {}) {
    try {
      let query;
      if (params.status) {
        query = supabase.from('applications').select('*').eq('status', params.status).order('created_at', { ascending: false });
      } else {
        query = supabase.from('applications').select('*').in('status', ['ACTIVE', 'ALUMNI']).order('created_at', { ascending: false });
      }
      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: { members: data.map(d => ({ _id: d.id, id: d.id, ...d })) } };
    } catch (error) {
      return { success: true, data: { members: [] } };
    }
  }

  async deleteMember(id) {
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getMemberStats() {
    try {
      const { count, error } = await supabase.from('applications').select('*', { count: 'exact', head: true }).in('status', ['ACTIVE', 'ALUMNI']);
      if (error) throw error;
      return { success: true, data: { totalMembers: count || 0 } };
    } catch (error) {
      return { success: true, data: { totalMembers: 0 } };
    }
  }

  // ===================================
  // STORAGE APIs
  // ===================================

  async uploadImage(file, path = 'uploads') {
    return new Promise(async (resolve, reject) => {
      try {
        const extension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
        const filePath = `${path}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);
          
        resolve({ success: true, url: urlData.publicUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        reject(error);
      }
    });
  }
}

// Create a global API instance and expose it
const api = new API();
window.api = api;

// Helper functions (exposed globally for backward compatibility)
window.isAuthenticated = function() {
  return window.api.isAuthenticated();
}

window.getCurrentUser = function() {
  return window.api.getCurrentUser();
}

window.hasRole = function(requiredRoles) {
  return window.api.hasRole(requiredRoles);
}

window.logout = async function() {
  await window.api.logout();
  const path = window.location.pathname;
  window.location.href = path.includes('/admin/') ? '../login.html' : 'login.html';
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


