# ConsumerBreak Website — Claude Code Session Guide

## First thing every session
1. Run: `git pull`
2. Read current files from raw GitHub URLs below before touching anything
3. Batch ALL related changes — ONE git push per session, not one per fix

## Raw file URLs (read these before every session)
```
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
```

---

## Repo & deployment info
- Repo: github.com/ConsumerBreak-App/consumerbreak-site
- Local path: C:\Users\natan\consumerbreak-site
- **Primary deploy: Cloudflare Pages** — consumerbreak.pages.dev (or consumerbreak.com after DNS)
- Netlify (legacy): consumerbreak-website-2026.netlify.app — kept ONLY for Netlify Identity auth
- Live domain (pending DNS switch from Squarespace): consumerbreak.com
- Netlify Site ID: 30297997-a967-47c3-80cb-678506742164
- Admin login: contact@consumerbreak.com

---

## Stack
- Pure static HTML/CSS/JS — NO build step, NO framework, NO npm
- netlify.toml publish="." — no build command (kept for Netlify Identity config)
- **Hosting: Cloudflare Pages** (free, unlimited deploys, auto-deploys on git push)
- **CMS auth: Netlify Identity** (free tier — login only, no Git Gateway)
- **Editor saves: GitHub API directly** (PAT stored in localStorage — see editor.html)
- Decap CMS at /admin still works via Git Gateway on Netlify domain
- Fonts: Bebas Neue (headings), Barlow (body), Barlow Condensed (labels)
- Images: stored in images/uploads/, served from root

---

## Design system
```
Background:  #060c06  (very dark green-black)
Green:       #5fcf6e  (primary accent)
Purple:      #a78bfa  (Spectral Sessions ONLY — never use for anything else)
Gold:        #f5c842
White:       #f0f7f0
Muted:       #4a6b4a
Border:      #1a2e1a
```

---

## File structure
```
consumerbreak-site/
  index.html              — Homepage
  breakery.html           — The Breakery app suite page
  community.html          — Shows, socials, Breakverse
  hybrid-creatures.html   — Hybrid Creatures NFT summary
  story.html              — Origin story + memorial page
  editor.html             — Visual editor (admin only, Netlify Identity gated)
  breakery-editor.html    — Breakery page editor (admin only)
  admin/
    index.html            — Decap CMS loader
    config.yml            — CMS field definitions
  _data/
    hero.json             — badge, tagline, nav_logo, hero_logo, hero_image
    pitchbreak.json       — time, description, image
    spectral.json         — time, description, image
    hybrid.json           — title, eyebrow, description, stat1_val/lbl–stat4_val/lbl, movie_url, image
    nftopia.json          — description, image
    breakery.json         — tagline, apps[]
    community.json        — title, description, earn_items[]
  images/uploads/         — CMS-uploaded images
  netlify.toml
  CLAUDE.md               — this file
```

---

## Nav (must be identical on ALL pages — no exceptions)
```
Home             → index.html
The Breakery     → breakery.html
Community        → community.html
Hybrid Creatures → hybrid-creatures.html
[Watch Live]     → https://twitch.tv/consumerbreak  (green button)
```
Active page link highlighted green. No other nav items ever.

---

## Homepage section order
```
1.  Hero (badge, tagline, logo, hero image)
2.  Stats bar (1.7M+ NFTs, NFTOPIA 5, 30+ apps, 2× weekly shows)
3.  BREAKFEST banner
4.  Live Shows (PitchBreak + Spectral Sessions side by side)
5.  Hybrid Creatures NFT + movie player
6.  Spectral Sessions / SAFE section (purple #a78bfa)
7.  The Breakery app strip
8.  NFTOPIA (standalone block, AFTER Breakery)
9.  Community / Breakverse
10. Story teaser → /story.html
11. Footer
```

---

## CMS data files and their fields
```
hero.json:       badge, tagline, nav_logo, hero_logo, hero_image
pitchbreak.json: time, description, image
spectral.json:   time, description, image
hybrid.json:     title, eyebrow, description, stat1_val, stat1_lbl, stat2_val, stat2_lbl,
                 stat3_val, stat3_lbl, stat4_val, stat4_lbl, movie_url, image
nftopia.json:    description, image
breakery.json:   tagline, apps[] (each: name, desc, status, link, icon)
community.json:  title, description, earn_items[]
```

---

