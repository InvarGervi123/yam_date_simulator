# 🎮 ים דייט סימולטור (Yam Date Simulator) - גרסת האסון הרומנטי המלאה

[English Overview](#-quick-overview-english) | [גרסה בעברית](#hebrew-version)

---

## 🌎 Quick Overview (English)

**Yam Date Simulator** is a hilarious, meme-filled interactive visual novel dating simulator where you attempt the impossible mission: convincing Yam to get out of bed and go on a date with you! 

Built with clean modular vanilla Javascript and CSS, featuring a 3D raycasting minigame, a real-time Deltarune-style bullet hell boss fight, dynamic facial expressions, mobile touch controls, and full offline caching support (PWA).

### Key Features:
* **90 Unique Endings:** Unlock and track endings in a built-in endings gallery saved locally via cookies.
* **Deltarune-style Boss Fight:** Dodge buses, warning lasers, and nutrition slop in a real-time bullet hell arena using keyboard or touch joystick controls.
* **3D Baldi's Basics Maze:** Explore a 3D Wolfenstein-style raycasted maze, solve math problems on a virtual tablet, and evade Yam's slapping ruler.
* **PWA & Offline Support:** Playable fully offline with Service Worker caching and installable directly on Android, iOS, and desktop home screens.
* **Zero Dependencies:** Pure vanilla JS/CSS/HTML - extremely lightweight, zero framework overhead, and instant load times.

### 📊 Game Features Matrix

| Feature / Component | Description | Tech Stack / Mechanics |
|---|---|---|
| **Visual Novel Engine** | Interactive narrative with branching paths, speaker names, choices, and background switches. | Custom state engine, pure HTML/CSS |
| **Dynamic Mood Expressions** | Yam (boss) reacts visually to dialogues based on mood tags (10 states). | Automatic regex text analyzer, CSS transition classes |
| **Endings Tracker Gallery** | Standalone dashboard showing all unlocked endings out of 90. | Local storage, `document.cookie`, reset actions |
| **Deltarune Battle Arena** | Real-time bullet hell combat with heart movement, grazing mechanics, and specials. | Canvas 2D engine, grazing warning ring, TP energy |
| **3D Baldi's Basics Maze** | 3D raycasted labyrinth, notebook collection, math quiz pad, and dynamic teacher chase. | Wolfenstein-style raycaster, unstick fallback pathfinding, i-frames |
| **PWA & Offline Support** | Standalone application installation, instant loading and full offline gameplay. | `sw.js` (Stale-While-Revalidate cache), `manifest.json` |
| **Vibration & Haptics** | Real-time physical haptic feedback when taking damage or hitting key endings. | HTML5 `navigator.vibrate` API |
| **Asset Optimization** | Minimal package size and low memory usage for mobile compatibility. | Compressed WebP sprites, optimized MP3 bitrates |

---

<a id="hebrew-version"></a>

## 🎮 ים דייט סימולטור (Yam Date Simulator) - תיאור בעברית

סימולטור דייטים אינטראקטיבי (Visual Novel) משוגע ומלא בהומור פנימי, המדמה את המשימה הבלתי אפשרית: לשכנע את ים לקום מהמיטה ולצאת איתך לדייט!

המשחק נבנה בצורה מודולרית ומעוצב בסגנון רטרו מודרני מרהיב, הכולל אפקטים מיוחדים, מוזיקה דינמית, משחקי מיני-גיימס מורכבים (כמו Baldi's Basics בדו-מימד וקרב בוס בסגנון Deltarune), ומעקב אחרי גלריית סופים ענקית.

---

## 🌟 תכונות מרכזיות (Features)

1. **עלילה ענפה עם 90 סופים ייחודיים!**
   * המשחק כולל 90 סופים שונים (מרומנטיים, דרמטיים, מטופשים ועד לסופים סודיים במיוחד).
   * **גלריית סופים מובנית:** לוח בקרה העוקב ושומר את כל הסופים שפתחת באמצעות Cookies (ניתן לאיפוס בכל שלב).
2. **קרב בוס אינטראקטיבי בסגנון Deltarune / Undertale:**
   * קרב Bullet Hell בזמן אמת עם תנועת לב חופשית (במקלדת או במגע בטלפון).
   * מכניקת **ACT** המבוססת על מצב הרוח המשתנה של ים (שמח, עצוב, כועס, עייף).
   * מתקפות אויב מיוחדות: קרני לייזר אזהרה ואוטובוסים דוהרים ברחבי הזירה.
   * מערכת ריפוי עצמי של ים המלווה באנימציית לעיסה מיוחדת (טונה עם נוטלה 🤮).
3. **מיני-משחק 3D Baldi's Basics:**
   * מנוע תלת-מימד Wolfenstein-style Raycaster שנבנה מאפס ב-HTML5 Canvas!
   * איסוף מחברות וחיפוש דלת היציאה 🚪 ברחבי מבוך קירות ודלתות.
   * טאבלט לימודי אינטראקטיבי (You Can Think! Pad) לפתרון שאלות מתמטיקה עם מקלדת וירטואלית מוגנת מהקלדות שגויות.
   * **מנגנון תאוצה לפי טעויות:** כל תשובה שגויה או פגיעה של ים מאיצה את קצב הצלפות הסרגל שלו ומגדילה את גודל הפסיעה שלו.
   * **סופים סודיים מותנים:** פתיחת הסוף ה-90 המלא (דרמת המשקל של ים) מתאפשרת רק אם הצלחת לסיים את מבוך התלת-מימד ב-0 תשובות נכונות **לאחר** שכבר פתחת את כל 89 הסופים האחרים במשחק!
4. **מערכת הבעות פנים דינמית לים:**
   * ים מגיב ויזואלית לכל משפט ומשנה את הבעות הפנים שלו (10 מצבי רוח שונים: ישנוני, כועס, מופתע, עצוב, רומנטי, שמח, חייזר, מובס ועוד) על פי ניתוח טקסט אוטומטי.
5. **תמיכה מלאה במובייל ורטט (Haptics):**
   * ממשק מותאם למסכי מגע עם ג'ויסטיק וכפתורים וירטואליים.
   * רטט פיזי במכשירים תומכים בעת קבלת מכות, הצלחות או סופים דרמטיים.

### 📊 מטריצת רכיבים ותכונות

| רכיב / תכונה | תיאור | טכנולוגיה / מכניקה |
|---|---|---|
| **מנוע נובל ויזואלי** | עלילה אינטראקטיבית עם פיצולי דרכים, תיבות דו-שיח, שינוי רקעים ובחירות. | מנוע מצבים עצמאי, HTML/CSS נקי |
| **מערכת הבעות דינמית** | ים (הבוס) משנה הבעת פנים בהתאם לטקסט ולסצנה (10 מצבי רוח שונים). | ניתוח טקסט אוטומטי, מחלקות CSS מונפשות |
| **לוח מעקב סופים** | גלריה פנימית המציגה ושומרת את כל הסופים שפתחת מתוך 90. | שמירה מקומית בדפדפן (`localStorage` / `Cookies`) |
| **זירת קרב Deltarune** | קרב קליעים (Bullet Hell) בזמן אמת, מכניקת ACT, טעינת TP וסופרים מיוחדים. | קנבס דו-מימד, הילת מגע (Graze), מגן בורקס וסאב-בוסט |
| **מבוך תלת-מימד Baldi** | מבוך קירות ואיסוף מחברות, פתרון מתמטיקה בטאבלט ומרדף מאיץ של באלדי. | מנוע Raycasting (Wolfenstein 3D), בינה מלאכותית חסינת היתקעות, חסינות פגיעה (I-Frames) |
| **תמיכת PWA ואופליין** | התקנת המשחק כאפליקציה בנייד ובמחשב וטעינה מיידית ללא חיבור לאינטרנט. | `sw.js` (מטמון Stale-While-Revalidate), `manifest.json` |
| **רטט ומגע (Haptics)** | רטט פיזי בנייד בעת פגיעה, הצלחה או הגעה לסופים דרמטיים. | ממשק HTML5 `navigator.vibrate` |
| **אופטימיזציית משאבים** | נפח הורדה מזערי וצריכת זיכרון (RAM) נמוכה לריצה חלקה בניידים חלשים. | דחיסת תמונות ל-WebP, סאונד בפורמט MP3 ממוטב |

---

## 🛠️ ארכיטקטורת הפרויקט (Project Structure)

הפרויקט בנוי תחת ארכיטקטורת קוד נקייה ומודולרית המפרידה לחלוטין בין העיצוב (CSS), הלוגיקה (JS) ומאגר העלילה (Story DB), ומותאם להרצה מקומית מלאה (תומך בפרוטוקול `file://` על ידי דאבל-קליק על `index.html` ללא צורך בשרת מקומי).

```bash
├── index.html          # נקודת הכניסה הראשית למשחק וממשק ה-HTML
├── LICENSE             # רישיון MIT מתירני לשימוש חופשי
├── css/                # קבצי העיצוב והסטייל (CSS)
│   ├── main.css        # עיצוב כללי, גלריית סופים ותפריטים
│   ├── minigames.css   # רכיבים אינטראקטיביים ואפקטים חזותיים
│   ├── battle.css      # זירת Deltarune, הלב, המכשולים ומדי החיים
│   └── baldi.css       # מנוע התלת-מימד, הטאבלט ומקשי המובייל
├── images/             # תמונות וגרפיקה (כולל הבעות פנים ואנימציות)
├── audio/              # מוזיקת רקע ואפקטים קוליים (SFX)
└── src/                # קוד המקור של המשחק (JavaScript)
    ├── audio.js        # מנהל הסאונד, מניעת זליגות וקרסאות אודיו
    ├── minigames.js    # נתיבי מעבר של מיני-משחקים (משיכות, גרירות)
    ├── battle.js       # מנוע הקרב הדינמי, בחירת תפריטים, חישובי HP/TP ומצבי רוח
    ├── battle_arena.js # זירת הקרב הפיזית בזמן אמת, קליעים, לייזרים וגילוחים
    ├── baldi.js        # מנהל משחק באלדי, פנקס השאלות, קצב צלפות וסופים סודיים
    ├── baldi_renderer.js # מנוע הציור בתלת-ממד של באלדי (Raycasting וגרפיקה)
    ├── engine.js       # מנוע ה-Visual Novel, שמירת סופים ב-Cookies וניהול סצנות
    └── story/          # מאגר הדיאלוגים המפוצל
        ├── setup.js    # הגדרת אובייקט ה-story הגלובלי
        ├── main.js     # העלילה המרכזית ונתיבי החדר (109 סצנות)
        ├── special.js  # נתיבי אורנית, תל אביב, דיזינגוף סנטר וכו' (19 סצנות)
        ├── court.js    # דיאלוגים של בית המשפט - Ace Attorney (6 סצנות)
        ├── battle.js   # דיאלוגים מלווים לקרב הבוס (5 סצנות)
        ├── baldi.js    # דיאלוגים ומבוא למיני-גיימ מתמטיקה (4 סצנות)
        └── endings.js  # הגדרות כל 90 הסופים של המשחק (113 סצנות סוף)
```

---

## 🚀 איך מפעילים את המשחק?

המשחק אינו דורש התקנה או שרת אינטרנט! 

1. הורד או חלץ את תיקיית המשחק למחשב.
2. לחץ דאבל-קליק על הקובץ `index.html` לפתיחה ישירה בכל דפדפן (Chrome, Edge, Firefox, Safari).
3. מומלץ לשחק עם סאונד מופעל לחוויה מקסימלית!

---

## 📱 אפליקציית PWA ואפשרות למשחק אופליין (Progressive Web App)

המשחק מותאם כעת בצורה מלאה כ-**PWA**, מה שמאפשר לו לרוץ ללא חיבור לאינטרנט גם לאחר סגירה מלאה של הדפדפן, ואף להיתקן כאפליקציה מקומית על הטלפון הנייד או המחשב!

### מאפיינים מרכזיים:
* **Service Worker (`sw.js`):** שומר אוטומטית במטמון (Cache) את כל קבצי ה-HTML, ה-CSS, קוד ה-JS, הגרפיקה והסאונדים בפעם הראשונה שהשחקן מבקר באתר. 
* **אסטרטגיית מטמון חכמה (Stale-While-Revalidate):** המשחק ייטען תמיד באופן מיידי מהזיכרון המקומי. אם יש אינטרנט, המערכת תבדוק ברקע אם העלית גרסה חדשה ל-Render ותוריד אותה אוטומטית לשימוש הבא, מבלי לפגוע בשמירות ובסופים שפתחת.
* **התקנה כאפליקציה (`manifest.json`):** משתמשים יכולים ללחוץ על כפתור ה-"+" או ה-"Install App" בדפדפן (במחשב או בנייד) כדי להוסיף קיצור דרך למסך הבית שלהם. המשחק ייפתח על מסך מלא, ללא שורת הכתובת של הדפדפן, ממש כמו אפליקציה טבעית (Native App).
* **תאימות מקומית:** קוד הרישום של ה-Service Worker בודק את הפרוטוקול ואינו מנסה להירשם בהרצה מקומית דרך `file://`, מה שמונע שגיאות אבטחה וכשלים כאשר שחקנים פותחים את הקובץ מקומית במחשב בדאבל-קליק.

---

## ⚡ אופטימיזציית זיכרון (RAM) ודחיסת מדיה

כדי להבטיח שהמשחק ירוץ בצורה חלקה גם על מחשבים ישנים וטלפונים ניידים חלשים, כל קבצי המדיה שאינם קוד או תיעוד טקסטואלי עברו אופטימיזציה ודחיסה קפדנית:
* **קובצי תמונות וגרפיקה:** כל הבעות הפנים, הרקעים והאנימציות נשמרים בפורמטים יעילים ודחוסים (כמו PNG ממוטב ו-WebP) כדי למנוע צריכת זיכרון עבודה (RAM) מופרזת בזמן פענוח התמונות בדפדפן.
* **קובצי אודיו ומוזיקה:** המוזיקה והאפקטים הקוליים (SFX) נשמרים בפורמט MP3 דחוס עם קצב נתונים (Bitrate) מאוזן, מה שחוסך רוחב פס רשת בזמן ההורדה הראשונית ומונע זליגת זיכרון עקב קבצי WAV או FLAC כבדים.

---

## 📄 רישיון (License)

פרויקט זה מופץ תחת רישיון **MIT**. הנך רשאי להשתמש, להעתיק, לשנות, להפיץ, למזג ולעשות כל שימוש בקוד זה באופן חופשי לחלוטין, כל עוד נשמרת שורת זכויות היוצרים המקורית (ראה קובץ [LICENSE](LICENSE) לפרטים המלאים).
