# D2 Weapon Tracker — Monument of Triumph Final Standing

A full-stack Next.js app that hits the Bungie API directly to show every Destiny 2 weapon's
final state after the June 9, 2026 Monument of Triumph update, with patch history from
TWIDs, TWAB posts, and Dev Insights.

## Features

-  **Full weapon browser** — every Legendary and Exotic pulled live from the Bungie manifest
-  **Search & filter** by name, type, rarity, ammo slot, and MoT change type
-  **Browse by archetype or slot** (Kinetic/Special/Heavy)
-  **Click any weapon** for a detail page with full patch timeline
-  **Tier list** based on the final sandbox
-  **Patch feed** — every TWID, patch note, and Dev Insight that touched weapons

## Setup

### 1. Get a free Bungie API key

1. Go to [bungie.net](https://www.bungie.net) and sign in
2. Navigate to [bungie.net/en/Application](https://www.bungie.net/en/Application)
3. Click **Create New App**
4. Fill in:
   - App Name: `d2-weapon-tracker` (or anything)
   - Website: `http://localhost:3000`
   - OAuth Client Type: **None** (we only need public data)
5. Copy your **API Key**

### 2. Add your API key

Open `.env.local` and replace the placeholder:

```
BUNGIE_API_KEY=your_actual_key_here
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel (optional)

```bash
npm install -g vercel
vercel
```

Add `BUNGIE_API_KEY` as an environment variable in your Vercel project settings.

## Project Structure

```
d2-weapon-tracker/
├── app/
│   ├── api/
│   │   └── bungie/
│   │       ├── manifest/route.js     ← Proxies manifest (solves CORS)
│   │       ├── weapons/route.js      ← Filtered weapon list
│   │       └── item/[hash]/route.js  ← Individual weapon + patch history
│   ├── weapons/[hash]/page.jsx       ← Weapon detail page
│   ├── tiers/page.jsx                ← Tier list
│   ├── patches/page.jsx              ← TWID/patch feed
│   ├── layout.jsx                    ← Nav + global layout
│   ├── page.jsx                      ← Main weapons browser
│   └── globals.css                   ← D2 dark theme
├── components/
│   └── WeaponCard.jsx                ← Reusable weapon card
├── lib/
│   ├── bungie.js                     ← Bungie API client + manifest parser
│   └── patchData.js                  ← All compiled MoT/TWID weapon changes
├── .env.local                        ← Your API key (never commit this)
└── next.config.js
```

## How the Bungie API proxy works

The Bungie API sets `Access-Control-Allow-Origin` only for bungie.net itself, so
browser fetches to `www.bungie.net/Platform/...` get blocked by CORS. This app
solves it by routing all Bungie calls through Next.js API routes (`/api/bungie/...`)
which run server-side and attach your `X-API-Key` header — no CORS issue.

## Adding more data

- **More patch history**: add entries to `lib/patchData.js` → `PATCH_FEED`
- **Legendary weapon changes**: add to `ARCHETYPE_CHANGES` in `patchData.js`
- **Specific legendary weapons**: add to `MOT_EXOTIC_CHANGES` with the weapon name exactly as it appears in the manifest

## Notes

- The manifest JSON is ~300MB; the API route caches it in memory for 1 hour (`revalidate = 3600`)
- First load after server restart will be slower (~2-5s) while the manifest fetches
- For production, swap the in-memory cache in `lib/bungie.js` with Redis or a database

- Destiny 2 content and materials are trademarks and copyrights of Bungie, Inc.
- This project is not affiliated with or endorsed by Bungie.
- Built using the Bungie.net API under the Bungie API Terms of Use
