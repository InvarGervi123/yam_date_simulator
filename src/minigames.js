// --- Modular Minigames Engine ---

/**
 * Routing dispatcher that starts a specific interactive minigame based on config.
 * Supports: 'deltarune_battle', 'math_quiz', 'baldi_basics', 'pregnancy_space', and 'slender_3d'.
 * @param {Object} config - Configuration object specifying minigame type, durations, and ending transition scene hooks.
 */
function runMinigame(config) {
  if (config.type === "deltarune_battle") {
    runDeltaruneBattle(config);
    return;
  }
  if (config.type === "math_quiz") {
    runMathMinigame(config);
    return;
  }
  if (config.type === "baldi_basics") {
    runBaldiMinigame(config);
    return;
  }
  if (config.type === "pregnancy_space") {
    runPregnancyGame(
      () => showScene(config.nextSuccess),
      () => showScene(config.nextFail)
    );
    return;
  }
  if (config.type === "slender_3d") {
    runSlenderMinigame(
      () => showScene(config.nextSuccess),
      () => showScene(config.nextFail)
    );
    return;
  }
  if (config.type === "yam_shadow_battle") {
    runYamShadowBattle(config);
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
      
      playSfx("audio/click.mp3");
      triggerVibration(12);
      
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
    const speed = 3.5;
    
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

function runMathMinigame(config) {
  minigameOverlay.style.display = "flex";
  clearChoices();
  nextBtn.style.display = "none";
  minigameBtn.style.display = "none"; // Hide standard button

  minigameTitle.textContent = "מבחן המתמטיקה של ים!";
  minigameInstruction.textContent = "פתרו את כל השאלות ברצף! תשובה נכונה מוסיפה +5 שניות לשעון.";

  const allQuestions = [
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
    },
    {
      text: "אם ים אכל 3 בורקסים גבינה בבוקר ו-5 בורקסים תפוח-אדמה בערב, כמה בורקסים נותרו במגש של 12?",
      options: ["4 בורקסים", "2 בורקסים", "0 (ים אכל את כל המגש)"],
      correct: 0
    },
    {
      text: "בורקס אחד מכיל 250 קלוריות. ים אכל 4 בורקסים. כמה קלוריות ים צרך לפני הקרב?",
      options: ["500 קלוריות", "1,000 קלוריות", "9,999 קלוריות"],
      correct: 1
    }
  ];

  let currentQIndex = 0;
  const totalQuestions = allQuestions.length;
  let timeLeft = 10000; // Initial 10 seconds

  const formulaModal = document.getElementById("formulaModal");
  const closeFormula = document.getElementById("closeFormula");

  function renderCurrentQuestion() {
    const question = allQuestions[currentQIndex];
    let html = `
      <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 8px;">
        <button class="mg-formula-trigger" id="showFormulaBtn">📋 פתח דף נוסחאות</button>
        <button class="mg-formula-trigger" id="devToolsHackBtn" style="background: #e74c3c;">🛠️ DevTools Hack</button>
      </div>
      <div style="font-weight: bold; color: #f1c40f; margin-bottom: 4px;">שאלה ${currentQIndex + 1} מתוך ${totalQuestions}</div>
      <div class="mg-math-question">${question.text}</div>
      <div class="mg-math-options">
    `;

    question.options.forEach((opt, idx) => {
      html += `<button class="mg-math-btn" data-idx="${idx}">${opt}</button>`;
    });

    html += `
      </div>
      <div class="mg-timer" id="mgTimer" style="margin-top: 14px;">זמן נותר: ${(timeLeft / 1000).toFixed(1)}s</div>
      <div id="mgBonusFeedback" style="height: 20px; font-weight: bold; color: #2ecc71; font-size: 14px; margin-top: 4px;"></div>
    `;

    minigameVisual.innerHTML = html;

    const showFormulaBtn = document.getElementById("showFormulaBtn");
    if (showFormulaBtn) {
      showFormulaBtn.onclick = () => {
        triggerVibration(15);
        formulaModal.style.display = "flex";
      };
    }

    const devToolsHackBtn = document.getElementById("devToolsHackBtn");
    if (devToolsHackBtn) {
      devToolsHackBtn.onclick = () => {
        triggerVibration([100, 50, 200, 50, 300]);
        playSfx("audio/click.mp3");
        clearInterval(window.minigameInterval);
        minigameOverlay.style.display = "none";
        formulaModal.style.display = "none";
        minigameBtn.style.display = "block";
        showScene("end_math_hacker");
      };
    }

    const optionBtns = minigameVisual.querySelectorAll(".mg-math-btn");
    optionBtns.forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        if (idx === question.correct) {
          playSfx("audio/healing.mp3");
          triggerVibration([80, 40, 120]);
          timeLeft += 5000; // Add +5 seconds bonus time!
          
          currentQIndex++;
          if (currentQIndex >= totalQuestions) {
            // All questions answered!
            clearInterval(window.minigameInterval);
            minigameBtn.style.display = "block";
            endMinigame(true);
          } else {
            renderCurrentQuestion();
            const feedbackEl = document.getElementById("mgBonusFeedback");
            if (feedbackEl) feedbackEl.textContent = "⏱️ +5.0 שניות בונוס!";
          }
        } else {
          // Wrong answer
          playSfx("audio/hit.mp3");
          triggerVibration([180, 80, 180]);
          clearInterval(window.minigameInterval);
          minigameBtn.style.display = "block";
          endMinigame(false);
        }
      };
    });
  }

  closeFormula.onclick = () => {
    triggerVibration(15);
    formulaModal.style.display = "none";
  };

  renderCurrentQuestion();

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
    const mgTimer = document.getElementById("mgTimer");
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
