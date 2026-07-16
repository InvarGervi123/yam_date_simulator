// --- Slender 3D ASCII Game Controller ---

window.slenderCtx = {
  px: 2.5,
  py: 2.5,
  pa: 0.0,
  fov: Math.PI / 3,
  map: [],
  sprites: [],
  pagesCollected: 0,
  battery: 100,
  flashlightOn: true,
  yam: { x: 10.5, y: 10.5 },
  yamSpeed: 0.008,
  staticRatio: 0.0,
  gameOver: false,
  success: false,
  active: false
};

(function() {
  const MAP_WIDTH = 12;
  const MAP_HEIGHT = 12;
  const ORIGINAL_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,1,1,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1,1,1],
    [1,0,0,0,1,1,1,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let loopId = null;
  let heartbeatIntervalId = null;
  let keys = { w: false, s: false, a: false, d: false };
  window.slenderKeys = keys;
  let onSuccessCallback = null;
  let onFailCallback = null;

  function triggerVibration(pattern) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  function playSfx(src) {
    if (window.audioEngine && typeof window.audioEngine.playSfx === "function") {
      window.audioEngine.playSfx(src);
    }
  }

  function handleKeyDown(e) {
    if (!window.slenderCtx.active || window.slenderCtx.gameOver) return;
    const k = e.key.toLowerCase();
    
    // Layout-independent and Hebrew layout key checks (Swapped A/D to match player direction preference)
    if (k === "w" || e.code === "KeyW" || e.key === "ArrowUp" || e.key === "ק" || e.key === "׳") keys.w = true;
    if (k === "s" || e.code === "KeyS" || e.key === "ArrowDown" || e.key === "ד") keys.s = true;
    if (k === "a" || e.code === "KeyA" || e.key === "ArrowLeft" || e.key === "ש") keys.d = true;
    if (k === "d" || e.code === "KeyD" || e.key === "ArrowRight" || e.key === "ג") keys.a = true;
    
    if (k === "e" || e.code === "KeyE" || e.key === " " || e.key === "ק" || e.key === "ת") {
      checkInteract();
    }
  }

  function handleKeyUp(e) {
    const k = e.key.toLowerCase();
    if (k === "w" || e.code === "KeyW" || e.key === "ArrowUp" || e.key === "ק" || e.key === "׳") keys.w = false;
    if (k === "s" || e.code === "KeyS" || e.key === "ArrowDown" || e.key === "ד") keys.s = false;
    if (k === "a" || e.code === "KeyA" || e.key === "ArrowLeft" || e.key === "ש") keys.d = false;
    if (k === "d" || e.code === "KeyD" || e.key === "ArrowRight" || e.key === "ג") keys.a = false;
  }

  function checkInteract() {
    const ctx = window.slenderCtx;
    // Check if near any page or battery or invar terminal
    ctx.sprites.forEach(sprite => {
      if (sprite.collected) return;
      const dist = Math.hypot(ctx.px - sprite.x, ctx.py - sprite.y);
      if (dist < 1.0) {
        collectSprite(sprite);
      }
    });
  }

  function collectSprite(sprite) {
    const ctx = window.slenderCtx;
    sprite.collected = true;
    
    if (sprite.type === "page") {
      ctx.pagesCollected++;
      playSfx("audio/hit.mp3");
      triggerVibration([100, 50, 100]);
      
      // Flash red to indicate page collection
      const screen = document.getElementById("slenderPre");
      if (screen) {
        screen.style.borderColor = "#ff3333";
        setTimeout(() => { screen.style.borderColor = "#550000"; }, 300);
      }

      // Update HUD
      const pagesHUD = document.getElementById("slenderPages");
      if (pagesHUD) pagesHUD.textContent = `${ctx.pagesCollected}/4`;

      // Speed up Yam
      ctx.yamSpeed = 0.008 + ctx.pagesCollected * 0.004;
      
      // Update map to open central room once all 4 normal pages are found
      if (ctx.pagesCollected === 4) {
        // Open vault door in map grid
        ctx.map[6][4] = 0;
        ctx.map[5][4] = 0;
        playSfx("audio/inject.mp3");
        // Spawn invar terminal trap in vault center
        ctx.sprites.push({ x: 5.5, y: 5.5, type: "invar", id: "invar", collected: false });
      }
    } else if (sprite.type === "battery") {
      ctx.battery = Math.min(100, ctx.battery + 40);
      playSfx("audio/healing.mp3");
      triggerVibration(80);
      const batHUD = document.getElementById("slenderBattery");
      if (batHUD) batHUD.textContent = `${Math.floor(ctx.battery)}%`;
      ctx.flashlightOn = true;
    } else if (sprite.type === "invar") {
      // Trigger trap!
      triggerTrapSequence();
    }
  }

  function triggerTrapSequence() {
    const ctx = window.slenderCtx;
    ctx.gameOver = true;
    keys = { w: false, s: false, a: false, d: false };
    
    // Glitch sound
    playSfx("audio/break.mp3");
    triggerVibration([500, 200, 500]);
    
    // Heavy static distortion overlay triggers
    ctx.staticRatio = 1.0;
    
    setTimeout(() => {
      // End game and show fail/jumpscare callback
      stopSlenderGame();
      if (onFailCallback) onFailCallback();
    }, 1800);
  }

  function setupTouchControls() {
    const btnLeft = document.getElementById("slenderCtrlLeft");
    const btnRight = document.getElementById("slenderCtrlRight");
    const btnForward = document.getElementById("slenderCtrlForward");
    const btnBackward = document.getElementById("slenderCtrlBackward");
    const btnAction = document.getElementById("slenderCtrlAction");

    if (btnLeft) {
      btnLeft.ontouchstart = (e) => { e.preventDefault(); keys.a = true; };
      btnLeft.ontouchend = (e) => { e.preventDefault(); keys.a = false; };
    }
    if (btnRight) {
      btnRight.ontouchstart = (e) => { e.preventDefault(); keys.d = true; };
      btnRight.ontouchend = (e) => { e.preventDefault(); keys.d = false; };
    }
    if (btnForward) {
      btnForward.ontouchstart = (e) => { e.preventDefault(); keys.w = true; };
      btnForward.ontouchend = (e) => { e.preventDefault(); keys.w = false; };
    }
    if (btnBackward) {
      btnBackward.ontouchstart = (e) => { e.preventDefault(); keys.s = true; };
      btnBackward.ontouchend = (e) => { e.preventDefault(); keys.s = false; };
    }
    if (btnAction) {
      btnAction.ontouchstart = (e) => { e.preventDefault(); checkInteract(); };
    }
  }

  function startHeartbeatLoop() {
    if (heartbeatIntervalId) clearInterval(heartbeatIntervalId);

    function pulse() {
      if (!window.slenderCtx.active || window.slenderCtx.gameOver) return;

      const ctx = window.slenderCtx;
      const dist = Math.hypot(ctx.px - ctx.yam.x, ctx.py - ctx.yam.y);
      
      // Double vibration heartbeat
      if (dist < 2.5) {
        triggerVibration([60, 50, 60]);
      } else if (dist < 5.0) {
        triggerVibration([50, 80, 50]);
      }

      // Re-schedule heartbeat frequency based on distance
      let interval = 1200;
      if (dist < 2.0) interval = 300;
      else if (dist < 4.5) interval = 650;

      heartbeatIntervalId = setTimeout(pulse, interval);
    }

    pulse();
  }

  window.runSlenderMinigame = function(successCb, failCb) {
    onSuccessCallback = successCb;
    onFailCallback = failCb;

    const ctx = window.slenderCtx;
    ctx.px = 1.5;
    ctx.py = 1.5;
    ctx.pa = 0.0;
    ctx.pagesCollected = 0;
    ctx.battery = 100;
    ctx.flashlightOn = true;
    ctx.yam = { x: 10.5, y: 10.5 };
    ctx.yamSpeed = 0.008;
    ctx.staticRatio = 0.05;
    ctx.gameOver = false;
    ctx.success = false;
    ctx.active = true;

    // Load deep clone map to prevent mutations
    ctx.map = ORIGINAL_MAP.map(row => [...row]);

    // Spawn collectible pages & battery objects
    ctx.sprites = [
      { x: 1.5, y: 10.5, type: "page", id: 1, collected: false },
      { x: 10.5, y: 1.5, type: "page", id: 2, collected: false },
      { x: 10.5, y: 10.5, type: "page", id: 3, collected: false },
      { x: 7.5, y: 1.5, type: "page", id: 4, collected: false }, // 4 distinct pages
      { x: 1.5, y: 5.5, type: "battery", id: "b1", collected: false },
      { x: 10.5, y: 5.5, type: "battery", id: "b2", collected: false }
    ];

    keys = { w: false, s: false, a: false, d: false };
    window.focus();

    // Show elements
    const slenderOverlay = document.getElementById("slenderContainer");
    if (slenderOverlay) slenderOverlay.style.display = "flex";
    
    // Hide visual novel HUD buttons to prevent navigation during slender minigame
    const dialogueBox = document.getElementById("dialogBox");
    if (dialogueBox) dialogueBox.style.display = "none";
    const soundToggle = document.getElementById("soundToggle");
    if (soundToggle) soundToggle.style.display = "none";
    const galleryToggle = document.getElementById("galleryToggle");
    if (galleryToggle) galleryToggle.style.display = "none";
    const fullscreenToggle = document.getElementById("fullscreenToggle");
    if (fullscreenToggle) fullscreenToggle.style.display = "none";
    
    // Remove grayscaling to make red text fully bright
    const gameContainer = document.getElementById("game");
    if (gameContainer) gameContainer.classList.remove("horror-grayscale-filter");

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    setupTouchControls();
    startHeartbeatLoop();
    playMusic("audio/Panic.mp3");

    // Initialize renderer loop
    if (window.slenderRenderer && typeof window.slenderRenderer.start === "function") {
      window.slenderRenderer.start();
    }

    loopId = requestAnimationFrame(gameLoop);
  };

  function stopSlenderGame() {
    window.slenderCtx.active = false;
    cancelAnimationFrame(loopId);
    clearTimeout(heartbeatIntervalId);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    if (window.slenderRenderer && typeof window.slenderRenderer.stop === "function") {
      window.slenderRenderer.stop();
    }

    // Hide elements
    const slenderOverlay = document.getElementById("slenderContainer");
    if (slenderOverlay) slenderOverlay.style.display = "none";
    
    // Restore visual novel HUD components
    const dialogueBox = document.getElementById("dialogBox");
    if (dialogueBox) dialogueBox.style.display = "block";
    const soundToggle = document.getElementById("soundToggle");
    if (soundToggle) soundToggle.style.display = "block";
    const galleryToggle = document.getElementById("galleryToggle");
    if (galleryToggle) galleryToggle.style.display = "block";
    const fullscreenToggle = document.getElementById("fullscreenToggle");
    if (fullscreenToggle) fullscreenToggle.style.display = "block";

    // Restore grayscaling for the visual novel dialogues
    const gameContainer = document.getElementById("game");
    if (gameContainer) gameContainer.classList.add("horror-grayscale-filter");
  }

  function gameLoop() {
    if (!window.slenderCtx.active) return;

    updateGameLogic();
    loopId = requestAnimationFrame(gameLoop);
  }

  function updateGameLogic() {
    const ctx = window.slenderCtx;
    if (ctx.gameOver) return;

    // 1. Move Player
    const moveSpeed = 0.05;
    const turnSpeed = 0.045;

    if (keys.a) {
      ctx.pa -= turnSpeed;
      if (ctx.pa < 0) ctx.pa += Math.PI * 2;
    }
    if (keys.d) {
      ctx.pa += turnSpeed;
      if (ctx.pa > Math.PI * 2) ctx.pa -= Math.PI * 2;
    }

    let dx = 0;
    let dy = 0;
    if (keys.w) {
      dx += Math.cos(ctx.pa) * moveSpeed;
      dy += Math.sin(ctx.pa) * moveSpeed;
    }
    if (keys.s) {
      dx -= Math.cos(ctx.pa) * moveSpeed;
      dy -= Math.sin(ctx.pa) * moveSpeed;
    }

    if (dx !== 0 || dy !== 0) {
      const buffer = 0.22;
      let targetX = ctx.px + dx;
      let targetY = ctx.py + dy;

      // Sliding collision logic
      if (ctx.map[Math.floor(ctx.py)][Math.floor(targetX + (dx > 0 ? buffer : -buffer))] === 0) {
        ctx.px = targetX;
      }
      if (ctx.map[Math.floor(targetY + (dy > 0 ? buffer : -buffer))][Math.floor(ctx.px)] === 0) {
        ctx.py = targetY;
      }
    }

    // 2. Drain flashlight battery
    if (ctx.flashlightOn) {
      ctx.battery -= 0.035; // continuous drain rate
      if (ctx.battery <= 0) {
        ctx.battery = 0;
        ctx.flashlightOn = false;
        playSfx("audio/rip.mp3");
      }
      const batHUD = document.getElementById("slenderBattery");
      if (batHUD) batHUD.textContent = `${Math.floor(ctx.battery)}%`;
    }

    // 3. Move stalker Yam
    const angleToPlayer = Math.atan2(ctx.py - ctx.yam.y, ctx.px - ctx.yam.x);
    ctx.yam.x += Math.cos(angleToPlayer) * ctx.yamSpeed;
    ctx.yam.y += Math.sin(angleToPlayer) * ctx.yamSpeed;

    // 4. Proximity Checks & Static Calculation
    const distToYam = Math.hypot(ctx.px - ctx.yam.x, ctx.py - ctx.yam.y);

    if (distToYam < 0.58) {
      // Caught!
      ctx.gameOver = true;
      triggerTrapSequence();
      return;
    }

    // Calculate proximity static intensity
    if (distToYam < 4.0) {
      ctx.staticRatio = 0.05 + (1 - (distToYam - 0.58) / (4.0 - 0.58)) * 0.95;
    } else {
      ctx.staticRatio = 0.05 + ctx.pagesCollected * 0.05;
    }
    ctx.staticRatio = Math.max(0.05, Math.min(1.0, ctx.staticRatio));

    // 5. Automatic proximity checks to collect sprites
    ctx.sprites.forEach(sprite => {
      if (sprite.collected) return;
      const dist = Math.hypot(ctx.px - sprite.x, ctx.py - sprite.y);
      if (dist < 0.65) {
        collectSprite(sprite);
      }
    });
  }

})();
