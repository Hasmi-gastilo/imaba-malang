import os
import re

filepath = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\index.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add IDs to the target elements
content = content.replace('<h1 class="hero-title">', '<h1 class="hero-title" id="heroTitle">')
content = content.replace('<p class="hero-subtitle">', '<p class="hero-subtitle" id="heroSubtitle">')
content = content.replace('<h2>Selamat Datang di IMABA?</h2>', '<h2 id="aboutTitle">Selamat Datang di IMABA?</h2>')

# The about text doesn't have a class or ID, it's just a <p> after the <h2>
about_text_pattern = re.compile(r'(<h2 id="aboutTitle">.*?</h2>\s*<p>)(.*?)(</p>)', re.DOTALL)
content = about_text_pattern.sub(r'\1<span id="aboutText">\2</span>\3', content)

js_injection = """
    <script>
        async function loadHomepage() {
            try {
                const res = await api.getHomepageData();
                if (res.success && res.data) {
                    const data = res.data;
                    const heroTitle = document.getElementById('heroTitle');
                    const heroSubtitle = document.getElementById('heroSubtitle');
                    const aboutTitle = document.getElementById('aboutTitle');
                    const aboutText = document.getElementById('aboutText');
                    
                    if (heroTitle) heroTitle.innerText = data.heroTitle;
                    if (heroSubtitle) heroSubtitle.innerText = data.heroSubtitle;
                    if (aboutTitle) aboutTitle.innerText = data.aboutTitle;
                    if (aboutText) aboutText.innerText = data.aboutText;
                }
            } catch (e) {
                console.error('Failed to load homepage data', e);
            }
        }
        
        // Only run if api is available
        if (typeof api !== 'undefined') {
            loadHomepage();
        }
    </script>
</body>
"""

content = content.replace('</body>', js_injection)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html patched with dynamic homepage data!")
