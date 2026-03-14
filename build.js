const fs = require('fs');
const path = require('path');

// Read all data files
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join('_data', file + '.json'), 'utf8'));
  } catch(e) {
    return {};
  }
}

const hero = readJSON('hero');
const pitchbreak = readJSON('pitchbreak');
const spectral = readJSON('spectral');
const hybrid = readJSON('hybrid');
const nftopia = readJSON('nftopia');
const breakery = readJSON('breakery');
const community = readJSON('community');

// Fix image path
function imgPath(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : '/' + src;
}

// Read template
let html = fs.readFileSync('index.html', 'utf8');

// Remove the entire CMS data loader script block
html = html.replace(/\/\/ ── CMS DATA LOADER[\s\S]*?loadCMSData\(\);[\s\S]*?\/\/ ─+/g, '// data baked in at build time');

// Inject data directly into HTML
// Hero badge
if (hero.badge) {
  html = html.replace(
    /(<span id="hero-badge">)[^<]*/,
    `$1${hero.badge}`
  );
}

// Hero tagline
if (hero.tagline) {
  html = html.replace(
    /(<p class="hero-sub" id="hero-tagline">)[^<]*/,
    `$1${hero.tagline}`
  );
}

// Hero image - inject into hero-img-col
if (hero.hero_image) {
  const src = imgPath(hero.hero_image);
  html = html.replace(
    /(<div class="hero-img-col" id="hero-img-col">)([\s\S]*?)(<\/div>\s*<\/div>\s*<!-- STATS)/,
    `$1<img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;">$3`
  );
}

// PitchBreak
if (pitchbreak.time) html = html.replace(/(<div class="show-time" id="pb-time">)[^<]*/, `$1${pitchbreak.time}`);
if (pitchbreak.description) html = html.replace(/(<p class="sec-body" id="pb-desc">)[^<]*/, `$1${pitchbreak.description}`);
if (pitchbreak.image) {
  const src = imgPath(pitchbreak.image);
  html = html.replace(/(<div class="img-placeholder" id="pb-img"><\/div>)/, `<div class="img-placeholder" id="pb-img"><img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`);
}

// Spectral Sessions
if (spectral.time) html = html.replace(/(<div class="show-time" id="ss-time">)[^<]*/, `$1${spectral.time}`);
if (spectral.description) html = html.replace(/(<p class="sec-body" id="ss-desc">)[^<]*/, `$1${spectral.description}`);
if (spectral.image) {
  const src = imgPath(spectral.image);
  html = html.replace(/(<div class="img-placeholder" id="ss-img"><\/div>)/, `<div class="img-placeholder" id="ss-img"><img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`);
}

// Hybrid Creatures
if (hybrid.description) html = html.replace(/(<p class="sec-body" id="hybrid-desc">)[^<]*/, `$1${hybrid.description}`);
if (hybrid.image) {
  const src = imgPath(hybrid.image);
  html = html.replace(/(<div class="img-placeholder" id="hybrid-img"><\/div>)/, `<div class="img-placeholder" id="hybrid-img"><img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`);
}

// NFTOPIA
if (nftopia.description) html = html.replace(/(<p class="sec-body" id="nftopia-desc">)[^<]*/, `$1${nftopia.description}`);
if (nftopia.image) {
  const src = imgPath(nftopia.image);
  html = html.replace(/(<div class="img-placeholder" id="nftopia-img"><\/div>)/, `<div class="img-placeholder" id="nftopia-img"><img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`);
}

// Breakery tagline
if (breakery.tagline) {
  html = html.replace(/(<p[^>]*id="breakery-tagline"[^>]*>)[^<]*/, `$1${breakery.tagline}`);
}

// Community
if (community.title) html = html.replace(/(<div class="comm-title" id="community-title">)[^<]*/, `$1${community.title}`);
if (community.description) html = html.replace(/(<p class="sec-body" id="community-desc">)[^<]*/, `$1${community.description}`);
if (community.earn_items && community.earn_items.length) {
  const items = community.earn_items.map(item =>
    `<div class="earn-item"><div class="earn-dot"></div><div class="earn-text">${item}</div></div>`
  ).join('\n    ');
  html = html.replace(
    /(<div id="earn-items-list">)([\s\S]*?)(<\/div>)/,
    `$1\n    ${items}\n    $3`
  );
}

// Write output
fs.writeFileSync('index.html', html);
console.log('Build complete! index.html updated with CMS data.');
