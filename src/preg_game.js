// --- Space VR Pregnancy Minigame: Dark Souls Space Combat Engine ---

function runPregnancyGame(onSuccess, onFail) {
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

  const btnAttack = document.getElementById("pregBtnAttack");
  const btnDodge = document.getElementById("pregBtnDodge");

  overlay.style.display = "flex";

  // Initial State parameters
  let playerHp = 100;
  let bossHp = 100;
  let isGameOver = false;

  // Stances: "ready", "dodging", "attacking"
  let playerStance = "ready";
  // Boss States: "idle", "charging", "lunging", "recovering"
  let bossState = "idle";
  let stateTimer = Date.now() + 1500; // Attack telegraph timer starts in 1.5s
  let attackCooldown = 0;

  let keysPressed = {};

  // Log write helper
  function writeLog(msg) {
    combatLog.textContent = msg;
  }

  // Audio & Vibration utilities
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

  // Flash overlays
  function flashScreen(type) {
    overlay.classList.remove("preg-screen-hit", "preg-screen-flash");
    void overlay.offsetWidth; // force DOM reflow
    overlay.classList.add(type);
    setTimeout(() => {
      overlay.classList.remove(type);
    }, 350);
  }

  // Keyboard events
  const handleKeyDown = (e) => {
    if (isGameOver) return;
    keysPressed[e.key.toLowerCase()] = true;

    // Dodge (S or ArrowDown)
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      playerStance = "dodging";
      playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
      playerStanceText.style.color = "#3498db";
    }

    // Attack (W, Space, or ArrowUp)
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
      e.preventDefault();
      if (playerStance !== "dodging" && Date.now() > attackCooldown) {
        triggerPlayerAttack();
      }
    }
  };

  const handleKeyUp = (e) => {
    keysPressed[e.key.toLowerCase()] = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      playerStance = "ready";
      playerStanceText.textContent = "עמידה: 🛡️ מוכן";
      playerStanceText.style.color = "#ffd447";
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Mobile Touch handlers
  btnAttack.onclick = (e) => {
    e.preventDefault();
    if (isGameOver) return;
    if (playerStance !== "dodging" && Date.now() > attackCooldown) {
      triggerPlayerAttack();
    }
  };

  btnDodge.ontouchstart = (e) => {
    e.preventDefault();
    if (isGameOver) return;
    playerStance = "dodging";
    playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
    playerStanceText.style.color = "#3498db";
  };

  btnDodge.ontouchend = (e) => {
    e.preventDefault();
    playerStance = "ready";
    playerStanceText.textContent = "עמידה: 🛡️ מוכן";
    playerStanceText.style.color = "#ffd447";
  };

  // Player action logic
  function triggerPlayerAttack() {
    attackCooldown = Date.now() + 300; // Attack throttle
    playerStance = "attacking";
    playerStanceText.textContent = "עמידה: ⚔️ התקפה!";
    playerStanceText.style.color = "#e74c3c";

    let dmg = 10;
    let attackMessage = "";

    // Dark Souls critical hit windows
    if (bossState === "recovering") {
      dmg = 22; // Double damage during boss recovery window
      attackMessage = `⚔️ מכה קריטית! ים ספג ${dmg} נזק (חלש)!`;
      playSfx("audio/crack.mp3");
      triggerVibrate([50, 30, 50]);
    } else {
      attackMessage = `⚔️ תקפת את ים! הוא ספג ${dmg} נזק.`;
      playSfx("audio/hit.mp3");
      triggerVibrate(20);
    }

    bossHp = Math.max(0, bossHp - dmg);
    bossHpBar.style.width = bossHp + "%";
    writeLog(attackMessage);

    // Lunge character sprite shake
    bossContainer.classList.add("boss-dmg-shake");
    setTimeout(() => {
      bossContainer.classList.remove("boss-dmg-shake");
      if (playerStance === "attacking") {
        playerStance = "ready";
        playerStanceText.textContent = "עמידה: 🛡️ מוכן";
        playerStanceText.style.color = "#ffd447";
      }
    }, 250);

    if (bossHp <= 0) {
      endGame(true);
    }
  }

  // Space Render & Game physics loop
  let spaceAngle = 0;
  function gameLoop() {
    if (isGameOver) return;

    // VR 360 Parallax nebula spin
    spaceAngle += 0.8;
    const pulse = 1 + Math.sin(Date.now() / 450) * 0.03;
    space.style.transform = `rotate(${spaceAngle}deg) scale(${pulse})`;

    // Check continuously if dodge key is held down (fallback safety)
    if (keysPressed["s"] || keysPressed["arrowdown"]) {
      playerStance = "dodging";
      playerStanceText.textContent = "עמידה: 🛡️ התחמקות (כפוף)";
      playerStanceText.style.color = "#3498db";
    }

    // Boss AI State Machine
    const now = Date.now();
    if (now > stateTimer) {
      if (bossState === "idle") {
        // Telegraphing attack phase
        bossState = "charging";
        stateTimer = now + 900; // 900ms warning window
        yamImg.classList.add("boss-charging");
        warningFlash.style.display = "block";
        playSfx("audio/crack.mp3");
        triggerVibrate([40, 40, 40]);
        writeLog("⚠️ ים מתכונן למתקפה קוסמית קשה!");
        
      } else if (bossState === "charging") {
        // Attack lunge execution
        bossState = "lunging";
        stateTimer = now + 250; // Hit window duration
        warningFlash.style.display = "none";
        yamImg.classList.remove("boss-charging");
        
        // 3D Lunge perspective scale
        bossContainer.style.transform = "translate(-50%, -15%) scale(2.8)";

        // Collision Check
        if (playerStance === "dodging") {
          // Dodge successful
          playSfx("audio/dodge.mp3");
          flashScreen("preg-screen-flash");
          writeLog("🛡️ חמיקה מושלמת! (DODGE) ים מפספס!");
          triggerVibrate(30);
        } else {
          // Hit taken
          playerHp = Math.max(0, playerHp - 25);
          playerHpBar.style.width = playerHp + "%";
          playerHpText.textContent = `${playerHp} / 100`;
          playSfx("audio/hit.mp3");
          flashScreen("preg-screen-hit");
          writeLog("💥 פגיעה קשה! ספגת 25 נזק מים!");
          triggerVibrate([100, 50, 100]);

          if (playerHp <= 0) {
            endGame(false);
            return;
          }
        }
        
      } else if (bossState === "lunging") {
        // Recovery/tired cooldown phase
        bossState = "recovering";
        stateTimer = now + 1200; // 1.2s vulnerability window
        bossContainer.style.transform = "translate(-50%, -50%) scale(1)";
        yamImg.classList.add("boss-tired");
        writeLog("💤 ים התעייף ונשאר חשוף! תתקוף עכשיו!");
        
      } else if (bossState === "recovering") {
        // Return to idle
        bossState = "idle";
        stateTimer = now + (Math.random() * 1000 + 800); // Random idle window
        yamImg.classList.remove("boss-tired");
        writeLog("• ים חזר לעמידה רגילה.");
      }
    }

    requestAnimationFrame(gameLoop);
  }

  function endGame(success) {
    isGameOver = true;
    overlay.style.display = "none";

    // Clean up event listeners
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    btnAttack.onclick = null;
    btnDodge.ontouchstart = null;
    btnDodge.ontouchend = null;

    // Reset styles
    bossContainer.style.transform = "";
    yamImg.className = "";
    warningFlash.style.display = "none";

    if (success) {
      onSuccess();
    } else {
      onFail();
    }
  }

  // Update starting stats
  playerHpBar.style.width = "100%";
  playerHpText.textContent = "100 / 100";
  bossHpBar.style.width = "100%";
  playerStanceText.textContent = "עמידה: 🛡️ מוכן";
  playerStanceText.style.color = "#ffd447";
  writeLog("• הקרב התחיל. התחמק בזמן (S) ותקוף (W)!");

  // Start loop
  requestAnimationFrame(gameLoop);
}
