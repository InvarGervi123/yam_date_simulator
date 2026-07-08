// --- Baldi's Basics in Oranit: 3D Raycaster Engine ---

function runBaldiMinigame(config) {
  minigameOverlay.style.display = "flex";
  clearChoices();
  nextBtn.style.display = "none";
  minigameBtn.style.display = "none";

  // Build the 3D Raycaster HTML structure
  minigameVisual.innerHTML = `
    <div class="baldi-container">
      <div class="baldi-header">Baldi's Basics in Oranit!</div>
      <div class="baldi-3d-screen-wrapper">
        <canvas id="baldi3dCanvas" width="320" height="240"></canvas>
        <div id="baldi3dOverlay" class="baldi-3d-overlay">
          <div id="baldiNotebookCounter">Notebooks: 0/3</div>
          <div id="baldiPromptText">W,A,S,D to Walk/Turn. Collect notebooks!</div>
        </div>
        
        <!-- You Can Think! Pad Modal -->
        <div id="baldiPadModal" class="baldi-pad-modal" style="display: none;">
          <div class="baldi-container pad-modal-content">
            <div class="baldi-header">You Can Think! Pad</div>
            <div class="baldi-screen" id="baldiScreen">
              <div class="baldi-problem-num" id="baldiProblemNum">Problem 1 of 3</div>
              <div class="baldi-question-text" id="baldiQuestionText">Loading...</div>
              <div class="baldi-input-container">
                <input type="text" class="baldi-input" id="baldiInput" placeholder="התשובה שלך" />
                <button class="baldi-submit-btn" id="baldiSubmit">OK</button>
              </div>
            </div>
            <div class="baldi-teacher-container">
              <img id="baldiTeacherImg" class="baldi-teacher-img" src="images/yam.png" alt="Yam" />
            </div>
          </div>
        </div>

        <!-- Custom Haptic / Danger flash overlay inside the screen -->
        <div id="baldiHudAlert" style="display: none;"></div>
      </div>
      
      <!-- Mobile Virtual Joysticks / Buttons -->
      <div class="baldi-controls" id="baldiControls">
        <button class="control-btn" id="ctrlLeft">◀ Turn Left</button>
        <div class="vertical-controls">
          <button class="control-btn" id="ctrlForward">▲ Walk</button>
          <button class="control-btn" id="ctrlAction">Interact [E]</button>
          <button class="control-btn" id="ctrlBackward">▼ Back</button>
        </div>
        <button class="control-btn" id="ctrlRight">Turn Right ▶</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById("baldi3dCanvas");
  const ctx = canvas.getContext("2d");
  const notebookCounter = document.getElementById("baldiNotebookCounter");
  const promptText = document.getElementById("baldiPromptText");
  const padModal = document.getElementById("baldiPadModal");
  const hudAlert = document.getElementById("baldiHudAlert");

  const padScreen = document.getElementById("baldiScreen");
  const padProbNum = document.getElementById("baldiProblemNum");
  const padQText = document.getElementById("baldiQuestionText");
  const padInput = document.getElementById("baldiInput");
  const padSubmit = document.getElementById("baldiSubmit");
  const padTeacherImg = document.getElementById("baldiTeacherImg");

  // Game Map (1 = Yellow Brick Wall, 2 = Classroom Door)
  const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,0,1,1,1,1,0,1,1,1,1,2,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,1,1,1,2,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,2,1,1,1,1,0,1,1,1,2,1,1,1],
    [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  const mapSize = 16;

  // Player state
  let px = 1.5;
  let py = 1.5;
  let pa = 0.0;
  const fov = Math.PI / 3;
  const moveSpeed = 0.06;
  const rotSpeed = 0.045;

  let collectedNotebooksCount = 0;
  let currentNotebookRef = null;

  // Sprite billboards (e: Emoji, x, y, collected/active)
  let sprites = [
    { type: "notebook", label: "📘", x: 3.5, y: 3.5, collected: false },
    { type: "notebook", label: "📘", x: 14.5, y: 1.5, collected: false },
    { type: "notebook", label: "📘", x: 10.5, y: 13.5, collected: false },
    { type: "exit", label: "🚪", x: 8.5, y: 14.5, active: false },
    { type: "yam", label: "😠", x: 14.5, y: 14.5, active: false, speed: 0.04 }
  ];

  let yamRef = sprites[4];
  let exitRef = sprites[3];

  let lives = 3;
  let isGameOver = false;
  let isMinigameActive = true;
  let activePadSession = false;
  let jumpScareActive = false;

  // Sound slaps loop
  let yamLastSlap = 0;
  let yamSlapInterval = 1400; // drops as Yam gets closer

  // Keys pressed
  let keys = { w: false, s: false, a: false, d: false };

  function handleKeyDown(e) {
    if (activePadSession) return;
    if (e.key === "w" || e.key === "ArrowUp") keys.w = true;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = true;
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
    
    // Interact action
    if (e.key === "e" || e.key === " ") {
      triggerInteract();
    }
  }

  function handleKeyUp(e) {
    if (e.key === "w" || e.key === "ArrowUp") keys.w = false;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = false;
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Virtual buttons events
  const cLeft = document.getElementById("ctrlLeft");
  const cRight = document.getElementById("ctrlRight");
  const cForward = document.getElementById("ctrlForward");
  const cBackward = document.getElementById("ctrlBackward");
  const cAction = document.getElementById("ctrlAction");

  let touchIntervals = [];

  function setupTouch(btn, keyState) {
    btn.ontouchstart = (e) => {
      e.preventDefault();
      keys[keyState] = true;
    };
    btn.ontouchend = (e) => {
      e.preventDefault();
      keys[keyState] = false;
    };
    btn.onmousedown = () => {
      keys[keyState] = true;
    };
    btn.onmouseup = () => {
      keys[keyState] = false;
    };
    btn.onmouseleave = () => {
      keys[keyState] = false;
    };
  }

  setupTouch(cLeft, "a");
  setupTouch(cRight, "d");
  setupTouch(cForward, "w");
  setupTouch(cBackward, "s");

  cAction.onclick = () => {
    triggerInteract();
  };

  // Interact check
  function triggerInteract() {
    if (activePadSession || isGameOver) return;
    
    // Find closest uncollected notebook
    let nearNotebook = null;
    let minDist = 0.8;
    
    sprites.forEach(s => {
      if (s.type === "notebook" && !s.collected) {
        let dx = s.x - px;
        let dy = s.y - py;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < minDist) {
          minDist = dist;
          nearNotebook = s;
        }
      }
    });

    if (nearNotebook) {
      currentNotebookRef = nearNotebook;
      startPadSession();
    }
  }

  // --- You Can Think! Pad Math Session ---
  function startPadSession() {
    activePadSession = true;
    keys.w = keys.s = keys.a = keys.d = false; // Reset movements
    padModal.style.display = "flex";
    
    let step = 1;
    let correct = 0;

    let a1 = Math.floor(Math.random() * 8) + 2;
    let b1 = Math.floor(Math.random() * 8) + 2;
    let ans1 = a1 + b1;

    let a2 = Math.floor(Math.random() * 4) + 2;
    let b2 = Math.floor(Math.random() * 4) + 2;
    let ans2 = a2 * b2;

    // Reset styles
    padScreen.classList.remove("baldi-red-alert");
    padTeacherImg.classList.remove("baldi-glitch-face");
    padInput.value = "";
    
    // Render Problem 1
    padProbNum.textContent = "Problem 1 of 3";
    padQText.textContent = `${a1} + ${b1} = ?`;
    padInput.focus();

    padInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        padSubmit.click();
      }
    };

    padSubmit.onclick = () => {
      const val = parseInt(padInput.value.trim());
      playSfx("audio/click.mp3");
      triggerVibration(15);

      if (step === 1) {
        if (val === ans1) correct++;
        step = 2;
        padInput.value = "";
        padProbNum.textContent = "Problem 2 of 3";
        padQText.textContent = `${a2} × ${b2} = ?`;
        padInput.focus();
      } else if (step === 2) {
        if (val === ans2) correct++;
        step = 3;
        padInput.value = "";
        
        // Problem 3 is ALWAYS GLITCHY
        playSfx("audio/rip.mp3");
        triggerVibration([200, 100, 200]);
        padScreen.classList.add("baldi-red-alert");
        padTeacherImg.classList.add("baldi-glitch-face");

        padProbNum.textContent = "Problem 3 of 3";
        padQText.textContent = `${Math.floor(Math.random() * 9000) + 1000} + ▓░▒█ × ░▒ = ?`;
        padInput.focus();
      } else if (step === 3) {
        // Submit glitch answer -> Yam goes angry!
        playSfx("audio/crack.mp3");
        triggerVibration([400, 100, 400]);

        // Mark notebook collected
        currentNotebookRef.collected = true;
        currentNotebookRef.label = "📖"; // Open book emoji when collected
        collectedNotebooksCount++;
        notebookCounter.textContent = `Notebooks: ${collectedNotebooksCount}/3`;

        // Hide pad
        padModal.style.display = "none";
        activePadSession = false;

        // Trigger Yam chase!
        if (!yamRef.active) {
          yamRef.active = true;
          promptText.textContent = "ים כועס! מצא את כל המחברות והימלט מדלת היציאה 🚪!";
          promptText.style.color = "#ff3333";
          playSfx("audio/hit.mp3");
        }

        if (collectedNotebooksCount >= 3) {
          exitRef.active = true;
          promptText.textContent = "מצא את היציאה 🚪! מהר!";
          promptText.style.color = "#ffff00";
        }
      }
    };
  }

  // Raycaster 1D Z-Buffer
  let zBuffer = new Array(320);

  // Render 3D Frame
  function render3D() {
    if (jumpScareActive) {
      // Flashing screen
      ctx.fillStyle = (Math.floor(Date.now() / 80) % 2 === 0) ? "#7a1111" : "#000000";
      ctx.fillRect(0, 0, 320, 240);

      // Shaking giant emoji face of Yam
      ctx.font = "90px Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      let shakeX = Math.random() * 16 - 8;
      let shakeY = Math.random() * 16 - 8;
      ctx.fillText("😠", 160 + shakeX, 120 + shakeY);
      return;
    }

    // Clear screen with ceiling & floor colors
    ctx.fillStyle = "#d2d2a6"; // Ceiling
    ctx.fillRect(0, 0, 320, 120);
    ctx.fillStyle = "#5b7b9c"; // Blue floor
    ctx.fillRect(0, 120, 320, 120);

    // Wall Raycasting
    for (let col = 0; col < 320; col++) {
      let rayAngle = pa - fov / 2 + (col / 320) * fov;
      let dx = Math.cos(rayAngle);
      let dy = Math.sin(rayAngle);

      let mapX = Math.floor(px);
      let mapY = Math.floor(py);

      let deltaDistX = Math.abs(1 / dx);
      let deltaDistY = Math.abs(1 / dy);

      let stepX, stepY;
      let sideDistX, sideDistY;

      if (dx < 0) {
        stepX = -1;
        sideDistX = (px - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - px) * deltaDistX;
      }

      if (dy < 0) {
        stepY = -1;
        sideDistY = (py - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - py) * deltaDistY;
      }

      let hit = false;
      let side = 0; // NS or EW wall
      let distance = 0;

      while (!hit && distance < 18) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }

        if (mapX < 0 || mapX >= mapSize || mapY < 0 || mapY >= mapSize) {
          distance = 18;
          break;
        }

        if (map[mapY][mapX] > 0) {
          hit = true;
        }
      }

      if (side === 0) distance = (mapX - px + (1 - stepX) / 2) / dx;
      else distance = (mapY - py + (1 - stepY) / 2) / dy;

      // Correct fish-eye
      let correctedDist = distance * Math.cos(rayAngle - pa);
      if (correctedDist <= 0.05) correctedDist = 0.05;

      zBuffer[col] = correctedDist;

      // Height of wall slice
      let sliceHeight = Math.floor(240 / correctedDist);
      let drawStart = Math.max(0, 120 - sliceHeight / 2);
      let drawEnd = Math.min(240, 120 + sliceHeight / 2);

      // Shading based on wall type and side
      let wallType = map[mapY][mapX];
      let wallColor = "#ffd447"; // Yellow brick default
      if (wallType === 2) {
        wallColor = "#9c3c3c"; // Red classroom door
      }

      ctx.fillStyle = wallColor;
      ctx.fillRect(col, drawStart, 1, drawEnd - drawStart);

      // Shadow overlay to create depth
      let shadow = Math.min(1.0, correctedDist / 12);
      if (side === 1) shadow = shadow * 0.7 + 0.3; // shade sides differently
      ctx.fillStyle = `rgba(0,0,0,${shadow.toFixed(2)})`;
      ctx.fillRect(col, drawStart, 1, drawEnd - drawStart);
    }

    // Render sprites sorted by distance
    let spritesCopy = sprites.map(s => {
      let dx = s.x - px;
      let dy = s.y - py;
      return {
        sprite: s,
        dist: Math.sqrt(dx*dx + dy*dy),
        dx: dx,
        dy: dy
      };
    });

    spritesCopy.sort((a, b) => b.dist - a.dist);

    spritesCopy.forEach(sc => {
      let s = sc.sprite;
      if (s.type === "notebook" && s.collected) return;
      if (s.type === "exit" && !s.active) return;
      if (s.type === "yam" && !s.active) return;

      // Sprite angle relative to player direction
      let spriteAngle = Math.atan2(sc.dy, sc.dx) - pa;
      while (spriteAngle < -Math.PI) spriteAngle += Math.PI * 2;
      while (spriteAngle > Math.PI) spriteAngle -= Math.PI * 2;

      // Render if in FOV
      if (Math.abs(spriteAngle) < fov) {
        let screenX = 160 + Math.tan(spriteAngle) * 160 / Math.tan(fov / 2);
        let dist = sc.dist;
        if (dist < 0.1) dist = 0.1;

        // Check center column Z-Buffer to avoid rendering sprites behind walls
        let centerCol = Math.floor(screenX);
        if (centerCol >= 0 && centerCol < 320 && dist < zBuffer[centerCol]) {
          let size = Math.floor(200 / dist);
          if (size > 150) size = 150;
          if (size < 6) size = 6;

          ctx.font = `${size}px Courier New`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Text shadow
          ctx.fillStyle = "#000000";
          ctx.fillText(s.label, screenX + 1, 120 + 1);
          ctx.fillStyle = s.type === "yam" ? "#ff0000" : "#ffffff";
          ctx.fillText(s.label, screenX, 120);
        }
      }
    });

    // Draw Map HUD overlays (Red light flashing if Yam is close)
    if (yamRef.active) {
      let dx = yamRef.x - px;
      let dy = yamRef.y - py;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 3.0) {
        hudAlert.className = "baldi-hud-alert";
        hudAlert.style.display = "block";
      } else {
        hudAlert.style.display = "none";
      }
    } else {
      hudAlert.style.display = "none";
    }
  }

  // --- Real-time Main Loop ---
  function updateGameLoop() {
    if (!isMinigameActive || isGameOver) return;
    
    if (!activePadSession) {
      // Rotation
      if (keys.a) {
        pa -= rotSpeed;
        if (pa < 0) pa += Math.PI * 2;
      }
      if (keys.d) {
        pa += rotSpeed;
        if (pa > Math.PI * 2) pa -= Math.PI * 2;
      }

      // Movement forward/back
      let moveDir = 0;
      if (keys.w) moveDir = moveSpeed;
      if (keys.s) moveDir = -moveSpeed;

      if (moveDir !== 0) {
        let nextX = px + Math.cos(pa) * moveDir;
        let nextY = py + Math.sin(pa) * moveDir;

        // Collision bounds checking
        if (map[Math.floor(py)][Math.floor(nextX)] === 0) px = nextX;
        if (map[Math.floor(nextY)][Math.floor(px)] === 0) py = nextY;
      }

      // Check exit collision
      if (exitRef.active) {
        let dx = exitRef.x - px;
        let dy = exitRef.y - py;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 0.75) {
          endGame(true);
          return;
        }
      }

      // --- Yam Slapping / Movement Logic ---
      if (yamRef.active) {
        let timeNow = Date.now();
        
        // Calculate slap rhythm based on distance (closer = faster!)
        let dx = px - yamRef.x;
        let dy = py - yamRef.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        let targetInterval = Math.max(250, Math.min(1300, dist * 250)); // speed up
        
        if (timeNow - yamLastSlap > targetInterval) {
          yamLastSlap = timeNow;
          playSfx("audio/crack.mp3"); // Slap ruler!
          triggerVibration(20);

          // Slap walk Yam one tile closer using grid slide vectors
          let gridDirX = Math.sign(px - yamRef.x);
          let gridDirY = Math.sign(py - yamRef.y);

          let stepAmount = 0.55;
          let nextYamX = yamRef.x + gridDirX * stepAmount;
          let nextYamY = yamRef.y + gridDirY * stepAmount;

          if (map[Math.floor(yamRef.y)][Math.floor(nextYamX)] === 0) yamRef.x = nextYamX;
          if (map[Math.floor(nextYamY)][Math.floor(yamRef.x)] === 0) yamRef.y = nextYamY;
        }

      // Catch check
      if (dist < 0.6 && !jumpScareActive) {
        lives--;
        jumpScareActive = true;
        
        playSfx("audio/hit.mp3");
        triggerVibration([500, 150, 500]);

        const gc = document.getElementById("game");
        if (gc) {
          gc.classList.add("effect-redflash");
          setTimeout(() => gc.classList.remove("effect-redflash"), 300);
        }

        if (lives <= 0) {
          // Giant game over jumpscare
          promptText.textContent = "נתפסת על ידי ים!";
          promptText.style.color = "#ff0000";
          setTimeout(() => {
            jumpScareActive = false;
            endGame(false);
          }, 1200);
          return;
        } else {
          // Regular hit jumpscare
          promptText.textContent = `נפגעת! נשארו לך ${lives} חיים!`;
          promptText.style.color = "#ff3333";
          setTimeout(() => {
            jumpScareActive = false;
            // Push Yam away
            yamRef.x = Math.max(1.5, Math.min(14.5, yamRef.x - Math.sign(px - yamRef.x) * 4.5));
            yamRef.y = Math.max(1.5, Math.min(14.5, yamRef.y - Math.sign(py - yamRef.y) * 4.5));
          }, 600);
        }
      }
      }

      // Check near notebook prompt
      let showPrompt = false;
      sprites.forEach(s => {
        if (s.type === "notebook" && !s.collected) {
          let dx = s.x - px;
          let dy = s.y - py;
          let dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 0.8) {
            showPrompt = true;
          }
        }
      });

      if (showPrompt) {
        promptText.textContent = "הקש [E] או כפתור האקשן כדי לאסוף מחברת!";
        promptText.style.color = "#00ffff";
      } else if (!yamRef.active) {
        promptText.textContent = "מצא 3 מחברות 📘 בתוך הכיתות!";
        promptText.style.color = "#ffffff";
      }
    }

    render3D();
    requestAnimationFrame(updateGameLoop);
  }

  // Boot Game Loop
  requestAnimationFrame(updateGameLoop);

  function endGame(success) {
    isGameOver = true;
    isMinigameActive = false;
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    setTimeout(() => {
      minigameOverlay.style.display = "none";
      minigameBtn.style.display = "block"; // restore button state
      
      if (success) {
        playSfx("audio/healing.mp3");
        triggerVibration([100, 50, 250]);
        showScene(config.nextSuccess);
      } else {
        playSfx("audio/game_over.mp3");
        triggerVibration([400, 200, 400]);
        showScene(config.nextFail);
      }
    }, 1000);
  }
}
