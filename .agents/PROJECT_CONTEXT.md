> IMPORTANT:
> This document is a project handoff snapshot, not a substitute for the current repository.
> If this document conflicts with the actual code, AGENTS.md, or current file structure, trust the repository.

# Yam Date Simulator — Project Context & Master Handoff

> **Document Status**: Complete architectural reference and project context handoff.  
> **Target Audience**: Any AI agent or developer continuing work in a fresh session.  
> **Core Mandate**: Preserve vanilla simplicity, zero-build execution, `file://` compatibility, and Hebrew story content.

---

## 1. Project Goals and Design Philosophy

**Yam Date Simulator** (ים דייט סימולטור) is a comedic, surreal, meme-heavy Visual Novel and minigame collection created around community lore, Discord culture, and Israeli gaming memes (Yam, Invar, Liliya, Beth Din, burekas, Baldi, Persona 5, Deltarune).

### Core Values:
- **Instant Local Execution**: Anyone can download the repository, double-click `index.html`, and play immediately in any browser without installing Node.js, running a terminal, or starting a local server.
- **Offline First & Lightweight**: Zero external runtime dependencies. Runs offline, as a PWA, or directly from `file://`.
- **Maximal Aesthetic Impact with Minimal Complexity**: Combines Persona 5 stylings, retro Undertale/Deltarune mechanics, Ace Attorney courtroom drama, and Raycasting 3D minigames using pure Vanilla HTML5, CSS3, and JavaScript.
- **Narrative & Gameplay Preservation**: Dialogue, endings, scene IDs, joke outcomes, and routes are canonical and must never be altered or lost during technical refactors.

---

## 2. Current Repository Architecture

The codebase underwent a clean structural refactor that organized flat scripts into modular domain folders while preserving sequential script loading:

```
yam_date_simulator/
├── index.html                   # Master entry point, HTML overlays, script loading chain
├── manifest.json                # PWA manifest (dynamically injected via HTTP)
├── sw.js                        # Service Worker caching & offline engine (bump CACHE_NAME on changes)
├── css/
│   ├── main.css                 # VN HUD, dialog box, gallery modal, choices, responsive layout
│   ├── persona5_menu.css        # Persona 5 main menu shaders, halftones, angular buttons
│   ├── minigames.css            # Base minigames overlay, Pregnancy VR combat styles
│   ├── battle.css               # Deltarune turn-based battle arena & box
│   ├── baldi.css                # Baldi 3D Math canvas, UI pad, notebook styles
│   ├── court.css                # Courtroom Ace Attorney hold-it, objection, witness stands
│   └── atmosphere.css           # Screen tints, vignettes, mood filters
├── src/
│   ├── core/
│   │   └── engine.js            # Main VN engine: scene transitions, typewriters, gallery UI, shortcuts
│   ├── story/
│   │   ├── setup.js             # Initial state, story root object declaration (window.story = {})
│   │   ├── main/
│   │   │   ├── main.js          # Core visual novel date routes (room, bus, mall, park, cinema)
│   │   │   └── dialogue_expansions.js # Extended comedic scenes and branching expansions
│   │   ├── special/
│   │   │   ├── special.js       # Secret paths, Slender horror route, glitch routines
│   │   │   ├── battle.js        # Deltarune boss narrative scenes
│   │   │   ├── baldi.js         # Baldi school encounter scenes
│   │   │   └── yam_shadow_story.js # Persona Shadow Yam boss route narrative
│   │   ├── court/
│   │   │   ├── court.js         # Courtroom saga entry & witness examinations
│   │   │   ├── court_ch1.js     # Chapter 1: The Burrito/Burekas incident
│   │   │   └── court_ch2.js     # Chapter 2: The Final Verdict
│   │   ├── polish_chocolate/
│   │   │   ├── polish_chocolate.js     # Polish Chocolate DLC - Arc 1
│   │   │   ├── polish_chocolate_ch2.js # Arc 2: Underground black market
│   │   │   ├── polish_chocolate_ch3.js # Arc 3: Warsaw factory showdown
│   │   │   └── polish_chocolate_ch4.js # Arc 4: The Golden Confection climax
│   │   └── endings/
│   │       ├── endings.js       # Narrative ending scenes with 'end: true'
│   │       └── ending_registry.js # Master metadata registry (136 endings, 8 categories)
│   ├── games/
│   │   ├── minigames.js         # Base quick-time events & arcade triggers
│   │   ├── battle.js            # Deltarune battle menus, HP/TP stats, ACT/ITEM/SPARE UI
│   │   ├── battle_arena.js      # Deltarune real-time bullet-hell physics, grazing & collisions
│   │   ├── baldi.js             # Baldi quiz logic, math inputs, jumpscares
│   │   ├── baldi_renderer.js    # Baldi 3D raycasting software renderer & billboard sprites
│   │   ├── slender.js           # Slender 8-pages game logic & sanity system
│   │   ├── slender_renderer.js  # Slender 3D raycaster with flashlight & static noise
│   │   ├── preg_game.js         # Space VR Combat logic, combo system, stamina, dodge stances
│   │   ├── preg_game_renderer.js # Space VR 3D starfield, Lissajous boss path, phantoms, slash VFX
│   │   ├── wii_pulse_game.js    # Wii Vitality Sensor real-time heart rate monitor
│   │   ├── yam_shadow_battle.js # Persona Shadow Yam combat controller
│   │   ├── yam_shadow_renderer.js # Persona Shadow Yam arena renderer
│   │   └── court_engine.js      # Ace Attorney courtroom director: gavel, desk slam, objection
│   ├── audio/
│   │   ├── audio.js             # BGM and SFX player with HTMLAudioElement pooling
│   │   └── tts_engine.js        # Google Translate Hebrew TTS dubbing engine & fallback
│   ├── effects/
│   │   ├── ascii_converter.js   # Real-time ASCII art filter for horror scenes
│   │   └── atmosphere.css / atmosphere.js # Ambient lighting, color grading & weather
│   └── input/
│       └── gamepad.js           # Physical Gamepad API & dual-shock rumble emulation
├── audio/                       # Compressed audio assets (MP3)
├── images/                      # Backgrounds, character sprites, banners (WebP/PNG)
└── .agents/
    ├── AGENTS.md                # AI coding rules (FAST PATCH MODE default)
    └── PROJECT_CONTEXT.md       # This document
```

