import os
import glob
import re

admin_dir = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin"
html_files = glob.glob(os.path.join(admin_dir, "*.html"))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix CSS links
    content = re.sub(r'href="/css/', 'href="../css/', content)
    # Fix JS links
    content = re.sub(r'src="/js/', 'src="../js/', content)
    # Fix admin links
    content = re.sub(r'href="/admin/', 'href="./', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Fixed paths in {len(html_files)} files.")
