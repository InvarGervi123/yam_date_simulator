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

  // Bind references to global state bridge
  const ctx = window.pregCtx;

  // Reset/Initialize state variables on startup
  ctx.playerHp = 100;
  ctx.bossHp = 100;
  ctx.isGameOver = false;
  ctx.phase = 1;
  ctx.isPhaseTransitioning = false;
  ctx.playerStance = "ready";
  ctx.bossState = "idle";
  ctx.stateTimer = Date.now() + 1200; // Phase 1 idle timer
  ctx.attackCooldown = 0;
  ctx.playerStamina = 100;
  ctx.isGasping = false;
  ctx.gaspTimer = 0;
  ctx.recipeProgress = 0;
  ctx.healFreezeTimer = 0;
  ctx.crouchY = 0;
  ctx.keysPressed = {};
  ctx.phase2OffsetX = 0;
  ctx.phase2OffsetY = 0;
  ctx.phantoms = [];

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

  // Start the render canvas loop
  if (window.pregRenderer && typeof window.pregRenderer.start === "function") {
    window.pregRenderer.start();
  }

  // Floating Combat Texts Above Boss
  function spawnFloatingText(text, color) {
    const el = document.createElement("div");
    el.className = "preg-floating-text";
    el.textContent = text;
    el.style.color = color;
    el.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
    
    // Random horizontal jitter to prevent overlay stacking
    const randomOffset = (Math.random() - 0.5) * 45;
    el.style.left = `calc(50% + ${randomOffset}px)`;
    
    bossContainer.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 800);
  }

  // Combo recipe parameters
  const comboRecipes = [
    ["w", "s", "w"],          // Counter Strike (Attack, Dodge, Attack)
    ["w", "w", "s", "w"],     // Burek Slam (Attack, Attack, Dodge, Attack)
    ["s", "w", "s", "w"],     // Phantom Evasion (Dodge, Attack, Dodge, Attack)
    ["w", "s", "w", "s", "w"] // Dragon Slice (Attack, Dodge, Attack, Dodge, Attack)
  ];

  function generateNewRecipe() {
    if (ctx.phase !== 2) return;
    const r = comboRecipes[Math.floor(Math.random() * comboRecipes.length)];
    ctx.currentRecipe = r;
    ctx.recipeProgress = 0;
    updateComboHUD();
  }

  function updateComboHUD() {
    if (!playerComboText) return;
    if (ctx.phase !== 2 || ctx.isPhaseTransitioning || ctx.isGameOver) {
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
    for (let i = 0; i < ctx.currentRecipe.length; i++) {
      const stepName = ctx.currentRecipe[i].toUpperCase();
      if (i < ctx.recipeProgress) {
        html += `<span style="color: #2ecc71; text-shadow: 0 0 10px #2ecc71; font-weight: bold;">${stepName}</span>`;
      } else {
        html += `<span style="color: #bdc3c7; font-weight: bold;">${stepName}</span>`;
      }
      if (i < ctx.currentRecipe.length - 1) {
        html += " ➔ ";
      }
    }
    playerComboText.innerHTML = html;
  }

  function registerComboInput(inputChar) {
    if (ctx.isGameOver || ctx.isPhaseTransitioning || ctx.phase !== 2) return;

    // Check if the input matches the current step of the recipe
    if (ctx.currentRecipe[ctx.recipeProgress] === inputChar) {
      ctx.recipeProgress++;
      playSfx("audio/healing.mp3"); // Play a positive ding sound
      updateComboHUD();

      if (ctx.recipeProgress >= ctx.currentRecipe.length) {
        triggerSuperStrike();
      } else {
        spawnFloatingText(`✨ PERFECT! (${ctx.recipeProgress}/${ctx.currentRecipe.length})`, "#2ecc71");
      }
    } else {
      // Wrong input: reset combo recipe progress
      ctx.recipeProgress = 0;
      playSfx("audio/dodge.mp3"); // Fail sound
      writeLog("⚠️ רצף קומבו נשבר! התחל מחדש.");
      spawnFloatingText("⚠️ BREAK!", "#e74c3c");
      updateComboHUD();
    }
  }

  function triggerSuperStrike() {
    const superDmg = 30;
    ctx.bossHp = Math.max(0, ctx.bossHp - superDmg);
    if (bossHpBar) bossHpBar.style.width = ctx.bossHp + "%";
    
    ctx.healFreezeTimer = Date.now() + 4000; // Freeze passive regeneration for 4 seconds!
    writeLog("🔥 קומבו הושלם! שחררת מכת בורקס מוחצת שהסבה 30 נזק והקפיאה את הריפוי שלו ל-4 שניות! 🔥");
    spawnFloatingText("💥 SPECIAL BUREK STRIKE! 💥", "#f39c12");

    // Play visual neon diagonal slash cut
    const slash = document.getElementById("pregSlashEffect");
    if (slash) {
      slash.style.display = "block";
      slash.className = "slash-animate";
      setTimeout(() => {
        slash.className = "";
        slash.style.display = "none";
      }, 400);
    }
    
    playSfx("audio/truimph.mp3");
    flashScreen("preg-screen-flash");
    triggerCameraShake();
    
    if (playerComboText) {
      playerComboText.innerHTML = "<span class='combo-super-strike'>💥 מכת קומבו! 💥</span>";
    }

    ctx.recipeProgress = 0;
    
    // Generate new recipe after a brief delay
    setTimeout(() => {
      if (!ctx.isGameOver && !ctx.isPhaseTransitioning) {
        generateNewRecipe();
      }
    }, 1500);

    if (ctx.bossHp <= 0) {
      endGame(true);
    }
  }

  const phantomImages = [
    "images/characters/yam_sleepy.png",
    "images/characters/yam_angry.png",
    "images/characters/yam_sad.png",
    "images/characters/yam_curious.png",
    "images/characters/yam_happy.png",
    "images/characters/yam_horny.png",
    "images/characters/yam_surpise.png",
    "images/characters/yam_alien.png"
  ];

  function spawnPhantom(imgSrc, index) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "boss-phantom-spirit";
    // Append inside bossContainer to make positioning relative to Yam's center
    bossContainer.appendChild(img);

    ctx.phantoms.push({
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
    if (ctx.isGameOver || ctx.isPhaseTransitioning) return;
    ctx.keysPressed[e.key.toLowerCase()] = true;

    // Dodge (S / ArrowDown)
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      if (ctx.isGasping) return; // Cannot dodge while gasping
      if (ctx.playerStance !== "dodging") {
        if (ctx.playerStamina < 10) {
          spawnFloatingText("🥵 EXHAUSTED!", "#ff3f3f");
          return;
        }
        ctx.playerStamina = Math.max(0, ctx.playerStamina - 10); // Entering dodge costs 10 stamina flat
        ctx.playerStance = "dodging";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
          playerStanceText.style.color = "#3498db";
        }
        ctx.crouchY = 25; // Apply displacement offset
        registerComboInput("s"); // Add S to Combo recipe evaluation
      }
    }

    // Attack (W, Up, or Space)
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
      e.preventDefault();
      if (ctx.isGasping) return; // Cannot attack while gasping
      if (ctx.playerStance !== "dodging" && Date.now() > ctx.attackCooldown) {
        triggerPlayerAttack();
      }
    }
  };

  const handleKeyUp = (e) => {
    ctx.keysPressed[e.key.toLowerCase()] = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      if (ctx.playerStance === "dodging") {
        ctx.playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
      ctx.crouchY = 0; // Reset displacement offset
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Mobile Button Actions
  if (btnAttack) {
    btnAttack.onclick = (e) => {
      e.preventDefault();
      if (ctx.isGameOver || ctx.isPhaseTransitioning || ctx.isGasping) return;
      if (ctx.playerStance !== "dodging" && Date.now() > ctx.attackCooldown) {
        triggerPlayerAttack();
      }
    };
  }

  if (btnDodge) {
    btnDodge.ontouchstart = (e) => {
      e.preventDefault();
      if (ctx.isGameOver || ctx.isPhaseTransitioning || ctx.isGasping) return;
      if (ctx.playerStance !== "dodging") {
        if (ctx.playerStamina < 10) {
          spawnFloatingText("🥵 EXHAUSTED!", "#ff3f3f");
          return;
        }
        ctx.playerStamina = Math.max(0, ctx.playerStamina - 10); // Flat entry cost
        ctx.playerStance = "dodging";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
          playerStanceText.style.color = "#3498db";
        }
        ctx.crouchY = 25;
        registerComboInput("s"); // Add S to Combo recipe evaluation on mobile
      }
    };

    btnDodge.ontouchend = (e) => {
      e.preventDefault();
      if (ctx.playerStance === "dodging") {
        ctx.playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
      ctx.crouchY = 0;
    };
  }

  // Player Attack Trigger with Stamina Drain
  function triggerPlayerAttack() {
    // If stamina is too low, player gasps for air (Exhausted)
    if (ctx.playerStamina < 35) {
      ctx.isGasping = true;
      ctx.gaspTimer = Date.now() + 1500; // Locked for 1.5 seconds
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
      spawnFloatingText("🥵 EXHAUSTED!", "#ff3f3f");
      return;
    }

    // Spend Stamina
    ctx.playerStamina = Math.max(0, ctx.playerStamina - 35);
    ctx.attackCooldown = Date.now() + 250; 
    ctx.playerStance = "attacking";
    if (playerStanceText) {
      playerStanceText.textContent = "עמידה: ⚔️ התקפה!";
      playerStanceText.style.color = "#e74c3c";
    }

    let dmg = 10;
    let attackMessage = "";

    if (ctx.bossState === "recovering") {
      dmg = ctx.phase === 2 ? 7 : 22; // Harder scaling in phase 2: only 7 crit dmg
      attackMessage = `⚔️ מכה קריטית! ים ספג ${dmg} נזק (חלש)!`;
      spawnFloatingText("⚔️ CRITICAL!", "#ffd447");
      playSfx("audio/crack.mp3");
      triggerVibrate([50, 30, 50]);
    } else {
      dmg = ctx.phase === 2 ? 1 : 10; // Harder scaling in phase 2: only 1 basic dmg
      attackMessage = `⚔️ תקפת את ים! הוא ספג ${dmg} נזק.`;
      spawnFloatingText("⚔️ HIT!", "#ffffff");
      playSfx("audio/hit.mp3");
      triggerVibrate(20);
    }

    ctx.bossHp = Math.max(0, ctx.bossHp - dmg);
    if (bossHpBar) bossHpBar.style.width = ctx.bossHp + "%";
    writeLog(attackMessage);

    // Register W to Combo recipe evaluation
    registerComboInput("w");

    // Sprite shake on hit
    bossContainer.classList.add("boss-dmg-shake");
    setTimeout(() => {
      bossContainer.classList.remove("boss-dmg-shake");
      if (ctx.playerStance === "attacking") {
        ctx.playerStance = "ready";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
    }, 200);

    if (ctx.bossHp <= 0) {
      if (ctx.phase === 1) {
        startPhase2Transition();
      } else {
        endGame(true);
      }
    }
  }

  // Phase 2 transition sequence (6-Second Epic Demonic Transformation & Phantom Summon)
  function startPhase2Transition() {
    ctx.isPhaseTransitioning = true;
    ctx.bossState = "transitioning";
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
      if (ctx.isGameOver) return;
      writeLog("🔮 ים פולט מגופו את צלילי הרפאים הרגשיים שלו! 🔮");
      phantomImages.forEach((src, idx) => {
        setTimeout(() => {
          if (ctx.isGameOver || !ctx.isPhaseTransitioning) return;
          spawnPhantom(src, idx);
          playSfx("audio/crack.mp3");
          triggerVibrate(30);
        }, idx * 180);
      });
    }, 2000);

    // 4.5 Seconds: Ignite evil aura & monster filter overrides
    setTimeout(() => {
      if (ctx.isGameOver) return;
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
      
      ctx.phase = 2;
      ctx.bossHp = 100;
      ctx.isPhaseTransitioning = false;
      ctx.bossState = "idle";
      ctx.stateTimer = Date.now() + 1000;

      generateNewRecipe(); // Initialize first recipe in Phase 2!

      if (bossNameElement) {
        bossNameElement.innerHTML = "ים, אל הבורקסים השחוטים <span style='color: #e74c3c;'>(Phase 2 - God of Burek)</span>";
        bossNameElement.style.color = "#ff3f3f";
        bossNameElement.style.textShadow = "0 0 15px #e74c3c";
      }
      
      writeLog("⚠️ שלב 2: ים התעורר לצורתו האמיתית: אל הבורקסים השחוטים! ⚠️");
    }, 6000);
  }

  // Logic Frame execution
  let logicFrameId = null;

  function gameLogicLoop() {
    if (ctx.isGameOver) return;

    // Stamina Regeneration / Dodge holding drain calculations
    if (ctx.playerStance === "dodging") {
      // Continuous stamina drain while holding dodge/shield
      ctx.playerStamina = Math.max(0, ctx.playerStamina - 0.4);
      if (ctx.playerStamina <= 0) {
        ctx.playerStance = "ready";
        ctx.crouchY = 0;
        ctx.isGasping = true;
        ctx.gaspTimer = Date.now() + 1500;
        playSfx("audio/dodge.mp3");
        triggerVibrate(150);
        if (playerStaminaText) playerStaminaText.classList.add("stamina-exhausted-flash");
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🥵 עייף מדי! *מתנשף*";
          playerStanceText.style.color = "#ff3f3f";
        }
        writeLog("🥵 מגן נשבר מחוסר סיבולת! התעייפת והתנשפת!");
        spawnFloatingText("🥵 EXHAUSTED!", "#ff3f3f");
      }
    } else if (ctx.isGasping) {
      // Slow recovery when gasping
      ctx.playerStamina = Math.min(100, ctx.playerStamina + 0.35);
      if (Date.now() > ctx.gaspTimer && ctx.playerStamina >= 35) {
        ctx.isGasping = false;
        if (playerStaminaText) playerStaminaText.classList.remove("stamina-exhausted-flash");
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ מוכן";
          playerStanceText.style.color = "#ffd447";
        }
      }
    } else {
      // Normal stamina regeneration
      const regenRate = 0.65;
      ctx.playerStamina = Math.min(100, ctx.playerStamina + regenRate);
    }

    // Check keyboard duck mapping continuously
    if (ctx.keysPressed["s"] || ctx.keysPressed["arrowdown"]) {
      if (!ctx.isGasping) {
        if (ctx.playerStance !== "dodging") {
          if (ctx.playerStamina < 10) {
            spawnFloatingText("🥵 EXHAUSTED!", "#ff3f3f");
          } else {
            ctx.playerStamina = Math.max(0, ctx.playerStamina - 10); // Flat entry cost
            ctx.playerStance = "dodging";
            if (playerStanceText) {
              playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
              playerStanceText.style.color = "#3498db";
            }
            ctx.crouchY = 25;
            registerComboInput("s"); // Add S to Combo recipe evaluation
          }
        }
      }
    }

    // Boss Combat AI State Manager
    const now = Date.now();
    if (!ctx.isPhaseTransitioning && now > ctx.stateTimer) {
      if (ctx.bossState === "idle") {
        ctx.bossState = "charging";
        ctx.stateTimer = now + (ctx.phase === 2 ? 380 : 850); // Warning time: 850ms in Ph1, 380ms in Ph2!
        yamImg.className = "boss-charging";
        if (warningFlash) warningFlash.style.display = "block";
        playSfx("audio/crack.mp3");
        triggerVibrate([40, 40, 40]);
        writeLog(ctx.phase === 2 ? "⚠️ זהירות! מכת Lunge מהירה של אל הבורקסים!" : "⚠️ ים מתכונן למתקפה קוסמית קשה!");

      } else if (ctx.bossState === "charging") {
        ctx.bossState = "lunging";
        ctx.stateTimer = now + (ctx.phase === 2 ? 180 : 250);
        if (warningFlash) warningFlash.style.display = "none";
        yamImg.className = "";

        if (ctx.playerStance === "dodging") {
          playSfx("audio/dodge.mp3");
          flashScreen("preg-screen-flash");
          writeLog("🛡️ חמיקה מושלמת! (DODGE) ים מפספס!");
          spawnFloatingText("🛡️ DODGED!", "#3498db");
          triggerVibrate(30);
        } else if (ctx.playerStance === "attacking") {
          // Punish player for spamming attacks during lunges (Counter-Attack!)
          const counterDmg = ctx.phase === 2 ? 85 : 65; // Massive counter-attack damage!
          ctx.playerHp = Math.max(0, ctx.playerHp - counterDmg);

          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          triggerCameraShake();
          ctx.temporaryHitBlur = 12; // Instant heavy blur
          writeLog(`💥 מכת נגד קטלנית! ים הדף את המתקפה והסב לך ${counterDmg} נזק! 💥`);
          spawnFloatingText("💥 PARRY COUNTER!", "#ff3f3f");
          triggerVibrate([200, 100, 200]);

          ctx.recipeProgress = 0; // Reset combo recipe progress on parry
          updateComboHUD();

          if (ctx.playerHp <= 0) {
            endGame(false);
            return;
          }
        } else {
          // Normal hit taken: 30 in Ph1, 55 in Ph2!
          const pDmg = ctx.phase === 2 ? 55 : 30;
          ctx.playerHp = Math.max(0, ctx.playerHp - pDmg);
          
          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          triggerCameraShake(); // Rumble viewport
          ctx.temporaryHitBlur = 10; 
          writeLog(`💥 פגיעה קשה! ספגת ${pDmg} נזק מים!`);
          spawnFloatingText("💥 HIT!", "#ff4747");
          triggerVibrate([120, 60, 120]);

          ctx.recipeProgress = 0; // Reset combo recipe progress on hit
          updateComboHUD();

          if (ctx.playerHp <= 0) {
            endGame(false);
            return;
          }
        }

      } else if (ctx.bossState === "lunging") {
        ctx.bossState = "recovering";
        ctx.stateTimer = now + (ctx.phase === 2 ? 500 : 800); // Tired window: 800ms in Ph1, 500ms in Ph2!
        yamImg.className = "boss-tired";
        writeLog("💤 ים התעייף ונשאר חשוף! תתקוף עכשיו!");

      } else if (ctx.bossState === "recovering") {
        ctx.bossState = "idle";
        const idleDelay = ctx.phase === 2 ? (Math.random() * 500 + 500) : (Math.random() * 1200 + 1000);
        ctx.stateTimer = now + idleDelay;
        yamImg.className = "";
        writeLog("• ים חזר לעמידה רגילה.");
      }
    }

    logicFrameId = requestAnimationFrame(gameLogicLoop);
  }

  function endGame(success) {
    ctx.isGameOver = true;
    overlay.style.display = "none";
    overlay.style.transform = ""; 

    // Stop and clean renderer animation loops
    if (window.pregRenderer && typeof window.pregRenderer.stop === "function") {
      window.pregRenderer.stop();
    }

    // Restore background theme of visual novel
    playMusic("audio/main.mp3");

    // Clean up called phantom spirits elements
    ctx.phantoms.forEach(p => {
      if (p.element) {
        p.element.remove();
      }
    });
    ctx.phantoms = [];

    if (flashEffect) {
      flashEffect.className = "";
    }
    if (particlesContainer) {
      particlesContainer.innerHTML = "";
    }

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

    ctx.phase2OffsetX = 0;
    ctx.phase2OffsetY = 0;

    ctx.recipeProgress = 0;
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

    if (logicFrameId) {
      cancelAnimationFrame(logicFrameId);
      logicFrameId = null;
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

  // Start logic update loops
  if (logicFrameId) cancelAnimationFrame(logicFrameId);
  logicFrameId = requestAnimationFrame(gameLogicLoop);
}