---

## 3. Important Folders and Files

| Path | Purpose |
|------|---------|
| `index.html` | Defines DOM tree, UI modals (Gallery, Settings, Diagnostics, Updates), and loads scripts sequentially. |
| `css/main.css` | All visual styling for VN dialogue, character sprites, gallery modal, and mobile responsive rules. |
| `src/core/engine.js` | Heart of the VN. Renders scenes, handles typewriter text, choices, audio calls, keyboard shortcuts, and the ending gallery. |
| `src/story/endings/ending_registry.js` | Central source of truth for ending categorization, codes (`M01-M14`, `S01-S05`, etc.), and display titles. |
| `sw.js` | Service Worker cache registry. Must be bumped (`CACHE_NAME`) whenever static files change. |

---

## 4. Why the Project Avoids React / ES Modules / Build Steps

1. **`file://` Protocol Immunity**: ES Modules (`import`/`export`) are blocked by browser CORS security when opening `file:///path/index.html` locally. Classic `<script>` tags load without any local server.
2. **Zero Setup & Portability**: No `npm install`, no `vite`, no `webpack`, no Node.js requirement for players.
3. **No Build Step Drift**: What you edit in the repository is exactly what executes in the browser.
4. **Longevity**: Plain HTML5 + Vanilla JS runs for decades without bit-rot from abandoned npm dependencies.

---

## 5. `file://` / Offline / PWA Constraints

- **Dynamic Manifest & SW Guard**:
  ```js
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    // Only register SW and load manifest on http/https/localhost
  }
  ```
  On `file://`, the service worker and manifest are ignored cleanly to prevent console errors.
- **Service Worker Updates**: When modifying existing scripts or adding assets, update `sw.js`:
  ```js
  const CACHE_NAME = 'yam-date-sim-v127-...';
  ```
- **Storage Dual-Support**: State is saved simultaneously to both `localStorage` and `document.cookie` (with 1-year expiration) to persist progress across browser environments and WebViews.

---

## 6. Global State and Context-Wrapper Architecture

Because scripts share scope through `window`, complex minigames use **explicit context wrappers** to bridge physics loops with UI controllers:

