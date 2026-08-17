// --- Modular Sound & Music Manager ---

const music = document.getElementById("music");
const sfxFallback = document.getElementById("sfx");

/**
 * Indicates whether background music playback is muted.
 * @type {boolean}
 */
window.isMusicMuted = localStorage.getItem("gameMusicMuted") === "true";

/**
 * Indicates whether game sound effects and voice synthesized blips are muted.
 * @type {boolean}
 */
window.isSfxMuted = localStorage.getItem("gameSfxMuted") === "true";

let currentMusicVol = parseInt(localStorage.getItem("gameMusicVol") || "50") / 100;
let currentSfxVol = parseInt(localStorage.getItem("gameSfxVol") || "80") / 100;

if (music) {
  music.muted = window.isMusicMuted;
  music.volume = currentMusicVol;
  music.loop = true;
}
if (sfxFallback) {
  sfxFallback.volume = currentSfxVol;
}

window.setMusicVolume = function(percent) {
  currentMusicVol = Math.max(0, Math.min(100, percent)) / 100;
  localStorage.setItem("gameMusicVol", String(percent));
  if (music) music.volume = currentMusicVol;
};

window.setSfxVolume = function(percent) {
  currentSfxVol = Math.max(0, Math.min(100, percent)) / 100;
  localStorage.setItem("gameSfxVol", String(percent));
  if (sfxFallback) sfxFallback.volume = currentSfxVol;
};

/**
 * Plays a background music track, loops it, and respects the mute state.
 * Supports Hebrew audio filenames, offline PWA cache, and local file:// protocols via dual fallback.
 * @param {string} src - Relative file path to the audio track.
 */
function playMusic(src) {
  if (!src || !music) return;

  const currentTrack = music.getAttribute("data-track-src");
  if (currentTrack === src && !music.paused) return;

  music.setAttribute("data-track-src", src);
  music.muted = window.isMusicMuted;
  music.volume = currentMusicVol;

  // Try encoded URI first
  const encodedSrc = encodeURI(src);
  music.src = encodedSrc;

  // If loading fails due to local Windows file:// protocol encoding mismatch, fallback to raw unencoded path
  music.onerror = () => {
    if (music.getAttribute("src") !== src) {
      music.src = src;
      if (!window.isMusicMuted) {
        music.play().catch(() => {});
      }
    }
  };

  if (!window.isMusicMuted) {
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented immediate playback until user interaction
      });
    }
  } else {
    music.pause();
  }
}

/**
 * Multi-instance sound effects player.
 * Creates a fresh Audio instance so sounds can overlap freely without cutting each other off.
 * @param {string} src - Relative file path to the sound effect.
 */
function playSfx(src) {
  if (!src || window.isSfxMuted) return;

  try {
    const sound = new Audio();
    sound.volume = currentSfxVol;
    const encodedSrc = encodeURI(src);
    sound.src = encodedSrc;

    sound.onerror = () => {
      if (sound.getAttribute("src") !== src) {
        sound.src = src;
        sound.play().catch(() => {});
      }
    };

    const p = sound.play();
    if (p !== undefined) {
      p.catch(() => {
        // Fallback to DOM sfx element
        if (sfxFallback) {
          sfxFallback.volume = currentSfxVol;
          sfxFallback.src = encodedSrc;
          sfxFallback.currentTime = 0;
          sfxFallback.play().catch(() => {});
        }
      });
    }
  } catch (e) {
    if (sfxFallback) {
      sfxFallback.volume = currentSfxVol;
      sfxFallback.src = encodeURI(src);
      sfxFallback.currentTime = 0;
      sfxFallback.play().catch(() => {});
    }
  }
}

// Export functions to window
window.playMusic = playMusic;
window.playSfx = playSfx;
