const fs = require('fs');
const path = require('path');

// Create dist folder
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

// Copy all static files to dist
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true});
  const entries = fs.readdirSync(src, {withFileTypes: true});
  for (const entry of entries) {
    if (['dist','.git','node_modules'].includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}
copyDir('.', 'dist');

// Read data
function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(path.join('_data', file + '.json'), 'utf8')); }
  catch(e) { return {}; }
}

function imgPath(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : '/' + src;
}

const hero = readJSON('hero');
const pitchbreak = readJSON('pitchbreak');
const spectral = readJSON('spectral');
const hybrid = readJSON('hybrid');
const nftopia = readJSON('nftopia');
const breakery = readJSON('breakery');
const community = readJSON('community');

let html = fs.readFileSync('index.html', 'utf8');

// Helper: set text content of element with id
function bakeText(id, val) {
  if (!val) return;
  html = html.replace(new RegExp(`(id="${id}"[^>]*>)[^<]*`), `$1${val}`);
}

// Helper: set image src
function bakeSrc(id, src) {
  if (!src) return;
  const s = imgPath(src);
  html = html.replace(new RegExp(`(id="${id}"[^>]*src=")[^"]*`), `$1${s}`);
}

// Helper: inject image into container div
function bakeImg(id, src) {
  if (!src) return;
  const s = imgPath(src);
  html = html.replace(
    new RegExp(`(<div[^>]*id="${id}"[^>]*>)([^<]*)`),
    `$1<img src="${s}" style="width:100%;height:100%;object-fit:cover;display:block;">`
  );
}

// HERO
if (hero.badge) bakeText('hero-badge', hero.badge);
if (hero.tagline) bakeText('hero-tagline', hero.tagline);
if (hero.site_logo) {
  const s = imgPath(hero.site_logo);
  html = html.replace('id="nav-logo-img" src=""', `id="nav-logo-img" src="${s}" style="display:block;"`);
  html = html.replace('id="hero-logo" src=""', `id="hero-logo" src="${s}" style="display:block;"`);
  html = html.replace('id="footer-logo" src=""', `id="footer-logo" src="${s}" style="display:block;"`);
  html = html.replace('id="nav-logo-fallback"', 'id="nav-logo-fallback" style="display:none;"');
  html = html.replace('id="hero-logo-fallback"', 'id="hero-logo-fallback" style="display:none;"');
}
if (hero.hero_image) {
  const s = imgPath(hero.hero_image);
  html = html.replace(
    '<div id="hero-img-wrap">',
    `<div id="hero-img-wrap"><img src="${s}" style="width:100%;height:100%;object-fit:cover;display:block;">`
  );
}

// SHOWS
if (pitchbreak.time) bakeText('pb-time', pitchbreak.time);
if (pitchbreak.description) bakeText('pb-desc', pitchbreak.description);
if (pitchbreak.image) bakeImg('pb-img', pitchbreak.image);

if (spectral.time) bakeText('ss-time', spectral.time);
if (spectral.description) bakeText('ss-desc', spectral.description);
if (spectral.image) bakeImg('ss-img', spectral.image);

// NFT
if (hybrid.description) bakeText('hybrid-desc', hybrid.description);
if (hybrid.image) bakeImg('hybrid-img', hybrid.image);

if (nftopia.description) bakeText('nftopia-desc', nftopia.description);
if (nftopia.image) bakeImg('nftopia-img', nftopia.image);

// BREAKERY
if (breakery.tagline) bakeText('breakery-tagline', breakery.tagline);
if (breakery.apps && breakery.apps.length) {
  const apps = breakery.apps.map(a => `
    <div class="appcard">
      <div class="appcard-icon">${a.image ? `<img src="${imgPath(a.image)}">` : '🎮'}</div>
      <div class="appcard-name">${a.name}</div>
      <div class="appcard-desc">${a.description}</div>
      <span class="appcard-status">${a.status}</span>
    </div>`).join('') + `
    <div class="appcard" style="opacity:.4;border-style:dashed;">
      <div class="appcard-icon">+</div>
      <div class="appcard-name">More Soon</div>
      <div class="appcard-desc">15+ mini games launching</div>
      <span class="appcard-status">Coming</span>
    </div>`;
  html = html.replace(/<div class="app-strip" id="app-strip">[\s\S]*?<\/div>\s*<div class="breakery-foot">/,
    `<div class="app-strip" id="app-strip">${apps}</div>
  <div class="breakery-foot">`);
}

// COMMUNITY
if (community.title) bakeText('community-title', community.title);
if (community.description) bakeText('community-desc', community.description);
if (community.earn_items && community.earn_items.length) {
  const items = community.earn_items.map(i =>
    `<div class="earn-item"><div class="earn-dot"></div><div class="earn-text">${i}</div></div>`
  ).join('\n');
  html = html.replace(/<div class="earn-list" id="earn-items-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- STORY/,
    `<div class="earn-list" id="earn-items-list">${items}</div>
    </div>
  </div>
</section>
<!-- STORY`);
}

fs.writeFileSync(path.join('dist', 'index.html'), html);
console.log('Build complete! dist/index.html written.');
