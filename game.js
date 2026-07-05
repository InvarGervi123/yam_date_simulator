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

function triggerVibration(pattern) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

soundToggle.onclick = () => {
  isMuted = !isMuted;
  music.muted = isMuted;
  sfx.muted = isMuted;
  soundToggle.textContent = isMuted ? "🔇" : "🔊";
  triggerVibration(20);
  
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
  btn.onclick = () => {
    triggerVibration(15);
    showScene(nextScene);
  };
  choices.appendChild(btn);
}

// Minigame Engine
function runMinigame(config) {
  if (config.type === "deltarune_battle") {
    runDeltaruneBattle(config);
    return;
  }
  if (config.type === "math_quiz") {
    runMathMinigame(config);
    return;
  }

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
      triggerVibration(12); // Buzz on mash
      
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
      triggerVibration(25);
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
      triggerVibration(30);
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
      triggerVibration([80, 40, 120]);
      showScene(config.nextSuccess);
    } else {
      triggerVibration([180, 80, 180]);
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

  // Modifiers from ACT options
  let playerAttackBonus = 0;
  let bossAttackPower = 20; // damage per hit

  // Audio setup
  soundToggle.style.display = "none";
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
    
    let turnMsg = `* ים מפהק ומתכסה בשמיכה. מה תעשה/י?\n(רחמים: ${bossMercy}%)`;
    if (bossHp < 80) turnMsg = `* ים נראה עייף ומובס. (רחמים: ${bossMercy}%)`;
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
        name: "לאיים למחוק את שרת הדיסקורד",
        action: () => {
          playerAttackBonus += 15;
          writeConsole(`* איימת למחוק את השרת! ההגנה של ים ירדה. (ההתקפה שלך גדלה!)`);
        }
      },
      {
        name: "להציע לו בורקס פגום",
        action: () => {
          bossAttackPower = Math.max(bossAttackPower - 6, 8);
          writeConsole(`* ים אכל בורקס פגום ונחלש! כוח התקיפה שלו ירד.`);
        }
      },
      {
        name: "להחמיא לטאמבנייל החדש שלו",
        action: () => {
          bossMercy = Math.min(bossMercy + 35, 100);
          writeConsole(`* החמאת לו על הטאמבנייל! הרחמים עלו ב-35%.`);
        }
      },
      {
        name: "לשיר לו שיר של ינוור",
        action: () => {
          bossMercy = Math.min(bossMercy + 50, 100);
          playerHp = Math.max(playerHp - 10, 1); // cringe damage!
          updateHpBars();
          writeConsole(`* שרת לו שיר של ינוור! הרחמים עלו ב-50%, אך חטפת 10 נזק קרינג'!`);
        }
      },
      {
        name: isMuted ? "🔊 הפעל מוזיקת רקע" : "🔇 השתק מוזיקת רקע",
        action: () => {
          isMuted = !isMuted;
          music.muted = isMuted;
          sfx.muted = isMuted;
          soundToggle.textContent = isMuted ? "🔇" : "🔊";
          writeConsole(isMuted ? `* השתקת את מוזיקת הקרב.` : `* הפעלת את מוזיקת הקרב.`);
        }
      },
      {
        name: "להזמין אותו לצלם פתיחת תיבות יחד",
        action: () => {
          writeConsole(`* הזמנת אותו לפתוח תיבות! העיניים של ים בורקות מאושר...`);
          setTimeout(() => {
            isGameOver = true;
            soundToggle.style.display = "flex";
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
            soundToggle.style.display = "flex";
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
            soundToggle.style.display = "flex";
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

    const items = [
      { name: "בורקס חם (מרפא 50 HP)", heal: 50 },
      { name: "פחית אנרגיה (מרפא 30 HP)", heal: 30 }
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
    consoleEl.style.display = "none";
    subMenu.style.display = "none";
    arena.style.display = "block";

    // Yam Speaks next to his animated sprite!
    const quotes = [
      "אתה לא תנצח את כוח השינה שלי!",
      "אני עייף מדי בשביל הנזק הזה...",
      "עוד מילה אחת ואני מוחק את שרת הדיסקורד!",
      "הקליקים האלה כואבים!",
      "מישהו אמר בורקס?!",
      "אני רק רוצה לחזור לישון..."
    ];
    const bubble = document.getElementById("bossSpeechBubble");
    bubble.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    bubble.style.display = "block";
    setTimeout(() => { bubble.style.display = "none"; }, 2500);

    // Reset heart position to center of board
    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;
    let heartX = boardWidth / 2 - 10;
    let heartY = boardHeight / 2 - 10;
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

    // Mobile touch controls (drag heart directly)
    function handleTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = board.getBoundingClientRect();
      heartX = Math.max(0, Math.min(touch.clientX - rect.left - 10, boardWidth - 20));
      heartY = Math.max(0, Math.min(touch.clientY - rect.top - 10, boardHeight - 20));
      heart.style.left = heartX + "px";
      heart.style.top = heartY + "px";
    }

    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchstart", handleTouchMove, { passive: false });

    // Projectile Spawning
    const emojis = ["🥫", "🥐", "😴", "💤"];
    window.battleSpawnInterval = setInterval(() => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const proj = document.createElement("div");
      proj.className = "projectile";
      proj.textContent = emoji;

      // Choose random border edge
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

      // Travel vector targeting the player
      const angle = Math.atan2(heartY - y, heartX - x);
      const speed = 2.5 + Math.random() * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      projectiles.push({
        el: proj,
        x: x,
        y: y,
        vx: vx,
        vy: vy
      });
    }, 600);

    // Projectile position update and collision loop
    window.battleUpdateInterval = setInterval(() => {
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.el.style.left = p.x + "px";
        p.el.style.top = p.y + "px";

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
          // Take damage!
          playerHp -= bossAttackPower;
          updateHpBars();
          playSfx("audio/hit.mp3");
          triggerVibration(120);

          // Flash damage effect on board
          overlay.classList.add("battle-dmg-flash");
          setTimeout(() => overlay.classList.remove("battle-dmg-flash"), 200);

          // Cleanup projectile
          p.el.remove();
          projectiles.splice(i, 1);

          if (playerHp <= 0) {
            loseBattle();
            return;
          }
          continue;
        }

        // Clean up out of bounds projectiles
        if (p.x < -40 || p.x > boardWidth + 40 || p.y < -40 || p.y > boardHeight + 40) {
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
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      board.removeEventListener("touchmove", handleTouchMove);
      board.removeEventListener("touchstart", handleTouchMove);

      projectiles.forEach(p => p.el.remove());
      projectiles = [];
    }
  }

  function loseBattle() {
    isGameOver = true;
    clearInterval(window.battleMoveInterval);
    clearInterval(window.battleSpawnInterval);
    clearInterval(window.battleUpdateInterval);
    clearTimeout(window.battleTurnTimeout);
    projectiles.forEach(p => p.el.remove());
    projectiles = [];

    soundToggle.style.display = "flex";
    overlay.style.display = "none";
    showScene(config.nextFail);
  }

  function winBattle(spared) {
    isGameOver = true;
    clearInterval(window.battleMoveInterval);
    clearInterval(window.battleSpawnInterval);
    clearInterval(window.battleUpdateInterval);
    clearTimeout(window.battleTurnTimeout);
    projectiles.forEach(p => p.el.remove());
    projectiles = [];

    if (spared) {
      soundToggle.style.display = "flex";
      overlay.style.display = "none";
      showScene("boss_fight_spare");
    } else {
      // Play dramatic death animation!
      const bossSprite = document.getElementById("battleBossSprite");
      bossSprite.classList.add("boss-death-animation");
      playSfx("audio/hit.mp3");
      triggerVibration([100, 100, 100, 100, 600]);

      setTimeout(() => {
        bossSprite.classList.remove("boss-death-animation");
        soundToggle.style.display = "flex";
        overlay.style.display = "none";
        showScene(config.nextSuccess);
      }, 3500);
    }
  }

  // Start the first turn
  updateHpBars();
  startPlayerTurn();
}

function runMathMinigame(config) {
  minigameOverlay.style.display = "flex";
  clearChoices();
  nextBtn.style.display = "none";
  minigameBtn.style.display = "none"; // Hide standard button

  minigameTitle.textContent = "מבחן המתמטיקה של ים!";
  minigameInstruction.textContent = "פתרו את הבעיה בזמן! מותר להשתמש בדף הנוסחאות.";

  const questions = [
    {
      text: "מה השטח של משולש בורקס בעל בסיס 8 ס\"מ וגובה 6 ס\"מ?",
      options: ["14 סמ\"ר", "24 סמ\"ר", "48 סמ\"ר"],
      correct: 1
    },
    {
      text: "פתרו את משוואת השכירות עבור דירת 2 מ\"ר בתל אביב: Rent = Area × 9000. מהו שכר הדירה?",
      options: ["9,000 ₪", "18,000 ₪", "4,500 ₪"],
      correct: 1
    },
    {
      text: "אם ינוור נולד בפתח תקווה, והיא לא קיימת, מהו מיקום הישות שלו במרחב הממשי ℝ?",
      options: ["PT ∉ ℝ (הוא לא קיים)", "PT ∈ ℝ (הוא קיים)", "הוא גר בדיסקורד"],
      correct: 0
    }
  ];

  // Pick one question randomly
  const question = questions[Math.floor(Math.random() * questions.length)];

  let html = `
    <button class="mg-formula-trigger" id="showFormulaBtn">📋 פתח דף נוסחאות</button>
    <div class="mg-math-question">${question.text}</div>
    <div class="mg-math-options">
  `;

  question.options.forEach((opt, idx) => {
    html += `<button class="mg-math-btn" data-idx="${idx}">${opt}</button>`;
  });

  html += `
    </div>
    <div class="mg-timer" id="mgTimer" style="margin-top: 14px;">זמן נותר: 10.0s</div>
  `;

  minigameVisual.innerHTML = html;

  const formulaModal = document.getElementById("formulaModal");
  const closeFormula = document.getElementById("closeFormula");
  const showFormulaBtn = document.getElementById("showFormulaBtn");

  showFormulaBtn.onclick = () => {
    triggerVibration(15);
    formulaModal.style.display = "flex";
  };

  closeFormula.onclick = () => {
    triggerVibration(15);
    formulaModal.style.display = "none";
  };

  let timeLeft = 10000; // 10 seconds
  const mgTimer = document.getElementById("mgTimer");

  const optionBtns = minigameVisual.querySelectorAll(".mg-math-btn");
  optionBtns.forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute("data-idx"));
      formulaModal.style.display = "none";
      clearInterval(window.minigameInterval);
      minigameBtn.style.display = "block"; // restore button display state
      
      if (idx === question.correct) {
        triggerVibration([80, 40, 120]);
        endMinigame(true);
      } else {
        triggerVibration([180, 80, 180]);
        endMinigame(false);
      }
    };
  });

  function endMinigame(success) {
    clearInterval(window.minigameInterval);
    minigameOverlay.style.display = "none";
    formulaModal.style.display = "none";
    
    if (success) {
      showScene(config.nextSuccess);
    } else {
      showScene(config.nextFail);
    }
  }

  const tick = 100;
  window.minigameInterval = setInterval(() => {
    timeLeft -= tick;
    if (mgTimer) mgTimer.textContent = `זמן נותר: ${Math.max(timeLeft / 1000, 0).toFixed(1)}s`;
    
    if (timeLeft <= 0) {
      clearInterval(window.minigameInterval);
      formulaModal.style.display = "none";
      minigameBtn.style.display = "block"; // restore button
      triggerVibration([180, 80, 180]);
      endMinigame(false);
    }
  }, tick);
}
