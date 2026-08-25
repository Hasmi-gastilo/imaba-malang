const fs = require('fs');

// 1. Create pencarian.html
let html = fs.readFileSync('public/program.html', 'utf8');
html = html.replace(/<title>.*<\/title>/, '<title>Pencarian Anggota - DPW IMABA MALANG</title>');
html = html.replace(/Program Unggulan/g, 'Pencarian Anggota');
html = html.replace(/Program-program strategis untuk pengembangan anggota dan masyarakat./g, 'Hasil pencarian anggota IMABA Malang.');

// Replace the content section
const contentRegex = /<section class="section">([\s\S]*?)<\/section>/;
const newContent = `
    <section class="section">
        <div class="container">
            <div style="margin-bottom: 30px;">
                <form id="searchPageForm" style="display: flex; gap: 10px; max-width: 600px; margin: 0 auto;">
                    <input type="text" id="searchPageInput" class="form-control search-input" placeholder="Ketik nama anggota..." style="flex: 1; padding: 10px; border-radius: var(--radius-sm); border: 1px solid #ccc;">
                    <button type="submit" class="btn btn-primary">Cari</button>
                </form>
                <p id="searchStatus" style="text-align: center; margin-top: 15px; color: var(--gray);"></p>
            </div>
            <div class="programs-grid" id="searchResultsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
            </div>
        </div>
    </section>
`;
html = html.replace(contentRegex, newContent);
fs.writeFileSync('public/pencarian.html', html);

// 2. Update main.js
let mainJs = fs.readFileSync('public/js/main.js', 'utf8');
if (!mainJs.includes('loadSearchPage')) {
  mainJs = mainJs.replace('if (isAgendaDetail) {', 'const isSearchPage = document.getElementById(\'searchResultsGrid\') !== null;\n  if (isSearchPage) {\n    await loadSearchPage();\n  }\n  if (isAgendaDetail) {');
  
  const searchJs = `
/**
 * Load Search Page Data
 */
async function loadSearchPage() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  
  const searchInput = document.getElementById('searchPageInput');
  const searchForm = document.getElementById('searchPageForm');
  const searchStatus = document.getElementById('searchStatus');
  const resultsGrid = document.getElementById('searchResultsGrid');
  
  if (searchInput) searchInput.value = q;
  
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = \`pencarian.html?q=\${encodeURIComponent(searchInput.value.trim())}\`;
    });
  }
  
  if (!q) {
    if (searchStatus) searchStatus.textContent = 'Silakan masukkan nama anggota yang ingin dicari.';
    return;
  }
  
  if (searchStatus) searchStatus.textContent = \`Mencari "\${q}"...\`;
  if (resultsGrid) resultsGrid.innerHTML = '<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text" style="margin-top: 15px;"></div></div>';
  
  try {
    const res = await fetch(\`/api/members?search=\${encodeURIComponent(q)}&status=ACTIVE\`);
    const data = await res.json();
    
    if (data.success && data.data.members.length > 0) {
      if (searchStatus) searchStatus.textContent = \`Ditemukan \${data.data.members.length} anggota.\`;
      if (resultsGrid) {
        resultsGrid.innerHTML = '';
        data.data.members.forEach(m => {
          const card = document.createElement('div');
          card.className = 'news-card'; // Using news-card base style
          card.style.textAlign = 'center';
          card.style.padding = '20px';
          
          card.innerHTML = \`
            <img src="\${m.photo || '/images/placeholder-news.jpg'}" alt="\${m.fullName}" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 15px; object-fit: cover; display: block;">
            <h3 style="margin-bottom: 5px;">\${m.fullName}</h3>
            <p style="color: var(--primary); font-weight: bold; margin-bottom: 15px;">\${m.university || '-'}</p>
            <div style="text-align: left; background: var(--off-white); padding: 12px; border-radius: 8px;">
              <p style="margin-bottom: 5px; font-size: 0.9rem;"><strong style="color: var(--dark-gray);">Angkatan:</strong> \${m.batch || '-'}</p>
              <p style="margin-bottom: 0; font-size: 0.9rem;"><strong style="color: var(--dark-gray);">Alamat:</strong> \${m.address || '-'}</p>
            </div>
          \`;
          
          resultsGrid.appendChild(card);
        });
      }
    } else {
      if (searchStatus) searchStatus.textContent = \`Tidak ada anggota ditemukan dengan nama "\${q}".\`;
      if (resultsGrid) resultsGrid.innerHTML = '';
    }
  } catch (e) {
    if (searchStatus) searchStatus.textContent = 'Gagal melakukan pencarian. Pastikan server berjalan.';
    if (resultsGrid) resultsGrid.innerHTML = '';
  }
}
`;
  mainJs = mainJs + '\n' + searchJs;
  fs.writeFileSync('public/js/main.js', mainJs);
}
console.log('Created pencarian.html and updated main.js');
