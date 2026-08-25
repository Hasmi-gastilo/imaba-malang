import os

with open(r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\pendaftaran.html', 'r', encoding='utf-8') as f:
    base_html = f.read()

# Replace main content of pendaftaran to become anggota
anggota_html = base_html.split('<div class="content">')[0] + """<div class="content">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Manajemen Anggota IMABA</h2>
      </div>

      <div class="filters">
        <input type="text" id="searchAnggota" placeholder="Cari nama atau NIM..." oninput="debounceSearch()">
        <select id="filterStatus" onchange="loadMembers()">
          <option value="">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="ALUMNI">Alumni</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table id="membersTable">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIM / Universitas</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="membersList">
            <tr><td colspan="4" style="text-align:center">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script src="../js/api.js"></script>
<script src="../js/admin-shared.js"></script>
<script>
  requireAdmin();
  
  // Highlight active sidebar menu
  document.querySelectorAll('.sidebar-menu a').forEach(a => {
    if (a.href.includes('anggota.html')) a.classList.add('active');
  });

  let searchTimeout;
  function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadMembers, 500);
  }

  async function loadMembers() {
    const search = document.getElementById('searchAnggota').value;
    const status = document.getElementById('filterStatus').value;
    const tbody = document.getElementById('membersList');
    
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Memuat data...</td></tr>';

    try {
      const res = await api.getAllMembers({ search, status });
      if (res.success && res.data.members.length > 0) {
        tbody.innerHTML = '';
        res.data.members.forEach(member => {
          const statusClass = member.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary';
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <div class="user-avatar" style="width:32px;height:32px;font-size:0.75rem">${member.fullName.charAt(0)}</div>
                <div>
                  <strong>${member.fullName}</strong><br>
                  <small style="color:#888">${member.email}</small>
                </div>
              </div>
            </td>
            <td>
              ${member.nim || '-'}<br>
              <small style="color:#888">${member.university || '-'}</small>
            </td>
            <td><span class="badge ${statusClass}">${member.status}</span></td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteMember('${member._id}')">Hapus</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Tidak ada data anggota ditemukan.</td></tr>';
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red">Gagal memuat: ${e.message}</td></tr>`;
    }
  }

  async function deleteMember(id) {
    if (!confirm('Yakin ingin menghapus anggota ini secara permanen?')) return;
    try {
      const res = await api.deleteMember(id);
      if (res.success) {
        alert('Anggota berhasil dihapus');
        loadMembers();
      }
    } catch (e) {
      alert('Gagal menghapus: ' + e.message);
    }
  }

  loadMembers();
</script>
</body>
</html>
"""

# Replace main content for pengaturan
pengaturan_html = base_html.split('<div class="content">')[0] + """<div class="content">
    <div class="card" style="max-width: 600px;">
      <div class="card-header">
        <h2 class="card-title">Pengaturan Akun</h2>
      </div>

      <form id="passwordForm">
        <div class="form-group">
          <label>Password Saat Ini</label>
          <input type="password" id="currentPassword" required>
        </div>
        <div class="form-group">
          <label>Password Baru</label>
          <input type="password" id="newPassword" required>
        </div>
        <div class="form-group">
          <label>Konfirmasi Password Baru</label>
          <input type="password" id="confirmPassword" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Ubah Password</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script src="../js/api.js"></script>
<script src="../js/admin-shared.js"></script>
<script>
  requireAdmin();
  
  // Highlight active sidebar menu
  document.querySelectorAll('.sidebar-menu a').forEach(a => {
    if (a.href.includes('pengaturan.html')) a.classList.add('active');
  });

  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      const res = await api.changePassword(currentPassword, newPassword);
      if (res.success) {
        alert('Password berhasil diubah!');
        e.target.reset();
      }
    } catch (e) {
      alert('Gagal mengubah password: ' + e.message);
    }
  });
</script>
</body>
</html>
"""

with open(r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\anggota.html', 'w', encoding='utf-8') as f:
    f.write(anggota_html)

with open(r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\pengaturan.html', 'w', encoding='utf-8') as f:
    f.write(pengaturan_html)

