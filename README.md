# 🎮 ים דייט סימולטור (Yam Date Simulator) - Enterprise Static Architecture

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Vanilla%20JS-yellow?style=for-the-badge&logo=javascript" alt="Made With Vanilla JS" />
  <img src="https://img.shields.io/badge/Platform-PC%20%7C%20Mobile-orange?style=for-the-badge" alt="Platform Compatibility" />
  <img src="https://img.shields.io/badge/Offline--First-PWA-red?style=for-the-badge&logo=pwa" alt="PWA Offline First" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
</p>

[English System Architecture](#-system-architecture-english-summary) | [תיעוד ארכיטקטורה בעברית](#hebrew-architecture)

---

## 🌎 System Architecture (English Summary)

**Yam Date Simulator** is an ultra-lightweight, zero-dependency visual novel and interactive simulation game engine. Designed as a high-performance, single-page application (SPA), the system is architected for zero-latency, cross-platform execution on both low-spec mobile and high-end desktop environments.

### ⚡ Architectural Highlights:
* **Offline-First & PWA Compliance:** Powered by a customized Service Worker (`sw.js`) implementing a **Stale-While-Revalidate** network cache strategy. Bypasses internet network round-trips for instant start-ups.
* **Wolfenstein-Style 3D Engine (CPU-Optimized):** Custom-built Wolfenstein 3D Raycaster using HTML5 2D Canvas context rendering. Avoids heavy WebGL overhead, reducing GPU temperatures and memory consumption on low-end mobile hardware. Includes a localized unstick fallback heuristic pathfinder.
* **No-Framework, Zero-Dependency Core:** Intentionally built without heavy front-end frameworks (like React, Angular, or Vue) to eliminate runtime overhead, virtual DOM cycles, and bulky bundle footprints. Written entirely in Vanilla JS and CSS, ensuring minimal battery consumption, zero framework latency, and near-instantaneous load times.
* **Cross-Protocol Compatibility:** Fully compliant with local sandboxing environments. Executes perfectly via standard web hosting (HTTPS) or directly from the file system (`file://` protocol) by bypassing service worker registration on localized runtimes.
* **State Serialization & Cache Durability:** System endings (90 distinct states) are tracked via locally stored cookie strings and serialized JSON records, maintaining state persistence across runtime updates.
* **Full Keyboard Navigation (Laptop-friendly):** Enables a complete mouse-free playthrough. Advance story dialogues with `Space` / `Enter`, select choices with numeric keys `1`-`9`, use numbers `1`-`4` for Deltarune battle actions, and `Backspace` / `Escape` to close sub-menus.

### 📸 Visual Previews

<p align="center">
  <img src="images/Boss_fight.png" width="600" alt="Deltarune Battle Arena Gameplay" />
  <br>
  <em>Deltarune-style Bullet Hell Battle Arena in action (PC & Mobile joystick overlay)</em>
</p>

### 🔧 Boilerplate & Engine Reusability (For Developers)

Even though the visual novel dialogs and storyline are localized in Hebrew, **the core gameplay engines are completely decoupled and modular**. You can easily fork this repository and reuse the modules for your own projects:
* **3D Wolfenstein Raycaster (`src/baldi.js` & `src/baldi_renderer.js`):** A standalone, canvas-based 3D engine. Perfect as a lightweight boiler for retro 3D maze games.
* **Deltarune Battle Engine (`src/battle.js` & `src/battle_arena.js`):** A fully customizable real-time 2D bullet hell arena with grazing registers, hit collision, and menu selectors.
* **PWA Offline Wrapper (`sw.js` & `manifest.json`):** Pre-configured template for caching assets offline with automatic Stale-While-Revalidate refresh logic.

### 🤝 Contributing & Support

Contributions, bug reports, and suggestions are welcome! 
* **Want to contribute?** Feel free to fork the repository, make changes, and open a Pull Request.
* **Support the project:** If you find this codebase or its engines helpful, please give it a ⭐ **Star** on GitHub to support free open-source game development!

### 🏷️ Repository Tags & Topics

`javascript` | `html5-canvas` | `raycaster` | `wolfenstein-3d` | `deltarune` | `bullet-hell` | `pwa` | `offline-first` | `gamedev` | `web-game` | `boilerplate` | `open-source`

---

<a id="hebrew-architecture"></a>

## 🛠️ ארכיטקטורת מערכת והנדסת תוכנה (Hebrew System Architecture)

ברוכים הבאים לגרסת ה-Enterprise של **ים דייט סימולטור**. המשחק תוכנן ונבנה מאפס תחת עקרונות הנדסת תוכנה מחמירים, תוך התמקדות בביצועי קצה, צריכת משאבים מינימלית (Zero-Overhead) ויציבות רשת מוחלטת (Offline-First Design).

### 🚀 עקרונות הנדסיים מנחים (Design Principles)

> [!IMPORTANT]
> **🖥️ תאימות חוצת-פלטפורמות מלאה (Cross-Platform Optimization):**
> המשחק מותאם למשאבי קצה מוגבלים ומריץ לולאות עיבוד מותאמות למסכי מגע בניידים (כולל שימוש ב-Haptic Feedback דרך ה-vibrate API של HTML5) ומחשבי PC (בעזרת ממשקי מקלדת ועכבר אסינכרוניים).

1. **החלטה ארכיטקטונית - ללא Frameworks (כמו React/Vue/Angular):**
   המשחק נבנה בכוונה תחילה **ללא שימוש ב-React, Vue או Angular** על מנת למנוע קבצי JavaScript כבדים, עומס על זיכרון המכשיר (RAM) ועיבוד מיותר של Virtual DOM. כל רכיבי המשחק נכתבו ב-Vanilla JS ו-CSS טהור, מה שמבטיח שקובצי המשחק יישארו קלים במיוחד, יטענו באופן מיידי ויחסכו בסוללה במכשירי קצה חלשים.
2. **אסטרטגיית מטמון אופליין חכמה (Offline-First / PWA):**
   בעזרת ה-Service Worker המקומי (`sw.js`), המשחק מבצע קאשינג מקומי אקטיבי של כל הנכסים הסטטיים בעת העלייה הראשונה. השימוש באסטרטגיית **Stale-While-Revalidate** מאפשר לטעון את המשחק באופן מיידי מזיכרון המטמון המקומי, תוך בדיקת עדכונים ברקע משרתי Edge (כמו Render CDN).
3. **מנוע גרפי תלת-מימדי קל-משקל (3D Raycasting Engine):**
   מיני-משחק התלת-מימד נבנה בעזרת טכניקת Raycasting קלאסית (בסגנון Wolfenstein 3D). המנוע מבצע את חישובי הטלת הקרניים וההצללה בזמן אמת על גבי ה-CPU ומצייר ישירות לקנבס 2D. הדבר חוסך את השימוש במאיצי WebGL כבדים, ובכך מונע התחממות מכשירים וצריכת סוללה מופרזת בניידים.
4. **עקיפת מגבלות CORS מקומיות (File-Protocol Bypass):**
   מערכת טעינת הסקריפטים נבנתה ללא מודולים של ES (ללא `import`/`export`), מה שמאפשר להריץ את המשחק ישירות מדאבל-קליק על קובץ ה-`index.html` המקומי (פרוטוקול `file://`) ללא צורך בהקמת שרת מקומי, תוך התגברות על מגבלות CORS מחמירות של דפדפנים מודרניים.
5. **אופטימיזציית זיכרון (RAM Footprint Optimization):**
   כל קבצי המולטימדיה נדחסו בצורה מקסימלית: תמונות בפורמט WebP יעיל וקבצי אודיו ב-MP3 עם Bitrate משתנה (VBR) המותאם לרמקולים של מכשירי קצה. נכסים אלו נשמרים ב-RAM רק בעת הצורך כדי למנוע דליפות זיכרון (Memory Leaks).

---

### 📊 מטריצת רכיבים וביצועים (Performance Matrix)

| רכיב / מודול | פתרון הנדסי | השפעה על ביצועים ומשאבים |
|---|---|---|
| **מנוע דיאלוגים (VN Engine)** | מנהל מצבים (State Machine) קל-משקל, אסינכרוני ומבוסס אירועים. | מונע Reflows וציורים מיותרים ב-DOM (0ms Render Blocking). |
| **מנתח טקסט להבעות** | מפענח רגולרי (Regex Matcher) בזמן אמת המתרגם מילות מפתח למצבי הבעה. | שינוי הבעות הבוס ב-0 השהייה באמצעות CSS transitions מואצי GPU. |
| **לוח מעקב סופים** | סריאליזציה של מערכים ושמירתם ב-Cookies וב-LocalStorage. | התמדה ושמירת נתונים מקומית ללא צורך במסד נתונים (Database-free persistence). |
| **מנוע קרב Deltarune** | לולאת פיזיקה בזמן אמת המפרידה בין זיהוי התנגשות (Collision) לרישום גילוח (Graze). | ריצה חלקה ב-60FPS יציב על קנבס HTML5 Canvas 2D. |
| **מבוך תלת-מימד Baldi** | Raycaster המבוסס על אופטימיזציית טריגונומטריה מקומית ואלגוריתם BFS לחילוץ אויב. | ניווט פיזיקלי של האויב ללא תקיעת מעבד, ללא דליפות מיקום בקירות. |
| **אופטימיזציית PWA** | רישום Service Worker מותנה פרוטוקול ותיקיית נכסים סטטית מוגדרת מראש. | תמיכה מלאה באופליין וטעינה מיידית מזיכרון המכשיר (Zero network requests). |

---

### 🛠️ ארכיטקטורת תיקיות הפרויקט (System File Hierarchy)

```bash
├── index.html          # דף הכניסה הראשי, רישום Service Worker מותנה פרוטוקול
├── sw.js               # Service Worker המנהל את מערך ה-Offline Caching
├── manifest.json       # הגדרות PWA להתקנה כאפליקציית standalone מקומית
├── css/                # שכבת העיצוב (Style Layer)
│   ├── main.css        # עיצוב כללי, ממשק ה-Visual Novel וגלריית סופים
│   ├── minigames.css   # רכיבים אינטראקטיביים משותפים ואפקטי רעידת מסך
│   ├── battle.css      # עיצוב זירת הקרב, מד ה-TP ואנימציות הבעות הבוס
│   └── baldi.css       # ממשק המבוג, מקלדת וירטואלית וכפתורי מובייל
├── images/             # נכסים גרפיים דחוסים (WebP/Optimized PNG)
├── audio/              # נכסי שמע ממוטבים (Variable Bitrate MP3)
└── src/                # קוד המקור הלוגי (Vanilla JS Modules)
    ├── audio.js        # מנהל השמע הראשי, מניעת זליגות וניהול ערוצים
    ├── minigames.js    # נתיבי ניתוב למיני-משחקים השונים
    ├── battle.js       # תפריטי קרב הבוס, ניהול מצבי רוח, מדדי HP/TP ופעולות ACT
    ├── battle_arena.js # לולאת Dodging, זיהוי פגיעות ולייזרים בזמן אמת
    ├── baldi.js        # מנהל מבוך באלדי, אינטראקציית טאבלט, חסינות מגן וחישוב שגיאות
    ├── baldi_renderer.js # מנוע ציור ה-Raycasting ותלת-המימד (Pure CPU Render)
    ├── engine.js       # מנוע ה-VN הראשי, ניהול שמירת סופים ומעברים אסינכרוניים
    └── story/          # בסיס נתוני העלילה המפוצל למניעת עומס קונטקסט
        ├── setup.js    # אתחול אובייקט הדיאלוגים
        ├── main.js     # קו העלילה הראשי (109 סצנות)
        ├── special.js  # נתיבי משנה מיוחדים (19 סצנות)
        ├── court.js    # סצנות משפט בסגנון Ace Attorney (6 סצנות)
        ├── battle.js   # דיאלוגים מלווי קרב בוס (5 סצנות)
        ├── baldi.js    # דיאלוגים ומבוא למבוך המתמטיקה (4 סצנות)
        └── endings.js  # הגדרות ומעקב 90 הסופים של המשחק (113 סצנות סוף)
```

---

### 🚀 פריסה והתקנה (Deployment & Local Execution)

#### פריסה ברשת (Cloud Web Hosting)
המשחק מותאם במיוחד לפריסה מהירה בשרתי **CDN סטטיים** (כמו Render Static Sites, GitHub Pages, או Cloudflare Pages):
1. חבר את מאגר ה-GitHub שלך ל-**Render**.
2. הגדר את הפרויקט כ-**Static Site**.
3. אין צורך בצעדי Build (אין `npm run build` כי אין framework כבד שצריך הידור) – השרת ינגיש את הקבצים ישירות ללקוח במהירות שיא.

#### הרצה מקומית (Offline Local Play)
1. הורד את קוד המקור למחשב.
2. לחץ דאבל-קליק על הקובץ `index.html`.
3. המשחק ייפתח מיידית בדפדפן ויעקוף את מגבלות ה-CORS ללא שום שגיאות אבטחה בקונסול!

#### ⌨️ מקשי ניווט ומקלדת (Laptop Keyboard Controls)
המשחק תומך במלואו במשחק ללא עכבר (מיועד ללפטופים):
* **העברת דיאלוגים:** מקש **רווח (Space)** או **אנטר (Enter)**.
* **בחירת אפשרויות בסיפור:** מקשי מספרים **`1` עד `9`**.
* **בחירת פעולה בקרב הבוס:** מקשים **`1`** (Fight), **`2`** (Act), **`3`** (Item), **`4`** (Spare).
* **בחירת פריטים/מיומנויות בקרב:** מקשי מספרים **`1` עד `9`**.
* **סגירת תפריטי קרב:** מקש **Escape** או **Backspace (מחיקה)**.
* **ניווט נגישות כללי (מקלדת):** ניתן להשתמש במקשים **Tab** ו-**Shift+Tab** כדי לעבור בצורה מחזורית בין כל הכפתורים האינטראקטיביים במשחק (עם סימון פוקוס אדום וגולש מודגש לעין).

---

## 📄 רישיון (License)

פרויקט זה מופץ תחת רישיון **MIT**. הנך רשאי להשתמש, לשנות ולהפיץ קוד זה באופן חופשי לחלוטין (ראה קובץ [LICENSE](LICENSE) לפרטים המלאים).
