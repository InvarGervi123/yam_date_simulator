let currentScene = "start";

const bg = document.getElementById("background");
const character = document.getElementById("character");
const speaker = document.getElementById("speaker");
const text = document.getElementById("text");
const choices = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

const DEFAULT_BG = "images/room.jpg";
const DEFAULT_CHARACTER = "images/yam.png";

function fileExistsFallbackImage(img, src) {
  if (!img || !src) {
    if (img) img.style.display = "none";
    return;
  }

  img.onerror = () => {
    img.style.display = "none";
    img.removeAttribute("src");
  };

  img.onload = () => {
    img.style.display = "block";
  };

  img.src = src;
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

function clearChoices() {
  choices.innerHTML = "";
}

function addChoice(label, nextScene) {
  const btn = document.createElement("button");
  btn.className = "choiceBtn";
  btn.textContent = label;
  btn.onclick = () => showScene(nextScene);
  choices.appendChild(btn);
}

function showScene(id) {
  const scene = story[id];

  if (!scene) {
    speaker.textContent = "שגיאה";
    text.textContent = "הסצנה לא קיימת: " + id;
    clearChoices();
    nextBtn.style.display = "block";
    nextBtn.textContent = "חזרה להתחלה";
    nextBtn.onclick = () => showScene("start");
    return;
  }

  currentScene = id;

  const bgSrc = scene.bg === false ? "" : (scene.bg || DEFAULT_BG);
  const charSrc = scene.character === false ? "" : (scene.character || scene.characterImage || DEFAULT_CHARACTER);

  fileExistsFallbackImage(bg, bgSrc);
  fileExistsFallbackImage(character, charSrc);

  speaker.textContent = scene.speaker || "";
  text.textContent = scene.text || "";
  clearChoices();

  if (scene.music) playMusic(scene.music);
  if (scene.sfx) playSfx(scene.sfx);

  if (scene.end) {
    nextBtn.style.display = "none";
    addChoice("לשחק שוב מההתחלה", "start");
    return;
  }

  if (scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    scene.choices.forEach(choice => addChoice(choice.text, choice.next));
    return;
  }

  if (scene.next) {
    nextBtn.style.display = "block";
    nextBtn.textContent = scene.nextText || "המשך";
    nextBtn.onclick = () => showScene(scene.next);
  } else {
    nextBtn.style.display = "none";
  }
}

showScene("start");
