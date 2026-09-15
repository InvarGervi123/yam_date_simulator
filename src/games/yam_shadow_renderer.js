// --- Yam Shadow Battle Renderer Engine (Step 5: SHADOW RAIN) ---

let animationFrameId = null;
let lastTime = 0;
let keys = { up: false, down: false, left: false, right: false };

// Fixed Logical Arena Coordinates
const LOGICAL_ARENA = {
  width: 600,
  height: 400
};

// Normalized Quadrant Coordinates (0.0 to 1.0)
const QUADRANT_NORMALIZED = {
  'top-left': { normX: 55 / 600, normY: 135 / 400 },
  'top-right': { normX: 545 / 600, normY: 135 / 400 },
  'bottom-left': { normX: 55 / 600, normY: 350 / 400 },
  'bottom-right': { normX: 545 / 600, normY: 350 / 400 }
};

// Player position in logical arena space
const playerLogical = { x: 300, y: 340, radius: 8, speed: 220 };

// Invar state stored by logical quadrant ID
const invarLogical = {
  currentQuadrant: 'bottom-right',
  width: 24,
  height: 24
};

// Teleport Selection & FX State
const teleportState = {
  selecting: false,
  highlightedQuadrant: null,
  charging: false,
  disappeared: false,
  shockwave: null // { normX, normY, radius, alpha }
};

// Projectile State
let bullets = [];

// --- Pre-cached Path2D Silhouettes ---
let yamPath = null;
let echoPath = null;
let invarPath = null;

function initPath2DCaches() {
  if (typeof Path2D === 'undefined') return;

  // 1. Yam Hooded Figure Silhouette (centered at 0,0; ~70x95px)
  yamPath = new Path2D();
  yamPath.moveTo(0, -40);
  yamPath.bezierCurveTo(-20, -40, -25, -22, -22, -5);
  yamPath.bezierCurveTo(-34, 10, -38, 32, -32, 42);
  yamPath.lineTo(32, 42);
  yamPath.bezierCurveTo(38, 32, 34, 10, 22, -5);
  yamPath.bezierCurveTo(25, -22, 20, -40, 0, -40);
  yamPath.closePath();

  // 2. THE ECHO Shadow Silhouette (larger, ~90x115px)
  echoPath = new Path2D();
  echoPath.moveTo(0, -52);
  echoPath.bezierCurveTo(-26, -52, -36, -30, -32, -5);
  echoPath.bezierCurveTo(-46, 14, -52, 42, -42, 55);
  echoPath.lineTo(42, 55);
  echoPath.bezierCurveTo(52, 42, 46, 14, 32, -5);
  echoPath.bezierCurveTo(36, -30, 26, -52, 0, -52);
  echoPath.closePath();

  // 3. Invar Character Silhouette (centered at 0,0; ~22x28px)
  invarPath = new Path2D();
  invarPath.arc(0, -8, 6, 0, Math.PI * 2);
  invarPath.moveTo(-7, -1);
  invarPath.lineTo(7, -1);
  invarPath.lineTo(9, 13);
  invarPath.lineTo(-9, 13);
  invarPath.closePath();
}

initPath2DCaches();

// Dynamic Visual & VFX State
const vfxState = {
  slashTimer: 0,
  recoilX: 0,
  recoilY: 0,
  floatingText: null,
  echoLagX: 300,
  echoLagY: 55
};

function isReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function triggerFightVfx(damageAmount) {
  vfxState.slashTimer = 0.18;
  vfxState.recoilX = isReducedMotion() ? 2 : (Math.random() > 0.5 ? 1 : -1) * 9;
  vfxState.floatingText = {
    text: `-${damageAmount}`,
    x: 300,
    y: 75,
    alpha: 1.0,
    vy: -35
  };
}

window.triggerFightVfx = triggerFightVfx;

// Attack Phase Manager State
const attackCtx = {
  phase: 'none', // 'warning', 'active', 'cooling', 'none'
  phaseTimer: 0,
  spawnTimer: 0,
  currentVariation: 0, // 0: Straight, 1: Diagonal, 2: Safe Lane
  lastVariation: -1,
  safeLaneCenter: 300,
  safeLaneTarget: 300,
  diagonalDirection: 1,
  playerInvulnerableUntil: 0,
  invarInvulnerableUntil: 0
};

