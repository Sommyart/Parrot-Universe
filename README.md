# Parrot Universe (demonstration project)

A fictional exotic parrot store showcasing an interactive Scarlet Macaw ("Ruby").
No live animals are sold; all prices, inventory and contact details are sample data.

## Run it
1. Install Node.js 18+ from https://nodejs.org
2. In this folder run:  npm install
3. Start:               npm run dev    (open the http://localhost:5173 link shown)
4. Production build:    npm run build  (static output in dist/, deploy to Vercel/Netlify/Render)
   For SPA hosting, route all paths to index.html.

## Stack
React + Vite + TypeScript, Tailwind CSS v4, GSAP, Lucide React, React Router.

## The parrot
- public/parrot/*.webm  green screen removed with FFmpeg (chromakey + despill), VP9 with alpha
- public/parrot/*.mp4   fallback for Safari/iOS, keyed live in a canvas
- assets-originals/     untouched original clips (backup, not deployed)
- src/parrot/ParrotAnimationController.ts  state machine:
  arrival > landing > idle <> curious > takeoff > flying > returning > landing > idle
  Cooldowns prevent takeoff/landing loops; only the active clip plays.
- src/parrot/AnimatedParrot.tsx  React wrapper, preloading, fallbacks, touch/reduced-motion handling.
- The bird layer has pointer-events: none, so it never blocks clicks.
- Toggle the parrot with the bird icon in the navbar (saved in localStorage).

## Photos
Photos: put species photos in public/img/species/ and accessory photos in public/img/accessories/ (.jpg). Wikipedia is used only as a fallback.

