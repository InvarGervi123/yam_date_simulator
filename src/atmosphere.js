// --- Dynamic Story Atmosphere & Mood Engine ---
(function() {
  const MOOD_CLASSES = [
    'mood-dark-room',
    'mood-romantic-warmth',
    'mood-cardiac-danger',
    'mood-hospital-fluorescent',
    'mood-mystic-shadow'
  ];

  let atmosphereEnabled = true;

  // Initialize preference from localStorage
  const savedPref = localStorage.getItem('gameAtmosphereEnabled');
  if (savedPref !== null) {
    atmosphereEnabled = (savedPref === 'true');
  }

  window.atmosphereEngine = {
    isAtmosphereEnabled: function() {
      return atmosphereEnabled;
    },

    setAtmosphereEnabled: function(enabled) {
      atmosphereEnabled = !!enabled;
      localStorage.setItem('gameAtmosphereEnabled', atmosphereEnabled ? 'true' : 'false');
      if (!atmosphereEnabled) {
        this.resetMood();
      }
    },

    resetMood: function() {
      const container = document.getElementById('game');
      if (!container) return;
      MOOD_CLASSES.forEach(cls => container.classList.remove(cls));
    },

    applyMood: function(moodName) {
      const container = document.getElementById('game');
      if (!container) return;

      this.resetMood();

      if (!atmosphereEnabled || !moodName) return;

      const targetClass = moodName.startsWith('mood-') ? moodName : `mood-${moodName}`;
      if (MOOD_CLASSES.includes(targetClass)) {
        container.classList.add(targetClass);
      }
    },

    autoDetectStoryMood: function(text, sceneId, sceneObj) {
      if (!atmosphereEnabled) return;

      // 1. Explicit scene.mood override
      if (sceneObj && sceneObj.mood) {
        this.applyMood(sceneObj.mood);
        return;
      }

      const sceneStr = String(sceneId || '').toLowerCase();
      const txtStr = String(text || '').toLowerCase();

      // 2. Cardiac Danger / Alert
      if (sceneStr.includes('wii_pulse') || sceneStr.includes('heart_attack') || txtStr.includes('דופק') || txtStr.includes('התקף לב') || txtStr.includes('נשימה')) {
        this.applyMood('cardiac-danger');
        return;
      }

      // 3. Hospital / ICU / Medical
      if (sceneStr.includes('flatline') || sceneStr.includes('icu') || txtStr.includes('בית חולים') || txtStr.includes('מיון') || txtStr.includes('אמבולנס') || txtStr.includes('רופא')) {
        this.applyMood('hospital-fluorescent');
        return;
      }

      // 4. Romantic Warmth
      if (sceneStr.includes('romantic') || sceneStr.includes('normal') || sceneStr.includes('hug') || txtStr.includes('רומנטי') || txtStr.includes('חיבוק') || txtStr.includes('תמי')) {
        this.applyMood('romantic-warmth');
        return;
      }

      // 5. Mystic / Yinover Shadow
      if (sceneStr.includes('shadow') || sceneStr.includes('yinover') || sceneStr.includes('echo') || txtStr.includes('ינוור') || txtStr.includes('הצל') || txtStr.includes('קללה')) {
        this.applyMood('mystic-shadow');
        return;
      }

      // 6. Dark Room (Night Vignette)
      if (sceneStr.includes('room_intro') || txtStr.includes('חשוך') || txtStr.includes('כבד') || txtStr.includes('לילה') || txtStr.includes('מיטה')) {
        this.applyMood('dark-room');
        return;
      }

      // Default: Clean Daylight
      this.resetMood();
    }
  };
})();
