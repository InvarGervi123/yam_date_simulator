// --- Space VR Pregnancy Minigame: 2-Phase Dark Souls Space Combat Engine ---

function runPregnancyGame(onSuccess, onFail) {
  // Defensive DOM retrievals
  const overlay = document.getElementById("pregOverlay");
  const space = document.getElementById("pregSpaceContainer");
  const bossContainer = document.getElementById("pregBossContainer");
  const yamImg = document.getElementById("pregYamImg");
  const warningFlash = document.getElementById("pregWarningFlash");
  const bossHpBar = document.getElementById("pregBossHpBar");
  const playerHpBar = document.getElementById("pregPlayerHpBar");
  const playerHpText = document.getElementById("pregPlayerHpText");
  const playerStanceText = document.getElementById("pregPlayerStance");
  const combatLog = document.getElementById("pregCombatLog");
  const particlesContainer = document.getElementById("preg3DParticles");
  const bossNameElement = document.querySelector(".boss-name");
  const flashEffect = document.getElementById("pregFlashEffect");
  const bossAura = document.getElementById("pregBossAura");

  const playerStaminaBar = document.getElementById("pregPlayerStaminaBar");
  const playerStaminaText = document.getElementById("pregPlayerStaminaText");
  const playerComboText = document.getElementById("pregPlayerCombo");

  const btnAttack = document.getElementById("pregBtnAttack");
  const btnDodge = document.getElementById("pregBtnDodge");

  if (!overlay || !space || !bossContainer || !yamImg) {
    console.error("Critical Pregnancy VR minigame elements are missing in DOM. Fallback skip...");
    onSuccess(); // Safe fallback to avoid blocking user gameplay
    return;
  }

  overlay.style.display = "flex";
  playMusic("audio/the_clockwork_void.mp3");
  
  if (particlesContainer) {
    particlesContainer.innerHTML = ""; // Clear debris safely
  }
  if (flashEffect) {
    flashEffect.className = ""; // Reset flash overlay
  }
  if (bossAura) {
    bossAura.style.display = "block"; // Mild Phase 1 aura visible at start!
    bossAura.classList.remove("phase2-aura");
  }

  // Combat parameters
  let playerHp = 100;
  let bossHp = 100;
  let isGameOver = false;

  let phase = 1;
  let isPhaseTransitioning = false;

  // Stances: "ready", "dodging", "attacking"
  let playerStance = "ready";
  // Boss States: "idle", "charging", "lunging", "recovering", "transitioning"
  let bossState = "idle";
  let stateTimer = Date.now() + 1200; // Phase 1 idle timer
  let attackCooldown = 0;

  // Stamina parameters (Prevent Spamming)
  let playerStamina = 100;
  let isGasping = false; // Exhaustion status
  let gaspTimer = 0;

  // Combo recipe system mechanics
  let currentRecipe = [];
  let recipeProgress = 0;
  let healFreezeTimer = 0;

  const comboRecipes = [
    ["w", "s", "w"],          // Counter Strike (Attack, Dodge, Attack)
    ["w", "w", "s", "w"],     // Burek Slam (Attack, Attack, Dodge, Attack)
    ["s", "w", "s", "w"],     // Phantom Evasion (Dodge, Attack, Dodge, Attack)
    ["w", "s", "w", "s", "w"] // Dragon Slice (Attack, Dodge, Attack, Dodge, Attack)
  ];

  function generateNewRecipe() {
    if (phase !== 2) return;
    const r = comboRecipes[Math.floor(Math.random() * comboRecipes.length)];
    currentRecipe = r;
    recipeProgress = 0;
    updateComboHUD();
  }

  function updateComboHUD() {
    if (!playerComboText) return;
    if (phase !== 2 || isPhaseTransitioning || isGameOver) {
      playerComboText.style.display = "none";
      playerComboText.className = "";
      return;
    }

    playerComboText.style.display = "inline";
    playerComboText.classList.remove("combo-active-pulse", "combo-super-strike");
    void playerComboText.offsetWidth; // Force Reflow
    playerComboText.classList.add("combo-active-pulse");

    // Format the recipe visually: completed keys are green, pending keys are grey
    let html = "רצף: ";
    for (let i = 0; i < currentRecipe.length; i++) {
      const stepName = currentRecipe[i].toUpperCase();
      if (i < recipeProgress) {
        html += `<span style="color: #2ecc71; text-shadow: 0 0 10px #2ecc71; font-weight: bold;">${stepName}</span>`;
      } else {
        html += `<span style="color: #bdc3c7; font-weight: bold;">${stepName}</span>`;
      }
      if (i < currentRecipe.length - 1) {
        html += " ➔ ";
      }
    }
    playerComboText.innerHTML = html;
  }

  function registerComboInput(inputChar) {
    if (isGameOver || isPhaseTransitioning || phase !== 2) return;

    // Check if the input matches the current step of the recipe
    if (currentRecipe[recipeProgress] === inputChar) {
      recipeProgress++;
      playSfx("audio/healing.mp3"); // Play a positive ding sound
      updateComboHUD();

      if (recipeProgress >= currentRecipe.length) {
        triggerSuperStrike();
      }
    } else {
      // Wrong input: reset combo recipe progress
      recipeProgress = 0;
      playSfx("audio/dodge.mp3"); // Fail sound
      writeLog("⚠️ רצף קומבו נשבר! התחל מחדש.");
      updateComboHUD();
    }
  }

  function triggerSuperStrike() {
    const superDmg = 30;
    bossHp = Math.max(0, bossHp - superDmg);
    if (bossHpBar) bossHpBar.style.width = bossHp + "%";
    
    healFreezeTimer = Date.now() + 4000; // Freeze passive regeneration for 4 seconds!
    writeLog("🔥 קומבו הושלם! שחררת מכת בורקס מוחצת שהסבה 30 נזק והקפיאה את הריפוי שלו ל-4 שניות! 🔥");
    
    playSfx("audio/truimph.mp3");
    flashScreen("preg-screen-flash");
    triggerCameraShake();
    
    if (playerComboText) {
      playerComboText.innerHTML = "<span class='combo-super-strike'>💥 מכת קומבו! 💥</span>";
    }

    recipeProgress = 0;
    
    // Generate new recipe after a brief delay
    setTimeout(() => {
      if (!isGameOver && !isPhaseTransitioning) {
        generateNewRecipe();
      }
    }, 1500);

    if (bossHp <= 0) {
      endGame(true);
    }
  }

  let keysPressed = {};
  let particles = [];
  let lastParticleSpawn = 0;
  let temporaryHitBlur = 0; // Decays over time when hit
  let crouchY = 0; // Relative pixel translation offset for 3D ducking

  // Phase 2 movement coordinates
  let phase2OffsetX = 0;
  let phase2OffsetY = 0;

  // Phantom Spirits (Phase 2 Sentinels)
  let phantoms = [];
  const phantomImages = [
    "images/yam_sleepy.png",
    "images/yam_angry.png",
    "images/yam_sad.png",
    "images/yam_curious.png",
    "images/yam_happy.png",
    "images/yam_horny.png",
    "images/yam_surpise.png",
    "images/yam_alien.png"
  ];

  function spawnPhantom(imgSrc, index) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "boss-phantom-spirit";
    // Append inside bossContainer to make positioning relative to Yam's center
    bossContainer.appendChild(img);

    phantoms.push({
      element: img,
      angle: (index * (Math.PI * 2)) / 8,
      orbitRadius: 0,
      targetRadius: 125, // Tighter orbit radius so they stay centered and visible
      z: 0
    });

    setTimeout(() => {
      if (img) img.style.opacity = "0.85";
    }, 20);
  }

  function writeLog(msg) {
    if (combatLog) combatLog.textContent = msg;
  }

  // Audio helpers
  function playSfx(src) {
    if (window.audioEngine && typeof window.audioEngine.playSfx === "function") {
      window.audioEngine.playSfx(src);
    }
  }

  function triggerVibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  // Flash hits/dodges via pregFlashEffect to preserve overlay background solidity
  function flashScreen(type) {
    if (!flashEffect) return;
    flashEffect.className = "";
    void flashEffect.offsetWidth; // force DOM reflow
    flashEffect.className = type;
    setTimeout(() => {
      if (flashEffect) flashEffect.className = "";
    }, 350);
  }

  // Apply camera shakes to inner nodes only to avoid gaps revealing room.png
  function triggerCameraShake() {
    space.classList.remove("screen-shake-heavy");
    bossContainer.classList.remove("screen-shake-heavy");
    void space.offsetWidth; // force DOM reflow
    space.classList.add("screen-shake-heavy");
    bossContainer.classList.add("screen-shake-heavy");
    setTimeout(() => {
      space.classList.remove("screen-shake-heavy");
      bossContainer.classList.remove("screen-shake-heavy");
    }, 400);
  }

  // Keyboard Listeners
  const handleKeyDown = (e) => {
    if (isGameOver || isPhaseTransitioning) return;
    keysPressed[e.key.toLowerCase()] = true;

    // Dodge (S / ArrowDown)
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      if (isGasping) return; // Cannot dodge while gasping
      if (playerStance !== "dodging") {
        playerStance = "dodging";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
          playerStanceText.style.color = "#3498db";
        }
        crouchY = 25; // Apply displacement offset
        registerComboInput("s"); // Add S to Combo recipe evaluation
      }
    }

    // Attack (W, Up, or Space)
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
      e.preventDefault();
      if (isGasping) return; // Cannot attack while gasping
      if (playerStance !== "dodging" && Date.now() > attackCooldown) {
        triggerPlayerAttack();
      }
    }
  };

  const handleKeyUp = (e) => {
    keysPressed[e.key.toLowerCase()] = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      if (playerStance === "dodging") {
        playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
      crouchY = 0; // Reset displacement offset
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Mobile Button Actions
  if (btnAttack) {
    btnAttack.onclick = (e) => {
      e.preventDefault();
      if (isGameOver || isPhaseTransitioning || isGasping) return;
      if (playerStance !== "dodging" && Date.now() > attackCooldown) {
        triggerPlayerAttack();
      }
    };
  }

  if (btnDodge) {
    btnDodge.ontouchstart = (e) => {
      e.preventDefault();
      if (isGameOver || isPhaseTransitioning || isGasping) return;
      if (playerStance !== "dodging") {
        playerStance = "dodging";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
          playerStanceText.style.color = "#3498db";
        }
        crouchY = 25;
        registerComboInput("s"); // Add S to Combo recipe evaluation on mobile
      }
    };

    btnDodge.ontouchend = (e) => {
      e.preventDefault();
      if (playerStance === "dodging") {
        playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
      crouchY = 0;
    };
  }

  // Player Attack Trigger with Stamina Drain
  function triggerPlayerAttack() {
    // If stamina is too low, player gasps for air (Exhausted)
    if (playerStamina < 35) {
      isGasping = true;
      gaspTimer = Date.now() + 1500; // Locked for 1.5 seconds
      playSfx("audio/dodge.mp3"); // Play breath/skip sound
      triggerVibrate(150);
      if (playerStaminaText) {
        playerStaminaText.classList.add("stamina-exhausted-flash");
      }
      if (playerStanceText) {
        playerStanceText.textContent = "עמידה: 🥵 עייף מדי! *מתנשף*";
        playerStanceText.style.color = "#ff3f3f";
      }
      writeLog("🥵 התעייפת והתנשפת! אינך יכול לתקוף ללא סיבולת!");
      return;
    }

    // Spend Stamina
    playerStamina = Math.max(0, playerStamina - 35);
    attackCooldown = Date.now() + 250; 
    playerStance = "attacking";
    if (playerStanceText) {
      playerStanceText.textContent = "עמידה: ⚔️ התקפה!";
      playerStanceText.style.color = "#e74c3c";
    }

    let dmg = 10;
    let attackMessage = "";

    if (bossState === "recovering") {
      dmg = phase === 2 ? 7 : 22; // Harder scaling in phase 2: only 7 crit dmg
      attackMessage = `⚔️ מכה קריטית! ים ספג ${dmg} נזק (חלש)!`;
      playSfx("audio/crack.mp3");
      triggerVibrate([50, 30, 50]);
    } else {
      dmg = phase === 2 ? 1 : 10; // Harder scaling in phase 2: only 1 basic dmg
      attackMessage = `⚔️ תקפת את ים! הוא ספג ${dmg} נזק.`;
      playSfx("audio/hit.mp3");
      triggerVibrate(20);
    }

    bossHp = Math.max(0, bossHp - dmg);
    if (bossHpBar) bossHpBar.style.width = bossHp + "%";
    writeLog(attackMessage);

    // Register W to Combo recipe evaluation
    registerComboInput("w");

    // Sprite shake on hit
    bossContainer.classList.add("boss-dmg-shake");
    setTimeout(() => {
      bossContainer.classList.remove("boss-dmg-shake");
      if (playerStance === "attacking") {
        playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
    }, 200);

    if (bossHp <= 0) {
      if (phase === 1) {
        startPhase2Transition();
      } else {
        endGame(true);
      }
    }
  }

  // Phase 2 transition sequence (6-Second Epic Demonic Transformation & Phantom Summon)
  function startPhase2Transition() {
    isPhaseTransitioning = true;
    bossState = "transitioning";
    yamImg.className = "";
    yamImg.style.transform = "";
    bossContainer.style.transform = "translate(-50%, -50%) scale(1)";
    if (warningFlash) warningFlash.style.display = "none";
    
    playSfx("audio/truimph.mp3");
    flashScreen("preg-screen-flash");
    triggerVibrate([200, 100, 200, 100, 400]);
    writeLog("💥 שלב 1 הושלם! ים נתקף זעם קוסמי ומתחיל להשתנות... 💥");

    // Intense camera shake interval
    let cameraShakeTimer = setInterval(() => {
      triggerCameraShake();
    }, 450);

    // Staggered flicker of Yam's main sprite
    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      yamImg.style.opacity = (flickerCount % 2 === 0) ? "0.2" : "1.0";
      const scale = 1.0 + (flickerCount * 0.008);
      yamImg.style.transform = `scale(${scale})`;
      yamImg.style.filter = `drop-shadow(0 0 ${flickerCount * 0.6}px #ff0000) hue-rotate(${flickerCount * 4}deg)`;

      flickerCount++;
      if (flickerCount >= 80) {
        clearInterval(flickerInterval);
      }
    }, 75);

    // Slowly refill health bar over 6000ms
    let healingHp = 0;
    const healInterval = setInterval(() => {
      healingHp += 1.25;
      if (bossHpBar) bossHpBar.style.width = healingHp + "%";
      if (healingHp >= 100) {
        clearInterval(healInterval);
      }
    }, 75);

    // 2 Seconds: Summon the Phantom Spirits
    setTimeout(() => {
      if (isGameOver) return;
      writeLog("🔮 ים פולט מגופו את צלילי הרפאים הרגשיים שלו! 🔮");
      phantomImages.forEach((src, idx) => {
        setTimeout(() => {
          if (isGameOver || !isPhaseTransitioning) return;
          spawnPhantom(src, idx);
          playSfx("audio/crack.mp3");
          triggerVibrate(30);
        }, idx * 180);
      });
    }, 2000);

    // 4.5 Seconds: Ignite evil aura & monster filter overrides
    setTimeout(() => {
      if (isGameOver) return;
      if (bossAura) {
        bossAura.style.display = "block";
        bossAura.classList.add("phase2-aura"); // Activate giant fiery aura!
      }
      playSfx("audio/break.mp3");
      playMusic("audio/the_clockwork_void_extend.mp3"); // Play Phase 2 track!
      writeLog("👹 אזהרה! גופו של ים הופך למפלצת בורקסים קוסמית זועמת! 👹");
      triggerVibrate([400, 100, 400]);
      yamImg.style.filter = "drop-shadow(0 0 35px #e74c3c) invert(1) hue-rotate(290deg) contrast(1.8) saturate(2.5)";
    }, 4500);

    // 6 Seconds: Complete transformation
    setTimeout(() => {
      clearInterval(cameraShakeTimer);
      yamImg.style.opacity = "1.0";
      yamImg.style.transform = "";
      
      phase = 2;
      bossHp = 100;
      isPhaseTransitioning = false;
      bossState = "idle";
      stateTimer = Date.now() + 1000;

      generateNewRecipe(); // Initialize first recipe in Phase 2!

      if (bossNameElement) {
        bossNameElement.innerHTML = "ים, אל הבורקסים השחוטים <span style='color: #e74c3c;'>(Phase 2 - God of Burek)</span>";
        bossNameElement.style.color = "#ff3f3f";
        bossNameElement.style.textShadow = "0 0 15px #e74c3c";
      }
      
      writeLog("⚠️ שלב 2: ים התעורר לצורתו האמיתית: אל הבורקסים השחוטים! ⚠️");
    }, 6000);
  }

  // Debris generator
  const particlePool = ["✨", "⭐", "☄️", "🤰", "🥐"];
  function spawnParticle() {
    if (!particlesContainer) return;
    const emoji = particlePool[Math.floor(Math.random() * particlePool.length)];
    const el = document.createElement("div");
    el.className = "preg-particle";
    el.textContent = emoji;
    particlesContainer.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    particles.push({
      element: el,
      angle: angle,
      z: -700,
      speedZ: Math.random() * 8 + 12
    });
  }

  function updateParticles() {
    if (!particlesContainer) return;
    const spawnRate = phase === 2 ? 100 : 250;
    if (Date.now() - lastParticleSpawn > spawnRate) {
      lastParticleSpawn = Date.now();
      spawnParticle();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.z += p.speedZ;

      if (p.z >= 0) {
        p.element.remove();
        particles.splice(i, 1);
      } else {
        const distanceRatio = (700 + p.z) * 0.9;
        const x = Math.cos(p.angle) * distanceRatio;
        const y = Math.sin(p.angle) * distanceRatio;
        p.element.style.transform = `translate3d(${x}px, ${y}px, ${p.z}px) rotate(${p.z * 0.4}deg)`;
        p.element.style.opacity = Math.min(1, (700 + p.z) / 250);
      }
    }
  }

  // Loop Execution
  let spaceAngle = 0;
  function gameLoop() {
    if (isGameOver) return;

    // Stamina Regeneration calculations
    if (isGasping) {
      // Slow recovery when gasping
      playerStamina = Math.min(100, playerStamina + 0.35);
      if (Date.now() > gaspTimer && playerStamina >= 35) {
        isGasping = false;
        if (playerStaminaText) playerStaminaText.classList.remove("stamina-exhausted-flash");
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
    } else {
      // Normal stamina regeneration (Slower when dodging, faster when ready)
      const regenRate = playerStance === "dodging" ? 0.25 : 0.65;
      playerStamina = Math.min(100, playerStamina + regenRate);
    }

    // Update Stamina HUD
    if (playerStaminaBar) playerStaminaBar.style.width = playerStamina + "%";
    if (playerStaminaText) playerStaminaText.textContent = Math.floor(playerStamina) + " / 100";

    // Passive Boss HP Healing (Regenerate health when not vulnerable/recovering & healing is not frozen by combo)
    if (!isPhaseTransitioning && !isGameOver && bossState !== "recovering" && bossState !== "transitioning" && Date.now() > healFreezeTimer) {
      const healRate = phase === 2 ? 0.15 : 0.05; // 9 HP/sec in Phase 2, 3 HP/sec in Phase 1
      bossHp = Math.min(100, bossHp + healRate);
      if (bossHpBar) bossHpBar.style.width = bossHp + "%";
    }

    // Phase 2 floating Lissajous zipping offsets
    if (phase === 2 && !isPhaseTransitioning) {
      if (bossState === "idle" || bossState === "charging" || bossState === "recovering") {
        phase2OffsetX = Math.sin(Date.now() / 220) * 110;
        phase2OffsetY = Math.cos(Date.now() / 270) * 50;
      } else {
        // Direct center targeting during lunge
        phase2OffsetX = 0;
        phase2OffsetY = 0;
      }
    } else {
      phase2OffsetX = 0;
      phase2OffsetY = 0;
    }

    // Animate Phantom Spirits Orbitals & Attack Zooming (Relative coordinates)
    for (let i = 0; i < phantoms.length; i++) {
      const p = phantoms[i];
      
      if (bossState === "charging") {
        p.angle += 0.08; // Spin rapidly during warnings
      } else {
        p.angle += 0.02; // Normal slow float
      }

      // Smoothly expand radius
      p.orbitRadius += (p.targetRadius - p.orbitRadius) * 0.08;

      if (bossState === "lunging") {
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
        p.element.style.opacity = "0.65";
        
        const scale = 1.0 + Math.sin(Date.now() / 300 + p.angle) * 0.1;
        const x = Math.cos(p.angle) * p.orbitRadius;
        const y = Math.sin(p.angle) * p.orbitRadius;
        p.element.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotate(${p.angle * 2.5}deg)`;
      }
    }

    // VR 360 Parallax nebula spin with Skew effects for 3D depth + translateY for crouch
    spaceAngle += phase === 2 ? 3.8 : 0.8;
    const pulseFreq = phase === 2 ? 220 : 450;
    const pulseScale = phase === 2 ? 0.12 : 0.03;
    const pulse = 1 + Math.sin(Date.now() / pulseFreq) * pulseScale;
    const skew = Math.sin(Date.now() / 600) * (phase === 2 ? 8 : 1);
    space.style.transform = `rotate(${spaceAngle}deg) scale(${pulse}) skew(${skew}deg) translateY(${crouchY}px)`;

    // Check keyboard duck mapping continuously
    if (keysPressed["s"] || keysPressed["arrowdown"]) {
      if (!isGasping) {
        if (playerStance !== "dodging") {
          playerStance = "dodging";
          if (playerStanceText) {
            playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
            playerStanceText.style.color = "#3498db";
          }
          crouchY = 25;
          registerComboInput("s"); // Add S to Combo recipe evaluation
        }
      }
    }

    // 3D Particles
    updateParticles();

    // Lack of Oxygen dynamic blur calculations
    temporaryHitBlur = Math.max(0, temporaryHitBlur - 0.12);
    const healthBlur = (100 - playerHp) * 0.18; // Heavy blur proportional to low health
    const totalBlur = healthBlur + temporaryHitBlur;
    
    if (totalBlur > 0) {
      space.style.filter = `blur(${totalBlur}px)`;
      bossContainer.style.filter = `blur(${totalBlur}px)`;
    } else {
      space.style.filter = "";
      bossContainer.style.filter = "";
    }

    // 3D Floating billboard and Boss rotations
    if (!isPhaseTransitioning) {
      // 3D Floating tilt
      const hoverFreqY = phase === 2 ? 350 : 500;
      const hoverFreqX = phase === 2 ? 450 : 700;
      const rotY = Math.sin(Date.now() / hoverFreqY) * (phase === 2 ? 38 : 16);
      const rotX = Math.cos(Date.now() / hoverFreqX) * (phase === 2 ? 24 : 10);
      const scaleMultiplier = (bossState === "lunging") ? 2.8 : 1.0;
      bossContainer.style.transform = `translate(calc(-50% + ${phase2OffsetX}px), calc(${bossState === "lunging" ? "-15%" : "-50%"} + ${crouchY + phase2OffsetY}px)) scale(${scaleMultiplier}) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

      // Dynamic Boss Spin attack animation in Phase 2
      if (bossState === "charging") {
        if (phase === 2) {
          yamImg.style.transform = `rotate(${Date.now() * 1.5}deg) scale(${1.2 + Math.sin(Date.now() / 50) * 0.1})`;
        } else {
          // Normal shake vibration in Phase 1
          yamImg.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 6}px)`;
        }
      } else {
        yamImg.style.transform = ""; // Reset transforms in other states
      }
    }

    // Boss Combat AI State Manager
    const now = Date.now();
    if (!isPhaseTransitioning && now > stateTimer) {
      if (bossState === "idle") {
        bossState = "charging";
        stateTimer = now + (phase === 2 ? 380 : 850); // Warning time: 850ms in Ph1, 380ms in Ph2!
        yamImg.className = "boss-charging";
        if (warningFlash) warningFlash.style.display = "block";
        playSfx("audio/crack.mp3");
        triggerVibrate([40, 40, 40]);
        writeLog(phase === 2 ? "⚠️ זהירות! מכת Lunge מהירה של אל הבורקסים!" : "⚠️ ים מתכונן למתקפה קוסמית קשה!");

      } else if (bossState === "charging") {
        bossState = "lunging";
        stateTimer = now + (phase === 2 ? 180 : 250);
        if (warningFlash) warningFlash.style.display = "none";
        yamImg.className = "";

        if (playerStance === "dodging") {
          playSfx("audio/dodge.mp3");
          flashScreen("preg-screen-flash");
          writeLog("🛡️ חמיקה מושלמת! (DODGE) ים מפספס!");
          triggerVibrate(30);
        } else if (playerStance === "attacking") {
          // Punish player for spamming attacks during lunges (Counter-Attack!)
          const counterDmg = phase === 2 ? 85 : 65; // Massive counter-attack damage!
          playerHp = Math.max(0, playerHp - counterDmg);
          if (playerHpBar) playerHpBar.style.width = playerHp + "%";
          if (playerHpText) playerHpText.textContent = `${playerHp} / 100`;

          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          triggerCameraShake();
          temporaryHitBlur = 12; // Instant heavy blur
          writeLog(`💥 מכת נגד קטלנית! ים הדף את המתקפה והסב לך ${counterDmg} נזק! 💥`);
          triggerVibrate([200, 100, 200]);

          recipeProgress = 0; // Reset recipe progress on counter-attack parry
          updateComboHUD();

          if (playerHp <= 0) {
            endGame(false);
            return;
          }
        } else {
          // Normal hit taken: 30 in Ph1, 55 in Ph2!
          const pDmg = phase === 2 ? 55 : 30;
          playerHp = Math.max(0, playerHp - pDmg);
          if (playerHpBar) playerHpBar.style.width = playerHp + "%";
          if (playerHpText) playerHpText.textContent = `${playerHp} / 100`;
          
          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          triggerCameraShake(); // Rumble viewport
          temporaryHitBlur = 10; 
          writeLog(`💥 פגיעה קשה! ספגת ${pDmg} נזק מים!`);
          triggerVibrate([120, 60, 120]);

          recipeProgress = 0; // Reset recipe progress on lunge hit
          updateComboHUD();

          if (playerHp <= 0) {
            endGame(false);
            return;
          }
        }

      } else if (bossState === "lunging") {
        bossState = "recovering";
        stateTimer = now + (phase === 2 ? 500 : 800); // Tired window: 800ms in Ph1, 500ms in Ph2!
        yamImg.className = "boss-tired";
        writeLog("💤 ים התעייף ונשאר חשוף! תתקוף עכשיו!");

      } else if (bossState === "recovering") {
        bossState = "idle";
        const idleDelay = phase === 2 ? (Math.random() * 500 + 500) : (Math.random() * 1200 + 1000);
        stateTimer = now + idleDelay;
        yamImg.className = "";
        writeLog("• ים חזר לעמידה רגילה.");
      }
    }

    requestAnimationFrame(gameLoop);
  }

  function endGame(success) {
    isGameOver = true;
    overlay.style.display = "none";
    overlay.style.transform = ""; 
    space.style.filter = "";
    bossContainer.style.filter = "";

    // Restore background theme of visual novel
    playMusic("audio/main.mp3");

    // Clean up called phantom spirits elements
    phantoms.forEach(p => {
      if (p.element) {
        p.element.remove();
      }
    });
    phantoms = [];

    if (flashEffect) {
      flashEffect.className = "";
    }
    if (particlesContainer) {
      particlesContainer.innerHTML = "";
    }
    particles = [];

    // Cleanup listeners
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    if (btnAttack) btnAttack.onclick = null;
    if (btnDodge) {
      btnDodge.ontouchstart = null;
      btnDodge.ontouchend = null;
    }

    // Reset layout styles
    bossContainer.style.transform = "";
    yamImg.className = "";
    yamImg.style.transform = "";
    yamImg.style.opacity = "";
    yamImg.style.filter = "";
    if (warningFlash) warningFlash.style.display = "none";

    if (bossAura) {
      bossAura.style.display = "none";
      bossAura.classList.remove("phase2-aura");
    }

    phase2OffsetX = 0;
    phase2OffsetY = 0;

    recipeProgress = 0;
    if (playerComboText) {
      playerComboText.style.display = "none";
      playerComboText.className = "";
    }

    if (playerStaminaText) {
      playerStaminaText.classList.remove("stamina-exhausted-flash");
    }

    if (bossNameElement) {
      bossNameElement.textContent = "ים, האדון הראשון של המיטה (Lord of the Bed)";
      bossNameElement.style.color = "";
      bossNameElement.style.textShadow = "";
    }

    if (success) {
      onSuccess();
    } else {
      onFail();
    }
  }

  // Set default HUD parameters
  if (playerHpBar) playerHpBar.style.width = "100%";
  if (playerHpText) playerHpText.textContent = "100 / 100";
  if (bossHpBar) bossHpBar.style.width = "100%";
  if (playerStaminaBar) playerStaminaBar.style.width = "100%";
  if (playerStaminaText) playerStaminaText.textContent = "100 / 100";
  if (playerStanceText) {
    playerStanceText.textContent = "עמידה: 🛡️ מוכן";
    playerStanceText.style.color = "#ffd447";
  }
  if (playerComboText) {
    playerComboText.style.display = "none";
  }
  writeLog("• הקרב התחיל. התחמק בזמן (S) ותקוף (W)!");

  // Start Loop
  requestAnimationFrame(gameLoop);
}
