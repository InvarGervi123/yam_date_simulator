// --- Modular Visual Novel Engine ---

let currentScene = "start";

// Typewriter & Audio settings state
let typewriterTimer = null;
let currentFullText = "";
let isTextTyping = false;
let typewriterEnabled = localStorage.getItem("gameTypewriter") !== "false";
let animationsEnabled = localStorage.getItem("gameAnimations") !== "false";
let oledModeEnabled = localStorage.getItem("gameOled") === "true";

// Autoplay tracking state to prevent browser warning spam
window.hasUserInteracted = false;

let audioCtx = null;
function playVoiceBeep(speaker) {
  if (window.isSfxMuted || !window.hasUserInteracted) return;
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
      if (window.ttsEngine) window.ttsEngine.cancel();
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

const DEFAULT_BG = "images/backgrounds/room.jpg";
const DEFAULT_CHARACTER = "images/characters/yam.png";

// Haptic Vibration helper
function triggerVibration(pattern) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
  if (window.gamepadEngine && typeof window.gamepadEngine.triggerRumble === "function") {
    const dur = Array.isArray(pattern) ? pattern.reduce((a, b) => a + b, 0) : (Number(pattern) || 100);
    window.gamepadEngine.triggerRumble(0.6, 0.6, Math.min(dur, 800));
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
  if (choices) choices.scrollTop = 0;
}

function addChoice(label, nextScene, onSelect) {
  const btn = document.createElement("button");
  btn.className = "choiceBtn";
  btn.textContent = label;
  btn.onclick = (e) => {
    if (btn.dataset.clicked === "true") return;
    btn.dataset.clicked = "true";
    setTimeout(() => { btn.dataset.clicked = "false"; }, 300);

    if (window.ttsEngine) window.ttsEngine.cancel();
    triggerVibration(15);
    if (typeof onSelect === "function") {
      try { onSelect(); } catch (err) { console.error("Error in choice onSelect:", err); }
    }
    const target = (typeof nextScene === "function") ? nextScene() : nextScene;
    showScene(target);
  };
  choices.appendChild(btn);
}

/**
 * Randomly replaces characters in a string with creepy glitch/horror symbols.
 * Used during the Slender and horror routes.
 * @param {string} str - The target text to be glitched.
 * @returns {string} The glitched text string.
 */
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

/**
 * Renders a visual novel scene by updating text, character sprite animations,
 * background images, sounds, visual screen effects, and choices in the HUD.
 * @param {string|Function} target - The unique identifier of the story scene or a getter function returning it.
 */
function showScene(target) {
  window.showScene = showScene;
  const id = (typeof target === "function") ? target() : target;
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

  // Handle Courtroom Beth Din Mode activation & Speaker styling
  const isCourtScene = id.startsWith("court_") || id.startsWith("end_court");
  if (window.courtEngine) {
    window.courtEngine.setCourtActive(isCourtScene);
    window.courtEngine.setSpeedlines(!!scene.speedlines);
    window.courtEngine.setDualInvars(!!scene.dualInvars, scene.speaker);
    if (scene.holdIt) window.courtEngine.triggerHoldIt();
    if (scene.objection) window.courtEngine.triggerObjection();
    if (scene.gavel) window.courtEngine.triggerGavel();
    if (scene.deskSlam) window.courtEngine.triggerDeskSlam();
    if (scene.zoom) window.courtEngine.triggerDramaticZoom();
    if (scene.blackout !== undefined) window.courtEngine.triggerBlackout(!!scene.blackout);
  }

  const gameContainer = document.getElementById("game");
  if (gameContainer) {
    gameContainer.classList.remove("speaker-invar", "speaker-yam", "speaker-judge", "speaker-liliya");
    const spk = String(scene.speaker || "");
    if (spk.includes("ינוור")) gameContainer.classList.add("speaker-invar");
    else if (spk.includes("ים")) gameContainer.classList.add("speaker-yam");
    else if (spk.includes("שופט") || spk.includes("בית הדין")) gameContainer.classList.add("speaker-judge");
    else if (spk.includes("ליליה")) gameContainer.classList.add("speaker-liliya");
  }

  // Handle Persona 5 Main Menu Display
  const p5Menu = document.getElementById("p5MainMenuContainer");
  const dialogBox = document.getElementById("dialogBox");

  if (id === "start" || id === "main_menu") {
    if (typeof stopWiiPulseGame === "function") stopWiiPulseGame();
    if (window.ttsEngine) window.ttsEngine.cancel();
    if (p5Menu) p5Menu.style.display = "flex";
    if (dialogBox) dialogBox.style.display = "none";
    if (choices) choices.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (character) character.style.display = "none";
    const bgPre = document.getElementById("asciiBackground");
    const charPre = document.getElementById("asciiCharacter");
    if (bgPre) bgPre.style.display = "none";
    if (charPre) charPre.style.display = "none";
    bg.style.display = "block";
    fileExistsFallbackImage(bg, scene.bg || "images/backgrounds/room.jpg");
    if (scene.music) playMusic(scene.music);
    return;
  } else {
    if (p5Menu) p5Menu.style.display = "none";
    if (dialogBox) dialogBox.style.display = "block";
    if (choices) choices.style.display = "flex";
  }

  // Determine if this is part of the horror route
  const isHorrorRoute = id.startsWith("slender") || id.includes("horror") || id === "yinover_threat";
  window.asciiModeEnabled = isHorrorRoute;

  const bgPre = document.getElementById("asciiBackground");
  const charPre = document.getElementById("asciiCharacter");

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
      jImg.src = "images/characters/yam_dead.png";
      
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

    const savedContrast = parseInt(localStorage.getItem("gameContrast") || "100");
    if (savedContrast !== 100) {
      bg.style.filter = `contrast(${savedContrast}%)`;
    } else {
      bg.style.filter = "";
    }
  }

  // Trigger Character Animations (bounce, shake, slide_in, float)
  character.className = "";
  if (animationsEnabled) {
    const anim = scene.characterAnimation || "float"; // Default to float to keep the game feeling alive
    const animClass = `char-${anim}`;
    character.classList.add(animClass);
    if (anim !== "float") {
      setTimeout(() => {
        if (animationsEnabled) {
          character.classList.remove(animClass);
          character.classList.add("char-float"); // transition back to idle float bobbing
        }
      }, 500);
    }
  }

  speaker.textContent = scene.speaker || "";
  
  let displayText = scene.text || "";
  if (window.asciiModeEnabled) {
    displayText = glitchText(displayText);
  }

  // Trigger Dynamic Atmosphere & Story Mood System
  if (window.atmosphereEngine) {
    window.atmosphereEngine.autoDetectStoryMood(displayText, id, scene);
  }

  // Handle Typewriter Text Effect
  if (typewriterTimer) clearTimeout(typewriterTimer);
  currentFullText = displayText;
  
  if (typewriterEnabled && displayText.length > 0) {
    isTextTyping = true;
    text.textContent = "";
    if (text) text.scrollTop = 0;
    let charIndex = 0;
    
    function typeNextChar() {
      if (!isTextTyping) return;
      if (charIndex < currentFullText.length) {
        text.textContent += currentFullText[charIndex];
        if (charIndex % 2 === 0) {
          playVoiceBeep(scene.speaker);
          triggerVibration(8);
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
    if (text) text.scrollTop = 0;
  }
  
  clearChoices();

  // Trigger Local Text-To-Speech (TTS) Voice Dubbing
  if (window.ttsEngine) {
    window.ttsEngine.speakDialogue(scene.speaker, displayText);
  }

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
    if (window.ttsEngine) window.ttsEngine.cancel();
    runMinigame(scene.minigame);
    return;
  }

  if (scene.end) {
    if (typeof stopWiiPulseGame === "function") stopWiiPulseGame();
    unlockEnding(id);
    nextBtn.style.display = "none";
    addChoice("לשחק שוב מההתחלה", "start");
    return;
  }

  if (scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    scene.choices.forEach(choice => addChoice(choice.text, choice.next, choice.onSelect));
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
  let raw = null;
  try {
    raw = localStorage.getItem("unlocked_endings");
  } catch (e) {}
  if (!raw) {
    raw = getCookie("unlocked_endings");
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function unlockEnding(endingId) {
  if (!endingId) return;
  const unlocked = getUnlockedEndings();
  if (!unlocked.includes(endingId)) {
    unlocked.push(endingId);
    const jsonStr = JSON.stringify(unlocked);
    try {
      localStorage.setItem("unlocked_endings", jsonStr);
    } catch (e) {}
    setCookie("unlocked_endings", jsonStr);
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
    if (story[key] && story[key].end) {
      // Execute onEnter if present to evaluate dynamic titles/text
      if (typeof story[key].onEnter === "function" && !story[key].text) {
        try { story[key].onEnter(story[key]); } catch (e) {}
      }
      const rawText = story[key].text || story[key].speaker || key;
      const cleanName = rawText.split('\n')[0].replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*/gu, '').trim() || key;
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

// Keyboard shortcuts for visual novel progression & Persona 5 menu (Laptops / No-Mouse support)
window.addEventListener("keydown", (e) => {
  const updatesModal = document.getElementById("updatesModal");
  const diagnosticsModal = document.getElementById("diagnosticsModal");
  const settingsModal = document.getElementById("settingsModal");
  const p5Menu = document.getElementById("p5MainMenuContainer");

  // Escape closes any open modal
  if (e.key === "Escape") {
    if (updatesModal && updatesModal.style.display === "flex") {
      updatesModal.style.display = "none";
      triggerVibration(10);
      return;
    }
    if (diagnosticsModal && diagnosticsModal.style.display === "flex") {
      diagnosticsModal.style.display = "none";
      triggerVibration(10);
      return;
    }
    if (settingsModal && settingsModal.style.display === "flex") {
      settingsModal.style.display = "none";
      triggerVibration(10);
      return;
    }
    if (galleryModal && galleryModal.style.display === "flex") {
      galleryModal.style.display = "none";
      triggerVibration(10);
      return;
    }
  }

  // If inside diagnostics modal, let diagnostics key detector handle keys
  if (diagnosticsModal && diagnosticsModal.style.display === "flex") return;
  if (updatesModal && updatesModal.style.display === "flex") return;
  if (settingsModal && settingsModal.style.display === "flex") return;
  if (galleryModal && galleryModal.style.display === "flex") return;
  if (minigameOverlay && minigameOverlay.style.display === "flex") return;

  // Persona 5 Main Menu shortcuts
  if (p5Menu && p5Menu.style.display === "flex") {
    if (e.key === "1" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnPlay");
      if (btn) btn.click();
    } else if (e.key === "2") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnCourt");
      if (btn) btn.click();
    } else if (e.key === "3") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnUpdates");
      if (btn) btn.click();
    } else if (e.key === "4") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnDiagnostics");
      if (btn) btn.click();
    } else if (e.key === "5") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnSettings");
      if (btn) btn.click();
    } else if (e.key === "6") {
      e.preventDefault();
      const btn = document.getElementById("p5BtnGallery");
      if (btn) btn.click();
    }
    return;
  }

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
    
    const settingAnimation = document.getElementById("settingAnimation");
    const settingOled = document.getElementById("settingOled");
    const settingAtmosphere = document.getElementById("settingAtmosphere");
    const settingTts = document.getElementById("settingTts");
    if (settingAnimation) settingAnimation.checked = animationsEnabled;
    if (settingOled) settingOled.checked = oledModeEnabled;
    if (settingAtmosphere && window.atmosphereEngine) settingAtmosphere.checked = window.atmosphereEngine.isAtmosphereEnabled();
    if (settingTts && window.ttsEngine) settingTts.checked = window.ttsEngine.isEnabled();
    
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

  const settingAnimation = document.getElementById("settingAnimation");
  const settingOled = document.getElementById("settingOled");
  const settingAtmosphere = document.getElementById("settingAtmosphere");

  if (settingAnimation) {
    settingAnimation.onchange = () => {
      animationsEnabled = settingAnimation.checked;
      localStorage.setItem("gameAnimations", animationsEnabled);
      triggerVibration(10);
      
      // Update sprite styling instantly
      if (!animationsEnabled) {
        character.className = "";
      } else {
        character.classList.add("char-float");
      }
    };
  }

  if (settingOled) {
    settingOled.onchange = () => {
      oledModeEnabled = settingOled.checked;
      localStorage.setItem("gameOled", oledModeEnabled);
      triggerVibration(10);
      
      const gameElem = document.getElementById("game");
      if (gameElem) {
        if (oledModeEnabled) {
          gameElem.classList.add("oled-mode");
        } else {
          gameElem.classList.remove("oled-mode");
        }
      }
    };
  }

  if (settingAtmosphere) {
    settingAtmosphere.onchange = () => {
      if (window.atmosphereEngine) {
        window.atmosphereEngine.setAtmosphereEnabled(settingAtmosphere.checked);
        triggerVibration(10);
      }
    };
  }

  const settingTts = document.getElementById("settingTts");
  if (settingTts) {
    settingTts.checked = window.ttsEngine ? window.ttsEngine.isEnabled() : (localStorage.getItem("gameTts") !== "false");
    settingTts.onchange = () => {
      if (window.ttsEngine) {
        window.ttsEngine.setEnabled(settingTts.checked);
      }
      triggerVibration(10);
    };
  }

  // --- Advanced Display & Sound Steppers ---
  let gameContrast = parseInt(localStorage.getItem("gameContrast") || "100");
  let gameMusicVol = parseInt(localStorage.getItem("gameMusicVol") || "50");
  let gameSfxVol = parseInt(localStorage.getItem("gameSfxVol") || "80");

  const labelContrast = document.getElementById("labelContrast");
  const labelMusicVol = document.getElementById("labelMusicVol");
  const labelSfxVol = document.getElementById("labelSfxVol");

  function applyContrast(val) {
    gameContrast = Math.max(70, Math.min(160, val));
    localStorage.setItem("gameContrast", String(gameContrast));
    if (labelContrast) labelContrast.textContent = `${gameContrast}%`;
    const bgElem = document.getElementById("background");
    if (bgElem) bgElem.style.filter = `contrast(${gameContrast}%)`;
    triggerVibration(8);
  }

  function applyMusicVol(val) {
    gameMusicVol = Math.max(0, Math.min(100, val));
    if (labelMusicVol) labelMusicVol.textContent = `${gameMusicVol}%`;
    if (typeof window.setMusicVolume === "function") {
      window.setMusicVolume(gameMusicVol);
    }
    triggerVibration(8);
  }

  function applySfxVol(val) {
    gameSfxVol = Math.max(0, Math.min(100, val));
    if (labelSfxVol) labelSfxVol.textContent = `${gameSfxVol}%`;
    if (typeof window.setSfxVolume === "function") {
      window.setSfxVolume(gameSfxVol);
    }
    if (typeof playSfx === "function") playSfx("audio/click.mp3");
    triggerVibration(8);
  }

  // Initial display setup
  applyContrast(gameContrast);
  if (labelMusicVol) labelMusicVol.textContent = `${gameMusicVol}%`;
  if (labelSfxVol) labelSfxVol.textContent = `${gameSfxVol}%`;

  // Contrast buttons
  const btnContrastDown = document.getElementById("btnContrastDown");
  const btnContrastUp = document.getElementById("btnContrastUp");
  if (btnContrastDown) btnContrastDown.onclick = () => applyContrast(gameContrast - 10);
  if (btnContrastUp) btnContrastUp.onclick = () => applyContrast(gameContrast + 10);

  // Music Volume buttons
  const btnMusicVolDown = document.getElementById("btnMusicVolDown");
  const btnMusicVolUp = document.getElementById("btnMusicVolUp");
  if (btnMusicVolDown) btnMusicVolDown.onclick = () => applyMusicVol(gameMusicVol - 10);
  if (btnMusicVolUp) btnMusicVolUp.onclick = () => applyMusicVol(gameMusicVol + 10);

  // SFX Volume buttons
  const btnSfxVolDown = document.getElementById("btnSfxVolDown");
  const btnSfxVolUp = document.getElementById("btnSfxVolUp");
  if (btnSfxVolDown) btnSfxVolDown.onclick = () => applySfxVol(gameSfxVol - 10);
  if (btnSfxVolUp) btnSfxVolUp.onclick = () => applySfxVol(gameSfxVol + 10);

  // Special Settings Submenu Toggle (Expand / Collapse)
  const btnToggleSpecial = document.getElementById("btnToggleSpecialSettings");
  const specialContainer = document.getElementById("specialSettingsContainer");
  const specialArrow = document.getElementById("specialSettingsArrow");

  if (btnToggleSpecial && specialContainer) {
    btnToggleSpecial.onclick = () => {
      const isHidden = specialContainer.style.display === "none";
      specialContainer.style.display = isHidden ? "flex" : "none";
      if (specialArrow) specialArrow.textContent = isHidden ? "▲" : "▼";
      triggerVibration(12);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
    };
  }

  // --- TTS Volume & Speed Steppers ---
  let gameTtsVol = parseInt(localStorage.getItem("gameTtsVol") || "100");
  let gameTtsRate = parseInt(localStorage.getItem("gameTtsRate") || "100");

  const labelTtsVol = document.getElementById("labelTtsVol");
  const labelTtsRate = document.getElementById("labelTtsRate");

  function applyTtsVol(val) {
    gameTtsVol = Math.max(0, Math.min(100, val));
    if (labelTtsVol) labelTtsVol.textContent = `${gameTtsVol}%`;
    if (window.ttsEngine) window.ttsEngine.setVolume(gameTtsVol);
    triggerVibration(8);
  }

  function applyTtsRate(val) {
    gameTtsRate = Math.max(50, Math.min(200, val));
    if (labelTtsRate) labelTtsRate.textContent = `${gameTtsRate}%`;
    if (window.ttsEngine) window.ttsEngine.setRate(gameTtsRate);
    triggerVibration(8);
  }

  if (labelTtsVol) labelTtsVol.textContent = `${gameTtsVol}%`;
  if (labelTtsRate) labelTtsRate.textContent = `${gameTtsRate}%`;

  const btnTtsVolDown = document.getElementById("btnTtsVolDown");
  const btnTtsVolUp = document.getElementById("btnTtsVolUp");
  if (btnTtsVolDown) btnTtsVolDown.onclick = () => applyTtsVol(gameTtsVol - 10);
  if (btnTtsVolUp) btnTtsVolUp.onclick = () => applyTtsVol(gameTtsVol + 10);

  const btnTtsRateDown = document.getElementById("btnTtsRateDown");
  const btnTtsRateUp = document.getElementById("btnTtsRateUp");
  if (btnTtsRateDown) btnTtsRateDown.onclick = () => applyTtsRate(gameTtsRate - 10);
  if (btnTtsRateUp) btnTtsRateUp.onclick = () => applyTtsRate(gameTtsRate + 10);

  // Quick Replay Button on Dialog Box & Click-on-Text to speak (like Google Translate!)
  const btnTtsReplay = document.getElementById("btnTtsReplay");
  if (btnTtsReplay) {
    btnTtsReplay.onclick = (e) => {
      e.stopPropagation();
      if (window.ttsEngine) {
        window.ttsEngine.replayCurrent();
        triggerVibration(15);
      }
    };
  }

  const textElem = document.getElementById("text");
  if (textElem) {
    textElem.title = "";
    textElem.onclick = (e) => {
      skipOrAdvanceDialogue();
    };
  }
}

// --- Persona 5 Main Menu & Interactive Diagnostics Suite ---

let diagnosticsSuiteInitialized = false;

function setupDiagnosticsSuite() {
  // 1. Populate System & Hardware Specs
  const diagSpecRes = document.getElementById("diagSpecRes");
  const diagSpecAgent = document.getElementById("diagSpecAgent");
  const diagSpecPwa = document.getElementById("diagSpecPwa");
  const diagSpecStorage = document.getElementById("diagSpecStorage");

  if (diagSpecRes) {
    diagSpecRes.textContent = `${window.innerWidth}×${window.innerHeight} (מסך: ${screen.width}×${screen.height}, DPR: ${window.devicePixelRatio || 1})`;
  }
  if (diagSpecAgent) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const platform = isMobile ? "נייד (Mobile / Touch)" : "מחשב / לפטופ (Desktop / Laptop)";
    const browser = /Chrome/.test(navigator.userAgent) ? "Google Chrome / Chromium" :
                    /Firefox/.test(navigator.userAgent) ? "Mozilla Firefox" :
                    /Safari/.test(navigator.userAgent) ? "Apple Safari" : "Web Browser";
    diagSpecAgent.textContent = `${platform} • ${browser}`;
  }
  if (diagSpecPwa) {
    const isHttp = window.location.protocol.startsWith("http");
    if (!isHttp) {
      diagSpecPwa.textContent = "מקומי (file:// - PWA פעיל בהרצה משרת)";
    } else if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      diagSpecPwa.textContent = "פעיל ומאוחסן במטמון (Service Worker Active & Cached)";
    } else {
      diagSpecPwa.textContent = "תומך PWA (ממתין לסנכרון קבצים)";
    }
  }
  if (diagSpecStorage) {
    try {
      const keysCount = Object.keys(localStorage).length;
      diagSpecStorage.textContent = `${keysCount} פריטים שמורים (הגדרות וסופים שמורים)`;
    } catch(e) {
      diagSpecStorage.textContent = "LocalStorage חסום";
    }
  }

  // Prevent duplicate binding of test buttons
  if (diagnosticsSuiteInitialized) return;
  diagnosticsSuiteInitialized = true;

  // 2. Audio & Multimedia Tests
  const diagBtnTestBgm = document.getElementById("diagBtnTestBgm");
  const diagBgmStatus = document.getElementById("diagBgmStatus");
  if (diagBtnTestBgm) {
    diagBtnTestBgm.onclick = () => {
      const music = document.getElementById("music");
      if (music) {
        if (music.paused) {
          playMusic("audio/ים דייט סימולטור - תפריט ראשי.mp3");
          if (diagBgmStatus) {
            diagBgmStatus.textContent = "פועל ⏸️";
            diagBgmStatus.style.background = "#2ecc71";
          }
        } else {
          music.pause();
          if (diagBgmStatus) {
            diagBgmStatus.textContent = "הפעל ▶️";
            diagBgmStatus.style.background = "";
          }
        }
      }
      triggerVibration(15);
    };
  }

  const diagBtnTestSfxHit = document.getElementById("diagBtnTestSfxHit");
  if (diagBtnTestSfxHit) {
    diagBtnTestSfxHit.onclick = () => {
      triggerVibration([60, 40, 90]);
      if (typeof playSfx === "function") playSfx("audio/inject.mp3");
    };
  }

  const diagBtnTestSfxCrack = document.getElementById("diagBtnTestSfxCrack");
  if (diagBtnTestSfxCrack) {
    diagBtnTestSfxCrack.onclick = () => {
      triggerVibration([120, 50, 150]);
      if (typeof playSfx === "function") playSfx("audio/break.mp3");
      const gameContainer = document.getElementById("game");
      if (gameContainer) {
        gameContainer.classList.add("effect-shake");
        setTimeout(() => gameContainer.classList.remove("effect-shake"), 400);
      }
    };
  }

  const diagBtnTestTts = document.getElementById("diagBtnTestTts");
  const diagTtsStatus = document.getElementById("diagTtsStatus");
  if (diagBtnTestTts) {
    diagBtnTestTts.onclick = () => {
      triggerVibration(15);
      if (diagTtsStatus) diagTtsStatus.textContent = "משמיע... 🎙️";
      if (window.ttsEngine) {
        window.ttsEngine.speakDialogue("מערכת בדיקה", "בדיקת מערכת דיבוב עברית חכמה של גוגל טרנסלייט עברה בהצלחה מלאה!");
      }
      setTimeout(() => {
        if (diagTtsStatus) diagTtsStatus.textContent = "השמע";
      }, 3500);
    };
  }

  // 3. VFX & Haptics Tests
  const diagBtnTestShake = document.getElementById("diagBtnTestShake");
  if (diagBtnTestShake) {
    diagBtnTestShake.onclick = () => {
      triggerVibration([100, 50, 100]);
      const gameContainer = document.getElementById("game");
      if (gameContainer) {
        gameContainer.classList.add("effect-shake");
        setTimeout(() => gameContainer.classList.remove("effect-shake"), 600);
      }
    };
  }

  const diagBtnTestRedflash = document.getElementById("diagBtnTestRedflash");
  if (diagBtnTestRedflash) {
    diagBtnTestRedflash.onclick = () => {
      triggerVibration(250);
      const gameContainer = document.getElementById("game");
      if (gameContainer) {
        gameContainer.classList.add("effect-redflash");
        setTimeout(() => gameContainer.classList.remove("effect-redflash"), 500);
      }
    };
  }

  const diagBtnTestSpeedlines = document.getElementById("diagBtnTestSpeedlines");
  if (diagBtnTestSpeedlines) {
    diagBtnTestSpeedlines.onclick = () => {
      triggerVibration(40);
      if (window.courtEngine) {
        window.courtEngine.setSpeedlines(true);
        setTimeout(() => window.courtEngine.setSpeedlines(false), 1200);
      }
    };
  }

  const diagBtnTestRumble = document.getElementById("diagBtnTestRumble");
  if (diagBtnTestRumble) {
    diagBtnTestRumble.onclick = () => {
      triggerVibration([150, 100, 200, 100, 300]);
      if (typeof navigator !== "undefined" && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
          const gp = gamepads[i];
          if (gp && gp.vibrationActuator && gp.vibrationActuator.playEffect) {
            try {
              gp.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 600,
                weakMagnitude: 0.8,
                strongMagnitude: 1.0
              });
            } catch(e) {}
          }
        }
      }
      const badge = diagBtnTestRumble.querySelector(".btn-badge");
      if (badge) {
        const oldText = badge.textContent;
        badge.textContent = "רוטט! 📳";
        setTimeout(() => { badge.textContent = oldText; }, 1000);
      }
    };
  }

  // 4. Live Keyboard Detector
  const diagKeyOutput = document.getElementById("diagKeyOutput");
  const diagKeyCode = document.getElementById("diagKeyCode");
  const diagKeyLayout = document.getElementById("diagKeyLayout");

  window.addEventListener("keydown", (e) => {
    const diagModal = document.getElementById("diagnosticsModal");
    if (!diagModal || diagModal.style.display === "none") return;

    if (diagKeyOutput) {
      let displayName = e.key;
      if (displayName === " ") displayName = "Space (רווח)";
      else if (displayName === "Enter") displayName = "Enter (אנטר)";
      else if (displayName === "Escape") displayName = "Escape (ביטול)";
      else if (displayName === "ArrowUp") displayName = "חץ למעלה (Arrow Up)";
      else if (displayName === "ArrowDown") displayName = "חץ למטה (Arrow Down)";
      else if (displayName === "ArrowLeft") displayName = "חץ שמאלה (Arrow Left)";
      else if (displayName === "ArrowRight") displayName = "חץ ימינה (Arrow Right)";
      diagKeyOutput.textContent = displayName;
    }
    if (diagKeyCode) {
      diagKeyCode.textContent = e.code;
    }
    if (diagKeyLayout) {
      const isHebrew = /[\u0590-\u05FF]/.test(e.key);
      const isEnglish = /^[a-zA-Z]$/.test(e.key);
      if (isHebrew) {
        diagKeyLayout.textContent = "עברית (Hebrew Layout)";
      } else if (isEnglish) {
        diagKeyLayout.textContent = "אנגלית (English Layout)";
      } else {
        diagKeyLayout.textContent = "מקשי מערכת / ניווט";
      }
    }
  });
}