| Context Wrapper | Script Bridge | Purpose |
|-----------------|---------------|---------|
| `window.story` | `src/story/**/*.js` | Story scene dictionary populated via `Object.assign`. |
| `window.endingRegistry` | `src/story/endings/ending_registry.js` | Read-only metadata map of all 136 ending scenes. |
| `window.battleCtx` | `src/games/battle.js` ↔ `battle_arena.js` | Deltarune battle stats (HP, TP, player heart coordinates, bullet objects). |
| `window.baldiCtx` | `src/games/baldi.js` ↔ `baldi_renderer.js` | Baldi 3D raycaster camera pos, map grid, notebook count. |
| `window.pregCtx` | `src/games/preg_game.js` ↔ `preg_game_renderer.js` | Space VR combat combo sequence, boss phase, stamina, phantoms. |
| `window.slenderCtx` | `src/games/slender.js` ↔ `slender_renderer.js` | Slender 3D coordinates, pages collected, sanity meter. |
| `window.wiiPulseCtx` | `src/games/wii_pulse_game.js` | Wii Vitality Sensor BPM simulation, heart attack thresholds. |
| `window.courtEngine` | `src/games/court_engine.js` | Ace Attorney animations (Hold It, Objection, Desk Slam, Gavel). |
| `window.ttsEngine` | `src/audio/tts_engine.js` | Text-To-Speech queue, voice synthesis, replay button state. |
| `window.atmosphereEngine` | `src/effects/atmosphere.js` | Automatic mood detection, screen tinting, soundscapes. |

---

## 7. Story Architecture and Scene System

A scene in `window.story` is a key-value object formatted as:

```js
window.story["scene_key"] = {
  speaker: "ים",                         // Displayed speaker name
  text: "דיאלוג בעברית...",              // Spoken and displayed text
  bg: "images/backgrounds/room.jpg",      // Optional background path
  character: "images/characters/yam.png", // Optional character sprite
  music: "audio/bgm.mp3",                 // Background track (swaps only if changed)
  sfx: "audio/punch.mp3",                 // Sound effect to play on entry
  effect: "shake",                        // Visual effect: shake, flash, redflash
  characterAnimation: "bounce",           // Sprite animation: bounce, shake, slide_in, float
  next: "next_scene_key",                 // Destination if sequential
  nextText: "המשך",                      // Custom next button text
  choices: [                              // Interactive choice buttons
    { text: "תשובה א'", next: "target_a", onSelect: () => {} },
    { text: "תשובה ב'", next: "target_b" }
  ],
  minigame: "battle",                     // Launches minigame: battle, baldi, slender, preg_game
  onEnter: function(scene) {},            // Lifecycle hook
  end: true                               // Marks scene as an ending
};
```

---

## 8. Ending System and Current Ending Redesign

### The Ending Audit Results
A complete audit established that the game contains:
- **136 Total Ending Scenes** in code.
- **132 Reachable Endings** from the story graph.
- **4 Unreachable Legacy Endings** preserved for historical continuity.

### The Categorization Model (`ending_registry.js`)
Instead of treating all 132 endings as a flat, overwhelming numbered list (`1/132`), endings are divided into distinct classes with unique code prefixes:

| Category | Code Prefix | Count | Description |
|----------|-------------|-------|-------------|
| `MAIN` | **M01 – M14** | **14** | Canonical, emotional, substantial narrative routes & major victories. |
| `SECRET` | **S01 – S05** | **5** | Hidden easter eggs, secret Baldi/Invar encounters. |
| `COURT` | **C01 – C05** | **5** | Complete Ace Attorney Courtroom saga outcomes. |
| `DLC` | **DLC01 – DLC11** | **11** | Polish Chocolate DLC (4 chapters) and Shadow Yam boss battles. |
| `BAD` | **B01 – B12** | **12** | Serious story bad endings (loss of relationship, permanent isolation). |
| `GAME_OVER` | **GO01 – GO03** | **3** | Mechanical gameplay deaths (Wii Heart Attack, combat death, Baldi catch). |
| `JOKE` | **J01 – J82** | **82** | Punchy comedic outcomes, instant meme fails, surreal one-liners. |
| `LEGACY` | *Unlisted* | **4** | Orphaned/unreachable legacy scenes, excluded from active gallery UI. |

### Technical Separation:
1. `localStorage.getItem("unlocked_endings")` stores raw scene IDs (e.g. `["end_true_love", "end_burekas_poison"]`).
2. Backward compatibility is 100% maintained. Old saves remain valid.
3. In-game speaker title displays `${reg.code} - ${reg.title}` instead of legacy `"סוף 35/59"`.
4. The Gallery Modal (`#galleryModal`) features category filter tabs with dynamic counts (`הכל`, `ראשיים`, `סודיים`, etc.).

---

## 9. Major Systems / Minigames and How They Connect

1. **Deltarune Battle (`src/games/battle.js`, `battle_arena.js`)**:
   - Turn-based menu (FIGHT, ACT, ITEM, MERCY).
   - Real-time bullet-hell arena where player moves a red heart with Arrow Keys / WASD.
   - Grazing mechanic charges TP gauge. Victory via Spare or Fighting.
2. **Baldi Math Class (`src/games/baldi.js`, `baldi_renderer.js`)**:
   - 3D first-person raycasting engine inside a canvas.
   - Notebook question prompt pad. 3rd question is impossible math.
   - Slap sound intervals accelerate as Baldi pursues the player.
