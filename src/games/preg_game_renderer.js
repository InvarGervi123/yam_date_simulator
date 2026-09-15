// --- Space VR Pregnancy Minigame: Real-Time Frame Renderer & Particles Engine ---

(function() {
  // Global state context bridge (shared between preg_game.js and preg_game_renderer.js)
  /**
   * @typedef {Object} PregCtx
   * @property {number} playerHp - Player health points (0 to 100).
   * @property {number} bossHp - Boss Yam health points (0 to 200).
   * @property {boolean} isGameOver - Flag indicating if the fight ended.
   * @property {number} phase - Boss phase (1 = normal, 2 = cosmic fury).
   * @property {boolean} isPhaseTransitioning - Flag if transitioning to Phase 2.
   * @property {string} playerStance - Player defense stance ("ready", "dodge", "exhausted").
   * @property {string} bossState - Current boss combat state ("idle", "preparing", "lunging").
   * @property {number} stateTimer - Timer tracker for current combat states.
   * @property {number} attackCooldown - Cool down time for the player's basic slash.
   * @property {number} playerStamina - Tension/stamina energy pool (0 to 100).
   * @property {boolean} isGasping - State if player runs out of stamina and gasps for air.
   * @property {number} gaspTimer - gasp fatigue countdown.
   * @property {number} comboCount - Active combat slash chain tracker.
   * @property {number} recipeProgress - Correct keystrokes in active combo sequence recipe.
   * @property {number} healFreezeTimer - Freeze cooldown preventing Yam from healing.
   * @property {Array<string>} currentRecipe - Active key combo requirements (e.g. ['W', 'S', 'W']).
   * @property {Object} keysPressed - Dictionary of actively held keyboard keys.
   * @property {Array<Object>} particles - Active 3D background cosmic space debris.
   * @property {number} lastParticleSpawn - Timestamp of last generated star particle.
   * @property {number} temporaryHitBlur - CSS blur intensity filter in pixels.
   */
  window.pregCtx = {
    playerHp: 100,
    bossHp: 100,
    isGameOver: false,
    phase: 1,
    isPhaseTransitioning: false,
    playerStance: "ready",
    bossState: "idle",
    stateTimer: 0,
    attackCooldown: 0,
    playerStamina: 100,
    isGasping: false,
    gaspTimer: 0,
    comboCount: 0,
    recipeProgress: 0,
    healFreezeTimer: 0,
    currentRecipe: [],
    keysPressed: {},
    particles: [],
    lastParticleSpawn: 0,
    temporaryHitBlur: 0,
    crouchY: 0,
    phase2OffsetX: 0,
    phase2OffsetY: 0,
    phantoms: []
  };

  let animationFrameId = null;
  let spaceAngle = 0;

  // DOM node caches for zero-overhead loop updates
  let space = null;
  let bossContainer = null;
  let yamImg = null;
  let particlesContainer = null;
  let bossHpBar = null;
  let playerHpBar = null;
  let playerHpText = null;
  let playerStaminaBar = null;
  let playerStaminaText = null;

  const particlePool = ["✨", "⭐", "☄️", "🤰", "🥐"];

  function spawnPregParticle() {
    if (!particlesContainer) return;
    const emoji = particlePool[Math.floor(Math.random() * particlePool.length)];
    const el = document.createElement("div");
    el.className = "preg-particle";
    el.textContent = emoji;
    particlesContainer.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    window.pregCtx.particles.push({
      element: el,
      angle: angle,
      z: -700,
      speedZ: Math.random() * 8 + 12
    });
  }

  function updatePregParticles() {
    if (!particlesContainer) return;
    const ctx = window.pregCtx;
    const spawnRate = ctx.phase === 2 ? 100 : 250;
    if (Date.now() - ctx.lastParticleSpawn > spawnRate) {
      ctx.lastParticleSpawn = Date.now();
      spawnPregParticle();
    }

    for (let i = ctx.particles.length - 1; i >= 0; i--) {
      const p = ctx.particles[i];
      p.z += p.speedZ;

      if (p.z >= 0) {
        p.element.remove();
        ctx.particles.splice(i, 1);
      } else {
        const distanceRatio = (700 + p.z) * 0.9;
        const x = Math.cos(p.angle) * distanceRatio;
        const y = Math.sin(p.angle) * distanceRatio;
        p.element.style.transform = `translate3d(${x}px, ${y}px, ${p.z}px) rotate(${p.z * 0.4}deg)`;
        p.element.style.opacity = Math.min(1, (700 + p.z) / 250);
      }
    }
  }

  function updatePregPhantoms() {
    const ctx = window.pregCtx;
    const yamX = window.innerWidth / 2 + ctx.phase2OffsetX;
    const yamY = window.innerHeight / 2 + ctx.crouchY + ctx.phase2OffsetY;

    for (let i = 0; i < ctx.phantoms.length; i++) {
      const p = ctx.phantoms[i];
      
      if (ctx.bossState === "charging") {
        p.angle += 0.08; // Spin rapidly during warnings
      } else {
        p.angle += 0.02; // Normal slow float
      }

      // Smoothly expand radius
      p.orbitRadius += (p.targetRadius - p.orbitRadius) * 0.08;

      if (ctx.bossState === "lunging") {
        // Phantoms shoot directly at the screen (Spectral barrage!)
        p.z += (350 - p.z) * 0.08;
        p.element.style.opacity = Math.max(0, 0.65 - (p.z / 350));
        
        const scale = 1.0 + (p.z / 100) * 0.8;
        const x = Math.cos(p.angle) * (p.orbitRadius + p.z * 1.5);
        const y = Math.sin(p.angle) * (p.orbitRadius + p.z * 1.5);
        p.element.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${p.z}px) scale(${scale}) rotate(${p.angle * 8}deg)`;
      } else {
        // Normal orbital rotation around Yam's center (relative inside bossContainer)
        p.z = 0;
        p.element.style.opacity = "0.85";
        
        const scale = 1.0 + Math.sin(Date.now() / 300 + p.angle) * 0.1;
        const x = Math.cos(p.angle) * p.orbitRadius;
        const y = Math.sin(p.angle) * p.orbitRadius;
        p.element.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotate(${p.angle * 2.5}deg)`;
      }
    }
  }

  function gameLoop() {
    const ctx = window.pregCtx;
    if (ctx.isGameOver) return;

    // --- State & Stamina Sync back to HUD elements ---
    if (playerStaminaBar) playerStaminaBar.style.width = ctx.playerStamina + "%";
    if (playerStaminaText) playerStaminaText.textContent = Math.floor(ctx.playerStamina) + " / 100";
    if (playerHpBar) playerHpBar.style.width = ctx.playerHp + "%";
    if (playerHpText) playerHpText.textContent = `${ctx.playerHp} / 100`;
    if (bossHpBar && !ctx.isPhaseTransitioning) bossHpBar.style.width = ctx.bossHp + "%";

    // Passive Boss HP Healing (Regenerate health when not vulnerable/recovering & healing is not frozen by combo)
    if (!ctx.isPhaseTransitioning && !ctx.isGameOver && ctx.bossState !== "recovering" && ctx.bossState !== "transitioning" && Date.now() > ctx.healFreezeTimer) {
      const healRate = ctx.phase === 2 ? 0.15 : 0.05; // 9 HP/sec in Phase 2, 3 HP/sec in Phase 1
      ctx.bossHp = Math.min(100, ctx.bossHp + healRate);
    }

    // Phase 2 floating Lissajous zipping offsets
    if (ctx.phase === 2 && !ctx.isPhaseTransitioning) {
      if (ctx.bossState === "idle" || ctx.bossState === "charging" || ctx.bossState === "recovering") {
        ctx.phase2OffsetX = Math.sin(Date.now() / 220) * 110;
        ctx.phase2OffsetY = Math.cos(Date.now() / 270) * 50;
      } else {
        // Direct center targeting during lunge
        ctx.phase2OffsetX = 0;
        ctx.phase2OffsetY = 0;
      }
    } else {
      ctx.phase2OffsetX = 0;
      ctx.phase2OffsetY = 0;
    }

    // Animate Phantom Spirits
    updatePregPhantoms();

    // VR 360 Parallax nebula spin with Skew effects for 3D depth + translateY for crouch
    spaceAngle += ctx.phase === 2 ? 3.8 : 0.8;
    const pulseFreq = ctx.phase === 2 ? 220 : 450;
    const pulseScale = ctx.phase === 2 ? 0.12 : 0.03;
    const pulse = 1 + Math.sin(Date.now() / pulseFreq) * pulseScale;
    const skew = Math.sin(Date.now() / 600) * (ctx.phase === 2 ? 8 : 1);
    if (space) {
      space.style.transform = `rotate(${spaceAngle}deg) scale(${pulse}) skew(${skew}deg) translateY(${ctx.crouchY}px)`;
      if (ctx.phase === 2 && !ctx.isPhaseTransitioning) {
        if (!space.classList.contains("phase2-background-aura")) {
          space.classList.add("phase2-background-aura");
        }
      } else {
        space.classList.remove("phase2-background-aura");
      }
    }

    // 3D Particles
    updatePregParticles();

    // Lack of Oxygen dynamic blur calculations
    ctx.temporaryHitBlur = Math.max(0, ctx.temporaryHitBlur - 0.12);
    const healthBlur = (100 - ctx.playerHp) * 0.18; // Heavy blur proportional to low health
    const totalBlur = healthBlur + ctx.temporaryHitBlur;
    
    if (space && bossContainer) {
      if (totalBlur > 0) {
        space.style.filter = `blur(${totalBlur}px)`;
        bossContainer.style.filter = `blur(${totalBlur}px)`;
      } else {
        space.style.filter = "";
        bossContainer.style.filter = "";
      }
    }

    // 3D Floating billboard and Boss rotations
    if (!ctx.isPhaseTransitioning && bossContainer) {
      // 3D Floating tilt
      const hoverFreqY = ctx.phase === 2 ? 350 : 500;
      const hoverFreqX = ctx.phase === 2 ? 450 : 700;
      const rotY = Math.sin(Date.now() / hoverFreqY) * (ctx.phase === 2 ? 38 : 16);
      const rotX = Math.cos(Date.now() / hoverFreqX) * (ctx.phase === 2 ? 24 : 10);
      const scaleMultiplier = (ctx.bossState === "lunging") ? 2.8 : 1.0;
      bossContainer.style.transform = `translate(calc(-50% + ${ctx.phase2OffsetX}px), calc(${ctx.bossState === "lunging" ? "-15%" : "-50%"} + ${ctx.crouchY + ctx.phase2OffsetY}px)) scale(${scaleMultiplier}) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

      // Dynamic Boss Spin attack animation in Phase 2
      if (yamImg) {
        if (ctx.bossState === "charging") {
          if (ctx.phase === 2) {
            yamImg.style.transform = `rotate(${Date.now() * 1.5}deg) scale(${1.2 + Math.sin(Date.now() / 50) * 0.1})`;
          } else {
            // Normal shake vibration in Phase 1
            yamImg.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 6}px)`;
          }
        } else {
          yamImg.style.transform = ""; // Reset transforms in other states
        }
      }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  window.pregRenderer = {
    start: function() {
      // Cache DOM nodes for zero-overhead loop access
      space = document.getElementById("pregSpaceContainer");
      bossContainer = document.getElementById("pregBossContainer");
      yamImg = document.getElementById("pregYamImg");
      particlesContainer = document.getElementById("preg3DParticles");
      bossHpBar = document.getElementById("pregBossHpBar");
      playerHpBar = document.getElementById("pregPlayerHpBar");
      playerHpText = document.getElementById("pregPlayerHpText");
      playerStaminaBar = document.getElementById("pregPlayerStaminaBar");
      playerStaminaText = document.getElementById("pregPlayerStaminaText");

      // Reset state properties on window
      const ctx = window.pregCtx;
      ctx.isGameOver = false;
      ctx.particles = [];
      ctx.lastParticleSpawn = 0;
      ctx.temporaryHitBlur = 0;
      ctx.phase2OffsetX = 0;
      ctx.phase2OffsetY = 0;
      ctx.phantoms = [];

      spaceAngle = 0;

      // Start loop
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(gameLoop);
    },
    stop: function() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      // Clean up cached DOM elements
      space = null;
      bossContainer = null;
      yamImg = null;
      particlesContainer = null;
      bossHpBar = null;
      playerHpBar = null;
      playerHpText = null;
      playerStaminaBar = null;
      playerStaminaText = null;
    }
  };
})();
