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

  // DOM Container helper for particles
  function getParticleOverlay() {
    let container = document.getElementById('particleOverlay');
    if (!container) {
      const gameElem = document.getElementById('game');
      if (!gameElem) return null;
      container = document.createElement('div');
      container.id = 'particleOverlay';
      gameElem.appendChild(container);
    }
    return container;
  }

  // DOM Container helper for thunder flash
  function getThunderOverlay() {
    let container = document.getElementById('thunderFlashOverlay');
    if (!container) {
      const gameElem = document.getElementById('game');
      if (!gameElem) return null;
      container = document.createElement('div');
      container.id = 'thunderFlashOverlay';
      gameElem.appendChild(container);
    }
    return container;
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
        this.clearParticles();
      }
    },

    resetMood: function() {
      const container = document.getElementById('game');
      if (!container) return;
      MOOD_CLASSES.forEach(cls => container.classList.remove(cls));
    },

    clearParticles: function() {
      const overlay = document.getElementById('particleOverlay');
      if (overlay) overlay.innerHTML = '';
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

    // 1. Burekas Particle Rain
    spawnBurekasRain: function(count = 7) {
      if (!atmosphereEnabled) return;
      const overlay = getParticleOverlay();
      if (!overlay) return;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const p = document.createElement('div');
          p.className = 'particle-burekas';
          p.textContent = '🥐';
          p.style.left = `${Math.random() * 85 + 5}%`;
          p.style.animationDuration = `${Math.random() * 2 + 3}s`;
          overlay.appendChild(p);
          setTimeout(() => p.remove(), 5000);
        }, i * 300);
      }
    },

    // 2. Romantic Heart Sparkles
    spawnRomanticSparkles: function(count = 6) {
      if (!atmosphereEnabled) return;
      const overlay = getParticleOverlay();
      if (!overlay) return;

      const hearts = ['💖', '✨', '💕', '🌸'];
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const p = document.createElement('div');
          p.className = 'particle-heart';
          p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
          p.style.left = `${Math.random() * 80 + 10}%`;
          p.style.bottom = '10%';
          p.style.animationDuration = `${Math.random() * 1.5 + 2.5}s`;
          overlay.appendChild(p);
          setTimeout(() => p.remove(), 4000);
        }, i * 250);
      }
    },

    // 3. Heartbreak Shatter Particles
    spawnHeartbreak: function(count = 5) {
      if (!atmosphereEnabled) return;
      const overlay = getParticleOverlay();
      if (!overlay) return;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const p = document.createElement('div');
          p.className = 'particle-heartbreak';
          p.textContent = '💔';
          p.style.left = `${Math.random() * 70 + 15}%`;
          p.style.top = '30%';
          overlay.appendChild(p);
          setTimeout(() => p.remove(), 3500);
        }, i * 200);
      }
    },

    // 4. Discord & YouTube Analytics Notification Drift
    spawnAnalyticsDrift: function() {
      if (!atmosphereEnabled) return;
      const overlay = getParticleOverlay();
      if (!overlay) return;

      const items = ['🔔 +1 Sub!', '👁️ +1,000 Views', '💬 #ייעוץ-זוגי', '📈 CPM +40%', '🔥 LIVE'];
      const text = items[Math.floor(Math.random() * items.length)];

      const p = document.createElement('div');
      p.className = 'particle-analytics';
      p.textContent = text;
      p.style.right = `${Math.random() * 20 + 5}%`;
      p.style.bottom = '25%';
      overlay.appendChild(p);
      setTimeout(() => p.remove(), 4800);
    },

    // 5. Thunder & Lightning Flash
    triggerThunderFlash: function() {
      if (!atmosphereEnabled) return;
      const overlay = getThunderOverlay();
      if (!overlay) return;

      overlay.classList.remove('flash-active');
      void overlay.offsetWidth; // trigger reflow
      overlay.classList.add('flash-active');

      const gameElem = document.getElementById('game');
      if (gameElem) {
        gameElem.classList.add('effect-shake');
        setTimeout(() => gameElem.classList.remove('effect-shake'), 500);
      }
      setTimeout(() => overlay.classList.remove('flash-active'), 600);
    },

    // 6. Comic Action Slap & Impact Popups
    triggerComicImpact: function(customText) {
      if (!atmosphereEnabled) return;
      const overlay = getParticleOverlay();
      if (!overlay) return;

      const words = ['💥 BOOM!', 'POW!', 'שלאק!', '💥 BAM!', 'קראק!'];
      const text = customText || words[Math.floor(Math.random() * words.length)];

      const p = document.createElement('div');
      p.className = 'comic-impact-popup';
      p.textContent = text;
      overlay.appendChild(p);

      const gameElem = document.getElementById('game');
      if (gameElem) {
        gameElem.classList.add('effect-shake');
        setTimeout(() => gameElem.classList.remove('effect-shake'), 400);
      }

      setTimeout(() => p.remove(), 1000);
    },

    autoDetectStoryMood: function(text, sceneId, sceneObj) {
      if (!atmosphereEnabled) return;

      // Clear non-persistent particles on scene transition
      this.clearParticles();

      const sceneStr = String(sceneId || '').toLowerCase();
      const txtStr = String(text || '').toLowerCase();

      // Explicit scene.mood override
      if (sceneObj && sceneObj.mood) {
        this.applyMood(sceneObj.mood);
      } else if (sceneStr.includes('wii_pulse') || sceneStr.includes('heart_attack') || txtStr.includes('דופק') || txtStr.includes('התקף לב')) {
        this.applyMood('cardiac-danger');
      } else if (sceneStr.includes('flatline') || sceneStr.includes('icu') || txtStr.includes('בית חולים') || txtStr.includes('מיון') || txtStr.includes('אמבולנס')) {
        this.applyMood('hospital-fluorescent');
      } else if (sceneStr.includes('romantic') || sceneStr.includes('normal') || txtStr.includes('רומנטי') || txtStr.includes('חיבוק') || txtStr.includes('תמי')) {
        this.applyMood('romantic-warmth');
      } else if (sceneStr.includes('shadow') || sceneStr.includes('yinover') || sceneStr.includes('echo') || txtStr.includes('ינוור') || txtStr.includes('הצל')) {
        this.applyMood('mystic-shadow');
      } else if (sceneStr.includes('room_intro') || txtStr.includes('חשוך') || txtStr.includes('כבד') || txtStr.includes('לילה')) {
        this.applyMood('dark-room');
      } else {
        this.resetMood();
      }

      // --- Trigger Specific Effects Based On Content ---

      // Burekas Rain
      if (txtStr.includes('בורקס') || sceneStr.includes('burekas')) {
        this.spawnBurekasRain(6);
      }

      // Romantic Hearts
      if (sceneStr.includes('romantic') || txtStr.includes('רומנטי') || txtStr.includes('תמי') || sceneStr.includes('wii_romance_success')) {
        this.spawnRomanticSparkles(5);
      }

      // Heartbreak
      if (sceneStr.includes('wont_hug') || sceneStr.includes('analytics_depression') || txtStr.includes('מתה') || txtStr.includes('אין תקוה')) {
        this.spawnHeartbreak(4);
      }

      // Analytics Notifications
      if (txtStr.includes('ערוץ') || txtStr.includes('סאבים') || txtStr.includes('אנליטיקס') || txtStr.includes('דיסקורד')) {
        this.spawnAnalyticsDrift();
      }

      // Thunder Flash on Dramatic Speeches or Threats
      if (sceneStr.includes('dramatic') || sceneStr.includes('yinover_threat') || txtStr.includes('סוף העולם') || txtStr.includes('קליר')) {
        this.triggerThunderFlash();
      }

      // Comic Impact Slap on Physical Actions
      if (sceneStr.includes('drag_yam') || sceneStr.includes('steal_drawer') || txtStr.includes('בכוח') || txtStr.includes('לפרוץ')) {
        this.triggerComicImpact();
      }
    }
  };
})();
