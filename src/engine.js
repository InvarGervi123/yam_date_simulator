// --- Modular Visual Novel Engine ---

let currentScene = "start";

// Typewriter & Audio settings state
let typewriterTimer = null;
let currentFullText = "";
let isTextTyping = false;
let typewriterEnabled = localStorage.getItem("gameTypewriter") !== "false";

let audioCtx = null;
function playVoiceBeep(speaker) {
  if (window.isMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    let freq = 220;
    let type = "sine";
    let vol = 0.08;
    
    const name = (speaker || "").toLowerCase();
    if (name.includes("ים") || name.includes("yam")) {
      freq = 110;
      type = "triangle";
      vol = 0.12;
    } else if (name.includes("באלדי") || name.includes("baldi")) {
      freq = 380;
      type = "sine";
      vol = 0.06;
    } else if (name.includes("ינוור") || name.includes("invar")) {
      freq = 180;
      type = "sawtooth";
      vol = 0.04;
    }
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

function skipOrAdvanceDialogue() {
  if (isTextTyping && typewriterEnabled) {
    // Reveal text immediately
    isTextTyping = false;
    if (typewriterTimer) clearTimeout(typewriterTimer);
    text.textContent = currentFullText;
    triggerVibration(10);
  } else {
    // Standard advance
    const scene = story[currentScene];
    if (scene && scene.next) {
      triggerVibration(15);
      showScene(scene.next);
    }
  }
}

const bg = document.getElementById("background");
const character = document.getElementById("character");
const speaker = document.getElementById("speaker");
const text = document.getElementById("text");
const choices = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");

// Minigame Elements
const minigameOverlay = document.getElementById("minigameOverlay");
const minigameTitle = document.getElementById("minigameTitle");
const minigameInstruction = document.getElementById("minigameInstruction");
const minigameVisual = document.getElementById("minigameVisual");
const minigameBtn = document.getElementById("minigameBtn");

const DEFAULT_BG = "images/room.jpg";
const DEFAULT_CHARACTER = "images/yam.png";

// Haptic Vibration helper
function triggerVibration(pattern) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

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

function clearChoices() {
  choices.innerHTML = "";
}

function addChoice(label, nextScene) {
  const btn = document.createElement("button");
  btn.className = "choiceBtn";
  btn.textContent = label;
  btn.onclick = () => {
    triggerVibration(15);
    showScene(nextScene);
  };
  choices.appendChild(btn);
}

function glitchText(str) {
  if (!str) return "";
  const glitchChars = "☠⛥⛧✗🕆⌖☒☣☢⚡";
  let res = "";
  for (let i = 0; i < str.length; i++) {
    if (Math.random() < 0.08 && str[i] !== '\n' && str[i] !== ' ') {
      res += glitchChars[Math.floor(Math.random() * glitchChars.length)];
    } else {
      res += str[i];
    }
  }
  return res;
}

function showScene(id) {
  const scene = story[id];

  if (scene && typeof scene.onEnter === "function") {
    scene.onEnter(scene);
  }

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

  // Determine if this is part of the horror route
  const isHorrorRoute = id.startsWith("slender") || id.includes("horror") || id === "yinover_threat";
  window.asciiModeEnabled = isHorrorRoute;

  const bgPre = document.getElementById("asciiBackground");
  const charPre = document.getElementById("asciiCharacter");
  const gameContainer = document.getElementById("game");

  // Toggle grayscale filter based on horror route
  if (isHorrorRoute) {
    if (gameContainer) gameContainer.classList.add("horror-grayscale-filter");
  } else {
    if (gameContainer) gameContainer.classList.remove("horror-grayscale-filter");
    if (bgPre) bgPre.style.display = "none";
    if (charPre) charPre.style.display = "none";
    bg.style.display = "block";
    character.style.display = "block";
  }

  // Handle Full-Screen Jumpscare Overlay
  const jumpscareDiv = document.getElementById("pregJumpscare");
  if (id === "slender_jumpscare") {
    if (jumpscareDiv) {
      jumpscareDiv.style.display = "flex";
      
      // Click anywhere to dismiss jumpscare and advance dialogue
      jumpscareDiv.onclick = () => {
        jumpscareDiv.style.display = "none";
        triggerVibration(15);
        if (nextBtn) {
          nextBtn.click();
        }
      };

      const jImg = new Image();
      jImg.onload = () => {
        const jAscii = document.getElementById("jumpscareAscii");
        window.convertToAscii(jImg, 80, 42, (str) => {
          if (jAscii) jAscii.textContent = str;
        });
      };
      jImg.src = "images/yam_dead.png";
      
      if (gameContainer) gameContainer.classList.add("effect-shake");
      triggerVibration(1000);
      playSfx("audio/break.mp3");
    }
  } else {
    if (jumpscareDiv) jumpscareDiv.style.display = "none";
  }

  const bgSrc = scene.bg === false ? "" : (scene.bg || DEFAULT_BG);
  const charSrc = scene.character === false ? "" : (scene.character || scene.characterImage || DEFAULT_CHARACTER);

  if (window.asciiModeEnabled) {
    bg.style.display = "none";
    character.style.display = "none";

    if (bgSrc) {
      if (bgPre) {
        bgPre.style.display = "block";
        const tempImg = new Image();
        tempImg.onload = () => {
          window.convertToAscii(tempImg, 85, 45, (str) => {
            if (currentScene === id) bgPre.textContent = str;
          });
        };
        tempImg.src = bgSrc;
      }
    } else {
      if (bgPre) bgPre.textContent = "";
    }

    if (charSrc) {
      if (charPre) {
        charPre.style.display = "block";
        const tempImg = new Image();
        tempImg.onload = () => {
          window.convertToAscii(tempImg, 70, 40, (str) => {
            if (currentScene === id) charPre.textContent = str;
          });
        };
        tempImg.src = charSrc;
      }
    } else {
      if (charPre) charPre.textContent = "";
    }
  } else {
    fileExistsFallbackImage(bg, bgSrc);
    fileExistsFallbackImage(character, charSrc);
  }

  // Trigger Character Animations (bounce, shake, slide_in, float)
  character.className = "";
  const anim = scene.characterAnimation || "float"; // Default to float to keep the game feeling alive
  const animClass = `char-${anim}`;
  character.classList.add(animClass);
  if (anim !== "float") {
    setTimeout(() => {
      character.classList.remove(animClass);
      character.classList.add("char-float"); // transition back to idle float bobbing
    }, 500);
  }

  speaker.textContent = scene.speaker || "";
  
  let displayText = scene.text || "";
  if (window.asciiModeEnabled) {
    displayText = glitchText(displayText);
  }

  // Handle Typewriter Text Effect
  if (typewriterTimer) clearTimeout(typewriterTimer);
  currentFullText = displayText;
  
  if (typewriterEnabled && displayText.length > 0) {
    isTextTyping = true;
    text.textContent = "";
    let charIndex = 0;
    
    function typeNextChar() {
      if (!isTextTyping) return;
      if (charIndex < currentFullText.length) {
        text.textContent += currentFullText[charIndex];
        if (charIndex % 2 === 0) {
          playVoiceBeep(scene.speaker);
        }
        charIndex++;
        typewriterTimer = setTimeout(typeNextChar, 18);
      } else {
        isTextTyping = false;
      }
    }
    typeNextChar();
  } else {
    isTextTyping = false;
    text.textContent = currentFullText;
  }
  
  clearChoices();

  if (scene.music) playMusic(scene.music);
  if (scene.sfx) playSfx(scene.sfx);

  // Trigger Visual Effects (shake, flash, redflash)
  if (scene.effect) {
    const gameContainer = document.getElementById("game");
    const effectClass = `effect-${scene.effect}`;
    gameContainer.classList.add(effectClass);
    
    // Haptic vibrations matching the visual intensity
    if (scene.effect === "shake") {
      triggerVibration([100, 50, 100]);
    } else if (scene.effect === "redflash") {
      triggerVibration(250);
    } else if (scene.effect === "flash") {
      triggerVibration(80);
    }

    setTimeout(() => {
      gameContainer.classList.remove(effectClass);
    }, 500);
  }

  // Trigger Custom Scene Vibration
  if (scene.vibrate) {
    triggerVibration(scene.vibrate);
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
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      skipOrAdvanceDialogue();
    };
  } else {
    nextBtn.style.display = "none";
  }

  // Allow clicking the dialog box itself to skip/advance
  const dialogBox = document.getElementById("dialogBox");
  if (dialogBox) {
    dialogBox.onclick = skipOrAdvanceDialogue;
  }
}

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

// Fullscreen mode handler
const fullscreenToggle = document.getElementById("fullscreenToggle");
if (fullscreenToggle) {
  fullscreenToggle.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
}

// Track fullscreen state to toggle button icon
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    if (fullscreenToggle) fullscreenToggle.textContent = "✖️";
  } else {
    if (fullscreenToggle) fullscreenToggle.textContent = "🖥️";
  }
});

