import os
import glob
import re

admin_dir = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin"
html_files = glob.glob(os.path.join(admin_dir, "*.html"))

for filepath in html_files:
    basename = os.path.basename(filepath)
    menu_name = basename.replace('.html', '')
    
    # We will mark the active menu dynamically
    sidebar_html = f"""<aside class="sidebar">
  <div class="sidebar-header">
    <a href="index.html" class="sidebar-brand">IMABA<span>Admin</span></a>
  </div>
  <ul class="sidebar-menu">
    <li><a href="index.html" class="{'active' if menu_name == 'index' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard</a></li>
    <li><a href="anggota.html" class="{'active' if menu_name == 'anggota' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Anggota</a></li>
    <li><a href="pendaftaran.html" class="{'active' if menu_name == 'pendaftaran' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Pendaftaran</a></li>
    <li><a href="pengurus.html" class="{'active' if menu_name == 'pengurus' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Kepengurusan</a></li>
    <li><a href="berita.html" class="{'active' if menu_name == 'berita' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 32V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/><path d="M19 9l5 5v11a2 2 0 0 1-2 2h-3"/></svg> Berita</a></li>
    <li><a href="agenda.html" class="{'active' if menu_name == 'agenda' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Agenda</a></li>
    <li><a href="program.html" class="{'active' if menu_name == 'program' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Program</a></li>
    <li><a href="pengaturan.html" class="{'active' if menu_name == 'pengaturan' else ''}"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Pengaturan</a></li>
  </ul>
  <div class="sidebar-footer">
    <button class="btn-logout" onclick="logout()">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Keluar
    </button>
  </div>
</aside>"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace sidebar entirely
    content = re.sub(r'<aside class="sidebar".*?</aside>', sidebar_html, content, flags=re.DOTALL)
    
    # We also ensure there is a standard topbar script in the bottom so it fills in the name.
    # It might be easier to just ensure the script tags are updated, but the sidebar alone fixes 90% of the UI inconsistency.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Unified Sidebars.")
