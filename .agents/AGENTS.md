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

