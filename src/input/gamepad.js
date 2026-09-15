// --- Universal Gamepad & Dual-Rumble Haptic Engine ---
(function() {
  let connectedGamepad = null;
  let gamepadLoopId = null;

  // Previous button states for debounce tracking
  const lastButtonState = {};
  let selectedChoiceIndex = -1;

  // Debounce timing
  let lastNavTime = 0;

  function onGamepadConnected(e) {
    connectedGamepad = e.gamepad;
    console.log(`🎮 Gamepad connected: ${connectedGamepad.id} (Index: ${connectedGamepad.index})`);
    showGamepadToast(`🎮 בקר מחובר: ${connectedGamepad.id.substring(0, 20)}...`);
    startGamepadLoop();
  }

  function onGamepadDisconnected(e) {
    console.log(`🎮 Gamepad disconnected: ${e.gamepad.id}`);
    showGamepadToast(`🎮 בקר נתקע או נותק`);
    connectedGamepad = null;
  }

  function showGamepadToast(msg) {
    let toast = document.getElementById("gamepadToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "gamepadToast";
      toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: rgba(18, 22, 36, 0.92); color: #2ecc71; border: 1px solid #2ecc71; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-family: 'Rubik', sans-serif; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: none; transition: opacity 0.5s ease;";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 3500);
  }

  function getActiveGamepad() {
    if (!navigator.getGamepads) return null;
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && gamepads[i].connected) {
        return gamepads[i];
      }
    }
    return null;
  }

  function triggerRumble(weak = 0.5, strong = 0.5, duration = 200) {
    const gp = getActiveGamepad();
    if (!gp) return;

    // Standard Dual-Rumble Haptic Actuator
    if (gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === "function") {
      try {
        gp.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: duration,
          weakMagnitude: weak,
          strongMagnitude: strong
        }).catch(() => {});
      } catch(e) {}
    } else if (gp.hapticActuators && gp.hapticActuators.length > 0) {
      try {
        gp.hapticActuators[0].pulse(strong, duration);
      } catch(e) {}
    }
  }

  function pollGamepadInput() {
    const gp = getActiveGamepad();
    if (!gp) {
      gamepadLoopId = requestAnimationFrame(pollGamepadInput);
      return;
    }

    const now = Date.now();

    // Axes (Left Analog Stick)
    const axisX = gp.axes[0] || 0;
    const axisY = gp.axes[1] || 0;

    // Buttons
    const dpadUp = gp.buttons[12] && gp.buttons[12].pressed;
    const dpadDown = gp.buttons[13] && gp.buttons[13].pressed;
    const dpadLeft = gp.buttons[14] && gp.buttons[14].pressed;
    const dpadRight = gp.buttons[15] && gp.buttons[15].pressed;

    const btnA = gp.buttons[0] && gp.buttons[0].pressed; // Confirm / Action
    const btnB = gp.buttons[1] && gp.buttons[1].pressed; // Back / Cancel
    const btnX = gp.buttons[2] && gp.buttons[2].pressed; 
    const btnY = gp.buttons[3] && gp.buttons[3].pressed; 
    const btnLB = gp.buttons[4] && gp.buttons[4].pressed;
    const btnRB = gp.buttons[5] && gp.buttons[5].pressed;
    const btnStart = gp.buttons[9] && gp.buttons[9].pressed; // Settings

    // --- Story Choice Navigation ---
    const choicesContainer = document.getElementById("choices");
    if (choicesContainer && choicesContainer.children.length > 0) {
      const buttons = Array.from(choicesContainer.querySelectorAll("button"));

      if (buttons.length > 0) {
        // Handle Up Navigation
        if ((dpadUp || axisY < -0.5 || btnLB) && (now - lastNavTime > 220)) {
          lastNavTime = now;
          if (selectedChoiceIndex <= 0) selectedChoiceIndex = buttons.length - 1;
          else selectedChoiceIndex--;
          updateChoiceFocus(buttons);
          triggerRumble(0.2, 0.1, 40);
        }

        // Handle Down Navigation
        if ((dpadDown || axisY > 0.5 || btnRB) && (now - lastNavTime > 220)) {
          lastNavTime = now;
          if (selectedChoiceIndex >= buttons.length - 1) selectedChoiceIndex = 0;
          else selectedChoiceIndex++;
          updateChoiceFocus(buttons);
          triggerRumble(0.2, 0.1, 40);
        }

        // Handle Select Button A Press
        if (btnA && !lastButtonState.btnA) {
          triggerRumble(0.4, 0.4, 80);
          if (selectedChoiceIndex >= 0 && selectedChoiceIndex < buttons.length) {
            buttons[selectedChoiceIndex].click();
            selectedChoiceIndex = -1;
          } else {
            buttons[0].click();
          }
        }
      }
    } else {
      // Advance dialogue when nextBtn is present
      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn && nextBtn.style.display !== "none" && btnA && !lastButtonState.btnA) {
        triggerRumble(0.3, 0.3, 60);
        nextBtn.click();
      }
    }

    // Toggle Settings Modal on Start button
    if (btnStart && !lastButtonState.btnStart) {
      triggerRumble(0.4, 0.4, 100);
      const settingsToggle = document.getElementById("settingsToggle");
      if (settingsToggle) settingsToggle.click();
    }

    // Update last button states for press edge detection
    lastButtonState.btnA = btnA;
    lastButtonState.btnB = btnB;
    lastButtonState.btnX = btnX;
    lastButtonState.btnY = btnY;
    lastButtonState.btnStart = btnStart;

    gamepadLoopId = requestAnimationFrame(pollGamepadInput);
  }

  function updateChoiceFocus(buttons) {
    buttons.forEach((btn, idx) => {
      if (idx === selectedChoiceIndex) {
        btn.classList.add("gamepad-focused");
        btn.focus();
      } else {
        btn.classList.remove("gamepad-focused");
      }
    });
  }

  function startGamepadLoop() {
    if (!gamepadLoopId) {
      gamepadLoopId = requestAnimationFrame(pollGamepadInput);
    }
  }

  // Register Event Listeners
  window.addEventListener("gamepadconnected", onGamepadConnected);
  window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

  // Auto-start loop if gamepads are already attached on load
  window.addEventListener("load", () => {
    if (getActiveGamepad()) {
      startGamepadLoop();
    }
  });

  // Public Interface
  window.gamepadEngine = {
    triggerRumble: triggerRumble,
    getActiveGamepad: getActiveGamepad,
    getInputState: function() {
      const gp = getActiveGamepad();
      if (!gp) return null;
      return {
        axisX: gp.axes[0] || 0,
        axisY: gp.axes[1] || 0,
        dpadUp: gp.buttons[12] && gp.buttons[12].pressed,
        dpadDown: gp.buttons[13] && gp.buttons[13].pressed,
        dpadLeft: gp.buttons[14] && gp.buttons[14].pressed,
        dpadRight: gp.buttons[15] && gp.buttons[15].pressed,
        btnA: gp.buttons[0] && gp.buttons[0].pressed,
        btnB: gp.buttons[1] && gp.buttons[1].pressed,
        btnX: gp.buttons[2] && gp.buttons[2].pressed,
        btnY: gp.buttons[3] && gp.buttons[3].pressed
      };
    }
  };
})();
