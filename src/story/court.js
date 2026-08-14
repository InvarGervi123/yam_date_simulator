// --- Story Chapter: COURT (Ace Attorney Phoenix Wright Parody) ---
Object.assign(window.story, {
  court_intro: {
    speaker: "המספר",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    text: "⚖️ אולם המשפט של ים דייט סימולטור! ⚖️\n\nהחלטת לגרור את ים לתביעה משפטית אזרחית על הזנחת ערוץ היוטיוב, חוסר מענה בדיסקורד והפרת הבטחות דייט!\n\nהשופט: בוט דיסקורד AI בעל פטיש קלוריות מפלדה.\nהתובע: ינוור בחליפה מפוארת מנופף בדוחות אנליטיקס מודפסים.\nהנאשם: ים, שעומד בדוכן הנאשמים כשהוא עדיין שוכב בתוך המיטה שלו!\n\nים מעיד בבכי: 'אני לא אשם! לא יצאתי לדייט כי עבדתי 24/7 על עריכת סרטונים חדשים!'",
    onEnter: function() {
      if (typeof playMusic === "function") playMusic("audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3");
    },
    choices: [
      { text: "👉 PRESS: לשאול אותו כמה שעות ביום הוא באמת ערך", next: "court_press_hours" },
      { text: "📑 PRESENT EVIDENCE: להציג את יומן השינה במכשיר הנייד שלו", next: "court_present_phone" },
      { text: "🥐 PRESENT EVIDENCE: לשחד את השופט בבוט בעזרת בורקס חם", next: "court_present_bribe" },
      { text: "💥 OBJECTION: לטעון שהמיטה עצמה היא ביזיון בית המשפט!", next: "court_objection_bed" }
    ]
  },

  court_press_hours: {
    character: "images/characters/yam_dead.png",
    speaker: "ים",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    characterAnimation: "shake",
    text: "ים מזיע מתחת לשמיכה: 'אה... נו... ערכתי משהו כמו 18 שעות ביום! המקלדת שלי כמעט עלתה באש!'\n\nינוור זועק מספסל התביעה: 'שקר וכזב! הקובץ האחרון בתיקיית Premiere Pro שלו עודכן בשנת 2024!'",
    choices: [
      {
        text: "💥 OBJECTION! להציג את קובץ היסטוריית העריכה כראיה חותכת!",
        next: "court_present_log",
        onSelect: function() {
          if (typeof window.atmosphereEngine !== "undefined") window.atmosphereEngine.triggerThunderFlash();
        }
      },
      { text: "לדרוש מאסר בפועל בחדר של ינוור", next: "end_inover_prison" }
    ]
  },

  court_present_log: {
    speaker: "את/ה",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    effect: "flash",
    text: "💥 התנגדות!!! (OBJECTION!) 💥\n\nהנה קובץ התיעוד הדיגיטלי: הנאשם בילה 0 דקות בעריכה, ו-4,000 שעות במשחק Deltarune במיטה!\n\nים חוטף מכה דרמטית! הדמות שלו רועדת וקופצת לאחור.\n'לאאאא! האנליטיקס שלי נחשף לציבור!'\n\nהשופט בוט דופק בפטיש: 'שקט בבית המשפט! הראיות חותכות. הנאשם אשם בעצלנות קיצונית!'",
    choices: [
      { text: "לשמוע את גזר הדין המשפטי!", next: "end_courtroom_victory" }
    ]
  },

  court_present_phone: {
    speaker: "את/ה",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    effect: "flash",
    text: "💥 התנגדות!!! (OBJECTION!) 💥\n\nאני מציגה לבית המשפט את יומן השינה שלו: הוא ישן 23 שעות ביממה!\n\nים מתגונן: 'זה היה לצורכי מחקר עבור סרטון ניסוי שינה אנתרופולוגי!'\n\nהשופט בוט מהרהר: 'הסבר הגיוני ומדעי. התביעה מבוטלת מחמת הספק.'",
    choices: [
      { text: "הפסדנו במשפט...", next: "end_courtroom_dismissed" }
    ]
  },

  court_present_bribe: {
    speaker: "השופט בוט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    effect: "flash",
    text: "אתה מניח בורקס גבינה חם ונוטף שומן על שולחן השופט.\n\nהחיישנים של השופט בוט מזהים פחמימות מפתות.\n*ביפ ביפ... שגיאת קלט! שוחד טעים מדי!*\n\nהשופט בוט משתגע, דופק בפטיש לכל עבר וגוזר גזר דין קולקטיבי!",
    choices: [
      { text: "לראות את התוהו ובוהו המשפטי", next: "end_court_bribe" }
    ]
  },

  court_objection_bed: {
    speaker: "את/ה",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    effect: "shake",
    text: "💥 התנגדות!!! (OBJECTION!) 💥\n\nהנאשם נמצא בתוך המיטה ברגע זה בתוך אולם הדיונים! זהו ביזיון בית המשפט!\n\nהשופט בוט כועס מאוד: 'ביזיון?! להביא שמיכה לבית המשפט?! שומרים, קחו את המיטה הזו ותוציאו אותה להורג בפירוק מיידי!'\n\nשומרי בית המשפט מסתערים עם מברגים!",
    choices: [
      { text: "ים בורח מהמיטה!", next: "end_court_bed_execution" }
    ]
  }

});
