// @ts-check
// --- Lightweight Run-State Management ---
// Tracks player choices and behavioral tendencies across a single run.
// Does NOT modify persistent save data or localStorage.

/**
 * @typedef {Object} GameStats
 * @property {number} romance - Sincerity and emotional connection (0-10)
 * @property {number} chaos - Absurdity, trolling, and meme actions (0-10)
 * @property {number} force - Aggression, physical dominance, and threats (0-10)
 * @property {number} trust - Yam's willingness to get out of bed and listen (0-10)
 */

/**
 * @typedef {Object} GameFlags
 * @property {boolean} hasBurekas - Committed to bringing burekas to the date
 * @property {boolean} usedPhysicalForce - Attempted physical aggression or property damage
 * @property {boolean} wiiPulsePassed - Succeeded in the Wii EKG calmness challenge
 * @property {boolean} sparedBoss - Chose mercy/pacifism in combat
 * @property {boolean} escapedBaldi - Successfully solved or survived Baldi encounter
 * @property {boolean} wonSpaceCombat - Executed the cosmic combo in Pregnancy VR
 * @property {boolean} visitedCourt - Participated in Beth Din trial proceedings
 * @property {boolean} invarThreatened - Used Invar's name as leverage or threat
 */

/**
 * @typedef {Object} GameState
 * @property {GameStats} stats - Run statistics tracking player tendencies
 * @property {GameFlags} flags - Progression and event flags for this run
 * @property {function(): void} reset - Resets all run stats and flags to initial baseline
 * @property {function(keyof GameStats, number): void} addStat - Safely adds or subtracts a stat value (clamped 0-10)
 * @property {function(keyof GameFlags, boolean=): void} setFlag - Sets a boolean flag
 * @property {function(keyof GameFlags): boolean} hasFlag - Checks a boolean flag
 */

/** @type {GameState} */
const gameState = {
  stats: {
    romance: 0,
    chaos: 0,
    force: 0,
    trust: 3
  },

  flags: {
    hasBurekas: false,
    usedPhysicalForce: false,
    wiiPulsePassed: false,
    sparedBoss: false,
    escapedBaldi: false,
    wonSpaceCombat: false,
    visitedCourt: false,
    invarThreatened: false
  },

  reset: function() {
    this.stats.romance = 0;
    this.stats.chaos = 0;
    this.stats.force = 0;
    this.stats.trust = 3;

    this.flags.hasBurekas = false;
    this.flags.usedPhysicalForce = false;
    this.flags.wiiPulsePassed = false;
    this.flags.sparedBoss = false;
    this.flags.escapedBaldi = false;
    this.flags.wonSpaceCombat = false;
    this.flags.visitedCourt = false;
    this.flags.invarThreatened = false;
  },

  addStat: function(stat, delta) {
    if (this.stats[stat] !== undefined) {
      this.stats[stat] = Math.max(0, Math.min(10, this.stats[stat] + delta));
    }
  },

  setFlag: function(flag, value = true) {
    if (this.flags[flag] !== undefined) {
      this.flags[flag] = !!value;
    }
  },

  hasFlag: function(flag) {
    return !!this.flags[flag];
  }
};

// Bind to window for shared access across classic script tags
window['gameState'] = gameState;
