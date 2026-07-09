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
  let bossHp = 200;
  let bossMercy = 0;
  let isGameOver = false;
  let turnCount = 0;
  const moods = ["lazy", "stressed", "bored", "hungry"];
  let currentMood = "lazy";
  let lastTurnHealed = false;

  // Parent scope variables for heart coordinate and touch event tracking
  let heartX = 0;
  let heartY = 0;

  function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = board.getBoundingClientRect();
    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;
    heartX = Math.max(0, Math.min(touch.clientX - rect.left - 10, boardWidth - 20));
    heartY = Math.max(0, Math.min(touch.clientY - rect.top - 10, boardHeight - 20));
    heart.style.left = heartX + "px";
    heart.style.top = heartY + "px";
  }

  // Modifiers from ACT options
  let playerAttackBonus = 0;
  let bossAttackPower = 20; // damage per hit

  // Audio setup
  if (soundToggle) soundToggle.style.display = "none";
  playMusic("audio/boss_fight.mp3"); // Play battle music

  // Console writer helper
  function writeConsole(message) {
    consoleEl.textContent = "";
    let index = 0;
    if (window.consoleTypeInterval) clearInterval(window.consoleTypeInterval);
    
    // Typewriter effect
    window.consoleTypeInterval = setInterval(() => {
      if (index < message.length) {
        consoleEl.textContent += message[index];
        index++;
      } else {
        clearInterval(window.consoleTypeInterval);
      }
    }, 20);
  }

  function updateHpBars() {
    bossHpBar.style.width = Math.max((bossHp / 200) * 100, 0) + "%";
    bossHpText.textContent = `${Math.max(bossHp, 0)} / 200`;
    playerHpBar.style.width = Math.max((playerHp / 100) * 100, 0) + "%";
    playerHpText.textContent = `${Math.max(playerHp, 0)} / 100`;

    if (playerHp <= 30) {
      playerHpBar.style.background = "#ff3b30"; // danger warning
    } else {
      playerHpBar.style.background = "#4cd137";
    }
  }

  function startPlayerTurn() {
    if (isGameOver) return;
    subMenu.style.display = "none";
    arena.style.display = "none";
    consoleEl.style.display = "block";
    actions.style.pointerEvents = "auto";
    
    // Choose a random mood for Yam this turn!
    currentMood = moods[Math.floor(Math.random() * moods.length)];
    
    // Set speech bubble text based on mood and show it
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
      turnMsg = `* ים אכל טונה עם נוטלה והתרפא ב-45 HP! איכס, איזה שילוב מזעזע.\n(רחמים: ${bossMercy}%)`;
      lastTurnHealed = false;
    } else if (bossHp < 80) {
      turnMsg = `* ים נראה מותש ודי מובס. (רחמים: ${bossMercy}%)`;
    }
    writeConsole(turnMsg);
  }

  // Action Button Listeners
  document.getElementById("btnFight").onclick = () => {
    triggerVibration(15);
    actions.style.pointerEvents = "none";
    
    // FIGHT Option
    const damage = Math.round(35 + Math.random() * 15 + playerAttackBonus);
    bossHp -= damage;
    updateHpBars();
    playSfx("audio/hit.mp3");

    writeConsole(`* תקפת את ים עם סקרינשוט נתונים! ים ספג ${damage} נזק!`);

    setTimeout(() => {
      if (bossHp <= 0) {
        winBattle(false); // Win by force
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
        name: isMuted ? "🔊 הפעל מוזיקת רקע" : "🔇 השתק מוזיקת רקע",
        action: () => {
          isMuted = !isMuted;
          music.muted = isMuted;
          sfx.muted = isMuted;
          if (soundToggle) soundToggle.textContent = isMuted ? "🔇" : "🔊";
          writeConsole(isMuted ? `* השתקת את מוזיקת הקרב.` : `* הפעלת את מוזיקת הקרב.`);
        }
      },
      {
        name: "להזמין אותו לצלם פתיחת תיבות יחד",
        action: () => {
          writeConsole(`* הזמנת אותו לפתוח תיבות! העיניים של ים בורקות מאושר...`);
          setTimeout(() => {
            isGameOver = true;
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
            if (soundToggle) soundToggle.style.display = "flex";
            overlay.style.display = "none";
            showScene("end_bed_alliance");
          }, 1800);
        },
        instantEnd: true
      }
    ];

    actOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "subBtn";
      btn.textContent = opt.name;
      btn.onclick = () => {
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
        
        // Play custom heal SFX if configured, otherwise default to healing.mp3
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
      winBattle(true); // Win by mercy/spare
    } else {
      writeConsole(`* ניסית לחוס על ים, אך הוא עדיין רוצה לישון!`);
      setTimeout(startEnemyTurn, 1800);
    }
  };

  closeSub.onclick = () => {
    triggerVibration(15);
    subMenu.style.display = "none";
  };

  // --- Real-time Bullet Hell Dodging ---
  let keysPressed = {};
  const moveSpeed = 4;
  let projectiles = [];
  
  // Track keyboard arrows
  function handleKeyDown(e) {
    keysPressed[e.key] = true;
  }
  function handleKeyUp(e) {
    keysPressed[e.key] = false;
  }

  function startEnemyTurn() {
    if (isGameOver) return;
    keysPressed = {}; // Clear any keys held down from previous turns/actions
    consoleEl.style.display = "none";
    subMenu.style.display = "none";
    arena.style.display = "block";

    // --- Yam Tuna & Nutella Healing (Disgusting Hebrew Meme!) ---
    // 45% chance to heal 45 HP if boss HP is under 150
    let healTriggered = false;
    if (bossHp < 150 && Math.random() < 0.45) {
      healTriggered = true;
      lastTurnHealed = true;
      bossHp = Math.min(bossHp + 45, 200);
      updateHpBars();
      playSfx("audio/healing.mp3");
      triggerVibration([100, 100, 100]);

      // Chew animation: food_1 -> food_2 -> food_3 -> food_2 -> food_3 -> default
      const bossSprite = document.getElementById("battleBossSprite");
      if (bossSprite) {
        setTimeout(() => { bossSprite.src = "images/yam_boss_animation_food_1.png"; }, 0);
        setTimeout(() => { bossSprite.src = "images/yam_boss_animation_food_2.png"; }, 350);
        setTimeout(() => { bossSprite.src = "images/yam_boss_animation_food_3.png"; }, 700);
        setTimeout(() => { bossSprite.src = "images/yam_boss_animation_food_2.png"; }, 1050);
        setTimeout(() => { bossSprite.src = "images/yam_boss_animation_food_3.png"; }, 1400);
        setTimeout(() => { bossSprite.src = "images/Boss_fight.png"; }, 2000);
      }
    }

    const bubble = document.getElementById("bossSpeechBubble");
    if (bubble) {
      if (healTriggered) {
        bubble.textContent = "יאמי!\nטונה עם\nנוטלה!!";
        bubble.style.display = "block";
        setTimeout(() => { bubble.style.display = "none"; }, 2500);
      } else {
        // Yam Speaks next to his animated sprite! (Broken with \n for perfect bubble fit!)
        const quotes = [
          "אתה לא תנצח\nאת כוח השינה\nשלי!",
          "אני עייף מדי\nבשביל הנזק\nהזה...",
          "עוד מילה אחת\nואני מוחק את\nשרת הדיסקורד!",
          "הקליקים האלה\nכואבים לי!",
          "מישהו אמר\nבורקס חם?!",
          "אני רק רוצה\nלחזור לישון..."
        ];
        bubble.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        bubble.style.display = "block";
        setTimeout(() => { bubble.style.display = "none"; }, 2500);
      }
    }

    // Reset heart position to center of board
    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;
    heartX = boardWidth / 2 - 10;
    heartY = boardHeight / 2 - 10;
    heart.style.left = heartX + "px";
    heart.style.top = heartY + "px";

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Dynamic keyboard movement loop
    window.battleMoveInterval = setInterval(() => {
      if (keysPressed["ArrowUp"] || keysPressed["w"]) heartY = Math.max(heartY - moveSpeed, 0);
      if (keysPressed["ArrowDown"] || keysPressed["s"]) heartY = Math.min(heartY + moveSpeed, boardHeight - 20);
      if (keysPressed["ArrowLeft"] || keysPressed["a"]) heartX = Math.max(heartX - moveSpeed, 0);
      if (keysPressed["ArrowRight"] || keysPressed["d"]) heartX = Math.min(heartX + moveSpeed, boardWidth - 20);

      heart.style.left = heartX + "px";
      heart.style.top = heartY + "px";
    }, 16);

    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchstart", handleTouchMove, { passive: false });

    // --- Dynamic Strategic Attack Phases ---
    turnCount++;
    const currentPattern = turnCount % 4; // Cycled through 4 distinct patterns!

    function spawnRandomProjectile() {
      const emojis = ["🥫", "🥐", "😴", "💤"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const proj = document.createElement("div");
      proj.className = "projectile";
      proj.textContent = emoji;

      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { // Top
        x = Math.random() * boardWidth;
        y = -20;
      } else if (edge === 1) { // Bottom
        x = Math.random() * boardWidth;
        y = boardHeight + 20;
      } else if (edge === 2) { // Left
        x = -20;
        y = Math.random() * boardHeight;
      } else { // Right
        x = boardWidth + 20;
        y = Math.random() * boardHeight;
      }

      proj.style.left = x + "px";
      proj.style.top = y + "px";
      arena.appendChild(proj);

      const angle = Math.atan2(heartY - y, heartX - x);
      const speed = 3.0 + Math.random() * 2; // Slightly faster to increase difficulty
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      projectiles.push({
        el: proj,
        x: x,
        y: y,
        vx: vx,
        vy: vy
      });
    }

    function spawnProjectileAt(x, y, vx, vy) {
      const proj = document.createElement("div");
      proj.className = "projectile";
      proj.textContent = "🥫";
      proj.style.left = x + "px";
      proj.style.top = y + "px";
      arena.appendChild(proj);
      projectiles.push({
        el: proj,
        x: x,
        y: y,
        vx: vx,
        vy: vy
      });
    }

    if (currentPattern === 0) {
      // Pattern 0: Warning Lasers! Dashed warning line -> massive glowing beam
      const spawnLaser = (dir) => {
        if (isGameOver) return;
        const targetX = heartX + 10;
        const targetY = heartY + 10;
        const warn = document.createElement("div");
        warn.className = "laser-warning";
        
        if (dir === "vertical") {
          warn.style.left = (targetX - 3) + "px";
          warn.style.top = "0px";
          warn.style.width = "6px";
          warn.style.height = boardHeight + "px";
        } else {
          warn.style.left = "0px";
          warn.style.top = (targetY - 3) + "px";
          warn.style.width = boardWidth + "px";
          warn.style.height = "6px";
        }
        board.appendChild(warn);
        playSfx("audio/hit.mp3");
        
        setTimeout(() => {
          if (isGameOver) {
            warn.remove();
            return;
          }
          warn.remove();
          
          const beam = document.createElement("div");
          beam.className = "laser-beam";
          
          if (dir === "vertical") {
            beam.style.left = (targetX - 25) + "px";
            beam.style.top = "0px";
            beam.style.width = "50px";
            beam.style.height = boardHeight + "px";
          } else {
            beam.style.left = "0px";
            beam.style.top = (targetY - 25) + "px";
            beam.style.width = boardWidth + "px";
            beam.style.height = "50px";
          }
          board.appendChild(beam);
          playSfx("audio/hit.mp3");
          
          let checkCount = 0;
          const checkInterval = setInterval(() => {
            if (isGameOver) {
              clearInterval(checkInterval);
              beam.remove();
              return;
            }
            
            const heartCenterX = heartX + 10;
            const heartCenterY = heartY + 10;
            let hit = false;
            if (dir === "vertical") {
              const minX = targetX - 25;
              const maxX = targetX + 25;
              if (heartCenterX >= minX && heartCenterX <= maxX) hit = true;
            } else {
              const minY = targetY - 25;
              const maxY = targetY + 25;
              if (heartCenterY >= minY && heartCenterY <= maxY) hit = true;
            }
            
            if (hit) {
              playerHp -= 10;
              updateHpBars();
              triggerVibration(50);
              overlay.classList.add("battle-dmg-flash");
              setTimeout(() => overlay.classList.remove("battle-dmg-flash"), 100);
              if (playerHp <= 0) {
                clearInterval(checkInterval);
                loseBattle();
              }
            }
            
            checkCount++;
            if (checkCount >= 8) {
              clearInterval(checkInterval);
              beam.remove();
            }
          }, 100);
        }, 850); // Warning time decreased from 1000ms to 850ms for higher difficulty!
      };
      
      window.laser1Timeout = setTimeout(() => spawnLaser("vertical"), 500);
      window.laser2Timeout = setTimeout(() => spawnLaser("horizontal"), 2800);

      let spawnCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (spawnCount >= 5) return;
        spawnRandomProjectile();
        spawnCount++;
      }, 900);
      
    } else if (currentPattern === 1) {
      // Pattern 1: Burek Orbiters (rotating shield around center)
      for (let j = 0; j < 4; j++) {
        const orb = document.createElement("div");
        orb.className = "projectile";
        orb.textContent = "🥐";
        orb.style.fontSize = "24px";
        arena.appendChild(orb);
        projectiles.push({
          el: orb,
          isOrbiter: true,
          angleOffset: (j * Math.PI / 2),
          radius: 85,
          x: 0,
          y: 0
        });
      }
      
      window.battleSpawnInterval = setInterval(() => {
        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "😴";
        const x = Math.random() * (boardWidth - 20);
        const y = -20;
        proj.style.left = x + "px";
        proj.style.top = y + "px";
        arena.appendChild(proj);
        
        projectiles.push({
          el: proj,
          x: x,
          y: y,
          vx: 0,
          vy: 2.8 // Increased speed from 2.2 to 2.8 for higher difficulty!
        });
      }, 600); // Spawn interval decreased from 700ms to 600ms
      
    } else if (currentPattern === 2) {
      // Pattern 2: Targeted Crossfire (Cans Converge on Heart Location!)
      let round = 0;
      const spawnTargetedProj = (startX, startY) => {
        if (isGameOver) return;
        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "🥫";
        proj.style.left = startX + "px";
        proj.style.top = startY + "px";
        arena.appendChild(proj);
        
        const angle = Math.atan2(heartY - startY, heartX - startX);
        const speed = 3.6;
        projectiles.push({
          el: proj,
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      };

      window.battleSpawnInterval = setInterval(() => {
        if (round >= 5) return;
        spawnTargetedProj(Math.random() * boardWidth, -20);
        spawnTargetedProj(Math.random() * boardWidth, boardHeight + 20);
        spawnTargetedProj(-20, Math.random() * boardHeight);
        spawnTargetedProj(boardWidth + 20, Math.random() * boardHeight);
        round++;
      }, 1000);
    } else {
      // Pattern 3: Angry Bus Attack! Giant 🚌 warns and sweeps the screen.
      const spawnBus = (yPosition, delay) => {
        if (isGameOver) return;
        
        const warn = document.createElement("div");
        warn.className = "bus-warning";
        warn.style.left = "0px";
        warn.style.top = yPosition + "px";
        warn.style.width = boardWidth + "px";
        warn.style.height = "55px";
        board.appendChild(warn);
        playSfx("audio/hit.mp3");
        
        setTimeout(() => {
          if (isGameOver) {
            warn.remove();
            return;
          }
          warn.remove();
          
          const bus = document.createElement("div");
          bus.className = "bus-projectile";
          bus.textContent = "🚌";
          bus.style.left = "-80px";
          bus.style.top = yPosition + "px";
          bus.style.width = "70px";
          bus.style.height = "50px";
          arena.appendChild(bus);
          playSfx("audio/hit.mp3");
          
          projectiles.push({
            el: bus,
            x: -80,
            y: yPosition,
            vx: 8.5, // Extremely fast!
            vy: 0,
            isBus: true
          });
        }, delay);
      };
      
      window.bus1Timeout = setTimeout(() => spawnBus(boardHeight / 2 - 25, 900), 500);
      window.bus2Timeout = setTimeout(() => spawnBus(boardHeight - 65, 900), 2800);
      
      let spawnCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (spawnCount >= 4) return;
        spawnRandomProjectile();
        spawnCount++;
      }, 1000);
    }

    // Projectile position update and collision loop
    window.battleUpdateInterval = setInterval(() => {
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        if (p.isOrbiter) {
          p.angleOffset += 0.045; // Orbit speed increased from 0.035 to 0.045!
          // Oscillate radius between 20px (sweeps center) and 110px over time to crush the center!
          const currentRadius = 65 + Math.sin(Date.now() / 250) * 45;
          p.x = boardWidth / 2 - 10 + Math.cos(p.angleOffset) * currentRadius;
          p.y = boardHeight / 2 - 10 + Math.sin(p.angleOffset) * currentRadius;
          p.el.style.left = p.x + "px";
          p.el.style.top = p.y + "px";
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.el.style.left = p.x + "px";
          p.el.style.top = p.y + "px";
        }

        // Collision Check (AABB)
        const heartRect = heart.getBoundingClientRect();
        const projRect = p.el.getBoundingClientRect();

        const overlap = !(
          heartRect.right < projRect.left ||
          heartRect.left > projRect.right ||
          heartRect.bottom < projRect.top ||
          heartRect.top > projRect.bottom
        );

        if (overlap) {
          const dmg = p.isBus ? 45 : bossAttackPower;
          playerHp -= dmg;
          updateHpBars();
          playSfx("audio/hit.mp3");
          triggerVibration(p.isBus ? [200, 100, 200] : 120);

          overlay.classList.add("battle-dmg-flash");
          setTimeout(() => overlay.classList.remove("battle-dmg-flash"), 200);

          p.el.remove();
          projectiles.splice(i, 1);

          if (playerHp <= 0) {
            loseBattle();
            return;
          }
          continue;
        }

        // --- Graze Check (If close but not overlapping, and not grazed yet) ---
        if (!p.grazed) {
          const grazeBoxSize = 25; // 25px graze zone around the heart
          const grazeOverlap = !(
            (heartRect.right + grazeBoxSize) < projRect.left ||
            (heartRect.left - grazeBoxSize) > projRect.right ||
            (heartRect.bottom + grazeBoxSize) < projRect.top ||
            (heartRect.top - grazeBoxSize) > projRect.bottom
          );

          if (grazeOverlap) {
            p.grazed = true;
            playSfx("audio/click.mp3"); // Tick sound for audio feedback
            playerHp = Math.min(playerHp + 1, 100);
            updateHpBars();
            showGrazeText();
          }
        }

        // Clean up out of bounds projectiles
        if (!p.isOrbiter && (p.x < -100 || p.x > boardWidth + 100 || p.y < -100 || p.y > boardHeight + 100)) {
          p.el.remove();
          projectiles.splice(i, 1);
        }
      }
    }, 16);

    // End enemy turn after 6 seconds
    window.battleTurnTimeout = setTimeout(() => {
      cleanupEnemyTurn();
      startPlayerTurn();
    }, 6000);

    function cleanupEnemyTurn() {
      clearInterval(window.battleMoveInterval);
      clearInterval(window.battleSpawnInterval);
      clearInterval(window.battleUpdateInterval);
      clearTimeout(window.battleTurnTimeout);
      clearTimeout(window.laser1Timeout);
      clearTimeout(window.laser2Timeout);
      clearTimeout(window.bus1Timeout);
      clearTimeout(window.bus2Timeout);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      board.removeEventListener("touchmove", handleTouchMove);
      board.removeEventListener("touchstart", handleTouchMove);

      document.querySelectorAll(".laser-warning, .laser-beam, .bus-warning").forEach(el => el.remove());
      projectiles.forEach(p => p.el.remove());
      projectiles = [];
    }
  }

  function showGrazeText() {
    const grazeEl = document.createElement("div");
    grazeEl.className = "graze-text";
    grazeEl.textContent = "+1 HP";
    grazeEl.style.left = (heartX + Math.random() * 16 - 8) + "px";
    grazeEl.style.top = (heartY - 12) + "px";
    arena.appendChild(grazeEl);

    setTimeout(() => {
      grazeEl.remove();
    }, 450);
  }

  function loseBattle() {
    isGameOver = true;
    clearInterval(window.battleMoveInterval);
    clearInterval(window.battleSpawnInterval);
    clearInterval(window.battleUpdateInterval);
    clearTimeout(window.battleTurnTimeout);
    clearTimeout(window.laser1Timeout);
    clearTimeout(window.laser2Timeout);
    clearTimeout(window.bus1Timeout);
    clearTimeout(window.bus2Timeout);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    board.removeEventListener("touchmove", handleTouchMove);
    board.removeEventListener("touchstart", handleTouchMove);

    document.querySelectorAll(".laser-warning, .laser-beam, .bus-warning").forEach(el => el.remove());
    projectiles.forEach(p => p.el.remove());
    projectiles = [];

    if (soundToggle) soundToggle.style.display = "flex";
    overlay.style.display = "none";
    showScene(config.nextFail);
  }

  function winBattle(spared) {
    isGameOver = true;
    clearInterval(window.battleMoveInterval);
    clearInterval(window.battleSpawnInterval);
    clearInterval(window.battleUpdateInterval);
    clearTimeout(window.battleTurnTimeout);
    clearTimeout(window.laser1Timeout);
    clearTimeout(window.laser2Timeout);
    clearTimeout(window.bus1Timeout);
    clearTimeout(window.bus2Timeout);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    board.removeEventListener("touchmove", handleTouchMove);
    board.removeEventListener("touchstart", handleTouchMove);
    projectiles.forEach(p => p.el.remove());
    projectiles = [];

    if (spared) {
      if (soundToggle) soundToggle.style.display = "flex";
      overlay.style.display = "none";
      showScene("boss_fight_spare");
    } else {
      // Play dramatic death animation!
      const bossSprite = document.getElementById("battleBossSprite");
      if (bossSprite) bossSprite.classList.add("boss-death-animation");
      playSfx("audio/hit.mp3");
      triggerVibration([100, 100, 100, 100, 600]);

      setTimeout(() => {
        if (bossSprite) bossSprite.classList.remove("boss-death-animation");
        if (soundToggle) soundToggle.style.display = "flex";
        overlay.style.display = "none";
        showScene(config.nextSuccess);
      }, 3500);
    }
  }

  // Start the first turn
  updateHpBars();
  startPlayerTurn();
}
