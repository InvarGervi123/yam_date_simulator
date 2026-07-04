let currentScene = "start";

const bg = document.getElementById("background");
const character = document.getElementById("character");
const speaker = document.getElementById("speaker");
const text = document.getElementById("text");
const choices = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

// Minigame Elements
const minigameOverlay = document.getElementById("minigameOverlay");
const minigameTitle = document.getElementById("minigameTitle");
const minigameInstruction = document.getElementById("minigameInstruction");
const minigameVisual = document.getElementById("minigameVisual");
const minigameBtn = document.getElementById("minigameBtn");

// Sound Control Logic
const soundToggle = document.getElementById("soundToggle");
let isMuted = true;

// Initialize as muted
music.muted = true;
sfx.muted = true;
soundToggle.textContent = "🔇";

soundToggle.onclick = () => {
  isMuted = !isMuted;
  music.muted = isMuted;
  sfx.muted = isMuted;
  soundToggle.textContent = isMuted ? "🔇" : "🔊";
  
  if (!isMuted && music.src) {
    music.play().catch(() => {});
  }
};

const DEFAULT_BG = "images/room.jpg";
const DEFAULT_CHARACTER = "images/yam.png";

// Performance Optimization: Cache for preloaded images
const preloadedImages = new Set();

function preloadNextAssets(scene) {
  if (!scene) return;
  const urlsToPreload = [];

  // Check next scene assets
  if (scene.next) {
    const nextScene = story[scene.next];
    if (nextScene) {
      if (nextScene.bg && nextScene.bg !== DEFAULT_BG) urlsToPreload.push(nextScene.bg);
      if (nextScene.character && nextScene.character !== DEFAULT_CHARACTER) urlsToPreload.push(nextScene.character);
    }
  }

  // Check choices next scenes assets
  if (scene.choices) {
    scene.choices.forEach(choice => {
      const nextScene = story[choice.next];
      if (nextScene) {
        if (nextScene.bg && nextScene.bg !== DEFAULT_BG) urlsToPreload.push(nextScene.bg);
        if (nextScene.character && nextScene.character !== DEFAULT_CHARACTER) urlsToPreload.push(nextScene.character);
      }
    });
  }

  // Preload unique URLs asynchronously
  urlsToPreload.forEach(url => {
    if (url && !preloadedImages.has(url)) {
      preloadedImages.add(url);
      const img = new Image();
      img.src = url;
    }
  });
}

function fileExistsFallbackImage(img, src) {
  if (!img || !src) {
    if (img) img.style.display = "none";
    return;
  }

  img.onerror = () => {
    img.style.display = "none";
    img.removeAttribute("src");
  };

  img.onload = () => {
    img.style.display = "block";
  };

  img.src = src;
}

function playMusic(src) {
  if (!src || !music) return;

  const current = music.getAttribute("src");
  if (current !== src) {
    music.src = src;
    music.setAttribute("src", src);
    music.volume = 0.45;
    music.loop = true;
  }

  music.play().catch(() => {});
}

function playSfx(src) {
  if (!src || !sfx) return;

  sfx.src = src;
  sfx.volume = 0.8;
  sfx.currentTime = 0;
  sfx.play().catch(() => {});
}

function clearChoices() {
  choices.innerHTML = "";
}

function addChoice(label, nextScene) {
  const btn = document.createElement("button");
  btn.className = "choiceBtn";
  btn.textContent = label;
  btn.onclick = () => showScene(nextScene);
  choices.appendChild(btn);
}

