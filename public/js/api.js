/**
 * API Communication Handler
 * Centralized API calls for the application
 */

const API_BASE_URL = 'http://localhost:3000/api';

class API {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  /**
   * Set authorization token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Remove authorization token
   */
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  /**
   * Get authorization headers
   */
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Generic fetch wrapper
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.isFormData)
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, isFormData = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      isFormData
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // ===================================
  // AUTH APIs
  // ===================================

  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async changePassword(currentPassword, newPassword) {
    return this.put('/auth/change-password', { currentPassword, newPassword });
  }

  // ===================================
  // MEMBER APIs
  // ===================================

  async getAllMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/members?${queryString}`);
  }

  async getMemberById(id) {
    return this.get(`/members/${id}`);
  }

  async verifyMember(memberId) {
    return this.get(`/members/verify/${memberId}`);
  }

  async createApplication(formData) {
    return this.post('/members/apply', formData, true);
  }

  async getMemberStats() {
    return this.get('/members/stats');
  }

  async getAllApplications(status = 'PENDING') {
    return this.get(`/members/applications/all?status=${status}`);
  }

  async approveApplication(id) {
    return this.post(`/members/applications/${id}/approve`);
  }

  async rejectApplication(id, reason) {
    return this.post(`/members/applications/${id}/reject`, { reason });
  }

  async updateMember(id, data) {
    return this.put(`/members/${id}`, data);
  }

  async deleteMember(id) {
    return this.delete(`/members/${id}`);
  }

  // ===================================
  // NEWS APIs (to be implemented)
  // ===================================

  async getAllNews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/news?${queryString}`);
  }

  async getNewsById(id) {
    return this.get(`/news/${id}`);
  }

  async getNewsBySlug(slug) {
    return this.get(`/news/slug/${slug}`);
  }

  // ===================================
  // EVENT APIs (to be implemented)
  // ===================================

  async getAllEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/events?${queryString}`);
  }

  async getEventById(id) {
    return this.get(`/events/${id}`);
  }

  // ===================================
  // ATTENDANCE APIs (to be implemented)
  // ===================================


  // ===================================
  // EVENT APIs
  // ===================================

  async getAllEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/events?${queryString}`);
  }

  async getEventById(id) {
    return this.get(`/events/${id}`);
  }

  // ===================================
  // PROGRAM APIs
  // ===================================
  async getAllPrograms() {
    return this.get('/programs');
  }

  async submitAttendance(eventId, memberId) {
    return this.post('/attendance', { eventId, memberId });
  }

  async getEventAttendance(eventId) {
}

  /**
   * Remove authorization token
   */
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  /**
   * Get authorization headers
   */
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Generic fetch wrapper
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.isFormData)
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, isFormData = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      isFormData
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // ===================================
  // AUTH APIs
  // ===================================

  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async changePassword(currentPassword, newPassword) {
    return this.put('/auth/change-password', { currentPassword, newPassword });
  }

  // ===================================
  // MEMBER APIs
  // ===================================

  async getAllMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/members?${queryString}`);
  }

  async getMemberById(id) {
    return this.get(`/members/${id}`);
  }

  async verifyMember(memberId) {
    return this.get(`/members/verify/${memberId}`);
  }

  async createApplication(formData) {
    return this.post('/members/apply', formData, true);
  }

  async getMemberStats() {
    return this.get(`/members/stats`);
  }

  async getAllApplications(status = 'PENDING') {
    return this.get(`/members/applications/all?status=${status}`);
  }

  async approveApplication(id) {
    return this.post(`/members/applications/${id}/approve`);
  }

  async rejectApplication(id, reason) {
    return this.post(`/members/applications/${id}/reject`, { reason });
  }

  async updateMember(id, data) {
    return this.put(`/members/${id}`, data);
  }

  async deleteMember(id) {
    return this.delete(`/members/${id}`);
  }

  // ===================================
  // NEWS APIs (to be implemented)
  // ===================================

  async getAllNews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/news?${queryString}`);
  }

  async getNewsById(id) {
    return this.get(`/news/${id}`);
  }

  async getNewsBySlug(slug) {
    return this.get(`/news/slug/${slug}`);
  }


  async submitAttendance(eventId, memberId) {
    return this.post('/attendance', { eventId, memberId });
  }

  async getEventAttendance(eventId) {
    return this.get(`/attendance/event/${eventId}`);
  }

  async getMemberAttendance(memberId) {
    return this.get(`/attendance/member/${memberId}`);
  }

  /**
   * Homepage Management
   */
  async getHomepageData() {
    return this.request('/homepage', { method: 'GET' });
  }

  async updateHomepageData(data, isFormData = false) {
    return this.request('/homepage', {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      isFormData
    });
  }
}

// Create a global API instance
const api = new API();

// Check authentication status
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Save user to localStorage
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Logout
function logout() {
  api.removeToken();
  localStorage.removeItem('user');
  const path = window.location.pathname;
  window.location.href = path.includes('/admin/') ? '../login.html' : 'login.html';
}

// Check if user has required role
function hasRole(requiredRoles) {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  return user.role === requiredRoles;
}

// Redirect if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    const path = window.location.pathname;
    window.location.href = path.includes('/admin/') ? '../login.html' : 'login.html';
    return false;
  }
  return true;
}

// Redirect if not admin
function requireAdmin() {
  if (!requireAuth()) return false;
  
  if (!hasRole(['SUPER_ADMIN', 'ADMIN'])) {
    alert('Anda tidak memiliki akses ke halaman ini.');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}