## Editor — GitHub API (NO MORE Git Gateway)
editor.html now saves directly to GitHub via Personal Access Token:
```
GITHUB_REPO   = 'ConsumerBreak-App/consumerbreak-site'
GITHUB_BRANCH = 'main'
GITHUB_API    = 'https://api.github.com/repos/ConsumerBreak-App/consumerbreak-site/contents/'
```
- Token stored in `localStorage` key `cb_github_token`
- Token bar at top of editor.html — paste once per browser, stays saved
- Auth headers: `Authorization: token ghp_xxxx`
- GET file → get SHA → PUT with new content + SHA
- Image uploads go to `images/uploads/TIMESTAMP_filename` via same GitHub API
- Netlify Identity still used for the login gate ONLY (no JWT needed for GitHub API)
- If token is missing, saves will throw a clear error message

---

## Key JS patterns
- `loadCMSData()` in each page fetches all `_data/*.json` and populates the DOM
- `get()` helper has try/catch — one bad JSON file must never crash the others
- `window._movieUrl` set from hybrid.json, used by movie play button
- YouTube thumbnail: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg` with `hqdefault.jpg` fallback
- Movie YouTube URL: `https://www.youtube.com/watch?v=6VPSnDDmoOw`
- breakery.json apps: read both `a.description` and `a.desc` (both keys supported)
- BrandBreak iFrame postMessage type: `'CONSUMERBREAK_TASK_COMPLETE'`

---

## Workflow rules (Windows PowerShell)
- PowerShell does NOT support && — run git commands one at a time:
```
git add .
git commit -m "description of changes"
git push
```
- ALWAYS git pull before starting any session
- Batch all related changes before pushing — ONE push per session
- Cloudflare auto-deploys ~30 seconds after push
- To test locally: `start index.html` (layout/HTML/JS only)
- Editor token entry requires live URL — cannot test auth locally
- To write JSON on Windows use Node.js:
```
node -e "require('fs').writeFileSync('_data/file.json', JSON.stringify({...}, null, 2));"
```

---

## About ConsumerBreak (do not get wrong)
**ConsumerBreak App** = unified all-in-one hub (NOT a puzzle game):
- Watch live streams (PitchBreak + Spectral Sessions)
- Access all 30 Breakery apps in one place
- Connect WAX wallet
- Manage Breakverse account (unified identity)
- Participate in BrandBreak campaigns
- Push notifications for shows, NFT drops, prizes

**BrandBreak** = primary B2B SaaS platform:
- Self-serve gamified campaign tool for brands
- Subscription tiers: Starter $79/mo, Growth $249/mo, Scale $699/mo
- 15 branded mini-games plug in via iFrame
- Built-in marketplace: brands post requests → vibe coders build → 20-30% platform commission
- Public beta launching April 2026

**The Breakery** = 30 apps total:
- Tier 1 Hub: BrandBreak
- Tier 1.5 Feature Apps: KeyBreak (1,468 commits — streaming soundboard), ImagiBreak (AI image gen)
- Tier 2 Mini Games (15): PuzzleBreak, QuestBreak, MemoryBreak, PongBreak, BingoBreak, CraftBreak,
  ScratchBreak, MazeBreak, TriviaBreak, SnakeBreak, JumpBreak, SpaceBreak, FlappyBreak, FPSBreak, BowlingBreak
- Tier 3 Utility (14): StreamBreak, BaseStream, TriviaGenius, SpinBreak, TokenGate, SecretApp,
  PitchBreak companion, XConnect, NewsBite, TranscriBreak, CalorieBreak, CleaningBreak, SpectralApp, others

**Live Shows:**
- PitchBreak: Wednesdays 2PM EST — Twitch, X Spaces, NFTOPIA, Watch2Earn
- Spectral Sessions: Sundays 2PM EST — Twitch, X Spaces, Arena Social, Blaze.stream
- ~150 unique viewers per show across all platforms, growing

**Hybrid Creatures NFT:**
- 1.7M+ assets on WAX blockchain (cbreakgaming collection)
- 500+ free NFTs weekly on stream, 50M $WUF weekly airdrop
- Movie: https://www.youtube.com/watch?v=6VPSnDDmoOw

**Spectral Sessions / SAFE Partnership:**
- Co-produced with Jumbie Art (Nick Jumblatt, Louisville KY)
- SAFE = Spectral Art Foundation Enterprises, newly registered 501(c)(3)
- Patented physical art technology (US 20150325157A) — LED hue-cycling frames
- XRPL-verified provenance via xrpresso.io
- Homepage section uses purple #a78bfa
- SAFE website: jumbieart.com/pages/safe

---

## Backend migration plan (Base44 → Supabase)

### Current state
All 30 Breakery apps run on Base44 backend. Cannot cancel Base44 until migration complete.
Only two Base44 dependencies per app: `VITE_BASE44_APP_ID` + `VITE_BASE44_APP_BASE_URL`

