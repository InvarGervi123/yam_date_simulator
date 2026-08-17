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

// Cached Blob URL helper to guarantee mobile offline playback
async function tryPlayFromCacheBlob(mediaElem, src, isLoop = false) {
  if (!('caches' in window)) return false;
  try {
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      let response = await cache.match(encodeURI(src));
      if (!response) response = await cache.match(src);
      if (!response) {
        try { response = await cache.match(decodeURI(src)); } catch (e) {}
      }
      if (response) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        mediaElem.src = blobUrl;
        mediaElem.loop = isLoop;
        if (!window.isMusicMuted) {
          mediaElem.play().catch(() => {});
        }
        return true;
      }
    }
  } catch (err) {}
  return false;
}

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

  const encodedSrc = encodeURI(src);
  music.src = encodedSrc;

  music.onerror = async () => {
    if (music.getAttribute("src") !== src) {
      music.src = src;
      if (!window.isMusicMuted) {
        music.play().catch(() => {
          tryPlayFromCacheBlob(music, src, true);
        });
      }
    } else {
      tryPlayFromCacheBlob(music, src, true);
    }
  };

  if (!window.isMusicMuted) {
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        tryPlayFromCacheBlob(music, src, true);
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
        sound.play().catch(() => {
          tryPlayFromCacheBlob(sound, src, false);
        });
      } else {
        tryPlayFromCacheBlob(sound, src, false);
      }
    };

    const p = sound.play();
    if (p !== undefined) {
      p.catch(() => {
        if (sfxFallback) {
          sfxFallback.volume = currentSfxVol;
          sfxFallback.src = encodedSrc;
          sfxFallback.currentTime = 0;
          sfxFallback.play().catch(() => {
            tryPlayFromCacheBlob(sfxFallback, src, false);
          });
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
