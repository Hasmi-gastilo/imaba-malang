import os
import re

filepath = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin\pengaturan_beranda.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add file inputs to the form
new_inputs = """
        <div class="form-group">
          <label>Gambar Latar Utama (Hero Image)</label>
          <input type="file" id="heroImage" accept="image/*">
          <small>Kosongkan jika tidak ingin mengubah gambar.</small>
        </div>
        <div class="form-group">
          <label>Judul Seksi Tentang (About Title)</label>"""

content = content.replace('<div class="form-group">\n          <label>Judul Seksi Tentang (About Title)</label>', new_inputs)

new_inputs_2 = """
        <div class="form-group">
          <label>Gambar Seksi Tentang (About Image)</label>
          <input type="file" id="aboutImage" accept="image/*">
          <small>Kosongkan jika tidak ingin mengubah gambar.</small>
        </div>
        
        <div class="form-actions">"""

content = content.replace('\n        <div class="form-actions">', new_inputs_2)

# Change JS logic to use FormData
old_submit_js = """  document.getElementById('homepageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      heroTitle: document.getElementById('heroTitle').value,
      heroSubtitle: document.getElementById('heroSubtitle').value,
      aboutTitle: document.getElementById('aboutTitle').value,
      aboutText: document.getElementById('aboutText').value
    };

    try {
      const res = await api.updateHomepageData(data);"""

new_submit_js = """  document.getElementById('homepageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('heroTitle', document.getElementById('heroTitle').value);
    formData.append('heroSubtitle', document.getElementById('heroSubtitle').value);
    formData.append('aboutTitle', document.getElementById('aboutTitle').value);
    formData.append('aboutText', document.getElementById('aboutText').value);
    
    const heroImage = document.getElementById('heroImage').files[0];
    const aboutImage = document.getElementById('aboutImage').files[0];
    
    if (heroImage) formData.append('heroImage', heroImage);
    if (aboutImage) formData.append('aboutImage', aboutImage);

    try {
      const res = await api.updateHomepageData(formData, true);"""

content = content.replace(old_submit_js, new_submit_js)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("pengaturan_beranda.html updated!")
