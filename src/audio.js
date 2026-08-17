// --- Modular Sound & Music Manager ---

const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

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
if (sfx) {
  sfx.volume = currentSfxVol;
}

window.setMusicVolume = function(percent) {
  currentMusicVol = Math.max(0, Math.min(100, percent)) / 100;
  localStorage.setItem("gameMusicVol", String(percent));
  if (music) music.volume = currentMusicVol;
};

window.setSfxVolume = function(percent) {
  currentSfxVol = Math.max(0, Math.min(100, percent)) / 100;
  localStorage.setItem("gameSfxVol", String(percent));
  if (sfx) sfx.volume = currentSfxVol;
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
 * Plays a sound effect or voice beep immediately, if SFX is not muted.
 * Supports Hebrew audio filenames and spaces via safe URI encoding.
 * @param {string} src - Relative file path to the sound effect.
 */
function playSfx(src) {
  if (!src || !sfx || window.isSfxMuted) return;

  const encodedSrc = encodeURI(src);
  sfx.src = encodedSrc;
  sfx.currentTime = 0;

  sfx.onerror = () => {
    if (sfx.getAttribute("src") !== src) {
      sfx.src = src;
      sfx.currentTime = 0;
      sfx.play().catch(() => {});
    }
  };

  sfx.play().catch(() => {});
}

// Export functions to window
window.playMusic = playMusic;
window.playSfx = playSfx;
