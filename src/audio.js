// --- Modular Sound & Music Manager ---

const music = document.getElementById("music");
const sfx = document.getElementById("sfx");
const soundToggle = document.getElementById("soundToggle");
let isMuted = true;

// Initialize audio as muted by default
if (music) music.muted = true;
if (sfx) sfx.muted = true;
if (soundToggle) soundToggle.textContent = "🔇";

// Toggle mute function
if (soundToggle) {
  soundToggle.onclick = () => {
    isMuted = !isMuted;
    if (music) music.muted = isMuted;
    if (sfx) sfx.muted = isMuted;
    soundToggle.textContent = isMuted ? "🔇" : "🔊";
    triggerVibration(20);
    
    if (!isMuted && music && music.src) {
      music.play().catch(() => {});
    }
  };
}

function playMusic(src) {
  if (!src || !music) return;

  const current = music.getAttribute("src");
  if (current !== src) {
    music.src = src;
    music.setAttribute("src", src);
    music.volume = 0.45;
    music.loop = true;
  }

  music.play().catch(() => {});
}

function playSfx(src) {
  if (!src || !sfx) return;

  sfx.src = src;
  sfx.volume = 0.8;
  sfx.currentTime = 0;
  sfx.play().catch(() => {});
}
