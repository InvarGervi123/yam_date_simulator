// --- Deltarune Active Dodging Arena Module (8 Sequential Stages & Undertale Soul Modes) ---

window.battleArena = {
  handleTouchMove: (e, ctx) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = ctx.board.getBoundingClientRect();
    const boardWidth = ctx.board.clientWidth;
    const boardHeight = ctx.board.clientHeight;
    ctx.heartX = Math.max(0, Math.min(touch.clientX - rect.left - 10, boardWidth - 20));
    ctx.heartY = Math.max(0, Math.min(touch.clientY - rect.top - 10, boardHeight - 20));
    ctx.heart.style.left = ctx.heartX + "px";
    ctx.heart.style.top = ctx.heartY + "px";
  },

  startEnemyTurn: function(ctx) {
    if (ctx.isGameOver) return;
    
    // Clear keys pressed
    ctx.keysPressed = {};
    
    // UI toggle
    ctx.consoleEl.style.display = "none";
    ctx.subMenu.style.display = "none";
    ctx.arena.style.display = "block";

    const boardWidth = ctx.board.clientWidth;
    const boardHeight = ctx.board.clientHeight;
    
    let keysPressed = ctx.keysPressed;
    const moveSpeed = 4;
    let projectiles = ctx.projectiles;
    let playerShots = [];

    // Stage & Soul Mode determination (8 Sequential Patterns)
    ctx.turnCount = ctx.turnCount || 0;
    ctx.turnCount++;
    const currentPattern = (ctx.turnCount - 1) % 8;

    // Reset heart classes & soul modes
    ctx.heart.classList.remove("soul-blue", "soul-green", "soul-yellow");
    let soulMode = "red";

    if (currentPattern === 4) {
      soulMode = "blue";
      ctx.heart.classList.add("soul-blue");
    } else if (currentPattern === 5) {
      soulMode = "green";
      ctx.heart.classList.add("soul-green");
    } else if (currentPattern === 7) {
      soulMode = "yellow";
      ctx.heart.classList.add("soul-yellow");
    }

    // Shield Deflector Element for Green Soul
    let shieldEl = null;
    let shieldDir = "up"; // 'up', 'down', 'left', 'right'
    if (soulMode === "green") {
      shieldEl = document.getElementById("shieldDeflector");
      if (!shieldEl) {
        shieldEl = document.createElement("div");
        shieldEl.id = "shieldDeflector";
        ctx.board.appendChild(shieldEl);
      }
      shieldEl.style.display = "block";
    }

    // Physics variables for Blue Soul
    let heartVy = 0;
    const gravity = 0.42;

    // Keyboard handlers
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed[e.key] = true;
      if (k === "w" || e.code === "KeyW" || k === "ק" || k === "׳") keysPressed["w"] = true;
      if (k === "s" || e.code === "KeyS" || k === "ד") keysPressed["s"] = true;
      if (k === "a" || e.code === "KeyA" || k === "ש") keysPressed["a"] = true;
      if (k === "d" || e.code === "KeyD" || k === "ג") keysPressed["d"] = true;

      // Blue Soul Jump
      if (soulMode === "blue" && (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp" || k === "w" || k === "ק" || k === "׳")) {
        if (ctx.heartY >= boardHeight - 22) {
          heartVy = -8.8;
          ctx.playSfx("audio/click.mp3");
        }
      }

      // Green Soul Shield Rotate (Layout-Independent: Arrow Keys, Physical e.code, and Hebrew Key Equivalents)
      if (soulMode === "green") {
        const prevDir = shieldDir;
        if (e.key === "ArrowUp" || e.code === "KeyW" || k === "w" || k === "ק" || k === "׳") shieldDir = "up";
        if (e.key === "ArrowDown" || e.code === "KeyS" || k === "s" || k === "ד") shieldDir = "down";
        if (e.key === "ArrowLeft" || e.code === "KeyA" || k === "a" || k === "ש") shieldDir = "left";
        if (e.key === "ArrowRight" || e.code === "KeyD" || k === "d" || k === "ג") shieldDir = "right";
        if (prevDir !== shieldDir) {
          ctx.playSfx("audio/click.mp3");
        }
      }

      // Yellow Soul Shoot Laser
      if (soulMode === "yellow" && (e.code === "Space" || e.code === "KeyZ" || e.code === "Enter" || k === "z" || k === "ז")) {
        spawnPlayerLaser();
      }

      // Dev Stage Skip Shortcut (P / p / פ / KeyP)
      if (e.code === "KeyP" || k === "p" || k === "פ") {
        ctx.playSfx("audio/click.mp3");
        this.showGrazeText(ctx, "⏩ STAGE SKIPPED!");
        this.cleanupEnemyTurn(ctx);
        ctx.startPlayerTurn();
        return;
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      keysPressed[e.key] = false;
      if (k === "w" || e.code === "KeyW" || k === "ק" || k === "׳") keysPressed["w"] = false;
      if (k === "s" || e.code === "KeyS" || k === "ד") keysPressed["s"] = false;
      if (k === "a" || e.code === "KeyA" || k === "ש") keysPressed["a"] = false;
      if (k === "d" || e.code === "KeyD" || k === "ג") keysPressed["d"] = false;
    };
    
    ctx.activeKeyDownHandler = handleKeyDown;
    ctx.activeKeyUpHandler = handleKeyUp;

    function spawnPlayerLaser() {
      if (ctx.isGameOver) return;
      const shot = document.createElement("div");
      shot.className = "player-laser-shot";
      const sx = ctx.heartX + 7;
      const sy = ctx.heartY - 12;
      shot.style.left = sx + "px";
      shot.style.top = sy + "px";
      ctx.arena.appendChild(shot);
      ctx.playSfx("audio/click.mp3");

      playerShots.push({
        el: shot,
        x: sx,
        y: sy,
        vy: -9
      });
    }

    // --- Yam Tuna & Nutella Healing Check ---
    let healTriggered = false;
    if (ctx.bossHp < 150 && Math.random() < 0.4) {
      healTriggered = true;
      ctx.lastTurnHealed = true;
      ctx.bossHp = Math.min(ctx.bossHp + 45, 200);
      ctx.playSfx("audio/healing.mp3");
      ctx.triggerVibration([100, 100, 100]);

      const bossSprite = document.getElementById("battleBossSprite");
      if (bossSprite) {
        setTimeout(() => { bossSprite.src = "images/characters/yam_boss_animation_food_1.png"; }, 0);
        setTimeout(() => { bossSprite.src = "images/characters/yam_boss_animation_food_2.png"; }, 350);
        setTimeout(() => { bossSprite.src = "images/characters/yam_boss_animation_food_3.png"; }, 700);
        setTimeout(() => { bossSprite.src = "images/characters/yam_boss_animation_food_2.png"; }, 1050);
        setTimeout(() => { bossSprite.src = "images/characters/yam_boss_animation_food_3.png"; }, 1400);
        setTimeout(() => { bossSprite.src = "images/characters/Boss_fight.png"; }, 2000);
      }
    }

    const bubble = document.getElementById("bossSpeechBubble");
    if (bubble) {
      if (healTriggered) {
        bubble.textContent = "יאמי!\nטונה עם\nנוטלה!!";
        bubble.style.display = "block";
        setTimeout(() => { bubble.style.display = "none"; }, 2500);
      } else {
        const quotes = [
          "אתה לא תנצח\nאת כוח השינה!",
          "אני עייף מדי\nבשביל הנזק...",
          "עוד מילה אחת\nואני מוחק את השרת!",
          "הקליקים האלה\nכואבים לי!",
          "מישהו אמר\nבורקס חם?!",
          "תראה את ה-Soul Mode\nהחדש שלי!",
          "זה שלב " + (currentPattern + 1) + "!\nתרגיש את העוצמה!",
          "אני רק רוצה\nלחזור לישון..."
        ];
        bubble.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        bubble.style.display = "block";
        setTimeout(() => { bubble.style.display = "none"; }, 2500);
      }
    }

    // Reset heart position based on Soul Mode
    if (soulMode === "green") {
      ctx.heartX = boardWidth / 2 - 10;
      ctx.heartY = boardHeight / 2 - 10;
    } else {
      ctx.heartX = boardWidth / 2 - 10;
      ctx.heartY = boardHeight / 2 - 10;
    }
    ctx.heart.style.left = ctx.heartX + "px";
    ctx.heart.style.top = ctx.heartY + "px";

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // --- Dynamic Movement Loop ---
    let prevHeartX = ctx.heartX;
    let prevHeartY = ctx.heartY;

    window.battleMoveInterval = setInterval(() => {
      prevHeartX = ctx.heartX;
      prevHeartY = ctx.heartY;

      if (soulMode === "blue") {
        // Blue Soul Gravity
        heartVy += gravity;
        ctx.heartY += heartVy;
        if (keysPressed["ArrowLeft"] || keysPressed["a"]) ctx.heartX = Math.max(ctx.heartX - moveSpeed, 0);
        if (keysPressed["ArrowRight"] || keysPressed["d"]) ctx.heartX = Math.min(ctx.heartX + moveSpeed, boardWidth - 20);

        if (ctx.heartY >= boardHeight - 20) {
          ctx.heartY = boardHeight - 20;
          heartVy = 0;
        }
      } else if (soulMode === "green") {
        // Green Soul Center-Lock
        ctx.heartX = boardWidth / 2 - 10;
        ctx.heartY = boardHeight / 2 - 10;

        if (shieldEl) {
          const hcx = ctx.heartX + 10;
          const hcy = ctx.heartY + 10;
          const orbitR = 24;

          if (shieldDir === "up") {
            shieldEl.style.transform = `translate(${hcx - 18}px, ${hcy - orbitR - 4}px) rotate(0deg)`;
          } else if (shieldDir === "down") {
            shieldEl.style.transform = `translate(${hcx - 18}px, ${hcy + orbitR - 4}px) rotate(180deg)`;
          } else if (shieldDir === "left") {
            shieldEl.style.transform = `translate(${hcx - orbitR - 18}px, ${hcy - 4}px) rotate(-90deg)`;
          } else if (shieldDir === "right") {
            shieldEl.style.transform = `translate(${hcx + orbitR - 18}px, ${hcy - 4}px) rotate(90deg)`;
          }
        }
      } else {
        // Standard Red / Yellow Soul
        if (keysPressed["ArrowUp"] || keysPressed["w"]) ctx.heartY = Math.max(ctx.heartY - moveSpeed, 0);
        if (keysPressed["ArrowDown"] || keysPressed["s"]) ctx.heartY = Math.min(ctx.heartY + moveSpeed, boardHeight - 20);
        if (keysPressed["ArrowLeft"] || keysPressed["a"]) ctx.heartX = Math.max(ctx.heartX - moveSpeed, 0);
        if (keysPressed["ArrowRight"] || keysPressed["d"]) ctx.heartX = Math.min(ctx.heartX + moveSpeed, boardWidth - 20);
      }

      ctx.heart.style.left = ctx.heartX + "px";
      ctx.heart.style.top = ctx.heartY + "px";
    }, 16);

    // --- Mobile Touch Event Handler (Full Soul Mode Support) ---
    const handleTouchInteraction = (e) => {
      e.preventDefault();
      if (ctx.isGameOver) return;
      const touch = e.touches[0];
      if (!touch) return;

      const rect = ctx.board.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      if (soulMode === "green") {
        // Green Soul: Touch quadrant rotates shield
        const dx = touchX - boardWidth / 2;
        const dy = touchY - boardHeight / 2;
        const prevDir = shieldDir;

        if (Math.abs(dx) > Math.abs(dy)) {
          shieldDir = dx > 0 ? "right" : "left";
        } else {
          shieldDir = dy > 0 ? "down" : "up";
        }

        if (prevDir !== shieldDir) {
          ctx.playSfx("audio/click.mp3");
        }
      } else if (soulMode === "blue") {
        // Blue Soul: Touch jump + horizontal drag
        ctx.heartX = Math.max(0, Math.min(touchX - 10, boardWidth - 20));
        if (e.type === "touchstart" && ctx.heartY >= boardHeight - 22) {
          heartVy = -8.8;
          ctx.playSfx("audio/click.mp3");
        }
      } else if (soulMode === "yellow") {
        // Yellow Soul: Touch shoot + drag
        ctx.heartX = Math.max(0, Math.min(touchX - 10, boardWidth - 20));
        ctx.heartY = Math.max(0, Math.min(touchY - 10, boardHeight - 20));
        if (e.type === "touchstart") {
          spawnPlayerLaser();
        }
      } else {
        // Red Soul: Standard drag
        ctx.heartX = Math.max(0, Math.min(touchX - 10, boardWidth - 20));
        ctx.heartY = Math.max(0, Math.min(touchY - 10, boardHeight - 20));
      }

      ctx.heart.style.left = ctx.heartX + "px";
      ctx.heart.style.top = ctx.heartY + "px";
    };

    ctx.activeTouchHandler = handleTouchInteraction;
    ctx.board.addEventListener("touchmove", handleTouchInteraction, { passive: false });
    ctx.board.addEventListener("touchstart", handleTouchInteraction, { passive: false });

    // Helper to spawn projectiles
    function spawnRandomProjectile() {
      const emojis = ["🥫", "🥐", "😴", "💤"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const proj = document.createElement("div");
      proj.className = "projectile";
      proj.textContent = emoji;

      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * boardWidth; y = -20; }
      else if (edge === 1) { x = Math.random() * boardWidth; y = boardHeight + 20; }
      else if (edge === 2) { x = -20; y = Math.random() * boardHeight; }
      else { x = boardWidth + 20; y = Math.random() * boardHeight; }

      proj.style.left = x + "px";
      proj.style.top = y + "px";
      ctx.arena.appendChild(proj);

      const angle = Math.atan2(ctx.heartY - y, ctx.heartX - x);
      const speed = 3.6 + Math.random() * 2;
      projectiles.push({ el: proj, x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
    }

    // --- Dispatch 8 High-Density Rapid-Fire Attack Patterns ---
    if (currentPattern === 0) {
      // Stage 1: Fast Crosshair Lasers & Continuous Corner Cans
      const spawnCrosshairLaser = () => {
        if (ctx.isGameOver) return;
        const targetX = ctx.heartX + 10;
        const targetY = ctx.heartY + 10;
        
        const warnV = document.createElement("div");
        warnV.className = "laser-warning";
        warnV.style.left = (targetX - 3) + "px"; warnV.style.top = "0px"; warnV.style.width = "6px"; warnV.style.height = boardHeight + "px";
        ctx.board.appendChild(warnV);

        const warnH = document.createElement("div");
        warnH.className = "laser-warning";
        warnH.style.left = "0px"; warnH.style.top = (targetY - 3) + "px"; warnH.style.width = boardWidth + "px"; warnH.style.height = "6px";
        ctx.board.appendChild(warnH);
        ctx.playSfx("audio/hit.mp3");

        setTimeout(() => {
          if (ctx.isGameOver) { warnV.remove(); warnH.remove(); return; }
          warnV.remove(); warnH.remove();

          const beamV = document.createElement("div");
          beamV.className = "laser-beam";
          beamV.style.left = (targetX - 25) + "px"; beamV.style.top = "0px"; beamV.style.width = "50px"; beamV.style.height = boardHeight + "px";
          ctx.board.appendChild(beamV);

          const beamH = document.createElement("div");
          beamH.className = "laser-beam";
          beamH.style.left = "0px"; beamH.style.top = (targetY - 25) + "px"; beamH.style.width = boardWidth + "px"; beamH.style.height = "50px";
          ctx.board.appendChild(beamH);
          ctx.playSfx("audio/hit.mp3");

          // Active Laser Damage Check during beam flash
          let laserHitDone = false;
          const checkLaserDamage = () => {
            if (ctx.isGameOver || laserHitDone) return;
            const hRect = ctx.heart.getBoundingClientRect();
            const vRect = beamV.getBoundingClientRect();
            const hRectBeam = beamH.getBoundingClientRect();

            const hitV = !(hRect.right < vRect.left || hRect.left > vRect.right || hRect.bottom < vRect.top || hRect.top > vRect.bottom);
            const hitH = !(hRect.right < hRectBeam.left || hRect.left > hRectBeam.right || hRect.bottom < hRectBeam.top || hRect.top > hRectBeam.bottom);

            if (hitV || hitH) {
              laserHitDone = true;
              if (ctx.hasShield) {
                ctx.playSfx("audio/healing.mp3");
                this.showGrazeText(ctx, "BLOCKED!");
                ctx.hasShield = false;
                return;
              }

              ctx.playerHp -= 30; // 30 Damage per laser hit!
              ctx.playSfx("audio/hit.mp3");
              ctx.triggerVibration([200, 100, 200]);
              ctx.overlay.classList.add("battle-dmg-flash");
              setTimeout(() => ctx.overlay.classList.remove("battle-dmg-flash"), 200);

              if (ctx.playerHp <= 0) {
                ctx.loseBattle();
              }
            }
          };

          const laserCheckInt = setInterval(checkLaserDamage, 30);

          setTimeout(() => {
            clearInterval(laserCheckInt);
            beamV.remove();
            beamH.remove();
          }, 400);
        }, 500);
      };

      window.laser1Timeout = setTimeout(() => spawnCrosshairLaser(), 200);
      window.laser2Timeout = setTimeout(() => spawnCrosshairLaser(), 1600);

      let trapCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (trapCount >= 10) return;
        const trap = document.createElement("div");
        trap.className = "projectile";
        trap.textContent = "🥫";
        const tx = Math.random() * (boardWidth - 30);
        trap.style.left = tx + "px"; trap.style.top = "-20px";
        ctx.arena.appendChild(trap);
        projectiles.push({ el: trap, x: tx, y: -20, vx: (Math.random() - 0.5) * 2.5, vy: 3.2 });
        trapCount++;
      }, 300);

    } else if (currentPattern === 1) {
      // Stage 2: 4 Pulsing Orbit Croissants & Smooth Zzz Drops
      for (let j = 0; j < 4; j++) {
        const orb = document.createElement("div");
        orb.className = "projectile";
        orb.textContent = "🥐";
        orb.style.fontSize = "22px";
        ctx.arena.appendChild(orb);
        projectiles.push({ el: orb, isOrbiter: true, angleOffset: (j * Math.PI / 2), x: 0, y: 0 });
      }

      window.battleSpawnInterval = setInterval(() => {
        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "😴";
        const x = Math.random() * (boardWidth - 20);
        proj.style.left = x + "px"; proj.style.top = "-20px";
        ctx.arena.appendChild(proj);
        projectiles.push({ el: proj, x: x, y: -20, vx: (Math.random() - 0.5) * 1.2, vy: 2.4 });
      }, 550);

    } else if (currentPattern === 2) {
      // Stage 3: Rapid Homing Tuna Cans
      let round = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (round >= 12) return;
        const spawnHoming = (sx, sy) => {
          if (ctx.isGameOver) return;
          const proj = document.createElement("div");
          proj.className = "projectile";
          proj.textContent = "🥫";
          proj.style.left = sx + "px"; proj.style.top = sy + "px";
          ctx.arena.appendChild(proj);

          const angle = Math.atan2(ctx.heartY - sy, ctx.heartX - sx);
          projectiles.push({ el: proj, x: sx, y: sy, vx: Math.cos(angle) * 3.6, vy: Math.sin(angle) * 3.6, isHoming: true });
        };
        const edge = round % 4;
        let sx = Math.random() * boardWidth, sy = -20;
        if (edge === 1) { sx = boardWidth + 20; sy = Math.random() * boardHeight; }
        else if (edge === 2) { sx = Math.random() * boardWidth; sy = boardHeight + 20; }
        else if (edge === 3) { sx = -20; sy = Math.random() * boardHeight; }
        spawnHoming(sx, sy);
        round++;
      }, 350);

    } else if (currentPattern === 3) {
      // Stage 4: Triple Bus & Falling Cans
      const spawnBus = (isVert, pos, delay) => {
        if (ctx.isGameOver) return;
        const warn = document.createElement("div");
        warn.className = "bus-warning";
        if (isVert) {
          warn.style.left = pos + "px"; warn.style.top = "0px"; warn.style.width = "55px"; warn.style.height = boardHeight + "px";
        } else {
          warn.style.left = "0px"; warn.style.top = pos + "px"; warn.style.width = boardWidth + "px"; warn.style.height = "55px";
        }
        ctx.board.appendChild(warn);
        ctx.playSfx("audio/hit.mp3");

        setTimeout(() => {
          if (ctx.isGameOver) { warn.remove(); return; }
          warn.remove();
          const bus = document.createElement("div");
          bus.className = "bus-projectile";
          bus.textContent = "🚌";
          if (isVert) {
            bus.style.left = pos + "px"; bus.style.top = "-80px"; bus.style.width = "50px"; bus.style.height = "70px";
            projectiles.push({ el: bus, x: pos, y: -80, vx: 0, vy: 9.5, isBus: true });
          } else {
            bus.style.left = "-80px"; bus.style.top = pos + "px"; bus.style.width = "70px"; bus.style.height = "50px";
            projectiles.push({ el: bus, x: -80, y: pos, vx: 9.5, vy: 0, isBus: true });
          }
          ctx.arena.appendChild(bus);
          ctx.playSfx("audio/hit.mp3");
        }, delay);
      };

      window.bus1Timeout = setTimeout(() => spawnBus(false, boardHeight / 2 - 25, 600), 300);
      window.bus2Timeout = setTimeout(() => spawnBus(true, boardWidth / 2 - 25, 600), 1200);

      let canDrop = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (canDrop >= 8) return;
        spawnRandomProjectile();
        canDrop++;
      }, 300);

    } else if (currentPattern === 4) {
      // Stage 5: Splitting Pillow Storm + Blue Soul Gravity + Wind Gust
      let pillowsSpawned = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (pillowsSpawned >= 6) return;
        const pillow = document.createElement("div");
        pillow.className = "projectile";
        pillow.textContent = "🛋️";
        pillow.style.fontSize = "26px";
        const x = Math.random() * (boardWidth - 60) + 30;
        pillow.style.left = x + "px"; pillow.style.top = "-30px";
        ctx.arena.appendChild(pillow);

        projectiles.push({ el: pillow, x: x, y: -30, vx: (Math.random() - 0.5) * 3.5, vy: 3.8, isPillow: true });
        pillowsSpawned++;
      }, 450);

    } else if (currentPattern === 5) {
      // Stage 6: Green Shield Rhythm Deflector
      const cx = boardWidth / 2 - 10;
      const cy = boardHeight / 2 - 10;
      const dirs = [
        { angle: -Math.PI / 2 }, // Top (0)
        { angle: 0 },            // Right (1)
        { angle: Math.PI / 2 },  // Bottom (2)
        { angle: Math.PI }       // Left (3)
      ];

      let pairCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (ctx.isGameOver || pairCount >= 6) return;
        const dir1 = dirs[Math.floor(Math.random() * dirs.length)];
        let dir2 = dirs[Math.floor(Math.random() * dirs.length)];
        while (dir2 === dir1) dir2 = dirs[Math.floor(Math.random() * dirs.length)];

        const spawnBullet = (dirObj, delayMs) => {
          setTimeout(() => {
            if (ctx.isGameOver) return;
            const dist = 160;
            const sx = cx + Math.cos(dirObj.angle) * dist;
            const sy = cy + Math.sin(dirObj.angle) * dist;

            const proj = document.createElement("div");
            proj.className = "projectile";
            proj.textContent = "🥐";
            proj.style.fontSize = "22px";
            proj.style.left = sx + "px"; proj.style.top = sy + "px";
            ctx.arena.appendChild(proj);

            const speed = 3.1;
            projectiles.push({ el: proj, x: sx, y: sy, vx: -Math.cos(dirObj.angle) * speed, vy: -Math.sin(dirObj.angle) * speed });
          }, delayMs);
        };

        spawnBullet(dir1, 0);
        spawnBullet(dir2, 320);
        pairCount++;
      }, 750);

    } else if (currentPattern === 6) {
      // Stage 7: Cyan & Orange Rapid Mixed Pairs
      let pairWave = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (pairWave >= 8) return;
        const x = Math.random() * (boardWidth - 40) + 20;

        // Cyan (Stand still)
        const cyanProj = document.createElement("div");
        cyanProj.className = "projectile proj-cyan";
        cyanProj.textContent = "🧊";
        cyanProj.style.left = x + "px"; cyanProj.style.top = "-20px";
        ctx.arena.appendChild(cyanProj);
        projectiles.push({ el: cyanProj, x: x, y: -20, vx: 0, vy: 3.8, isCyan: true, isOrange: false });

        // Orange (Keep moving) - 160ms right behind
        setTimeout(() => {
          if (ctx.isGameOver) return;
          const orangeProj = document.createElement("div");
          orangeProj.className = "projectile proj-orange";
          orangeProj.textContent = "🔥";
          orangeProj.style.left = x + "px"; orangeProj.style.top = "-20px";
          ctx.arena.appendChild(orangeProj);
          projectiles.push({ el: orangeProj, x: x, y: -20, vx: 0, vy: 3.8, isCyan: false, isOrange: true });
        }, 160);

        pairWave++;
      }, 450);

    } else {
      // Stage 8: Yellow Soul Target Core Wall Intercept
      let wallWave = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (wallWave >= 5) return;
        const cols = 5;
        const gapCol = Math.floor(Math.random() * cols);
        const colWidth = boardWidth / cols;

        for (let c = 0; c < cols; c++) {
          if (c === gapCol) continue; // Gap for player to shoot/pass through
          const cx = c * colWidth + colWidth / 2 - 10;
          const proj = document.createElement("div");
          proj.className = "projectile";
          proj.textContent = "🥫";
          proj.style.left = cx + "px"; proj.style.top = "-30px";
          ctx.arena.appendChild(proj);
          projectiles.push({ el: proj, x: cx, y: -30, vx: 0, vy: 3.2 });
        }
        wallWave++;
      }, 650);
    }

    // --- Dodging Collision and Update Loop ---
    window.battleUpdateInterval = setInterval(() => {
      let isGrazingThisFrame = false;
      const heartRect = ctx.heart.getBoundingClientRect();
      const isPlayerMoving = Math.abs(ctx.heartX - prevHeartX) > 0.5 || Math.abs(ctx.heartY - prevHeartY) > 0.5;

      // Update Player Laser Shots (Yellow Soul)
      for (let s = playerShots.length - 1; s >= 0; s--) {
        const shot = playerShots[s];
        shot.y += shot.vy;
        shot.el.style.top = shot.y + "px";

        if (shot.y < -20) {
          shot.el.remove();
          playerShots.splice(s, 1);
          continue;
        }

        const shotRect = shot.el.getBoundingClientRect();
        for (let i = projectiles.length - 1; i >= 0; i--) {
          const p = projectiles[i];
          const projRect = p.el.getBoundingClientRect();

          const hit = !(
            shotRect.right < projRect.left ||
            shotRect.left > projRect.right ||
            shotRect.bottom < projRect.top ||
            shotRect.top > projRect.bottom
          );

          if (hit && !p.isBus) {
            ctx.playSfx("audio/hit.mp3");
            this.showGrazeText(ctx, "DESTROYED!");
            shot.el.remove();
            playerShots.splice(s, 1);
            p.el.remove();
            projectiles.splice(i, 1);
            break;
          }
        }
      }

      // Update Projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        if (p.isOrbiter) {
          p.angleOffset += 0.045;
          const currentRadius = 65 + Math.sin(Date.now() / 250) * 45;
          p.x = boardWidth / 2 - 10 + Math.cos(p.angleOffset) * currentRadius;
          p.y = boardHeight / 2 - 10 + Math.sin(p.angleOffset) * currentRadius;
          p.el.style.left = p.x + "px"; p.el.style.top = p.y + "px";
        } else {
          if (p.isHoming) {
            const hAngle = Math.atan2(ctx.heartY - p.y, ctx.heartX - p.x);
            p.vx += Math.cos(hAngle) * 0.12;
            p.vy += Math.sin(hAngle) * 0.12;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.el.style.left = p.x + "px"; p.el.style.top = p.y + "px";

          // Pillow splitting into 5-feather fan
          if (p.isPillow && p.y > boardHeight / 2 && !p.splitDone) {
            p.splitDone = true;
            for (let f = -2; f <= 2; f++) {
              const feather = document.createElement("div");
              feather.className = "projectile";
              feather.textContent = "🪶";
              feather.style.left = p.x + "px"; feather.style.top = p.y + "px";
              ctx.arena.appendChild(feather);
              const fa = f * 0.45;
              projectiles.push({ el: feather, x: p.x, y: p.y, vx: Math.sin(fa) * 3.8, vy: Math.cos(fa) * 3.2 });
            }
          }
        }

        const projRect = p.el.getBoundingClientRect();

        // Check Shield Block for Green Soul
        if (soulMode === "green" && shieldEl) {
          const shieldRect = shieldEl.getBoundingClientRect();
          const shieldHit = !(
            shieldRect.right < projRect.left ||
            shieldRect.left > projRect.right ||
            shieldRect.bottom < projRect.top ||
            shieldRect.top > projRect.bottom
          );
          if (shieldHit) {
            ctx.playSfx("audio/healing.mp3");
            this.showGrazeText(ctx, "DEFLECTED!");
            p.el.remove();
            projectiles.splice(i, 1);
            continue;
          }
        }

        const overlap = !(
          heartRect.right < projRect.left ||
          heartRect.left > projRect.right ||
          heartRect.bottom < projRect.top ||
          heartRect.top > projRect.bottom
        );

        if (overlap) {
          // Cyan & Orange Rule Checks
          if (p.isCyan && !isPlayerMoving) {
            continue; // Passed safely!
          }
          if (p.isOrange && isPlayerMoving) {
            continue; // Passed safely!
          }

          if (ctx.hasShield) {
            ctx.playSfx("audio/healing.mp3");
            this.showGrazeText(ctx, "BLOCKED!");
            p.el.remove();
            projectiles.splice(i, 1);
            continue;
          }

          const dmg = p.isBus ? 45 : ctx.bossAttackPower;
          ctx.playerHp -= dmg;
          ctx.playSfx("audio/hit.mp3");
          ctx.triggerVibration(p.isBus ? [200, 100, 200] : 120);

          ctx.overlay.classList.add("battle-dmg-flash");
          setTimeout(() => ctx.overlay.classList.remove("battle-dmg-flash"), 200);

          p.el.remove();
          projectiles.splice(i, 1);

          if (ctx.playerHp <= 0) {
            ctx.loseBattle();
            return;
          }
          continue;
        }

        // Graze Zone
        const grazeBoxSize = 25;
        const isNear = !(
          (heartRect.right + grazeBoxSize) < projRect.left ||
          (heartRect.left - grazeBoxSize) > projRect.right ||
          (heartRect.bottom + grazeBoxSize) < projRect.top ||
          (heartRect.top - grazeBoxSize) > projRect.bottom
        );

        if (isNear) {
          isGrazingThisFrame = true;
          if (!p.grazed) {
            p.grazed = true;
            ctx.playSfx("audio/click.mp3");
            ctx.playerHp = Math.min(ctx.playerHp + 1, 100);
            ctx.playerTp = Math.min(ctx.playerTp + 15, 100);
            this.showGrazeText(ctx, "+1 TP");
          }
        }

        if (!p.isOrbiter && (p.x < -100 || p.x > boardWidth + 100 || p.y < -100 || p.y > boardHeight + 100)) {
          p.el.remove();
          projectiles.splice(i, 1);
        }
      }

      if (isGrazingThisFrame) {
        ctx.heart.classList.add("grazing");
      } else {
        ctx.heart.classList.remove("grazing");
      }
    }, 16);

    // --- 0.8s Crisp Safety Window (Wipe all hazards & bullets at 4.0s) ---
    window.safetyTimeout = setTimeout(() => {
      clearInterval(window.battleSpawnInterval);
      document.querySelectorAll(".laser-warning, .laser-beam, .bus-warning").forEach(el => el.remove());
      if (ctx.projectiles) {
        ctx.projectiles.forEach(p => p.el.remove());
        ctx.projectiles = [];
      }
    }, 4000);

    window.battleTurnTimeout = setTimeout(() => {
      // Clean player shots
      playerShots.forEach(s => s.el.remove());
      playerShots = [];

      this.cleanupEnemyTurn(ctx);
      ctx.startPlayerTurn();
    }, 4800);
  },

  showGrazeText: function(ctx, textVal) {
    const grazeEl = document.createElement("div");
    grazeEl.className = "graze-text";
    grazeEl.textContent = textVal;
    if (textVal === "BLOCKED!" || textVal === "DEFLECTED!") {
      grazeEl.style.color = "#ff9f43";
      grazeEl.style.textShadow = "0 0 3px #000, 0 0 6px #ff9f43";
    }
    grazeEl.style.left = (ctx.heartX + Math.random() * 16 - 8) + "px";
    grazeEl.style.top = (ctx.heartY - 12) + "px";
    ctx.arena.appendChild(grazeEl);

    setTimeout(() => {
      grazeEl.remove();
    }, 450);
  },

  cleanupEnemyTurn: function(ctx) {
    clearInterval(window.battleMoveInterval);
    clearInterval(window.battleSpawnInterval);
    clearInterval(window.battleUpdateInterval);
    clearTimeout(window.battleTurnTimeout);
    clearTimeout(window.safetyTimeout);
    clearTimeout(window.laser1Timeout);
    clearTimeout(window.laser2Timeout);
    clearTimeout(window.bus1Timeout);
    clearTimeout(window.bus2Timeout);
    
    if (ctx.activeKeyDownHandler) {
      window.removeEventListener("keydown", ctx.activeKeyDownHandler);
    }
    if (ctx.activeKeyUpHandler) {
      window.removeEventListener("keyup", ctx.activeKeyUpHandler);
    }
    if (ctx.activeTouchHandler) {
      ctx.board.removeEventListener("touchmove", ctx.activeTouchHandler);
      ctx.board.removeEventListener("touchstart", ctx.activeTouchHandler);
    }

    if (ctx.heart) {
      ctx.heart.classList.remove("grazing", "soul-blue", "soul-green", "soul-yellow");
    }
    ctx.hasShield = false;

    const shieldEl = document.getElementById("shieldDeflector");
    if (shieldEl) shieldEl.style.display = "none";

    document.querySelectorAll(".laser-warning, .laser-beam, .bus-warning, .player-laser-shot").forEach(el => el.remove());
    
    if (ctx.projectiles) {
      ctx.projectiles.forEach(p => p.el.remove());
    }
    ctx.projectiles = [];
  }
};