function initPersona5Menu() {
  const p5BtnPlay = document.getElementById("p5BtnPlay");
  const p5BtnCourt = document.getElementById("p5BtnCourt");
  const p5BtnUpdates = document.getElementById("p5BtnUpdates");
  const p5BtnDiagnostics = document.getElementById("p5BtnDiagnostics");
  const p5BtnSettings = document.getElementById("p5BtnSettings");
  const p5BtnGallery = document.getElementById("p5BtnGallery");

  const updatesModal = document.getElementById("updatesModal");
  const closeUpdates = document.getElementById("closeUpdates");

  const diagnosticsModal = document.getElementById("diagnosticsModal");
  const closeDiagnostics = document.getElementById("closeDiagnostics");

  if (p5BtnPlay) {
    p5BtnPlay.onclick = () => {
      triggerVibration(20);
      if (typeof playSfx === "function") playSfx("audio/inject.mp3");
      showScene("room_intro");
    };
  }

  if (p5BtnCourt) {
    p5BtnCourt.onclick = () => {
      triggerVibration(20);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      showScene("court_menu");
    };
  }

  if (p5BtnUpdates && updatesModal) {
    p5BtnUpdates.onclick = () => {
      triggerVibration(15);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      updatesModal.style.display = "flex";
    };
  }

  if (closeUpdates && updatesModal) {
    closeUpdates.onclick = () => {
      triggerVibration(10);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      updatesModal.style.display = "none";
    };
  }

  if (updatesModal) {
    updatesModal.onclick = (e) => {
      if (e.target === updatesModal) {
        updatesModal.style.display = "none";
      }
    };
  }

  if (p5BtnDiagnostics && diagnosticsModal) {
    p5BtnDiagnostics.onclick = () => {
      triggerVibration(15);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      diagnosticsModal.style.display = "flex";
      setupDiagnosticsSuite();
    };
  }

  if (closeDiagnostics && diagnosticsModal) {
    closeDiagnostics.onclick = () => {
      triggerVibration(10);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      diagnosticsModal.style.display = "none";
    };
  }

  if (diagnosticsModal) {
    diagnosticsModal.onclick = (e) => {
      if (e.target === diagnosticsModal) {
        diagnosticsModal.style.display = "none";
      }
    };
  }

  if (p5BtnSettings) {
    p5BtnSettings.onclick = () => {
      triggerVibration(15);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      const settingsToggle = document.getElementById("settingsToggle");
      if (settingsToggle) settingsToggle.click();
    };
  }

  if (p5BtnGallery) {
    p5BtnGallery.onclick = () => {
      triggerVibration(15);
      if (typeof playSfx === "function") playSfx("audio/click.mp3");
      const galleryToggle = document.getElementById("galleryToggle");
      if (galleryToggle) galleryToggle.click();
    };
  }

  // Audio hover feedback on menu buttons
  document.querySelectorAll(".p5-nav-btn, .p5-test-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (window.hasUserInteracted && !window.isSfxMuted) {
        playVoiceBeep("menu");
      }
    });
  });
}