if (galleryToggle) galleryToggle.onclick = openEndingsGallery;
if (closeGallery) {
  closeGallery.onclick = () => {
    galleryModal.style.display = "none";
  };
}

// Keyboard shortcuts for visual novel progression (Laptops / No-Mouse support)
window.addEventListener("keydown", (e) => {
  // Ignore key shortcuts if gallery or minigame overlays are open
  if (galleryModal && galleryModal.style.display === "flex") return;
  if (minigameOverlay && minigameOverlay.style.display === "flex") return;

  // Space or Enter advances dialogue (either completes typewriter typing, or goes to next scene)
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    skipOrAdvanceDialogue();
  }

  // Numbers 1-9 choose visual novel story choices
  if (e.key >= "1" && e.key <= "9") {
    const choiceBtns = choices.getElementsByClassName("choiceBtn");
    const index = parseInt(e.key) - 1;
    if (choiceBtns && choiceBtns[index]) {
      e.preventDefault();
      choiceBtns[index].click();
    }
  }
});

// Settings Modal UI Bindings
const settingsToggle = document.getElementById("settingsToggle");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");

const settingMusic = document.getElementById("settingMusic");
const settingSfx = document.getElementById("settingSfx");
const settingTypewriter = document.getElementById("settingTypewriter");

if (settingsToggle && settingsModal && closeSettings) {
  settingsToggle.onclick = () => {
    // Open settings modal and load current states into checkboxes
    if (settingMusic) settingMusic.checked = !window.isMusicMuted;
    if (settingSfx) settingSfx.checked = !window.isSfxMuted;
    if (settingTypewriter) settingTypewriter.checked = typewriterEnabled;
    
    settingsModal.style.display = "flex";
    triggerVibration(15);
  };
  
  closeSettings.onclick = () => {
    settingsModal.style.display = "none";
    triggerVibration(10);
  };
  
  // Close when clicking outside settings box
  settingsModal.onclick = (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  };
  
  if (settingMusic) {
    settingMusic.onchange = () => {
      window.isMusicMuted = !settingMusic.checked;
      localStorage.setItem("gameMusicMuted", window.isMusicMuted);
      triggerVibration(10);
      
      // Dynamically apply music mute state to the audio element immediately
      const musicElem = document.getElementById("music");
      if (musicElem) {
        musicElem.muted = window.isMusicMuted;
        if (!window.isMusicMuted) {
          musicElem.play().catch(() => {});
        } else {
          musicElem.pause();
        }
      }
    };
  }
  
  if (settingSfx) {
    settingSfx.onchange = () => {
      window.isSfxMuted = !settingSfx.checked;
      localStorage.setItem("gameSfxMuted", window.isSfxMuted);
      triggerVibration(10);
    };
  }
  
  if (settingTypewriter) {
    settingTypewriter.onchange = () => {
      typewriterEnabled = settingTypewriter.checked;
      localStorage.setItem("gameTypewriter", typewriterEnabled);
      triggerVibration(10);
      
      // If disabled during active typing, reveal text immediately
      if (!typewriterEnabled && isTextTyping) {
        isTextTyping = false;
        if (typewriterTimer) clearTimeout(typewriterTimer);
        text.textContent = currentFullText;
      }
    };
  }
}

// Resume audio and trigger scene music playback on very first user interaction (bypasses browser autoplay policy block)
const startAudioOnInteraction = () => {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const currentMusic = document.getElementById("music");
  if (currentMusic && !window.isMuted && currentMusic.paused) {
    currentMusic.play().catch(() => {});
  }
  window.removeEventListener("click", startAudioOnInteraction);
  window.removeEventListener("keydown", startAudioOnInteraction);
};
window.addEventListener("click", startAudioOnInteraction);
window.addEventListener("keydown", startAudioOnInteraction);

// Start Simulator
showScene("start");
