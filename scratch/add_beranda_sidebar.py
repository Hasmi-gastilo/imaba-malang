import os
import glob
import re

admin_dir = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin"
html_files = glob.glob(os.path.join(admin_dir, "*.html"))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    new_link = """<li><a href="pengaturan_beranda.html" class=""><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Beranda</a></li>"""

    # If it's already there, skip
    if "pengaturan_beranda.html" not in html:
        # Insert before pengaturan.html
        html = html.replace('<li><a href="pengaturan.html"', new_link + '\n    <li><a href="pengaturan.html"')

    # Mark active if the page itself is pengaturan_beranda.html
    if 'pengaturan_beranda.html' in filepath:
        html = html.replace('href="pengaturan_beranda.html" class=""', 'href="pengaturan_beranda.html" class="active"')
        # Ensure others are inactive
        html = html.replace('href="pengaturan.html" class="active"', 'href="pengaturan.html" class=""')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print("Added Beranda to sidebar.")
