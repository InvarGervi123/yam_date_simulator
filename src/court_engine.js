// --- Universal Ace Attorney Courtroom Engine ---
(function() {
  const EVIDENCE_DATABASE = [
    {
      id: "evidence_analytics_2024",
      icon: "📜",
      name: "דוח אנליטיקס עריכה 2024",
      desc: "דוח רשמי מ-YouTube Studio: 0 דקות רינדור, 0 סרטונים הועלו, ו-4,000 שעות משחק ב-Deltarune במיטה."
    },
    {
      id: "evidence_phone_sleep",
      icon: "📱",
      name: "יומן שינה וצפייה בנייד",
      desc: "תיעוד מאפליקציית השעון: ים ישן 23.5 שעות ביממה, מתוכן חצי שעה מוקדשת לצפייה בשורטס של נמר הכסף."
    },
    {
      id: "evidence_burekas_receipt",
      icon: "🥐",
      name: "שטר משלוח בורקס מאורנית",
      desc: "חשבונית מס ממאפיית אורנית: 'משלוח בורקס גבינה חם ישירות למיטת הנאשם (רכב ממונע על גלגלים)'."
    },
    {
      id: "evidence_bed_contract",
      icon: "🛏️",
      name: "חוזה בלעדיות עם המיטה",
      desc: "חוזה בן 40 שנה בין ים לשמיכה. סעיף 4ג: 'איסור יציאה לדייט אלא אם כן מדובר בפיקוח נפש או שוחד פחמימות'."
    },
    {
      id: "evidence_demon_covenant",
      icon: "😈",
      name: "ברית האהבה הדמונית של ליליה",
      desc: "מגילת קלף עתיקה משנת 1624: הבטחה חתומה של אבותיו של ים לצאת לדייט עם השדה ליליה אם יזניח את הערוץ."
    },
    {
      id: "evidence_discord_webhook",
      icon: "📑",
      name: "שטר 'יששכר וזבולון' המזויף",
      desc: "צילום מסך מטושטש מדיסקורד: ינוור שלח אימוג'י בורקס וים טוען שזה 'חוזה העסקת שינה במימון מלא'."
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

      grid.innerHTML = "";
      EVIDENCE_DATABASE.forEach(item => {
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

      // Select first by default if none
      if (!selectedEvidenceId && EVIDENCE_DATABASE.length > 0) {
        selectedEvidenceId = EVIDENCE_DATABASE[0].id;
        if (detail) {
          detail.innerHTML = `<strong>${EVIDENCE_DATABASE[0].icon} ${EVIDENCE_DATABASE[0].name}</strong><br>${EVIDENCE_DATABASE[0].desc}`;
        }
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
