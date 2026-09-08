// --- Story Chapter: COURT CHAPTER 2 (פרק 2: מלחמת הינוורים וסוד המאפייה הקוסמית) ---
// תיק מספר 2: ים שמואל וינוור Prime נגד השדה ליליה, שד הוולט והרב ינוור בייט שליט"א!
// גדוש בעשרות בדיחות וממים, ענפי בחירה אמיתיים בכל סצנה, אפקטים ויזואליים מרהיבים:
// חבטות שולחן (deskSlam), פטיש שופט (gavel), זום דרמטי (zoom), ספידליינס, Objection,
// חקירות נגדיות אינטראקטיביות, חשיפת הסימולטור ומפגש אינטראקטיבי עם המאסטרמיינד של פרק 3!

Object.assign(window.story, {

  // ==========================================================
  // פרק 2 - מבוא: התביעה הנגדית ופירורי הקשקבל
  // ==========================================================
  court_ch2_intro: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום! שקט מוחלט באולם בית הדין הגדול!* 🔨\n\n'בית הדין לענייני שדים, פחמימות, דייטים ויוטיוב מתכנס בזאת לדיון דחוף בתיק מספר 2!\nשעה קלה לאחר שהסתיימה תביעתה של האישה על נטישת הדייט, הנתבע ים שמואל התעטף בארבע שמיכות פוך, הציב מאוורר שבור והגיש תביעה נגדית מסמרת שיער!'\n\nים מציץ מתוך השמיכה, מזיע כולו ונוטף פירורי קשקבל מוזהבים:\n'כבוד השופט! המשפט הקודם היה הונאת ענק! האישה הזאת אינה סתם דייט מאוכזב מאורנית — היא שדת פופ קטלנית מהשאול שזוממת לשדוד את מתכון הבורקס הקדוש שלי!'",
    onEnter: function() {
      if (typeof playMusic === "function") playMusic("audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3");
      if (window.courtEngine) {
        window.courtEngine.resetCourt();
        window.courtEngine.triggerGavel();
      }
    },
    choices: [
      { text: "🥐 ים: 'כבוד השופט, קודם כל תן לי לבלוע את שארית הבורקס!'", next: "court_ch2_intro_yam_snack" },
      { text: "🛌 ים: 'אני דורש פגרת בית דין של 45 דקות לשנ\"צ התאוששות!'", next: "court_ch2_intro_yam_nap_demand" },
      { text: "📜 הרב ינוור בייט: 'מחאה נמרצת! שולחתי צדקת תמימה וצנועה!'", next: "court_ch2_haredi_invar_protest" },
      { text: "💥 פתאום דלתות האולם נבעטות בעוצמה מחרישת אוזניים!", next: "court_ch2_secular_invar_entrance" }
    ]
  },

  court_ch2_intro_yam_snack: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/break.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "🔨 *בום! הפטיש מכה ישירות על עמדת השיפוט!* 🔨\n\n'הנאשם נדרש לחדול מיידית מלבלוע גבינה צהובה מותכת על דוכן העדים!\nהפירורים השומניים שלך חודרים ישירות לפתחי האוורור של מעבדי ה-AI שלי וגורמים לטמפרטורת המעבד לזנק ל-94 מעלות צלזיוס!'\n\nים מנגב את פיו בשרוול הפוך:\n'אבל כבודו, שומן בורקס זה חומר סיכה טבעי למאווררים! אני בסך הכל דואג לתחזוקת החומרה שלך!'",
    choices: [
      { text: "🤤 ים: 'רוצה ביס? זה עם שומשום קלוי כפול!'", next: "court_ch2_intro_yam_bribe_judge" },
      { text: "💥 פתאום דלתות האולם נפרצות בבעיטה מטאורית!", next: "court_ch2_secular_invar_entrance" }
    ]
  },

  court_ch2_intro_yam_bribe_judge: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "🔨 *בום! קנס 10 HP על ניסיון שוחד פחמימתי למערכת השיפוטית!* 🔨\n\n'ביזיון בית הדין! מעבד ה-AI שלי פועל על מתח חשמלי נקי ולא על גבינת קשקבל נוטפת שמן!\nנרשמה הפחתת HP מיידית על שידול שופט!'\n\nים תופס את ראשו: 'אוי, הקלוריות שלי נאבדות!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(10, "ניסיון שוחד בורקס לשופט AI!");
    },
    choices: [
      { text: "💥 באותה שנייה ממש — דלתות האולם מתנפצות לרסיסים!", next: "court_ch2_secular_invar_entrance" }
    ]
  },

  court_ch2_intro_yam_nap_demand: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "shake",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_sleepy.png",
    text: "🔨 *בום! הפטיש מזעזע את האולם!* 🔨\n\n'בקשת שנ\"צ נדחתה על הסף! אינך יכול לבקש פגרה של 45 דקות שלוש שניות בלבד אחרי שהמשפט נפתח!\nעל פי סעיף 14ב לתקנון הדיונים — שנת צהריים מותרת אך ורק אם הנאשם הציג אישור רפואי ממאפיית אורנית!'\n\nים מפהק פיהוק קוסמי: 'אבל העיניים שלי נעצמות... איך אני יכול להגן על עצמי בלי שמיכת חורף?!'",
    choices: [
      { text: "📜 הרב ינוור בייט: 'כבודו צודק, בטלה מביאה לידי שעמום!'", next: "court_ch2_haredi_invar_protest" },
      { text: "💥 בום! פיצוץ אדיר מרעיד את פתח האולם!", next: "court_ch2_secular_invar_entrance" }
    ]
  },

  court_ch2_haredi_invar_protest: {
    speaker: "הרב ינוור בייט (טוען רבני)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    deskSlam: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "הרב ינוור בייט חובט בדוכן בידו, פאותיו מתעופפות לצדדים והוא זועק בלהט תורני:\n'הבל הבלים ורעות רוח! שולחתי היא עלמה חסודה וצדקת שרק חיכתה בכיכר אורנית עם ורד ריחני וספר תהילים!\nהנאשם מנסה להמציא עלילות דם על שדים ומתכונים קוסמיים כדי להתחמק מתשלום על הטיפ של השליח ודמי שידוכים כהלכה!'\n\nאך בדיוק כשהוא פותח שו\"ת עתיק...",
    choices: [
      { text: "💥 בום! דלתות האלון הכבדות מתעופפות באוויר!", next: "court_ch2_secular_invar_entrance" },
      { text: "🥐 ים: 'הרב ינוור, תברך על הבורקס קודם!'", next: "court_ch2_secular_invar_entrance" }
    ]
  },

  // ==========================================================
  // כניסתו של ינוור החילוני (Invar Prime)
  // ==========================================================
  court_ch2_secular_invar_entrance: {
    speaker: "קול רועם ומאיים מהכניסה",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    holdIt: true,
    deskSlam: true,
    speedlines: true,
    effect: "shake",
    characterAnimation: "slide_in",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "💥 *טראאאח! פיצוץ מחריש אוזניים!* 💥\n\nדלתות האלון הכבדות של בית הדין מתנפצות לקיסמים!\nבפתח האולם, מוקף בענן אבק ובאור ניאון כחול, עומד... **ינוור החילוני (Invar Prime)**!\nהוא לבוש חולצה שחורה צמודה, שיער פרוע, אוזניות גיימינג עם מיקרופון של מודרטור, ובידו מקלדת מכנית זוהרת ב-RGB מלא!\n\n'HOLD IT! רגע אחד! עצרו את הפארסה המגוחכת הזאת מיד!\nאני כאן כדי לייצג את ים שמואל ולחשוף את מזימת השאול הגדולה ביותר בתולדות אורנית ודיסקורד!'\n\nכל הנוכחים באולם קופאים בהלם מוחלט.",
    onEnter: function() {
      if (typeof playMusic === "function") playMusic("audio/boss_fight.mp3");
    },
    choices: [
      { text: "🤯 השופט AI: 'מה למען השם קורה פה?! יש שני ינוורים באולם?!'", next: "court_ch2_two_invars_paradox" },
      { text: "😎 ינוור Prime: 'עשיתי Overclock למערכת המשפטית!'", next: "court_ch2_secular_boast" },
      { text: "🛌 ים: 'ינוור! תגיד לי שהבאת כבל מאריך של 5 מטר למיטה!'", next: "court_ch2_yam_charger_relief" }
    ]
  },

  court_ch2_secular_boast: {
    speaker: "ינוור החילוני (Invar Prime)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/inject.mp3",
    zoom: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור החילוני מקיש על מקלדת ה-RGB שלו בקצב מטורף של 300 מילים בדקה:\n'כבוד השופט, פרצתי את קצב הריענון של בית הדין מ-60Hz ל-240Hz!\nהתקנתי כרטיס RTX 5090 על מערכת הצדק, ומצאתי 14 פירצות אבטחה בכתב התביעה של ליליה עוד לפני שהקפה הראשון שלי התקרר!'\n\nהשופט AI מתחיל לרצד: 'שגיאת מערכת! צריכת החשמל באולם הוכפלה!'",
    choices: [
      { text: "⚡ לעבור לעימות הישיר מול הרב ינוור בייט!", next: "court_ch2_two_invars_paradox" }
    ]
  },

  court_ch2_yam_charger_relief: {
    speaker: "ים שמואל (התלהבות של עצלנים)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/click.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "ים מזנק מעט מתוך השמיכה בעיניים בורקות:\n'עזוב אותך ממשפט, ינוור! הטלפון שלי על 3% סוללה! אם הוא נכבה אני לא אוכל לשמוע את רעש הגשם הלבן שעוזר לי להירדם! הבאת מטען מהיר Type-C?!'\n\nינוור החילוני מסתובב אליו בעצבים:\n'ים! אנחנו באמצע משפט היסטורי על החיים שלך ואתה דואג ל-Type-C?! תסתכל על הצד השני של האולם!'",
    choices: [
      { text: "👀 להביט לעבר שני הינוורים הניצבים זה מול זה!", next: "court_ch2_two_invars_paradox" }
    ]
  },

  // ==========================================================
  // פרדוקס שני הינוורים: מי הם באמת?
  // ==========================================================
  court_ch2_two_invars_paradox: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/Panic.mp3",
    sfx: "audio/inject.mp3",
    effect: "redflash",
    speedlines: true,
    dualInvars: true,
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "השופט AI מנצנץ בכל נורות האזהרה, עשן סמיך מתפרץ מלוח האם:\n*ביפ בופ... באג קטלני בקוד המקור של המשחק! שגיאה 404: כפילות ינוור זוהתה!*\n\n'רגע אחד! איך ייתכן שיש שני ינוורים באותו חדר?! אחד חרדי עם שטריימל, ציצית וספרי שו\"ת, ואחד חילוני גמור עם סניקרס, כרטיס RTX ואוזניות גיימינג?! מי מכם הוא הינוור האמיתי ואיך עברתם את השומר בכניסה?!'",
    choices: [
      { text: "🖥️ ינוור החילוני: 'אני ינוור Prime — האדמין והעורך המקורי!'", next: "court_ch2_secular_explains" },
      { text: "📜 הרב ינוור בייט: 'חצוף! אני נוצרתי כדי להציל את ים מחיי בטלה!'", next: "court_ch2_haredi_explains" },
      { text: "🛌 ים: 'אולי אתם שניהם סיוט פחמימתי ואני בכלל ישן?!'", next: "court_ch2_yam_sleep_theory" }
    ]
  },

  court_ch2_yam_sleep_theory: {
    speaker: "ים שמואל מול שני הינוורים",
    music: "audio/Panic.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_surpise.png",
    text: "ים עוצם עיניים בכוח, מכסה את פניו בכרית ומתפלל:\n'אחת, שתיים, שלוש... אם אני פוקח עיניים ואחד מכם נעלם, אני מבטיח לאכול סלט מחר בבוקר!\nתקשיבו, אחד צועק עליי שאני לא מעלה סרטונים ליוטיוב, והשני צועק עליי שלא אמרתי 'ברכת המזון' על הפירורים שבשמיכה! המוח שלי מותך מרוב ינוורים!'\n\nשני הינוורים חובטים יחד בשולחן וצועקים עליו באותו קול בדיוק:\n**'תשתוק ותקשיב לעובדות!'**",
    choices: [
      { text: "🖥️ לשמוע את ההסבר של ינוור החילוני (Invar Prime)", next: "court_ch2_secular_explains" },
      { text: "📜 לשמוע את ההסבר של הרב ינוור בייט שליט\"א", next: "court_ch2_haredi_explains" }
    ]
  },

  court_ch2_secular_explains: {
    speaker: "ינוור החילוני (Invar Prime)",
    music: "audio/גישה פיזית ודרמטית.mp3",
    sfx: "audio/click.mp3",
    deskSlam: true,
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור החילוני מוציא גרף מודפס מ-YouTube Studio ומנופף בו:\n'אני הוא ינוור האמיתי! ינוור שיושב עד 4:00 בבוקר עם Monster Energy ופוטושופ כדי לערוך לים thumbnails של Deltarune!\nבמשך שלוש שנים ראיתי את ים מתמזג פיזית עם המזרן שלו באורנית. גרף הצפיות צלל ב-99.4%! אפילו אלגוריתם של גוגל שלח לי מייל ניחומים!\nמתוך ייאוש טוטאלי פיתחתי את הסימולטור הזה — **'ים דייט סימולטור'** — כדי לגרור אותו בכוח מהמיטה לעולם האמיתי!'",
    choices: [
      { text: "📜 ועכשיו תורו של הרב ינוור להסביר מאיפה הוא הגיע!", next: "court_ch2_haredi_explains" },
      { text: "🥐 ים: 'רגע, אז כל הדייטים היו ניסוי חברתי של עורך וידאו?!'", next: "court_ch2_yam_meta_shock" }
    ]
  },

  court_ch2_yam_meta_shock: {
    speaker: "ים שמואל (הלם מטא-משחקי)",
    music: "audio/גישה פיזית ודרמטית.mp3",
    sfx: "audio/crack.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_angry.png",
    text: "ים זורק את הכרית על ינוור החילוני:\n'אתה בנית את כל המשחק הזה רק כדי שאני אערוך סרטונים?! גרמת לי לברוח מסלנדרמן ביער, לפתור שאלות מתמטיקה אצל באלדי, להילחם ברוחות הריון, ועכשיו לעמוד למשפט מול שדה מהשאול — הכל בשביל עוד 5,000 צפיות ביוטיוב?!'\n\nינוור Prime מחייך בקור: '5,000 צפיות וגם שיפור ב-Retention Rate! זה משתלם!'",
    choices: [
      { text: "📜 לשמוע את תגובת הרב ינוור בייט למזימה החילונית!", next: "court_ch2_haredi_explains" }
    ]
  },

  court_ch2_haredi_explains: {
    speaker: "הרב ינוור בייט (טוען רבני)",
    music: "audio/נתיבים מיוחדים והרפתקאות.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "הרב ינוור בייט מתייצב בגאווה, מלטף את זקנו ומביט לעבר השמיים:\n'אמת דיבר ינוור החילוני! כשהוא ישב בלילות ותלש שערות מול גרפי ה-Retention, תפילותיו וזעקות הייאוש שלו בקעו רקיעים!\nמתוך ייסורי המצפון האדירים שלו — **נוצרתי אני!** התגלמות הקדושה, השידוכים והפחמימות הכשרות למהדרין!\nבאתי כדי להחזיר את ים למוטב, למצוא לו בת ישראל כשרה מאורנית, וללמד אותו הלכות נטילת ידיים לפני שהוא בולע בורקס מתחת לפוך!'",
    choices: [
      { text: "😈 אבל אז... השדה ליליה מתפרצת בצחוק זדוני!", next: "court_ch2_liliya_reveals_truth" },
      { text: "🤯 השופט AI: 'אז מי כאן בעצם התובע ומי הנתבע?!'", next: "court_ch2_liliya_reveals_truth" }
    ]
  },

  // ==========================================================
  // חשיפת ליליה: כוכבת פופ מהשאול והסוד הגדול
  // ==========================================================
  court_ch2_liliya_reveals_truth: {
    speaker: "השדה ליליה (נחשפת במלוא הדרה)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/inject.mp3",
    effect: "flash",
    zoom: true,
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/liliya.png",
    text: "צחוק מרושע ומהדהד ממלא את כל אולם המשפט!\nליליה מסירה את מעיל הפרווה הוורוד, ומאחורי גבה נפרשות שתי כנפי עטלף שחורות ענקיות, זנב מחודד וקרניים זוהרות באש גופרית!\n\n'חה חה חה! כמה שאתם פתטיים! ינוור החילוני חשב שהוא בנה סימולטור דייטים תמים... והרב ינוור חשב שהוא מצא שידוך כשר!\nאבל האמת היא שאני — **ליליה, כוכבת הפופ של המעגל השביעי בגיהנום!** — פרצתי לתוך הסימולטור שלכם במכוון!'",
    choices: [
      { text: "🎵 ינוור החילוני: 'רגע... את זאת ששרה את הלהיט ההוא בספוטיפיי?!'", next: "court_ch2_liliya_spotify_hit" },
      { text: "🥐 ים: 'מה שדת פופ מהגיהנום רוצה מאדם שישן במיטה באורנית?!'", next: "court_ch2_the_secret_motive" },
      { text: "📜 הרב ינוור: 'טפו! שדים ומזיקים באולם בית הדין הקדוש!'", next: "court_ch2_the_secret_motive" }
    ]
  },

  court_ch2_liliya_spotify_hit: {
    speaker: "השדה ליליה",
    music: "audio/boss_fight.mp3",
    sfx: "audio/click.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/liliya.png",
    text: "ליליה מחייכת חיוך מתנשא ומעיפה את שערה הוורוד:\n'ברור שזאת אני! הלהיט שלי **'גיהנום של קלוריות'** עומד על 666 מיליון השמעות ב-Hellify!\nאבל בשנים האחרונות יש לי משבר רייטינג קטסטרופלי! השדים בשאול השתעממו מהמוזיקה שלי, והשטן איים להעיף אותי מהפלייליסט הראשי אם לא אביא להיט קולינרי שישגע את כל הגיהנום!'",
    choices: [
      { text: "🥐 ומה הקשר לים שמואל ולמאפיית אורנית?!", next: "court_ch2_the_secret_motive" }
    ]
  },

  // ==========================================================
  // המניע האמיתי: סוד הבורקס של מאפיית אורנית ורמז לפרק 3!
  // ==========================================================
  court_ch2_the_secret_motive: {
    speaker: "ינוור החילוני (חושף את הקנוניה)",
    music: "audio/נתיבים מיוחדים והרפתקאות.mp3",
    sfx: "audio/crack.mp3",
    deskSlam: true,
    speedlines: true,
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור החילוני מכה בשולחן בעוצמה שמרעידה את האולם:\n'כבוד בית הדין! ים שמואל אינו יעד רומנטי רגיל! ליליה לא הגיעה לכאן בגלל תווי הפנים הישנוניים שלו ולא בגלל סרטוני הגיימינג שלו!\nהיא נשלחה על ידי כוח עליון ומסתורי כדי לשדוד דבר אחד ויחיד שנמצא בחדר השינה הזה:\n**מתכון הבורקס הקדוש והעתיק של מאפיית אורנית!**'\n\nדממת מוות משתררת באולם המשפט.\nהשופט AI מנמיך את מאוורריו ביראת כבוד.",
    choices: [
      { text: "🥐 ים: 'אמרתי לכם! בורקס אורנית שווה יותר מכל הזהב בשאול!'", next: "court_ch2_yam_explains_recipe" },
      { text: "🌌 ליליה: 'ולא סתם... קיבלתי פקודה מגורם קוסמי עליון!'", next: "court_ch2_ch3_foreshadow_clue1" },
      { text: "🤤 השופט AI: 'מתכון אורנית?! אפילו המעבדים שלי מזילים ריר!'", next: "court_ch2_yam_explains_recipe" }
    ]
  },

  court_ch2_ch3_foreshadow_clue1: {
    speaker: "השדה ליליה (רמז ראשון לתעלומה של פרק 3)",
    music: "audio/the_clockwork_void.mp3",
    sfx: "audio/inject.mp3",
    effect: "shake",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/liliya.png",
    text: "ליליה מנמיכה את קולה, ומבטה הופך חרדתי במפתיע:\n'אתה חושב שבאתי לכאן רק בשביל עצמי, ינוור?! ממש לא!\nקיבלתי זימון מ**'האופה העליון של המולטיוורס'**... הסמכות הגבוהה ביותר שמנהלת את רשת המאפיות הקוסמית בכל היקומים!\nהוא הודיע לי ששנת 2030 מתקרבת, ובקרוב יתכנס **'משפט גורל היקום של אורנית' (פרק 3)**! אם לא אביא לו את נוסחת התפיחה של ים — הגיהנום כולו יימחק מרשימת הזכיינים!'",
    choices: [
      { text: "😱 ים: 'האופה העליון של המולטיוורס?! מי זה בכלל?!'", next: "court_ch2_yam_explains_recipe" },
      { text: "📜 הרב ינוור: 'איננו מפחדים משום מאפייה זרה, רק מהבד\"ץ!'", next: "court_ch2_yam_explains_recipe" }
    ]
  },

  court_ch2_yam_explains_recipe: {
    speaker: "ים שמואל (עדות תחת שמיכה)",
    music: "audio/גישה פיזית ודרמטית.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ים חרדי.png",
    text: "ים מנשק את כוס השוקו שבידו ומסביר ברצינות תהומית:\n'המתכון הזה עבר מדור לדור אצל האופים המיסטיים של היישוב אורנית! 9,000 שכבות בצק פילאס פריך, מרגרינה שמיימית, וגבינת קשקבל שנמסה בפה בדיוק ב-180 מעלות!\nבשאול התחתון אין להם מושג באפייה — יש להם רק בורקס אפר יבש ששורף את הגרון!\nליליה ידעה שמי שיחזיק במתכון של אורנית — ימלוך על כל שדי הגיהנום לנצח!'\n\nליליה חושפת ניבים קטנים ומחייכת בעוקצנות:\n'אז גיליתם את המניע שלי, אה? יפה מאוד... אבל בוא נראה אתכם מוכיחים את זה בחקירה נגדית מול בית הדין!'",
    choices: [
      { text: "⚖️ להתחיל במערכה 1: חקירת הפריצה לחדר השינה באורנית!", next: "court_ch2_act1_cross_exam" },
      { text: "🥐 ים: 'רגע! אפשר להזמין טוסט נקניק לפני שמתחילים?!'", next: "court_ch2_act1_cross_exam" }
    ]
  },

  // ==========================================================
  // מערכה 1: חקירה נגדית על הפריצה לחדר באורנית
  // ==========================================================
  court_ch2_act1_cross_exam: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! חקירה נגדית מספר 1 של פרק 2 יוצאת לדרך!* 🔨\n\n'עדות התובעת/הנתבעת ליליה על נסיבות הפריצה לחדר באורנית:\n\n1. \"ירדתי לאורנית ברוח סערה קלה, ודפקתי בדלת בנימוס של בנות מלכים.\"\n2. \"הבאתי איתי פרח ורד ורוד וביקשתי דייט תמים בלבד.\"\n3. \"החדר של ים היה נעול, והוא צעק שהוא ישן ולא פותח לשדים.\"\n4. \"מעולם לא חיפשתי שום מתכון, ואין לי שום עניין בבצק של בני תמותה!\"'\n\nינוור החילוני לוחש לך: 'ליליה משקרת במצח נחושה! חקור את הסעיפים (PRESS) או הצג סתירה (PRESENT)!'",
    choices: [
      { text: "👉 PRESS סעיף 1: 'דפקתי בדלת בנימוס של בנות מלכים'", next: "court_ch2_press_s1" },
      { text: "👉 PRESS סעיף 2: 'הבאתי איתי פרח ורד וביקשתי דייט תמים'", next: "court_ch2_press_s2" },
      { text: "👉 PRESS סעיף 3: 'הוא צעק שהוא ישן ולא פותח לשדים'", next: "court_ch2_press_s3" },
      { text: "👉 PRESS סעיף 4: 'אין לי שום עניין בבצק של בני תמותה'", next: "court_ch2_press_s4" },
      { text: "📑 PRESENT: פתח את תיק המוצגים להצגת סתירה מוחצת!", next: "court_ch2_act1_present_picker" }
    ]
  },

  court_ch2_press_s1: {
    speaker: "ינוור החילוני (חקירה נגדית סעיף 1)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    deskSlam: true,
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'דפקת בנימוס?! ליליה, המנעול של הדלת הותך לחלוטין מלהבות בטמפרטורה של 2,000 מעלות צלזיוס! שום בת מלכים לא דופקת על דלת בעזרת להביור גיהנום שעושה חור בבטון!'\n\nליליה מושכת בכתפיה:\n'הציפורניים שלי היו טיפה חמות, זה הכל! כששדה מתרגשת לקראת דייט, הטמפרטורה שלה עולה מעט!'\n\n*רמז משפטי: הדלת ההרוסה מעידה על האמת!*",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה", next: "court_ch2_act1_cross_exam" },
      { text: "🚪 הצג ישירות את שברי הדלת החרוכים!", next: "court_ch2_present_scorched_door" }
    ]
  },

  court_ch2_press_s2: {
    speaker: "הרב ינוור בייט (מתערב בדיון)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "'התנגדות עזה! שולחתי הביאה ורד ורוד! מה רע במחווה רומנטית אצילית של כבוד הדדי?!'\n\nים צועק מתוך הפוך:\n'הרב ינוור, הוורד הזה היה עשוי מקוצי גופרית מורעלים! הוא נפל על השטיח בחדר והשטיח הפך לעפר תוך שלוש שניות! המזל היחיד שלי שהפוך שלי עשוי מנוצות אווז חסינות אש!'",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה", next: "court_ch2_act1_cross_exam" },
      { text: "📑 מעבר לתיק המוצגים להצגת ראיה", next: "court_ch2_act1_present_picker" }
    ]
  },

  court_ch2_press_s3: {
    speaker: "ינוור החילוני (חוקר בחריפות)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/click.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'אז את מודה במפורש שים הודיע לך שהוא ישן ואינו מעוניין באורחים?! מדוע אם כן המשכת לנסות לפרוץ פנימה במקום לחזור לשאול?!'\n\nליליה צוחקת בקול מתקתק ומפתה:\n'כי גבר שמתחבא ככה מתחת לחמש שמיכות פוך... בטוח מסתיר משהו פריך, חם ושומני במיוחד!'",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה", next: "court_ch2_act1_cross_exam" }
    ]
  },

  court_ch2_press_s4: {
    speaker: "ינוור החילוני (חיוך מנצח)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    zoom: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'אין לך עניין בבצק של בני תמותה?! אם כך, מה עושה מגש בורקס חרוך בתוך תיק האיפור הוורוד שלך ברגעים אלה ממש?!'\n\nליליה מאדימה, מחביאה את התיק מאחורי גבה ומגמגמת:\n'זה... זה חטיף חלבון דמוני! בלי גלוטן!'",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה", next: "court_ch2_act1_cross_exam" }
    ]
  },

  court_ch2_act1_present_picker: {
    speaker: "ינוור החילוני (הצגת ראיה במערכה 1)",
    music: "audio/Panic.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "ינוור החילוני לוחש לך:\n'איזו ראיה מפריכה את השקר של ליליה שהיא בסך הכל דפקה בנימוס על הדלת?!'\n\n(תוכל גם ללחוץ על הכפתור הזוהר בראש המסך: 📑 מוצגים / COURT RECORD)",
    choices: [
      { text: "🚪 הצג: שברי דלת החדר החרוכים (ההוכחה לפריצת גיהנום!)", next: "court_ch2_present_scorched_door" },
      { text: "📜 הצג: שטר עסקת השאול מ-2019", next: "court_ch2_act1_wrong_evidence" },
      { text: "🥐 הצג: מתכון הבורקס הקדוש של אורנית", next: "court_ch2_act1_wrong_evidence" },
      { text: "🛌 ים: 'להציע לליליה לישון איתי במיטה במקום לריב!'", next: "court_ch2_act1_yam_silly_choice" },
      { text: "🔙 חזרה לחקירה הנגדית", next: "court_ch2_act1_cross_exam" }
    ]
  },

  court_ch2_act1_yam_silly_choice: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/Panic.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_horny.png",
    text: "🔨 *בום! הפטיש יורד בעוצמה! קנס 10 HP על הטרדת עדים והתנהגות בלתי הולמת!* 🔨\n\n'הנאשם נדרש לחדול מיידית מהצעות מגונות לשדות מהשאול בעיצומו של הליך פלילי!\nבית הדין אינו מועדון היכרויות לרווקים עצלנים!'\n\nים מתקפל: 'אבל רק רציתי לחסוך בהוצאות חימום בחורף!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(10, "הצעת שינה בלתי הולמת לשדה!");
    },
    choices: [
      { text: "🔙 חזרה להצגת ראיות אמיתיות", next: "court_ch2_act1_present_picker" }
    ]
  },

  court_ch2_act1_wrong_evidence: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/Panic.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! קנס של 20 נקודות HP!* 🔨\n\n'הראיה הזו אינה סותרת בשום אופן את הטענה שליליה דפקה בנימוס על הדלת!\nבית הדין קונס את הצד המייצג ב-20 נקודות HP עקב בזבוז זמן מעבדים!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(20, "ראיה שגויה!");
    },
    choices: [
      { text: "🔙 חזרה לדוכן העדים לתיקון הטעות", next: "court_ch2_act1_cross_exam" }
    ]
  },

  court_ch2_present_scorched_door: {
    speaker: "ינוור החילוני (התנגדות אדירה!)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    objection: true,
    deskSlam: true,
    speedlines: true,
    effect: "shake",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "💥 *OBJECTION! חבטה אדירה בשולחן!* 💥\n\n'העדות הזאת מתפרקת לרסיסים!\nהבט במוצג הזה, כבוד השופט: שרידי דלת חדר השינה של ים מאורנית!\nעל העץ החרוך חרוטות במדויק מילות הקסם העתיקות בשפת השאול:\n*\"תביאו את הבורקס של אורנית או שכל השרת יושמד!\"*'\n\nליליה נרתעת לאחור, כנפיה השחורות רועדות:\n'איך... מאיפה השגתם את הדלת הזאת?! שמרתם את הגזם של הבניין?!'",
    choices: [
      { text: "📜 הרב ינוור: 'עכשיו הגיע הזמן לחשוף את חוזה השאול!'", next: "court_ch2_act2_the_contract_conspiracy" },
      { text: "🥐 ים: 'הדלת הזאת עלתה לי 400 ש\"ח באיקאה!'", next: "court_ch2_act2_the_contract_conspiracy" }
    ]
  },

  // ==========================================================
  // מערכה 2: חשיפת חוזה 2019 וסוד הבוט מדיסקורד
  // ==========================================================
  court_ch2_act2_the_contract_conspiracy: {
    speaker: "הרב ינוור בייט (טוען רבני)",
    music: "audio/נתיבים מיוחדים והרפתקאות.mp3",
    sfx: "audio/click.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "הרב ינוור בייט שולף שטר קלף אפל עטוף בחוטים שחורים:\n'עברנו לשלב הבא! בידי שטר עסקת השאול מ-2019!\nליליה טוענת שים חתם איתה על ברית נצחית בשעה 03:33 לפנות בוקר בשרת הדיסקורד של הערוץ, שבו התחייב למסור לה את כל נכסיו הרוחניים ומתכוני האפייה בתמורה לחצי פיצה!\nאבל משהו בחתימה הזאת מריח לי כמו זיוף חילוני מתועב!'",
    choices: [
      { text: "🧐 לבחון את החוזה מקרוב: מה באמת קרה ב-03:33 לפנות בוקר?", next: "court_ch2_act2_cross_exam_contract" },
      { text: "🛌 ים: 'ב-03:33 בלילה אני בדרך כלל רואה סרטונים של איך מכינים חרבות מפלדה!'", next: "court_ch2_act2_yam_alibi" }
    ]
  },

  court_ch2_act2_yam_alibi: {
    speaker: "ים שמואל (אליבי לילי)",
    music: "audio/גישה פיזית ודרמטית.mp3",
    sfx: "audio/click.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_curious.png",
    text: "ים מגרד את פדחתו:\n'כבוד השופט, יש לי אליבי מוצק כמו בטון! ב-03:33 בלילה אני בחיים לא חותם על חוזים! בשעה הזאת אני צופה בשורטס של הודי שבונה בריכה עם מקל בתוך יער, או שנרדמתי כשהטלפון נופל לי על האף!'\n\nינוור Prime מרים גבה: 'בוא נבדוק את הלוגים של השרת!'",
    choices: [
      { text: "📜 לפתוח את החקירה הנגדית על חוזה 2019!", next: "court_ch2_act2_cross_exam_contract" }
    ]
  },

  court_ch2_act2_cross_exam_contract: {
    speaker: "השדה ליליה (עדות על החוזה)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/liliya.png",
    text: "ליליה מציגה את הקלף לשופט AI:\n\n1. \"ים חתם על החוזה בעצמו בערוץ הוולקאם של השרת בשעה 03:33!\"\n2. \"החתימה כללה אימוג'י בורקס והבטחה לדייט נצחי במאפייה!\"\n3. \"ההסכם אושר על פי כל דיני השאול והאינטרנט של מדינת ישראל!\"\n\nינוור Prime לוחש לך: 'משהו פה לא הגיוני! חקור את הטענות (PRESS) או הצג את הראיה שתפיל את התיק (PRESENT)!'",
    choices: [
      { text: "👉 PRESS סעיף 1: 'החתימה בערוץ הוולקאם של השרת'", next: "court_ch2_press_contract_s1" },
      { text: "👉 PRESS סעיף 2: 'האימוג'י של הבורקס והדייט'", next: "court_ch2_press_contract_s2" },
      { text: "👉 PRESS סעיף 3: 'דיני האינטרנט של מדינת ישראל'", next: "court_ch2_press_contract_s3" },
      { text: "📑 PRESENT: הצג ראיה שחושפת מי באמת חתם על ההודעה!", next: "court_ch2_act2_present_picker" }
    ]
  },

  court_ch2_press_contract_s1: {
    speaker: "ינוור החילוני (חוקר את שרתי הדיסקורד)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    deskSlam: true,
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'ערוץ הוולקאם?! ליליה, ערוץ הוולקאם של השרת נעול לחלוטין לכתיבה עבור משתמשים רגילים! רק בוטים מורשים לשלוח שם הודעות!'\n\nליליה ממצמצת במבוכה: 'אולי הוא שלח את זה בפרטי?!'\n\n*רמז משפטי: החתימה אינה אנושית!*",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה על החוזה", next: "court_ch2_act2_cross_exam_contract" }
    ]
  },

  court_ch2_press_contract_s2: {
    speaker: "הרב ינוור בייט",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "'אימוג'י בורקס אינו מהווה חתימה הלכתית בשום בית דין רבני בארץ ובעולם! על פי ההלכה נדרשת חתימת שני עדים כשרים שאינם קרובי משפחה ולא אכלו שרצים!'",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה על החוזה", next: "court_ch2_act2_cross_exam_contract" }
    ]
  },

  court_ch2_press_contract_s3: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/inject.mp3",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "'בית הדין בדק בספר החוקים: אין שום סעיף בחוק החוזים הישראלי המכיר בחוזים שנחתמו בין בני תמותה לשדות פופ מקרקעית השאול!'",
    choices: [
      { text: "🔙 חזרה לעדות של ליליה על החוזה", next: "court_ch2_act2_cross_exam_contract" }
    ]
  },

  court_ch2_act2_present_picker: {
    speaker: "ינוור החילוני (הצגת ראיה במערכה 2)",
    music: "audio/Panic.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "איזו ראיה מוכיחה שהחתימה על שטר 2019 היא זיוף טכנולוגי מוחלט?!",
    choices: [
      { text: "📜 הצג: שטר עסקת השאול מ-2019 (בדיקת חתימת הבוט Mee6!)", next: "court_ch2_inspecting_contract" },
      { text: "📑 הצג: שטר יששכר וזבולון המזויף", next: "court_ch2_inspecting_contract" },
      { text: "🛵 הצג: קבלת Wolt השאול המזויפת", next: "court_ch2_act2_wrong_evidence" }
    ]
  },

  court_ch2_act2_wrong_evidence: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/Panic.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! קנס 20 HP!* 🔨\n'הראיה הזו אינה קשורה לחתימת החוזה בדיסקורד! קנס על שגיאה משפטית!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(20, "ראיה שגויה!");
    },
    choices: [
      { text: "🔙 חזרה לבחירת הראיה הנכונה", next: "court_ch2_act2_present_picker" }
    ]
  },

  court_ch2_inspecting_contract: {
    speaker: "ינוור החילוני (חשיפת הבוט)",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    objection: true,
    deskSlam: true,
    speedlines: true,
    zoom: true,
    effect: "shake",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "💥 *OBJECTION! חבטה אדירה בשולחן הדיונים!* 💥\n\n'הבט בפינה השמאלית התחתונה של החוזה, כבוד השופט!\nהחתימה הזאת היא לא של ים שמואל!\nזהו Embed של **הבוט Mee6** ששלח הודעת Auto-Reply אוטומטית:\n*\"Welcome @Liliya to Yam's Official Bed Server! Type !burkas to get a role!\"*\n\nליליה לקחה הודעת ברכה אוטומטית של בוט חינמי מדיסקורד וניסתה להפוך אותה לחוזה שעבוד נשמות!'\n\nליליה נשנקת: 'אבל... היה כתוב שם Bot Verified עם וי כחול!'",
    choices: [
      { text: "🛵 אך בדיוק אז... רעש מנוע של קטנוע עולה מחוץ לחלון!", next: "court_ch2_act3_wolt_demon_entrance" }
    ]
  },

  // ==========================================================
  // מערכה 3: עד ההפתעה — שד הוולט מהגיהנום
  // ==========================================================
  court_ch2_act3_wolt_demon_entrance: {
    speaker: "רעש מנוע צורמני וריח דלק שרוף",
    music: "audio/Panic.mp3",
    sfx: "audio/break.mp3",
    effect: "shake",
    characterAnimation: "slide_in",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🛵 *וורום... וורוום! חראאאאק!* 🛵\n\nדלתות העזר של האולם נפתחות לרווחה, וקטנוע שחור עם להבות אדומות נכנס בנסיעה פרועה!\nעל הקטנוע יושב דמות מוזרה: מעיל עור שחור, קסדה עם קרניים לוהטות, ועל גבו תיק וולט מבודד בצבע תכלת שפולט עשן גופרית כחול!\n\nהשליח מוריד את הקסדה:\n'מי הזמין פה בורקס פילאס כפול עם ביצה קשה לאורנית?!'\n\nליליה קופצת משמחה: 'הנה העד המרכזי שלי! שד הוולט מהשאול!'",
    choices: [
      { text: "🛵 ים: 'רגע... יש לו בורקס חם בתוך התיק?!'", next: "court_ch2_yam_smells_delivery" },
      { text: "📜 הרב ינוור: 'שליח בשבת ובמועד?! באיזו רשות הוא נוסע?!'", next: "court_ch2_act3_wolt_demon_testimony" },
      { text: "🖥️ ינוור Prime: 'תן לי לראות את הקבלה הדיגיטלית של הנסיעה!'", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_yam_smells_delivery: {
    speaker: "ים שמואל (מריח את התיק המבודד)",
    music: "audio/Panic.mp3",
    sfx: "audio/click.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "ים מרחרח את האוויר בעיניים בורקות:\n'הריח הזה... פילאס עם מרגרינה וגבינת טוב טעם! שד נכבד, אם הבאת חמוצים וטחינה אני חותם על הטיפ עכשיו!'\n\nינוור החילוני סוטר קלות על פניו של ים:\n'תתעורר, אידיוט! הוא בא להעיד נגדך כדי להכניס אותך למאסר עולם בשאול!'",
    choices: [
      { text: "🛵 לשמוע את עדות שד הוולט!", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_act3_wolt_demon_testimony: {
    speaker: "שד הוולט מהגיהנום (עד תביעה מפתיע)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "שד הוולט מציב את הקבלה על דוכן העדים ומעיד בקול מחוספס:\n\n1. \"קיבלתי קריאת משלוח ישירה מים שמואל ב-14:00 ממאפיית אורנית.\"\n2. \"נסעתי דרך 7 מדורי גיהנום וחוצה שומרון כדי להביא לו את המאפה.\"\n3. \"כשהגעתי, ים סירב לפתוח את הדלת וטען שהוא ישן ולא משלם טיפ.\"\n4. \"יש לי קבלה מודפסת המוכיחה שההזמנה יצאה מהמאפייה בדיוק במועד!\"\n\nינוור החילוני והרב ינוור בוחנים את הקבלה במבט חד.",
    choices: [
      { text: "👉 PRESS סעיף 1: 'קריאת משלוח ב-14:00 ממאפיית אורנית'", next: "court_ch2_press_wolt_s1" },
      { text: "👉 PRESS סעיף 2: 'נסעתי דרך 7 מדורי גיהנום וחוצה שומרון'", next: "court_ch2_press_wolt_s2" },
      { text: "👉 PRESS סעיף 3: 'ים סירב לשלם טיפ'", next: "court_ch2_press_wolt_s3" },
      { text: "👉 PRESS סעיף 4: 'קבלה מודפסת ממאפיית אורנית'", next: "court_ch2_press_wolt_s4" },
      { text: "📑 PRESENT: הצג ראיה שחושפת את השקר הגדול של שד הוולט!", next: "court_ch2_act3_present_picker" }
    ]
  },

  court_ch2_press_wolt_s1: {
    speaker: "הרב ינוור בייט (זעם קדוש)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    deskSlam: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/ינוור החרדי.png",
    text: "'התבוננו בתאריך שעל הקבלה! יום כיפור בשעה 14:00 בצהריים?! מאפיית אורנית היא מאפייה כשרה למהדרין מן המהדרין! שום תנור לא דלק שם ביום כיפור מאז קום המדינה!'\n\nשד הוולט מזיע גופרית: 'אולי... אולי זה היה שעון חורף?!'",
    choices: [
      { text: "🔙 חזרה לעדות שד הוולט", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_press_wolt_s2: {
    speaker: "ינוור החילוני",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/click.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'דרך 7 מדורי גיהנום וחוצה שומרון?! כמה זמן לקח לך המשלוח?!'\n\nשד הוולט מגרד את הקרניים:\n'שעתיים וחצי. הבעיה לא הייתה הגיהנום, הבעיה הייתה למצוא חניה באורנית ליד הכיכר!'",
    choices: [
      { text: "🔙 חזרה לעדות שד הוולט", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_press_wolt_s3: {
    speaker: "ים שמואל",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/hit.mp3",
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    text: "'אני תמיד משלם טיפ! לפעמים אני משלם במטבעות של 10 אגורות שמצאתי מתחת למזרן, אבל טיפ זה טיפ!'",
    choices: [
      { text: "🔙 חזרה לעדות שד הוולט", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_press_wolt_s4: {
    speaker: "ינוור החילוני (חיוך מנצח)",
    music: "audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3",
    sfx: "audio/crack.mp3",
    zoom: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "'הקבלה הזאת היא זיוף מגוחך! וולט בכלל לא פעל ביישוב אורנית באותה שנה!\nהם עשו משלוחים רק בתל אביב ורמת גן!'",
    choices: [
      { text: "🔙 חזרה לעדות שד הוולט להצגת הראיה", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_act3_present_picker: {
    speaker: "ינוור החילוני (הצגת ראיה במערכה 3)",
    music: "audio/Panic.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/invar.png",
    text: "איזו ראיה מפריכה את עדות שד הוולט וחושפת את הקנוניה של ליליה?!",
    choices: [
      { text: "🛵 הצג: קבלת Wolt השאול המזויפת (יום כיפור 14:00!)", next: "court_ch2_wolt_demon_contradiction" },
      { text: "🌡️ הצג: מדחום תא ההתפחה של המיטה", next: "court_ch2_bed_dough_explanation" },
      { text: "🚪 הצג: שברי דלת החדר החרוכים", next: "court_ch2_act3_wrong_evidence" }
    ]
  },

  court_ch2_act3_wrong_evidence: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/Panic.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! קנס 20 HP על ראיה לא מתאימה!* 🔨\n'הראיה הזו אינה מפריכה את שקר המשלוח ביום כיפור!\nהפחתת HP מבוצעת מידית!'",
    onEnter: function() {
      if (window.courtEngine) window.courtEngine.takeDamage(20, "ראיה שגויה!");
    },
    choices: [
      { text: "🔙 חזרה לעדות שד הוולט", next: "court_ch2_act3_wolt_demon_testimony" }
    ]
  },

  court_ch2_wolt_demon_contradiction: {
    speaker: "הרב ינוור בייט וינוור החילוני יחד",
    music: "audio/boss_fight.mp3",
    sfx: "audio/crack.mp3",
    holdIt: true,
    deskSlam: true,
    speedlines: true,
    effect: "shake",
    dualInvars: true,
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "💥 *HOLD IT! התנגדות כפולה של שני הינוורים באותו קול!* 💥\n\nהרב ינוור בייט מרעים בקולו:\n'מאפיית אורנית סגורה ומסורגת ביום כיפור על פי חוקי התורה ומנהג אבותינו!'\n\nינוור החילוני מנופף בקבלה:\n'והקוד שעל הקבלה מוכיח שהבורקס נקנה בכלל בסופרמרקט קפוא של שדים בבני ברק! ליליה שילמה לשד הוולט 200 שקלים ב-Bit כדי שיבוא לשקר בבית הדין!'\n\nשד הוולט זורק את התיק ובורח דרך החלון: 'אני רק שליח עצמאי, אין לי יחסי עובד-מעביד איתה!'",
    choices: [
      { text: "🥐 ים: 'כעת הגיע הזמן לחשוף את הסוד המדעי האמיתי של המיטה!'", next: "court_ch2_bed_dough_explanation" }
    ]
  },

  // ==========================================================
  // הסוד הגדול של המיטה והחשיפה המטא-משחקית של הסימולטור
  // ==========================================================
  court_ch2_bed_dough_explanation: {
    speaker: "ים שמואל (החשיפה המדעית והמטא-משחקית)",
    music: "audio/בואי תמי (גרסא לדייטים).mp3",
    sfx: "audio/truimph.mp3",
    zoom: true,
    characterAnimation: "bounce",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/yam_happy.png",
    holdIt: true,
    text: "ים נאנח עמוקות, שולף את מדחום המיטה ומחייך בגאווה:\n'האמת היא... שמעולם לא גנבתי שום מתכון ממאפיית אורנית!\nהסוד האמיתי של הבורקס המושלם שלי... הוא **המיטה עצמה**!'\n\nהשופט AI וליליה מביטים בו פעורי פה: 'המיטה?!'\n\nים מסביר:\n'כשאני שוכב 48 שעות רצוף במיטה בלי לזוז, חום הגוף שלי שומר על טמפרטורה מדויקת של 37 מעלות צלזיוס קבועה תחת שמיכת הפוך! זה מייצר תא התפחה ביולוגי מושלם שאין בשום מאפייה בעולם!\nהבצק תופח בנחת, השומן נספג באופן שווה, ויוצא המאפה הכי נימוח ביקום!\nליליה... כל המשחק הזה שנקרא **'ים דייט סימולטור'**... הוא ניסיון של ינוור לגרום לי לקום מהמיטה! ואת ניסית לנצל אותו כדי לשדוד את חום השמיכה שלי!'",
    choices: [
      { text: "👑 השופט AI מוכן להכריז על פסק הדין המוחץ בתיק 2!", next: "court_ch2_verdict_victory" }
    ]
  },

  // ==========================================================
  // פסק הדין: ניצחון בתיק 2!
  // ==========================================================
  court_ch2_verdict_victory: {
    speaker: "כבוד אב בית הדין (שופט AI)",
    music: "audio/truimph.mp3",
    sfx: "audio/hit.mp3",
    gavel: true,
    effect: "flash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🔨 *בום! בום! בום! הכרעת הדין בתיק מספר 2!* 🔨\n\n'בית הדין הגדול קובע בזאת פה אחד:\n1. הנתבע ים שמואל זכאי לחלוטין מכל אשמת גזל מתכון או הפרת חוזה שאול!\n2. שטר חוזה 2019 מבוטל עקב היותו הודעת בוט אוטומטית חסרת תוקף!\n3. השדה ליליה ננזפת בחומרה על הצתת דלתות, שימוש בשליחי שקר ובזבוז שעות שינה יקרות!'\n\nליליה מביטה בים, מתנשפת, ועיניה הצהובות מתמלאות בהערצה שקטה:\n'ים... אתה באמת אמן הפחמימות העצלן והגאוני ביותר שפגשתי ב-400 שנות קיומי...'",
    choices: [
      { text: "🎉 ינוור החילוני והרב ינוור חוגגים את הניצחון בתיק 2!", next: "court_ch2_celebration_interrupted" }
    ]
  },

  // ==========================================================
  // החגיגה נקטעת: בלאקאאוט, אזעקות ומפגש המאסטרמיינד של פרק 3!
  // ==========================================================
  court_ch2_celebration_interrupted: {
    speaker: "ינוור החילוני והרב ינוור בייט",
    music: "audio/truimph.mp3",
    sfx: "audio/crack.mp3",
    dualInvars: true,
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "ינוור החילוני מניף את מקלדת ה-RGB שלו באוויר:\n'יששש! ניצחנו! ים משוחרר מכל תביעות השאול ויכול לחזור לערוך סרטונים ליוטיוב!'\n\nהרב ינוור בייט מוחא כפיים בהתלהבות ורוקד הורה:\n'ברוך השם! ואפילו הבורקס במיטה נשאר כשר למהדרין בהשגחה צמודה!'\n\nאך בדיוק באותה השנייה שבה השופט עומד לנעול את הפרוטוקול...",
    choices: [
      { text: "⚡ בום! כל האורות באולם בית הדין כבים בבת אחת!", next: "court_ch2_the_blackout" }
    ]
  },

  court_ch2_the_blackout: {
    speaker: "מערכת החירום של בית הדין",
    music: "audio/the_clockwork_void.mp3",
    sfx: "audio/break.mp3",
    blackout: true,
    speedlines: true,
    effect: "redflash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🚨 *וואו... וואו... וואו... סירנות אזעקה אדומות מחרישות אוזניים!* 🚨\n\nכל המנורות באולם מתנפצות ברעש זכוכיות!\nמסכי ה-AI של השופט מרצדים בקוד אדום של קריסת מערכת כוללת, ועשן סמיך מתפרץ מלוח האם:\n\n*אזהרה דרגה 10! שיבוש קוסמי ברשת המשחק! פריצה בלתי מורשית מגורם עליון!*\n\nהשופט AI זועק באימה דיגיטלית:\n'זה... זה בלתי אפשרי! מישהו מחק את חומת האש של בית הדין! מישהו שיצר את הסימולטור עצמו!'",
    onEnter: function() {
      if (typeof triggerVibration === "function") triggerVibration([300, 100, 400, 100, 600]);
    },
    choices: [
      { text: "👀 צל ענק ומסתורי עוטה ברדס מוזהב מופיע על מסכי הענק!", next: "court_ch2_shadow_mastermind_reveal" }
    ]
  },

  court_ch2_shadow_mastermind_reveal: {
    speaker: "האופה העליון של המולטיוורס (המאסטרמיינד של פרק 3)",
    music: "audio/the_clockwork_void_extend.mp3",
    sfx: "audio/crack.mp3",
    zoom: true,
    holdIt: true,
    effect: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "על מסך הענק המרצד מופיעה דמות צללים עטוית ברדס מוזהב ומאחוריה תנור קוסמי בוער בגודל של כוכב לכת!\nקולה מהדהד ברחבי האולם כאילו הרמקולים עומדים להתפוצץ:\n\n*'חה חה חה... בני תמותה עלובים! חשבתם שתיק מספר 2 נגמר?! חשבתם שהכל היה רק ריב מקומי על שמיכה ושדת פופ מהשאול?!*\n*ליליה... ינוור Prime... הרב ינוור... וים שמואל... כולכם הייתם בסך הכל שפני ניסיון בסימולציית ההכשרה שלי!*\n*אני הוא מייסד רשת המאפיות הקוסמית — האופה העליון של המולטיוורס!*'",
    choices: [
      { text: "❓ 'מי אתה ומה אתה רוצה מאיתנו וממאפיית אורנית?!'", next: "court_ch2_mastermind_interrogate_who" },
      { text: "🥐 'למה תא התפחת המיטה של ים כל כך קריטי ליקום?!'", next: "court_ch2_mastermind_interrogate_dough" },
      { text: "⚔️ 'מה צפוי לקרות בפרק 3?! איזה משפט מחכה לנו?!'", next: "court_ch2_mastermind_interrogate_ch3" }
    ]
  },

  court_ch2_mastermind_interrogate_who: {
    speaker: "האופה העליון של המולטיוורס",
    music: "audio/the_clockwork_void_extend.mp3",
    sfx: "audio/inject.mp3",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "'אני הוא זה שאפה את הגלקסיות עוד לפני שהיה גלוטן ביקום!\nבניתי את 'ים דייט סימולטור' כרשת מבחנים סודית כדי למצוא את האדם בעל חום הגוף העצלן ביותר בעולם!\nרק אדם שיכול לשכב 48 שעות רצוף במיטה בלי לנקוף אצבע מסוגל להתפיח את **'בצק האומגה'** שיציל את המולטיוורס ממשבר הפחמימות הגדול של 2030!'",
    choices: [
      { text: "⚔️ 'ומה הולך לקרות בפרק 3?!'", next: "court_ch2_mastermind_interrogate_ch3" },
      { text: "🥐 'למה דווקא הבצק של ים?!'", next: "court_ch2_mastermind_interrogate_dough" }
    ]
  },

  court_ch2_mastermind_interrogate_dough: {
    speaker: "האופה העליון של המולטיוורס",
    music: "audio/the_clockwork_void_extend.mp3",
    sfx: "audio/click.mp3",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "'מכונות האפייה המתקדמות ביותר בשביל החלב שורפות את הבצק! תנורי לייזר מפרקים את הקשקבל לרדיקלים חופשיים!\nרק שמיכת פוך אנושית של יוטיובר שלא קם מהמיטה שומרת על 37 מעלות מושלמות!\nליליה נשלחה לקחת את הבצק — אך היא נכשלה כי התאהבה בעצלנות שלך!'",
    choices: [
      { text: "⚔️ 'ומה עומד לקרות בפרק 3?! גלה לנו עכשיו!'", next: "court_ch2_mastermind_interrogate_ch3" }
    ]
  },

  court_ch2_mastermind_interrogate_ch3: {
    speaker: "האופה העליון של המולטיוורס (חשיפת פרק 3!)",
    music: "audio/the_clockwork_void_extend.mp3",
    sfx: "audio/crack.mp3",
    zoom: true,
    deskSlam: true,
    speedlines: true,
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "'שמעו היטב את נבואת פרק 3 — **'משפט גורל היקום של מאפיית אורנית'**:\n\nבפרק 3 בית הדין יועתק ישירות אל עין הסערה הקוסמית במרכז הגלקסיה!\nשם תעמדו למשפט מול: \n1. **תנור המכה הקוסמי** — בינה מלאכותית מפלצתית שחורצת גורלות באש 5,000 מעלות!\n2. **אינקוויזיציית הקרואסון הבין-ממדית** שתובעת את השמדת כל הבורקסים בעולם!\n3. וים שמואל יצטרך להעיד מתוך **חליפת מכה-מיטה משוריינת** עם 10 שמיכות פוך!\n\nאם תפסידו במשפט של פרק 3 — כל הפחמימות, היוטיוב והדייטים של היקום יימחקו לנצח!'",
    choices: [
      { text: "😱 ים, ליליה ושני הינוורים כורתים ברית היסטורית!", next: "court_ch2_cliffhanger_alliance" }
    ]
  },

  court_ch2_cliffhanger_alliance: {
    speaker: "ליליה, ינוור Prime והרב ינוור בייט",
    music: "audio/boss_fight.mp3",
    sfx: "audio/inject.mp3",
    blackout: false,
    effect: "shake",
    characterAnimation: "shake",
    bg: "images/backgrounds/בית משפט.png",
    character: "images/characters/liliya.png",
    text: "המסכים כבים לאיטם, ועשן הקרב מתפזר באולם.\nליליה מוחה טיפת זיעה ממצחה, תופסת את ידו של ינוור Prime ומביטה ברב ינוור:\n'שמעתם אותו?! אם הוא ישתלט על המאפייה הקוסמית — אין יותר מוזיקה, אין יותר ערוצי יוטיוב, ואין יותר בורקס לאף אחד!'\n\nינוור Prime מהדק את אוזניות הגיימינג שלו:\n'משמע... כדי לשרוד את פרק 3... אויבי אתמול יצטרכו להפוך לצוות הגנה בלתי מנוצח של מחר!'\n\nהרב ינוור בייט מנשק את ספרי השו\"ת:\n'אני מכין את הטיעונים ההלכתיים הקשים ביותר כנגד אינקוויזיציית הקרואסון!'\n\nים מציץ מתוך השמיכה בחיוך ישנוני:\n'אז... זה אומר שאני יכול להישאר במיטה עד שפרק 3 ייצא?!'\n\nכולם צועקים עליו ביחד בהד מחריש אוזניים: **'לאאאאא!!!'**",
    choices: [
      { text: "🎬 לצפות במסך הסיום הרשמי והדוסייר של פרק 3!", next: "end_court_ch2_to_be_continued" }
    ]
  },

  // ==========================================================
  // מסך סיום פרק 2 — TO BE CONTINUED IN COURT CHAPTER 3!
  // ==========================================================
  end_court_ch2_to_be_continued: {
    speaker: "הנהלת בית הדין (Ace Attorney - סיום פרק 2)",
    music: "audio/ים דייט סימולטור - תפריט ראשי.mp3",
    sfx: "audio/truimph.mp3",
    effect: "flash",
    bg: "images/backgrounds/בית משפט.png",
    character: false,
    text: "🏆 **תיק מספר 2 הושלם בהצלחה מוחצת!** 🏆\n\n✓ הוכחת את חפותו של ים שמואל מול תביעת השאול!\n✓ פתרת את פרדוקס שני הינוורים (Invar Prime vs הרב ינוור)!\n✓ חשפת את שקר שד הוולט ביום כיפור ואת חתימת הבוט Mee6!\n✓ פיצחת את המדע שמאחורי תא התפחת המיטה וסימולטור הדייטים!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🌌 **נפתח בתיק המוצגים: פרוטוקול תיק 3!**\n🔥 **בקרוב בעדכון הבא של המשחק:**\n⚖️ **פרק 3: משפט גורל היקום של מאפיית אורנית!**\n(קרב המכה-מיטה מול האופה העליון ואינקוויזיציית הקרואסון!)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nתודה ששיחקתם בפרק 2!",
    end: true,
    choices: [
      { text: "🏛️ חזרה לתפריט בחירת התיקים (Case Select)", next: "court_menu" },
      { text: "🔄 התחלת המשחק מחדש מההתחלה", next: "start" }
    ]
  }

});
