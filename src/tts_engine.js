// --- Google Translate Voice Dubbing & Speech Engine for Yam Date Simulator ---
// מנוע דיבוב קולי חכם המשתמש בקול העברית הטבעי של Google Translate בדיוק כמו באתר גוגל תרגום!
// בלחיצה על הטקסט או באופן אוטומטי - הדיאלוג מושמע בעברית שוטפת וטבעית,
// עם התאמת מהירות וטון (Pitch & Rate) לכל דמות בנפרד!

(function() {
  'use strict';

  // State
  let ttsEnabled = localStorage.getItem("gameTts") !== "false";
  let ttsVolume = parseInt(localStorage.getItem("gameTtsVol") || "100") / 100;
  let ttsRateMultiplier = parseInt(localStorage.getItem("gameTtsRate") || "100") / 100;

  let currentAudio = null;
  let audioQueue = [];
  let isPlaying = false;
  let lastSpeaker = "";
  let lastRawText = "";
  let hasSpokenFirstScene = false;

  // 1. Generic Number-to-Hebrew converter
  // הופך ספרות למילים בעברית (למשל '40' ל'ארבעים') כדי שגוגל יבטא אותן בעברית מלאה
  function numberToHebrew(numStr) {
    const n = parseInt(numStr, 10);
    if (isNaN(n)) return numStr;
    if (n === 0) return "אפס";

    const ones = ["", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע"];
    const tens = ["", "עשר", "עשרים", "שלושים", "ארבעים", "חמישים", "שישים", "שבעים", "שמונים", "תשעים"];
    const teens = ["עשר", "אחת עשרה", "שתים עשרה", "שלוש עשרה", "ארבע עשרה", "חמש עשרה", "שש עשרה", "שבע עשרה", "שמונה עשרה", "תשע עשרה"];

    if (n === 40) return "ארבעים";
    if (n === 404) return "ארבע מאות וארבע";
    if (n === 2018) return "אלפיים ושמונה עשרה";
    if (n === 2019) return "אלפיים ותשע עשרה";
    if (n === 2021) return "אלפיים עשרים ואחת";
    if (n === 2024) return "אלפיים עשרים וארבע";
    if (n === 2028) return "אלפיים עשרים ושמונה";
    if (n === 2030) return "אלפיים ושלושים";
    if (n === 666) return "שש מאות שישים ושש";
    if (n === 5000) return "חמשת אלפים";
    if (n === 9000) return "תשעת אלפים";
    if (n === 10000) return "עשרת אלפים";

    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o > 0 ? " ו" + ones[o] : "");
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const rem = n % 100;
      let hStr = ones[h] + " מאות";
      if (h === 1) hStr = "מאה";
      if (h === 2) hStr = "מאתיים";
      return hStr + (rem > 0 ? " ו" + numberToHebrew(rem) : "");
    }
    return String(numStr);
  }

  // 2. Text Cleaner for Google Translate Speech
  function sanitizeForGoogleTts(rawText) {
    if (!rawText) return "";
    let str = String(rawText);

    // Remove markdown image references e.g. (invar.png)
    str = str.replace(/\([a-zA-Z0-9_\-]+\.(png|jpe?g|webp|gif)\)/gi, "");
    str = str.replace(/[a-zA-Z0-9_\-]+\.(png|jpe?g|webp|gif)/gi, "");

    // Technical / Gaming slang pronunciation
    str = str.replace(/\bAI\b/gi, "איי איי");
    str = str.replace(/\bRGB\b/gi, "אר ג'י בי");
    str = str.replace(/\bRTX\b/gi, "אר טי אקס");
    str = str.replace(/\bHP\b/gi, "אייץ' פי");
    str = str.replace(/\bDiscord\b/gi, "דיסקורד");
    str = str.replace(/\bYouTube\b/gi, "יוטיוב");
    str = str.replace(/\bWolt\b/gi, "וולט");
    str = str.replace(/\bMee6\b/gi, "מי סיקס");
    str = str.replace(/\bType-C\b/gi, "טייפ סי");
    str = str.replace(/\bBit\b/gi, "ביט");
    str = str.replace(/\bDeltarune\b/gi, "דלטארון");
    str = str.replace(/\bBaldi\b/gi, "באלדי");
    str = str.replace(/\bSlender\b/gi, "סלנדר");
    str = str.replace(/240Hz/gi, "240 הרץ");
    str = str.replace(/60Hz/gi, "60 הרץ");
    str = str.replace(/37°C/gi, "שלושים ושבע מעלות");
    str = str.replace(/180 מעלות/gi, "מאה ושמונים מעלות");
    str = str.replace(/14:00/g, "שתיים בצהריים");
    str = str.replace(/03:33/g, "שלוש שלושים ושלוש");

    // Expand attached prefix numbers: ל־40, ל-40, ב־40, מ־40
    str = str.replace(/([למבכשו])[\-־](\d+)/g, (match, pref, num) => {
      return pref + numberToHebrew(num);
    });

    // Expand numbers to Hebrew words
    str = str.replace(/\b(\d+)\b/g, (match, num) => numberToHebrew(num));

    // Acronyms
    str = str.replace(/שנ"צ/g, "שנץ");
    str = str.replace(/שו"ת/g, "שות");
    str = str.replace(/בד"ץ/g, "בדץ");
    str = str.replace(/ש"ח/g, "שקלים");

    // Remove emojis
    str = str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, "");

    // Remove markdown symbols (***, **, *, #, >, `, ~)
    str = str.replace(/[*_#>`~]/g, " ");

    // Remove bracket artifacts and cleanup spaces
    str = str.replace(/[\[\]{}()־]/g, " ");
    str = str.replace(/!{2,}/g, "!");
    str = str.replace(/\?{2,}/g, "?");
    str = str.replace(/\s+/g, " ").trim();

    return str;
  }

  // 3. Character Voice Profiles Matrix (PlaybackRate & Pitch Modulators)
  function getCharacterProfile(speaker) {
    const spk = (speaker || "").toLowerCase();

    // ים שמואל - ישנוני, איטי, טון נמוך ועצלן
    if (spk.includes("ים") || spk.includes("yam")) {
      return { rate: 0.85, pitchChange: true };
    }

    // ינוור החילוני (Invar Prime) - מהיר, היפראקטיבי, טון גיימר חד
    if (spk.includes("חילוני") || spk.includes("prime") || spk.includes("מודרטור") || spk.includes("קול רועם")) {
      return { rate: 1.24, pitchChange: true };
    }

    // הרב ינוור בייט שליט"א - טון תורני-תיאטרלי
    if (spk.includes("רב") || spk.includes("בייט") || spk.includes("חרדי") || spk.includes("טוען")) {
      return { rate: 0.94, pitchChange: true };
    }

    // ינוור כללי
    if (spk.includes("ינוור") || spk.includes("invar")) {
      return { rate: 1.15, pitchChange: true };
    }

    // השדה ליליה - פופ-סטאר, טון גבוה וקצבי
    if (spk.includes("ליליה") || spk.includes("liliya") || spk.includes("שדה")) {
      return { rate: 1.14, pitchChange: true };
    }

    // תמי - עדינה
    if (spk.includes("תמי") || spk.includes("tami")) {
      return { rate: 1.05, pitchChange: true };
    }

    // כבוד אב בית הדין / שופט AI - רובוטי, מעט איטי
    if (spk.includes("שופט") || spk.includes("בית הדין") || spk.includes("ai")) {
      return { rate: 0.88, pitchChange: true };
    }

    // שד הוולט מהגיהנום - שליח לחוץ
    if (spk.includes("וולט") || spk.includes("שליח") || spk.includes("wolt")) {
      return { rate: 1.20, pitchChange: true };
    }

    // האופה העליון של המולטיוורס - איטי, כבד ועמוק
    if (spk.includes("אופה") || spk.includes("עליון") || spk.includes("צל") || spk.includes("מסתורי") || spk.includes("???") || spk.includes("חירום")) {
      return { rate: 0.78, pitchChange: true };
    }

    // באלדי
    if (spk.includes("באלדי") || spk.includes("baldi")) {
      return { rate: 1.30, pitchChange: true };
    }

    // סלנדר
    if (spk.includes("סלנדר") || spk.includes("slender")) {
      return { rate: 0.74, pitchChange: true };
    }

    // ברירת מחדל / מספר - קול רגיל של גוגל תרגום
    return { rate: 1.0, pitchChange: false };
  }

  // 4. Split long dialogue into natural Google Translate TTS sentences (< 180 chars)
  function splitIntoSegments(text) {
    if (text.length <= 160) return [text];

    const sentences = text.split(/([.!?:;\n]+)/);
    const segments = [];
    let current = "";

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if ((current + part).length > 160) {
        if (current.trim()) segments.push(current.trim());
        current = part;
      } else {
        current += part;
      }
    }
    if (current.trim()) segments.push(current.trim());
    return segments.length > 0 ? segments : [text];
  }

  // 5. Build Google Translate TTS Audio URL
  function getGoogleTtsUrl(textSegment) {
    return "https://translate.google.com/translate_tts?ie=UTF-8&tl=he&client=tw-ob&q=" + encodeURIComponent(textSegment);
  }

  // 6. UI Indicator (Pulse on speaker button)
  function setUiSpeaking(active) {
    isPlaying = active;
    const btn = document.getElementById("btnTtsReplay");
    if (btn) {
      if (active) {
        btn.classList.add("speaking");
        btn.title = "עצור הקראה קולית (Google TTS)";
      } else {
        btn.classList.remove("speaking");
        btn.title = "השמע בדיבוב גוגל תרגום (לחץ להקראה)";
      }
    }
  }

  // 7. Play Queue
  function playNextInQueue(profile) {
    if (audioQueue.length === 0) {
      setUiSpeaking(false);
      currentAudio = null;
      return;
    }

    const nextSegment = audioQueue.shift();
    const url = getGoogleTtsUrl(nextSegment);

    try {
      const audio = new Audio(url);
      currentAudio = audio;

      // Apply character playback rate & pitch
      const finalRate = Math.max(0.6, Math.min(1.8, profile.rate * ttsRateMultiplier));
      audio.playbackRate = finalRate;

      // preservesPitch = false allows pitch to naturally shift higher/lower like character voice acting!
      if (profile.pitchChange) {
        audio.preservesPitch = false;
        if (audio.mozPreservesPitch !== undefined) audio.mozPreservesPitch = false;
        if (audio.webkitPreservesPitch !== undefined) audio.webkitPreservesPitch = false;
      }

      audio.volume = Math.max(0, Math.min(1, ttsVolume));

      audio.onplay = function() {
        setUiSpeaking(true);
      };

      audio.onended = function() {
        playNextInQueue(profile);
      };

      audio.onerror = function() {
        // If Google TTS fails (e.g. completely offline), fallback to browser Web Speech
        fallbackWebSpeech(nextSegment, profile);
        playNextInQueue(profile);
      };

      audio.play().catch(() => {
        fallbackWebSpeech(nextSegment, profile);
        playNextInQueue(profile);
      });
    } catch (e) {
      fallbackWebSpeech(nextSegment, profile);
      playNextInQueue(profile);
    }
  }

  // 8. Offline fallback using browser speech synthesis
  function fallbackWebSpeech(text, profile) {
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "he-IL";
      u.rate = profile.rate * ttsRateMultiplier;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // 9. Stop / Cancel speech
  function cancel() {
    audioQueue = [];
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    setUiSpeaking(false);
  }

  // 10. Main Speak Dialogue Function
  function speakDialogue(speaker, rawText) {
    if (!ttsEnabled) {
      cancel();
      return;
    }

    cancel();

    lastSpeaker = speaker || "";
    lastRawText = rawText || "";

    const cleanText = sanitizeForGoogleTts(rawText);
    if (!cleanText || cleanText.length < 2) return;

    const profile = getCharacterProfile(speaker);
    const segments = splitIntoSegments(cleanText);

    audioQueue = segments;
    setUiSpeaking(true);
    playNextInQueue(profile);
  }

  // 11. Replay current line
  function replayCurrent() {
    if (isPlaying) {
      cancel();
    } else if (lastRawText) {
      speakDialogue(lastSpeaker, lastRawText);
    }
  }

  // 12. Public API
  window.ttsEngine = {
    speakDialogue: speakDialogue,
    cancel: cancel,
    replayCurrent: replayCurrent,
    hasSpokenFirstScene: false,

    isEnabled: function() {
      return ttsEnabled;
    },

    setEnabled: function(val) {
      ttsEnabled = !!val;
      localStorage.setItem("gameTts", ttsEnabled);
      if (!ttsEnabled) {
        cancel();
      }
    },

    getVolume: function() {
      return Math.round(ttsVolume * 100);
    },

    setVolume: function(percent) {
      ttsVolume = Math.max(0, Math.min(100, Number(percent))) / 100;
      localStorage.setItem("gameTtsVol", Math.round(ttsVolume * 100));
      if (currentAudio) {
        currentAudio.volume = ttsVolume;
      }
    },

    getRate: function() {
      return Math.round(ttsRateMultiplier * 100);
    },

    setRate: function(percent) {
      ttsRateMultiplier = Math.max(50, Math.min(200, Number(percent))) / 100;
      localStorage.setItem("gameTtsRate", Math.round(ttsRateMultiplier * 100));
    }
  };

})();
