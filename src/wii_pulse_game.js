// --- Wii Vitality Sensor / Wii Fit Heart Attack Meme Engine ---

window.wiiPulseCtx = {
  bpm: 70,
  targetBpm: 70,
  stepCount: 0,
  isActive: false,
  heartbeatIntervalId: null,
  ekgAnimFrameId: null,
  ekgX: 0,
  ekgPoints: [],
  vignetteElement: null,
  darkWarningElement: null,
  fitAttackElement: null,
  ekgWidgetElement: null,
  onSuccess: null,
  onFail: null
};

// Web Audio API Synthesized Heartbeat ("lub-dub" sound)
function playSynthesizedHeartbeat() {
  if (window.isSfxMuted) return;
  const audioCtx = window.audioCtx || (window.audioEngine && window.audioEngine.ctx);
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  const ctx = window.wiiPulseCtx;
  const bpm = ctx ? ctx.bpm : 70;

  try {
    const now = audioCtx.currentTime;

    // Pitch scales higher as BPM increases to amplify anxiety & stress
    const baseFreq = Math.min(130, 65 + (bpm - 70) * 0.5);
    const volumeMult = bpm > 140 ? 0.65 : 0.45;

    // First thump ("lub") - Punchy low frequency sine pulse
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.09);
    gain1.gain.setValueAtTime(volumeMult, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Second thump ("dub") - High-stress follow-up pulse
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(baseFreq * 0.85, now + 0.11);
    osc2.frequency.exponentialRampToValueAtTime(25, now + 0.19);
    gain2.gain.setValueAtTime(volumeMult * 0.7, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.11);
    osc2.stop(now + 0.19);
  } catch (e) {}
}

// Flatline continuous EKG alarm tone (*BEEEEEEP!*)
function playFlatlineSound() {
  if (window.isSfxMuted) return;
  const audioCtx = window.audioCtx || (window.audioEngine && window.audioEngine.ctx);
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // High pitch continuous EKG flatline tone
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 3.5);
  } catch (e) {}
}

function startWiiPulseGame(onSuccess, onFail) {
  const ctx = window.wiiPulseCtx;
  ctx.bpm = 72;
  ctx.targetBpm = 72;
  ctx.stepCount = 0;
  ctx.isActive = true;
  ctx.onSuccess = onSuccess;
  ctx.onFail = onFail;
  ctx.ekgX = 0;
  ctx.ekgPoints = [];

  createWiiDOMOverlays();

  ctx.vignetteElement = document.getElementById("wiiVignetteOverlay");
  ctx.darkWarningElement = document.getElementById("wiiDarkWarningOverlay");
  ctx.fitAttackElement = document.getElementById("wiiFitAttackOverlay");
  ctx.ekgWidgetElement = document.getElementById("wiiEkgWidget");

  if (ctx.vignetteElement) ctx.vignetteElement.style.display = "block";
  if (ctx.ekgWidgetElement) ctx.ekgWidgetElement.style.display = "flex";
  if (ctx.darkWarningElement) ctx.darkWarningElement.style.display = "none";
  if (ctx.fitAttackElement) ctx.fitAttackElement.style.display = "none";

  updateWiiPulseHUD();

  // Start real-time heartbeat loop & EKG sweep animation
  if (ctx.heartbeatIntervalId) clearTimeout(ctx.heartbeatIntervalId);
  scheduleNextHeartbeat();
  startEkgCanvasAnimation();
}

function scheduleNextHeartbeat() {
  const ctx = window.wiiPulseCtx;
  if (!ctx.isActive) return;

  // Smoothly interpolate current BPM towards target BPM
  if (ctx.bpm < ctx.targetBpm) {
    ctx.bpm = Math.min(ctx.targetBpm, ctx.bpm + 3);
  } else if (ctx.bpm > ctx.targetBpm) {
    ctx.bpm = Math.max(ctx.targetBpm, ctx.bpm - 3);
  }

  updateWiiPulseHUD();

  // Trigger synthesized audio heartbeat
  playSynthesizedHeartbeat();

  // Trigger real-time dual-thump haptic vibration on phone
  if (navigator.vibrate) {
    try {
      if (ctx.bpm > 140) {
        navigator.vibrate([40, 30, 60]);
      } else {
        navigator.vibrate([25, 20, 35]);
      }
    } catch (e) {}
  }

  // Micro screen shake pulse on every heartbeat when BPM > 130
  if (ctx.bpm > 130) {
    const gameContainer = document.getElementById("game");
    if (gameContainer) {
      gameContainer.classList.remove("effect-shake");
      void gameContainer.offsetWidth; // Reflow
      gameContainer.classList.add("effect-shake");
      setTimeout(() => { gameContainer.classList.remove("effect-shake"); }, 200);
    }
  }

  // Trigger EKG spike beat wave
  triggerEkgSpike();

  // Calculate interval delay based on BPM (60,000ms / BPM)
  const delayMs = Math.max(240, Math.floor(60000 / Math.max(45, ctx.bpm)));
  ctx.heartbeatIntervalId = setTimeout(scheduleNextHeartbeat, delayMs);
}