// Resume audio and trigger scene music playback on very first user interaction (bypasses browser autoplay policy block)
const startAudioOnInteraction = () => {
  window.hasUserInteracted = true;
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const currentMusic = document.getElementById("music");
  if (currentMusic && !window.isMusicMuted && currentMusic.paused) {
    currentMusic.play().catch(() => {});
  }
  // Auto-speak current scene text on first user interaction if enabled (only in VN scenes, not on main menu)
  if (window.ttsEngine && window.ttsEngine.isEnabled() && !window.ttsEngine.hasSpokenFirstScene) {
    window.ttsEngine.hasSpokenFirstScene = true;
    if (currentScene !== "start" && currentScene !== "main_menu") {
      const currentSceneObj = story[currentScene];
      if (currentSceneObj) {
        window.ttsEngine.speakDialogue(currentSceneObj.speaker, currentSceneObj.text);
      }
    }
  }
  window.removeEventListener("click", startAudioOnInteraction);
  window.removeEventListener("keydown", startAudioOnInteraction);
  window.removeEventListener("touchstart", startAudioOnInteraction);
  window.removeEventListener("pointerdown", startAudioOnInteraction);
};
window.addEventListener("click", startAudioOnInteraction);
window.addEventListener("keydown", startAudioOnInteraction);
window.addEventListener("touchstart", startAudioOnInteraction, { passive: true });
window.addEventListener("pointerdown", startAudioOnInteraction, { passive: true });

// Apply initial OLED settings from localStorage
const gameElem = document.getElementById("game");
if (gameElem && localStorage.getItem("gameOled") === "true") {
  gameElem.classList.add("oled-mode");
}

// Initialize Persona 5 Menu Bindings
initPersona5Menu();

// Start Simulator
showScene("start");
