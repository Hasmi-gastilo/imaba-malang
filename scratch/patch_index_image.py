import os

filepath = r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\public\index.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add ID to welcome image
content = content.replace('class="welcome-image"', 'id="aboutImage" class="welcome-image"')

# Add image injection logic
old_js = """                    if (aboutTitle) aboutTitle.innerText = data.aboutTitle;
                    if (aboutText) aboutText.innerText = data.aboutText;"""

new_js = """                    if (aboutTitle) aboutTitle.innerText = data.aboutTitle;
                    if (aboutText) aboutText.innerText = data.aboutText;
                    
                    const aboutImage = document.getElementById('aboutImage');
                    if (aboutImage && data.aboutImage) {
                        aboutImage.src = data.aboutImage;
                    }
                    if (data.heroImage) {
                        const heroBg = document.querySelector('.hero-background');
                        if (heroBg) heroBg.style.backgroundImage = `url(${data.heroImage})`;
                    }"""

content = content.replace(old_js, new_js)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html patched with dynamic image data!")