// Minigame Engine
function runMinigame(config) {
  minigameOverlay.style.display = "flex";
  
  // Hide choices and nextBtn so player cannot skip
  clearChoices();
  nextBtn.style.display = "none";
  
  if (window.minigameInterval) clearInterval(window.minigameInterval);
  
  let timeLeft = config.duration; // in ms
  let score = 0;
  
  // Reset buttons positions & events
  minigameBtn.style.position = "";
  minigameBtn.style.left = "";
  minigameBtn.style.top = "";
  minigameBtn.style.transform = "";
  minigameBtn.onclick = null;
  
  if (config.type === "click_mash") {
    minigameTitle.textContent = "משחק לחיצות מהיר!";
    minigameInstruction.textContent = `לחץ/י על הכפתור ${config.target} פעמים תוך ${(config.duration / 1000).toFixed(1)} שניות!`;
    minigameBtn.textContent = "ללחוץ!!";
    
    minigameVisual.innerHTML = `
      <div class="mg-progress-container">
        <div class="mg-progress-bar" id="mgBar" style="width: 0%;"></div>
      </div>
      <div class="mg-timer" id="mgTimer">זמן נותר: ${(timeLeft / 1000).toFixed(1)}s</div>
    `;
    
    const mgBar = document.getElementById("mgBar");
    const mgTimer = document.getElementById("mgTimer");
    
    minigameBtn.onclick = () => {
      score++;
      const percent = Math.min((score / config.target) * 100, 100);
      if (mgBar) mgBar.style.width = percent + "%";
      
      playSfx("audio/click.mp3"); // Play sound if exists
      
      if (score >= config.target) {
        endMinigame(true);
      }
    };
    
    const tick = 50;
    window.minigameInterval = setInterval(() => {
      timeLeft -= tick;
      if (mgTimer) mgTimer.textContent = `זמן נותר: ${Math.max(timeLeft / 1000, 0).toFixed(1)}s`;
      if (timeLeft <= 0) {
        endMinigame(false);
      }
    }, tick);
    
  } else if (config.type === "qte") {
    minigameTitle.textContent = "זמן תגובה מהיר!";
    minigameInstruction.textContent = `לחץ/י על הכפתור מהר!`;
    minigameBtn.textContent = "להתחמק!";
    
    // Position button randomly inside the overlay
    minigameBtn.style.position = "absolute";
    const x = Math.random() * 50 + 25; // 25% to 75%
    const y = Math.random() * 40 + 30; // 30% to 70%
    minigameBtn.style.left = `${x}%`;
    minigameBtn.style.top = `${y}%`;
    minigameBtn.style.transform = "translate(-50%, -50%)";
    
    minigameVisual.innerHTML = `
      <div class="mg-timer" id="mgTimer">זמן נותר: ${(timeLeft / 1000).toFixed(1)}s</div>
    `;
    
    const mgTimer = document.getElementById("mgTimer");
    
    minigameBtn.onclick = () => {
      endMinigame(true);
    };
    
    const tick = 25;
    window.minigameInterval = setInterval(() => {
      timeLeft -= tick;
      if (mgTimer) mgTimer.textContent = `זמן נותר: ${Math.max(timeLeft / 1000, 0).toFixed(1)}s`;
      if (timeLeft <= 0) {
        endMinigame(false);
      }
    }, tick);
    
  } else if (config.type === "timing_bar") {
    minigameTitle.textContent = "דיוק בעיתוי!";
    minigameInstruction.textContent = "לחץ/י בדיוק כשהמחוון נמצא באזור הכחול!";
    minigameBtn.textContent = "עצור!";
    
    minigameVisual.innerHTML = `
      <div class="mg-timing-container">
        <div class="mg-timing-zone"></div>
        <div class="mg-timing-indicator" id="mgIndicator" style="left: 0%;"></div>
      </div>
      <div class="mg-timer" id="mgTimer">זמן נותר: ${(timeLeft / 1000).toFixed(1)}s</div>
    `;
    
    const indicator = document.getElementById("mgIndicator");
    const mgTimer = document.getElementById("mgTimer");
    
    let position = 0;
    let direction = 1;
    const speed = 3.5; // percent per tick
    
    const animInterval = setInterval(() => {
      position += speed * direction;
      if (position >= 100) {
        position = 100;
        direction = -1;
      } else if (position <= 0) {
        position = 0;
        direction = 1;
      }
      if (indicator) indicator.style.left = position + "%";
    }, 20);
    
    minigameBtn.onclick = () => {
      clearInterval(animInterval);
      // Success zone is 40% to 60%
      if (position >= 40 && position <= 60) {
        endMinigame(true);
      } else {
        endMinigame(false);
      }
    };
    
    const tick = 50;
    window.minigameInterval = setInterval(() => {
      timeLeft -= tick;
      if (mgTimer) mgTimer.textContent = `זמן נותר: ${Math.max(timeLeft / 1000, 0).toFixed(1)}s`;
      if (timeLeft <= 0) {
        clearInterval(animInterval);
        endMinigame(false);
      }
    }, tick);
  }
  
  function endMinigame(success) {
    clearInterval(window.minigameInterval);
    minigameOverlay.style.display = "none";
    
    // Reset positions
    minigameBtn.style.position = "";
    minigameBtn.style.left = "";
    minigameBtn.style.top = "";
    minigameBtn.style.transform = "";
    
    if (success) {
      showScene(config.nextSuccess);
    } else {
      showScene(config.nextFail);
    }
  }
}

