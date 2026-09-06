// --- Universal Ace Attorney Courtroom Engine ---
(function() {
  const EVIDENCE_DATABASE = [
    // --- פרק 1: תביעת ליליה נגד ים ---
    {
      id: "evidence_analytics_2024",
      icon: "📜",
      chapter: 1,
      name: "דוח אנליטיקס עריכה 2024",
      desc: "דוח רשמי מ-YouTube Studio: 0 דקות רינדור, 0 סרטונים הועלו, ו-4,000 שעות משחק ב-Deltarune במיטה."
    },
    {
      id: "evidence_phone_sleep",
      icon: "📱",
      chapter: 1,
      name: "יומן שינה וצפייה בנייד",
      desc: "תיעוד מאפליקציית השעון: ים ישן 23.5 שעות ביממה, מתוכן חצי שעה מוקדשת לצפייה בשורטס של נמר הכסף."
    },
    {
      id: "evidence_burekas_receipt",
      icon: "🥐",
      chapter: 1,
      name: "שטר משלוח בורקס מאורנית",
      desc: "חשבונית מס ממאפיית אורנית: 'משלוח בורקס גבינה חם ישירות למיטת הנאשם (רכב ממונע על גלגלים)'."
    },
    {
      id: "evidence_bed_contract",
      icon: "🛏️",
      chapter: 1,
      name: "חוזה בלעדיות עם המיטה",
      desc: "חוזה בן 40 שנה בין ים לשמיכה. סעיף 4ג: 'איסור יציאה לדייט אלא אם כן מדובר בפיקוח נפש או שוחד פחמימות'."
    },
    {
      id: "evidence_demon_covenant",
      icon: "😈",
      chapter: 1,
      name: "ברית האהבה הדמונית של ליליה",
      desc: "מגילת קלף עתיקה משנת 1624: הבטחה חתומה של אבותיו של ים לצאת לדייט עם השדה ליליה אם יזניח את הערוץ."
    },
    {
      id: "evidence_discord_webhook",
      icon: "📑",
      chapter: 1,
      name: "שטר 'יששכר וזבולון' המזויף",
      desc: "צילום מסך מטושטש מדיסקורד: ינוור שלח אימוג'י בורקס וים טוען שזה 'חוזה העסקת שינה במימון מלא'."
    },

    // --- פרק 2: התביעה הנגדית וסודות השאול ---
    {
      id: "evidence_scorched_door",
      icon: "🚪",
      chapter: 2,
      name: "שברי דלת החדר החרוכים",
      desc: "שרידי דלת עץ מאורנית שהותכה בלהבות גופרית. חרוטות עליה מילות כישוף בשפת השאול: 'תביאו את הבורקס או שהשרת יושמד!'."
    },
    {
      id: "evidence_infernal_covenant_2019",
      icon: "📜",
      chapter: 2,
      name: "שטר עסקת השאול מ-2019",
      desc: "מגילה שחורה מ-03:33 בלילה בדיסקורד. החתימה של ים התבררה כהודעת Auto-Reply של הבוט Mee6!"
    },
    {
      id: "evidence_secret_oranit_recipe",
      icon: "🥐",
      chapter: 2,
      name: "מתכון הבורקס הקדוש של אורנית",
      desc: "הנוסחה האגדית: 9,000 שכבות בצק פילו, מרגרינה שמיימית, וגבינה מותכת ב-180 מעלות. ליליה תכננה לשלוט בעזרתו בפחמימות השאול."
    },
    {
      id: "evidence_bed_thermometer",
      icon: "🌡️",
      chapter: 2,
      name: "מדחום תא ההתפחה של המיטה",
      desc: "מדחום המוכיח: שכיבה של 48 שעות רצוף במיטה מייצרת חום קבוע של 37 מעלות — תא התפחה טבעי מושלם לבצק במשך יומיים!"
    },
    {
      id: "evidence_liliya_vanity_mirror",
      icon: "🪞",
      chapter: 2,
      name: "מראת השאול של ליליה",
      desc: "מראה קסומה החושפת את דמותה האמיתית של ליליה כשדת פופ-סטאר מהמעגל השביעי עם כנפיים, קרניים וזנב לב."
    },
    {
      id: "evidence_wolt_demon_receipt",
      icon: "🛵",
      chapter: 2,
      name: "קבלת Wolt השאול המזויפת",
      desc: "הזמנת Wolt עם חותמת 'יום כיפור 14:00' ממאפיית אורנית! אך מאפיית אורנית שומרת שבת וחג וסגורה ביום כיפור!"
    }
  ];

  let playerHp = 100;
  let selectedEvidenceId = null;
  let onPresentCallback = null;

  function initCourtDom() {
    if (document.getElementById("courtHud")) return;

    const gameElem = document.getElementById("game");
    if (!gameElem) return;

    // 1. Court HUD Header
    const hud = document.createElement("div");
    hud.id = "courtHud";
    hud.innerHTML = `
      <div class="court-header-title">
        <img class="court-mossad-logo" src="images/backgrounds/לוגו מוסד.png" alt="לוגו בית הדין">
        <span>בית דין צדק לענייני שדים, דייטים ויוטיוב</span>
      </div>
      <div class="court-hp-container">
        <span class="court-hp-label">HP</span>
        <div class="court-hp-bar-bg">
          <div id="courtHpFill" class="court-hp-bar-fill" style="width: 100%;"></div>
        </div>
        <div id="courtPenalties" class="court-penalties">❗❗❗❗❗</div>
      </div>
      <button id="btnCourtRecord">📑 מוצגים / COURT RECORD</button>
    `;
    gameElem.appendChild(hud);

    // 2. Fullscreen Objection Cut-in Overlay
    const objectionOverlay = document.createElement("div");
    objectionOverlay.id = "courtObjectionOverlay";
    objectionOverlay.innerHTML = `<img class="objection-cutin-img" src="images/backgrounds/התנגדות.png" alt="התנגדות!">`;
    gameElem.appendChild(objectionOverlay);

    // 2b. Fullscreen HOLD IT! Cut-in Overlay
    const holdItOverlay = document.createElement("div");
    holdItOverlay.id = "courtHoldItOverlay";
    holdItOverlay.innerHTML = `<img class="holdit-cutin-img" src="images/backgrounds/hold_it.png" alt="!רגע אחד">`;
    gameElem.appendChild(holdItOverlay);

    // 2c. Ace Attorney Dynamic Anime Speedlines Canvas (Horizontal high-speed streaks right-to-left)
    let speedlinesCanvas = document.getElementById("courtSpeedlinesCanvas");
    if (!speedlinesCanvas) {
      speedlinesCanvas = document.createElement("canvas");
      speedlinesCanvas.id = "courtSpeedlinesCanvas";
      gameElem.appendChild(speedlinesCanvas);
    }

    // 2d. Dual Invar Split Screen (Haredi vs Secular Invar)
    const dualInvars = document.createElement("div");
    dualInvars.id = "courtDualInvars";
    dualInvars.innerHTML = `
      <div class="dual-invar-side secular-side">
        <img src="images/characters/invar.png" alt="ינוור החילוני">
      </div>
      <div class="dual-vs-badge">⚡ VS ⚡</div>
      <div class="dual-invar-side haredi-side">
        <img src="images/characters/ינוור החרדי.png" alt="הרב ינוור בייט">
      </div>
    `;
    gameElem.appendChild(dualInvars);

    // 3. Court Record Modal (Evidence Binder)
    const recordModal = document.createElement("div");
    recordModal.id = "courtRecordModal";
    recordModal.innerHTML = `
      <div class="court-record-box">
        <div class="court-record-header">
          <span class="court-record-title">📜 תיק המוצגים והראיות של בית הדין</span>
          <button class="btn-close-record" id="btnCloseRecord">✕ סגור</button>
        </div>
        <div class="court-record-grid" id="courtEvidenceGrid"></div>
        <div class="evidence-detail-pane" id="courtEvidenceDetail">
          <em>בחר מוצג כדי לקרוא את התיאור המשפטי...</em>
        </div>
        <div class="court-record-actions">
          <button class="btn-present-evidence" id="btnPresentEvidence">👉 הצג ראיה לבית הדין (PRESENT!)</button>
        </div>
      </div>
    `;
    gameElem.appendChild(recordModal);

    // Bind Event Listeners
    document.getElementById("btnCourtRecord").onclick = () => window.courtEngine.openCourtRecord();
    document.getElementById("btnCloseRecord").onclick = () => window.courtEngine.closeCourtRecord();
    document.getElementById("btnPresentEvidence").onclick = () => window.courtEngine.submitPresentedEvidence();

    recordModal.onclick = (e) => {
      if (e.target === recordModal) window.courtEngine.closeCourtRecord();
    };
  }

  function updateHpDisplay() {
    const fill = document.getElementById("courtHpFill");
    const penalties = document.getElementById("courtPenalties");
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, playerHp))}%`;

    if (penalties) {
      const marksCount = Math.ceil(playerHp / 20);
      penalties.textContent = "❗".repeat(Math.max(0, marksCount));
    }
  }

  window.courtEngine = {
    init: function() {
      initCourtDom();
      updateHpDisplay();
    },

    setCourtActive: function(active) {
      initCourtDom();
      const gameElem = document.getElementById("game");
      if (!gameElem) return;

      if (active) {
        gameElem.classList.add("courtroom-active");
      } else {
        gameElem.classList.remove("courtroom-active");
      }
    },

    resetCourt: function() {
      playerHp = 100;
      selectedEvidenceId = null;
      onPresentCallback = null;
      updateHpDisplay();
      this.setCourtActive(true);
    },

    getHp: function() {
      return playerHp;
    },

    takeDamage: function(amount = 20, reason = "") {
      playerHp = Math.max(0, playerHp - amount);
      updateHpDisplay();

      // Trigger visual shake & haptics
      const gameElem = document.getElementById("game");
      if (gameElem) {
        gameElem.classList.add("effect-shake");
        setTimeout(() => gameElem.classList.remove("effect-shake"), 500);
      }

      if (typeof triggerVibration === "function") {
        triggerVibration([100, 50, 200]);
      }

      if (typeof playSfx === "function") {
        playSfx("audio/hit.mp3");
      }

      if (playerHp <= 0) {
        // Clear choices immediately to prevent returning to testimony
        const choicesContainer = document.getElementById("choices");
        if (choicesContainer) choicesContainer.innerHTML = "";

        setTimeout(() => {
          if (typeof showScene === "function") {
            showScene("end_courtroom_guilty_gameover");
          } else if (typeof window.showScene === "function") {
            window.showScene("end_courtroom_guilty_gameover");
          }
        }, 900);
      }
    },

    triggerObjection: function(callback) {
      initCourtDom();
      const overlay = document.getElementById("courtObjectionOverlay");
      if (!overlay) return;

      overlay.classList.remove("active");
      void overlay.offsetWidth;
      overlay.classList.add("active");

      if (typeof playSfx === "function") {
        playSfx("audio/crack.mp3");
      }

      if (typeof triggerVibration === "function") {
        triggerVibration(400);
      }

      if (window.atmosphereEngine) {
        window.atmosphereEngine.triggerThunderFlash();
      }

      setTimeout(() => {
        overlay.classList.remove("active");
        if (typeof callback === "function") callback();
      }, 700);
    },

    triggerHoldIt: function(callback) {
      initCourtDom();
      const overlay = document.getElementById("courtHoldItOverlay");
      if (!overlay) return;

      overlay.classList.remove("active");
      void overlay.offsetWidth;
      overlay.classList.add("active");

      if (typeof playSfx === "function") {
        playSfx("audio/inject.mp3");
      }

      if (typeof triggerVibration === "function") {
        triggerVibration([150, 50, 250]);
      }

      const gameElem = document.getElementById("game");
      if (gameElem) {
        gameElem.classList.add("effect-shake");
        setTimeout(() => gameElem.classList.remove("effect-shake"), 400);
      }

      setTimeout(() => {
        overlay.classList.remove("active");
        if (typeof callback === "function") callback();
      }, 700);
    },

    // ----------------------------------------------------
    // Ace Attorney Anime Speed Lines Component
    // Horizontal right-to-left high-speed streaks with cyan/blue gradient
    // ----------------------------------------------------
    _speedlinesAnimId: null,
    _speedlinesStreaks: [],

    _initSpeedlinesStreaks: function(width, height) {
      this._speedlinesStreaks = [];
      const streakCount = 38;
      const colors = [
        "rgba(255, 255, 255, 0.95)", // Sharp white streak
        "rgba(255, 255, 255, 0.75)",
        "rgba(202, 240, 248, 0.9)",  // Light sky cyan
        "rgba(72, 202, 228, 0.8)",   // Vibrant electric blue
        "rgba(0, 150, 255, 0.7)"     // Ace Attorney impact blue
      ];

      for (let i = 0; i < streakCount; i++) {
        this._speedlinesStreaks.push({
          x: Math.random() * (width + 600),
          y: Math.random() * height,
          length: 120 + Math.random() * 550, // Rapid horizontal streak length
          thickness: 1.5 + Math.random() * 5.5,
          speed: 2800 + Math.random() * 3200, // Very high speed (px/sec)
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    },

    _startSpeedlinesLoop: function() {
      if (this._speedlinesAnimId) return;

      const canvas = document.getElementById("courtSpeedlinesCanvas");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      let lastTime = performance.now();

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width || 800;
          canvas.height = rect.height || 600;
          if (this._speedlinesStreaks.length === 0) {
            this._initSpeedlinesStreaks(canvas.width, canvas.height);
          }
        }
      };
      resize();

      if (this._speedlinesStreaks.length === 0) {
        this._initSpeedlinesStreaks(canvas.width || 800, canvas.height || 600);
      }

      const loop = (currentTime) => {
        resize();
        const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        const w = canvas.width;
        const h = canvas.height;

        // 1. Vibrant Ace Attorney cyan/sky blue gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#00b4d8");
        grad.addColorStop(0.35, "#0096c7");
        grad.addColorStop(0.7, "#0077b6");
        grad.addColorStop(1, "#023e8a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 2. Secondary soft speed streaks glow
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        for (let j = 0; j < 8; j++) {
          const bandY = (j / 8) * h + Math.sin(currentTime * 0.005 + j) * 15;
          ctx.fillRect(0, bandY, w, 12 + (j % 3) * 8);
        }

        // 3. Render and move high-velocity horizontal speedlines (Right-to-Left)
        for (let i = 0; i < this._speedlinesStreaks.length; i++) {
          const s = this._speedlinesStreaks[i];
          s.x -= s.speed * dt;

          // Recycle streak when it exits past the left screen edge
          if (s.x + s.length < -50) {
            s.x = w + Math.random() * 300;
            s.y = Math.random() * h;
            s.length = 120 + Math.random() * 550;
            s.thickness = 1.5 + Math.random() * 5.5;
            s.speed = 2800 + Math.random() * 3200;
          }

          // Draw tapered dynamic streak with soft rounded cap
          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.thickness;
          ctx.lineCap = "round";
          ctx.moveTo(s.x + s.length, s.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        this._speedlinesAnimId = requestAnimationFrame(loop);
      };

      this._speedlinesAnimId = requestAnimationFrame(loop);
    },

    _stopSpeedlinesLoop: function() {
      if (this._speedlinesAnimId) {
        cancelAnimationFrame(this._speedlinesAnimId);
        this._speedlinesAnimId = null;
      }
    },

    setSpeedlines: function(active) {
      initCourtDom();
      const canvas = document.getElementById("courtSpeedlinesCanvas");
      if (!canvas) return;

      if (active) {
        canvas.classList.add("active");
        this._startSpeedlinesLoop();
      } else {
        canvas.classList.remove("active");
        this._stopSpeedlinesLoop();
      }
    },

    triggerSpeedlines: function(durationMs = 2000, callback) {
      this.setSpeedlines(true);
      if (this._speedlinesTimer) clearTimeout(this._speedlinesTimer);
      this._speedlinesTimer = setTimeout(() => {
        this.setSpeedlines(false);
        if (typeof callback === "function") callback();
      }, durationMs);
    },

    setDualInvars: function(active, speakerName = "") {
      initCourtDom();
      const di = document.getElementById("courtDualInvars");
      const charElem = document.getElementById("character");
      if (di) {
        if (active) {
          di.classList.add("active");
          if (charElem) charElem.style.display = "none";

          const secularSide = di.querySelector(".secular-side");
          const harediSide = di.querySelector(".haredi-side");
          const spk = String(speakerName || "");

          if (secularSide && harediSide) {
            secularSide.classList.remove("speaking");
            harediSide.classList.remove("speaking");

            if (spk.includes("חילוני")) {
              secularSide.classList.add("speaking");
            } else if (spk.includes("רב") || spk.includes("חרדי")) {
              harediSide.classList.add("speaking");
            }
          }
        } else {
          di.classList.remove("active");
          if (charElem) charElem.style.display = "";
        }
      }
    },

    triggerGavel: function(callback) {
      if (typeof playSfx === "function") {
        playSfx("audio/hit.mp3");
        setTimeout(() => playSfx("audio/hit.mp3"), 200);
        setTimeout(() => playSfx("audio/hit.mp3"), 400);
      }
      if (typeof triggerVibration === "function") {
        triggerVibration([100, 80, 100, 80, 250]);
      }
      const gameElem = document.getElementById("game");
      if (gameElem) {
        gameElem.classList.add("effect-shake");
        setTimeout(() => gameElem.classList.remove("effect-shake"), 600);
      }
      if (typeof callback === "function") setTimeout(callback, 650);
    },

    openCourtRecord: function(onPresent) {
      initCourtDom();
      onPresentCallback = onPresent || null;

      const modal = document.getElementById("courtRecordModal");
      const grid = document.getElementById("courtEvidenceGrid");
      const detail = document.getElementById("courtEvidenceDetail");
      if (!modal || !grid) return;

      const scn = (typeof currentScene !== "undefined" ? currentScene : (window.currentScene || ""));
      const isCh2 = scn.includes("ch2");

      // Filter or prioritize evidence based on active chapter
      const relevantList = EVIDENCE_DATABASE.filter(item => {
        if (isCh2) return item.chapter === 2 || !item.chapter;
        return item.chapter === 1 || !item.chapter;
      });

      const displayList = relevantList.length > 0 ? relevantList : EVIDENCE_DATABASE;

      grid.innerHTML = "";
      displayList.forEach(item => {
        const card = document.createElement("div");
        card.className = `evidence-card ${selectedEvidenceId === item.id ? "selected" : ""}`;
        card.innerHTML = `
          <span class="evidence-icon">${item.icon}</span>
          <span class="evidence-name">${item.name}</span>
        `;
        card.onclick = () => {
          selectedEvidenceId = item.id;
          Array.from(grid.children).forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          if (detail) {
            detail.innerHTML = `<strong>${item.icon} ${item.name}</strong><br>${item.desc}`;
          }
          if (typeof triggerVibration === "function") triggerVibration(15);
        };
        grid.appendChild(card);
      });

      // Select first by default if none or not in current list
      if (!selectedEvidenceId || !displayList.some(i => i.id === selectedEvidenceId)) {
        selectedEvidenceId = displayList[0].id;
      }
      const currentSelected = displayList.find(i => i.id === selectedEvidenceId) || displayList[0];
      if (detail && currentSelected) {
        detail.innerHTML = `<strong>${currentSelected.icon} ${currentSelected.name}</strong><br>${currentSelected.desc}`;
      }

      modal.style.display = "flex";
      if (typeof triggerVibration === "function") triggerVibration(20);
    },

    closeCourtRecord: function() {
      const modal = document.getElementById("courtRecordModal");
      if (modal) modal.style.display = "none";
    },

    submitPresentedEvidence: function() {
      if (!selectedEvidenceId) return;
      const chosenId = selectedEvidenceId;
      this.closeCourtRecord();

      if (typeof onPresentCallback === "function") {
        onPresentCallback(chosenId);
      } else {
        const scn = (typeof currentScene !== "undefined" ? currentScene : (window.currentScene || ""));
        const sceneObj = (window.story && window.story[scn]) ? window.story[scn] : null;

        if (sceneObj && typeof sceneObj.onEvidencePresented === "function") {
          sceneObj.onEvidencePresented(chosenId);
        } else if (scn.includes("ch2_act1")) {
          // Chapter 2 - Act 1: The scorched door contradiction
          if (chosenId === "evidence_scorched_door") {
            if (typeof showScene === "function") showScene("court_ch2_present_scorched_door");
          } else {
            this.takeDamage(20, "שגיאה! הראיה הזאת לא סותרת את שקר 'בנות המלכים והדפיקה בנימוס' של ליליה!");
          }
        } else if (scn.includes("ch2_act2")) {
          // Chapter 2 - Act 2: The Discord Bot Auto-Reply signature
          if (chosenId === "evidence_infernal_covenant_2019" || chosenId === "evidence_discord_webhook") {
            if (typeof showScene === "function") showScene("court_ch2_inspecting_contract");
          } else {
            this.takeDamage(20, "שגיאה! עליך להציג ראיה המוכיחה שהחתימה על חוזה 2019 היא של בוט דיסקורד!");
          }
        } else if (scn.includes("ch2_act3")) {
          // Chapter 2 - Act 3: Exposing the Wolt Demon & Bed Fermentation
          if (chosenId === "evidence_wolt_demon_receipt") {
            if (typeof showScene === "function") showScene("court_ch2_wolt_demon_contradiction");
          } else if (chosenId === "evidence_bed_thermometer" || chosenId === "evidence_secret_oranit_recipe") {
            if (typeof showScene === "function") showScene("court_ch2_bed_dough_explanation");
          } else {
            this.takeDamage(20, "שגיאה! עליך להפריך את עדות שד הוולט או להוכיח את מדע תפיחת המיטה!");
          }
        } else if (scn.includes("ch2")) {
          // General Chapter 2 presentation checks
          if (chosenId === "evidence_infernal_covenant_2019" || chosenId === "evidence_discord_webhook") {
            if (typeof showScene === "function") showScene("court_ch2_inspecting_contract");
          } else if (chosenId === "evidence_bed_thermometer" || chosenId === "evidence_secret_oranit_recipe") {
            if (typeof showScene === "function") showScene("court_ch2_bed_dough_explanation");
          } else {
            this.takeDamage(20, "הראיה אינה מתאימה לשלב זה בדיון!");
          }
        } else if (scn.includes("act1")) {
          if (chosenId === "evidence_analytics_2024") {
            if (typeof showScene === "function") showScene("court_act1_success");
          } else if (chosenId === "evidence_burekas_receipt") {
            if (typeof showScene === "function") showScene("court_act1_penalty_burekas");
          } else {
            if (typeof showScene === "function") showScene("court_act1_penalty_bed");
          }
        } else if (scn.includes("act2")) {
          if (chosenId === "evidence_phone_sleep" || chosenId === "evidence_discord_webhook") {
            if (typeof showScene === "function") showScene("court_act2_success");
          } else {
            if (typeof showScene === "function") showScene("court_act2_penalty_repeat");
          }
        } else if (scn.includes("act3")) {
          if (chosenId === "evidence_burekas_receipt" || chosenId === "evidence_bed_contract") {
            if (typeof showScene === "function") showScene("court_act3_success");
          } else {
            if (typeof showScene === "function") showScene("court_act3_penalty");
          }
        }
      }
    }
  };

  // Initialize on load
  window.addEventListener("load", () => {
    window.courtEngine.init();
  });
})();
