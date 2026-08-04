// --- Story Chapter: Polish Chocolate - The Broken Contract (DLC Chapter 2: Archive of Lost Names) ---
Object.assign(window.story, {
  // --- Section 1: Entrance to Archive & Liron Encounter ---
  ch2_archive_entrance: {
    speaker: "המספר",
    background: "images/backgrounds/room.jpg",
    music: "audio/main.mp3",
    text: "📜 שוקולד פולני: החוזה השבור — פרק 2: ארכיון השמות האבודים\n\nינוור עומד מול השער העצום של ארכיון השמות האבודים.\nגלילי קלף מתוחים מעל תקרת הניאון, ואורות מוזהבים מאירים אלפי מדפים שמורים. לירון ממתין בצל הפתח בחיוך ממזר.\n\n'הגעת, ינוור,' אומר לירון בלחש. 'האולם הזה לא שומר רק חוזים תאגידיים... הוא שומר גם את השמות והזהויות שאנשים ויתרו עליהם כדי למחוק חובות. איך תרצה להמשיך?'",
    choices: [
      { text: "🤝 לסמוך על לירון ולצעוד בעקבותיו דרך פתח האוורור הסודי", next: "ch2_entrance_trust" },
      { text: "😠 לאיים על לירון שלא מעז לתכנן קומבינות מאחורי הגב", next: "ch2_entrance_threaten" },
      { text: "🚪 להיכנס לבד דרך השער הראשי ולהסתדר באופן עצמאי", next: "ch2_entrance_solo" }
    ]
  },

  ch2_entrance_trust: {
    speaker: "לירון",
    character: "images/characters/yam_curious.png",
    text: "ינוור מהנהן וצועד בעקבות לירון דרך מעבר מוזהב צר.\nלירון מחייך בסיפוק:\n'חכם מאוד, ינוור. המעבר הזה חוסך לנו את סורקי השמות בכניסה. בוא, המדפים המרכזיים שוכנים ממש כאן.'",
    next: "ch2_shelves_hub_init"
  },

  ch2_entrance_threaten: {
    speaker: "לירון",
    character: "images/characters/yam_angry.png",
    text: "ינוור צועד קדימה ומביט בלירון במבט חפור:\n'אם אתה מנסה לתכנן עלי קומבינה תאגידית, אתה תמצא את החוזה שלך קרוע לגזרים.'\nלירון מרים ידיים בהפתעה:\n'תרגע, ינוור! אנחנו באותו צד... בערך. בוא נתקדם למדפים.'",
    next: "ch2_shelves_hub_init"
  },

  ch2_entrance_solo: {
    speaker: "המספר",
    text: "ינוור מתעלם מלירון וצועד בנחישות דרך שער הארכיון הראשי.\nסורקי הניאון מהבהבים אך לא עוצרים אותו. לירון צועד מאחוריו וממלמל:\n'עקשן כרגיל... בסדר, בוא נראה מה תגלה במדפים.'",
    next: "ch2_shelves_hub_init"
  },

  // --- Section 2: The Three Shelves Hub ---
  ch2_shelves_hub_init: {
    speaker: "המספר",
    onEnter: function() {
      window._ch2ShelvesRead = window._ch2ShelvesRead || {};
    },
    text: "ינוור עומד במרכז אולם המדפים המוזהבים.\nשלושה מדפי קלף מרכזיים זוהרים באורות שונים. איזה מדף תחקור קודם?",
    choices: [
      { text: "📜 הרשומה של המשפחה (תיקייה #8492-B)", next: "ch2_shelf_family" },
      { text: "🔴 הרשומה על האיש בחליפה האדומה (סוכן החוזים)", next: "ch2_shelf_redsuit" },
      { text: "🦊 הרשומה על לירון (העבר והחובות הסודיים)", next: "ch2_shelf_liron" }
    ]
  },

  ch2_shelves_hub: {
    speaker: "המספר",
    text: "ינוור חוזר אל מרכז אולם המדפים המוזהבים.\nלאיזה מדף תרצה לפנות כעת?",
    choices: [
      { text: "📜 הרשומה של המשפחה (תיקייה #8492-B)", next: "ch2_shelf_family" },
      { text: "🔴 הרשומה על האיש בחליפה האדומה (סוכן החוזים)", next: "ch2_shelf_redsuit" },
      { text: "🦊 הרשומה על לירון (העבר והחובות הסודיים)", next: "ch2_shelf_liron" }
    ]
  },

  ch2_shelf_family: {
    speaker: "המספר",
    onEnter: function() {
      window._ch2ShelvesRead = window._ch2ShelvesRead || {};
      window._ch2ShelvesRead.family = true;
    },
    text: "ינוור מושך את גליל הקלף המוזהב #8492-B.\nהכתב הזוהר מתגלה:\n'החוזה המשפחתי לא נחתם בשביל להרוויח עושר או כוח, אלא כדי להסתיר נכס עתיק מעיני האוברלורדים התאגידיים!'\nחותם הדם מראה שהמעיל הכהה שימש ככספת ניידת להסתרת החותם המשפחתי.",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch2ShelvesRead || {}).length;
          return count >= 2 ? "ch2_major_revelation" : "ch2_shelves_hub";
        }
      }
    ]
  },

  ch2_shelf_redsuit: {
    speaker: "המספר",
    character: "images/characters/yam_curious.png",
    onEnter: function() {
      window._ch2ShelvesRead = window._ch2ShelvesRead || {};
      window._ch2ShelvesRead.redsuit = true;
    },
    text: "ינוור פותח את תיקיית האיש בחליפה האדומה.\nהרשומה חושפת: האיש בחליפה האדומה אינו סתם מוכר שוקולד, אלא סוכן חוזים ראשי של האוברלורדים! הוא רודף אחר המעיל הכהה מפני שהוא מאמין שהמעיל מחזיק במפתח השליטה באזור 'התפר'.",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch2ShelvesRead || {}).length;
          return count >= 2 ? "ch2_major_revelation" : "ch2_shelves_hub";
        }
      }
    ]
  },

  ch2_shelf_liron: {
    speaker: "לירון",
    character: "images/characters/yam_horny.png",
    onEnter: function() {
      window._ch2ShelvesRead = window._ch2ShelvesRead || {};
      window._ch2ShelvesRead.liron = true;
    },
    text: "ינוור שולף את התיקייה הסודית של לירון.\nלירון משתעל ומנסה לסגור אותה, אך הכתב גלוי: לירון היה בעבר חתום על חוזה תאגידי כבד, והוא משמש כמדריך בשוק רק כדי למחוק את חובותיו. הוא ידע חלק מזהות המעיל, אך לא את מלוא סודו!",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch2ShelvesRead || {}).length;
          return count >= 2 ? "ch2_major_revelation" : "ch2_shelves_hub";
        }
      }
    ]
  },

  // --- Section 3: The Major Revelation ---
  ch2_major_revelation: {
    speaker: "המספר",
    effect: "flash",
    text: "שלושת גלילי הקלף מתחברים מול עיניו של ינוור!\nהאמת הגדולה נחשפת במלואה:\n\n1. המעיל המשפחתי אינו נמצא בפולין — הוא עבר דרך מרחב נסתר שנקרא 'התפר' (האזור שבין המערכות התאגידיות).\n2. החוזה המשפחתי לא נחתם בשביל להרוויח כוח, אלא כדי להסתיר את זהותו של ינוור מהאוברלורדים.\n3. האיש בחליפה האדומה רודף אחר המעיל מפני שהוא מפתח השליטה ב'תפר', ולירון ניסה להשתמש במידע כדי לפדות את חובו!",
    next: "ch2_alarm_triggered"
  },

  // --- Section 4: The Alarm & The Split Decision ---
  ch2_alarm_triggered: {
    speaker: "לירון",
    effect: "redflash",
    character: "images/characters/yam_angry.png",
    text: "פתאום! אמיזות אדומות מציפות את האולם! צופרי הארכיון צורחים בחדות!\n'אזהרה: זיהוי חותם משפחתי #8492-B! סורקים תאגידיים בדרך!'\n\nלירון צועק בלחץ:\n'ינוור! הסורקים נעלו אותנו! אנחנו חייבים לברוח עכשיו! מה אתה עושה?!'",
    choices: [
      { text: "📜 לקחת את רשומת המשפחה ולפרוץ דרך חלון היציאה!", next: "end_ch2_family_record" },
      { text: "🧹 למחוק את הרישום של עצמו ממחשבי הארכיון ולברוח!", next: "end_ch2_deleted_name" },
      { text: "🕊️ להציל שם של נשמה לכודה מתא החוזים ולברוח יחד!", next: "end_ch2_saved_soul" }
    ]
  }
});
