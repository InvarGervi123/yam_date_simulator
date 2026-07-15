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

  const playerStaminaBar = document.getElementById("pregPlayerStaminaBar");
  const playerStaminaText = document.getElementById("pregPlayerStaminaText");

  const btnAttack = document.getElementById("pregBtnAttack");
  const btnDodge = document.getElementById("pregBtnDodge");

  if (!overlay || !space || !bossContainer || !yamImg) {
    console.error("Critical Pregnancy VR minigame elements are missing in DOM. Fallback skip...");
    onSuccess(); // Safe fallback to avoid blocking user gameplay
    return;
  }

  overlay.style.display = "flex";
  
  if (particlesContainer) {
    particlesContainer.innerHTML = ""; // Clear debris safely
  }
  if (flashEffect) {
    flashEffect.className = ""; // Reset flash overlay
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

  let keysPressed = {};
  let particles = [];
  let lastParticleSpawn = 0;
  let temporaryHitBlur = 0; // Decays over time when hit
  let crouchY = 0; // Relative pixel translation offset for 3D ducking

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
      playerStance = "dodging";
      if (playerStanceText) {
        playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
        playerStanceText.style.color = "#3498db";
      }
      crouchY = 25; // Apply displacement offset instead of translating overlay
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
      playerStance = "dodging";
      if (playerStanceText) {
        playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
        playerStanceText.style.color = "#3498db";
      }
      crouchY = 25;
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
      dmg = phase === 2 ? 12 : 22; // Harder scaling in phase 2: only 12 crit dmg
      attackMessage = `⚔️ מכה קריטית! ים ספג ${dmg} נזק (חלש)!`;
      playSfx("audio/crack.mp3");
      triggerVibrate([50, 30, 50]);
    } else {
      dmg = phase === 2 ? 5 : 10; // Harder scaling in phase 2: only 5 basic dmg
      attackMessage = `⚔️ תקפת את ים! הוא ספג ${dmg} נזק.`;
      playSfx("audio/hit.mp3");
      triggerVibrate(20);
    }

    bossHp = Math.max(0, bossHp - dmg);
    if (bossHpBar) bossHpBar.style.width = bossHp + "%";
    writeLog(attackMessage);

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

  // Phase 2 transition sequence
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
    writeLog("💥 שלב 1 הושלם! אבל ים עדיין לא נכנע... 💥");

    // Intense camera shake
    triggerCameraShake();

    // Sprite transitions
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      const sx = (Math.random() - 0.5) * 20;
      const sy = (Math.random() - 0.5) * 20;
      bossContainer.style.transform = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px)) scale(1.1)`;
      shakeCount++;
      if (shakeCount > 15) {
        clearInterval(shakeInterval);
      }
    }, 80);

    // Refill health bar
    let healingHp = 0;
    const healInterval = setInterval(() => {
      healingHp += 5;
      if (bossHpBar) bossHpBar.style.width = healingHp + "%";
      if (healingHp >= 100) {
        clearInterval(healInterval);
        
        phase = 2;
        bossHp = 100;
        isPhaseTransitioning = false;
        bossState = "idle";
        stateTimer = Date.now() + 1000;

        if (bossNameElement) {
          bossNameElement.innerHTML = "ים, אל הבורקסים השחוטים <span style='color: #e74c3c;'>(Phase 2 - God of Burek)</span>";
          bossNameElement.style.color = "#ff3f3f";
          bossNameElement.style.textShadow = "0 0 15px #e74c3c";
        }
        
        playSfx("audio/break.mp3");
        writeLog("⚠️ שלב 2: ים התעורר לצורתו האמיתית: אל הבורקסים השחוטים! ⚠️");
      }
    }, 80);
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
        playerStance = "dodging";
        if (playerStanceText) {
          playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
          playerStanceText.style.color = "#3498db";
        }
        crouchY = 25;
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
      bossContainer.style.transform = `translate(-50%, calc(${bossState === "lunging" ? "-15%" : "-50%"} + ${crouchY}px)) scale(${scaleMultiplier}) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

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
        stateTimer = now + (phase === 2 ? 480 : 850); // Warning time: 850ms in Ph1, 480ms in Ph2!
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

          if (playerHp <= 0) {
            endGame(false);
            return;
          }
        } else {
          // Normal hit taken: 30 in Ph1, 45 in Ph2!
          const pDmg = phase === 2 ? 45 : 30;
          playerHp = Math.max(0, playerHp - pDmg);
          if (playerHpBar) playerHpBar.style.width = playerHp + "%";
          if (playerHpText) playerHpText.textContent = `${playerHp} / 100`;
          
          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          triggerCameraShake(); // Rumble viewport
          temporaryHitBlur = 10; 
          writeLog(`💥 פגיעה קשה! ספגת ${pDmg} נזק מים!`);
          triggerVibrate([120, 60, 120]);

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
    if (warningFlash) warningFlash.style.display = "none";

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
  writeLog("• הקרב התחיל. התחמק בזמן (S) ותקוף (W)!");

  // Start Loop
  requestAnimationFrame(gameLoop);
}
