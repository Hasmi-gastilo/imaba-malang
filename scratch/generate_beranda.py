import os

# We read the template from pengaturan.html
template_path = r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\pengaturan.html'
with open(template_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the active class in sidebar: from pengaturan to nothing, and we can just leave it as is or fix it.
# Actually let's just do a clean replacement of the content div.
content_start = html.find('<div class="content">')
content_end = html.find('</div>\n</div>\n\n<script src="../js/api.js">')

if content_start != -1 and content_end != -1:
    new_content = """<div class="content">
    <div class="card" style="max-width: 800px;">
      <div class="card-header">
        <h2 class="card-title">Pengaturan Beranda (Homepage)</h2>
      </div>

      <form id="homepageForm">
        <div class="form-group">
          <label>Judul Utama (Hero Title)</label>
          <input type="text" id="heroTitle" required>
        </div>
        <div class="form-group">
          <label>Sub-judul Utama (Hero Subtitle)</label>
          <textarea id="heroSubtitle" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>Judul Seksi Tentang (About Title)</label>
          <input type="text" id="aboutTitle" required>
        </div>
        <div class="form-group">
          <label>Teks Seksi Tentang (About Text)</label>
          <textarea id="aboutText" rows="6" required></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="loadData()">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>"""

    html = html[:content_start] + new_content + html[content_end:]

# Replace title
html = html.replace('<title>Pengaturan - Admin IMABA</title>', '<title>Pengaturan Beranda - Admin IMABA</title>')
html = html.replace('<h1>Pengaturan</h1>', '<h1>Pengaturan Beranda</h1>')

# Add JS logic
js_logic = """
<script>
  requireAdmin();
  const user = getCurrentUser();
  if(user) {
    document.getElementById('topName').textContent = user.username;
    document.getElementById('topAvatar').textContent = user.username.charAt(0).toUpperCase();
  }

  // Load data
  async function loadData() {
    try {
      const res = await api.getHomepageData();
      if (res.success && res.data) {
        document.getElementById('heroTitle').value = res.data.heroTitle || '';
        document.getElementById('heroSubtitle').value = res.data.heroSubtitle || '';
        document.getElementById('aboutTitle').value = res.data.aboutTitle || '';
        document.getElementById('aboutText').value = res.data.aboutText || '';
      }
    } catch (e) {
      console.error(e);
      alert('Gagal memuat pengaturan beranda');
    }
  }

  // Submit data
  document.getElementById('homepageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      heroTitle: document.getElementById('heroTitle').value,
      heroSubtitle: document.getElementById('heroSubtitle').value,
      aboutTitle: document.getElementById('aboutTitle').value,
      aboutText: document.getElementById('aboutText').value
    };

    try {
      const res = await api.updateHomepageData(data);
      if (res.success) {
        alert('Berhasil menyimpan pengaturan beranda!');
      }
    } catch (e) {
      alert('Gagal menyimpan: ' + e.message);
    }
  });

  loadData();
</script>
</body>
"""

html = html.replace('</script>\n</body>', js_logic)

with open(r'd:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\pengaturan_beranda.html', 'w', encoding='utf-8') as f:
    f.write(html)
