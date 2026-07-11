# Coding Guidelines & Architecture Constraints

For any AI developer assistant working in this workspace, please adhere strictly to these rules:

## 1. No ES Modules (CORS file:// limits)
- The project runs directly via the `file://` protocol (double-clicking `index.html` locally).
- **DO NOT** use `import` / `export` ES Module syntax. 
- All scripts are loaded sequentially as standard script tags in `index.html`. They share state globally or bind handlers to `window`.

## 2. Monolithic vs Modular Files
- Keep the story dialogues split under `src/story/*.js` to manage AI context token counts.
- Keep the Deltarune battle logic split:
  - `src/battle.js`: UI buttons, menus (ACT/ITEM/SPARE), HP/TP stats, writeConsole.
  - `src/battle_arena.js`: Real-time bullet hell loops, spawning physics, collision & grazing detection.
  - Connected via the global `battleCtx` object wrapper.
- Keep the Baldi basics logic split:
  - `src/baldi.js`: Pad questions, mobile/key controls, mistake calculations, jumpscare triggers, secret endings check.
  - `src/baldi_renderer.js`: Raycasting 3D canvas draws, depth shading, billboard sprites sorting.
  - Connected via the global `baldiCtx` reader object wrapper.

## 3. Preservation of existing Hebrew dialogues & structure
- Do not lose or change any Hebrew meme phrases, paths, or keys when refactoring.

## 4. Development Workflow & Planning Guidelines (עבודה בטוחה ומתוכננת)
To write highly readable, glitch-free code, follow this plan-first checklist:
- **Research Scope First**: Before modifying any script, inspect its companion file (e.g., look at `src/battle_arena.js` when modifying `src/battle.js`) to see how state is shared.
- **Respect Context Bridges**: 
  - Do not introduce isolated global variables.
  - Read/write shared state strictly through the context wrappers: `battleCtx` for Deltarune, and `baldiCtx` for Baldi.
  - If a new state variable is needed in the physics/rendering loop, define it in the main UI script (`battle.js` / `baldi.js`) and expose it with a getter/setter property in the context broker so it updates reactively.
- **Order of Script Loadings**: Always ensure dependent scripts are loaded sequentially in `index.html` (e.g. helper scripts like `battle_arena.js` or `baldi_renderer.js` alongside their main controller scripts).
- **Code Cleanliness**: Keep comments structured, write self-documenting function names, and preserve existing comments.

## 5. PWA & Service Worker Offline Caching (תמיכה באופליין ו-PWA)
- If you add new static assets to the project (e.g. new audio files under `audio/`, new images under `images/`, or new script files under `src/`), **YOU MUST** append their relative file paths to the `ASSETS` array inside `sw.js`. This guarantees they will be cached for offline play.
- Do not remove or alter the `window.location.protocol.startsWith('http')` condition guarding the service worker registration in `index.html`. This ensures the app can still be opened via the `file://` protocol locally without throwing security exceptions.

## 6. Asset Compression and Optimization (דחיסת ואופטימיזציית מדיה)
- Every static media asset (images under `images/` or audio under `audio/`) added to this repository **MUST** be compressed and optimized before commit.
- Avoid raw heavy formats like BMP, high-res TIFF, or uncompressed WAV.
- Use optimized formats (e.g. WebP/compressed PNG for images, and standard MP3 with moderate bitrates for audio) to ensure the game maintains a very low memory (RAM) footprint and minimal download size.