let activeTimeouts = [];

/**
 * Converts normalized logical coordinates to pixel coordinates for any canvas resolution.
 */
function toCanvasCoords(normX, normY, canvas) {
  const w = canvas ? canvas.width : LOGICAL_ARENA.width;
  const h = canvas ? canvas.height : LOGICAL_ARENA.height;
  return {
    x: normX * w,
    y: normY * h
  };
}

/**
 * Arrow-key 2D Grid Navigation between Quadrants (2x2 Grid)
 */
function navigateQuadrantGrid(currentQuad, dir) {
  const cur = currentQuad || 'top-left';
  if (dir === 'left') {
    if (cur === 'top-right') return 'top-left';
    if (cur === 'bottom-right') return 'bottom-left';
  } else if (dir === 'right') {
    if (cur === 'top-left') return 'top-right';
    if (cur === 'bottom-left') return 'bottom-right';
  } else if (dir === 'up') {
    if (cur === 'bottom-left') return 'top-left';
    if (cur === 'bottom-right') return 'top-right';
  } else if (dir === 'down') {
    if (cur === 'top-left') return 'bottom-left';
    if (cur === 'top-right') return 'bottom-right';
  }
  return cur;
}

function handleKeyDown(e) {
  if (!window.yamShadowCtx || !window.yamShadowCtx.active) return;

  const code = e.code;
  const key = e.key;

  // Toggle Teleport Mode with KeyT
  if (code === 'KeyT' || key === 't' || key === 'T' || key === 'א') {
    if (!teleportState.charging && !teleportState.disappeared) {
      toggleTeleportSelection();
    }
    return;
  }

  // Handle Teleport Selection Mode Inputs
  if (teleportState.selecting) {
    if (code === 'ArrowLeft' || code === 'KeyA' || key === 'ש') {
      teleportState.highlightedQuadrant = navigateQuadrantGrid(teleportState.highlightedQuadrant, 'left');
      updateMobileGridHighlight();
      return;
    }
    if (code === 'ArrowRight' || code === 'KeyD' || key === 'ג') {
      teleportState.highlightedQuadrant = navigateQuadrantGrid(teleportState.highlightedQuadrant, 'right');
      updateMobileGridHighlight();
      return;
    }
    if (code === 'ArrowUp' || code === 'KeyW' || key === 'ק') {
      teleportState.highlightedQuadrant = navigateQuadrantGrid(teleportState.highlightedQuadrant, 'up');
      updateMobileGridHighlight();
      return;
    }
    if (code === 'ArrowDown' || code === 'KeyS' || key === 'ד') {
      teleportState.highlightedQuadrant = navigateQuadrantGrid(teleportState.highlightedQuadrant, 'down');
      updateMobileGridHighlight();
      return;
    }

    if (code === 'Digit1' || key === '1') {
      teleportState.highlightedQuadrant = 'top-left';
      updateMobileGridHighlight();
      return;
    }
    if (code === 'Digit2' || key === '2') {
      teleportState.highlightedQuadrant = 'top-right';
      updateMobileGridHighlight();
      return;
    }
    if (code === 'Digit3' || key === '3') {
      teleportState.highlightedQuadrant = 'bottom-left';
      updateMobileGridHighlight();
      return;
    }
    if (code === 'Digit4' || key === '4') {
      teleportState.highlightedQuadrant = 'bottom-right';
      updateMobileGridHighlight();
      return;
    }

    if (code === 'Enter' || code === 'Space') {
      if (teleportState.highlightedQuadrant && teleportState.highlightedQuadrant !== invarLogical.currentQuadrant) {
        confirmTeleport(teleportState.highlightedQuadrant);
      }
      return;
    }
    if (code === 'Escape' || code === 'Backspace') {
      cancelTeleportSelection();
      return;
    }
  }

  // Normal Player WASD / Arrow Movement
  if (code === 'KeyW' || code === 'ArrowUp' || key === 'ק' || key === 'w' || key === 'W') keys.up = true;
  if (code === 'KeyS' || code === 'ArrowDown' || key === 'ד' || key === 's' || key === 'S') keys.down = true;
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'ש' || key === 'a' || key === 'A') keys.left = true;
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'ג' || key === 'd' || key === 'D') keys.right = true;
}

