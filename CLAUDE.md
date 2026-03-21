# ConsumerBreak Website — Claude Code Session Guide

## First thing every session
1. Run: git pull
2. Read the current files from GitHub raw URLs before touching anything

## Raw file URLs (read these before every session)
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/index.html
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/editor.html
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/breakery.html
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/community.html
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/hybrid-creatures.html
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/netlify.toml
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/admin/config.yml
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/hero.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/pitchbreak.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/spectral.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/hybrid.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/nftopia.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/breakery.json
https://raw.githubusercontent.com/ConsumerBreak-App/consumerbreak-site/main/_data/community.json

## Repo info
- Repo: github.com/ConsumerBreak-App/consumerbreak-site
- Local path: C:\Users\natan\consumerbreak-site
- Deployed at: consumerbreak-website-2026.netlify.app
- Live domain (pending): consumerbreak.com
- Netlify Site ID: 30297997-a967-47c3-80cb-678506742164

## Stack
- Pure static HTML/CSS/JS — NO build step, NO framework, NO npm
- netlify.toml publish="." — deploys the repo root directly
- CMS: Decap CMS at /admin — saves to _data/*.json via Git Gateway
- Auth: Netlify Identity (contact@consumerbreak.com)
- Fonts: Bebas Neue (headings), Barlow (body), Barlow Condensed (labels)

## Design system
- Background: #060c06
- Green: #5fcf6e
- Purple: #a78bfa (Spectral Sessions ONLY — never use for anything else)
- Gold: #f5c842
- White: #f0f7f0
- Muted: #4a6b4a
- Border: #1a2e1a

## File structure
- index.html — homepage
- editor.html — visual editor (admin only, Netlify Identity gated)
- breakery-editor.html — Breakery page editor (admin only)
- breakery.html — The Breakery app suite page
- community.html — Shows, socials, Breakverse
- hybrid-creatures.html — Hybrid Creatures NFT page
- story.html — Origin story page
- _data/*.json — CMS content loaded via fetch() in each HTML file
- images/uploads/ — uploaded images (via editor or Decap CMS)
- admin/index.html — Decap CMS
- admin/config.yml — CMS field definitions

## Nav (must be identical on ALL pages)
- Home → index.html
- The Breakery → breakery.html
- Community → community.html
- Hybrid Creatures → hybrid-creatures.html
- Watch Live button → https://twitch.tv/consumerbreak

## Homepage section order
1. Hero
2. Stats bar
3. BREAKFEST banner
4. Live Shows (PitchBreak + Spectral Sessions)
5. Hybrid Creatures NFT + movie player
6. Spectral Sessions / SAFE section (purple)
7. The Breakery app strip
8. NFTOPIA (standalone, after Breakery)
9. Community / Breakverse
10. Story teaser
11. Footer

## CMS data files and their fields
- hero.json: badge, tagline, nav_logo, hero_logo, hero_image
- pitchbreak.json: time, description, image
- spectral.json: time, description, image
- hybrid.json: title, eyebrow, description, stat1_val, stat1_lbl, stat2_val, stat2_lbl, stat3_val, stat3_lbl, stat4_val, stat4_lbl, movie_url, image
- nftopia.json: description, image
- breakery.json: tagline, apps[] (each app has: name, desc, status)
- community.json: title, description, earn_items[]

## Key JS patterns
- loadCMSData() in index.html fetches all _data/*.json and populates the page
- get() helper has try/catch for resilience — bad JSON in one file must never crash others
- window._movieUrl is set from hybrid.json and used by the movie play button
- YouTube thumbnail loaded from: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg with hqdefault.jpg fallback
- Image upload in editor.html uploads to GitHub via Netlify Git Gateway, stores path string (NOT base64)
- postMessage type for BrandBreak iFrame tasks: 'CONSUMERBREAK_TASK_COMPLETE'

## Workflow rules
- ALWAYS read current files from raw GitHub URLs before editing
- Batch ALL related changes before pushing
- ONE git push per session — not one per fix
- Test locally first: run `start index.html` in terminal
- Local testing works for layout/HTML/JS — editor auth requires live Netlify URL
- PowerShell does NOT support && — run git commands one at a time:
    git add .
    git commit -m "message"
    git push
- To write JSON files on Windows use Node.js:
    node -e "require('fs').writeFileSync('_data/file.json', JSON.stringify({...}, null, 2));"

## Known issues / pending fixes
- [ ] story.html nav needs updating to current nav
- [ ] stream.consumerbreak.com page not built yet
- [ ] consumerbreak.com domain not yet pointed to Netlify (still on Squarespace)
- [ ] Cloudflare Pages migration pending (free unlimited deploys vs Netlify credits)

## Business context (do not re-debate these decisions)
- ConsumerBreak App = unified hub, NOT a puzzle game
- BrandBreak = primary B2B SaaS revenue ($79/$249/$699/mo)
- Purple #a78bfa = Spectral Sessions color only
- Breakery apps deploy to Cloudflare Pages/Vercel (NOT Netlify — protect build credits)
- fal.ai Flux Ultra for ImagiBreak image generation
- Supabase = target backend for all 30 apps (migrating from Base44)
- DuxBowling = separate product, shared Supabase infrastructure

## AFTER ALL FIXES — run these one at a time in PowerShell:

git add .
git commit -m "Fix nftopia JSON, YouTube thumbnail, font sizes, add CLAUDE.md session guide"
git push