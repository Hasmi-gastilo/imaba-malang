/**
 * Main JavaScript File
 * Handles common functionality across all pages
 */

// ===================================
// NAVIGATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initAnimations();
  initSearch();
  loadPageData();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Dropdown toggle on mobile
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });

  
  // Bottom Nav Dropdown Toggle
  const bottomDropdowns = document.querySelectorAll('.bottom-dropdown');
  bottomDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      e.preventDefault();
      // Close others
      bottomDropdowns.forEach(other => {
        if (other !== dropdown) other.classList.remove('active');
      });
      this.classList.toggle('active');
    });
  });

  // Close bottom dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.bottom-dropdown')) {
      bottomDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Update auth buttons based on login status
  updateAuthButtons();
}

/**
 * Update authentication buttons
 */
function updateAuthButtons() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  if (typeof isAuthenticated !== 'function' || typeof getCurrentUser !== 'function') return;

  try {
    const isLoggedIn = isAuthenticated();
  const user = getCurrentUser();

  // Find or create auth button container
  let authButtons = navMenu.querySelectorAll('.btn-daftar, .btn-login');
  
  if (isLoggedIn && user) {
    // Remove login/daftar buttons
    authButtons.forEach(btn => btn.remove());

    // Add user menu
    const userMenu = document.createElement('li');
    userMenu.className = 'dropdown';
    userMenu.innerHTML = `
      <a href="#" class="dropdown-toggle">
        ${user.username} <span class="arrow">▼</span>
      </a>
      <ul class="dropdown-menu">
        ${hasRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'KADERISASI_ADMIN']) ? 
          '<li><a href="/admin/index.html">Dashboard Admin</a></li>' : ''}
        <li><a href="/kta.html">KTA Digital</a></li>
        <li><a href="/profil-saya.html">Profil Saya</a></li>
        <li><a href="#" onclick="logout(); return false;">Logout</a></li>
      </ul>
    `;
    navMenu.appendChild(userMenu);
  }
  } catch(e) {
    console.log('Auth not ready yet');
  }
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}

/**
 * Initialize Search Functionality
 */
function initSearch() {
  const searchForm = document.getElementById('heroSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('heroSearchInput');
      const keyword = input ? input.value.trim() : '';
      
      if (keyword === '') {
        showToast('Silakan masukkan nama anggota yang dicari', 'error');
      }
  
  // Navbar Expanding Search Logic
  const navSearchBtn = document.getElementById('navSearchBtn');
  const navSearchContainer = document.getElementById('navSearchForm');
  const navSearchInput = document.getElementById('navSearchInput');
  
  if (navSearchBtn && navSearchContainer && navSearchInput) {
    navSearchBtn.addEventListener('click', function(e) {
      if (!navSearchContainer.classList.contains('active')) {
        // Expand search
        e.preventDefault();
        navSearchContainer.classList.add('active');
        navSearchInput.focus();
      } else {
        // If already active, check if input is empty
        if (navSearchInput.value.trim() === '') {
          e.preventDefault();
          navSearchContainer.classList.remove('active');
        }
        // If not empty, let it submit normally
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (navSearchContainer.classList.contains('active') && !navSearchContainer.contains(e.target)) {
        if (navSearchInput.value.trim() === '') {
          navSearchContainer.classList.remove('active');
        }
      }
    });
  } else {
        window.location.href = `pencarian.html?q=${encodeURIComponent(keyword)}`;
      }
    });
  }
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all section elements
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Animate statistics counter
  animateCounters();
}

/**
 * Animate number counters
 */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // Animation speed

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    let count = 0;
    const increment = target / speed;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.ceil(count) + '+';
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target + '+';
      }
    };

    // Start animation when element is visible
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCount();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

/**
 * Load page-specific data
 */
async function loadPageData() {
  const isHomePage = document.getElementById('newsGrid') !== null;
  const isBeritaPage = document.getElementById('newsGridAll') !== null;
  const isBeritaDetail = document.getElementById('newsDetailContent') !== null;

  const isProgramPage = document.getElementById('programGridAll') !== null;
  const isAgendaDetail = document.getElementById('eventDetailContent') !== null;

  if (isHomePage) {
    await loadHomePageData();
  }
  if (isBeritaPage) {
    await loadAllNewsPage();
  }
  if (isBeritaDetail) {
    await loadNewsDetailPage();
  }
  if (isProgramPage) {
    await loadAllProgramsPage();
  }
  const isSearchPage = document.getElementById('searchResultsContainer') !== null;
  if (isSearchPage) {
    await loadSearchPage();
  }
  if (isAgendaDetail) {
    await loadEventDetailPage();
  }
}

