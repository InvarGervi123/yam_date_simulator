// --- Story Chapter: COURT CHAPTER 3 (פרק 3: מדינת ישראל והדיסקורד נ' ים שמואל) ---
// תיק מספר 3: פרשת שירי המחאה הפוליטיים והמזרן הריבוני של אורנית!
// סנגור ראשי: ינוור (בסיוע טרמינל סייבר, לוגים וצילומי מסך)
// נאשם: ים שמואל (מעיד ישירות מתוך הפוך של דוכן העדים הריבוני)
// תביעה: התובע הראשי של הדיסקורד ומחאת הפוליטיקה
// כולל אנימציות CSS ייחודיות מותאמות מובייל: מיטת עדים שכבתית, אקולייזר אודיו, טרמינל סנגוריה, חבטות שולחן ו-Objection!

Object.assign(window.story, {

  // ==========================================================
  // פרק 3 - מערכה א': פתיחת הדיון בפרשת השירים הפוליטיים
  // ==========================================================
  court_ch3_intro: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום! שקט מוחלט באולם בית הדין הגדול!* 🔨\n\n'בית הדין הגדול לענייני שדים, פחמימות ואינטרנט מתכנס לדיון חירום בתיק מספר 3!\nעל סדר היום: תביעת הענק של מדינת ישראל, מועצת אורנית וקהילת הדיסקורד כנגד היוצר ים שמואל!'\n\nהשופט מסתכל סביב במבוכה אלגוריתמית:\n'רגע... איפה הנאשם?! למה יש קולות נחירה עמוקים מתוך דוכן העדים?!'",
    onEnter: function() {
      if (typeof playMusic === "function") playMusic("audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3");
      if (window.courtEngine) {
        window.courtEngine.resetCourt();
        window.courtEngine.triggerGavel();
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🛌 ים (מציץ מתוך הפוך): 'אני כאן כבודו, מתייצב לדין בריבונות מלאה!'", next: "court_ch3_yam_wakes_in_bed" },
      { text: "⚖️ התובע הראשי: 'בזיון בית המשפט! הנאשם מופיע בפיג'מה!'", next: "court_ch3_prosecutor_rage" },
      { text: "💻 ינוור: 'כסנגורו הראשי, אני מזכיר לכבודו את תיק המוצגים (COURT RECORD)!'", next: "court_ch3_invar_intro_evidence" }
    ]
  },

  court_ch3_yam_wakes_in_bed: {
    speaker: "ים שמואל (מתוך דוכן המיטה הריבוני)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_sleepy.png",
    text: "ים מציץ מבין קפלי השמיכה, מפהק פיהוק עמוק ומחזיק ביד אחת בורקס תפוחי אדמה קפוא למחצה:\n\n'כבוד השופט, על פי תקנות החירום של אורנית, המיטה שלי היא שטח ריבוני מפורז!\nאף צו הבאה לא תקף בתוך רדיוס של 2 מטרים משמיכת פוך אווזים אמיתית!\nאני מוכן לענות לשאלות, אבל רק אם לא תדרוש ממני להוריד רגליים לרצפה — המרצפות פה קפואות!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(true, true);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "📜 התובע הראשי: 'אני דורש להקריא מיד את כתב האישום המזעזע!'", next: "court_ch3_indictment" },
      { text: "🤤 ים: 'מישהו רוצה ביס מהבורקס? יש לי פה פירורים חמים!'", next: "court_ch3_yam_snack_penalty" }
    ]
  },

  court_ch3_yam_snack_penalty: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/break.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_surpise.png",
    text: "🔨 *בום! הפטיש מכה בעוצמה על השולחן!* 🔨\n\n'קנס של 10 HP על ניסיון שיחוד שיפוטי באמצעות שומשום ופחמימות!\nהנאשם מתבקש להפסיק לכרסם מאפים על דוכן המזרן הריבוני ולהקשיב לתביעה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.takeDamage(10, "שומשום בורקס על המזרן הריבוני!");
        window.courtEngine.setBedPodium(true, false);
      }
    },
    choices: [
      { text: "⚖️ לעבור להקראת כתב האישום הראשי", next: "court_ch3_indictment" }
    ]
  },

  court_ch3_prosecutor_rage: {
    speaker: "התובע הראשי (נציג הדיסקורד והמדינה)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "התובע הראשי חובט בערימת קלסרים עבה על שולחנו:\n\n'כבוד השופט! הנאשם לא רק שוכב במיטה באמצע הליך משפטי פדרלי — אלא שבשעה 02:47 לפנות בוקר הוא ביצע פיגוע תודעתי חסר תקדים ברשת!\nהוא הפיץ טראק דריל פוליטי-מחאתי מסית, רצוף באוטו-טיון בלתי מורשה, שאיים על שלום הציבור ודרש פירוק מוחלט של מוסדות השלטון!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "📜 לשמוע את פירוט כתב האישום", next: "court_ch3_indictment" }
    ]
  },

  court_ch3_invar_intro_evidence: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור מתקדם אל עמדת ההגנה, פותח את הלפטופ ומכוון את המשקפיים:\n\n'כבוד השופט, ליליה ושחקנים יקרים! אל תתנו לפאניקה של התביעה להטעות אתכם!\nכל הראיות שימוטטו את התיק הזה נמצאות בראש המסך בכפתור 📑 מוצגים / COURT RECORD!\nאספתי שם את קלטת השיר, שלט המזגן, ניתוח האודיו הספקטרוגרפי ואמנת אורנית!\nברגע שנציג את האמת בחקירה הנגדית — כל האישום הפוליטי יקרוס!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(true);
      }
    },
    choices: [
      { text: "מצוין, ינוור! בוא נשמע את כתב האישום ונפרק אותו!", next: "court_ch3_indictment" }
    ]
  },

  court_ch3_indictment: {
    speaker: "התובע הראשי",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "התובע הראשי פותח קובץ שחור ומציג לראווה נגן אודיו:\n\n'כתב האישום מייחס לנאשם ים שמואל שתי עבירות חמורות על ביטחון השיח הציבורי:\n\n1. קריאה מפורשת להפלת השלטון בבית א' של הטראק ('נפיל את השלטון!').\n2. קריאה להשמדת מוסד ממשלתי בבית ב' ('הכנסת צריכה פינוי-בינוי!').\n\nוכעת, באישור בית המשפט, נשמיע את ההקלטה הלוהטת של קלטת הדריל!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setInvarTerminal(false);
        window.courtEngine.setAudioVisualizer(true, "🔴 REC: YAM_POLITICAL_MANIFESTO_140BPM.MP3");
      }
    },
    choices: [
      { text: "🔊 להאזין לקטע המוקלט באקולייזר!", next: "court_ch3_play_tape" }
    ]
  },

  court_ch3_play_tape: {
    speaker: "קלטת הדריל של ים (140 BPM)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/inject.mp3",
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_sleepy.png",
    text: "🎶 *האקולייזר מתחיל לקפוץ בטירוף סגול ונוצץ בראש המסך!* 🎶\n\nקולו של ים מהדהד באולם בעיוות אוטו-טיון צורם ורעש רקע של מאוורר שבור:\n\n'יו... שר האוצר גוזר גזירות על המאפה! / \nאבל אף ח\"כ לא מעז לבוא לכאן לקפה! / \nמפילים ממשלות, מקימים קואליציות / \nואני מפרק קלוריות בלי אינקוויזיציות! / \n**נפיל את השלטון!** תבטלו את המע\"מ או שהפוך לא זז!'\n\nהאולם רועש וגועש בהלם!",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(true, true);
        window.courtEngine.setAudioVisualizer(true, "🎶 PLAYING: DISS_TRACK_BPM140 [LOUD]");
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "😱 הקהל זועק: 'שמעתם אותו?! הוא קרא למרד!'", next: "court_ch3_crowd_panic" }
    ]
  },

  court_ch3_crowd_panic: {
    speaker: "התובע הראשי",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "התובע הראשי מחייך חיוך זדוני ופונה אל השופט:\n\n'שמעת זאת במו אוזניך, כבוד השופט!\n'נפיל את השלטון!' — אין כאן מקום לספק!\nהנאשם הודה במילותיו שלו בשאיפה להפיכה שלטונית אלימה מתוך חדר השינה באורנית!\nאני דורש מאסר עולם וניתוק הווי-פיי לצמיתות!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🛑 ינוור: '!HOLD IT! רגע אחד! יש כאן עיוות מוחלט של העובדות!'", next: "court_ch3_invar_holdit_1" }
    ]
  },

  court_ch3_invar_holdit_1: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/inject.mp3",
    holdit: true,
    effect: "flash",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור מניף את ידו בתנועה חדה שמזעזעת את עמדת התביעה:\n\n'!HOLD IT! רגע אחד, כבוד השופט!\nהתביעה שומעת מה שהיא רוצה לשמוע, ומתעלמת לחלוטין מהמציאות הפיזית בחדרו של ים!\nאני דורש לחקור את התביעה בחקירה נגדית מלאה ולהציג את הראיה שתוכיח מה בדיוק 'נפל' באותו לילה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerHoldIt();
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "⚖️ להתחיל בחקירה נגדית 1: טענת הפלת השלטון!", next: "court_ch3_cross1_statement" }
    ]
  },

  // ==========================================================
  // מערכה ב': חקירה נגדית 1 — טענת 'הפלת השלטון' (מסך נקי ומרווח)
  // ==========================================================
  court_ch3_cross1_statement: {
    speaker: "התובע הראשי (טענות התביעה על הפלת השלטון)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "📜 **עדות התביעה: האיום המהפכני של ים שמואל** 📜\n\n1. 'הנאשם הקליט טראק דריל בשעת לילה מאוחרת עם כוונת מכוון.'\n2. 'בבית הראשון הוא קרא בקולו שלו: 'נפיל את השלטון!'!'\n3. 'הוא דרש פטור ממע\"מ על מוצרי מאפה ואיים להקפיא את המזרן.'\n4. 'אין שום פירוש אחר למילה 'שלטון' מלבד הפיכה כנגד המדינה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "👉 PRESS: לחקור את סעיף 1 (שעת ההקלטה הלילית)", next: "court_ch3_press1_s1" },
      { text: "👉 PRESS: לחקור את סעיף 2 ('נפיל את השלטון')", next: "court_ch3_press1_s2" },
      { text: "👉 PRESS: לחקור את סעיף 3 (דרישת הפטור על בורקס)", next: "court_ch3_press1_s3" },
      { text: "📑 PRESENT: להציג ראיה כנגד סעיף 2 ('הפלת השלטון')!", next: "court_ch3_present_menu_cross1" }
    ]
  },

  court_ch3_press1_s1: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'אתה טוען שהוא הקליט את זה ב'כוונת מכוון'?!\nהאם התביעה טרחה לבדוק את מצבו התודעתי של אדם בשעה 02:47 בלילה?!'\n\nהתובע הראשי: 'אדם שאינו ישן בשעה כזאת הוא בהכרח מהפכן מסוכן!'\n\nים (מציץ לרגע): 'או שהוא סתם ראה מרתון סרטונים של חתולים מנגנים בפסנתר...'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לטענות התביעה", next: "court_ch3_cross1_statement" }
    ]
  },

  court_ch3_press1_s2: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'אתה אומר 'נפיל את השלטון'. האם בדקתם מה היה מונח ליד המיטה באותו רגע?!'\n\nהתובע הראשי: 'שום דבר לא משנה! המילה 'שלטון' מדברת בעד עצמה!'\n\nינוור לוחש לך:\n'שחקן יקר, הוא טועה לחלוטין! פתח את תיק המוצגים (COURT RECORD) ובחר ב-📟 שלט המזגן שנפל מתחת למיטה כדי לחשוף את הסתירה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "📑 לפתוח את תיק המוצגים ולהציג ראיה עכשיו!", next: "court_ch3_present_menu_cross1" },
      { text: "🔙 חזרה לטענות התביעה", next: "court_ch3_cross1_statement" }
    ]
  },

  court_ch3_press1_s3: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'הדרישה להורדת מע\"מ על בורקס היא הצעת מדיניות כלכלית לגיטימית ולא הסתה!'\n\nהשופט AI מהנהן: 'מעבדי מעלים כי בורקס תפוחי אדמה אכן מכיל 85% פחמימה חיונית... אבל זה עדיין לא מצדיק איומי שביתת מזרן!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לטענות התביעה", next: "court_ch3_cross1_statement" }
    ]
  },

  // תפריט הצגת ראיה לחקירה נגדית 1
  court_ch3_present_menu_cross1: {
    speaker: "ינוור (הצגת ראיה לבית הדין)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'איזו ראיה מתיק המוצגים מוכיחה למה ים התכוון כשאמר 'נפיל את השלטון'?!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "📟 שלט המזגן שנפל מתחת למיטה", next: "court_ch3_success_cross1_ac_remote" },
      { text: "📼 קלטת הדריל: המנון המזרן הריבוני", next: "court_ch3_fail_cross1" },
      { text: "📑 דוח שכרות שינה (400 שורטס)", next: "court_ch3_fail_cross1" },
      { text: "📜 אמנת אורנית להגנת המזרן", next: "court_ch3_fail_cross1" },
      { text: "🔙 לחזור לחקירה הנגדית", next: "court_ch3_cross1_statement" }
    ]
  },

  court_ch3_fail_cross1: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! הפטיש מכה בעוצמה!* 🔨\n\n'התנגדות נדחית! הראיה שהצגת אינה סותרת את הטענה להפלת השלטון!\nהסנגוריה סופגת קנס של 20 HP על עיכוב הליכי משפט!'\n\nינוור: 'אוי לא... שחקן יקר, שים לב לפרטים! אנחנו צריכים להראות חפץ פיזי שקשור ל'שלט' שנפל!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.takeDamage(20, "ראיה שגויה בחקירה נגדית 1!");
        window.courtEngine.setBedPodium(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לחקירה הנגדית", next: "court_ch3_cross1_statement" }
    ]
  },

  court_ch3_success_cross1_ac_remote: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    objection: true,
    effect: "flash",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "💥 **!OBJECTION! התנגדות נמרצת!** 💥\n\nינוור חובט בשולחן, ספידליינס מטאוריים נמתחים על פני המסך, והוא שולף מתוך שקית ראיות פלסטיק לבנה חפץ מאובק:\n\n'כבוד השופט, הבט בראיה הזאת: **שלט המזגן של אמא של ים!**\nהוא נמצא מתחת למזרן הריבוני, מכוון על 16 מעלות צלזיוס וטורבו מקפיא!\nהנאשם שכב קפוא תחת הפוך, הושיט יד באפילה, והשלט נפל לו על הרצפה!\nכשהוא זעק בטראק: *'נפיל את השלט-און!'* — הוא התכוון **לשלט המזגן שהיה דלוק (ON)** ונפל לו מהידיים!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerObjection();
        window.courtEngine.triggerDeskSlam();
        window.courtEngine.triggerSpeedlines(2200);
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "😱 התובע הראשי נסוג לאחור בהלם מוחלט!", next: "court_ch3_prosecutor_shock_1" }
    ]
  },

  court_ch3_prosecutor_shock_1: {
    speaker: "התובע הראשי",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/break.mp3",
    effect: "shake",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_sleepy.png",
    text: "התובע הראשי מזיע, אוחז בצווארונו ורועד:\n\n'מ... מה?! שלט המזגן של אמא שלו שעמד על 16 מעלות?!'\n\nים שמואל מציץ מתוך השמיכה ומהנהן בהקלה:\n'נשבע לך כבודו! קפאו לי הבהונות! ניסיתי לכוון ל-24 מעלות חימום ולא הגעתי אליו! זה היה שלט-ON שנפל!'\n\nהשופט AI מתקן את המשקפיים:\n'מדהים... הטענה להפיכה שלטונית בבית א' מבוטלת לחלוטין מחוסר ראיות!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(true, true);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
        window.courtEngine.triggerGavel();
      }
    },
    choices: [
      { text: "⚖️ התובע חורק שיניים: 'זה עדיין לא נגמר! מה עם בית ב'?!'", next: "court_ch3_prosecutor_pivot_2" }
    ]
  },

  // ==========================================================
  // מערכה ג': חקירה נגדית 2 — סוד הבית השני והאודיו
  // ==========================================================
  court_ch3_prosecutor_pivot_2: {
    speaker: "התובע הראשי",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "התובע דופק באגרופו על השולחן:\n\n'יפה מאוד, ינוור! הצלחת להתחמק עם המזגן! אבל מה תגיד על הבית השני?!\nהנה הציטוט המדויק שנלכד על ידי אלגוריתם הדיסקורד ב-100% ודאות:\n\n**'הכנסת צריכה פינוי-בינוי!'**\n\nאין שום שלט מזגן שקוראים לו כנסת! הנאשם קרא להחריב מוסד שלטוני מרכזי! על זה אין לך שום תירוץ!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "⚖️ לעבור לחקירה נגדית 2 על מילות הבית השני!", next: "court_ch3_cross2_statement" }
    ]
  },

  court_ch3_cross2_statement: {
    speaker: "התובע הראשי (עדות על הבית השני והכנסת)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "📜 **עדות התביעה: קריאת הפינוי-בינוי לכנסת** 📜\n\n1. 'האלגוריתם תמלל באופן בלתי תלוי את המילים: 'הכנסת צריכה פינוי-בינוי'.' \n2. 'המילה 'כנסת' מתייחסת לבית המחוקקים של מדינת ישראל.'\n3. 'האוזניות של הנאשם קלטו את התדרים בצורה מושלמת ללא רבב.'\n4. 'לא ייתכן שום עיוות אקוסטי שיסביר מילים כה ברורות!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "👉 PRESS: לחקור את סעיף 1 (אלגוריתם התמלול)", next: "court_ch3_press2_s1" },
      { text: "👉 PRESS: לחקור את סעיף 3 (איכות האוזניות והמיקרופון)", next: "court_ch3_press2_s3" },
      { text: "📑 PRESENT: להציג ראיה המוכיחה עיוות סאונד מוחלט!", next: "court_ch3_present_menu_cross2" }
    ]
  },

  court_ch3_press2_s1: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'אלגוריתמים לתמלול אוטומטי טועים כל הזמן, במיוחד כשיש אוטו-טיון של 140 BPM!'\n\nהתובע: 'האלגוריתם שלנו פותח על ידי בכירי המתכנתים בדיסקורד! הוא לא מפספס אף הברה!'\n\nינוור לוחש לך: 'יש לנו את הניתוח הספקטרוגרפי המבודד! הוא מוכיח מה בדיוק נאמר שם!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לטענות התביעה", next: "court_ch3_cross2_statement" }
    ]
  },

  court_ch3_press2_s3: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'האוזניות קלטו בצורה מושלמת?! האוזניות של ים מוחזקות בסלוטייפ משנת 2018!'\n\nים (מציץ לרגע): 'נכון! הקפסולה של המיקרופון ספוגה בשמן של בורקס פיצה ורוטב אלף האיים!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לטענות התביעה", next: "court_ch3_cross2_statement" }
    ]
  },

  // תפריט הצגת ראיה לחקירה נגדית 2
  court_ch3_present_menu_cross2: {
    speaker: "ינוור (הצגת ראיה לבית הדין)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור: 'איזו ראיה מוכיחה שהמילים 'הכנסת צריכה פינוי-בינוי' היו עיוות של תה נענע מתוך שינה?!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "📊 ניתוח ספקטרוגרפי של ה-WAV", next: "court_ch3_success_cross2_spectrum" },
      { text: "🎧 אוזניות הגיימינג המעוותות", next: "court_ch3_success_cross2_spectrum" },
      { text: "📟 שלט המזגן שנפל מתחת למיטה", next: "court_ch3_fail_cross2" },
      { text: "📑 דוח שכרות שינה (400 שורטס)", next: "court_ch3_fail_cross2" },
      { text: "🔙 לחזור לחקירה הנגדית", next: "court_ch3_cross2_statement" }
    ]
  },

  court_ch3_fail_cross2: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! הפטיש מכה בשולחן!* 🔨\n\n'הראיה הזו אינה מפריכה את תמלול המילים של הבית השני!\nקנס של 20 HP נרשם לחובת ההגנה!'\n\nינוור: 'זהירות! עלינו להציג את ניתוח תדרי הספקטרום או את האוזניות השבורות!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.takeDamage(20, "ראיה שגויה בחקירה נגדית 2!");
        window.courtEngine.setBedPodium(false);
      }
    },
    choices: [
      { text: "🔙 חזרה לחקירה הנגדית", next: "court_ch3_cross2_statement" }
    ]
  },

  court_ch3_success_cross2_spectrum: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    objection: true,
    effect: "flash",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "💥 **!TAKE THAT! קבל את זה, אדוני התובע!** 💥\n\nינוור מקליד רצף פקודות סייבר בטרמינל. מסכי האולם נצבעים בכחול עמוק, וגרף ספקטרוגרפי מפורט מוקרן על הקיר:\n\n'כבוד השופט! ביצעתי בידוד תדרים מלא של ה-WAV המקורי מתוך האוזניות השבורות של ים!\nבגלל שפירורי בורקס סתמו את הדיאפרגמה של המיקרופון, והשפה התחתונה של ים הייתה משותקת מעייפות —\nהטקסט המקורי שנאמר בפועל היה:\n\n🍵 **'הכוס תה צריכה מילוי-שיקוי!'** 🍵\n\nהנאשם היה צמא באמצע הלילה! הוא בסך הכל ביקש שמישהו ימלא לו תה נענע חם עם שתי כפיות סוכר!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerObjection();
        window.courtEngine.triggerDramaticZoom(800);
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(true, "✅ FILTERED: 'HAKOS TE TZRICHA MILUY'");
        window.courtEngine.setInvarTerminal(true, "&gt; AUDIO FILTER APPLIED: 100% ACCURACY<br>&gt; ORIGINAL SPEECH: CUP OF TEA REQUEST");
      }
    },
    choices: [
      { text: "😱 התובע הראשי תופס את ראשו בשתי ידיו!", next: "court_ch3_prosecutor_meltdown" }
    ]
  },

  court_ch3_prosecutor_meltdown: {
    speaker: "התובע הראשי (קריסה רגשית באולם)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/break.mp3",
    effect: "shake",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "התובע הראשי צורח ומשליך את הדפים באוויר:\n\n'לאאאא! כוס תה?! כוס תה עם נענע ומילוי-שיקוי?!'\n\nים מציץ מתוך הפוך ומושיט כוס זכוכית ריקה:\n'כן אחי! התייבש לי הגרון מהבורקס! מה, אסור לבקש תה במדינה הזאת בלי לפתוח חזית בחדשות?!'\n\nהשופט AI מקליד בעוצמה על הפטיש:\n'כל האישומים בנוגע לפגיעה במוסדות השלטון מבוטלים בזאת כאי-הבנה אקוסטית חמורה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(true, true);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
        window.courtEngine.triggerGavel();
      }
    },
    choices: [
      { text: "📜 ינוור: 'וכעת, כבוד השופט, הגיע הזמן לטיעון החוקתי המנצח!'", next: "court_ch3_invar_constitutional_strike" }
    ]
  },

  // ==========================================================
  // מערכה ד': הטיעון החוקתי והניצחון המוחץ
  // ==========================================================
  court_ch3_invar_constitutional_strike: {
    speaker: "ינוור (סנגור ראשי)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/truimph.mp3",
    effect: "flash",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור נעמד זקוף מול כס השיפוט, מחזיק מגילת קלף עתיקה:\n\n'ולסיום המשפט, כבוד הדיינים, אני שולף את כלי הנשק המשפטי האולטימטיבי: **אמנת אורנית להגנת המזרן!**\nעל פי סעיף 4א' המקודש — שיר מחאה שנכתב מתחת לשמיכת פוך אינו שפיט באף בית דין שאין בו חימום תת-רצפתי!\nהנאשם היה מוגן, המילים סולפו, והתביעה כולה נולדה מפרנויה של אלגוריתמים שלא מבינים עייפות מהי!\nאני דורש זיכוי מלא, מיידי ובלתי מותנה!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerSpeedlines(2500);
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(true, "&gt; CONSTITUTIONAL BED TREATY APPLIED<br>&gt; CHARGES DISMISSED: 100%");
      }
    },
    choices: [
      { text: "🔨 כבוד אב בית הדין מרים את הפטיש להכרעת הדין הסופית!", next: "court_ch3_verdict_deliberation" }
    ]
  },

  court_ch3_verdict_deliberation: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/ים דייט סימולטור - תפריט ראשי.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "flash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום! פטיש הצדק רועם בכל קצוות האולם!* 🔨\n\n'בית הדין הגדול שקל את הראיות, את שלט המזגן, את כוס התה ואת אמנת אורנית.\nנחה דעתנו מעל לכל ספק סביר כי הנאשם ים שמואל אינו חתרן, אינו מסית ואינו פוליטיקאי —\nאלא סך הכל בחור עייף מאורנית שחיפש תה חם וקצת שקט בפוך!'\n\nהשופט מרים את הקול:\n\n🏆 **פסק הדין: זכאי מכל אשמה! (NOT GUILTY!)** 🏆",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.triggerGavel();
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🎉 קונפטי מתפרץ באולם! ים, ינוור וליליה חוגגים!", next: "court_ch3_victory_celebration" }
    ]
  },

  court_ch3_victory_celebration: {
    speaker: "ים, ינוור וליליה (חגיגת הניצחון)",
    music: "audio/ים דייט סימולטור - תפריט ראשי.mp3",
    sfx: "audio/truimph.mp3",
    effect: "flash",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "האולם מתמלא במחיאות כפיים סוערות! המודים של הדיסקורד סוגרים את הטיקטים בבושת פנים!\n\nליליה מחייכת חיוך רחב: 'אין מה להגיד, ינוור... אפילו בשאול אין סנגורים שמסוגלים להפוך מהפכה לכוס תה נענע!'\n\nינוור סוגר את הלפטופ, מנגב זיעה מהמצח ומביט בים:\n'נו, ים? עכשיו שאתה אדם חופשי ומזוכר — אתה מוכן לקום סוף סוף מהמיטה?'\n\nים מושך את השמיכה עד מעל הראש, מתכרבל בכרית וממלמל בשמחה:\n'לקום?! השתגעת?! זכיתי כרגע בריבונות שיפוטית על המזרן! לילה טוב לכולם, נתראה ב-16:00!'",
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(true, true);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🏆 לצפות במסך הסיום הרשמי של פרק 3!", next: "end_court_ch3_complete" }
    ]
  },

  // ==========================================================
  // מסך סיום פרק 3 הרשמי
  // ==========================================================
  end_court_ch3_complete: {
    speaker: "הנהלת בית הדין (Ace Attorney - סיום פרק 3)",
    music: "audio/ים דייט סימולטור - תפריט ראשי.mp3",
    sfx: "audio/truimph.mp3",
    effect: "flash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🏆 **תיק מספר 3 הושלם בהצלחה מוחצת!** 🏆\n\n✓ זיכית את ים שמואל מתביעת השירים הפוליטיים של הדיסקורד!\n✓ הוכחת את תאוריית שלט המזגן של אמא (16 מעלות)!\n✓ פענחת את עיוות האודיו של ה-WAV מכנסת לכוס תה נענע!\n✓ ביצרת את מעמדה של המיטה כעיר מקלט ריבונית באורנית!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚖️ **כל שלושת התיקים של בית הדין פתוחים כעת למשחק חופשי!**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nתודה ששיחקת בפרק 3!",
    end: true,
    onEnter: function() {
      if (window.courtEngine) {
        window.courtEngine.setBedPodium(false);
        window.courtEngine.setAudioVisualizer(false);
        window.courtEngine.setInvarTerminal(false);
      }
    },
    choices: [
      { text: "🏛️ חזרה לתפריט בחירת התיקים (Case Select)", next: "court_menu" },
      { text: "🏠 חזרה לחדר של ים", next: "room_intro" },
      { text: "🔄 התחלת המשחק מחדש", next: "start" }
    ]
  }

});
