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

window.gameState = {
  /** @type {GameStats} */
  stats: {
    romance: 0,
    chaos: 0,
    force: 0,
    trust: 3
  },

  /** @type {GameFlags} */
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

  /**
   * Resets all run stats and flags to initial baseline.
   * Called only at the start of a genuinely new run.
   */
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

  /**
   * Safely adds or subtracts a stat value, clamped between 0 and 10.
   * @param {'romance'|'chaos'|'force'|'trust'} stat
   * @param {number} delta
   */
  addStat: function(stat, delta) {
    if (this.stats[stat] !== undefined) {
      this.stats[stat] = Math.max(0, Math.min(10, this.stats[stat] + delta));
    }
  },

  /**
   * Sets a boolean flag.
   * @param {keyof GameFlags} flag
   * @param {boolean} [value=true]
   */
  setFlag: function(flag, value = true) {
    if (this.flags[flag] !== undefined) {
      this.flags[flag] = !!value;
    }
  },

  /**
   * Checks a boolean flag.
   * @param {keyof GameFlags} flag
   * @returns {boolean}
   */
  hasFlag: function(flag) {
    return !!this.flags[flag];
  }
};
