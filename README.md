# 🎮 ים דייט סימולטור (Yam Date Simulator) - Enterprise Architectural Masterpiece

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Vanilla%20JS-yellow?style=for-the-badge&logo=javascript" alt="Made With Vanilla JS" />
  <img src="https://img.shields.io/badge/Platform-PC%20%7C%20Mobile%20%7C%20Gamepad-orange?style=for-the-badge" alt="Platform Compatibility" />
  <img src="https://img.shields.io/badge/Offline--First-PWA%20v112-red?style=for-the-badge&logo=pwa" alt="PWA Offline First" />
  <img src="https://img.shields.io/badge/Haptics-Dual--Rumble-blueviolet?style=for-the-badge" alt="Gamepad Haptics" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
</p>

[English Architecture Summary](#-system-architecture-english-summary) | [תיעוד ארכיטקטורה מלא בעברית](#hebrew-architecture) | [סאגת בית הדין ופרק 2](#-סאגת-בית-הדין-ace-attorney--דין-תורה) | [מדריך מפתחים](#-מטריצת-רכיבים-ומנועים)

---

## ⚡ חשיפה בלעדית: פרק 2 בבית המשפט מגיע בקרוב! (Chapter 2 Coming Soon)

> [!IMPORTANT]
> 🔥 **עדכון ענק באופק: פרק 2 של בית הדין הגדול — "התביעה הנגדית של ים: סודות השאול וברית היוטיוב מ-2019"!**
>
> לאחר שפרק 1 של בית המשפט (`court.js`) שבר את הרשת עם הופעת הבכורה של **הרב ינוור בייט שליט"א** והשדה **ליליה**, פרק 2 יחשוף את התביעה הנגדית המטלטלת של ים, הגעתו של **התובע היריב החדש**, וסוד החוזה האפל מ-2019 שבו ים הבטיח לצאת לדייט עם שדה מהשאול בתמורה ל-100,000 סאבים ומגש בורקס חם למיטה!

---

## 🌎 System Architecture (English Summary)

**Yam Date Simulator** is an ultra-lightweight, zero-dependency visual novel and modular game engine developed and optimized by lead systems architect and engineer [InvarGervi123](https://github.com/InvarGervi123). Built as a high-performance Single Page Application (SPA), the system is engineered for zero-latency, cross-platform execution on low-spec mobile devices, laptops without a mouse, and desktop gamepad rigs.

### ⚡ Architectural Highlights:
* **No-Framework, Zero-Overhead Core:** Engineered entirely in Vanilla JS and CSS to eliminate heavy framework bundles (React/Vue/Angular), memory bloat, and virtual DOM diffing cycles.
* **Offline-First & Mobile PWA Streaming (`sw.js` v112):** Features a customized Service Worker implementing Stale-While-Revalidate caching alongside **HTTP 206 Partial Content Range streaming** and **Cache-Blob fallback extraction**, guaranteeing flawless audio and visual playback on mobile devices without an internet connection.
* **Universal Gamepad & Dual-Rumble Haptics Engine (`src/gamepad.js`):** HTML5 Gamepad API polling loop with native D-Pad/Analog choice navigation, button debouncing, and multi-pattern physical vibration haptics (EKG pulses, thunderclaps, slaps, and battle hits).
* **Dynamic Story Atmosphere & 5 Particle Engines (`src/atmosphere.js`):** Automatic narrative context scanner with 5 breathing visual mood filters (dark room, romantic warmth, cardiac danger, hospital fluorescent, mystic shadow) and 5 live particle systems (Burekas rain 🥐, Romantic hearts 💖, Heartbreak shatter 💔, Analytics drift 🔔, Thunder lightning flash ⚡).
* **Ace Attorney Rabbinical Court Saga (`src/court_engine.js`):** Standalone courtroom engine with 3D beveled nameplates, dynamic `התנגדות!` fullscreen cut-ins, interactive Court Record Binder (`📑 COURT RECORD`), Player HP/Penalty Bar (❗❗❗❗❗), and multi-stage cross-examinations.
* **Real-Time Wii Pulse EKG Engine (`src/wii_pulse_game.js`):** Live cardiac pulse meter syncing BPM (70-145+ BPM) to player story choices with realistic canvas graph draws, audio beeps, and gamepad vibrations.
* **Wolfenstein 3D CPU Raycaster (`src/baldi.js` & `src/baldi_renderer.js`):** Pure 2D Canvas raycaster with depth shading and BFS unstick heuristics, achieving 60FPS without WebGL overhead.
* **Dark Souls Space VR Combat Engine (`src/preg_game.js`):** Real-time boss battle loop featuring stamina-based blocking/dodging, 8 orbital phantom billboard sprites, dynamic oxygen-depletion blur filters, floating combat text, and sequence-based combo recipes.
* **Modular Settings & Hidden Submenu:** Instant controls for background contrast (70%-160%), music volume, SFX volume, typewriter speed, and OLED true-black `#000000` power saver.

---

<a id="hebrew-architecture"></a>

## 🛠️ ארכיטקטורת מערכת והנדסת תוכנה (Hebrew Architecture)

ברוכים הבאים לגרסת ה-Enterprise של **ים דייט סימולטור** שתוכננה, פותחה והונדסה מאפס על ידי מהנדס המערכת [ינוור (InvarGervi123)](https://github.com/InvarGervi123). 

המשחק מוכיח כיצד ניתן ליצור חוויית משחק עשירה, מורכבת וסוחפת ברמת AAA בעזרת טכנולוגיות Web טהורות (Vanilla JS & CSS) ללא ספריות חיצוניות כבדות, תוך שמירה על ביצועי שיא (60FPS חלק), צריכת זיכרון (RAM) מינימלית, ויציבות מוחלטת באופליין ובכל מערכת הפעלה.

```
+---------------------------------------------------------------------------------------+
|                                 YAM DATE SIMULATOR                                    |
|                            Enterprise Web Architecture                                |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   +-------------------+   +--------------------+   +------------------------------+   |
|   |  VISUAL NOVEL     |   |   BATTLE ENGINES   |   |   COURT & MINIGAMES          |   |
|   |  State Machine    |   |  - Deltarune 2D    |   |  - Ace Attorney Court Engine |   |
|   |  Story Splitting  |   |  - Baldi 3D Raycast|   |  - Real-Time Wii EKG Pulse   |   |
|   |  Choice Resolvers |   |  - Space VR Combat |   |  - Slender Horror 3D Maze    |   |
|   +---------+---------+   +---------+----------+   +--------------+---------------+   |
|             |                       |                             |                   |
|             +-----------------------+-----------------------------+                   |
|                                     |                                                 |
|                         +-----------v-----------+                                     |
|                         |    GLOBAL CONTEXTS    |                                     |
|                         |  battleCtx / baldiCtx |                                     |
|                         |  pregCtx / courtEngine|                                     |
|                         +-----------+-----------+                                     |
|                                     |                                                 |
|       +-----------------------------+-----------------------------+                   |
|       |                             |                             |                   |
|   +---v----------------+   +--------v---------+   +---------------v---------------+   |
|   |  GAMEPAD & HAPTICS |   | DYNAMIC ATMOSPHERE|  | AUDIO & MULTI-CHANNEL SFX     |   |
|   |  Dual-Rumble Loop  |   | 5 Moods & 5 FX   |   | Dual-Fallback + Cache Blob    |   |
|   |  Layout Agnostic   |   | Particles System |   | Web Audio Synthesizer         |   |
|   +--------------------+   +------------------+   +-------------------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                  PWA SERVICE WORKER v112 (OFFLINE CACHING)                    |   |
|   |         HTTP 206 Partial Content Range Streamer + Decoded URI Resolver        |   |
|   +-------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

## 🏛️ סאגת בית הדין (Ace Attorney / דין תורה)

אחד הנתיבים המפוארים והמורכבים ביותר במשחק הוא נתיב המשפט (`src/story/court.js` ו-`src/court_engine.js`):

### ⚖️ מאפייני מנוע בית המשפט:
1. **הדמויות והספרייטים הייעודיים**:
   * **הרב ינוור בייט שליט"א**: טוען רבני וסנגור אגדי (Phoenix Wright parody) בחליפת משי, שטריימל ופאות מתנפנפות (`ינוור החרדי.png`).
   * **התובעת: השדה ליליה (לילית)**: שדה עתיקה מהשאול שדורשת את הדייט שהובטח לה (`liliya.png`).
   * **הנאשם במיטה: ים שמואל**: עטוף בציציות ובשמיכה כבדה בדוכן העדים (`ים חרדי.png`).
   * **כבוד אב בית הדין (שופט AI)**: שופט אלגוריתמי עם פטיש קלוריות מפלדה.
2. **באנר "התנגדות!" מונפש במסך מלא (`images/backgrounds/התנגדות.png`)**:
   * מבזיק באנימציית מחץ עם פלש ברק, רעד מסך ורטט Dual-Rumble בשלט בכל צעקת `💥 !OBJECTION`.
3. **תיק מוצגים אינטראקטיבי (Court Record Binder)**:
   * כפתור זהב זוהר **`📑 מוצגים / COURT RECORD`** בראש המסך המאפשר לעיין ב-6 ראיות קורעות (דוח אנליטיקס 2024, יומן שינה ו-Deltarune, שטר משלוח בורקס מאורנית, חוזה המיטה, ושטר יששכר וזבולון המזויף) ולהציג אותן בזמן אמת (**PRESENT!**).
4. **מד חיים ופסילות (Player HP & Penalty Bar)**:
   * מד חיים של **100 HP** (5 סימני קריאה ❗❗❗❗❗). הצגת ראיה שגויה גוררת קנס ונזיפה. הגעה ל-0 HP מובילה לפסק דין **GAME OVER** והשלכה לבור הדיסקורד!
5. **עלילת 4 מערכות עמוקה עם חקירות נגדיות**:
   * **מערכה 1**: שקר 18 שעות העריכה ב-Premiere (חקירה על כל סעיף בנפרד + הצגת דוח 0 דקות רינדור).
   * **מערכה 2**: הגנת "שמירת הנפש משדים" ושטר יששכר וזבולון המזויף (חשיפת אימוג'י הבורקס בדיסקורד).
   * **מערכה 3**: ריבונות המיטה כ'עיר מקלט' באורנית (הוכחת מעמד המיטה כרכב משלוחים על 4 גלגלים).
   * **מערכה 4**: הטוויסט המרגש, שוחד הבורקס לשופט AI ו-4 סופים ייחודיים!

---

## 🎮 מנוע שלטים ורטט פיזי (Universal Gamepad & Dual-Rumble)

המשחק כולל מנוע בקרים ייעודי (`src/gamepad.js`) המספק תמיכה מלאה בכל שלט פיזי (Xbox, PlayStation DualShock/DualSense, Nintendo Switch Pro Controller או שלט Bluetooth/USB):
* **ניווט בתפריטים ובסיפור**: סטיק שמאלי ו-D-Pad לבחירת תשובות עם סימון זוהר.
* **מקשי פעולה**: מקש **A / ✖️** לאישור והמשך, מקש **B / ⭕** לביטול, מקש **Start** לפתיחת תפריט ההגדרות.
* **📳 רטט תחושתי כפול (Dual-Rumble)**:
  * **מד דופק (Wii Pulse)**: השלט רוטט בקצב הלב של הדמות בזמן אמת!
  * **התנגדויות, מכות וברקים**: רטט עוצמתי ברגעי שיא דרמטיים.
* **נוטיפיקציה אוטומטית**: חיווי ירוק ואלגנטי בעת חיבור או ניתוק שלט.

---

## 🎛️ תפריט הגדרות מיוחדות ותצוגה מתקדמת

פאנל ההגדרות (`⚙️`) כולל תת-תפריט נפתח (**`🎛️ הגדרות מיוחדות ותצוגה ▼`**) המאפשר התאמה אישית מלאה:
1. **🎨 ניגודיות מסך (Contrast Stepper)**: כוונון ניגודיות הרקעים והמשחק מ-`70%` עד `160%` בעזרת חצי `◀️` ו-`▶️`.
2. **🎵 עוצמת מוזיקה (Music Volume)**: שליטה מדויקת מ-`0%` עד `100%`.
3. **🔊 עוצמת אפקטים (SFX Volume)**: שליטה בעוצמת המכות, הקליקים והקולות.
4. **🔋 מצב חיסכון OLED**: כיבוי מוחלט של פיקסלים לצבע שחור `#000000` לחסכון סוללה.
5. **✨ אווירה ותאורה דינמית**: שליטה באפקטים של פילטרים חיים וגשם של בורקסים.

---

## 📱 אופטימיזציית שמע ו-PWA באופליין (Audio & Offline Engine)

בגרסה `v112`, מערך השמע נבנה מחדש כדי להבטיח ניגון חלק באופליין ובכל טלפון נייד:
1. **מענה לבקשות הזרמה של טלפונים (HTTP 206 Partial Content)**:
   טלפונים סלולריים דורשים תמיד כותרת `Range: bytes=0-`. ה-Service Worker פורס את ה-MP3 ומחזיר מענה 206 מותאם מה-Cache.
2. **טעינה כפולה מבוססת Blob**:
   אם נגן האודיו נתקל בחסימת מערכת קבצים מקומית, הפונקציה שולפת ישירות את קובץ ה-MP3 כ-`Blob` ומנגנת דרך `URL.createObjectURL`.
3. **השמעה רב-ערוצית (Multi-Instance SFX)**:
   אפקטים קוליים מנוגנים בערוצים עצמאיים המאפשרים השמעה חופפת של מספר קולות במקביל ללא חיתוך.

---

## 📊 מטריצת רכיבים ומנועים

| מודול / קובץ | תפקיד הנדסי | טכנולוגיה ומאפיינים |
|---|---|---|
| **`src/engine.js`** | מנוע הסימולטור הראשי | מנהל מצבים אסינכרוני, מעקב 91 סופים, תמיכה מלאה במקלדות עבריות. |
| **`src/court_engine.js`** | מנוע בית המשפט Ace Attorney | ניהול Court Record, מד חיים (HP), באנרים מונפשים וסופים משפטיים. |
| **`src/gamepad.js`** | מנוע שלטים ורטט | HTML5 Gamepad API, לולאת Polling, רטט Dual-Rumble Haptics. |
| **`src/atmosphere.js`** | מנוע אווירה וחלקיקים | 5 מצבי רוח דינמיים, 5 מערכות חלקיקים (בורקס, לבבות, ברקים, קומיקס). |
| **`src/audio.js`** | מנהל השמע והערוצים | תמיכה בקבצים בעברית, שליטה בווליום, מחלץ Blobs לשמע אופליין. |
| **`src/wii_pulse_game.js`** | מד דופק Wii EKG בזמן אמת | קנבס EKG חי, חישוב BPM משתנה, רטט שלט בקצב פעימות הלב. |
| **`src/baldi_renderer.js`** | מבוך 3D Raycasting | מנוע 3D טהור על גבי CPU Canvas ללא WebGL (חיסכון סוללה מוחלט). |
| **`src/battle_arena.js`** | זירת Bullet Hell של Deltarune | לולאת פיזיקה 60FPS עם חישובי Grazing ו-Collisions מדויקים. |
| **`src/preg_game.js`** | קרב הבוס בחלל (Space VR) | מנוע Stamina, מערכת קומבו רציפה, 8 רוחות מסתובבות והילת שלב 2. |
| **`sw.js`** | מנוע PWA ואופליין | Stale-While-Revalidate, פירוק Range 206, ושמירת כל הנכסים באופליין. |

---

## 🛠️ מבנה התיקיות המודולרי (File Structure)

```bash
├── index.html                  # דף הכניסה הראשי, מודאלים ושכבות המשחק
├── sw.js                       # מנוע ה-Service Worker PWA ואופליין קאשינג (v112)
├── manifest.json               # הגדרות התקנה כאפליקציית Standalone
├── css/                        # שכבת העיצוב
│   ├── main.css                # ממשק הסימולטור הראשי, טבלת סופים והגדרות
│   ├── court.css               # עיצוב בית הדין, תגיות 3D, תיק מוצגים ובאנר התנגדות
│   ├── atmosphere.css          # פילטרים חיים, אנימציות אווירה ומערכות חלקיקים
│   ├── battle.css              # עיצוב זירת הקרב של Deltarune ומדדי HP/TP
│   ├── baldi.css               # ממשק המבוך התלת-מימדי וכפתורי מגע
│   └── minigames.css           # שכבות מיני-משחקים ואפקטי רעידת מסך
├── images/                     # נכסים גרפיים ממוטבים (WebP/PNG)
│   ├── characters/             # ספרייטים (ים חרדי, ינוור החרדי, ליליה, בוס)
│   └── backgrounds/            # רקעים (בית משפט, חדר, התנגדות, לוגו מוסד)
├── audio/                      # נכסי שמע ממוטבים (21 קובצי MP3 בעברית ובאנגלית)
└── src/                        # קוד המקור הלוגי (Pure Vanilla JS)
    ├── engine.js               # מנוע ה-VN הראשי, חיבור הגדרות ומעבר סצנות
    ├── court_engine.js         # מנוע בית המשפט, תיק מוצגים ומד פסילות
    ├── gamepad.js              # מנוע שלטים ורטט פיזי (Dual-Rumble)
    ├── atmosphere.js           # מנוע אווירה דינמי, ניתוח טקסט וחלקיקים
    ├── audio.js                # מנהל שמע רב-ערוצי ותמיכה באופליין
    ├── wii_pulse_game.js       # מד דופק Wii EKG בזמן אמת
    ├── battle.js               # ממשק ותפריטי קרב Deltarune
    ├── battle_arena.js         # לולאת Dodging ופיזיקת קליעים
    ├── baldi.js                # לוגיקת מבוך באלדי וחישוב שגיאות
    ├── baldi_renderer.js       # מנוע Raycasting 3D (Pure CPU)
    ├── preg_game.js            # מנוע קרב החלל VR, קומבואים ו-Stamina
    ├── preg_game_renderer.js   # מנוע ציור 3D, חלקיקים והילות קרב
    └── story/                  # מאגר הדיאלוגים המפוצל
        ├── setup.js            # אתחול אובייקט הסיפור
        ├── main.js             # קו העלילה הראשי
        ├── court.js            # סאגת בית הדין פרק 1 (דין תורה)
        ├── special.js          # נתיבים מיוחדים והרפתקאות
        ├── polish_chocolate.js # נתיב ה-DLC: שוקולד פולני (פרקים 1-4)
        ├── yam_shadow_story.js # סאגת הצל: ינוור ו-THE ECHO
        └── endings.js          # הגדרות 91 הסופים הייחודיים
```

---

## ⌨️ מקשי ניווט, שלטים ומקלדת

המשחק תומך במלואו במשחק ללא עכבר ובשלטי משחק:
* **במקלדת (Laptop Friendly)**:
  * **העברת דיאלוגים:** `Space` או `Enter`.
  * **בחירת אפשרויות:** מקשי מספרים `1` עד `9`.
  * **פעולות בקרב:** מקשים `1` (Fight), `2` (Act), `3` (Item), `4` (Spare).
  * **סגירת תפריטים:** `Escape` או `Backspace`.
  * **ניווט נגישות:** מקשי `Tab` ו-`Shift+Tab`.
* **בשלט (Gamepad Controls)**:
  * **ניווט:** סטיק שמאלי / D-Pad.
  * **אישור ובחירה:** מקש `A` / `✖️`.
  * **ביטול / חזרה:** מקש `B` / `⭕`.
  * **הגדרות:** מקש `Start`.

---

### 📊 הסרת מעקב גוגל אנליטיקס (Google Analytics Removal)
אם ברצונך לבטל או להסיר את מעקב המשתמשים בעתיד, בצע את השלבים הבאים:
1. פתח את הקובץ [index.html](file:///c:/Users/User/Desktop/Bot%20discord/game/yam_date_simulator/index.html).
2. מחק את שורות הקוד של Google tag הממוקמות בראש ה-`<head>` (שורות 5 עד 13):
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-9E8NPTX7MT"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-9E8NPTX7MT');
   </script>
   ```
3. לאחר מכן, פתח את [sw.js](file:///c:/Users/User/Desktop/Bot%20discord/game/yam_date_simulator/sw.js) ושנה את שם ה-`CACHE_NAME` (למשל, העלה את הגרסה מ-`v31` ל-`v32`) כדי שהדפדפנים של השחקנים יורידו את העדכון מיד ללא מטמון ישן.

---

## 📄 רישיון (License)

פרויקט זה מופץ תחת רישיון **MIT**. הנך רשאי להשתמש, לשנות ולהפיץ קוד זה באופן חופשי לחלוטין (ראה קובץ [LICENSE](LICENSE) לפרטים המלאים).
