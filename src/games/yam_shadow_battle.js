// --- Yam Shadow Battle State Bridge & Lifecycle Manager (Step 6) ---

/**
 * @typedef {Object} YamShadowBattleState
 * @property {boolean} active - Whether the battle is running.
 * @property {number} playerHp - Player's current health points.
 * @property {number} maxPlayerHp - Player's maximum health points.
 * @property {number} invarHp - Invar's current health points.
 * @property {number} maxInvarHp - Invar's maximum health points.
 * @property {number} yamHp - Yam's current health points.
 * @property {number} yamMaxHp - Yam's maximum health points.
 * @property {string} invarPosition - Invar's current teleport quadrant.
 * @property {number} healCooldown - Remaining seconds before Heal is ready.
 * @property {Object|null} healActiveEffect - Active healing visual ring timing state.
 * @property {string} turnState - 'player' | 'enemy' | 'gameover'
 * @property {number} battleTurns - Count of completed battle turns.
 * @property {Function|null} onComplete - Callback executed when battle finishes.
 */

/** @type {YamShadowBattleState} */
window.yamShadowCtx = {
  active: false,
  playerHp: 100,
  maxPlayerHp: 100,
  invarHp: 100,
  maxInvarHp: 100,
  yamHp: 100,
  yamMaxHp: 100,
  invarPosition: 'bottom-right',
  healCooldown: 0,
  healActiveEffect: null,
  turnState: 'player',
  battleTurns: 0,
  onComplete: null
};

let currentYamShadowConfig = null;
let healIntervalId = null;

function handleBattleKeyDown(e) {
  if (!window.yamShadowCtx || !window.yamShadowCtx.active) return;
  const key = e.key;
  const code = e.code;

  if (window.yamShadowCtx.turnState === 'player') {
    if (code === 'KeyF' || key === 'f' || key === 'F' || key === 'כ') {
      executePlayerFight();
    } else if (code === 'KeyH' || key === 'h' || key === 'H' || key === 'י') {
      executePlayerHeal();
    } else if (code === 'KeyT' || key === 't' || key === 'T' || key === 'א') {
      // Handled by renderer's selection trigger
    }
  }
}

/**
 * Renders the primary action choices of the player turn menu.
 */
function showPlayerTurnMenu() {
  const ctx = window.yamShadowCtx;
  if (!ctx.active) return;

  ctx.turnState = 'player';
  
  // Hide warning/attack states in renderer
  if (typeof window.clearShadowRainProjectiles === "function") {
    window.clearShadowRainProjectiles();
  }

  const menuContainer = document.getElementById("yamShadowMenuArea");
  if (!menuContainer) return;

  menuContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; gap: 10px;">
      <p style="color: #bdc3c7; font-size: 14px; margin: 0; font-weight: bold; text-align: center;">[ תורך! בחרי פעולה ]</p>
      <div style="display: flex; justify-content: center; gap: 10px; width: 100%;">
        <button onclick="executePlayerFight()" class="battle-menu-btn" style="background: #e74c3c; border-color: #c0392b;">⚔️ FIGHT (F)</button>
        <button onclick="showActSubmenu()" class="battle-menu-btn" style="background: #3498db; border-color: #2980b9;">📣 ACT</button>
        <button onclick="showItemSubmenu()" class="battle-menu-btn" style="background: #f1c40f; border-color: #f39c12; color: #000;">🎒 ITEM</button>
        <button id="yamShadowTeleportBtn" class="battle-menu-btn" style="background: #8e44ad; border-color: #7d3c98;">⚡ TELEPORT (T)</button>
        <button id="yamShadowHealBtn" onclick="executePlayerHeal()" class="battle-menu-btn" style="background: #2ecc71; border-color: #27ae60;">💚 HEAL (H)</button>
      </div>
    </div>
  `;

  // Bind teleport toggle in renderer
  const tpBtn = document.getElementById("yamShadowTeleportBtn");
  if (tpBtn && typeof window.toggleTeleportSelection === "function") {
    tpBtn.onclick = window.toggleTeleportSelection;
  }

  updateYamShadowHud();
}

/**
 * Displays feedback text then transitions into the enemy attack phase.
 * @param {string} text - Narrative dialogue or status event.
 */
function advanceToEnemyTurn(text) {
  const menuContainer = document.getElementById("yamShadowMenuArea");
  if (!menuContainer) return;

  window.yamShadowCtx.turnState = 'enemy';

  menuContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center;">
      <p style="color: #f1c40f; font-size: 14px; margin: 0 0 5px 0; font-weight: bold; text-align: center;">${text}</p>
      <p style="color: #e74c3c; font-size: 12px; margin: 0; font-weight: bold; animation: pulse 1.5s infinite;">[ תורו של ים - התחמקי מהקליעים! ]</p>
    </div>
  `;

  // Call renderer to trigger attack loop
  if (typeof window.triggerShadowRainWave === "function") {
    window.triggerShadowRainWave();
  }
}

