const fs = require('fs');
const path = require('path');

// Create dist folder
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

// Copy all static files to dist
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true});
  const entries = fs.readdirSync(src, {withFileTypes: true});
  for (const entry of entries) {
    if (entry.name === 'dist' || entry.name === '.git' || entry.name === 'node_modules') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir('.', 'dist');

// Read data files
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join('_data', file + '.json'), 'utf8'));
  } catch(e) { return {}; }
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

// Read and modify index.html
let html = fs.readFileSync('index.html', 'utf8');

// Remove CMS data loader entirely - replace with empty comment
html = html.replace(/\/\/ ── CMS DATA LOADER ─+[\s\S]*?loadCMSData\(\);[\s\S]*?\/\/ ─+/g, '');

// Bake in hero data
if (hero.badge) html = html.replace(/(<span id="hero-badge">)[^<]*/g, '$1' + hero.badge);
if (hero.tagline) html = html.replace(/(<p class="hero-sub" id="hero-tagline">)[^<]*/g, '$1' + hero.tagline);
if (hero.hero_image) {
  const src = imgPath(hero.hero_image);
  html = html.replace(
    /(<div class="hero-img-col"[^>]*>)([\s\S]*?)(<\/div>\s*\n\s*<\/div>\s*\n\s*<!-- STATS)/,
    `$1<img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;position:absolute;top:0;left:0;">$3`
  );
}

// Bake in site logo
if (hero.site_logo) {
  const logoSrc = imgPath(hero.site_logo);
  // Replace hero logo - match exact src="" pattern
  html = html.replace(
    'id="hero-logo" src=""',
    `id="hero-logo" src="${logoSrc}"`
  );
  html = html.replace(
    'id="hero-logo" src="/"',
    `id="hero-logo" src="${logoSrc}"`
  );
  // Also update nav logo
  html = html.replace(
    'class="nav-logo-img" src=""',
    `class="nav-logo-img" src="${logoSrc}"`
  );
  html = html.replace(
    'class="nav-logo-img" src="/"',
    `class="nav-logo-img" src="${logoSrc}"`
  );
}

// Bake in show data
if (pitchbreak.time) html = html.replace(/(<div class="show-time" id="pb-time">)[^<]*/g, '$1' + pitchbreak.time);
if (pitchbreak.description) html = html.replace(/(<p class="sec-body" id="pb-desc">)[^<]*/g, '$1' + pitchbreak.description);
if (pitchbreak.image) html = html.replace(/<div class="img-placeholder" id="pb-img"><\/div>/g, `<div class="img-placeholder" id="pb-img"><img src="${imgPath(pitchbreak.image)}" style="width:100%;height:100%;object-fit:cover;"></div>`);

if (spectral.time) html = html.replace(/(<div class="show-time" id="ss-time">)[^<]*/g, '$1' + spectral.time);
if (spectral.description) html = html.replace(/(<p class="sec-body" id="ss-desc">)[^<]*/g, '$1' + spectral.description);
if (spectral.image) html = html.replace(/<div class="img-placeholder" id="ss-img"><\/div>/g, `<div class="img-placeholder" id="ss-img"><img src="${imgPath(spectral.image)}" style="width:100%;height:100%;object-fit:cover;"></div>`);

if (hybrid.description) html = html.replace(/(<p class="sec-body" id="hybrid-desc">)[^<]*/g, '$1' + hybrid.description);
if (hybrid.image) html = html.replace(/<div class="img-placeholder" id="hybrid-img"><\/div>/g, `<div class="img-placeholder" id="hybrid-img"><img src="${imgPath(hybrid.image)}" style="width:100%;height:100%;object-fit:cover;"></div>`);

if (nftopia.description) html = html.replace(/(<p class="sec-body" id="nftopia-desc">)[^<]*/g, '$1' + nftopia.description);
if (nftopia.image) html = html.replace(/<div class="img-placeholder" id="nftopia-img"><\/div>/g, `<div class="img-placeholder" id="nftopia-img"><img src="${imgPath(nftopia.image)}" style="width:100%;height:100%;object-fit:cover;"></div>`);

if (breakery.tagline) html = html.replace(/(<p[^>]*id="breakery-tagline"[^>]*>)[^<]*/g, '$1' + breakery.tagline);

if (community.title) html = html.replace(/(<div class="comm-title" id="community-title">)[^<]*/g, '$1' + community.title);
if (community.description) html = html.replace(/(<p class="sec-body" id="community-desc">)[^<]*/g, '$1' + community.description);
if (community.earn_items && community.earn_items.length) {
  const items = community.earn_items.map(i =>
    `<div class="earn-item"><div class="earn-dot"></div><div class="earn-text">${i}</div></div>`
  ).join('\n');
  html = html.replace(
    /(<div id="earn-items-list">)([\s\S]*?)(<\/div>)/,
    `$1${items}$3`
  );
}

// Write to dist
fs.writeFileSync(path.join('dist', 'index.html'), html);

// Copy admin folder
console.log('Build complete! Files written to dist/');
