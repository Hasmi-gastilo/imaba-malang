import os
import glob
import re

admin_dir = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\admin"
html_files = glob.glob(os.path.join(admin_dir, "*.html"))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file already has the link
    if '<link rel="stylesheet" href="../css/admin-common.css">' not in content:
        # Insert the link before </head>
        content = content.replace('</head>', '  <link rel="stylesheet" href="../css/admin-common.css">\n</head>')
    
    # Remove the <style>...</style> block
    content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Unified CSS in {len(html_files)} files.")