/**
 * Inflicts FIGHT damage to Yam.
 */
function executePlayerFight() {
  const ctx = window.yamShadowCtx;
  if (!ctx.active || ctx.turnState !== 'player') return;

  ctx.yamHp = Math.max(0, ctx.yamHp - 25);
  if (typeof window.triggerFightVfx === 'function') {
    window.triggerFightVfx(25);
  }
  updateYamShadowHud();
  advanceToEnemyTurn("הנחתת מכה של 25 נזק על הצל של ים!");
}

/**
 * Displays ACT choices.
 */
function showActSubmenu() {
  const menuContainer = document.getElementById("yamShadowMenuArea");
  if (!menuContainer) return;

  menuContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; gap: 10px;">
      <p style="color: #3498db; font-size: 13px; margin: 0; font-weight: bold;">[ ACT - בחרי אינטראקציה ]</p>
      <div style="display: flex; justify-content: center; gap: 8px;">
        <button onclick="executeAct('check')" class="battle-menu-btn" style="background: rgba(52, 152, 219, 0.4); border-color: #3498db;">🔍 בדיקה</button>
        <button onclick="executeAct('talk')" class="battle-menu-btn" style="background: rgba(52, 152, 219, 0.4); border-color: #3498db;">💬 דיבור</button>
        <button onclick="executeAct('burek')" class="battle-menu-btn" style="background: rgba(52, 152, 219, 0.4); border-color: #3498db;">🥯 בורקס</button>
        <button onclick="showPlayerTurnMenu()" class="battle-menu-btn" style="background: #7f8c8d; border-color: #95a5a6;">🔙 חזרה</button>
      </div>
    </div>
  `;
}

/**
 * Executes a chosen ACT, resolving flavor text and ending player turn.
 */
function executeAct(type) {
  let text = "";
  if (type === 'check') {
    text = "ים: HP 100. מתבצר במיטה. הצל שלו (THE ECHO) מבעבע בזעם.";
  } else if (type === 'talk') {
    text = "ינוור מנסה לקרוא לים להירגע, אך ים רק מפהק ומגרד בגב.";
  } else if (type === 'burek') {
    text = "זרקת בורקס חם למיטה. ים מציץ ומריח, אך ממשיך לשכב.";
  }
  advanceToEnemyTurn(text);
}

/**
 * Displays ITEM choices.
 */
function showItemSubmenu() {
  const menuContainer = document.getElementById("yamShadowMenuArea");
  if (!menuContainer) return;

  menuContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; gap: 10px;">
      <p style="color: #f1c40f; font-size: 13px; margin: 0; font-weight: bold;">[ ITEM - בחרי פריט ריפוי ]</p>
      <div style="display: flex; justify-content: center; gap: 8px;">
        <button onclick="executeItem('tuna')" class="battle-menu-btn" style="background: rgba(241, 196, 15, 0.4); border-color: #f1c40f; color: #fff;">🐟 טונה עם נוטלה (30+ HP)</button>
        <button onclick="executeItem('burek_slice')" class="battle-menu-btn" style="background: rgba(241, 196, 15, 0.4); border-color: #f1c40f; color: #fff;">🥯 פרוסת בורקס (15+ HP)</button>
        <button onclick="showPlayerTurnMenu()" class="battle-menu-btn" style="background: #7f8c8d; border-color: #95a5a6;">🔙 חזרה</button>
      </div>
    </div>
  `;
}

/**
 * Uses an item, applying health adjustments.
 */
