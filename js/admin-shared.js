/**
 * Admin Shared JavaScript
 * Common functions for all admin pages
 */

// Check admin auth on page load
document.addEventListener('DOMContentLoaded', function() {
  // Fix paths for admin pages (they're in /admin/ subdirectory)
  fixAdminPaths();

  // Load user info
  function loadUserInfo() {
    if (typeof window.getCurrentUser !== 'function') {
      setTimeout(loadUserInfo, 50);
      return;
    }
    const user = window.getCurrentUser();
    const userNameEl = document.getElementById('adminUserName');
    const userRoleEl = document.getElementById('adminUserRole');
    if (userNameEl && user) userNameEl.textContent = user.email || 'Admin';
    if (userRoleEl && user) userRoleEl.textContent = user.role || '';
  }
  loadUserInfo();

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Yakin ingin logout?')) {
        logout();
      }
    });
  }
});

function fixAdminPaths() {
  // When served via Node.js server, absolute paths work fine.
  // This just sets active menu item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace('../admin/', ''))) {
      link.classList.add('active');
    }
  });
}

// Show toast notification
function showAdminToast(message, type = 'success') {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 1rem 1.5rem; border-radius: 0.75rem;
    background: ${type === 'success' ? '#2d5f3f' : type === 'error' ? '#dc3545' : '#17a2b8'};
    color: white; font-weight: 600; box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    max-width: 350px; font-size: 0.95rem;
  `;
  toast.textContent = message;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// Generic API calls that include auth token
async function adminFetch(url, options = {}) {
  if (url.startsWith('/api/')) {
    url = url;
  }
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
  return data;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format date for input
function toInputDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

// Confirm delete
function confirmDelete(name) {
  return confirm(`Yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`);
}

// Show/hide modal
function showModal(id) { document.getElementById(id).style.display = 'flex'; }
function hideModal(id) { document.getElementById(id).style.display = 'none'; }

// Truncate text
function truncate(text, len = 80) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

// Upload image to server
async function uploadImageToServer(file) {
  try {
    const response = await window.api.uploadImage(file);
    if (response.success) {
      return response.url;
    } else {
      throw new Error('Gagal mengupload gambar');
    }
  } catch (error) {
    throw new Error(error.message || 'Gagal mengupload gambar');
  }
}
