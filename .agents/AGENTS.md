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