function executeItem(type) {
  const ctx = window.yamShadowCtx;
  if (!ctx.active) return;

  if (type === 'tuna') {
    ctx.playerHp = Math.min(ctx.maxPlayerHp, ctx.playerHp + 30);
    advanceToEnemyTurn("אכלת טונה עם נוטלה. השתעלת קצת, אך קיבלת 30 HP!");
  } else if (type === 'burek_slice') {
    ctx.playerHp = Math.min(ctx.maxPlayerHp, ctx.playerHp + 15);
    advanceToEnemyTurn("אכלת פרוסת בורקס חמה. החזרת 15 HP!");
  }
}

/**
 * Executes Invar's Heal ability.
 */
function executePlayerHeal() {
  const ctx = window.yamShadowCtx;
  if (!ctx.active || ctx.turnState !== 'player' || ctx.healCooldown > 0) return;

  if (ctx.playerHp >= ctx.maxPlayerHp) {
    console.log("Heal not consumed: Player already at full HP.");
    return;
  }

  ctx.playerHp = Math.min(ctx.maxPlayerHp, ctx.playerHp + 20);
  ctx.healCooldown = 5; // 5s cooldown
  ctx.healActiveEffect = { timer: 0.4 };

  updateYamShadowHud();
  advanceToEnemyTurn("ינוור ריפא את השחקנית ב-20 HP!");
}

/**
 * Triggered by the renderer when an enemy attack phase terminates.
 */
function onEnemyAttackWaveComplete() {
  const ctx = window.yamShadowCtx;
  if (!ctx.active) return;

  ctx.battleTurns++;

  // --- Check End Game / Transition States ---
  if (ctx.playerHp <= 0) {
    executePlayerDefeat();
    return;
  }
  if (ctx.invarHp <= 0) {
    executeInvarDefeat();
    return;
  }
  if (ctx.yamHp <= 0 || ctx.battleTurns >= 3) {
    executeVictory();
    return;
  }

  // Next round
  showPlayerTurnMenu();
}

/**
 * Handles victory condition transition back to story.
 */
function executeVictory() {
  const cfg = currentYamShadowConfig;
  stopYamShadowBattle();
  if (cfg && cfg.nextSuccess) {
    showScene(cfg.nextSuccess);
  } else {
    showScene("yam_shadow_vertical_slice_end");
  }
}

/**
 * Handles Invar defeat transition.
 */
function executeInvarDefeat() {
  stopYamShadowBattle();
  showScene("yam_shadow_invar_fallen_placeholder");
}

/**
 * Handles Player defeat state. Shows Retry / Exit panel.
 */
