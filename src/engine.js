// --- Modular Visual Novel Engine ---

let currentScene = "start";

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
    nextBtn.onclick = () => {
      triggerVibration(15);
      showScene(scene.next);
    };
  } else {
    nextBtn.style.display = "none";
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

if (galleryToggle) galleryToggle.onclick = openEndingsGallery;
if (closeGallery) {
  closeGallery.onclick = () => {
    galleryModal.style.display = "none";
  };
}

// Start Simulator
showScene("start");
