// --- Slender 3D ASCII Raycast Renderer ---

window.slenderRenderer = (function() {
  let active = false;
  let animId = null;
  let preElement = null;

  const COLS = 80;
  const ROWS = 30;

  // Monospace ASCII billboard templates for 3D elements
  const SPRITE_TEMPLATES = {
    page: [
      " .-. ",
      "|VN |",
      " `-' "
    ],
    battery: [
      " [🔋] ",
      " [BAT] "
    ],
    invar: [
      " [INVAR] ",
      "  [🖥️]   "
    ],
    yam: [
      "  .-\"-.  ",
      " / _ _ \\ ",
      "| (o.o) |",
      "|  \\=/  |",
      "  m   m  "
    ]
  };

  function start() {
    active = true;
    preElement = document.getElementById("slenderPre");
    animId = requestAnimationFrame(renderLoop);
  }

  function stop() {
    active = false;
    cancelAnimationFrame(animId);
  }

  function renderLoop() {
    if (!active) return;
    drawFrame();
    animId = requestAnimationFrame(renderLoop);
  }

  function drawFrame() {
    if (!preElement) return;

    const ctx = window.slenderCtx;
    if (!ctx || !ctx.active) return;

    // 1. Initialize screen grid with empty space
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
    const depthBuffer = Array(COLS).fill(Infinity);

    // Calculate dynamic flashlight visibility range based on battery
    const maxFlashlightRange = ctx.flashlightOn ? (4.2 * (ctx.battery / 100)) + 1.3 : 0.75;

    // 2. Cast 80 rays (one for each horizontal screen column)
    const fov = ctx.fov;
    const halfFov = fov / 2;

    for (let c = 0; c < COLS; c++) {
      const rayAngle = ctx.pa - halfFov + (c / COLS) * fov;
      const cosAngle = Math.cos(rayAngle);
      const sinAngle = Math.sin(rayAngle);

      let rayDist = 0;
      let hitWall = false;
      const step = 0.045;
      const maxDist = 12.0;

      while (!hitWall && rayDist < maxDist) {
        rayDist += step;
        const mapX = Math.floor(ctx.px + cosAngle * rayDist);
        const mapY = Math.floor(ctx.py + sinAngle * rayDist);

        if (mapX < 0 || mapX >= 12 || mapY < 0 || mapY >= 12) {
          hitWall = true;
          rayDist = maxDist;
          break;
        }

        if (ctx.map[mapY][mapX] > 0) {
          hitWall = true;
          break;
        }
      }

      // Correct fish-eye distortion
      const correctedDist = rayDist * Math.cos(rayAngle - ctx.pa);
      depthBuffer[c] = correctedDist;

      // Draw wall slice if within flashlight range
      if (correctedDist <= maxFlashlightRange) {
        const wallH = Math.min(ROWS, Math.floor(13 / correctedDist));
        const emptyH = Math.floor((ROWS - wallH) / 2);

        for (let r = 0; r < ROWS; r++) {
          if (r >= emptyH && r < emptyH + wallH) {
            // Wall character depth shading: closer = '@#', further = ':.'
            const wallChars = "@#8&o:*. ";
            const charIdx = Math.min(wallChars.length - 1, Math.floor(correctedDist * 1.45));
            grid[r][c] = wallChars[charIdx];
          } else if (r >= emptyH + wallH) {
            // Floor
            grid[r][c] = '.';
          }
        }
      }
    }

    // 3. Project 3D Billboard Sprites (Pages, Batteries, Yam, Invar)
    const activeSprites = ctx.sprites
      .filter(s => !s.collected)
      .map(s => {
        const dist = Math.hypot(ctx.px - s.x, ctx.py - s.y);
        return { ...s, dist };
      })
      .sort((a, b) => b.dist - a.dist);

    activeSprites.forEach(sprite => {
      // Ignore if outside active flashlight range
      if (sprite.dist > maxFlashlightRange) return;

      const sx = sprite.x - ctx.px;
      const sy = sprite.y - ctx.py;

      // Rotate coordinates relative to player direction
      const rotX = sx * Math.cos(-ctx.pa) - sy * Math.sin(-ctx.pa);
      const rotY = sx * Math.sin(-ctx.pa) + sy * Math.cos(-ctx.pa);

      if (rotY < 0.1) return; // behind screen

      const spriteCol = Math.floor((COLS / 2) * (1 + rotX / rotY));
      const spriteScale = Math.min(ROWS, Math.floor(14 / rotY));

      if (spriteScale <= 0) return;

      const template = SPRITE_TEMPLATES[sprite.type];
      if (!template) return;

      const tempRows = template.length;
      const tempCols = template[0].length;

      // Loop through sprite billboard cells
      for (let rOffset = 0; rOffset < spriteScale; rOffset++) {
        const rIndex = Math.floor((rOffset / spriteScale) * tempRows);
        const screenRow = Math.floor(ROWS / 2 - spriteScale / 2 + rOffset);

        if (screenRow < 0 || screenRow >= ROWS) continue;

        for (let cOffset = 0; cOffset < spriteScale; cOffset++) {
          const cIndex = Math.floor((cOffset / spriteScale) * tempCols);
          const screenCol = Math.floor(spriteCol - spriteScale / 2 + cOffset);

          if (screenCol < 0 || screenCol >= COLS) continue;

          // Check depth buffer (painter's algorithm overlap)
          if (rotY < depthBuffer[screenCol]) {
            const char = template[rIndex][cIndex];
            if (char && char !== ' ') {
              grid[screenRow][screenCol] = char;
            }
          }
        }
      }
    });

    // 4. Overlay Static Noise
    if (ctx.staticRatio > 0.0) {
      const noiseChars = "%#@?10*+=:";
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (Math.random() < ctx.staticRatio) {
            grid[r][c] = noiseChars[Math.floor(Math.random() * noiseChars.length)];
          }
        }
      }
    }

    // 5. Convert screen grid buffer to pre text element
    let finalStr = "";
    for (let r = 0; r < ROWS; r++) {
      finalStr += grid[r].join("") + "\n";
    }

    preElement.textContent = finalStr;
  }

  return {
    start: start,
    stop: stop
  };
})();