function handleKeyUp(e) {
  const code = e.code;
  const key = e.key;
  if (code === 'KeyW' || code === 'ArrowUp' || key === 'ק' || key === 'w' || key === 'W') keys.up = false;
  if (code === 'KeyS' || code === 'ArrowDown' || key === 'ד' || key === 's' || key === 'S') keys.down = false;
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'ש' || key === 'a' || key === 'A') keys.left = false;
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'ג' || key === 'd' || key === 'D') keys.right = false;
}

function toggleTeleportSelection() {
  if (teleportState.selecting) {
    cancelTeleportSelection();
  } else {
    teleportState.selecting = true;
    teleportState.highlightedQuadrant = invarLogical.currentQuadrant === 'top-left' ? 'top-right' : 'top-left';
    const grid = document.getElementById('yamShadowTeleportGrid');
    if (grid) grid.style.display = 'grid';
    updateMobileGridHighlight();
  }
}

function cancelTeleportSelection() {
  teleportState.selecting = false;
  teleportState.highlightedQuadrant = null;
  const grid = document.getElementById('yamShadowTeleportGrid');
  if (grid) grid.style.display = 'none';
}

function updateMobileGridHighlight() {
  const buttons = document.querySelectorAll('#yamShadowTeleportGrid button');
  buttons.forEach((btn) => {
    const quad = btn.getAttribute('data-quadrant');
    if (quad === invarLogical.currentQuadrant) {
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      btn.style.borderColor = '#555';
    } else if (quad === teleportState.highlightedQuadrant) {
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.style.borderColor = '#f1c40f';
      btn.style.boxShadow = '0 0 10px #f1c40f';
    } else {
      btn.style.opacity = '0.8';
      btn.style.cursor = 'pointer';
      btn.style.borderColor = '#3498db';
      btn.style.boxShadow = 'none';
    }
  });
}

function confirmTeleport(targetQuadrant) {
  if (!targetQuadrant || targetQuadrant === invarLogical.currentQuadrant) return;
  if (!window.yamShadowCtx || !window.yamShadowCtx.active) return;

  cancelTeleportSelection();

  // Advance turn if in player mode
  if (window.yamShadowCtx.turnState === 'player') {
    if (typeof window.advanceToEnemyTurn === 'function') {
      window.advanceToEnemyTurn("ינוור משתגר!");
    }
  }

  // Phase 1: Charge Indicator (0.2s)
  teleportState.charging = true;

  const t1 = setTimeout(() => {
    // Phase 2: Invar Disappears (0.15s)
    teleportState.charging = false;
    teleportState.disappeared = true;

    const t2 = setTimeout(() => {
      // Phase 3: Reappear at target & Shockwave
      invarLogical.currentQuadrant = targetQuadrant;
      if (window.yamShadowCtx) {
        window.yamShadowCtx.invarPosition = targetQuadrant;
      }

      const targetNorm = QUADRANT_NORMALIZED[targetQuadrant];
      teleportState.disappeared = false;
      teleportState.shockwave = { normX: targetNorm.normX, normY: targetNorm.normY, radius: 5, maxRadius: 55, alpha: 1.0 };
    }, 150);

    activeTimeouts.push(t2);
  }, 200);

  activeTimeouts.push(t1);
}

/**
 * Selects next attack variation randomly without consecutive repeats.
 */
function chooseNextVariation() {
  let nextVar = attackCtx.lastVariation;
  while (nextVar === attackCtx.lastVariation) {
    nextVar = Math.floor(Math.random() * 3);
  }
  attackCtx.lastVariation = nextVar;
  attackCtx.currentVariation = nextVar;

  if (nextVar === 2) {
    attackCtx.safeLaneCenter = 300;
    attackCtx.safeLaneTarget = Math.random() * 400 + 100;
  }
}

/**
 * Triggers the warning phase for a new attack wave.
 */
function triggerShadowRainWave() {
  if (!window.yamShadowCtx || !window.yamShadowCtx.active) return;

  chooseNextVariation();
  attackCtx.phase = 'warning';
  attackCtx.phaseTimer = 1.5; // 1.5s warning
  attackCtx.spawnTimer = 0;
  bullets = [];
}

