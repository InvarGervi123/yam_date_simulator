// --- Deltarune Turn-based Boss Battle Engine ---

function runDeltaruneBattle(config) {
  const overlay = document.getElementById("battleOverlay");
  const bossHpBar = document.getElementById("bossHpBar");
  const bossHpText = document.getElementById("bossHpText");
  const playerHpBar = document.getElementById("playerHpBar");
  const playerHpText = document.getElementById("playerHpText");
  const consoleEl = document.getElementById("battleConsole");
  const arena = document.getElementById("battleArena");
  const actions = document.getElementById("battleActions");
  const subMenu = document.getElementById("battleSubMenu");
  const subList = document.getElementById("battleSubList");
  const closeSub = document.getElementById("closeSubMenu");
  const heart = document.getElementById("playerHeart");
  const board = document.getElementById("battleBoard");

  overlay.style.display = "flex";

  let playerHp = 100;
  let playerTp = 0;
  let hasShield = false;
  let bossHp = 200;
  let bossMercy = 0;
  let isGameOver = false;
  let turnCount = 0;
  const moods = ["lazy", "stressed", "bored", "hungry"];
  let currentMood = "lazy";
  let lastTurnHealed = false;

  let heartX = 0;
  let heartY = 0;
  let projectiles = [];

  // Modifiers from ACT options
  let playerAttackBonus = 0;
  let bossAttackPower = 20; // damage per hit

  // Key state placeholder for sharing
  let keysPressed = {};

  // Input event handler placeholders to share closures
  let activeKeyDownHandler = null;
  let activeKeyUpHandler = null;
  let activeTouchHandler = null;

  // Getter/setter context bridge to share state with battle_arena.js
  /**
   * @typedef {Object} BattleCtx
   * @property {number} playerHp - Player health points (0 to 100).
   * @property {number} playerTp - Tension points percentage (0 to 100).
   * @property {boolean} hasShield - State if the player has active shield block.
   * @property {number} bossHp - Boss health points (0 to 200).
   * @property {number} bossMercy - Boss mercy/spare progress percentage (0 to 100).
   * @property {boolean} isGameOver - Flag indicating if the turn battle ended.
   * @property {number} turnCount - Number of completed battle turns.
   * @property {number} heartX - Dodging heart X coordinate.
   * @property {number} heartY - Dodging heart Y coordinate.
   * @property {boolean} lastTurnHealed - Tracking if player used a healing item on the last turn.
   * @property {number} bossAttackPower - Attack damage modifier of the Boss.
   * @property {Object} keysPressed - Dictionary of actively held keyboard keys.
   * @property {Array<Object>} projectiles - Active bullets/hazards inside the dodging arena.
   */
  const battleCtx = {
    get playerHp() { return playerHp; },
    set playerHp(v) { playerHp = v; updateHpBars(); },
    get playerTp() { return playerTp; },
    set playerTp(v) { playerTp = v; updateHpBars(); },
    get hasShield() { return hasShield; },
    set hasShield(v) { hasShield = v; },
    get bossHp() { return bossHp; },
    set bossHp(v) { bossHp = v; updateHpBars(); },
    get bossMercy() { return bossMercy; },
    set bossMercy(v) { bossMercy = v; },
    get isGameOver() { return isGameOver; },
    set isGameOver(v) { isGameOver = v; },
    get turnCount() { return turnCount; },
    set turnCount(v) { turnCount = v; },
    get heartX() { return heartX; },
    set heartX(v) { heartX = v; },
    get heartY() { return heartY; },
    set heartY(v) { heartY = v; },
    get lastTurnHealed() { return lastTurnHealed; },
    set lastTurnHealed(v) { lastTurnHealed = v; },
    get bossAttackPower() { return bossAttackPower; },
    
    get keysPressed() { return keysPressed; },
    set keysPressed(v) { keysPressed = v; },
    get projectiles() { return projectiles; },
    set projectiles(v) { projectiles = v; },
    
    get activeKeyDownHandler() { return activeKeyDownHandler; },
    set activeKeyDownHandler(v) { activeKeyDownHandler = v; },
    get activeKeyUpHandler() { return activeKeyUpHandler; },
    set activeKeyUpHandler(v) { activeKeyUpHandler = v; },
    get activeTouchHandler() { return activeTouchHandler; },
    set activeTouchHandler(v) { activeTouchHandler = v; },

    overlay, bossHpBar, bossHpText, playerHpBar, playerHpText,
    consoleEl, arena, actions, subMenu, subList, closeSub, heart, board,
    config, soundToggle: document.getElementById("soundToggle"),

    playSfx, triggerVibration,
    loseBattle, winBattle, updateHpBars, startPlayerTurn
  };

  function playSfx(src) {
    if (window.audioEngine && typeof window.audioEngine.playSfx === "function") {
      window.audioEngine.playSfx(src);
    }
  }

  function triggerVibration(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function writeConsole(msg) {
    consoleEl.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i >= msg.length || isGameOver) {
        clearInterval(interval);
        return;
      }
      consoleEl.textContent += msg[i];
      i++;
    }, 10);
  }

  function updateHpBars() {
    bossHpBar.style.width = Math.max((bossHp / 200) * 100, 0) + "%";
    bossHpText.textContent = `${Math.max(bossHp, 0)} / 200`;
    playerHpBar.style.width = Math.max((playerHp / 100) * 100, 0) + "%";
    playerHpText.textContent = `${Math.max(playerHp, 0)} / 100`;

    if (playerHp <= 30) {
      playerHpBar.style.background = "#ff3b30";
    } else {
      playerHpBar.style.background = "#4cd137";
    }

    const tpBar = document.getElementById("playerTpBar");
    const tpText = document.getElementById("playerTpText");
    if (tpBar && tpText) {
      tpBar.style.width = playerTp + "%";
      tpText.textContent = playerTp + "%";
      if (playerTp >= 100) {
        tpBar.style.background = "#ff9f43";
        tpText.style.color = "#ff9f43";
        tpText.textContent = "MAX!";
      } else {
        tpBar.style.background = "#e67e22";
        tpText.style.color = "#ff9f43";
      }
    }
  }

  function startPlayerTurn() {
    if (isGameOver) return;
    subMenu.style.display = "none";
    arena.style.display = "none";
    consoleEl.style.display = "block";
    actions.style.pointerEvents = "auto";
    
    currentMood = moods[Math.floor(Math.random() * moods.length)];
    
    const bossSprite = document.getElementById("battleBossSprite");
    if (bossSprite) {
      bossSprite.classList.remove("boss-mood-sleepy", "boss-mood-angry", "boss-mood-sad", "boss-mood-happy");
      if (currentMood === "lazy") bossSprite.classList.add("boss-mood-sleepy");
      else if (currentMood === "stressed") bossSprite.classList.add("boss-mood-angry");
      else if (currentMood === "bored") bossSprite.classList.add("boss-mood-sad");
      else if (currentMood === "hungry") bossSprite.classList.add("boss-mood-happy");
    }
    
    let quote = "";
    if (currentMood === "lazy") {
      quote = "זזז...\nאל תעירו אותי\nמחקירות...";
    } else if (currentMood === "stressed") {
      quote = "הצפיות של הערוץ\nיורדות! מה\nנעשה?!";
    } else if (currentMood === "bored") {
      quote = "משעמם לי...\nאין לי כוח\nלדייטים.";
    } else if (currentMood === "hungry") {
      quote = "אני מוכן למות\nבשביל בורקס\nחם...";
    }
    const bubble = document.getElementById("bossSpeechBubble");
    if (bubble) {
      bubble.textContent = quote;
      bubble.style.display = "block";
    }

    let turnMsg = `* ים מביט בך במצב רוח מיוחד. מה תעשה/י?\n(רחמים: ${bossMercy}%)`;
    if (lastTurnHealed) {
      turnMsg = `* ים אכל טונה עם נוטלה והחזיר חיים! יאק!\n` + turnMsg;
      lastTurnHealed = false;
    }
    writeConsole(turnMsg);
  }

  function startEnemyTurn() {
    if (window.battleArena && typeof window.battleArena.startEnemyTurn === "function") {
      window.battleArena.startEnemyTurn(battleCtx);
    }
  }

  // --- UI Action Button Handlers ---
  document.getElementById("btnFight").onclick = () => {
    triggerVibration(15);
    actions.style.pointerEvents = "none";
    
    const damage = Math.floor(Math.random() * 15) + 15 + playerAttackBonus;
    bossHp = Math.max(bossHp - damage, 0);
    updateHpBars();
    playSfx("audio/hit.mp3");
    triggerVibration([80, 50, 80]);

    const container = document.getElementById("battleBossSpriteContainer");
    if (container) {
      container.classList.add("boss-dmg-shake");
      setTimeout(() => container.classList.remove("boss-dmg-shake"), 500);
    }

    writeConsole(`* תקפת את ים עם סקרינשוט נתונים! ים ספג ${damage} נזק!`);

    setTimeout(() => {
      if (bossHp <= 0) {
        winBattle(false);
      } else {
        startEnemyTurn();
      }
    }, 1800);
  };

  document.getElementById("btnAct").onclick = () => {
    triggerVibration(15);
    subList.innerHTML = "";
    subMenu.style.display = "flex";

    const actOptions = [
      {
        name: "🔍 בדוק (CHECK)",
        action: () => {
          let hint = "";
          if (currentMood === "lazy") {
            hint = "* ים שמואל - עצלן במיוחד. הוא ישן עמוק.\n* רמז: משהו קיצוני צריך להעיר אותו.";
          } else if (currentMood === "stressed") {
            hint = "* ים שמואל - לחוץ מהערוץ. הביטחון שלו ברצפה.\n* רמז: הוא זקוק למילים חמות על העיצובים שלו.";
          } else if (currentMood === "bored") {
            hint = "* ים שמואל - משועמם למוות.\n* רמז: אולי שיר או הופעה קטנה יעוררו אותו.";
          } else if (currentMood === "hungry") {
            hint = "* ים שמואל - רעב בצורה מפחידה.\n* רמז: תציע לו מאפה בצק חם!";
          }
          writeConsole(hint);
        }
      },
      {
        name: "לאיים למחוק את שרת הדיסקורד",
        action: () => {
          if (currentMood === "lazy") {
            bossMercy = Math.min(bossMercy + 40, 100);
            writeConsole(`* איימת למחוק את השרת! ים קפץ בבהלה! הרחמים עלו ב-40%.`);
          } else {
            bossAttackPower += 6;
            writeConsole(`* האיום סתם עיצבן את ים! (כוח התקיפה שלו עלה ב-6!)`);
          }
        }
      },
      {
        name: "להציע לו בורקס חם",
        action: () => {
          if (currentMood === "hungry") {
            bossMercy = Math.min(bossMercy + 40, 100);
            writeConsole(`* הצעת לו בורקס חם! הוא אכל בשמחה. הרחמים עלו ב-40%.`);
          } else {
            bossAttackPower += 6;
            writeConsole(`* ים סירב לאכול והתעצבן! הוא לא רעב כרגע. (כוח התקיפה שלו עלה ב-6!)`);
          }
        }
      },
      {
        name: "להחמיא לטאמבנייל החדש שלו",
        action: () => {
          if (currentMood === "stressed") {
            bossMercy = Math.min(bossMercy + 40, 100);
            writeConsole(`* החמאת לו על הטאמבנייל! הוא קיבל ביטחון. הרחמים עלו ב-40%.`);
          } else {
            bossAttackPower += 6;
            writeConsole(`* ים התעצבן: 'אל תחמיא לי סתם!' (כוח התקיפה שלו עלה ב-6!)`);
          }
        }
      },
      {
        name: "לשיר לו שיר של ינוור",
        action: () => {
          if (currentMood === "bored") {
            bossMercy = Math.min(bossMercy + 50, 100);
            playerHp = Math.max(playerHp - 10, 1);
            updateHpBars();
            writeConsole(`* שרת לו שיר של ינוור! הוא התעורר מהשעמום! הרחמים עלו ב-50% (ספגת 10 קרינג').`);
          } else {
            bossAttackPower += 6;
            writeConsole(`* השיר של ינוור סתם עיצבן אותו! (כוח התקיפה שלו עלה ב-6!)`);
          }
        }
      },
      {
        name: config.soundToggleText || "🔇 השתק מוזיקת רקע",
        action: () => {
          const isMuted = !window.audioEngine.muted;
          window.audioEngine.muted = isMuted;
          if (window.audioEngine.bgm) window.audioEngine.bgm.muted = isMuted;
          const s = document.getElementById("soundToggle");
          if (s) s.textContent = isMuted ? "🔇" : "🔊";
          writeConsole(isMuted ? `* השתקת את מוזיקת הקרב.` : `* הפעלת את מוזיקת הקרב.`);
        }
      },
      {
        name: "להזמין אותו לצלם פתיחת תיבות יחד",
        action: () => {
          writeConsole(`* הזמנת אותו לפתוח תיבות! העיניים של ים בורקות מאושר...`);
          setTimeout(() => {
            isGameOver = true;
            const soundToggle = document.getElementById("soundToggle");
            if (soundToggle) soundToggle.style.display = "flex";
            overlay.style.display = "none";
            showScene("end_unboxing_collab");
          }, 1800);
        },
        instantEnd: true
      },
      {
        name: "לגלות לו שהחלפת לו את ה-Switch בבורקס",
        action: () => {
          writeConsole(`* אמרת לו שהחלפת את הסוויץ' שלו בבורקס! ים נכנס לזעם מטורף...`);
          setTimeout(() => {
            isGameOver = true;
            const soundToggle = document.getElementById("soundToggle");
            if (soundToggle) soundToggle.style.display = "flex";
            overlay.style.display = "none";
            showScene("end_switch_rage");
          }, 1800);
        },
        instantEnd: true
      },
      {
        name: "להציע לו לחלוק את שמיכת הפוך יחד",
        action: () => {
          writeConsole(`* הצעת לו לחלוק את השמיכה! ים מתלהב מעסקת השינה...`);
          setTimeout(() => {
            isGameOver = true;
            const soundToggle = document.getElementById("soundToggle");
            if (soundToggle) soundToggle.style.display = "flex";
            overlay.style.display = "none";
            showScene("end_bed_alliance");
          }, 1800);
        },
        instantEnd: true
      },
      {
        name: "🛡️ סופר: בורקס מגן (100% TP)",
        isSuper: true,
        action: () => {
          playerTp = 0;
          updateHpBars();
          hasShield = true;
          writeConsole(`* הפעלת בורקס מגן! אתה חסין לחלוטין מכל נזק בתור הבא!`);
          triggerVibration([100, 50, 100]);
        }
      },
      {
        name: "🚀 סופר: סאב בוסט (100% TP)",
        isSuper: true,
        instantEnd: true,
        action: () => {
          playerTp = 0;
          updateHpBars();
          const dmg = 85;
          bossHp = Math.max(bossHp - dmg, 0);
          updateHpBars();
          writeConsole(`* הפעלת סאב בוסט! ערוץ יוטיוב קיבל גל סאבים מטורף! ים ספג ${dmg} נזק!`);
          triggerVibration([300, 100, 300]);

          const container = document.getElementById("battleBossSpriteContainer");
          if (container) {
            container.classList.add("boss-dmg-shake");
            setTimeout(() => container.classList.remove("boss-dmg-shake"), 500);
          }

          if (bossHp <= 0) {
            setTimeout(() => winBattle(false), 1800);
          } else {
            setTimeout(startEnemyTurn, 1800);
          }
        }
      }
    ];

    actOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "subBtn";
      btn.textContent = opt.name;
      
      if (opt.isSuper && playerTp < 100) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.textContent += " (טעינה...)";
      }
      
      btn.onclick = () => {
        if (opt.isSuper && playerTp < 100) return;
        triggerVibration(20);
        subMenu.style.display = "none";
        actions.style.pointerEvents = "none";
        opt.action();
        if (opt.instantEnd) return;
        setTimeout(startEnemyTurn, 2000);
      };
      subList.appendChild(btn);
    });
  };

  document.getElementById("btnItem").onclick = () => {
    triggerVibration(15);
    subList.innerHTML = "";
    subMenu.style.display = "flex";

    const items = config.items || [
      { name: "בורקס חם (מרפא 50 HP)", heal: 50, sfx: "audio/healing.mp3" },
      { name: "פחית אנרגיה (מרפא 30 HP)", heal: 30, sfx: "audio/click.mp3" }
    ];

    items.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "subBtn";
      btn.textContent = item.name;
      btn.onclick = () => {
        triggerVibration(20);
        subMenu.style.display = "none";
        actions.style.pointerEvents = "none";
        playerHp = Math.min(playerHp + item.heal, 100);
        updateHpBars();
        
        playSfx(item.sfx || "audio/healing.mp3");

        writeConsole(`* אכלת ${item.name.split(' ')[0]}! נרפאת ב-${item.heal} נקודות חיים.`);
        setTimeout(startEnemyTurn, 1800);
      };
      subList.appendChild(btn);
    });
  };

  document.getElementById("btnSpare").onclick = () => {
    triggerVibration(15);
    actions.style.pointerEvents = "none";
    if (bossMercy >= 100 || bossHp <= 40) {
      winBattle(true);
    } else {
      writeConsole(`* ניסית לחוס על ים, אך הוא עדיין רוצה לישון!`);
      setTimeout(startEnemyTurn, 1800);
    }
  };

  closeSub.onclick = () => {
    triggerVibration(15);
    subMenu.style.display = "none";
  };

  function handleBattleKeyDown(e) {
    if (isGameOver) return;

    // If sub-menu is open
    if (subMenu.style.display === "flex") {
      // Backspace or Escape closes sub-menu
      if (e.key === "Backspace" || e.key === "Escape") {
        e.preventDefault();
        closeSub.click();
        return;
      }
      
      // Numbers 1-9 select sub-menu items
      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (subList.children[index]) {
          e.preventDefault();
          subList.children[index].click();
        }
      }
      return;
    }

    // Main Menu navigation (only when pointerEvents is not none)
    if (actions.style.pointerEvents !== "none") {
      if (e.key === "1") {
        e.preventDefault();
        document.getElementById("btnFight").click();
      } else if (e.key === "2") {
        e.preventDefault();
        document.getElementById("btnAct").click();
      } else if (e.key === "3") {
        e.preventDefault();
        document.getElementById("btnItem").click();
      } else if (e.key === "4") {
        e.preventDefault();
        document.getElementById("btnSpare").click();
      }
    }
  }

  function loseBattle() {
    isGameOver = true;
    playerTp = 0;
    hasShield = false;
    
    window.removeEventListener("keydown", handleBattleKeyDown);

    if (window.battleArena && typeof window.battleArena.cleanupEnemyTurn === "function") {
      window.battleArena.cleanupEnemyTurn(battleCtx);
    }

    const s = document.getElementById("soundToggle");
    if (s) s.style.display = "flex";
    overlay.style.display = "none";
    showScene(config.nextFail);
  }

  function winBattle(spared) {
    isGameOver = true;
    playerTp = 0;
    hasShield = false;

    window.removeEventListener("keydown", handleBattleKeyDown);

    if (window.battleArena && typeof window.battleArena.cleanupEnemyTurn === "function") {
      window.battleArena.cleanupEnemyTurn(battleCtx);
    }

    if (spared) {
      const s = document.getElementById("soundToggle");
      if (s) s.style.display = "flex";
      overlay.style.display = "none";
      showScene("boss_fight_spare");
    } else {
      const bossSprite = document.getElementById("battleBossSprite");
      if (bossSprite) bossSprite.classList.add("boss-death-animation");
      playSfx("audio/hit.mp3");
      triggerVibration([100, 100, 100, 100, 600]);

      setTimeout(() => {
        if (bossSprite) bossSprite.classList.remove("boss-death-animation");
        const s = document.getElementById("soundToggle");
        if (s) s.style.display = "flex";
        overlay.style.display = "none";
        showScene(config.nextSuccess);
      }, 3500);
    }
  }

  window.addEventListener("keydown", handleBattleKeyDown);

  // Start battle
  updateHpBars();
  startPlayerTurn();
}