function updateWiiPulseHUD() {
  const ctx = window.wiiPulseCtx;
  const bpmDisplay = document.getElementById("wiiEkgBpmVal");
  const statusDisplay = document.getElementById("wiiEkgStatusText");

  if (bpmDisplay) {
    bpmDisplay.textContent = `${Math.round(ctx.bpm)} BPM`;
    if (ctx.bpm > 160) {
      bpmDisplay.style.color = "#ff2a2a";
      bpmDisplay.style.textShadow = "0 0 12px #ff2a2a";
    } else if (ctx.bpm > 120) {
      bpmDisplay.style.color = "#ff9900";
      bpmDisplay.style.textShadow = "0 0 8px #ff9900";
    } else {
      bpmDisplay.style.color = "#2ecc71";
      bpmDisplay.style.textShadow = "0 0 8px #2ecc71";
    }
  }

  if (statusDisplay) {
    if (ctx.bpm > 165) {
      statusDisplay.textContent = "⚠️ סכנת התקף לב מיידית!";
      statusDisplay.style.color = "#ff2a2a";
    } else if (ctx.bpm > 130) {
      statusDisplay.textContent = "💓 דופק מואץ ומסוכן!";
      statusDisplay.style.color = "#ff9900";
    } else {
      statusDisplay.textContent = "💚 דופק תקין ורגוע";
      statusDisplay.style.color = "#2ecc71";
    }
  }

  // Ensure EKG Widget stays visible while minigame is active
  if (ctx.isActive && ctx.ekgWidgetElement) {
    ctx.ekgWidgetElement.style.display = "flex";
  }

  // Update dynamic red blood pressure screen edge vignette
  if (ctx.vignetteElement) {
    if (ctx.bpm > 90) {
      const severity = Math.min(1, (ctx.bpm - 90) / 95);
      const insetPx = Math.floor(30 + severity * 80);
      const opacity = (0.3 + severity * 0.65).toFixed(2);
      ctx.vignetteElement.style.opacity = "1";
      ctx.vignetteElement.style.boxShadow = `inset 0 0 ${insetPx}px rgba(255, 0, 0, ${opacity})`;
    } else {
      ctx.vignetteElement.style.opacity = "0";
      ctx.vignetteElement.style.boxShadow = "none";
    }
  }
}