function executePlayerDefeat() {
  const ctx = window.yamShadowCtx;
  ctx.turnState = 'gameover';

  if (typeof window.stopYamShadowRenderer === "function") {
    window.stopYamShadowRenderer();
  }

  const menuContainer = document.getElementById("yamShadowMenuArea");
  if (menuContainer) {
    menuContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; gap: 10px;">
        <p style="color: #e74c3c; font-size: 16px; margin: 0; font-weight: bold;">☠️ המשחק הסתיים (Game Over) ☠️</p>
        <p style="color: #2ecc71; font-size: 13px; margin: 0; font-weight: bold; text-align: center;">ינוור: "לא נכשלת. עכשיו אנחנו יודעים מאיפה הגשם מגיע."</p>
        <div style="display: flex; gap: 10px;">
          <button onclick="retryYamShadowBattle()" style="padding: 8px 16px; background: #2ecc71; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🔄 ניסיון חוזר</button>
          <button onclick="exitYamShadowBattle()" style="padding: 8px 16px; background: #95a5a6; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🏠 צא לחדר של ים</button>
        </div>
      </div>
    `;
  }
}

function retryYamShadowBattle() {
  if (currentYamShadowConfig) {
    runYamShadowBattle(currentYamShadowConfig);
  }
}

function exitYamShadowBattle() {
  stopYamShadowBattle();
  showScene("room_intro");
}

/**
 * Updates HUD progress bars.
 */
function updateYamShadowHud() {
  const ctx = window.yamShadowCtx;
  if (!ctx.active) return;

  const playerBar = document.getElementById("yamShadowPlayerHpBar");
  const playerText = document.getElementById("yamShadowPlayerHpText");
  const invarBar = document.getElementById("yamShadowInvarHpBar");
  const invarText = document.getElementById("yamShadowInvarHpText");
  const healBtn = document.getElementById("yamShadowHealBtn");

  if (playerBar && playerText) {
    const pct = (ctx.playerHp / ctx.maxPlayerHp) * 100;
    playerBar.style.width = `${pct}%`;
    playerText.textContent = `${ctx.playerHp}/${ctx.maxPlayerHp}`;
  }

  if (invarBar && invarText) {
    const pct = (ctx.invarHp / ctx.maxInvarHp) * 100;
    invarBar.style.width = `${pct}%`;
    invarText.textContent = `${ctx.invarHp}/${ctx.maxInvarHp}`;
  }

  if (healBtn) {
    if (ctx.healCooldown > 0) {
      healBtn.disabled = true;
      healBtn.style.background = "#555";
      healBtn.style.borderColor = "#444";
      healBtn.style.cursor = "not-allowed";
      healBtn.textContent = `💚 Heal (${ctx.healCooldown}s)`;
    } else {
      healBtn.disabled = false;
      healBtn.style.background = "#2ecc71";
      healBtn.style.borderColor = "#27ae60";
      healBtn.style.cursor = "pointer";
      healBtn.textContent = "💚 Heal (H)";
    }
  }
}

/**
 * Initializes and starts the Yam Shadow Battle module.
 * @param {Object} config - Router configuration object from story scene.
 */
function runYamShadowBattle(config) {
  stopYamShadowBattle(); // Ensure cleanup of any previous instance

  currentYamShadowConfig = config;
  
  const ctx = window.yamShadowCtx;
  ctx.active = true;
  ctx.playerHp = 100;
  ctx.maxPlayerHp = 100;
  ctx.invarHp = 100;
  ctx.maxInvarHp = 100;
  ctx.yamHp = 100;
  ctx.yamMaxHp = 100;
  ctx.healCooldown = 0;
  ctx.healActiveEffect = null;
  ctx.battleTurns = 0;
  ctx.turnState = 'player';

  // Inject CSS class for battle action buttons once
  if (!document.getElementById("yamShadowBattleStyle")) {
    const style = document.createElement("style");
    style.id = "yamShadowBattleStyle";
    style.textContent = `
      .battle-menu-btn {
        padding: 8px 14px;
        color: #ffffff;
        border: 1px solid #fff;
        border-radius: 4px;
        cursor: pointer;
        font-family: Rubik, sans-serif;
        font-size: 11px;
        font-weight: bold;
        transition: all 0.2s;
      }
      .battle-menu-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
      }
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }

  // Create or get container overlay
  let overlay = document.getElementById("yamShadowOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "yamShadowOverlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "rgba(10, 5, 20, 0.95)";
    overlay.style.zIndex = "1000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "#ffffff";
    overlay.style.fontFamily = "Rubik, Heebo, sans-serif";
    overlay.style.dir = "rtl";

    overlay.innerHTML = `
      <div id="yamShadowHeader" style="text-align: center; margin-bottom: 10px;">
        <h3 style="color: #e74c3c; margin: 0 0 5px 0;">⚔️ הקרב מול הצל של ים ⚔️</h3>
      </div>
      <!-- Dedicated Non-Overlapping HUD Bar -->
      <div id="yamShadowHud" style="width: 600px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: rgba(20, 10, 35, 0.9); padding: 8px 15px; border-radius: 6px; border: 1px solid #8e44ad; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #e74c3c; font-weight: bold; font-size: 13px;">❤️ השחקנית:</span>
          <div style="width: 100px; height: 12px; background: #333; border-radius: 6px; overflow: hidden; border: 1px solid #555;">
            <div id="yamShadowPlayerHpBar" style="width: 100%; height: 100%; background: #e74c3c; transition: width 0.2s;"></div>
          </div>
          <span id="yamShadowPlayerHpText" style="color: #fff; font-size: 12px; font-weight: bold;">100/100</span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #3498db; font-weight: bold; font-size: 13px;">🔷 ינוור:</span>
          <div style="width: 100px; height: 12px; background: #333; border-radius: 6px; overflow: hidden; border: 1px solid #555;">
            <div id="yamShadowInvarHpBar" style="width: 100%; height: 100%; background: #3498db; transition: width 0.2s;"></div>
          </div>
          <span id="yamShadowInvarHpText" style="color: #fff; font-size: 12px; font-weight: bold;">100/100</span>
        </div>
      </div>
      <div id="yamShadowCanvasContainer" style="position: relative; width: 600px; height: 400px; border: 2px solid #8e44ad; background: #000000; box-shadow: 0 0 15px rgba(142, 68, 173, 0.5);">
        <canvas id="yamShadowCanvas" width="600" height="400" style="display: block; width: 100%; height: 100%;"></canvas>
        
        <!-- Target Selection Mobile Grid Overlay -->
        <div id="yamShadowTeleportGrid" style="display: none; position: absolute; inset: 0; padding: 110px 20px 20px 20px; box-sizing: border-box; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; z-index: 10; background: rgba(10, 5, 20, 0.65); direction: ltr;">
          <button id="yamTeleportBtnTL" data-quadrant="top-left" style="background: rgba(52, 152, 219, 0.3); border: 2px solid #3498db; color: #fff; font-weight: bold; font-size: 14px; border-radius: 8px; cursor: pointer; direction: rtl;">1: שמאל למעלה ↖️</button>
          <button id="yamTeleportBtnTR" data-quadrant="top-right" style="background: rgba(52, 152, 219, 0.3); border: 2px solid #3498db; color: #fff; font-weight: bold; font-size: 14px; border-radius: 8px; cursor: pointer; direction: rtl;">2: ימין למעלה ↗️</button>
          <button id="yamTeleportBtnBL" data-quadrant="bottom-left" style="background: rgba(52, 152, 219, 0.3); border: 2px solid #3498db; color: #fff; font-weight: bold; font-size: 14px; border-radius: 8px; cursor: pointer; direction: rtl;">3: שמאל למטה ↙️</button>
          <button id="yamTeleportBtnBR" data-quadrant="bottom-right" style="background: rgba(52, 152, 219, 0.3); border: 2px solid #3498db; color: #fff; font-weight: bold; font-size: 14px; border-radius: 8px; cursor: pointer; direction: rtl;">4: ימין למטה ↘️</button>
        </div>
      </div>
      <!-- HUD Menu Control Area -->
      <div id="yamShadowMenuArea" style="margin-top: 15px; width: 600px; background: rgba(20, 10, 35, 0.9); padding: 12px 15px; border-radius: 6px; border: 1px solid #8e44ad; box-sizing: border-box; display: flex; align-items: center; justify-content: center; min-height: 80px;">
        <!-- Injected dynamically via showPlayerTurnMenu() -->
      </div>
    `;

    document.body.appendChild(overlay);
  } else {
    overlay.style.display = "flex";
  }

  window.addEventListener('keydown', handleBattleKeyDown);

  // Initialize UI turn menu
  showPlayerTurnMenu();

  // Cooldown interval countdown
  healIntervalId = setInterval(() => {
    if (ctx.active && ctx.healCooldown > 0) {
      ctx.healCooldown--;
      updateYamShadowHud();
    }
  }, 1000);

  const canvas = document.getElementById("yamShadowCanvas");
  if (canvas && typeof window.startYamShadowRenderer === "function") {
    window.startYamShadowRenderer(canvas);
  }
}

