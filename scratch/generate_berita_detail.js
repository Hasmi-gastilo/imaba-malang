const fs = require('fs');
const html = fs.readFileSync('public/berita.html', 'utf8');
const headerEnd = html.indexOf('<section class="page-header"');
const footerStart = html.indexOf('<!-- Footer -->');
const topPart = html.substring(0, headerEnd);
const bottomPart = html.substring(footerStart);

const detailContent = `
    <!-- Page Content -->
    <section class="section" style="padding-top: 120px; background: white;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
            <div id="newsDetailMeta" style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem;">
                <div class="skeleton skeleton-text short"></div>
            </div>
            <h1 id="newsDetailTitle" style="color: var(--primary-dark); font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.3;">
                <div class="skeleton skeleton-text"></div>
            </h1>
            <img id="newsDetailImage" src="/images/placeholder-news.jpg" alt="Berita" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <div id="newsDetailContent" style="color: var(--dark-gray); line-height: 1.8; font-size: 1.1rem;">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            
            <div style="margin-top: 50px; text-align: center; border-top: 1px solid var(--light-gray); padding-top: 30px;">
                <a href="berita.html" class="btn btn-outline-primary">Kembali ke Daftar Berita</a>
            </div>
        </div>
    </section>
`;

fs.writeFileSync('public/berita-detail.html', topPart + detailContent + bottomPart);
console.log('Done!');