### Target state
One Supabase project serves ALL apps with unified Breakverse accounts.
Replace with: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`

### Base44 → Supabase migration pattern (direct 1:1)
```javascript
Entity.filter({ field: value }) → supabase.from('table').select('*').eq('field', value)
Entity.get(id)                  → supabase.from('table').select('*').eq('id', id).single()
Entity.create(data)             → supabase.from('table').insert(data).select().single()
Entity.update(id, data)         → supabase.from('table').update(data).eq('id', id)
Entity.delete(id)               → supabase.from('table').delete().eq('id', id)
```

### Complete Supabase schema (already designed — use exactly this)
```sql
-- CORE (shared across all apps)
users              -- Supabase Auth built-in
profiles           -- user_id, username, profile_picture_url, wax_address,
                   -- shard_solve_count, total_power_ups_used, streamer_mode, monitor_active

-- BRANDBREAK
clients            -- id, name, url_name, logo_url, primary_color, description, status
client_users       -- id, client_id, user_id, username, total_points, lifetime_points
tasks              -- id, client_id, title, description, type, points_reward, status,
                   -- approval_status, url, video_url, iframe_url, google_form_url,
                   -- survey_questions(JSONB), is_public, sort_order, total_completions
user_tasks         -- id, client_id, task_id, user_id (private assignments)
task_completions   -- id, client_id, task_id, user_id, points_earned, status,
                   -- completion_type, submission_text, submission_url
points_transactions -- id, client_id, user_id, type, points, description, reference_id
store_items        -- id, client_id, name, description, image_url, points_cost,
                   -- quantity_available, is_active
user_store_items   -- id, client_id, user_id, store_item_id, redeemed_at
coupons            -- id, client_id, code, description, discount_type, discount_value,
                   -- expiry_date, max_uses, current_uses
user_coupons       -- id, client_id, user_id, coupon_id, redeemed_at
badges             -- id, client_id, name, description, image_url, criteria_type, criteria_value
user_badges        -- id, user_id, badge_id, earned_at
messages           -- id, client_id, sender_type, sender_id, recipient_id, subject, content, is_read
referrals          -- id, client_id, referrer_user_id, referred_user_id, referral_code, points_awarded
survey_responses   -- id, client_id, task_id, user_id, responses(JSONB)

-- GAMES
game_sessions      -- id, client_id, task_id, user_id, game_type, score,
                   -- duration_seconds, completed, metadata(JSONB)
puzzle_images      -- id, name, image_url, piece_count, is_active, times_played
scores             -- id, user_id, username, puzzle_image_id, completion_time, power_ups_used

-- TWITCH (shared between PuzzleBreak + KeyBreak)
twitch_command_logs -- id, user_email, twitch_channel_name, command_word,
                    -- twitch_username, full_message, timestamp

-- KEYBREAK
keyboards          -- id, user_id, name, description, is_public
keyboard_keys      -- id, keyboard_id, key, audio_url, visual_url, gif_url, label
recordings         -- id, user_id, keyboard_id, duration, audio_url
hero_games         -- id, user_id, title, note_sequence(JSONB), bpm
hero_recordings    -- id, user_id, hero_game_id, score, recording_url

-- IMAGIBREAK
generated_images   -- id, user_id, prompt, image_url, style_params
image_campaigns    -- id, user_id, name, images(JSONB), target_platform
favorites          -- id, user_id, image_id

-- MARKETPLACE (future)
marketplace_requests     -- id, client_id, title, description, game_type, budget, status
marketplace_submissions  -- id, request_id, coder_user_id, app_url, description, status
marketplace_transactions -- id, submission_id, client_id, coder_user_id, amount, commission_rate
coder_profiles           -- id, user_id, is_builder, bio, total_earned, apps_accepted
```

### iFrame game integration contract
```javascript
// Games receive from BrandBreak via URL params:
const cbClientId = urlParams.get('cb_clientId');
const cbUserId   = urlParams.get('cb_userId');
const cbTaskId   = urlParams.get('cb_taskId');
const cbUsername = urlParams.get('cb_username');