/**
 * Starts the requestAnimationFrame rendering loop for Yam Shadow Battle.
 */
function startYamShadowRenderer(canvas) {
  stopYamShadowRenderer(); // Ensure cleanup of previous loop

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Reset logical positions & states
  playerLogical.x = 300;
  playerLogical.y = 340;
  invarLogical.currentQuadrant = 'bottom-right';
  keys = { up: false, down: false, left: false, right: false };

  teleportState.selecting = false;
  teleportState.highlightedQuadrant = null;
  teleportState.charging = false;
  teleportState.disappeared = false;
  teleportState.shockwave = null;
  bullets = [];

  // Reset Attack Director
  attackCtx.phase = 'none';
  attackCtx.phaseTimer = 0; // Wait for player turn menu selection
  attackCtx.lastVariation = -1;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Bind HUD Teleport button & Mobile grid buttons
  const tpBtn = document.getElementById('yamShadowTeleportBtn');
  if (tpBtn) {
    tpBtn.onclick = toggleTeleportSelection;
  }

  const gridButtons = document.querySelectorAll('#yamShadowTeleportGrid button');
  gridButtons.forEach((btn) => {
    btn.onclick = () => {
      const quad = btn.getAttribute('data-quadrant');
      if (quad && quad !== invarLogical.currentQuadrant) {
        confirmTeleport(quad);
      }
    };
  });

  lastTime = performance.now();

  function renderLoop(currentTime) {
    if (!window.yamShadowCtx || !window.yamShadowCtx.active) {
      stopYamShadowRenderer();
      return;
    }

    const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // Clamp large deltaTimes (max 100ms)
    lastTime = currentTime;

    const width = canvas.width;
    const height = canvas.height;

    // --- Update Player Logical Position ---
    if (!teleportState.selecting) {
      let moveX = 0;
      let moveY = 0;
      if (keys.up) moveY -= 1;
      if (keys.down) moveY += 1;
      if (keys.left) moveX -= 1;
      if (keys.right) moveX += 1;

      if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.7071;
        moveY *= 0.7071;
      }

      playerLogical.x += moveX * playerLogical.speed * dt;
      playerLogical.y += moveY * playerLogical.speed * dt;

      playerLogical.x = Math.max(15, Math.min(LOGICAL_ARENA.width - 15, playerLogical.x));
      playerLogical.y = Math.max(110, Math.min(LOGICAL_ARENA.height - 15, playerLogical.y));
    }

    const playerCanvas = toCanvasCoords(playerLogical.x / LOGICAL_ARENA.width, playerLogical.y / LOGICAL_ARENA.height, canvas);
    const currentNorm = QUADRANT_NORMALIZED[invarLogical.currentQuadrant];
    const invarCanvas = toCanvasCoords(currentNorm.normX, currentNorm.normY, canvas);
    const invarLogicalX = currentNorm.normX * LOGICAL_ARENA.width;
    const invarLogicalY = currentNorm.normY * LOGICAL_ARENA.height;

    // --- Attack Director State Machine ---
    if (attackCtx.phaseTimer > 0) {
      attackCtx.phaseTimer -= dt;
      if (attackCtx.phaseTimer <= 0) {
        if (attackCtx.phase === 'warning') {
          attackCtx.phase = 'active';
          attackCtx.phaseTimer = 7.0; // 7.0s duration
        } else if (attackCtx.phase === 'active') {
          attackCtx.phase = 'cooling';
          attackCtx.phaseTimer = 2.0; // 2.0s cleanup window
        } else if (attackCtx.phase === 'cooling') {
          bullets = []; // wipe leftovers
          attackCtx.phase = 'none';
          attackCtx.phaseTimer = 0;
          if (typeof window.onEnemyAttackWaveComplete === 'function') {
            window.onEnemyAttackWaveComplete();
          }
        }
      }
    }

    // --- Spawn Bullets ---
    if (attackCtx.phase === 'active') {
      attackCtx.spawnTimer -= dt;
      if (attackCtx.spawnTimer <= 0) {
        if (attackCtx.currentVariation === 0) {
          // Straight Rain: 2 vertical bullets per wave
          attackCtx.spawnTimer = 0.14;
          const colCount = 8;
          const colWidth = LOGICAL_ARENA.width / colCount;
          const safeCol1 = Math.floor(Math.random() * colCount);
          const safeCol2 = (safeCol1 + 4) % colCount;

          for (let i = 0; i < 2; i++) {
            let col = Math.floor(Math.random() * colCount);
            if (col !== safeCol1 && col !== safeCol2) {
              const xPos = col * colWidth + colWidth / 2;
              bullets.push({ x: xPos, y: 100, vx: 0, vy: 220, radius: 6 });
            }
          }
        } else if (attackCtx.currentVariation === 1) {
          // Diagonal Rain: falling at an angle
          attackCtx.spawnTimer = 0.16;
          for (let i = 0; i < 2; i++) {
            const xPos = Math.random() * LOGICAL_ARENA.width;
            bullets.push({
              x: xPos,
              y: 100,
              vx: attackCtx.diagonalDirection * 75,
              vy: 190,
              radius: 6
            });
          }
          // Alternate direction wave step
          if (Math.random() < 0.15) {
            attackCtx.diagonalDirection *= -1;
          }
        } else if (attackCtx.currentVariation === 2) {
          // Moving Safe Lane
          attackCtx.spawnTimer = 0.08;

          // Move Safe Lane center towards target
          const dist = attackCtx.safeLaneTarget - attackCtx.safeLaneCenter;
          if (Math.abs(dist) < 15) {
            attackCtx.safeLaneTarget = Math.random() * (LOGICAL_ARENA.width - 200) + 100;
          }
          attackCtx.safeLaneCenter += Math.sign(dist) * 125 * dt;

          const xPos = Math.random() * LOGICAL_ARENA.width;
          // Spawn bullet ONLY if it falls outside the safe lane
          if (Math.abs(xPos - attackCtx.safeLaneCenter) > 65) {
            bullets.push({ x: xPos, y: 100, vx: 0, vy: 240, radius: 5.5 });
          }
        }
      }
    }

    // --- Update Projectiles & Check Collisions ---
    bullets = bullets.filter((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Bound clearing
      if (b.y > LOGICAL_ARENA.height || b.y < 95 || b.x < 0 || b.x > LOGICAL_ARENA.width) {
        return false;
      }

      // 1. Collision check: Player Heart
      const dxPlayer = b.x - playerLogical.x;
      const dyPlayer = b.y - playerLogical.y;
      const distPlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
      const playerHitbox = (playerLogical.radius + b.radius) * 0.7;

      if (distPlayer < playerHitbox) {
        if (currentTime > attackCtx.playerInvulnerableUntil) {
          attackCtx.playerInvulnerableUntil = currentTime + 1000; // 1s invuln
          if (window.yamShadowCtx) {
            window.yamShadowCtx.playerHp = Math.max(0, window.yamShadowCtx.playerHp - 10);
            if (typeof window.updateYamShadowHud === 'function') {
              window.updateYamShadowHud();
            }
          }
        }
      }

      // 2. Collision check: Invar Node
      if (!teleportState.disappeared && !teleportState.charging) {
        const dxInvar = b.x - invarLogicalX;
        const dyInvar = b.y - invarLogicalY;
        const distInvar = Math.sqrt(dxInvar * dxInvar + dyInvar * dyInvar);
        const invarHitbox = (12 + b.radius) * 0.7;

        if (distInvar < invarHitbox) {
          if (currentTime > attackCtx.invarInvulnerableUntil) {
            attackCtx.invarInvulnerableUntil = currentTime + 1000; // 1s invuln
            if (window.yamShadowCtx) {
              window.yamShadowCtx.invarHp = Math.max(0, window.yamShadowCtx.invarHp - 10);
              if (typeof window.updateYamShadowHud === 'function') {
                window.updateYamShadowHud();
              }
            }
          }
        }
      }

      return true;
    });

    // Update Shockwave
    if (teleportState.shockwave) {
      teleportState.shockwave.radius += 120 * dt;
      teleportState.shockwave.alpha -= 1.8 * dt;
      if (teleportState.shockwave.alpha <= 0 || teleportState.shockwave.radius >= teleportState.shockwave.maxRadius) {
        teleportState.shockwave = null;
      }
    }

    // --- Draw Scene ---
    ctx.clearRect(0, 0, width, height);

    // 1. Background Void
    ctx.fillStyle = '#0a0514';
    ctx.fillRect(0, 0, width, height);

    // 2. Yam Boss & Echo Shadow
    const baseYamX = width / 2;
    const baseYamY = 55 * (height / LOGICAL_ARENA.height);
    const reducedMotion = isReducedMotion();

    // Recoil decay
    if (vfxState.recoilX !== 0) vfxState.recoilX *= 0.82;
    if (Math.abs(vfxState.recoilX) < 0.2) vfxState.recoilX = 0;

    const floatOffsetY = reducedMotion ? 0 : Math.sin(currentTime * 0.002) * 5;
    const yamX = baseYamX + vfxState.recoilX;
    const yamY = baseYamY + floatOffsetY;

    // THE ECHO shadow position (lagged follower)
    const targetEchoX = yamX + 16;
    const targetEchoY = yamY + 12;
    if (reducedMotion) {
      vfxState.echoLagX = targetEchoX;
      vfxState.echoLagY = targetEchoY;
    } else {
      vfxState.echoLagX += (targetEchoX - vfxState.echoLagX) * 0.1;
      vfxState.echoLagY += (targetEchoY - vfxState.echoLagY) * 0.1;
    }

    // A. Draw THE ECHO Shadow Silhouette
    ctx.save();
    ctx.translate(vfxState.echoLagX, vfxState.echoLagY);
    ctx.fillStyle = 'rgba(74, 20, 140, 0.45)';
    if (echoPath) ctx.fill(echoPath);
    ctx.strokeStyle = 'rgba(142, 68, 173, 0.6)';
    ctx.lineWidth = 2;
    if (echoPath) ctx.stroke(echoPath);
    ctx.restore();

    // B. Draw Yam Hooded Silhouette
    ctx.save();
    ctx.translate(yamX, yamY);
    ctx.fillStyle = '#120a24';
    if (yamPath) ctx.fill(yamPath);
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = 2;
    if (yamPath) ctx.stroke(yamPath);

    // Glowing Eyes
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(-8, -12, 2.5, 0, Math.PI * 2);
    ctx.arc(8, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 12px Rubik, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('YAM & THE ECHO', yamX, yamY + 52);

    // 3. Divider Line
    ctx.strokeStyle = 'rgba(155, 89, 182, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 95 * (height / LOGICAL_ARENA.height));
    ctx.lineTo(width - 10, 95 * (height / LOGICAL_ARENA.height));
    ctx.stroke();

    // 4. Draw Warning Alert Banner
    if (attackCtx.phase === 'warning') {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.15)';
      ctx.fillRect(10, 110, width - 20, 40);

      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 14px Rubik, sans-serif';
      ctx.textAlign = 'center';
      const pulse = Math.sin(currentTime * 0.015) > 0;
      ctx.fillText(pulse ? '⚠️ WARNING: SHADOW RAIN! ⚠️' : '   WARNING: SHADOW RAIN!   ', width / 2, 135);
    }

    // 5. Draw Quadrant Selection Markers
    for (const quadKey in QUADRANT_NORMALIZED) {
      const norm = QUADRANT_NORMALIZED[quadKey];
      const pos = toCanvasCoords(norm.normX, norm.normY, canvas);
      const isCurrent = quadKey === invarLogical.currentQuadrant;
      const isHighlighted = quadKey === teleportState.highlightedQuadrant;

      if (teleportState.selecting) {
        ctx.strokeStyle = isHighlighted ? '#f1c40f' : (isCurrent ? '#555' : 'rgba(52, 152, 219, 0.5)');
        ctx.lineWidth = isHighlighted ? 3 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(pos.x - 18, pos.y - 18, 36, 36);
        ctx.setLineDash([]);
      }
    }

    // 6. Draw Projectiles
    ctx.fillStyle = '#9b59b6';
    ctx.shadowColor = '#8e44ad';
    ctx.shadowBlur = 6;
    for (const b of bullets) {
      const bCanvas = toCanvasCoords(b.x / LOGICAL_ARENA.width, b.y / LOGICAL_ARENA.height, canvas);
      ctx.beginPath();
      ctx.arc(bCanvas.x, bCanvas.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 7. Draw Invar Character Silhouette
    if (!teleportState.disappeared) {
      const currentNorm = QUADRANT_NORMALIZED[invarLogical.currentQuadrant];
      const invarCanvas = toCanvasCoords(currentNorm.normX, currentNorm.normY, canvas);

      const isInvuln = currentTime < attackCtx.invarInvulnerableUntil;
      const flicker = isInvuln && !reducedMotion && Math.floor(currentTime / 50) % 2 === 0;

      if (!flicker) {
        ctx.save();
        ctx.translate(invarCanvas.x, invarCanvas.y);
        ctx.fillStyle = teleportState.charging ? '#f39c12' : '#1e3799';
        if (invarPath) ctx.fill(invarPath);
        ctx.strokeStyle = teleportState.charging ? '#f1c40f' : '#38ada9';
        ctx.lineWidth = 2;
        if (invarPath) ctx.stroke(invarPath);

        // Glowing Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(teleportState.charging ? '⚡ CHARGING' : 'INVAR', 0, 22);
        ctx.restore();
      }
    }

    // 8. Draw Landing Shockwave
    if (teleportState.shockwave) {
      const sw = teleportState.shockwave;
      const swCanvas = toCanvasCoords(sw.normX, sw.normY, canvas);
      ctx.strokeStyle = `rgba(52, 152, 219, ${Math.max(0, sw.alpha)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(swCanvas.x, swCanvas.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 9. Draw Player Heart (with invulnerability flicker)
    const isPlayerInvuln = currentTime < attackCtx.playerInvulnerableUntil;
    const playerFlicker = isPlayerInvuln && !reducedMotion && Math.floor(currentTime / 50) % 2 === 0;

    const px = playerCanvas.x;
    const py = playerCanvas.y;

    if (!playerFlicker) {
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(px - 4, py - 4, 5, Math.PI, 0, false);
      ctx.arc(px + 4, py - 4, 5, Math.PI, 0, false);
      ctx.lineTo(px, py + 7);
      ctx.closePath();
      ctx.fill();
    }

    // 10. Draw Healing Active Ring Effect
    const ctxState = window.yamShadowCtx;
    if (ctxState && ctxState.healActiveEffect) {
      const hfx = ctxState.healActiveEffect;
      hfx.timer -= dt;

      const progress = (0.4 - hfx.timer) / 0.4;
      ctx.strokeStyle = `rgba(46, 204, 113, ${Math.max(0, 1 - progress)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py, 10 + progress * 35, 0, Math.PI * 2);
      ctx.stroke();

      if (hfx.timer <= 0) {
        ctxState.healActiveEffect = null;
      }
    }

    // 11. Draw Attack Slash VFX Overlay
    if (vfxState.slashTimer > 0) {
      vfxState.slashTimer -= dt;
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(yamX - 35, yamY - 30);
      ctx.lineTo(yamX + 35, yamY + 30);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(yamX - 30, yamY - 25);
      ctx.lineTo(yamX + 30, yamY + 25);
      ctx.stroke();
    }

    // 12. Draw Floating Damage Text VFX Overlay
    if (vfxState.floatingText) {
      const ft = vfxState.floatingText;
      ft.y += ft.vy * dt;
      ft.alpha -= 1.4 * dt;

      if (ft.alpha > 0) {
        ctx.fillStyle = `rgba(231, 76, 60, ${Math.max(0, ft.alpha)})`;
        ctx.font = 'bold 18px Rubik, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
      } else {
        vfxState.floatingText = null;
      }
    }

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  animationFrameId = requestAnimationFrame(renderLoop);
}

/**
 * Cancels the render loop and removes event listeners.
 */
function stopYamShadowRenderer() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];

  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  keys = { up: false, down: false, left: false, right: false };

  cancelTeleportSelection();
  teleportState.charging = false;
  teleportState.disappeared = false;
  teleportState.shockwave = null;
  bullets = [];
  attackCtx.phase = 'none';
}

window.startYamShadowRenderer = startYamShadowRenderer;
window.stopYamShadowRenderer = stopYamShadowRenderer;
window.clearShadowRainProjectiles = () => { bullets = []; };
window.triggerShadowRainWave = triggerShadowRainWave;
