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
