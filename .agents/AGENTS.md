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

## 7. Keyboard Navigation & Accessibility Support (תמיכת מקלדת רציפה)
- Always maintain and preserve keyboard fallback inputs for visual novel scenes (`src/engine.js`) and turn-based battle scenes (`src/battle.js`).
- If you modify next-dialogue flows or add menu buttons, ensure they remain fully operable via key binds (Space/Enter for dialogues, 1-9 for choices and actions, Escape/Backspace for submenu closure) to keep the game completely playable on laptops without a mouse.
- Keep HTML elements natively focusable and preserve the `:focus-visible` styling (defined in `css/main.css`) to allow seamless, visually guided Tab and Shift+Tab navigation.

## 8. Pregnancy VR Combat Engine & Combo System Rules
- The engine is split modularly:
  - `src/preg_game.js`: Manages keyboard/mobile input handlers, flat stamina calculations, combo recipe checks, logic status updates, and sound playback.
  - `src/preg_game_renderer.js`: Manages real-time loop updates (`gameLoop` and `requestAnimationFrame`), Lissajous boss coordinates, 3D particles, 3D phantom billboard orbits, and blur filters.
  - Connected via the global `pregCtx` state wrapper object.
- **Aura Mechanics**: `#pregBossAura` displays a mild cosmic glow in Phase 1 and adds the `.phase2-aura` class (massive fiery red-orange animation) at 4.5s of the Phase 2 transformation.
- **Cosmic Background Aura**: Phase 2 toggles `.phase2-background-aura` on `#pregSpaceContainer` to animate breathing dark violet/crimson radial gradients and box-shadow glows.
- **Phantom Orbitals**: 8 phantom Yams are spawned dynamically inside `#pregBossContainer` at 2s of the transition. They orbit at a radius of `125px` and scale up to `3.5x` flying towards the screen during the `lunging` state.
- **Combo Recipe Validation**:
  - The combo is sequence-based: keys match `W` (for attack inputs) and `S` (for crouch/dodge inputs).
  - Track progress with `recipeProgress`. Highlight completed steps in green (`#2ecc71`) and pending in grey (`#bdc3c7`).
  - Mismatched inputs or taking damage instantly resets `recipeProgress` to `0`.
  - Completing a sequence triggers the Special Burek Strike (30 damage and a 4-second freeze on Yam's HP regeneration).
- **Dodge Stamina Costs**:
  - Entering dodge stance costs 10 stamina flat.
  - Holding dodge drains 0.4 stamina per frame. Running out of stamina forces the stance back to `"ready"` and locks the player in a 1.5s gasping fatigue state.
- **Floating Combat Text & Neon Slash**:
  - Floating feedback tags (e.g. `"⚔️ CRITICAL!"`, `"🛡️ DODGED!"`, `"🥵 EXHAUSTED!"`) must spawn above Yam inside `pregBossContainer` using `spawnFloatingText`.
  - Neon diagonal slash overlay (`#pregSlashEffect`) triggers `.slash-animate` on combo completion.
- **Transformation Timeline**: Must last exactly 6 seconds: 0s-2s sprite flicker, 2s-4s stagger spawn of 8 phantoms, 4.5s aura transition & music swap, 6s transition complete.
- **Prevent Room Leak**: Shakes and ducking transformations must never be applied to `#pregOverlay`. They must be applied strictly to internal wrapper nodes (`#pregSpaceContainer` and `#pregBossContainer`).

## 9. Modular Settings, JSDoc typings & Layout Independent Keyboards
- Expose all custom preferences (audio channels, typewriter toggles, animations, OLED battery saver) through the settings gear toggle (`⚙️`) and keep preferences synchronized in `localStorage`.
- Maintain the JSDoc typings for the four core minigame contexts (`slenderCtx`, `baldiCtx`, `pregCtx`, `battleCtx`) to guarantee autocomplete, type safety, and editor inline documentation.
- Keep static assets sorted: characters belong under `images/characters/` and room/scene backgrounds under `images/backgrounds/`.
- Ensure all interactive minigames support layout-independent bindings using physical `e.code` (`KeyW`/`KeyA`/`KeyS`/`KeyD`/`KeyE`), Hebrew equivalents (`ק`/`ש`/`ד`/`ג`/`׳`), and Arrow keys so that switching language layouts never freezes player actions.


