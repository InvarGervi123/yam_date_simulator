// --- Deltarune Active Dodging Arena Module ---

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
    
    // Clear any keys pressed
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

    // Track keyboard arrows inside turn context
    const handleKeyDown = (e) => { keysPressed[e.key] = true; };
    const handleKeyUp = (e) => { keysPressed[e.key] = false; };
    
    ctx.activeKeyDownHandler = handleKeyDown;
    ctx.activeKeyUpHandler = handleKeyUp;

    // --- Yam Tuna & Nutella Healing ---
    let healTriggered = false;
    if (ctx.bossHp < 150 && Math.random() < 0.45) {
      healTriggered = true;
      ctx.lastTurnHealed = true;
      ctx.bossHp = Math.min(ctx.bossHp + 45, 200);
      ctx.playSfx("audio/healing.mp3");
      ctx.triggerVibration([100, 100, 100]);

      // Chew animation
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

    // Reset heart position
    ctx.heartX = boardWidth / 2 - 10;
    ctx.heartY = boardHeight / 2 - 10;
    ctx.heart.style.left = ctx.heartX + "px";
    ctx.heart.style.top = ctx.heartY + "px";

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Dynamic keyboard movement loop
    window.battleMoveInterval = setInterval(() => {
      if (keysPressed["ArrowUp"] || keysPressed["w"]) ctx.heartY = Math.max(ctx.heartY - moveSpeed, 0);
      if (keysPressed["ArrowDown"] || keysPressed["s"]) ctx.heartY = Math.min(ctx.heartY + moveSpeed, boardHeight - 20);
      if (keysPressed["ArrowLeft"] || keysPressed["a"]) ctx.heartX = Math.max(ctx.heartX - moveSpeed, 0);
      if (keysPressed["ArrowRight"] || keysPressed["d"]) ctx.heartX = Math.min(ctx.heartX + moveSpeed, boardWidth - 20);

      ctx.heart.style.left = ctx.heartX + "px";
      ctx.heart.style.top = ctx.heartY + "px";
    }, 16);

    const activeTouchHandler = (e) => this.handleTouchMove(e, ctx);
    ctx.activeTouchHandler = activeTouchHandler;
    ctx.board.addEventListener("touchmove", activeTouchHandler, { passive: false });
    ctx.board.addEventListener("touchstart", activeTouchHandler, { passive: false });

    // Attack patterns
    ctx.turnCount++;
    const currentPattern = ctx.turnCount % 4;

    function spawnRandomProjectile() {
      const emojis = ["🥫", "🥐", "😴", "💤"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const proj = document.createElement("div");
      proj.className = "projectile";
      proj.textContent = emoji;

      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) {
        x = Math.random() * boardWidth;
        y = -20;
      } else if (edge === 1) {
        x = Math.random() * boardWidth;
        y = boardHeight + 20;
      } else if (edge === 2) {
        x = -20;
        y = Math.random() * boardHeight;
      } else {
        x = boardWidth + 20;
        y = Math.random() * boardHeight;
      }

      proj.style.left = x + "px";
      proj.style.top = y + "px";
      ctx.arena.appendChild(proj);

      const angle = Math.atan2(ctx.heartY - y, ctx.heartX - x);
      const speed = 3.0 + Math.random() * 2;
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

    if (currentPattern === 0) {
      // Lasers
      const spawnLaser = (dir) => {
        if (ctx.isGameOver) return;
        const targetX = ctx.heartX + 10;
        const targetY = ctx.heartY + 10;
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
        ctx.board.appendChild(warn);
        ctx.playSfx("audio/hit.mp3");
        
        setTimeout(() => {
          if (ctx.isGameOver) {
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
          ctx.board.appendChild(beam);
          ctx.playSfx("audio/hit.mp3");
          
          let checkCount = 0;
          const checkInterval = setInterval(() => {
            if (ctx.isGameOver) {
              clearInterval(checkInterval);
              beam.remove();
              return;
            }
            
            const heartCenterX = ctx.heartX + 10;
            const heartCenterY = ctx.heartY + 10;
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
              if (ctx.hasShield) {
                ctx.playSfx("audio/healing.mp3");
                this.showGrazeText(ctx, "BLOCKED!");
              } else {
                ctx.playerHp -= 10;
                ctx.triggerVibration(50);
                ctx.overlay.classList.add("battle-dmg-flash");
                setTimeout(() => ctx.overlay.classList.remove("battle-dmg-flash"), 100);
                if (ctx.playerHp <= 0) {
                  clearInterval(checkInterval);
                  ctx.loseBattle();
                }
              }
            }
            
            checkCount++;
            if (checkCount >= 8) {
              clearInterval(checkInterval);
              beam.remove();
            }
          }, 100);
        }, 850);
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
      // Orbiters
      for (let j = 0; j < 4; j++) {
        const orb = document.createElement("div");
        orb.className = "projectile";
        orb.textContent = "🥐";
        orb.style.fontSize = "24px";
        ctx.arena.appendChild(orb);
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
        ctx.arena.appendChild(proj);
        
        projectiles.push({
          el: proj,
          x: x,
          y: y,
          vx: 0,
          vy: 2.8
        });
      }, 600);
      
    } else if (currentPattern === 2) {
      // Targeted
      let round = 0;
      const spawnTargetedProj = (startX, startY) => {
        if (ctx.isGameOver) return;
        const proj = document.createElement("div");
        proj.className = "projectile";
        proj.textContent = "🥫";
        proj.style.left = startX + "px";
        proj.style.top = startY + "px";
        ctx.arena.appendChild(proj);
        
        const angle = Math.atan2(ctx.heartY - startY, ctx.heartX - startX);
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
      // Bus
      const spawnBus = (yPosition, delay) => {
        if (ctx.isGameOver) return;
        const warn = document.createElement("div");
        warn.className = "bus-warning";
        warn.style.left = "0px";
        warn.style.top = yPosition + "px";
        warn.style.width = boardWidth + "px";
        warn.style.height = "55px";
        ctx.board.appendChild(warn);
        ctx.playSfx("audio/hit.mp3");
        
        setTimeout(() => {
          if (ctx.isGameOver) {
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
          ctx.arena.appendChild(bus);
          ctx.playSfx("audio/hit.mp3");
          
          projectiles.push({
            el: bus,
            x: -80,
            y: yPosition,
            vx: 8.5,
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

    // Dodging Collision and Update loops
    window.battleUpdateInterval = setInterval(() => {
      let isGrazingThisFrame = false;
      const heartRect = ctx.heart.getBoundingClientRect();

      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        if (p.isOrbiter) {
          p.angleOffset += 0.045;
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

        const projRect = p.el.getBoundingClientRect();

        const overlap = !(
          heartRect.right < projRect.left ||
          heartRect.left > projRect.right ||
          heartRect.bottom < projRect.top ||
          heartRect.top > projRect.bottom
        );

        if (overlap) {
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
            this.showGrazeText(ctx, "+1 HP");
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
      this.cleanupEnemyTurn(ctx);
      ctx.startPlayerTurn();
    }, 6000);
  },

  showGrazeText: function(ctx, textVal) {
    const grazeEl = document.createElement("div");
    grazeEl.className = "graze-text";
    grazeEl.textContent = textVal;
    if (textVal === "BLOCKED!") {
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

    if (ctx.heart) ctx.heart.classList.remove("grazing");
    ctx.hasShield = false;

    document.querySelectorAll(".laser-warning, .laser-beam, .bus-warning").forEach(el => el.remove());
    
    if (ctx.projectiles) {
      ctx.projectiles.forEach(p => p.el.remove());
    }
    ctx.projectiles = [];
  }
};