/**
 * Load homepage data
 */
async function loadHomePageData() {
  try {
    // Load statistics
    await loadStatistics();
    
    // Load latest news
    await loadLatestNews();
    
    // Load upcoming events
    await loadUpcomingEvents();
    
    // Load programs from API
    await loadPrograms();
    
    // Load footer contact info
    await loadContactInfo();
  } catch (error) {
    console.error('Error loading homepage data:', error);
  }
}

/**
 * Load programs for homepage
 */
async function loadPrograms() {
  const programsGrid = document.getElementById('programsGrid');
  if (!programsGrid) return;

  try {
    const response = await api.getAllPrograms();
    const programs = Array.isArray(response.data) ? response.data : (response.data?.programs || []);

    if (response.success && programs.length > 0) {
      programsGrid.innerHTML = '';
      programs.forEach(program => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
          <img src="${program.image || '/images/placeholder-news.jpg'}" alt="${program.name || program.title}" class="feature-image">
          <div class="feature-content">
            <h3>${program.name || program.title}</h3>
            <p>${(program.description || '').substring(0, 120)}${(program.description || '').length > 120 ? '...' : ''}</p>
            <a href="program.html" class="btn btn-outline-primary">Detail Program</a>
          </div>
        `;
        programsGrid.appendChild(card);
      });
    } else {
      programsGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--gray); grid-column: 1/-1;"><p>Belum ada program yang tersedia.</p></div>';
    }
  } catch (error) {
    console.error('Error loading programs:', error);
    programsGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--gray); grid-column: 1/-1;"><p>Gagal memuat program.</p></div>';
  }
}

/**
 * Load statistics
 */
async function loadStatistics() {
  try {
    const response = await api.getMemberStats();
    
    if (response.success) {
      const stats = response.data;
      
      // Update stat counters
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-number').setAttribute('data-target', stats.activeMembers || 0);
        statCards[1].querySelector('.stat-number').setAttribute('data-target', 20);
        statCards[2].querySelector('.stat-number').setAttribute('data-target', 50);
        statCards[3].querySelector('.stat-number').setAttribute('data-target', stats.alumniMembers || 0);
      }
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

/**
 * Load latest news
 */
async function loadLatestNews() {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  try {
    const response = await api.getAllNews({ limit: 3, page: 1 });
    
    // API mereturn array berita di response.data
    const newsItems = Array.isArray(response.data) ? response.data : (response.data?.news || []);
    
    if (response.success && newsItems.length > 0) {
      newsGrid.innerHTML = '';
      
      newsItems.slice(0, 3).forEach(news => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
      });
    } else {
      showEmptyState(newsGrid, 'Belum ada berita terbaru');
    }
  } catch (error) {
    console.error('Error loading news:', error);
    showEmptyState(newsGrid, 'Gagal memuat berita. Silakan refresh halaman.');
  }
}

/**
 * Load upcoming events
 */
async function loadUpcomingEvents() {
  const agendaList = document.getElementById('agendaList');
  if (!agendaList) return;

  try {
    const response = await api.getAllEvents({ limit: 3, page: 1, status: 'upcoming' });
    
    if (response.success && response.data.events) {
      agendaList.innerHTML = '';
      
      response.data.events.forEach(event => {
        const agendaCard = createAgendaCard(event);
        agendaList.appendChild(agendaCard);
      });
    } else {
      showEmptyState(agendaList, 'Belum ada agenda mendatang');
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showEmptyState(agendaList, 'Gagal memuat agenda. Silakan refresh halaman.');
  }
}

/**
 * Load contact information
 */
async function loadContactInfo() {
  // This would fetch from settings API
  // For now, using placeholder
  const phoneEl = document.getElementById('footerPhone');
  const emailEl = document.getElementById('footerEmail');
  
  if (phoneEl) phoneEl.textContent = '+62 xxx xxxx xxxx';
  if (emailEl) emailEl.textContent = 'info@imabamalang.org';
}

/**
 * Create news card element
 */
function createNewsCard(news) {
  const card = document.createElement('div');
  card.className = 'news-card';
  card.innerHTML = `
    <img src="${news.thumbnail || '/images/placeholder-news.jpg'}" alt="${news.title}">
    <div class="news-card-content">
      <span class="news-category">${news.category}</span>
      <h3>${news.title}</h3>
      <div class="news-meta">
        <span>${formatDate(news.publishedAt)}</span>
        <span>${news.views || 0} views</span>
      </div>
      <p class="news-excerpt">${news.excerpt}</p>
    </div>
  `;
  
  card.addEventListener('click', () => {
    window.location.href = `berita-detail.html?slug=${news.slug}`;
  });
  
  return card;
}

/**
 * Create agenda card element
 */
function createAgendaCard(event) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('id-ID', { month: 'short' });
  
  const card = document.createElement('div');
  card.className = 'agenda-card';
  card.innerHTML = `
    <div class="agenda-date">
      <div class="agenda-date-day">${day}</div>
      <div class="agenda-date-month">${month}</div>
    </div>
    <div class="agenda-content">
      <h3>${event.title}</h3>
      <div class="agenda-meta">
        <span>📍 ${event.location}</span>
        <span>⏰ ${event.startTime}</span>
        <span class="agenda-status ${event.status.toLowerCase().replace(' ', '-')}">${event.status}</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    window.location.href = `agenda-detail.html?id=${event._id}`;
  });
  
  return card;
}

/**
 * Show empty state
 */
function showEmptyState(container, message) {
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: var(--gray);">
      <p>${message}</p>
    </div>
  `;
}

/**
 * Format date to Indonesian format
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format datetime to Indonesian format
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Show loading state
 */
function showLoading(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Confirm dialog
 */
function confirmDialog(message) {
  return confirm(message);
}

/**
 * Load all programs page data
 */
async function loadAllProgramsPage() {
  const programGridAll = document.getElementById('programGridAll');
  if (!programGridAll) return;

  try {
    const response = await api.getAllPrograms();
    
    const programItems = Array.isArray(response.data) ? response.data : (response.data?.programs || []);
    
    if (response.success && programItems.length > 0) {
      programGridAll.innerHTML = '';
      
      programItems.forEach(program => {
        const programCard = createProgramCard(program);
        programGridAll.appendChild(programCard);
      });
    } else {
      showEmptyState(programGridAll, 'Belum ada program yang tersedia');
    }
  } catch (error) {
    console.error('Error loading programs:', error);
    showEmptyState(programGridAll, 'Gagal memuat program. Silakan refresh halaman.');
  }
}

/**
 * Create program card element
 */
function createProgramCard(program) {
  const card = document.createElement('div');
  card.className = 'news-card'; // Using news-card style for consistency
  card.innerHTML = `
    <img src="${program.image || '/images/placeholder-news.jpg'}" alt="${program.name}">
    <div class="news-card-content">
      <span class="news-category">${program.status}</span>
      <h3>${program.name}</h3>
      <div class="news-meta">
        <span>PIC: ${program.pic || '-'}</span>
        <span>${program.progress || 0}% Selesai</span>
      </div>
      <p class="news-excerpt" style="margin-top: 10px;">${(program.description || 'Deskripsi program tidak tersedia.').substring(0, 100)}...</p>
    </div>
  `;
  return card;
}

/**
 * Load event detail page data
 */
async function loadEventDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) {
    window.location.href = 'agenda.html';
    return;
  }
  
  const contentEl = document.getElementById('eventDetailContent');
  const titleEl = document.getElementById('eventDetailTitle');
  const metaEl = document.getElementById('eventDetailMeta');
  const imageEl = document.getElementById('eventDetailImage');
  
  if (!contentEl) return;
  
  try {
    const response = await api.getEventById(id);
    
    if (response.success && response.data) {
      const event = response.data;
      
      if (titleEl) titleEl.textContent = event.title;
      if (imageEl) imageEl.src = event.image || '/images/placeholder-news.jpg';
      if (metaEl) {
        metaEl.innerHTML = `
          <span>📍 ${event.location || '-'}</span> &bull; 
          <span>⏰ ${event.startTime || '-'} - ${event.endTime || '-'}</span> &bull; 
          <span>${event.status}</span>
        `;
      }
      
      // Render HTML content safely
      contentEl.innerHTML = (event.description || '').replace(/\n/g, '<br>');
      document.title = `${event.title} - DPW IMABA Malang`;
    } else {
      contentEl.innerHTML = '<p>Agenda tidak ditemukan.</p>';
    }
  } catch (error) {
    console.error('Error loading event detail:', error);
    if (contentEl) contentEl.innerHTML = '<p>Gagal memuat agenda.</p>';
  }
}

/**
 * Load all news page data
 */
async function loadAllNewsPage() {
  const newsGridAll = document.getElementById('newsGridAll');
  if (!newsGridAll) return;

  try {
    const response = await api.getAllNews();
    
    const newsItems = Array.isArray(response.data) ? response.data : (response.data?.news || []);
    
    if (response.success && newsItems.length > 0) {
      newsGridAll.innerHTML = '';
      
      newsItems.forEach(news => {
        const newsCard = createNewsCard(news);
        newsGridAll.appendChild(newsCard);
      });
    } else {
      showEmptyState(newsGridAll, 'Belum ada berita yang tersedia');
    }
  } catch (error) {
    console.error('Error loading all news:', error);
    showEmptyState(newsGridAll, 'Gagal memuat berita. Silakan refresh halaman.');
  }
}

/**
 * Load news detail page data
 */
async function loadNewsDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  
  if (!slug) {
    window.location.href = 'berita.html';
    return;
  }
  
  const contentEl = document.getElementById('newsDetailContent');
  const titleEl = document.getElementById('newsDetailTitle');
  const metaEl = document.getElementById('newsDetailMeta');
  const imageEl = document.getElementById('newsDetailImage');
  
  if (!contentEl) return;
  
  try {
    const response = await api.getNewsBySlug(slug);
    
    if (response.success && response.data) {
      const news = response.data;
      
      if (titleEl) titleEl.textContent = news.title;
      if (imageEl) imageEl.src = news.thumbnail || news.image || '/images/placeholder-news.jpg';
      if (metaEl) {
        metaEl.innerHTML = `
          <span>${news.category}</span> &bull; 
          <span>${formatDate(news.publishedAt || news.createdAt)}</span> &bull; 
          <span>${news.viewCount || 0} views</span>
        `;
      }
      
      // Render HTML content safely
      contentEl.innerHTML = news.content.replace(/\n/g, '<br>');
      document.title = `${news.title} - DPW IMABA Malang`;
    } else {
      contentEl.innerHTML = '<p>Berita tidak ditemukan.</p>';
    }
  } catch (error) {
    console.error('Error loading news detail:', error);
    if (contentEl) contentEl.innerHTML = '<p>Gagal memuat berita.</p>';
  }
}

/**
 * Truncate text
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--light-gray);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);


/**
 * Load Search Page Data
 */
async function loadSearchPage() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  
  const searchInput = document.getElementById('searchPageInput');
  const searchForm = document.getElementById('searchPageForm');
  const searchStatus = document.getElementById('searchStatus');
  const resultsContainer = document.getElementById('searchResultsContainer');
  
  const sectionAnggota = document.getElementById('sectionAnggota');
  const gridAnggota = document.getElementById('gridAnggota');
  const sectionBerita = document.getElementById('sectionBerita');
  const gridBerita = document.getElementById('gridBerita');
  const sectionKegiatan = document.getElementById('sectionKegiatan');
  const gridKegiatan = document.getElementById('gridKegiatan');
  const sectionProgram = document.getElementById('sectionProgram');
  const gridProgram = document.getElementById('gridProgram');
  
  if (searchInput) searchInput.value = q;
  
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = `pencarian.html?q=${encodeURIComponent(searchInput.value.trim())}`;
    });
  }
  
  if (!q) {
    if (searchStatus) searchStatus.textContent = 'Silakan masukkan kata kunci pencarian.';
    return;
  }
  
  if (searchStatus) searchStatus.textContent = `Mencari "${q}"...`;
  
  try {
    const keyword = q.toLowerCase();
    
    // Fetch all resources concurrently
    const [membersRes, newsRes, eventsRes, programsRes] = await Promise.all([
      fetch(`/api/members?search=${encodeURIComponent(q)}&status=ACTIVE`).catch(() => null),
      fetch('/api/news').catch(() => null),
      fetch('/api/events').catch(() => null),
      fetch('/api/programs').catch(() => null)
    ]);
    
    let membersData = { data: { members: [] } };
    let newsData = { data: [] };
    let eventsData = { data: { events: [] } };
    let programsData = { data: [] };
    
    if (membersRes && membersRes.ok) membersData = await membersRes.json();
    if (newsRes && newsRes.ok) newsData = await newsRes.json();
    if (eventsRes && eventsRes.ok) eventsData = await eventsRes.json();
    if (programsRes && programsRes.ok) programsData = await programsRes.json();
    
    // Process Members
    const members = membersData.data?.members || [];
    if (members.length > 0) {
      gridAnggota.innerHTML = '';
      members.forEach(m => {
        const card = document.createElement('div');
        card.className = 'news-card'; 
        card.style.textAlign = 'center';
        card.style.padding = '20px';
        card.innerHTML = `
          <img src="${m.photo || '/images/placeholder-news.jpg'}" alt="${m.fullName}" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 15px; object-fit: cover; display: block;">
          <h3 style="margin-bottom: 5px;">${m.fullName}</h3>
          <p style="color: var(--primary); font-weight: bold; margin-bottom: 15px;">${m.university || '-'}</p>
          <div style="text-align: left; background: var(--off-white); padding: 12px; border-radius: 8px;">
            <p style="margin-bottom: 5px; font-size: 0.9rem;"><strong style="color: var(--dark-gray);">Angkatan:</strong> ${m.batch || '-'}</p>
            <p style="margin-bottom: 0; font-size: 0.9rem;"><strong style="color: var(--dark-gray);">Alamat:</strong> ${m.address || '-'}</p>
          </div>
        `;
        gridAnggota.appendChild(card);
      });
      sectionAnggota.style.display = 'block';
    }
    
    // Process News
    const allNews = Array.isArray(newsData.data) ? newsData.data : [];
    const filteredNews = allNews.filter(n => (n.title || '').toLowerCase().includes(keyword) || (n.excerpt || '').toLowerCase().includes(keyword) || (n.content || '').toLowerCase().includes(keyword));
    if (filteredNews.length > 0) {
      gridBerita.innerHTML = '';
      filteredNews.forEach(n => {
        const dateStr = n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-';
        const card = document.createElement('div');
        card.className = 'news-card fade-in';
        card.innerHTML = `
          <img src="${n.image || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80'}" alt="${n.title}" class="news-img" style="height: 200px; object-fit: cover;">
          <div class="news-content">
            <span class="news-category">${n.category || 'Berita'}</span>
            <h3>${n.title}</h3>
            <p>${(n.summary || n.content || '').substring(0, 100)}...</p>
            <div class="news-meta">
              <span class="news-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${dateStr}</span>
            </div>
          </div>
        `;
        card.addEventListener('click', () => window.location.href = `berita-detail.html?id=${n._id}`);
        card.style.cursor = 'pointer';
        gridBerita.appendChild(card);
      });
      sectionBerita.style.display = 'block';
    }
    
    // Process Events
    const allEvents = eventsData.data?.events || [];
    const filteredEvents = allEvents.filter(e => (e.title || '').toLowerCase().includes(keyword) || (e.description || '').toLowerCase().includes(keyword));
    if (filteredEvents.length > 0) {
      gridKegiatan.innerHTML = '';
      filteredEvents.forEach(e => {
        const dateObj = new Date(e.date);
        const dayStr = dateObj.toLocaleDateString('id-ID', {day: '2-digit'});
        const monthStr = dateObj.toLocaleDateString('id-ID', {month: 'short'});
        const card = document.createElement('div');
        card.className = 'agenda-card fade-in';
        card.innerHTML = `
          <div class="agenda-date">
              <span class="agenda-date-day">${dayStr}</span>
              <span class="agenda-date-month">${monthStr}</span>
          </div>
          <div class="agenda-content">
              <h3>${e.title}</h3>
              <div class="agenda-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${e.time || '-'}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${e.location || '-'}</span>
              </div>
          </div>
        `;
        card.addEventListener('click', () => window.location.href = `agenda-detail.html?id=${e._id}`);
        card.style.cursor = 'pointer';
        gridKegiatan.appendChild(card);
      });
      sectionKegiatan.style.display = 'block';
    }
    
    // Process Programs
    const allPrograms = Array.isArray(programsData.data) ? programsData.data : [];
    const filteredPrograms = allPrograms.filter(p => (p.name || p.title || '').toLowerCase().includes(keyword) || (p.description || '').toLowerCase().includes(keyword));
    if (filteredPrograms.length > 0) {
      gridProgram.innerHTML = '';
      filteredPrograms.forEach(p => {
        const card = document.createElement('div');
        card.className = 'program-card fade-in';
        card.innerHTML = `
          <div class="program-icon">
              <img src="${p.icon || '/images/placeholder-news.jpg'}" alt="Program Icon" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">
          </div>
          <h3 class="program-title">${p.title}</h3>
          <p class="program-desc">${p.description}</p>
        `;
        gridProgram.appendChild(card);
      });
      sectionProgram.style.display = 'block';
    }
    
    const totalFound = members.length + filteredNews.length + filteredEvents.length + filteredPrograms.length;
    
    if (totalFound > 0) {
      resultsContainer.style.display = 'block';
      searchStatus.textContent = `Ditemukan ${totalFound} hasil pencarian.`;
    } else {
      searchStatus.textContent = `Tidak ada hasil ditemukan untuk "${q}".`;
    }
    
  } catch (e) {
    console.error(e);
    if (searchStatus) searchStatus.textContent = 'Terjadi kesalahan saat mencari data.';
  }
}
