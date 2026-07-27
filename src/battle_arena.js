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
      if (soulMode === "blue" && (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp")) {
        if (ctx.heartY >= boardHeight - 22) {
          heartVy = -8.8;
          ctx.playSfx("audio/click.mp3");
        }
      }

      // Green Soul Shield Rotate
      if (soulMode === "green") {
        const prevDir = shieldDir;
        if (e.key === "ArrowUp" || k === "w") shieldDir = "up";
        if (e.key === "ArrowDown" || k === "s") shieldDir = "down";
        if (e.key === "ArrowLeft" || k === "a") shieldDir = "left";
        if (e.key === "ArrowRight" || k === "d") shieldDir = "right";
        if (prevDir !== shieldDir) {
          ctx.playSfx("audio/click.mp3");
        }
      }

      // Yellow Soul Shoot Laser
      if (soulMode === "yellow" && (e.code === "Space" || e.code === "KeyZ" || e.code === "Enter")) {
        spawnPlayerLaser();
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
      const speed = 3.0 + Math.random() * 2;
      projectiles.push({ el: proj, x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
    }

    // --- Dispatch 8 Attack Patterns ---
    if (currentPattern === 0) {
      // Stage 1: Single Lasers
      const spawnLaser = (dir) => {
        if (ctx.isGameOver) return;
        const targetX = ctx.heartX + 10;
        const targetY = ctx.heartY + 10;
        const warn = document.createElement("div");
        warn.className = "laser-warning";
        if (dir === "vertical") {
          warn.style.left = (targetX - 3) + "px"; warn.style.top = "0px"; warn.style.width = "6px"; warn.style.height = boardHeight + "px";
        } else {
          warn.style.left = "0px"; warn.style.top = (targetY - 3) + "px"; warn.style.width = boardWidth + "px"; warn.style.height = "6px";
        }
        ctx.board.appendChild(warn);
        ctx.playSfx("audio/hit.mp3");

        setTimeout(() => {
          if (ctx.isGameOver) { warn.remove(); return; }
          warn.remove();
          const beam = document.createElement("div");
          beam.className = "laser-beam";
          if (dir === "vertical") {
            beam.style.left = (targetX - 25) + "px"; beam.style.top = "0px"; beam.style.width = "50px"; beam.style.height = boardHeight + "px";
          } else {
            beam.style.left = "0px"; beam.style.top = (targetY - 25) + "px"; beam.style.width = boardWidth + "px"; beam.style.height = "50px";
          }
          ctx.board.appendChild(beam);
          ctx.playSfx("audio/hit.mp3");
          setTimeout(() => beam.remove(), 450);
        }, 800);
      };

      window.laser1Timeout = setTimeout(() => spawnLaser("vertical"), 600);
      window.laser2Timeout = setTimeout(() => spawnLaser("horizontal"), 2400);

    } else if (currentPattern === 1) {
      // Stage 2: Rotating Croissants & Zzzs
      for (let j = 0; j < 4; j++) {
        const orb = document.createElement("div");
        orb.className = "projectile";
        orb.textContent = "🥐";
        orb.style.fontSize = "24px";
        ctx.arena.appendChild(orb);
        projectiles.push({ el: orb, isOrbiter: true, angleOffset: (j * Math.PI / 2), radius: 85, x: 0, y: 0 });
      }

      window.battleSpawnInterval = setInterval(() => {
        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "😴";
        const x = Math.random() * (boardWidth - 20);
        proj.style.left = x + "px"; proj.style.top = "-20px";
        ctx.arena.appendChild(proj);
        projectiles.push({ el: proj, x: x, y: -20, vx: 0, vy: 2.8 });
      }, 550);

    } else if (currentPattern === 2) {
      // Stage 3: Targeted Tuna Cans
      let round = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (round >= 5) return;
        const spawnTargeted = (sx, sy) => {
          if (ctx.isGameOver) return;
          const proj = document.createElement("div");
          proj.className = "projectile";
          proj.textContent = "🥫";
          proj.style.left = sx + "px"; proj.style.top = sy + "px";
          ctx.arena.appendChild(proj);
          const angle = Math.atan2(ctx.heartY - sy, ctx.heartX - sx);
          const speed = 3.6;
          projectiles.push({ el: proj, x: sx, y: sy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
        };
        spawnTargeted(Math.random() * boardWidth, -20);
        spawnTargeted(Math.random() * boardWidth, boardHeight + 20);
        round++;
      }, 950);

    } else if (currentPattern === 3) {
      // Stage 4: Dizengoff Bus
      const spawnBus = (yPosition, delay) => {
        if (ctx.isGameOver) return;
        const warn = document.createElement("div");
        warn.className = "bus-warning";
        warn.style.left = "0px"; warn.style.top = yPosition + "px"; warn.style.width = boardWidth + "px"; warn.style.height = "55px";
        ctx.board.appendChild(warn);
        ctx.playSfx("audio/hit.mp3");

        setTimeout(() => {
          if (ctx.isGameOver) { warn.remove(); return; }
          warn.remove();
          const bus = document.createElement("div");
          bus.className = "bus-projectile";
          bus.textContent = "🚌";
          bus.style.left = "-80px"; bus.style.top = yPosition + "px"; bus.style.width = "70px"; bus.style.height = "50px";
          ctx.arena.appendChild(bus);
          ctx.playSfx("audio/hit.mp3");
          projectiles.push({ el: bus, x: -80, y: yPosition, vx: 8.5, vy: 0, isBus: true });
        }, delay);
      };

      window.bus1Timeout = setTimeout(() => spawnBus(boardHeight / 2 - 25, 900), 500);

    } else if (currentPattern === 4) {
      // Stage 5: Splitting Pillow Storm + Blue Soul Gravity
      let pillowsSpawned = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (pillowsSpawned >= 4) return;
        const pillow = document.createElement("div");
        pillow.className = "projectile";
        pillow.textContent = "🛋️";
        pillow.style.fontSize = "26px";
        const x = Math.random() * (boardWidth - 40) + 20;
        pillow.style.left = x + "px"; pillow.style.top = "-30px";
        ctx.arena.appendChild(pillow);

        projectiles.push({ el: pillow, x: x, y: -30, vx: (Math.random() - 0.5) * 3, vy: 3.2, isPillow: true });
        pillowsSpawned++;
      }, 1100);

    } else if (currentPattern === 5) {
      // Stage 6: Green Shield Soul Deflector Mode (Undyne Style)
      // Projectiles spawn at outer perimeter travelling INWARDS to center (cx, cy)
      const cx = boardWidth / 2 - 10;
      const cy = boardHeight / 2 - 10;
      const dirs = [
        { angle: -Math.PI / 2 }, // Top (0)
        { angle: 0 },            // Right (1)
        { angle: Math.PI / 2 },  // Bottom (2)
        { angle: Math.PI }       // Left (3)
      ];

      let spawnCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (ctx.isGameOver || spawnCount >= 10) return;
        const dirObj = dirs[Math.floor(Math.random() * dirs.length)];
        const dist = 160; // spawn distance outside center
        const sx = cx + Math.cos(dirObj.angle) * dist;
        const sy = cy + Math.sin(dirObj.angle) * dist;

        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "🥐";
        proj.style.fontSize = "22px";
        proj.style.left = sx + "px";
        proj.style.top = sy + "px";
        ctx.arena.appendChild(proj);

        // Velocity travels INWARDS to center
        const speed = 4.2;
        const vx = -Math.cos(dirObj.angle) * speed;
        const vy = -Math.sin(dirObj.angle) * speed;
        projectiles.push({ el: proj, x: sx, y: sy, vx: vx, vy: vy });
        spawnCount++;
      }, 550);

    } else if (currentPattern === 6) {
      // Stage 7: Dual Crosshair Lasers + Cyan/Orange Bullets
      let cyanOrangeCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (cyanOrangeCount >= 8) return;
        const isCyan = cyanOrangeCount % 2 === 0;
        const proj = document.createElement("div");
        proj.className = "projectile " + (isCyan ? "proj-cyan" : "proj-orange");
        proj.textContent = isCyan ? "🧊" : "🔥";
        const x = Math.random() * (boardWidth - 20);
        proj.style.left = x + "px"; proj.style.top = "-20px";
        ctx.arena.appendChild(proj);

        projectiles.push({ el: proj, x: x, y: -20, vx: 0, vy: 3.0, isCyan: isCyan, isOrange: !isCyan });
        cyanOrangeCount++;
      }, 700);

    } else {
      // Stage 8: Ultimate Sloth Overdrive + Yellow Soul Shooter
      let spawnCount = 0;
      window.battleSpawnInterval = setInterval(() => {
        if (spawnCount >= 10) return;
        spawnRandomProjectile();
        spawnCount++;
      }, 500);
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
          p.x += p.vx;
          p.y += p.vy;
          p.el.style.left = p.x + "px"; p.el.style.top = p.y + "px";

          // Pillow splitting into feathers
          if (p.isPillow && p.y > boardHeight / 2 && !p.splitDone) {
            p.splitDone = true;
            for (let f = 0; f < 3; f++) {
              const feather = document.createElement("div");
              feather.className = "projectile";
              feather.textContent = "🪶";
              feather.style.left = p.x + "px"; feather.style.top = p.y + "px";
              ctx.arena.appendChild(feather);
              const fa = (f - 1) * 0.8;
              projectiles.push({ el: feather, x: p.x, y: p.y, vx: Math.sin(fa) * 4, vy: Math.cos(fa) * 3 });
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

    window.battleTurnTimeout = setTimeout(() => {
      // Clean player shots
      playerShots.forEach(s => s.el.remove());
      playerShots = [];

      this.cleanupEnemyTurn(ctx);
      ctx.startPlayerTurn();
    }, 6500);
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