function showScene(id) {
  const scene = story[id];

  if (!scene) {
    speaker.textContent = "שגיאה";
    text.textContent = "הסצנה לא קיימת: " + id;
    clearChoices();
    nextBtn.style.display = "block";
    nextBtn.textContent = "חזרה להתחלה";
    nextBtn.onclick = () => showScene("start");
    return;
  }

  currentScene = id;

  const bgSrc = scene.bg === false ? "" : (scene.bg || DEFAULT_BG);
  const charSrc = scene.character === false ? "" : (scene.character || scene.characterImage || DEFAULT_CHARACTER);

  fileExistsFallbackImage(bg, bgSrc);
  fileExistsFallbackImage(character, charSrc);

  // Trigger Character Animations (bounce, shake, slide_in, float)
  character.className = "";
  if (scene.characterAnimation) {
    const animClass = `char-${scene.characterAnimation}`;
    character.classList.add(animClass);
    if (scene.characterAnimation !== "float") {
      setTimeout(() => {
        character.classList.remove(animClass);
      }, 500);
    }
  }

  speaker.textContent = scene.speaker || "";
  text.textContent = scene.text || "";
  clearChoices();

  if (scene.music) playMusic(scene.music);
  if (scene.sfx) playSfx(scene.sfx);

  // Trigger Visual Effects (shake, flash, redflash)
  if (scene.effect) {
    const gameContainer = document.getElementById("game");
    const effectClass = `effect-${scene.effect}`;
    gameContainer.classList.add(effectClass);
    setTimeout(() => {
      gameContainer.classList.remove(effectClass);
    }, 500);
  }

  // Performance Preloading Optimization
  preloadNextAssets(scene);

  // Check for Minigame Trigger
  if (scene.minigame) {
    runMinigame(scene.minigame);
    return;
  }

  if (scene.end) {
    unlockEnding(id);
    nextBtn.style.display = "none";
    addChoice("לשחק שוב מההתחלה", "start");
    return;
  }

  if (scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    scene.choices.forEach(choice => addChoice(choice.text, choice.next));
    return;
  }

  if (scene.next) {
    nextBtn.style.display = "block";
    nextBtn.textContent = scene.nextText || "המשך";
    nextBtn.onclick = () => showScene(scene.next);
  } else {
    nextBtn.style.display = "none";
  }
}

showScene("start");

// --- Ending Tracker Cookie & Modal UI Logic ---

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function getUnlockedEndings() {
  const cookieVal = getCookie("unlocked_endings");
  if (!cookieVal) return [];
  try {
    return JSON.parse(cookieVal);
  } catch (e) {
    return [];
  }
}

function unlockEnding(endingId) {
  const unlocked = getUnlockedEndings();
  if (!unlocked.includes(endingId)) {
    unlocked.push(endingId);
    setCookie("unlocked_endings", JSON.stringify(unlocked));
  }
}

const galleryToggle = document.getElementById("galleryToggle");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const galleryBody = document.getElementById("galleryBody");
const galleryCount = document.getElementById("galleryCount");
const galleryTotal = document.getElementById("galleryTotal");

function openEndingsGallery() {
  galleryBody.innerHTML = "";
  
  // Dynamic Ending Scanning
  const endings = [];
  for (let key in story) {
    if (story[key].end) {
      const rawText = story[key].text || "";
      // Clean up emojis and get first line of ending text
      const cleanName = rawText.split('\n')[0].replace(/^[🎨🤖📹📻💀🖼💔⚖🏳🎬🏆🏎🧆🍿🎥⭐🚌💸💬📷😬🌿🧬⚙️📁😭🧺💍🦾🖤☔🛏🫳]*/g, '').trim();
      endings.push({
        id: key,
        speaker: story[key].speaker || "סוף",
        cleanName: cleanName
      });
    }
  }

  const unlocked = getUnlockedEndings();
  galleryCount.textContent = unlocked.length;
  galleryTotal.textContent = endings.length;

  endings.forEach((end, idx) => {
    const isUnlocked = unlocked.includes(end.id);
    const tr = document.createElement("tr");
    tr.className = isUnlocked ? "unlocked-row" : "locked-row";

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${isUnlocked ? `${end.speaker}: ${end.cleanName}` : "🔒 ???"}</td>
      <td><span class="${isUnlocked ? 'unlocked-badge' : 'locked-badge'}">${isUnlocked ? 'פתוח' : 'נעול'}</span></td>
    `;
    galleryBody.appendChild(tr);
  });

  galleryModal.style.display = "flex";
}

galleryToggle.onclick = openEndingsGallery;
closeGallery.onclick = () => {
  galleryModal.style.display = "none";
};