// Canvas EKG Waveform Rendering
function startEkgCanvasAnimation() {
  const canvas = document.getElementById("wiiEkgCanvas");
  if (!canvas) return;
  const c = canvas.getContext("2d");
  const ctx = window.wiiPulseCtx;

  function renderEkg() {
    if (!ctx.isActive) return;

    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    c.fillStyle = "rgba(0, 0, 0, 0.25)";
    c.fillRect(0, 0, w, h);

    // Advance sweep cursor
    ctx.ekgX = (ctx.ekgX + 2.5) % w;

    // Clear sweep trail gap
    c.fillStyle = "#0a0a0a";
    c.fillRect(ctx.ekgX, 0, 15, h);

    // Determine neon line color based on BPM
    let strokeColor = "#2ecc71";
    if (ctx.bpm > 160) strokeColor = "#ff2a2a";
    else if (ctx.bpm > 125) strokeColor = "#ff9900";

    c.strokeStyle = strokeColor;
    c.lineWidth = 2.5;
    c.shadowColor = strokeColor;
    c.shadowBlur = 8;

    c.beginPath();
    for (let x = 0; x < w; x += 2) {
      let y = midY;
      // Inject EKG wave spike if near sweep point
      const p = ctx.ekgPoints.find(pt => Math.abs(pt.x - x) < 3);
      if (p) {
        y = midY + p.offsetY;
      }
      if (x === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();

    ctx.ekgAnimFrameId = requestAnimationFrame(renderEkg);
  }

  if (ctx.ekgAnimFrameId) cancelAnimationFrame(ctx.ekgAnimFrameId);
  renderEkg();
}

function triggerEkgSpike() {
  const ctx = window.wiiPulseCtx;
  const startX = ctx.ekgX;
  const heightMult = ctx.bpm > 140 ? 1.5 : 1.0;

  ctx.ekgPoints = [
    { x: (startX + 2) % 260, offsetY: -4 * heightMult },
    { x: (startX + 6) % 260, offsetY: 6 * heightMult },
    { x: (startX + 10) % 260, offsetY: -22 * heightMult }, // QRS Peak
    { x: (startX + 14) % 260, offsetY: 18 * heightMult },
    { x: (startX + 18) % 260, offsetY: -8 * heightMult },
    { x: (startX + 24) % 260, offsetY: 0 }
  ];
}

function applyRomanticAction(bpmDelta, actionName) {
  const ctx = window.wiiPulseCtx;
  if (!ctx.isActive) return;

  // Debounce rapid clicks (350ms cooldown) to prevent broken state stacks
  const now = Date.now();
  if (ctx.lastActionTime && now - ctx.lastActionTime < 350) return;
  ctx.lastActionTime = now;

  ctx.targetBpm += bpmDelta;
  ctx.stepCount++;

  // Trigger high-stress cardiac tremor screen shake
  const gameContainer = document.getElementById("game");
  if (gameContainer) {
    gameContainer.classList.remove("effect-shake", "effect-redflash");
    void gameContainer.offsetWidth; // Reflow
    gameContainer.classList.add("effect-redflash");
    if (ctx.targetBpm > 130) {
      gameContainer.classList.add("effect-shake");
    }
    setTimeout(() => {
      gameContainer.classList.remove("effect-shake", "effect-redflash");
    }, 450);
  }

  // Check threshold triggers
  if (ctx.targetBpm >= 190) {
    triggerWiiFitHeartAttack();
    return;
  }

  if (ctx.targetBpm >= 165) {
    triggerDarkWiiWarning();
    return;
  }
}

function applyCalmingAction(bpmDelta, actionName) {
  const ctx = window.wiiPulseCtx;
  if (!ctx.isActive) return;

  // Debounce rapid clicks (350ms cooldown)
  const now = Date.now();
  if (ctx.lastActionTime && now - ctx.lastActionTime < 350) return;
  ctx.lastActionTime = now;

  ctx.targetBpm = Math.max(65, ctx.targetBpm - bpmDelta);

  // Hide warning screen if open
  if (ctx.darkWarningElement) {
    ctx.darkWarningElement.style.display = "none";
  }
}

function triggerDarkWiiWarning() {
  const ctx = window.wiiPulseCtx;
  if (ctx.darkWarningElement) {
    ctx.darkWarningElement.style.display = "flex";
  }

  if (navigator.vibrate) {
    try { navigator.vibrate([150, 50, 150, 50, 200]); } catch (e) {}
  }
}

function triggerWiiFitHeartAttack() {
  const ctx = window.wiiPulseCtx;
  ctx.isActive = false;
  if (ctx.heartbeatIntervalId) clearTimeout(ctx.heartbeatIntervalId);

  // Play continuous EKG flatline tone (*BEEEEEEP!*)
  playFlatlineSound();

  if (ctx.darkWarningElement) ctx.darkWarningElement.style.display = "none";
  if (ctx.fitAttackElement) ctx.fitAttackElement.style.display = "flex";

  if (navigator.vibrate) {
    try { navigator.vibrate([400, 100, 400, 100, 800]); } catch (e) {}
  }

  if (window.engine && window.currentScene !== "wii_pulse_heart_attack_scene") {
    window.engine.showScene("wii_pulse_heart_attack_scene");
  }

  setTimeout(() => {
    dismissWiiHeartAttack();
  }, 6000);
}

function dismissWiiHeartAttack() {
  const ctx = window.wiiPulseCtx;
  stopWiiPulseGame();
  if (typeof ctx.onFail === "function") {
    ctx.onFail();
  }
}

function stopWiiPulseGame() {
  const ctx = window.wiiPulseCtx;
  ctx.isActive = false;
  if (ctx.heartbeatIntervalId) clearTimeout(ctx.heartbeatIntervalId);
  if (ctx.ekgAnimFrameId) cancelAnimationFrame(ctx.ekgAnimFrameId);

  if (ctx.vignetteElement) ctx.vignetteElement.style.display = "none";
  if (ctx.ekgWidgetElement) ctx.ekgWidgetElement.style.display = "none";
  if (ctx.darkWarningElement) ctx.darkWarningElement.style.display = "none";
  if (ctx.fitAttackElement) ctx.fitAttackElement.style.display = "none";
}

function createWiiDOMOverlays() {
  if (document.getElementById("wiiVignetteOverlay")) return;

  // 1. Blood pressure vignette overlay
  const vignette = document.createElement("div");
  vignette.id = "wiiVignetteOverlay";
  vignette.className = "wii-vignette-overlay";
  document.body.appendChild(vignette);

  // 2. Real-time EKG Pulse Canvas HUD Widget
  const ekgWidget = document.createElement("div");
  ekgWidget.id = "wiiEkgWidget";
  ekgWidget.className = "wii-ekg-widget";
  ekgWidget.innerHTML = `
    <div class="wii-ekg-info">
      <span class="wii-ekg-icon">💓</span>
      <span id="wiiEkgBpmVal" class="wii-ekg-bpm">72 BPM</span>
      <span id="wiiEkgStatusText" class="wii-ekg-status">💚 דופק תקין</span>
    </div>
    <canvas id="wiiEkgCanvas" class="wii-ekg-canvas" width="260" height="42"></canvas>
  `;
  document.body.appendChild(ekgWidget);

  // 3. Dark Wii Warning Screen (Image 1 in Hebrew)
  const darkWarning = document.createElement("div");
  darkWarning.id = "wiiDarkWarningOverlay";
  darkWarning.className = "wii-dark-warning-overlay";
  darkWarning.innerHTML = `
    <div class="wii-dark-box">
      <div class="wii-dark-icon">
        <div class="wii-figure-bow">🙇</div>
      </div>
      <h1 class="wii-dark-title">WARNING!!</h1>
      <h2 class="wii-dark-subtitle">⚠️ אזהרה חמורה!!</h2>
      <div class="wii-dark-text-body">
        <p>זיהינו שקצב הלב שלך הגיע ל-165+ BPM חריג ביותר!</p>
        <p>אתה מציג תסמינים מוקדמים של התקף לב!</p>
        <p>אם תבצע עוד מחווה רומנטית אחת ללא הרגעה, הלב שלך יקבל התקף לב!</p>
        <p>מומלץ שתפנה מיד לחדר מיון או ליצור קשר עם רופא הלב שלך.</p>
        <p class="wii-dark-bold">המשחק עומד להפסיק!</p>
      </div>
      <button class="wii-btn-calm" onclick="applyCalmingAction(40, 'calm');">🫁 קח נשימה עמוקה והורד דופק!</button>
    </div>
  `;
  document.body.appendChild(darkWarning);

  // 4. Wii Fit Heart Attack Screen (Image 2 in Hebrew)
  const fitAttack = document.createElement("div");
  fitAttack.id = "wiiFitAttackOverlay";
  fitAttack.className = "wii-fit-attack-overlay";
  fitAttack.innerHTML = `
    <div class="wii-fit-container">
      <div class="wii-fit-header">
        <h1>אתה חווה <span class="wii-red-underline">התקף לב</span></h1>
      </div>
      <div class="wii-fit-body">
        <div class="wii-fit-left">
          <p class="wii-fit-subheading">עקוב אחר ההוראות הבאות:</p>
          <ul class="wii-fit-instructions">
            <li>הישאר רגוע והמשך לנשום בצורה סדירה.</li>
            <li>פנה לקבלת עזרה רפואית דחופה.</li>
            <li class="wii-red-text">אל תחדש שום פעילות גופנית או רומנטית.</li>
          </ul>
          <div class="wii-fit-notice-box">
            מסיבות בטיחות, המערכת הושעתה באופן זמני משימוש. אנא השאר את המסך דולק ואל תכבה את הקונסולה עד להגעת סיוע רפואי.
          </div>
        </div>
        <div class="wii-fit-right">
          <div class="wii-human-diagram">
            <div class="wii-human-head"></div>
            <div class="wii-human-torso">
              <span class="wii-heart-cross">❌</span>
            </div>
            <div class="wii-human-legs"></div>
          </div>
        </div>
      </div>
      <div class="wii-fit-footer">
        נינטנדו וצוות המשחק אינם אחראים לכל נזק פיזי, נפשי או רומנטי שעלול להיגרם בעת השימוש בחומרה או בשירותים אלו. אנא עיין בתנאי השימוש המשפטיים למידע נוסף.
      </div>
      <button class="wii-btn-close" onclick="dismissWiiHeartAttack();">💔 המשך לסיום התקפת הלב</button>
    </div>
  `;
  document.body.appendChild(fitAttack);
}
