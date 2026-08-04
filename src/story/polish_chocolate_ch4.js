// --- Story Chapter: Polish Chocolate - The Broken Contract (DLC Chapter 4: The Original Thread - Arc 1 Finale) ---
Object.assign(window.story, {
  // --- Section 1: Return to Normal World ---
  ch4_return_world: {
    speaker: "המספר",
    background: "images/backgrounds/room.jpg",
    music: "audio/main.mp3",
    text: "📜 שוקולד פולני: החוזה השבור — פרק 4: החוט המקורי (סוף הקשת הראשונה)\n\nינוור פותח את עיניו ומוצא את עצמו עומד מחוץ לחנות השוקולד הסגורה בפולין.\nהשלג ממשיך לרדת, והעיר נראית רגילה לחלוטין... אך סימנים קטנים מהתפר מפעפעים סביבו: רדיו ישן מנגן סטטי מוזר, סמל מוצפן חוזר על קירות הלבנים, וכתובת רחוב נמחקת ומופיעה מחדש.\n\nפתאום, מכשיר קטן בכיסו מנצנץ — הודעה דחופה מלירון:\n'ינוור! האיש בחליפה האדומה כבר חצה אל העולם הרגיל! הוא מחפש את הפיסה השנייה!'",
    next: "ch4_investigation_hub_init"
  },

  // --- Section 2: Investigation Hub ---
  ch4_investigation_hub_init: {
    speaker: "המספר",
    onEnter: function() {
      window._ch4CluesRead = window._ch4CluesRead || {};
    },
    text: "ינוור עומד ברחוב המושלג. שלושה רמזים מופיעים מולו. מה תחקור קודם?",
    choices: [
      { text: "🏪 לחזור אל חנות השוקולד הסגורה", next: "ch4_investigate_shop" },
      { text: "🏚️ לחפש את הכתובת הישנה של המשפחה", next: "ch4_investigate_address" },
      { text: "📻 לעקוב אחר צליל הרדיו והסמל החוזר", next: "ch4_investigate_radio" }
    ]
  },

  ch4_investigation_hub: {
    speaker: "המספר",
    text: "ינוור חוזר אל מרכז הרחוב. איזה רמז תחקור כעת?",
    choices: [
      { text: "🏪 לחזור אל חנות השוקולד הסגורה", next: "ch4_investigate_shop" },
      { text: "🏚️ לחפש את הכתובת הישנה של המשפחה", next: "ch4_investigate_address" },
      { text: "📻 לעקוב אחר צליל הרדיו והסמל החוזר", next: "ch4_investigate_radio" }
    ]
  },

  ch4_investigate_shop: {
    speaker: "המספר",
    character: "images/characters/yam_curious.png",
    onEnter: function() {
      window._ch4CluesRead = window._ch4CluesRead || {};
      window._ch4CluesRead.shop = true;
    },
    text: "ינוור מציץ דרך חלון חנות השוקולד הסגורה.\nעל המדף הריק מונחת תיבת עץ עתיקה המעוטרת ברקמת המשפט: 'חוק הזיכרון השלישי'. בתוך התיבה מונחת פיסת עור כהה זוהרת — פיסת המעיל השנייה!",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch4CluesRead || {}).length;
          return count >= 2 ? "ch4_original_thread_revelation" : "ch4_investigation_hub";
        }
      }
    ]
  },

  ch4_investigate_address: {
    speaker: "המספר",
    onEnter: function() {
      window._ch4CluesRead = window._ch4CluesRead || {};
      window._ch4CluesRead.address = true;
    },
    text: "ינוור צועד אל הכתובת הישנה של המשפחה.\nעל משקוף האבן חקוק חותם משפחתי עתיק. הרשומה חושפת שהסכם המשפחה מעולם לא נחתם מתוך כפייה, אלא כמעשה גבורה להגנה על הזיכרונות האנושיים.",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch4CluesRead || {}).length;
          return count >= 2 ? "ch4_original_thread_revelation" : "ch4_investigation_hub";
        }
      }
    ]
  },

  ch4_investigate_radio: {
    speaker: "המספר",
    character: "images/characters/yam_horny.png",
    onEnter: function() {
      window._ch4CluesRead = window._ch4CluesRead || {};
      window._ch4CluesRead.radio = true;
    },
    text: "ינוור ניגש אל הרדיו המושלג בשולי הדרך.\nמבעד לרעש הסטטי בוקע קולה של העוזרת מהמרחב הלבן:\n'ינוור... פיסות המעיל הן ההוכחה לכך שלמשפחה שלך תמיד הייתה בחירה, גם בתוך מערכת תאגידית גדולה מהם!'",
    choices: [
      {
        text: "🔍 להמשיך בחקירה...",
        next: function() {
          const count = Object.keys(window._ch4CluesRead || {}).length;
          return count >= 2 ? "ch4_original_thread_revelation" : "ch4_investigation_hub";
        }
      }
    ]
  },

  // --- Section 3: Discovery of The Original Thread ---
  ch4_original_thread_revelation: {
    speaker: "המספר",
    effect: "flash",
    text: "שלוש פיסות המידע מתחברות מול עיניו של ינוור!\nהחוט המקורי נחשף במלואו:\n\n1. החוזה המשפחתי המקורי לא נועד לייצר כוח או להוריש קללה.\n2. מטרתו היחידה הייתה לשמור זיכרון אנושי טהור מפני מערכת תאגידית שמוחקת שמות והופכת אנשים לרכוש!\n3. פיסות המעיל הן הוכחה חיה לכך שלמשפחה הייתה בחירה חופשית, וכי הזיכרון עמיד יותר מכל חותם תאגידי!",
    next: "ch4_red_suit_deal"
  },

  // --- Section 4: Showdown & The Ultimate Deal ---
  ch4_red_suit_deal: {
    speaker: "האיש בחליפה האדומה",
    character: "images/characters/yam_angry.png",
    effect: "redflash",
    text: "האיש בחליפה האדומה מגיח מבין סמטות השלג בחליפה מגוהצת וקול חדודי:\n'הגענו לסוף הדרך, ינוור. תן לי את פיסות המעיל, ואעניק לך חיים רגילים, שקטים וללא שום חותם או חוב תאגידי.'\n\nלירון מופיע לצדו בלחש:\n'ינוור... העסקה שלו אמיתית, אבל המחיר שלה הוא אובדן מוחלט של כל זיכרון משפחתי.'\n\nמה תבחר לעשות?",
    choices: [
      { text: "🤝 לקבל את העסקה ולזכות בחיים רגילים שקטים", next: "end_ch4_normal_life" },
      { text: "🛡️ לסרב לעסקה ולהסתיר את פיסות המעיל", next: "end_ch4_memory_keeper" },
      { text: "📢 לחשוף את החוזים לעולם במקום לשמור אותם לעצמו", next: "end_ch4_exposed_contract" }
    ]
  }
});
