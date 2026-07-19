// --- Baldi's Basics in Oranit: 3D Raycaster Engine ---

const jumpscareYamImg = new Image();
jumpscareYamImg.src = "images/yam.png";

function runBaldiMinigame(config) {
  const minigameBox = document.getElementById("minigameBox");
  if (minigameBox) {
    minigameBox.classList.add("baldi-active");
  }

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

  let correctAnswers = 0;
  let mistakesCount = 0;

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
  let invincibilityTime = 0;

  // Sound slaps loop
  let yamLastSlap = 0;

  // Keys pressed
  let keys = { w: false, s: false, a: false, d: false };

  // Context broker for renderer access
  /**
   * @typedef {Object} BaldiCtx
   * @property {number} px - Player X grid coordinate.
   * @property {number} py - Player Y grid coordinate.
   * @property {number} pa - Player angle of view (radians).
   * @property {number} fov - Field of view angle (radians).
   * @property {number} mapSize - Dimensions of the square map.
   * @property {Array<number>} map - 1D array representing the map grid (1 = wall, 0 = floor).
   * @property {Array<Object>} sprites - Active 3D billboards (like notebooks).
   * @property {Object} yamRef - Coordinates and state of the chasing Baldi Yam.
   * @property {string|null} hudAlert - Dynamic text warning displayed in HUD.
   * @property {boolean} jumpScareActive - Flag if jumpscare triggers.
   * @property {HTMLImageElement} jumpscareYamImg - Image source for the jumpscare sprite.
   */
  const baldiCtx = {
    get px() { return px; },
    get py() { return py; },
    get pa() { return pa; },
    get fov() { return fov; },
    get mapSize() { return mapSize; },
    get map() { return map; },
    get sprites() { return sprites; },
    get yamRef() { return yamRef; },
    get hudAlert() { return hudAlert; },
    get jumpScareActive() { return jumpScareActive; },
    get jumpscareYamImg() { return jumpscareYamImg; }
  };

  function playSfx(src) {
    if (window.audioEngine && typeof window.audioEngine.playSfx === "function") {
      window.audioEngine.playSfx(src);
    }
  }

  function triggerVibration(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

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

  function checkAndActivateYam() {
    if (mistakesCount >= 1 && !yamRef.active) {
      yamRef.active = true;
      promptText.textContent = "ים כועס! מצא את כל המחברות והימלט מדלת היציאה 🚪!";
      promptText.style.color = "#ff3333";
      playSfx("audio/hit.mp3");
    }
  }

  // --- You Can Think! Pad Math Session ---
  function startPadSession() {
    activePadSession = true;
    keys.w = keys.s = keys.a = keys.d = false; // Reset movements
    padModal.style.display = "flex";
    
    let step = 1;

    let a1 = Math.floor(Math.random() * 8) + 2;
    let b1 = Math.floor(Math.random() * 8) + 2;
    let ans1 = a1 + b1;

    let a2 = Math.floor(Math.random() * 4) + 2;
    let b2 = Math.floor(Math.random() * 4) + 2;
    let ans2 = a2 * b2;

    padScreen.classList.remove("baldi-red-alert");
    padTeacherImg.classList.remove("baldi-glitch-face");
    padInput.value = "";
    
    padInput.onkeypress = (e) => {
      if (!/[0-9\-]/.test(e.key)) {
        e.preventDefault();
      }
    };
    padInput.oninput = () => {
      padInput.value = padInput.value.replace(/[^0-9\-]/g, "");
    };

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
        if (val === ans1) {
          correctAnswers++;
        } else {
          mistakesCount++;
          checkAndActivateYam();
        }
        step = 2;
        padInput.value = "";
        padProbNum.textContent = "Problem 2 of 3";
        padQText.textContent = `${a2} × ${b2} = ?`;
        padInput.focus();
      } else if (step === 2) {
        if (val === ans2) {
          correctAnswers++;
        } else {
          mistakesCount++;
          checkAndActivateYam();
        }
        step = 3;
        padInput.value = "";
        
        playSfx("audio/rip.mp3");
        triggerVibration([200, 100, 200]);
        padScreen.classList.add("baldi-red-alert");
        padTeacherImg.classList.add("baldi-glitch-face");

        padProbNum.textContent = "Problem 3 of 3";
        padQText.textContent = `${Math.floor(Math.random() * 9000) + 1000} + ▓░▒█ × ░▒ = ?`;
        padInput.focus();
      } else if (step === 3) {
        mistakesCount++; // Q3 glitch is always wrong
        checkAndActivateYam();
        playSfx("audio/crack.mp3");
        triggerVibration([400, 100, 400]);

        currentNotebookRef.collected = true;
        currentNotebookRef.label = "📖";
        collectedNotebooksCount++;
        notebookCounter.textContent = `Notebooks: ${collectedNotebooksCount}/3`;

        padModal.style.display = "none";
        activePadSession = false;

        if (collectedNotebooksCount >= 3) {
          exitRef.active = true;
          promptText.textContent = "מצא את היציאה 🚪! מהר!";
          promptText.style.color = "#ffff00";
        }
      }
    };
  }

  // --- Real-time Main Loop ---
  function updateGameLoop() {
    if (!isMinigameActive || isGameOver) return;
    
    // 1. Player movement and exit checks (ONLY when pad is closed and no jumpscare)
    if (!activePadSession && !jumpScareActive) {
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

        // Collision bounds checking (allow walking on corridors 0 and doors 2)
        if (map[Math.floor(py)][Math.floor(nextX)] !== 1) px = nextX;
        if (map[Math.floor(nextY)][Math.floor(px)] !== 1) py = nextY;
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

    // 2. Yam Chasing, Slapping, and Catch Checks (Runs always, even with open pad)
    if (!jumpScareActive) {
      if (yamRef.active) {
        let timeNow = Date.now();
        
        let dx = px - yamRef.x;
        let dy = py - yamRef.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        let targetInterval = Math.max(180, Math.min(1300, (dist * 250) - (mistakesCount * 120)));
        
        if (timeNow - yamLastSlap > targetInterval) {
          yamLastSlap = timeNow;
          playSfx("audio/crack.mp3"); // Slap ruler!
          triggerVibration(20);

          let gridDirX = Math.sign(px - yamRef.x);
          let gridDirY = Math.sign(py - yamRef.y);

          let stepAmount = 0.55 + mistakesCount * 0.12;
          let nextYamX = yamRef.x + gridDirX * stepAmount;
          let nextYamY = yamRef.y + gridDirY * stepAmount;

          let prevX = yamRef.x;
          let prevY = yamRef.y;

          if (map[Math.floor(yamRef.y)][Math.floor(nextYamX)] !== 1) yamRef.x = nextYamX;
          if (map[Math.floor(nextYamY)][Math.floor(yamRef.x)] !== 1) yamRef.y = nextYamY;

          // Unstick pathfinding fallback: if Yam gets blocked by a corner/wall, find the best neighbor cell
          if (yamRef.x === prevX && yamRef.y === prevY) {
            let neighbors = [
              {x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}
            ];
            neighbors.sort((a, b) => {
              let distA = Math.hypot(px - (yamRef.x + a.x), py - (yamRef.y + a.y));
              let distB = Math.hypot(px - (yamRef.x + b.x), py - (yamRef.y + b.y));
              return distA - distB;
            });
            for (let n of neighbors) {
              let targetX = yamRef.x + n.x * stepAmount;
              let targetY = yamRef.y + n.y * stepAmount;
              if (targetX >= 1 && targetX < mapSize - 1 && targetY >= 1 && targetY < mapSize - 1) {
                if (map[Math.floor(targetY)][Math.floor(targetX)] !== 1) {
                  yamRef.x = targetX;
                  yamRef.y = targetY;
                  break;
                }
              }
            }
          }
        }

        // Catch check
        if (dist < 0.6 && !jumpScareActive && Date.now() > invincibilityTime) {
          lives--;
          jumpScareActive = true;
          mistakesCount++;
          invincibilityTime = Date.now() + 2000; // 2 seconds of invincibility to prevent instant death loops
          
          playSfx("audio/hit.mp3");
          triggerVibration([500, 150, 500]);

          const gc = document.getElementById("game");
          if (gc) {
            gc.classList.add("effect-redflash");
            setTimeout(() => gc.classList.remove("effect-redflash"), 300);
          }

          // Force close the pad if caught while solving math questions!
          padModal.style.display = "none";
          activePadSession = false;

          if (lives <= 0) {
            promptText.textContent = "נתפסת על ידי ים!";
            promptText.style.color = "#ff0000";
            setTimeout(() => {
              jumpScareActive = false;
              endGame(false);
            }, 1200);
            return;
          } else {
            promptText.textContent = `נפגעת! נשארו לך ${lives} חיים!`;
            promptText.style.color = "#ff3333";
            setTimeout(() => {
              jumpScareActive = false;
              // Push Yam back step-by-step checking for wall collisions to prevent clipping
              let pushDirX = -Math.sign(px - yamRef.x);
              let pushDirY = -Math.sign(py - yamRef.y);
              
              for (let step = 0; step < 4; step++) {
                let nextX = yamRef.x + pushDirX;
                let nextY = yamRef.y + pushDirY;
                
                if (nextX >= 1 && nextX < mapSize - 1 && nextY >= 1 && nextY < mapSize - 1) {
                  if (map[Math.floor(yamRef.y)][Math.floor(nextX)] !== 1) yamRef.x = nextX;
                  if (map[Math.floor(nextY)][Math.floor(yamRef.x)] !== 1) yamRef.y = nextY;
                }
              }
            }, 600);
          }
        }
      }
    }

    // Call outsourced 3D Raycasting Renderer
    if (window.baldiRenderer && typeof window.baldiRenderer.render3D === "function") {
      window.baldiRenderer.render3D(baldiCtx, ctx);
    }

    requestAnimationFrame(updateGameLoop);
  }

  // Boot Game Loop
  requestAnimationFrame(updateGameLoop);

  function endGame(success) {
    isGameOver = true;
    isMinigameActive = false;
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    if (minigameBox) {
      minigameBox.classList.remove("baldi-active");
    }

    setTimeout(() => {
      minigameOverlay.style.display = "none";
      minigameBtn.style.display = "block"; // restore button state
      
      if (success) {
        playSfx("audio/healing.mp3");
        triggerVibration([100, 50, 250]);
        if (correctAnswers === 0) {
          showScene("end_baldi_secret_suspicious");
        } else {
          showScene(config.nextSuccess);
        }
      } else {
        playSfx("audio/game_over.mp3");
        triggerVibration([400, 200, 400]);
        showScene(config.nextFail);
      }
    }, 1000);
  }
}