// Games report completion back to BrandBreak:
window.parent.postMessage({ type: 'CONSUMERBREAK_TASK_COMPLETE' }, '*');
```

---

## Sub-chat migration order

### This website chat (master hub)
Planning, architecture decisions, briefing updates. Writes Claude Code instructions → Natanel pastes into VS Code.

### App migration sub-chats
| Chat name | Purpose | Start with |
|---|---|---|
| `supabase-schema` | Set up Supabase project, create ALL tables, RLS policies | Master briefing |
| `brandbreak-migration` | Migrate BrandBreak hub | Master briefing + BrandBreak src/api/ files |
| `keybreak-migration` | KeyBreak (1,468 commits, 6 Twitch functions) | Master briefing + KeyBreak pages.config.js |
| `puzzlebreak-migration` | PuzzleBreak + Twitch Edge Functions | Master briefing + functions/ folder |
| `imagibreak-migration` | ImagiBreak + fal.ai Flux Ultra + Runway video | Master briefing + pages.config.js |
| `minigames-migration` | All 13 simple games in one chat | Master briefing + one game's pages.config.js |
| `utility-apps` | StreamBreak, TokenGate, XConnect etc. | Per app as needed |
| `duxbowling` | Separate product for friend's Duckpin pin setter | DuxBowling briefing + specs |

### App repos on GitHub
```
https://github.com/ConsumerBreak-App/brandbreak.base44
https://github.com/ConsumerBreak-App/keybreak.base44
https://github.com/ConsumerBreak-App/puzzlebreak.base44
https://github.com/ConsumerBreak-App/imagibreak.base44
https://github.com/ConsumerBreak-App/questbreak.base44
https://github.com/ConsumerBreak-App/memorybreak.base44
https://github.com/ConsumerBreak-App/pongbreak.base44
https://github.com/ConsumerBreak-App/bingobreak.base44
https://github.com/ConsumerBreak-App/jumpbreak.base44
https://github.com/ConsumerBreak-App/triviabreak.base44
https://github.com/ConsumerBreak-App/snakebreak.base44
https://github.com/ConsumerBreak-App/bowlingbreak.base44
```

### Twitch functions migration note
PuzzleBreak and KeyBreak have Deno serverless functions (Base44 runtime).
Migrate to Netlify Edge Functions (also Deno — nearly identical syntax).
Replace only:
- `createClientFromRequest(req)` → Supabase client init
- `base44.auth.me()` → `supabase.auth.getUser()`
- `base44.asServiceRole.entities.X.create()` → `supabase.from('x').insert()`

IMPORTANT: Base44 Deno functions use in-memory Maps for active Twitch clients.
Netlify Edge Functions are stateless — handle persistent connection state via
Supabase Realtime or external connection service.

---

## Hosting plan
```
consumerbreak.com website  → Cloudflare Pages (FREE, unlimited deploys)
Editor auth                → Netlify Identity (free tier — login gate only)
All Breakery apps          → Cloudflare Pages or Vercel (NOT Netlify)
Shared database + auth     → Supabase (free tier, 50K MAU)
DuxBowling.com             → TBD (same stack)
```
CRITICAL: Never deploy Breakery apps to Netlify — 0 build credits remaining.

---

## Key decisions (do not re-debate)
- ConsumerBreak App = unified hub, NOT a puzzle game
- BrandBreak = primary B2B SaaS ($79/$249/$699/mo self-serve)
- Purple #a78bfa = Spectral Sessions / SAFE color ONLY
- Website hosting = Cloudflare Pages (migrated from Netlify — 0 credits left)
- Editor saves = GitHub API with PAT (migrated from Netlify Git Gateway)
- Netlify Identity kept for editor login gate only
- Breakery apps → Cloudflare Pages/Vercel (NOT Netlify)
- fal.ai Flux Ultra for ImagiBreak image generation
- Runway ML or Luma AI for ImagiBreak video generation
- Supabase = target backend for all 30 apps
- postMessage type = 'CONSUMERBREAK_TASK_COMPLETE' (exact string)
- netlify.toml publish="." no build command
- No editorial workflow in Decap CMS — Save → Publish directly
- KeyBreak = standalone streaming platform (not just a mini game)
- Mobile apps (React Native + Expo) after web migration stable
- Cancel Base44 after all apps migrated (~4-6 weeks)
- DuxBowling = separate product, shared Supabase infrastructure
- stream.consumerbreak.com = planned streaming hub page (not built yet)

---

## Known issues / pending tasks
- [ ] Set up Cloudflare Pages project (connect repo, build output = /, no build command)
- [ ] Generate GitHub PAT and save in editor — see CLOUDFLARE-SETUP.txt
- [ ] Point consumerbreak.com DNS from Squarespace to Cloudflare
- [ ] story.html nav needs updating to current nav
- [ ] stream.consumerbreak.com page not built yet
- [ ] All section images need uploading via editor.html
- [ ] Breakery page: "Play Now" buttons will link to app subdomains after Supabase migration
- [ ] Supabase project not yet created — start supabase-schema chat next

---

## After making changes — run in PowerShell (one at a time)
```
git add .
git commit -m "describe what changed"
git push
```
Cloudflare auto-deploys ~30 seconds after push.
Check live at: consumerbreak.pages.dev (or consumerbreak.com after DNS)
