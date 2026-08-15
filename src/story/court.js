// --- Story Chapter: COURT (Ace Attorney Phoenix Wright Parody - הרב ינוור בייט והשדה ליליה נגד ים שמואל) ---
Object.assign(window.story, {

  // ==========================================
  // פרולוג: פתיחת בית הדין וחשיפת השדה ליליה
  // ==========================================
  court_intro: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום!* 🔨\n\n'שקט בבית הדין הגדול לענייני שדים, דייטים ויוטיוב!\nהיום נפתח משפט המאה: מדינת ישראל והעולמות העליונים נגד ים שמואל!'\n\nטוען רבני ינוור בייט קם בסערה, לבוש חליפת משי שחורה, שטריימל מפואר וציציות מתנפנפות:\n'מוריי ורבותיי! שולחתי אינה אישה רגילה — היא שדה עתיקה מסוג ליליה (לילית)!\nהיא חתמה עם אבותיו של ים על ברית דייטים עתיקה, אך ים מסרב לצאת איתה ומתבצר במיטה!'",
    onEnter: function() {
      if (typeof playMusic === "function") playMusic("audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3");
      if (window.courtEngine) {
        window.courtEngine.resetCourt();
        window.courtEngine.triggerGavel();
      }
    },
    choices: [
      { text: "👑 להכריז: 'אני השדה ליליה ודורשת את הדייט שלי!'", next: "court_liliya_demand" },
      { text: "📜 לתת לינוור להציג את כתב התביעה המלא", next: "court_invar_opening" },
      { text: "📑 'ינוור, מה זה הכפתור הזוהר של תיק המוצגים למעלה?!'", next: "court_check_evidence_intro" }
    ]
  },

  court_liliya_demand: {
    speaker: "ליליה (השדה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "'חיכיתי 400 שנה בעולם התוהו בשביל דייט בורקס רומנטי! ואז אני מגיעה לכאן ורואה אדם שמחובר לשמיכה בריתוך חשמלי!'\n\nהשופט AI מסתכל עליך בעיון אלגוריתמי:\n'רגע אחד... למה יוצאות לך להבות סגולות מהעיניים ויש ריח של גופרית ופחמימות באולם?!'\n\nינוור קופץ ומכסה:\n'מחילה כבודו! זה בושם חדש מפריז! כעת לעדות הנאשם!'\n\nים מציץ מתוך השמיכה על דוכן העדים, חובש כיפה שחורה ומחזיק תהילים הפוך:\n'חל עליי דין פקוח נפש ועייפות מצווה! לא יצאתי לדייט כי עבדתי 18 שעות ביממה על עריכת סרטונים חדשים לערוץ!'",
    choices: [
      { text: "⚖️ להתחיל בחקירה הנגדית על שעות העריכה!", next: "court_act1_cross_exam" }
    ]
  },

  court_invar_opening: {
    speaker: "הרב ינוור בייט (טוען רבני)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור חובט בשולחן בעוצמה שמרעידה את אולם הדיונים:\n'כבוד הדיינים! הנאשם טוען לאליבי מפוברק! אין סרטונים, אין עריכות ואין דייטים! הכל בלוף כדי להמשיך לישון!'\n\nינוור לוחש לך:\n'שולחתי היקרה ליליה, שימי לב לכפתור הזוהר בראש המסך: 📑 מוצגים / COURT RECORD! הכנתי שם את כל הראיות המפלילות. נשתמש בהן בחקירה הנגדית!'\n\nהשופט AI מרים את הפטיש:\n'הנאשם, עמוד על רגליך והצג את עדותך!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.triggerGavel();
    },
    choices: [
      { text: "⚖️ לעבור לעדות הנאשם במיטה", next: "court_act1_cross_exam" }
    ]
  },

  court_check_evidence_intro: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור מצביע בהתלהבות למעלה על הכפתור הזוהר בזהב:\n\n'הנה תיק המוצגים (COURT RECORD) בראש המסך!\nאספתי שם את כל הראיות והשטרות החותכים:\n📜 דוח אנליטיקס עריכה 2024\n📱 יומן שינה וצפייה ב-Deltarune\n🥐 שטר משלוח בורקס מאורנית\n🛏️ חוזה בלעדיות עם המיטה\n\nבכל שלב בחקירה הנגדית תוכלי ללחוץ על הכפתור, לבחור ראיה וללחוץ על PRESENT כדי למוטט את שקרי הנאשם!'",
    choices: [
      { text: "מצוין! בוא נתחיל בחקירה הנגדית!", next: "court_act1_cross_exam" }
    ]
  },

  // ==========================================
  // מערכה 1: שקר 18 שעות העריכה (The 18-Hour Alibi)
  // ==========================================
  court_act1_cross_exam: {
    speaker: "ים שמואל (עדות הנאשם במיטה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "📜 עדות ים: 'הייתי עסוק בעריכה 24/7!' 📜\n\n1. 'אני יושב מול המחשב ועורך 18 שעות ביממה לשם שמיים!'\n2. 'המקלדת שלי בוערת מעריכת אפקטים מסובכים ב-Premiere!'\n3. 'אם ראו אותי משחק Deltarune, זה היה נטו לימוד קצב ובימוי!'\n4. 'הסרטונים מוכנים לחלוטין, לחצתי Render ורק חיכיתי לתוצאה!'",
    choices: [
      { text: "👉 PRESS: לחקור את סעיף 1 (18 שעות ביממה)", next: "court_press_act1_s1" },
      { text: "👉 PRESS: לחקור את סעיף 2 (המקלדת הבוערת ב-Premiere)", next: "court_press_act1_s2" },
      { text: "👉 PRESS: לחקור את סעיף 3 (לימוד Deltarune)", next: "court_press_act1_s3" },
      { text: "👉 PRESS: לחקור את סעיף 4 (כפתור ה-Render)", next: "court_press_act1_s4" },
      {
        text: "📑 PRESENT: להציג ראיה סותרת מתיק המוצגים!",
        next: "court_act1_present_menu"
      }
    ]
  },

  court_press_act1_s1: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור מצביע באצבע נוזפת:\n'18 שעות ביממה?! אפילו שרת הדיסקורד ישן יותר מזה! מתי בדיוק אכלת בורקס ומתי נשמת?'\n\nים מזיע מתחת לשמיכה:\n'אכלתי תוך כדי חיתוך פריימים! הבורקס שימש כמשקולת על מקש הרווח!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act1_cross_exam" }
    ]
  },

  court_press_act1_s2: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור זועק:\n'המקלדת בערה? תגיד לי ים, מה מקש הקיצור של חיתוך ב-Premiere Pro?!'\n\nים מגמגם:\n'אה... נו... Alt + F4 ואז תפילת הגומל?!'\n\nהשופט AI רושם הערת ביניים: 'תשובה מפוקפקת לחלוטין.'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act1_cross_exam" }
    ]
  },

  court_press_act1_s3: {
    speaker: "ליליה (השדה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ליליה פורסת כנפי צללים דמוניות:\n'שיחקת Deltarune בשביל בימוי?! אפילו בגיהנום לא שמעתי תירוץ כזה עקום!'\n\nים מתגונן:\n'זה פיתוח חשיבה אסטרטגית! לומדים שם להתחמק מדברים, בדיוק כמו שאני מתחמק מדייטים!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act1_cross_exam" }
    ]
  },

  court_press_act1_s4: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור מנופף בידיו:\n'חיכית ל-Render? כמה זמן לוקח לרנדר סרטון של 7 דקות?!'\n\nים עונה בביטחון מופרז:\n'בערך 8 חודשים. המאוורר שלי עובד על אנרגיה רוחנית!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act1_cross_exam" }
    ]
  },

  court_act1_present_menu: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "בחר איזו ראיה מתיק המוצגים ברצונך להציג כדי לנפץ את טענת 18 שעות העריכה:",
    choices: [
      {
        text: "📜 דוח אנליטיקס עריכה 2024 (0 דקות רינדור)",
        next: "court_act1_success"
      },
      {
        text: "🥐 שטר משלוח בורקס מאורנית",
        next: "court_act1_penalty_burekas"
      },
      {
        text: "🛏️ חוזה בלעדיות עם המיטה",
        next: "court_act1_penalty_bed"
      }
    ]
  },

  court_act1_penalty_burekas: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום!* 🔨\n'מה הקשר של שטר משלוח בורקס לשעות העריכה?! ראיה בלתי קבילה בעליל! קנס של 25 HP על ביזוי בית הדין!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(25, "בורקס שגוי");
    },
    choices: [
      { text: "חזרה לחקירה", next: "court_act1_cross_exam" }
    ]
  },

  court_act1_penalty_bed: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום!* 🔨\n'חוזה המיטה אינו סותר ישירות את טענת העריכה! אתם מבזבזים את זמן השיפוט האלגוריתמי! קנס 25 HP!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(25, "חוזה מיטה מוקדם");
    },
    choices: [
      { text: "חזרה לחקירה", next: "court_act1_cross_exam" }
    ]
  },

  court_act1_success: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור שולף את דוח ה-YouTube Studio הרשמי ומנופף בו מול פניו של ים!\n\n'התנגדות!!! הנה נתוני האמת: בשנת 2024 כולה הנאשם בילה בדיוק 0 דקות בעריכה, ו-4,000 שעות במשחק Deltarune במיטה!'\n\nים חוטף שוק חשמלי טוטאלי! הדמות שלו רועדת וקופצת לאחור:\n'לאאאאא! האנליטיקס הסודי שלי נחשף לעיני כל עם ישראל!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerObjection();
      }
    },
    choices: [
      { text: "⚖️ לעבור למערכה 2: הגנת ניסוי השינה וההסכם", next: "court_act2_cross_exam" }
    ]
  },

  // ==========================================
  // מערכה 2: הגנת 'שמירת הנפש' ושטר יששכר וזבולון
  // ==========================================
  court_act2_cross_exam: {
    speaker: "ים שמואל (עדות הנאשם - קו הגנה שני)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "📜 עדות ים: 'שמירת הנפש משדים והסכם יששכר וזבולון!' 📜\n\n1. 'ידעתי שליליה היא שדה מסוכנת, ושכבתי במיטה כהגנה הלכתית של שמירת הנפש!'\n2. 'שינה של 23 שעות ביממה היא מצוות פקוח נפש לפי כל גדולי הדור!'\n3. 'חתמתי עם ינוור על הסכם יששכר וזבולון בדיסקורד — הוא יערוך סרטונים ואני אישן!'\n4. 'יש לי צילום מסך רשמי המוכיח שינוור אישר לי לישון 40 שנה!'",
    choices: [
      { text: "👉 PRESS: לחקור את סעיף 1 (שמירת נפש משדה)", next: "court_press_act2_s1" },
      { text: "👉 PRESS: לחקור את סעיף 2 (מצוות 23 שעות שינה)", next: "court_press_act2_s2" },
      { text: "👉 PRESS: לחקור את סעיף 3 (הסכם יששכר וזבולון)", next: "court_press_act2_s3" },
      { text: "👉 PRESS: לחקור את סעיף 4 (צילום המסך מדיסקורד)", next: "court_press_act2_s4" },
      {
        text: "📑 PRESENT: להציג ראיה סותרת מתיק המוצגים!",
        next: "court_act2_present_menu"
      }
    ]
  },

  court_press_act2_s1: {
    speaker: "ליליה (השדה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ליליה צוחקת בקול רועם ומפתה:\n'שמירת נפש ממני?! הבאתי לך בורקס גבינה חם, לא מכת בכורות! למה לא יצאת איתי לדייט?!'\n\nים משיב:\n'הבורקס שלך היה פיתוי דמוני שנועד לגרום לי לצאת מהפיג'מה!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act2_cross_exam" }
    ]
  },

  court_press_act2_s2: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור פותח גמרא ענקית:\n'אין שום פוסק בעולם שמתיר 23 שעות שינה! בגמרא כתוב שינת צהריים עד חצי שעה, לא תרדמת חורף של דב קוטב!'\n\nים עונה:\n'אני מחמיר בשינה כמו שיטת החזון איש!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act2_cross_exam" }
    ]
  },

  court_press_act2_s3: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור זועק בזעם:\n'הסכם יששכר וזבולון זה בין לומדי תורה לבין מממנים! ממתי שינה במיטה זה לימוד תורה?!'\n\nים מחייך בעורמה:\n'אני חולם על דברי תורה בזמן שאני ישן, זה נחשב לימוד ברמת עומק!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act2_cross_exam" }
    ]
  },

  court_press_act2_s4: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור דורש:\n'הצג את צילום המסך לבית הדין עכשיו! מה בדיוק כתבתי לך שם?!'\n\nים מתחיל לגמגם:\n'זה... אממ... אימוג'י בורקס עם אימוג'י כרית... זה אומר בעצם היתר הלכתי גורף!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act2_cross_exam" }
    ]
  },

  court_act2_present_menu: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "בחר איזו ראיה מתיק המוצגים ברצונך להציג כדי לנפץ את טענת הסכם השינה המזויף:",
    choices: [
      {
        text: "📱 יומן שינה וצפייה בנייד (23.5 שעות שינה מתוכם שורטס של נמר הכסף)",
        next: "court_act2_success"
      },
      {
        text: "📑 שטר 'יששכר וזבולון' המזויף (חשיפת אימוג'י הבורקס המזויף)",
        next: "court_act2_success"
      },
      {
        text: "📜 דוח אנליטיקס עריכה 2024",
        next: "court_act2_penalty_repeat"
      }
    ]
  },

  court_act2_penalty_repeat: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום!* 🔨\n'דוח האנליטיקס כבר הוצג במערכה הקודמת! אין להציג ראיה כפולה ללא רלוונטיות! קנס 25 HP!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(25, "ראיה כפולה");
    },
    choices: [
      { text: "חזרה לחקירה", next: "court_act2_cross_exam" }
    ]
  },

  court_act2_success: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור שולף את יומן המכשיר הנייד של ים ואת לוג הדיסקורד המקורי!\n\n'התנגדות!!! אין שום הסכם ושום שמירת נפש! צילום המסך מוכיח ששלחתי לו 'תקום יא עצלן', והנייד שלו מראה שהוא צפה ברצף ב-400 שורטס של נמר הכסף באמצע הלילה!'\n\nהשופט AI דופק בפטיש:\n'הטענה נדחית בשאט נפש! הנאשם מואשם בזיוף מסמכי דיסקורד!'\n\nים נשבר וזועק: 'יש לי עוד טענה אחת בלתי מנוצחת! זכות המיטה הריבונית!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerObjection();
      }
    },
    choices: [
      { text: "⚖️ לעבור למערכה 3: קרב ריבונות המיטה ועיר המקלט", next: "court_act3_cross_exam" }
    ]
  },

  // ==========================================
  // מערכה 3: ריבונות המיטה כ'עיר מקלט'
  // ==========================================
  court_act3_cross_exam: {
    speaker: "ים שמואל (עדות הנאשם - קו הגנה אחרון)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "📜 עדות ים: 'המיטה היא עיר מקלט ריבונית באורנית!' 📜\n\n1. 'המיטה שלי הוכרזה כעיר מקלט הלכתית לפי תקנות הישוב אורנית!'\n2. 'שום שדה, אישה או בית דין לא יכולים לכפות דייט בתוך שטח קרקע פרטי!'\n3. 'חוזה הבלעדיות שלי עם השמיכה קודם לכל ברית דמונית עתיקה!'\n4. 'המיטה היא נכס מקרקעין קבוע שאינו ניתן להזזה או פינוי!'",
    choices: [
      { text: "👉 PRESS: לחקור את סעיף 1 (עיר מקלט באורנית)", next: "court_press_act3_s1" },
      { text: "👉 PRESS: לחקור את סעיף 2 (אי-כפיית דייט בקרקע פרטית)", next: "court_press_act3_s2" },
      { text: "👉 PRESS: לחקור את סעיף 3 (חוזה השמיכה)", next: "court_press_act3_s3" },
      { text: "👉 PRESS: לחקור את סעיף 4 (נכס מקרקעין קבוע)", next: "court_press_act3_s4" },
      {
        text: "📑 PRESENT: להציג את הראיה המכרעת שמפילה את המיטה!",
        next: "court_act3_present_menu"
      }
    ]
  },

  court_press_act3_s1: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור צוחק בביטול:\n'עיר מקלט זה רק לרוצח בשגגה, לא ליוטיובר שמתעצל להסתרק!'\n\nים משיב:\n'אני רצחתי בשגגה את המוטיבציה של הערוץ, לכן מגיע לי מקלט!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act3_cross_exam" }
    ]
  },

  court_press_act3_s2: {
    speaker: "ליליה (השדה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ליליה מרימה גבה שחורה:\n'קרקע פרטית? המיטה הזו תופסת את כל החדר, אי אפשר אפילו להכניס שקית בורקס!'\n\nים אומר:\n'זה שטח טריטוריאלי עצמאי, אפילו השופט AI צריך דרכון כדי לדפוק בפטיש!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act3_cross_exam" }
    ]
  },

  court_press_act3_s3: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור נוזף:\n'חוזה השמיכה נחתם ללא עדים כשרים! השמיכה שלך לא יכולה לחתום בשום בית דין!'\n\nים מתעקש:\n'הכרית שימשה כעד נאמן ומומחה!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act3_cross_exam" }
    ]
  },

  court_press_act3_s4: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור מתקרב למיטה ובוחן את הבסיס שלה בעיון רב:\n'נכס מקרקעין קבוע?! רגע אחד... מה יש פה מתחת למצעים?!'\n\nים מחוויר: 'אל תסתכל לשם! זה סוד ביטחוני של אורנית!'",
    choices: [
      { text: "🔙 חזרה לסעיפי העדות", next: "court_act3_cross_exam" }
    ]
  },

  court_act3_present_menu: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "בחר מתיק המוצגים את הראיה שתמוטט לחלוטין את טענת ריבונות המיטה:",
    choices: [
      {
        text: "🥐 שטר משלוח בורקס מאורנית (הוכחה שהמיטה היא רכב ממונע על גלגלים!)",
        next: "court_act3_success"
      },
      {
        text: "🛏️ חוזה בלעדיות עם המיטה (סעיף 4ג מתיר דייט במקרה בורקס)",
        next: "court_act3_success"
      },
      {
        text: "📱 יומן שינה וצפייה בנייד",
        next: "court_act3_penalty"
      }
    ]
  },

  court_act3_penalty: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום!* 🔨\n'יומן השינה אינו קשור למעמדה המשפטי של המיטה! קנס של 30 HP על בלבול בית הדין!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(30, "ריבונות מיטה שגויה");
    },
    choices: [
      { text: "חזרה לחקירה", next: "court_act3_cross_exam" }
    ]
  },

  court_act3_success: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "ינוור מצביע בדרמטיות מחשמלת על גלגלי המיטה וחושף את שטר המשלוח של מאפיית אורנית!\n\n'קבל את זה! (TAKE THAT!) 💥\nהמיטה הזו אינה מקרקעין ואינה עיר מקלט! יש לה 4 גלגלים, והיא רשומה במשרד הרישוי כרכב משלוחי בורקס ממונע!\nלפיכך, לשדה ליליה יש סמכות שיפוט מלאה לגרור את המיטה ישירות לדייט!'\n\nים תופס את ראשו בצרחה היסטרית: 'אוי ויי! המיטה שלי איבדה את החסינות הדיפלומטית!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerObjection();
      }
    },
    choices: [
      { text: "⚖️ לעבור למערכה 4: הטוויסט המרגש ופסק הדין הסופי!", next: "court_act4_grand_finale" }
    ]
  },

  // ==========================================
  // מערכה 4: הטוויסט המרגש והכרעת הדין
  // ==========================================
  court_act4_grand_finale: {
    speaker: "ים שמואל (הווידוי הגדול)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ים מוריד את השמיכה לאט, עיניו דומעות מול השדה ליליה ובית הדין:\n\n'האמת היא... שידעתי שאת שדה עתיקה ומדהימה מהרגע הראשון!\nלא ברחתי כי אני שונא אותך, ברחתי מתוך חרדת ביצוע רומנטית איומה! פחדתי שלא תאהבי את הבורקס שלי, פחדתי שהערוץ שלי ייכשל, ופחדתי מהדייט הראשון!'\n\nאולם בית הדין קופא בדממה מרגשת. אפילו לשופט AI יש דמעה של שמן מכונות על המסך.",
    choices: [
      { text: "💍 להציע חופת בורקס ושדים (הסוף הרומנטי-דמוני המושלם!)", next: "end_court_demon_wedding" },
      { text: "📜 לדרוש גזר דין: מאסר בישיבת ינוור באורנית!", next: "end_court_invar_yeshiva" },
      { text: "🥐 לשחד את השופט AI בבורקס ולראות את התוהו ובוהו המשפטי", next: "end_court_bribe" },
      { text: "🛏️ להכריז על רפובליקת המיטה העצמאית של ים", next: "end_court_bed_republic" }
    ]
  },

  // ==========================================
  // סופים ייחודיים לבית הדין
  // ==========================================
  end_court_demon_wedding: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/בואי תמי (גרסא לדייטים).mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "🔨 *בום! פסק דין סופי!* 🔨\n\n'בית הדין גוזר חופת בורקס מידית! ים שמואל והשדה ליליה יצאו לדייט נצחי, המיטה תהפוך לרכב לחופה, וינוור יקבל 50% מהסאבים!'\n\nים מחייך באושר, קם מהמיטה לראשונה מזה 40 שנה, ומחזיק את ידך.\nקול שופר של בורקס מהדהד בשמיים!\n\n🏆 סוף 88: חופת שדים, בורקס ורומנטיקה נצחית!",
    end: true
  },

  end_court_invar_yeshiva: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "🔨 *פסק דין: מאסר תורני!* 🔨\n\n'הנאשם נדון ל-3 שנות לימוד עריכה אינטנסיבית בישיבת ינוור באורנית, ללא שמיכה וללא גישה ל-Deltarune!'\n\nים מובל באזיקי קלוריות אל עבר חדר העריכה באורנית.\nהצדק נעשה, אם כי הערוץ עדיין לא העלה סרטון.\n\n🏆 סוף 89: מאסר עולם בישיבת ינוור באורנית!",
    end: true
  },

  end_court_bribe: {
    speaker: "השופט AI (קריסת מערכות)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "אתה מניח מגש של 40 בורקסים חמים ונוטפי שומן מול מצלמת השופט AI!\n\n*ביפ בופ... שגיאת קלט קטלנית! פחמימות מפתות מדי! אובדן שפיות אלגוריתמית!*\n\nהשופט AI מתחיל לדפוק בפטיש לכל עבר, פוסק שכל אזרחי ישראל חייבים לצאת לדייט בתוך המיטה, ומזכה את כל הנאשמים בעולם!\n\n🏆 סוף 90: התוהו ובוהו המשפטי הגדול של מאפיית אורנית!",
    end: true
  },

  end_court_bed_republic: {
    speaker: "ים שמואל (נשיא המיטה)",
    music: "audio/גישה פיזית ודרמטית.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ים מניף דגל של שמיכה צהובה ומכריז:\n\n'אני מסרב לקבל את סמכות בית הדין ומכריז בזאת על הקמת רפובליקת המיטה העצמאית! הכרית היא שרת החוץ, והסדין הוא שר הביטחון!'\n\nהוא מתגלגל עם המיטה החוצה מבית המשפט לעבר השקיעה של אורנית.\n\n🏆 סוף 91: רפובליקת המיטה הריבונית של ים!",
    end: true
  },

  // Game Over: HP Exhaustion
  end_courtroom_guilty_gameover: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/game_over.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום!* 🔨\n\n'ה-HP של התביעה הגיע לאפס! הראיות שהוצגו היו מביכות ומלאות בלבול הלכתי!\nבית הדין פוסק: הנאשם ים זכאי מחמת ביזיון התביעה, והשדה ליליה מושלכת לבור הדיסקורד ל-400 שנה נוספות!'\n\n❌ GAME OVER: אשמה בביזיון בית הדין!",
    end: true
  }

});