3. **Slender / Horror Route (`src/games/slender.js`, `slender_renderer.js`, `ascii_converter.js`)**:
   - Dark forest raycaster with flashlight battery.
   - Real-time ASCII text shader converts scenes into horror glitch art.
4. **Pregnancy VR Combat (`src/games/preg_game.js`, `preg_game_renderer.js`)**:
   - Cosmic boss fight against Yam in a 3D starfield.
   - Phase 1: Normal combat with Lissajous movement.
   - Phase 2: Cosmic red aura transformation, 8 orbiting phantoms, stamina-draining duck/dodge stance, and W/S combo system triggering the Burek Strike.
5. **Wii Vitality Sensor (`src/games/wii_pulse_game.js`)**:
   - Real-time simulated heart rate HUD (BPM).
   - High-tension choices add BPM; exceeding 165 BPM triggers a mechanical Game Over (`wii_pulse_heart_attack_scene`).
6. **Beth Din Courtroom Engine (`src/games/court_engine.js`)**:
   - Animated visual overlays for Ace Attorney cues: "HOLD IT!", "OBJECTION!", dramatic camera zoom, judge gavel, and desk slams.
7. **Text-To-Speech Engine (`src/audio/tts_engine.js`)**:
   - Local Google Translate Hebrew speech synthesis with voice pitch selection per character (Yam, Invar, Judge, Liliya). Includes replay button (`#btnTtsReplay`).

---

## 10. Important Historical Decisions That Must NOT Be Undone

1. **No Refactoring to ES Modules**: Previous attempts broke `file://` execution.
2. **Never Overwrite Saved Ending Keys**: Keys in `localStorage["unlocked_endings"]` must match scene IDs.
3. **No TS Compilation**: Use JSDoc annotations only.
4. **Hebrew Dialogue Formatting**: RTL text formatting (`dir="rtl"`, Hebrew strings) is critical; never let LTR overrides flip Hebrew punctuation or phrasing.
5. **P5 Menu Navigation Keys**: Numbers `1`–`6` and Arrow/Enter keys are bound to the Persona 5 main menu for keyboard-only and laptop play.
6. **Mobile Touch Handling**: Single tap advances dialogue; dragging/swiping scrolls long text without advancing.

---

## 11. Known Fragile Areas / Unexpected Couplings

1. **Flexbox Scrolling in Modals (`#galleryModal`)**:
   - `#galleryBox` uses `display: flex; flex-direction: column; max-height: 80dvh`.
   - Any child elements that should not collapse (such as `#galleryHeader` and `#galleryTabsContainer`) **MUST have `flex-shrink: 0`**.
   - `#galleryTableContainer` must have `min-height: 0; flex-shrink: 1; overflow-y: auto;` or rendering 132 rows will collapse header tabs.
2. **Dialogue Box Scrolling (`#dialogBox` / `#text`)**:
   - `#dialogBox` has `overflow: hidden;` to contain its border-radius and prevent page-level scrollbars.
   - `#text` has `flex: 1 1 0; min-height: 0; overflow-y: auto; touch-action: pan-y; -webkit-overflow-scrolling: touch;`.
   - If `#choices` is active, it floats absolute above `#dialogBox` (`bottom: calc(34dvh + 36px)`). Its container must not intercept pointer events when empty.
3. **Touch vs Click on `#dialogBox`**:
   - `dialogBox.onclick` will fire on mobile when finishing a scroll drag unless touch movements (`ontouchstart`, `ontouchmove`, `ontouchend`) track delta distance and suppress clicks if movement > 8px.
4. **Typewriter Effect & `scrollTop`**:
   - Rapidly clicking to reveal full text triggers `clearTimeout(typewriterTimer)` and sets `text.textContent = currentFullText`.

---

## 12. Current Coding Guidelines

