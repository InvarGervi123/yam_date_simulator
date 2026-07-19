// --- Modular Sound & Music Manager ---

const music = document.getElementById("music");
const sfx = document.getElementById("sfx");
const soundToggle = document.getElementById("soundToggle");
// Initialize audio state from localStorage (default to false / unmuted for new users)
let isMuted = localStorage.getItem("gameMuted") === "true";
if (localStorage.getItem("gameMuted") === null) {
  isMuted = false; // default to unmuted for public release
}
window.isMuted = isMuted;

if (music) music.muted = isMuted;
if (sfx) sfx.muted = isMuted;
if (soundToggle) soundToggle.textContent = isMuted ? "🔇" : "🔊";

// Toggle mute function
if (soundToggle) {
  soundToggle.onclick = () => {
    isMuted = !isMuted;
    window.isMuted = isMuted;
    localStorage.setItem("gameMuted", isMuted);
    
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
