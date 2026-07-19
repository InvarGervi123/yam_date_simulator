// --- Modular Sound & Music Manager ---

const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

// Initialize states from localStorage (defaults to false / unmuted for new users)
window.isMusicMuted = localStorage.getItem("gameMusicMuted") === "true";
window.isSfxMuted = localStorage.getItem("gameSfxMuted") === "true";

if (music) {
  music.muted = window.isMusicMuted;
  music.volume = 0.45;
  music.loop = true;
}
if (sfx) {
  sfx.volume = 0.8;
}

function playMusic(src) {
  if (!src || !music) return;

  const current = music.getAttribute("src");
  if (current !== src) {
    music.src = src;
    music.setAttribute("src", src);
  }

  music.muted = window.isMusicMuted;
  if (!window.isMusicMuted) {
    music.play().catch(() => {});
  } else {
    music.pause();
  }
}

function playSfx(src) {
  if (!src || !sfx || window.isSfxMuted) return;

  sfx.src = src;
  sfx.currentTime = 0;
  sfx.play().catch(() => {});
}

// Export functions to window
window.playMusic = playMusic;
window.playSfx = playSfx;
