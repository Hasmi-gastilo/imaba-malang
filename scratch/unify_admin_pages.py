import os

def create_page(filename, title, content_html, js_script, active_menu=""):
    sidebar_html = f"""
<aside class="sidebar">
  <div class="sidebar-header">
    <a href="index.html" class="sidebar-brand">IMABA<span>Admin</span></a>
  </div>
  <ul class="sidebar-menu">
    <li><a href="index.html" class="{'active' if active_menu == 'index' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard</a></li>
    <li><a href="anggota.html" class="{'active' if active_menu == 'anggota' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Anggota</a></li>
    <li><a href="pendaftaran.html" class="{'active' if active_menu == 'pendaftaran' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Pendaftaran</a></li>
    <li><a href="pengurus.html" class="{'active' if active_menu == 'pengurus' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Kepengurusan</a></li>
    <li><a href="berita.html" class="{'active' if active_menu == 'berita' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 32V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/><path d="M19 9l5 5v11a2 2 0 0 1-2 2h-3"/></svg> Berita</a></li>
    <li><a href="agenda.html" class="{'active' if active_menu == 'agenda' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Agenda</a></li>
    <li><a href="program.html" class="{'active' if active_menu == 'program' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Program</a></li>
    <li><a href="pengaturan.html" class="{'active' if active_menu == 'pengaturan' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Pengaturan</a></li>
  </ul>
  <div class="sidebar-footer">
    <button class="btn-logout" onclick="logout()">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Keluar
    </button>
  </div>
</aside>
"""
    return f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Admin IMABA</title>
  <link rel="stylesheet" href="../css/admin-common.css">
</head>
<body>

{sidebar_html}

<div class="main">
  <header class="topbar">
    <h1>{title}</h1>
    <div class="user-info">
      <div class="user-avatar" id="topAvatar">A</div>
      <span id="topName">Admin</span>
    </div>
  </header>

  <div class="content">
{content_html}
  </div>
</div>

<script src="../js/api.js"></script>
<script src="../js/admin-shared.js"></script>
{js_script}
<script>
  requireAdmin();
  const user = getCurrentUser();
  if(user) {{
    document.getElementById('topName').textContent = user.username;
    document.getElementById('topAvatar').textContent = user.username.charAt(0).toUpperCase();
  }}
</script>
</body>
</html>
"""

# ================================
# 1. Dashboard (index.html)
# ================================
index_content = """
    <!-- Statistics -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon blue">👥</div>
            <div class="stat-content">
                <h3 id="totalMembers">0</h3>
                <p>Total Anggota</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div class="stat-content">
                <h3 id="activeMembers">0</h3>
                <p>Anggota Aktif</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon orange">📝</div>
            <div class="stat-content">
                <h3 id="pendingApplications">0</h3>
                <p>Pendaftaran Pending</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon purple">👨‍🎓</div>
            <div class="stat-content">
                <h3 id="alumniCount">0</h3>
                <p>Alumni</p>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header"><h2 class="card-title">⚡ Aksi Cepat</h2></div>
        <div class="stats-grid" style="margin-bottom: 0;">
            <a href="./pendaftaran.html" class="btn btn-primary" style="padding: 1.5rem;">Verifikasi Pendaftaran</a>
            <a href="./anggota.html" class="btn btn-primary" style="padding: 1.5rem;">Kelola Anggota</a>
            <a href="./berita.html" class="btn btn-primary" style="padding: 1.5rem;">Buat Berita</a>
            <a href="./agenda.html" class="btn btn-primary" style="padding: 1.5rem;">Tambah Kegiatan</a>
        </div>
    </div>
"""
index_js = """
<script>
async function loadStatistics() {
    try {
        const response = await api.getMemberStats();
        if (response.success) {
            const stats = response.data;
            document.getElementById('totalMembers').textContent = stats.totalMembers || 0;
            document.getElementById('activeMembers').textContent = stats.activeMembers || 0;
            document.getElementById('pendingApplications').textContent = stats.pendingApplications || 0;
            document.getElementById('alumniCount').textContent = stats.alumniMembers || 0;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}
loadStatistics();
</script>
"""

# ================================
# Write to Files
# ================================
base_path = r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin'

with open(os.path.join(base_path, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(create_page('Dashboard', 'Dashboard', index_content, index_js, 'index'))

print("Generated index.html")
