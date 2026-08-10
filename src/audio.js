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

if (music) {
  music.muted = window.isMusicMuted;
  music.volume = 0.45;
  music.loop = true;
}
if (sfx) {
  sfx.volume = 0.8;
}

/**
 * Plays a background music track, loops it, and respects the mute state.
 * Supports Hebrew audio filenames and spaces via safe URI encoding.
 * @param {string} src - Relative file path to the audio track.
 */
function playMusic(src) {
  if (!src || !music) return;

  const safeSrc = encodeURI(src);
  const currentAttr = music.getAttribute("src");

  if (!currentAttr || decodeURIComponent(currentAttr) !== decodeURIComponent(src)) {
    music.src = safeSrc;
    music.setAttribute("src", src);
  }

  music.muted = window.isMusicMuted;
  if (!window.isMusicMuted) {
    music.play().catch(() => {});
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

  const safeSrc = encodeURI(src);
  sfx.src = safeSrc;
  sfx.currentTime = 0;
  sfx.play().catch(() => {});
}

// Export functions to window
window.playMusic = playMusic;
window.playSfx = playSfx;
