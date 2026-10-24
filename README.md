<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# MEDBRIDGE QR — EHR Bridge v2.4

Local synthetic EHR bridge demo with a patient directory, ephemeral QR access, responder triage, and security audit logging.

## Run Locally

**Prerequisites:** Node.js 20+


1. Install dependencies: `npm install`
2. Seed or refresh the 100 synthetic records: `npm run seed`
3. Start the Vite UI and local API: `npm run dev`
4. Open the Vite URL printed in the terminal (normally `http://localhost:3000`).

## Patient data and token API

- `src/data/patients.ts` is the canonical, deterministic synthetic seed for 100 profiles.
- `scripts/seed-patients.ts` merges by patient ID and can be run repeatedly without duplicates.
- The local JSON database is `data/medbridge-db.json`; the API creates it on startup if missing.
- `server.ts` exposes directory data, issues opaque tokens with 45 second, 15 minute, or 1 hour TTLs, revokes tokens, validates one time responder credentials, filters returned medical categories by consent, and persists access events.
- The API uses port 3001; Vite proxies `/api` requests to it.

All records are fictional demo data. Medical fields in the JSON database and client bundle are not encrypted; only bearer tokens and PINs are stored as hashes server-side. Consent controls limit the responder API response, but they are not encryption. The responder badge check (`ER-402`) is a development stub, and the JSON database is intended for local demo use. Do not put real patient information in this demo. A real deployment needs authenticated users, encrypted server-side storage and transport, and server-only clinical record access.