/**
 * Cleans up and stops the Yam Shadow Battle module.
 */
function stopYamShadowBattle() {
  window.yamShadowCtx.active = false;
  window.yamShadowCtx.healCooldown = 0;
  window.yamShadowCtx.healActiveEffect = null;

  if (healIntervalId !== null) {
    clearInterval(healIntervalId);
    healIntervalId = null;
  }

  window.removeEventListener('keydown', handleBattleKeyDown);

  if (typeof window.stopYamShadowRenderer === "function") {
    window.stopYamShadowRenderer();
  }
  const overlay = document.getElementById("yamShadowOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

// Global functions for HTML onclick callbacks
window.advanceToEnemyTurn = advanceToEnemyTurn;
window.executePlayerFight = executePlayerFight;
window.executePlayerHeal = executePlayerHeal;
window.showActSubmenu = showActSubmenu;
window.executeAct = executeAct;
window.showItemSubmenu = showItemSubmenu;
window.executeItem = executeItem;
window.retryYamShadowBattle = retryYamShadowBattle;
window.exitYamShadowBattle = exitYamShadowBattle;
window.showPlayerTurnMenu = showPlayerTurnMenu;
window.onEnemyAttackWaveComplete = onEnemyAttackWaveComplete;
window.runYamShadowBattle = runYamShadowBattle;
window.stopYamShadowBattle = stopYamShadowBattle;