Refer strictly to [`.agents/AGENTS.md`](file:///c:/Users/User/Desktop/Bot%20discord/game/yam_date_simulator/.agents/AGENTS.md):

- **FAST PATCH MODE (Default)**:
  - Modify 1–3 files maximum.
  - No repository-wide scans or exploratory reads.
  - Search only for exact function names, DOM IDs, or CSS classes.
  - Patch immediately upon finding the cause; test only the affected feature.
- **SAFE STRUCTURAL MODE**:
  - Reserved strictly for file moves, structural refactors, or shared state redesigns.
  - Requires inspecting dependencies, `index.html` loading order, and `sw.js`.

---

## 13. Current Game-Design Problems

1. **Long Dialogue Mobile vs Desktop Ergonomics**:
   - Long narrative scenes (e.g. `room_intro_normal`, `room_intro_force`, court witness cross-examinations) have substantial text.
   - On small screens (under 480px), viewport height (`34dvh`) provides roughly 130–160px for text, requiring vertical scrolling.
   - Players expect to scroll without accidentally advancing dialogue or triggering choices.
2. **Choice List Overflow**:
   - Scenes with 5+ choices (e.g. `room_intro_normal`) must scroll within `#choices` without covering top menu toggles (`⚙️`, `🖥️`, `🏆`).

---

## 14. Recent Refactors Already Completed

1. **Folder Reorganization**:
   - All flat scripts moved to `src/core/`, `src/story/`, `src/games/`, `src/audio/`, `src/effects/`, `src/input/`.
   - Script paths updated across `index.html` and `sw.js`.
2. **Ending Registry & Categorization**:
   - Created `src/story/endings/ending_registry.js` classifying all 136 endings into 8 categories.
   - Built category tabs in `#galleryModal` with dynamic titles and counters.
   - Updated speaker label in VN HUD to display code + clean title.
3. **Persona 5 Main Menu Integration**:
   - Implemented `#p5MainMenuContainer` with shards, halftones, angled typography, and hotkeys 1–6.
4. **Offline PWA Validation**:
   - Service worker cache version bumped; full offline loading verified over HTTP.

---

## 15. Current Open Tasks / Next Priorities

1. **Dialogue & Choice Scrolling Fine-Tuning**: Ensure seamless mouse-wheel, trackpad, and touch-drag scrolling across all mobile and desktop browsers for long dialogue passages.
2. **Courtroom Chapter 2 Sound Tuning**: Ensure Ace Attorney SFX volumes are balanced with dialogue TTS.
3. **Gallery Search / Filter Enhancement (Optional Future)**: Allow text-searching ending titles within the gallery.

---

## 16. Bugs Currently Being Worked On

- **Dialogue Box Scrolling Inconsistency**:
  - When dialogue text overflows `#text`, ensure wheel/touch gestures scroll the container immediately without conflict with `#dialogBox` click-to-advance listeners.

---

## 17. Things That Were Tried and Rejected

- **ES Modules (`<script type="module">`)**: Attempted and rejected because browsers block cross-origin requests on `file://`.
- **Replacing Context Brokers with Custom Events**: Rejected because direct global wrapper references (`battleCtx`, `baldiCtx`, `pregCtx`) are faster, simpler, and easier to debug locally.
- **Rewriting Ending Numbers to Global Linear Index (1–132)**: Rejected because it breaks save file continuity and confuses players. The categorized system (`M01-M14`, `S01-S05`, `J01-J82`) was adopted instead.
- **Inventing Subtitles/Descriptions for Endings**: Rejected by the user. The registry contains metadata only (`code`, `category`, `title`, `hidden`).

---

## 18. Important Naming Conventions and Scene Keys

- **Main Menu**: `start` / `main_menu`
- **Endings**: `end_*` (e.g. `end_true_love`, `end_petah_tikva`, `end_boss_victory_force`)
- **Court Saga**: `court_*` (e.g. `court_intro`, `court_cross_exam`, `court_verdict_good`)
- **Polish Chocolate DLC**: `polish_chocolate_*`
- **Combat Minigames**: `battle_*`, `baldi_*`, `slender_*`, `preg_*`, `wii_pulse_*`, `yam_shadow_*`

---

## 19. Compatibility Requirements

- **Local `file://`**: Opening `index.html` directly from disk must remain 100% functional.
- **HTTP / HTTPS / PWA**: Full offline caching via Service Worker.
- **Desktop Browsers**: Chrome, Edge, Firefox, Safari (mouse wheel, keyboard navigation, high-DPI).
- **Mobile Browsers**: Android Chrome, iOS Safari (dynamic viewport units `dvh`, touch scrolling, touch tap-to-advance).
- **Hebrew Keyboard Layouts**: Keyboard controls use `event.code` (physical key codes like `KeyW`, `Space`, `Enter`) so Hebrew keyboard mode never breaks controls.

---

## 20. Essential Rules for Any New AI Agent

1. **Do not perform broad repo scans for small fixes.** Trust the structure outlined here.
2. **Never change Hebrew dialogue text, jokes, or scene flow** unless the user explicitly commands it.
3. **Do not add build steps, TypeScript syntax, or npm dependencies.**
4. **Whenever you edit CSS or engine logic, ensure `file://` compatibility is not broken.**
5. **Always respect the FAST PATCH MODE principle**: identify the root cause quickly, apply the minimal safe patch, verify, and report concisely.
