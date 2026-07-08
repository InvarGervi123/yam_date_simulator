// --- Story Chapter: MAIN ---
Object.assign(window.story, {
  start: {
    speaker: "המספר",
    music: "audio/main.mp3",
    character: "images/yam_horny.png",
    text: "ברוכה הבאה לים דייט סימולטור: גרסת האסון הרומנטי.\n\nהמטרה פשוטה: לשכנע את ים לצאת איתך לדייט.\nהבעיה: ים שוכב במיטה כאילו המיטה חתמה איתו חוזה בלעדיות ל־40 שנה.",
    choices: [
      { text: "להיכנס לחדר של ים", next: "room_intro" },
      { text: "לבדוק קודם אם המשחק בכלל עובד", next: "debug_room" }
    ]
  },

  debug_room: {
    speaker: "המשחק",
    text: "בדיקת מערכת:\nרקע: אם יש room.jpg הוא יופיע. אם אין, יהיה רקע שחור־אפור ולא קריסה.\nדמות: אם יש yam.png היא תופיע. אם אין, המשחק עדיין עובד.\nאודיו: אם יש main.mp3 הוא יתנגן אחרי קליק. אם אין, המשחק לא מתאבד טכנית.\n\nמסקנה: גם הקוד פחות שבור מהחיים עצמם.",
    choices: [
      { text: "יופי, עכשיו להתחיל את הדרמה", next: "room_intro" }
    ]
  },

  room_intro: {
    speaker: "המספר",
    text: "את נכנסת לחדר.\nים במיטה.\nהחדר חשוך.\nהאוויר כבד.\nהכרית נראית כאילו היא כבר שמעה את כל התירוצים שלו ומבקשת חסינות דיפלומטית.",
    choices: [
      { text: "🌸 לנסות גישה רגועה ורומנטית...", next: "room_intro_normal" },
      { text: "🔥 לנסות גישה פיזית ודרמטית...", next: "room_intro_force" },
      { text: "🔮 לחקור נתיבים מיוחדים והרפתקאות...", next: "room_intro_special" }
    ]
  },

  room_intro_normal: {
    speaker: "המספר",
    text: "בחרת בגישה רגועה ורומנטית. כיצד תרצי לפנות אליו?",
    choices: [
      { text: "ים, בוא לדייט קטן וזהו", next: "simple_offer" },
      { text: "אני אביא בורקס", next: "burekas_path" },
      { text: "לשאול אותו בעדינות: 'ים, למה אתה בדיכאון ולא רוצה לקום?'", next: "yam_depression_ask" },
      { text: "לשבת לידו בשקט כמו בן אדם נורמלי", next: "quiet_path" },
      { text: "🔙 חזרה לאפשרויות הראשיות", next: "room_intro" }
    ]
  },

  room_intro_force: {
    speaker: "המספר",
    text: "בחרת בגישה פיזית, קשוחה או דרמטית. מה התוכנית שלך?",
    choices: [
      { text: "לנסות לפרוץ למגירה הסודית שלו בזמן שהוא ישן (משחק עיתוי!)", next: "steal_drawer_prep" },
      { text: "לנסות לגרור אותו בכוח מהמיטה (משחק לחיצות!)", next: "drag_yam_prep" },
      { text: "לעשות נאום דרמטי כאילו זה סוף העולם", next: "dramatic_speech" },
      { text: "להגיד לו שאני עוברת לינוור", next: "yinover_threat" },
      { text: "להציע לו לחסום את כביש 4 כי הבטיחו עוגת גבינה חינם לחוסמים", next: "block_highway_protest" },
      { text: "🔙 חזרה לאפשרויות הראשיות", next: "room_intro" }
    ]
  },

  room_intro_special: {
    speaker: "המספר",
    text: "בחרת לחקור נתיבים מיוחדים והרפתקאות מחוץ לקופסה. לאן נמשיך?",
    choices: [
      { text: "להכריז על קרב בוס אפי! (DELTARUNE BOSS FIGHT!)", next: "boss_fight_intro" },
      { text: "לפתור איתו תרגילים בטאבלט הלימודי שלו (Baldi's Basics!)", next: "baldi_intro" },
      { text: "לנסוע לאורנית לחפש את ים בביתו (נתיב אורנית והקסם!)", next: "oranit_travel" },
      { text: "לדבר איתו על החלום שלו לעבור לתל אביב", next: "tel_aviv_dream" },
      { text: "לגרור את ים בדיזינגוף סנטר כשהוא עדיין בתוך המיטה (דייט סנטר!)", next: "center_bed_intro" },
      { text: "להעמיד את ים למשפט על הזנחת הערוץ והדייט! (Ace Attorney!)", next: "court_intro" },
      { text: "לראות סרטון של 'נמר הכסף' בשביל המוטיבציה", next: "namer_kasef_intro" },
      { text: "לבקש מים שילמד אותך מתמטיקה לקראת המבחן", next: "math_study_intro" },
      { text: "🔙 חזרה לאפשרויות הראשיות", next: "room_intro" }
    ]
  },

  simple_offer: {
    character: "images/yam_horny.png",
    speaker: "ים",
    characterAnimation: "float",
    text: "'דייט? עכשיו?\nאני עסוק ב־INVARIRON, בים שמואל הפקות, ובפרויקט הכי חשוב שלי: לא לזוז.'",
    choices: [
      { text: "הערוצים יכולים לחכות. אהבה לא", next: "love_vs_channels" },
      { text: "אני אעשה סאב לשני הערוצים", next: "sub_offer" },
      { text: "אז נעשה דייט דרך מסך", next: "screen_date" },
      { text: "אתה מגזים אחושרמוטה", next: "too_aggressive" }
    ]
  },

  love_vs_channels: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "ים מסתכל עלייך כאילו הרגע הצעת למחוק לו את ההיסטוריה ביוטיוב.\n\n'אהבה לא יכולה לחכות?\nיפה. גם האלגוריתם לא. האלגוריתם רעב. האלגוריתם לא ישן. האלגוריתם לא שואל מה שלומך.'",
    choices: [
      { text: "אני אהיה האלגוריתם שלך", next: "algorithm_love" },
      { text: "אז נצלם את הדייט לערוץ", next: "content_date" },
      { text: "עזוב, זה כבר נהיה עצוב", next: "sad_truth" }
    ]
  },

  algorithm_love: {
    speaker: "ים",
    character: "images/yam_dead.png",
    characterAnimation: "bounce",
    text: "'את... תהיי האלגוריתם שלי?'\n\nהוא מתרגש.\nלא כי זה רומנטי, אלא כי זו הפעם הראשונה שמישהו אמר לו משפט יותר מטומטם מהתירוצים שלו.",
    choices: [
      { text: "כן. אני אמליץ לך על חיבוקים", next: "end_algorithm" },
      { text: "לא משנה, זה יצא קרינג'", next: "cringe_recovery" }
    ]
  },

  content_date: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "'דייט כתוכן?'\n\nים קם חצי סנטימטר מהמיטה.\nזה לא נשמע הרבה, אבל מבחינת פיזיקה זה כמו נחיתה על הירח עם כפכפים.",
    choices: [
      { text: "נצלם וידאו בשם: ניסיתי לצאת לדייט וכמעט מתתי חברתית", next: "end_content_empire" },
      { text: "נעשה לייב של הדייט", next: "live_date" },
      { text: "לא, דייט פרטי", next: "privacy_argument" }
    ]
  },

  live_date: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "'לייב?'\nים מתחיל להזיע.\nלא מרגש. מלחץ.\nהוא מדמיין צ'אט של שלושה אנשים, מתוכם אחד בוט ואחד ינוור שכותב: תקום יא אגדה שבורה.",
    choices: [
      { text: "לייב בלי מצלמה", next: "end_radio_date" },
      { text: "לייב עם מצלמה", next: "end_live_disaster" }
    ]
  },

  privacy_argument: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "'דייט פרטי? בלי תוכן? בלי כותרת? בלי תמונה ממוזערת?'\n\nהוא נראה אבוד. כמו יוצר תוכן בלי אינטרנט ובלי תירוץ.",
    choices: [
      { text: "כן. רק אנחנו", next: "true_date_offer" },
      { text: "טוב, נשים לפחות טאמבנייל", next: "end_thumbnail" }
    ]
  },

  sub_offer: {
    speaker: "ים",
    character: "images/yam_angry.png",
    text: "'סאב לשני הערוצים?'\n\nים פותח עין אחת.\nזה הרגע הכי אינטימי שלו היום.",
    choices: [
      { text: "כן. INVARIRON וגם ים שמואל הפקות", next: "two_subs" },
      { text: "רק לאחד, אל תגזים", next: "one_sub" },
      { text: "סאב, לייק, פעמון, הכול", next: "full_package" },
      { text: "שיקרתי. אין סאב", next: "end_betrayal" }
    ]
  },

  two_subs: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "'שני סאבים זה כבר חצי מערכת יחסים.'\n\nהוא מנסה לקום. המיטה מתנגדת.\nהמיטה: 'אני הייתי פה קודם.'",
    choices: [
      { text: "לעזור לו לקום", next: "help_up" },
      { text: "לנהל משא ומתן עם המיטה", next: "negotiate_bed" },
      { text: "להציע דייט בלי לקום", next: "bed_date_offer" }
    ]
  },

  one_sub: {
    character: "images/yam_angry.png",
    speaker: "ים",
    text: "ים: 'סאב אחד? זה כמו להגיד אני אוהבת אותך אבל רק בגרסת ניסיון.'\n\nהחדר נהיה קר. אפילו הכרית עשתה לך אנפולו.",
    choices: [
      { text: "טוב, שני סאבים", next: "two_subs" },
      { text: "להתווכח על זה", next: "end_one_sub_court" }
    ]
  },

  full_package: {
    speaker: "ים",
    character: "images/yam_happy.png",
    text: "'סאב, לייק ופעמון?'\n\nים מרגיש כאילו קיבל הצעת נישואים דרך YouTube Studio.\nהוא כמעט מחייך. זה מפחיד את כולם.",
    choices: [
      { text: "להציע דייט רשמי", next: "true_date_offer" },
      { text: "להציע חתונה עם קוד קופון", next: "end_coupon_wedding" },
      { text: "להציע ילדים שנראים כמו פחיות", next: "cans_too_soon" }
    ]
  },

  help_up: {
    speaker: "המספר",
    text: "את מושיטה יד.\nים מושיט יד בחזרה.\nלרגע אחד העולם עוצר.\nאפילו יוטיוב מפסיק להמליץ על סרטונים של 2008.\n\nואז ים אומר: 'רגע, הדלקתי את המיקרופון?'",
    choices: [
      { text: "כן, קום כבר", next: "place_choice" },
      { text: "לא, קודם נסגור OBS", next: "end_obs" },
      { text: "לעזוב לו את היד מרוב ייאוש", next: "end_hand_fail" }
    ]
  },

  negotiate_bed: {
    speaker: "המיטה",
    text: "המיטה מדברת.\nכן, המשחק ירד מהפסים.\n\nהמיטה: 'ים שייך לי. אני נתתי לו תמיכה כשכל העולם נתן לו רק התראות.'",
    choices: [
      { text: "להציע למיטה להיות השושבינה", next: "end_bed_wedding" },
      { text: "להציע למיטה בורקס", next: "bed_burekas" },
      { text: "להעליב את המיטה", next: "end_bed_revenge" }
    ]
  },

  bed_burekas: {
    speaker: "המיטה",
    text: "המיטה שותקת.\nאף אחד לא עומד מול בורקס.\nגם לא רהיט עם אגו של מנהל קבוצה בוואטסאפ.",
    choices: [
      { text: "ים, עכשיו קמים", next: "place_choice" },
      { text: "להישאר שלישייה: את, ים והמיטה", next: "end_bed_poly" }
    ]
  },

  bed_date_offer: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "'דייט בלי לקום?'\n\nים נראה מאושר.\nזו לא אהבה. זו לוגיסטיקה שמצאה משמעות בחיים.",
    choices: [
      { text: "דייט במיטה עם חטיפים", next: "end_bed_snacks" },
      { text: "דייט במיטה אבל עם שיחה רצינית", next: "serious_bed_talk" },
      { text: "לא, חייבים לצאת החוצה", next: "place_choice" }
    ]
  },

  serious_bed_talk: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "את אומרת לו שדייט זה לא רק מקום. זה בחירה.\nים עונה: 'נכון. ואני בוחר לא לעמוד.'\n\nזה היה עמוק, אבל כמו שלולית ליד פתח תקווה אחרי גשם.",
    choices: [
      { text: "לקבל את זה", next: "end_mature_laziness" },
      { text: "לקרוא לזה תבוסה רומנטית", next: "end_romantic_defeat" }
    ]
  },

  place_choice: {
    speaker: "המספר",
    character: "images/yam.png",
    text: "ים קם.\nהיקום נבהל.\nכוח הכבידה הגיש ערעור.\nעכשיו צריך לבחור לאן הולכים.",
    choices: [
      { text: "פתח תקווה", next: "petah_tikva_path" },
      { text: "קולנוע", next: "cinema_path" },
      { text: "ספסל עצוב ליד תחנת אוטובוס", next: "bus_stop" },
      { text: "לצלם את זה לערוץ", next: "content_date" },
      { text: "לחזור למיטה כי זה היה יותר מדי", next: "end_back_to_bed" }
    ]
  },

  petah_tikva_path: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "'פתח תקווה?'\n\nים שואל את זה כמו שמישהו שואל אם יש חיים אחרי המוות, אבל עם יותר חניה כחול־לבן.",
    choices: [
      { text: "כן, רומנטיקה עירונית שבורה", next: "end_petah_tikva" },
      { text: "רוטשילד כמו אוטובאן", next: "end_autobahn" },
      { text: "לקנות פלאפל ולשתוק", next: "end_falafel" }
    ]
  },

  cinema_path: {
    speaker: "המספר",
    text: "אתם מגיעים לקולנוע.\nים קונה פופקורן בגודל של החלטות גרועות.\nהסרט מתחיל.\nים נרדם לפני הלוגו של החברה.",
    choices: [
      { text: "לקרוא לזה דייט מוצלח", next: "end_cinema_sleep" },
      { text: "להעיר אותו", next: "cinema_wakeup" },
      { text: "להחליף אותו בפופקורן", next: "end_popcorn" }
    ]
  },

  cinema_wakeup: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "ים מתעורר ואומר: 'אני לא ישנתי. אני עשיתי ביקורת קולנוע פנימית.'\n\nהשקר הזה כל כך חלש שגם הכיסא הרגיש מבוכה.",
    choices: [
      { text: "לצחוק ולסלוח", next: "end_cinema_good" },
      { text: "לכתוב עליו ביקורת בגוגל", next: "end_google_review" }
    ]
  },

  bus_stop: {
    speaker: "המספר",
    text: "אתם יושבים בתחנת אוטובוס.\nהאור הצהוב עושה את הכול יותר מדכא.\nים אומר: 'זה נחמד. מרגיש כמו החיים, רק עם פחות תקווה ויותר מוביט.'",
    choices: [
      { text: "לחכות לקו שלא מגיע", next: "end_bus_ghost" },
      { text: "להחזיק לו יד", next: "end_bus_romance" },
      { text: "להגיד שזה הדייט הכי זול בארץ", next: "end_budget_date" }
    ]
  },

  screen_date: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "'דייט דרך מסך?'\n\nים נדלק.\nלא רומנטית. טכנית.\nהוא כבר פותח דיסקורד כאילו זה חדר חתונות.",
    choices: [
      { text: "דייט בדיסקורד", next: "end_discord" },
      { text: "דייט בזום עם מצלמה כבויה", next: "end_zoom" },
      { text: "לא, זה עצוב מדי אפילו בשבילנו", next: "simple_offer" }
    ]
  },

  too_aggressive: {
    character: "images/yam_sleepy.png",
    speaker: "ים",
    text: "ים נעלב.\nלא עמוק. רק מספיק כדי להפוך את זה לדרמה של 12 פרקים וסרט ספיישל.\n\n'אם ככה את מדברת, אני עובר חזק חזק לינוור.'",
    choices: [
      { text: "להתנצל", next: "apology_path" },
      { text: "להגיד לו בהצלחה עם זה", next: "end_canon_bad" },
      { text: "לפתוח בית משפט רומנטי", next: "romantic_court" }
    ]
  },

  apology_path: {
    speaker: "את",
    text: "את מתנצלת.\nים שותק.\nהשתיקה שלו נשמעת כמו מחשב ישן שמנסה להריץ GTA 6 על תקווה.",
    choices: [
      { text: "להציע בורקס פיוס", next: "burekas_path" },
      { text: "להציע דייט שקט", next: "quiet_path" },
      { text: "להמשיך להתנצל עד שזה נהיה מוזר", next: "end_apology_loop" }
    ]
  },

  romantic_court: {
    speaker: "השופטת הכרית",
    text: "בית המשפט הרומנטי נפתח.\nהתביעה: את היית אגרסיבית.\nההגנה: ים לא קם מהמיטה מאז תחילת הדמו.\n\nהכרית נושמת עמוק. 'שני הצדדים מביכים.'",
    choices: [
      { text: "להודות באשמה", next: "end_court_guilty" },
      { text: "להאשים את האלגוריתם", next: "end_court_algorithm" },
      { text: "להגיש ראייה: בורקס", next: "burekas_path" }
    ]
  },

  burekas_path: {
    speaker: "ים",
    character: "images/yam_happy.png",
    text: "'בורקס?'\n\nהחדר משתנה.\nהמוזיקה נהיית דרמטית, למרות שיש רק קובץ אחד בתיקיית audio.\nים קם רבע נשמה.",
    choices: [
      { text: "בורקס גבינה", next: "cheese_burekas" },
      { text: "בורקס תפוח אדמה", next: "potato_burekas" },
      { text: "בורקס פיצה", next: "pizza_burekas" },
      { text: "אין בורקס. זה היה שקר", next: "end_burekas_lie" }
    ]
  },

  cheese_burekas: {
    character: "images/yam_happy.png",
    speaker: "ים",
    text: "ים מקבל בורקס גבינה.\nהוא מסתכל עלייך כאילו הבאת לו תרופה לנפש, לגוף, ולערוץ עם 12 צפיות.",
    choices: [
      { text: "עכשיו דייט", next: "true_date_offer" },
      { text: "עכשיו חתונה", next: "end_fast_wedding" },
      { text: "עכשיו מהפכת בורקס", next: "end_burekas_revolution" }
    ]
  },

  potato_burekas: {
    character: "images/yam_happy.png",
    speaker: "ים",
    text: "ים אוכל בורקס תפוח אדמה.\nהוא אומר: 'זה טוב, אבל זה טעם של פשרה ממשלתית.'",
    choices: [
      { text: "להוסיף רוטב", next: "cheese_burekas" },
      { text: "להתעקש שזה מספיק", next: "end_potato_compromise" },
      { text: "להביא עוד אחד", next: "end_infinite_burekas" }
    ]
  },

  pizza_burekas: {
    character: "images/yam_happy.png",
    speaker: "ים",
    text: "בורקס פיצה.\nים מביט בו.\nזה לא אוכל. זו הכרזת מלחמה על מערכת העיכול עם ריח של נוסטלגיה.",
    choices: [
      { text: "לאכול יחד", next: "end_pizza_burekas" },
      { text: "לצלם לערוץ", next: "end_food_review" }
    ]
  },

  true_date_offer: {
    speaker: "את",
    text: "את אומרת: 'ים, בלי אלגוריתם, בלי תירוצים, בלי ועדת חקירה. פשוט דייט.'\n\nים שותק.\nהשתיקה דרמטית בטירוף, כאילו מישהו גילה שהסוללה במיקרופון נגמרה באמצע הקלטה חשובה.",
    choices: [
      { text: "להחזיק לו יד", next: "hand_moment" },
      { text: "להציע פתח תקווה", next: "petah_tikva_path" },
      { text: "להציע ילדים שנראים כמו פחיות", next: "cans_too_soon" },
      { text: "להגיד לו שהוא יכול להגיד לא", next: "healthy_choice" }
    ]
  },

  hand_moment: {
    speaker: "המספר",
    character: "images/yam_horny.png",
    text: "את מחזיקה לו יד.\nים מסתכל על הידיים שלכם.\nהוא לוחש: 'זה יותר חם מהתגובות שלי ביוטיוב.'\n\nברגע הזה אפילו ההומור השחור לקח צעד אחורה ואמר: טוב, זה חמוד.",
    choices: [
      { text: "לצאת לדייט אמיתי", next: "end_true_love" },
      { text: "להרוס הכול עם בדיחה על פחיות", next: "cans_too_soon" },
      { text: "לשאול אם זה יהיה בסרטון", next: "end_content_empire" }
    ]
  },

  healthy_choice: {
    character: "images/yam_surpise.png",
    speaker: "ים",
    text: "ים מופתע.\n'רגע... את נותנת לי לבחור בלי ללחוץ עליי?'\n\nהמשחק נבהל. הוא לא תוכנן לבגרות רגשית.",
    choices: [
      { text: "כן", next: "end_healthy_good" },
      { text: "סתם, קום עכשיו", next: "too_aggressive" }
    ]
  },

  cans_too_soon: {
    character: "images/yam.png",
    speaker: "ים",
    text: "'ילדים שנראים כמו פחיות?'\n\nים נהיה לבן כמו קובץ CSS לפני שמוסיפים לו עיצוב.\nהוא לא יודע אם זו הצעת עתיד או איום תעשייתי.",
    choices: [
      { text: "להגיד שזה היה בצחוק", next: "cans_joke" },
      { text: "להסביר את החזון המשפחתי", next: "end_can_family" },
      { text: "להוציא פחית להדגמה", next: "end_can_demo" }
    ]
  },

  cans_joke: {
    character: "images/yam.png",
    speaker: "ים",
    text: "ים נרגע קצת.\n'אה. בדיחה. מצחיק. בערך כמו לראות חשבון בנק אחרי הזמנת וולט.'",
    choices: [
      { text: "להמשיך לדייט", next: "end_true_love" },
      { text: "להכפיל את הבדיחה", next: "end_can_factory" }
    ]
  },

  dramatic_speech: {
    speaker: "את",
    text: "את נעמדת באמצע החדר ופותחת נאום כאילו כל האנושות תלויה בזה.\n\n'ים! העולם קר, האהבה יקרה, והחיים מרגישים כמו טופס שלא נשמר אחרי שעתיים. אבל היום אתה תקום!'",
    choices: [
      { text: "להמשיך לנאום עוד יותר מוגזם", next: "speech_level_2" },
      { text: "לסיים במשפט על פחיות", next: "cans_too_soon" },
      { text: "להתחרט באמצע", next: "end_speech_crash" }
    ]
  },

  speech_level_2: {
    speaker: "את",
    text: "'אתה לא רק בחור במיטה!\nאתה אימפריה!\nאתה ערוץ!\nאתה הפקה!\nאתה אולי אפילו בן אדם עם תאריך יציאה מהחדר!'\n\nים דומע. או שזה אבק. אף אחד לא בודק.",
    choices: [
      { text: "לצעוק: קום יא מלך שבור", next: "place_choice" },
      { text: "להציע חוזה דייט רשמי", next: "date_contract" },
      { text: "להגזים עד שהמשחק קורס עלילתית", next: "end_writer_breakdown" }
    ]
  },

  date_contract: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "את מוציאה חוזה:\n1. ים יוצא לדייט.\n2. מותר לו לדבר על INVARIRON עד 7 דקות.\n3. ילדים פחיות רק אחרי הסוף הטוב.\n\nים קורא את זה כאילו זה תנאי שימוש שאף אחד לא קרא בחיים.",
    choices: [
      { text: "לחתום", next: "end_contract_date" },
      { text: "להוסיף סעיף בורקס", next: "end_contract_burekas" },
      { text: "לתת למיטה זכות וטו", next: "negotiate_bed" }
    ]
  },

  quiet_path: {
    speaker: "המספר",
    text: "את יושבת ליד ים בשקט.\nבלי לחץ. בלי מניפולציה. בלי נאום.\n\nזה כל כך נדיר במשחק הזה שהמנוע הגרפי כמעט ביקש חיבוק.",
    choices: [
      { text: "לשאול: מה באמת קשה לך?", next: "honest_talk" },
      { text: "להציע לשבת יחד בלי דייט", next: "end_quiet_companion" },
      { text: "לשבור את השקט עם בדיחה שחורה", next: "black_joke" }
    ]
  },

  honest_talk: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "ים אומר: 'האמת? לפעמים אין לי כוח להיות בן אדם. להיות ערוץ יותר קל. ערוץ לא צריך לקום. רק להעלות.'\n\nהמשפט הזה היה עמוק מדי בשביל משחק בשם ים דייט סימולטור, אז מיד נופל בורקס מהשמיים כדי לאזן.",
    choices: [
      { text: "להציע דייט קטן בלי לחץ", next: "end_soft_good" },
      { text: "להגיד שהערוץ לא יחבק אותו", next: "channel_wont_hug" },
      { text: "להרים את הבורקס", next: "burekas_path" }
    ]
  },

  channel_wont_hug: {
    character: "images/yam_angry.png",
    speaker: "ים",
    text: "'הערוץ לא יחבק אותי?'\n\nים מסתכל על המסך.\nהמסך מחזיר לו השתקפות של אדם שמנהל מערכת יחסים עם סטטיסטיקות צפייה.\nזה היה רגע קשה. מטומטם, אבל קשה.",
    choices: [
      { text: "לחבק אותו", next: "end_hug" },
      { text: "להראות לו אנליטיקס", next: "end_analytics_depression" }
    ]
  },

  black_joke: {
    speaker: "את",
    text: "את אומרת: 'המצב הרומנטי שלנו כל כך מת, שאפילו קברן היה אומר אין תקציב.'\n\nים צוחק.\nצחוק קטן, שבור, עם ריח של קפה קר.",
    choices: [
      { text: "להמשיך בקו השחור", next: "darker_joke" },
      { text: "לעבור לרכות", next: "honest_talk" }
    ]
  },

  darker_joke: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "ים אומר: 'זה בסדר, גם המוטיבציה שלי מתה, פשוט לא היה לה מי שיבוא ללוויה.'\n\nשניכם צוחקים.\nלא כי זה טוב. כי זה מדויק מדי.",
    choices: [
      { text: "להפוך את זה לדייט קומדיה שחורה", next: "end_dark_comedy_date" },
      { text: "להגיד: טוב, עכשיו קמים", next: "place_choice" }
    ]
  },

  yinover_threat: {
    character: "images/yam_angry.png",
    speaker: "ים",
    text: "ים קופא.\nהמילה 'ינוור' תלויה באוויר כמו קללה עתיקה שנכתבה בקומנט ביוטיוב.\n\n'מה אמרת?'",
    choices: [
      { text: "אני עוברת לינוור", next: "end_yinover_canon" },
      { text: "סתם! בדקתי אם אתה מקשיב", next: "yinover_recover" },
      { text: "INVARIRON יותר טוב", next: "invariron_flattery" }
    ]
  },

  yinover_recover: {
    character: "images/yam_sleepy.png",
    speaker: "ים",
    text: "ים נושם.\n'אל תעשי לי את זה. יש מילים שלא זורקים בחדר עם מיטה רגישה.'",
    choices: [
      { text: "להתנצל", next: "apology_path" },
      { text: "להציע סאב", next: "sub_offer" }
    ]
  },

  invariron_flattery: {
    speaker: "ים",
    character: "images/yam_happy.png",
    text: "'INVARIRON יותר טוב?'\n\nים מחייך.\nהוא מנסה להסתיר את זה, אבל הפנים שלו עושות לייק לבד.",
    choices: [
      { text: "כן, ועכשיו דייט", next: "true_date_offer" },
      { text: "כן, אבל ים שמואל הפקות גם חשוב", next: "end_balanced_channels" }
    ]
  },

  sad_truth: {
    speaker: "המספר",
    text: "את אומרת שזה עצוב.\nים אומר: 'ברור שזה עצוב. אנחנו בישראל, בדפדפן, במשחק HTML, בלי תקציב, ורומנטיקה תלויה בסאב.'",
    choices: [
      { text: "להפוך את העצב לדייט", next: "end_sad_date" },
      { text: "להיכנע לעצב", next: "end_existential" }
    ]
  },

  cringe_recovery: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "ים מהנהן. 'כן, זה באמת היה קרינג'. אבל לפחות זה היה קרינג' עם כוונה.'",
    choices: [
      { text: "להציע דייט רגיל", next: "true_date_offer" },
      { text: "להציע דייט קרינג' בכוונה", next: "end_cringe_date" }
    ]
  },

  steal_drawer_prep: {
    speaker: "המספר",
    text: "את מתגנבת על קצות האצבעות לכיוון שידת הלילה של ים.\nשם, מתחת לערימה של קבלים מפוצלים ושאריות בורקס יבש משנת 2024, נמצאת המגירה הנעולה.\nהנשימה של ים כבדה, הוא חולם כנראה על שרת דיסקורד שנמחק בטעות.\nהאם תצליחי לפתוח את המנעול עם סיכת ראש?",
    choices: [
      { text: "לנסות לפרוץ! (משחק עיתוי!)", next: "drawer_lockpick_game" },
      { text: "לסגת, זה מסוכן מדי", next: "room_intro" }
    ]
  },

  drawer_lockpick_game: {
    speaker: "המספר",
    text: "הסיכה בתוך המנעול... תפסקי את המנגנון בזמן הנכון!",
    minigame: {
      type: "timing_bar",
      duration: 3500,
      nextSuccess: "drawer_success",
      nextFail: "drawer_fail"
    }
  },

  drawer_success: {
    speaker: "המספר",
    sfx: "audio/click.mp3",
    effect: "flash",
    text: "*קליק*\nהמגירה נפתחת בשקט מופתי! החדר עדיין שקט.\nבפנים את מוצאת מסמך סודי ביותר: 'דוח אנליטיקס חסוי - ים שמואל הפקות'.\nהמספרים מראים משהו מדהים: יש לו 3- רשומים (מינוס שלושה סאבים!). אפילו בוטים של יוטיוב הגישו בקשת חסינות מפני התוכן שלו.",
    choices: [
      { text: "להעיר אותו ולהראות לו את האסון האנליטי", next: "drawer_show_analytics" },
      { text: "לגנוב את דוח האנליטיקס ולברוח", next: "end_analytics_thief" }
    ]
  },

  drawer_show_analytics: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "bounce",
    text: "ים מתעורר ומביט בדוח האנליטיקס שהדפסת לו על נייר בורקס.\nהעיניים שלו נפערות. צמרמורת עוברת בגבו.\n'מינוס שלושה סאבים?! איך... איך זה הגיוני? אפילו אמא שלי הבטיחה לעשות סאב משני חשבונות!'",
    choices: [
      { text: "זה בגלל הסרטון על פחיות. בוא נצא לדייט להתאושש", next: "true_date_offer" },
      { text: "אולי אם תעבור לינוור האנליטיקס ישתפר?", next: "end_yinover_depression" }
    ]
  },

  drawer_fail: {
    speaker: "המספר",
    sfx: "audio/break.mp3",
    effect: "shake",
    characterAnimation: "shake",
    text: "*קראאאק*\nסיכת הראש נשברת בתוך המנעול ברעש של פיצוץ קטן!\nים קופץ מהמיטה בעיניים אדומות כמו חתול רחוב ששמע פתיחה של פחית טונה.\n'שודדים! ינוור שלח אתכם לפרוץ לי לקוד?!'\nהוא מרים כרית נוצות כבדה (ששוקלת כמו שק בטון) ומניף אותה לכיוונך במהירות האור!",
    choices: [
      { text: "להתחמק מהכרית! (משחק תגובה!)", next: "pillow_dodge_game" }
    ]
  },

  pillow_dodge_game: {
    speaker: "המספר",
    text: "הכרית טסה לעברך! תתחמק/י עכשיו!",
    minigame: {
      type: "qte",
      duration: 1100,
      nextSuccess: "dodge_success",
      nextFail: "dodge_fail"
    }
  },

  dodge_success: {
    speaker: "המספר",
    sfx: "audio/dodge.mp3",
    effect: "flash",
    text: "את מתכופפת ברגע האחרון!\nהכרית עפה מעלייך ומנפצת את מנורת הלילה של ים לרסיסים.\nים, שאיבד את שיווי המשקל מההנפה הדרמטית, מחליק מהמיטה ונופל עם הראש לתוך סל הכביסה המלוכת שלו, תקוע עם הרגליים למעלה.",
    choices: [
      { text: "לנצל את ההזדמנות ולדרוש דייט פיוס", next: "stuck_negotiation" },
      { text: "להשאיר אותו שם וללכת לאכול בורקס לבד", next: "end_laundry_trap" }
    ]
  },

  stuck_negotiation: {
    character: "images/yam_dead.png",
    speaker: "ים",
    text: "מתוך סל הכביסה נשמע קול חנוק:\n'טוב! טוב! אני אצא לדייט! רק תוציאי אותי מהגרביים של שבוע שעבר... הריח פה קטלני יותר מההומור של ינוור!'",
    choices: [
      { text: "להוציא אותו ולצאת לדייט", next: "true_date_offer" }
    ]
  },

  dodge_fail: {
    speaker: "המספר",
    sfx: "audio/hit.mp3",
    effect: "redflash",
    text: "*בום!!!*\nהכרית פוגעת לך ישירות במצח.\nהעולם מסתובב, צבעים מוזרים מופיעים, ואת שומעת רעש של מודם אנלוגי משנות ה-90.\nאת קורסת לרצפה חסרת הכרה.\nהנשמה שלך נפרדת מהגוף לאט לאט.",
    choices: [
      { text: "לעלות לשמיים", next: "end_pillow_death" }
    ]
  },

  drag_yam_prep: {
    speaker: "את",
    text: "אני לא מחכה יותר. הגיע הזמן לפיזיקה פשוטה.\nאת תופסת את ים בשתי הידיים ומתחילה למשוך בכל הכוח.\nים מתנגד כמו שק תפוחי אדמה רטוב.\nהמיטה מפעילה כוח כבידה נגדי של חור שחור.\nחייבים למשוך חזק ומהר!",
    choices: [
      { text: "למשוך בכל הכוח! (משחק לחיצות מהיר!)", next: "drag_yam_game" }
    ]
  },

  drag_yam_game: {
    speaker: "המספר",
    text: "תלחץ/י מהר כדי להתגבר על כבידת המיטה!",
    minigame: {
      type: "click_mash",
      target: 18,
      duration: 3500,
      nextSuccess: "drag_success",
      nextFail: "drag_fail"
    }
  },

  drag_success: {
    speaker: "המספר",
    sfx: "audio/crack.mp3",
    effect: "shake",
    text: "בשארית כוחותייך את נותנת משיכה הירואית אחת אחרונה!\nים נתלש מהמיטה ועף ישירות לרצפה.\n*קראאאאק*\nרעש נוראי של ענף יבש שנשבר נשמע בחדר.\nים משמיע אנחה דרמטית במיוחד: 'איייייי! הגב שלי! חוליה L5 חתמה על חוזה פרישה מוקדמת!'",
    choices: [
      { text: "להזמין אמבולנס בדחיפות", next: "hospital_ambulance" },
      { text: "להגיד לו שיפסיק לבכות ולגרור אותו ככה לדייט", next: "drag_injured_date" }
    ]
  },

  drag_fail: {
    speaker: "המספר",
    text: "העייפות מכריעה אותך.\nים חזק מדי, המיטה חזקה מדי.\nתוך כדי משיכה, הרגליים שלך מחליקות ואת נשאבת לתוך השמיכה.\nהמיטה עוטפת את שניכם כמו סושי אנושי ענק.\nהמנוע של המשחק מתחיל להבין שאין מוצא, ואתם פשוט הופכים לחלק מהריהוט.",
    choices: [
      { text: "להשלים עם גורלך ככרית", next: "end_bed_fusion" }
    ]
  },

  hospital_ambulance: {
    speaker: "המספר",
    vibrate: [150, 100, 150, 100, 150, 100, 150],
    text: "האמבולנס מגיע עם סירנות רועשות. שני פרמדיקים עצבניים נכנסים לחדר.\nהם מעלים את ים על אלונקה.\nאחד מהם פונה אלייך: 'זה יעלה 4,000 שקל. מזומן, אשראי או תרומת סאב לערוץ של מד\"א?'",
    choices: [
      { text: "לשלם באשראי (ולהיכנס למינוס נצחי)", next: "hospital_pay_card" },
      { text: "להציע להם בורקס חם כשוחד", next: "hospital_pay_burekas" },
      { text: "להגיד שים הוא יוטיובר מפורסם והם יקבלו חשיפה", next: "hospital_pay_exposure" }
    ]
  },

  hospital_pay_card: {
    speaker: "המספר",
    text: "הכרטיס עובר. הבנק שלך שולח הודעת טקסט: 'ראינו את הרכישה. אנחנו לא כועסים, רק מאוכזבים.'\nאתם מגיעים לחדר המיון.\nהאורות הפלורסנטיים מהבהבים, הריח של החיטוי מערבב לך את הבטן.\nרופא כירורג עם מסיכה וכובע מנתחים מוזר ניגש אליכם.",
    next: "hospital_doctor_meet"
  },

  hospital_pay_burekas: {
    speaker: "הפרמדיק",
    text: "'בורקס גבינה חם?\nעם שומשום מלמעלה?'\n\nהפרמדיקים מחליפים מבטים. העסקה נסגרת.\nים מועלה לאמבולנס במהירות, ואתם טסים לבית החולים כשריח של בצק עלים ממלא את הרכב.",
    next: "hospital_doctor_meet"
  },

  hospital_pay_exposure: {
    speaker: "הפרמדיק",
    text: "'חשיפה? בערוץ עם 12 צפיות שחצי מהן זה ים שמרענן את העמוד?'\n\nהפרמדיק מסתכל עלייך במבט של רצח בעיניים.\n'אנחנו משאירים אותו פה, אבל לוקחים את הכרית שלו כעונש.'\nהם הולכים. ים נשאר על הרצפה ללא כרית, כואב ועצוב.",
    choices: [
      { text: "זה הסוף שלי", next: "end_no_pillow_no_date" }
    ]
  },

  hospital_doctor_meet: {
    speaker: "הרופא",
    text: "'שלום. אני ד\"ר י... כלומר, ד\"ר שוורץ. המצב של הבחור קשה.'\nהרופא מסיר לרגע את המסכה כדי לגרד באף.\nרגע! יש לו שפם מזויף שמודבק עם סלוטייפ והקול שלו נשמע בדיוק כמו ינוור!\n'אני צריך לנתח אותו מיד בגב, ולחבר לו כבל רשת ישירות לעמוד השדרה. זה... ישפר לו את הפינג ביוטיוב.'",
    choices: [
      { text: "רגע, אתה ינוור! (משחק עיתוי לפרוע את השפם שלו!)", next: "hospital_expose_doctor" },
      { text: "נשמע הגיוני רפואית, תנתח אותו", next: "end_doctor_operation_fail" }
    ]
  },

  hospital_expose_doctor: {
    speaker: "המספר",
    text: "הרופא מתקרב לים עם מברג פיליפס גדול. תפסי את השפם שלו ברגע הנכון!",
    minigame: {
      type: "timing_bar",
      duration: 3000,
      nextSuccess: "expose_success",
      nextFail: "expose_fail"
    }
  },

  expose_success: {
    speaker: "ינוור",
    sfx: "audio/rip.mp3",
    effect: "flash",
    characterAnimation: "shake",
    text: "את שולחת יד מהירה ותולשת את השפם המזויף במכה אחת!\n'איייי! זה כאב!' ינוור צועק וחושף את פניו האמיתיות.\n'טוב, מודה באשמה! רציתי להשתיל לו צ'יפ שיעביר את כל הסאבים מ-INVARIRON לערוץ שלי!\nהייתם חייבים להרוס לי את מזימת הבריאות הרומנטית הזו?!'",
    choices: [
      { text: "לגרש את ינוור מהחדר ולברוח עם ים", next: "hospital_escape_run" },
      { text: "להציע לינוור להצטרף לדייט משולש", next: "end_triple_date_disaster" }
    ]
  },

  expose_fail: {
    speaker: "המספר",
    text: "את מפספסת את השפם ותופסת בטעות באף של ים, שמצרח מכאב.\nד\"ר שוורץ (ינוור) מנצל את הבלבול.\n'הפרעה לצוות רפואי! אבטחה! לפנות את הגברת!'\nשני מאבטחים כבדים גוררים אותך החוצה מבית החולים.\nינוור נשאר לבד בחדר הניתוח עם ים ומברג הפיליפס...",
    choices: [
      { text: "מה הוא יעשה לו...", next: "end_inover_cyborg" }
    ]
  },

  hospital_escape_run: {
    speaker: "המספר",
    text: "את מנתקת את ים מאינפוזיית הקפה שלו.\nים צועק: 'אבל הגב שלי!'\nאת מעמיסה אותו על כיסא גלגלים שמצאת במסדרון.\nינוור רודף אחריכם עם מזרק ענק מלא במיץ פחיות!\nאתם חייבים לטוס לכיוון היציאה!",
    choices: [
      { text: "לנסוע הכי מהר בכיסא גלגלים! (משחק לחיצות!)", next: "hospital_escape_game" }
    ]
  },

  hospital_escape_game: {
    speaker: "המספר",
    text: "תלחץ/י מהר כדי לברוח מינוור והמזרק שלו!",
    minigame: {
      type: "click_mash",
      target: 22,
      duration: 4000,
      nextSuccess: "escape_success",
      nextFail: "escape_fail"
    }
  },

  escape_success: {
    speaker: "המספר",
    sfx: "audio/healing.mp3",
    effect: "flash",
    characterAnimation: "bounce",
    text: "כיסא הגלגלים טס במסדרונות, לוקח סיבובים על שני גלגלים כמו מכונית מירוץ!\nאתם פורצים את דלתות הזכוכית של המיון ויוצאים אל החנייה.\nינוור נשאר מאחור, מתנשף ומקלל בדיסקורד.\nים, שכל הנסיעה רעד מפחד, פתאום מחייך: 'וואו... זה היה... הדבר הכי מלהיב שקרה לי מאז שלייב שלי עבר את ה-20 צפיות! הגב שלי מרגיש הרבה יותר טוב מהאדרנלין!'",
    choices: [
      { text: "אז... עכשיו דייט אמיתי בפתח תקווה?", next: "end_escaped_date" },
      { text: "לחזור למיטה, היה מספיק דרמה להיום", next: "end_back_to_bed" }
    ]
  },

  escape_fail: {
    speaker: "המספר",
    sfx: "audio/inject.mp3",
    effect: "redflash",
    text: "הגלגלים של הכיסא נתקעים בשטיח הכניסה.\nינוור משיג אתכם ומזריק לים את מיץ הפחיות ישירות לכתף.\nים מתחיל לזהור באור ירוק זרחני וממלמל: 'אני... אוהב... את... ינוור... הסאב... שלי... שלו...'\nהלכה האהבה, הלכו הסאבים.",
    choices: [
      { text: "איזה אסון", next: "end_inover_mindcontrol" }
    ]
  },

  drag_injured_date: {
    character: "images/yam_horny.png",
    speaker: "ים",
    text: "ים נסחב על הרצפה כמו שטיח ישן, משאיר סימנים על הפרקט.\n'את... פסיכופטית אחושרמוטה...' הוא לוחש.\n'אבל לפחות את עקבית. בסדר, נצא לדייט, רק תפסיקי לגרור אותי במדרגות.'",
    choices: [
      { text: "לגרור אותו לפאב המקומי", next: "end_injured_pub_date" }
    ]
  },

  petah_tikva_catch_game: {
    speaker: "המספר",
    text: "ים בורח! תפסי אותו ברגע הנכון!",
    minigame: {
      type: "qte",
      duration: 1200,
      nextSuccess: "catch_success",
      nextFail: "catch_fail"
    }
  },

  catch_success: {
    speaker: "ינוור הבלתי נראה",
    characterAnimation: "bounce",
    text: "הקול של ינוור מהדהד מתוך הריק:\n'תפסתי אותו! הרגליים שלו תקועות באוויר הלא-קיים של פתח תקווה!'\nים צועק: 'שחררו אותי! אני מבטיח לצאת לדייט! אני אעשה לכם סאב! רק אל תשאבו אותי לאין-קיום!'",
    choices: [
      { text: "להקים איתם אימפריית תוכן פטורה ממס בפתח תקווה", next: "end_invisible_alliance" }
    ]
  },

  catch_fail: {
    speaker: "המספר",
    effect: "redflash",
    text: "היד שלך מחליקה על הפיג'מה של ים.\nהוא רץ לתוך הערפל הלבן שבו פתח תקווה אמורה להיות.\nהצעקות שלו נחלשות בהדרגה עד שהן נעלמות לחלוטין.",
    choices: [
      { text: "הוא הלך...", next: "end_lost_in_void" }
    ]
  },

  scam_success: {
    speaker: "המספר",
    sfx: "audio/healing.mp3",
    effect: "flash",
    text: "ברחתם בהצלחה עם הכסף!\nהגעתם לתל אביב וקניתם קופסת קרטון ממותגת ברוטשילד ב-3 מיליון ש\"ח.",
    choices: [
      { text: "לעבור לגור בקרטון", next: "end_tel_aviv_cardboard" }
    ]
  },

  scam_fail: {
    speaker: "הסטודנט מהטכניון",
    effect: "redflash",
    text: "'עצרנו אתכם! החוזה אומר שגם המצעים כלולים!'\nהם תופסים אתכם.\nים נאלץ לחלוק את השמיכה שלו עם שני מהנדסי תוכנה שמסבירים לו על אלגוריתמים כל הלילה.",
    choices: [
      { text: "איזה אסון של שותפות", next: "end_student_bed_share" }
    ]
  },

  math_quiz_start: {
    speaker: "המספר",
    text: "המבחן מתחיל... 10 שניות על השעון!",
    minigame: {
      type: "math_quiz",
      duration: 10000,
      nextSuccess: "math_quiz_success",
      nextFail: "math_quiz_fail"
    }
  },

  math_quiz_success: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "bounce",
    text: "העיניים של ים נפערות בתדהמה.\n'וואו... המוח שלך מריץ קוד יעיל יותר מהאלגוריתם של יוטיוב! פתרת את זה בצורה מושלמת!'\nהוא קם מהמיטה מרצונו החופשי.\n'מגיע לך דייט של אלופים בפתח תקווה!'",
    choices: [
      { text: "לצאת לדייט המנצחים", next: "end_math_genius" }
    ]
  },

  math_quiz_fail: {
    character: "images/yam_angry.png",
    speaker: "ים",
    characterAnimation: "shake",
    effect: "redflash",
    text: "ים מניד בראשו באכזבה.\n'אוי ואבוי... המוח שלך נמצא במינוס סאבים. שברנו את הפיזיקה של פתח תקווה עם הטעות הזו.'\nהוא מכסה את הראש בשמיכה ומסרב לדבר איתך יותר.",
    choices: [
      { text: "להשלים עם הבורות", next: "end_math_fail" }
    ]
  },

  center_homeless_stick: {
    speaker: "המספר",
    text: "החלטת לבחור באלימות!\nאת מרימה מקל עץ גדול ומניפה אותו לעבר ההומלס.\nאבל פתאום... ההומלס מתגלה כחייל קומנדו משוחרר! הוא שולף מגן קרטון ותוקף בחזרה!\nהתחמקי מהמכה שלו! (משחק תגובה מהיר!)",
    choices: [
      { text: "להתחמק מהקרטון שלו!", next: "center_stick_qte" }
    ]
  },

  center_stick_qte: {
    speaker: "המספר",
    text: "התחמקי עכשיו!",
    minigame: {
      type: "qte",
      duration: 1100,
      nextSuccess: "center_stick_win",
      nextFail: "center_stick_fail"
    }
  },

  center_stick_win: {
    speaker: "המספר",
    text: "הצלחת להתחמק ברגע האחרון!\nמגן הקרטון של ההומלס מתנפץ על עמוד בטון.\nניצלתם את ההזדמנות וברחתם בריצה. אבל בתוך המהומה, המיטה של ים החליקה במורד המדרגות הנעות של הסנטר!",
    choices: [
      { text: "לחפש את המיטה בסנטר", next: "end_lost_in_center" }
    ]
  },

  center_stick_fail: {
    speaker: "ההומלס הזועם",
    effect: "redflash",
    text: "הבום! מגן הקרטון פוגע בך בפרצוף.\nההומלס חוטף ממך את המקל ומתחיל להרביץ לים וגם לך עד שאתם נאלצים לברוח בלי נעליים.",
    choices: [
      { text: "לברוח כואבים", next: "end_beaten_by_homeless" }
    ]
  },

  center_homeless_car: {
    speaker: "המספר",
    text: "את וים קופצים לתוך מכונית תצוגה חשמלית יוקרתית שחונה באמצע הקניון.\nאת לוחצת על הדוושה ונוסעת במהירות 80 קמ\"ש בתוך דיזינגוף סנטר!\nהמכונית פוגעת בהומלס, מועכת חנות של קסטרו, ונעצרת בתוך בריכת הדגים.\nההומלס עף באוויר ועושה סלטה לתוך חנות קומיקס.",
    choices: [
      { text: "לחכות למשטרה", next: "end_jail_time" }
    ]
  },

  center_homeless_kind: {
    speaker: "ההומלס המופתע",
    characterAnimation: "bounce",
    text: "נתת לו 3 שקלים וקנית לו בורקס תפוח אדמה חם.\nפתאום, הוא מוריד את כובע הבלוטי שלו ומתחיל לבכות מאושר:\n'תודה! אני לא באמת הומלס, אני בעל הבית של דיזינגוף סנטר שרצה לעשות ניסוי חברתי לטיקטוק!\nבגלל טוב הלב שלכם, אני מעניק לכם בעלות על כל הקניון!'",
    choices: [
      { text: "לקבל את הבעלות", next: "end_mall_owners" }
    ]
  },

  center_homeless_sub: {
    speaker: "ההומלס הזועם",
    effect: "shake",
    text: "'סאב לערוץ מת?! אתם צוחקים עלי?!'\nההומלס מתעצבן ברמות קוסמיות. הוא מרים ידיים לשמיים, ומתחיל למלמל בלטינית עתיקה.\nהאורות בקניון נכבים, והאדמה מתחילה לרעוד... הוא זימן שד אנליטיקס ענק שרוצה לבלוע את הנשמות שלכם!",
    choices: [
      { text: "להתמודד עם השד", next: "end_demon_summoned" }
    ]
  },

  yam_depression_ask: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "float",
    text: "ים נאנח, מוריד מעט את השמיכה ומביט בך בעיניים עצובות:\n'התקבלתי לעבודה בהייטק! אבל... רק כעוזר של המנקה הראשי במשרד.\nכל היום אני שוטף כוסות קפה של מתכנתים שלובשים כפכפים. אבל החלום האמיתי שלי הוא לעבוד בתעשיית הקולנוע! לביים סרטים אפיים עם עלילות מפותלות, ולא סרטוני גיימינג שבהם ינוור צועק עלי.'",
    choices: [
      { text: "לצלם סרט קולנוע קצר בתוך החדר שלו (משחק עיתוי!)", next: "yam_film_shoot" },
      { text: "לקנות לו מקרן סרטים מיוחד לתקרה של החדר", next: "yam_cinema_projector" },
      { text: "לשפוך עליו דלי מים ולהגיד לו: 'הייטק זה הכסף האמיתי, רוץ לנקות!'", next: "yam_hitech_clean" }
    ]
  },

  yam_film_shoot: {
    speaker: "המספר",
    text: "את מתחילה לצלם, וים מביה אותך ישירות מהמיטה!\nלחצי בעיתוי המושלם כדי לצלם סצנה מנצחת!",
    minigame: {
      type: "timing_bar",
      duration: 3500,
      nextSuccess: "yam_film_success",
      nextFail: "yam_film_fail"
    }
  },

  yam_film_success: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "bounce",
    text: "הסצנה יצאה מושלמת!\nשלחתם את הסרט לפסטיבל קאן, והוא זכה בפרס הסרט הקצר הטוב ביותר!\nים קופץ מהמיטה בהתרגשות שיא כדי לטוס איתך לקבל את הפרס בצרפת!",
    choices: [
      { text: "לטוס לפסטיבל קאן עם הבמאי", next: "end_cannes_director" }
    ]
  },

  yam_film_fail: {
    speaker: "המספר",
    effect: "redflash",
    text: "היד שלך רעדה והמצלמה נפלה ישירות על הבוהן של ים!\nים צועק מכאב, מושך את השמיכה מעל הראש ומסרב להמשיך לצלם.",
    choices: [
      { text: "להשלים עם הפציעה", next: "end_toe_injury_director" }
    ]
  },

  yam_cinema_projector: {
    speaker: "המספר",
    text: "קנית מקרן קיר נייד והקרנת את הסרטים הקלאסיים הכי גדולים ישירות על התקרה של ים.\nים כל כך התלהב מהרעיון שהוא הפך את החדר שלו לבית קולנוע מחתרתי לא חוקי, וגובה 10 שקלים לכרטיס מילדי השכונה באורנית.",
    choices: [
      { text: "לספור את קופת הקולנוע", next: "end_bedroom_cinema" }
    ]
  },

  yam_hitech_clean: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "shake",
    effect: "flash",
    text: "שפכת עליו דלי מים קרים!\nים קופץ מהמיטה סחוט ומבוהל, ורץ לעבודה בהייטק.\nהוא מנקה כל כך טוב ויעיל שהנהלת החברה מקדמת אותו לתפקיד 'סמנכ\"ל תפעול היגיינה' עם שכר מטורף של 45,000 ש\"ח.\nהוא שכח מקולנוע, אבל עכשיו הוא עשיר!",
    choices: [
      { text: "לחגוג את הקידום", next: "end_vp_hygiene" }
    ]
  },

  block_highway_protest: {
    character: "images/yam_dead.png",
    speaker: "ים",
    characterAnimation: "bounce",
    text: "ים פוקח עיניים גדולות ומזנק מהמיטה:\n'מה?! עוגת גבינה פירורים בחינם לחוסמים?! אני קם ברגע זה! יאללה, בואי נחסום את כביש 4!'\nאתם מגיעים לכביש 4, מתיישבים על האספלט וחוסמים את כל התנועה.\nהנהגים צופרים וצועקים קללות מטורפות. פתאום, נהג משאית זועם מאיץ ישר לכיוון שלכם וצועק: 'עופו מהכביש או שאני דורס אתכם!'",
    choices: [
      { text: "לעמוד במקום באומץ בשביל עוגת הגבינה! (משחק עיתוי!)", next: "highway_brave_timing" },
      { text: "לברוח מהכביש למדרכה ולהציל את החיים שלכם", next: "highway_run_away" },
      { text: "לזרוק בורקס שומני על השמשה של המשאית כדי לעוור אותו", next: "highway_throw_burek" }
    ]
  },

  highway_brave_timing: {
    speaker: "המספר",
    text: "המשאית דוהרת לעברכם! קפצי הצידה בשנייה האחרונה!",
    minigame: {
      type: "timing_bar",
      duration: 2500,
      nextSuccess: "highway_dodge_success",
      nextFail: "highway_dodge_fail"
    }
  },

  highway_dodge_success: {
    speaker: "המספר",
    sfx: "audio/healing.mp3",
    effect: "flash",
    text: "קפצתם הצידה בזינוק הירואי ברבע השנייה האחרונה!\nהמשאית סוטה, נתקעת במעקה הבטיחות והדלת האחורית שלה נפתחת... מתברר שזו הייתה משאית משלוחים של קונדיטוריה!\nאלפי עוגות גבינה פירורים עפות באוויר ונוחתות לכם ישר בידיים!",
    choices: [
      { text: "לאכול את עוגת הגבינה של הניצחון", next: "end_cheesecake_glory" }
    ]
  },

  highway_dodge_fail: {
    speaker: "המספר",
    effect: "redflash",
    text: "לא קפצתם בזמן...\nהמשאית דרסה אתכם במהירות 110 קמ\"ש.\nהפכתם לסימן מריחה ארוך ואדום על האספלט של כביש 4.",
    choices: [
      { text: "איזה סוף קשוח ושחור", next: "end_roadkill_dark" }
    ]
  },

  highway_run_away: {
    character: "images/yam_horny.png",
    speaker: "ים",
    characterAnimation: "shake",
    text: "קפצתם למדרכה כמו פחדנים.\nהמשאית עוברת במהירות ומשאירה ענן אבק.\nים מביט בך בכעס: 'ברחת? ויתרת על עוגת גבינה חינם?! אהבה צריכה להבנות על הקרבה ופחמימות! אני חוזר למיטה שלי באורנית!'",
    choices: [
      { text: "לחזור הביתה בלי עוגה ובלי דייט", next: "end_alive_no_cake" }
    ]
  },

  highway_throw_burek: {
    speaker: "המספר",
    text: "זרקת בורקס תפוח אדמה שומני במיוחד. הוא נדבק בומבה על השמשה הקדמית של המשאית!\nהנהג לא רואה כלום, מאבד שליטה ומתהפך לתוך תעלה.\nלרוע המזל, ניידת משטרה ראתה הכל ועצרה אתכם על סיכון חיי אדם בכביש מהיר.",
    choices: [
      { text: "ללכת לכלא", next: "end_terrorist_protest" }
    ]
  },

  namer_action_timing: {
    speaker: "הבמאי",
    text: "שלומי, תעמוד שם ותחזיר אור על המצח של ים! צלמי בעיתוי המושלם!",
    minigame: {
      type: "timing_bar",
      duration: 3000,
      nextSuccess: "namer_action_success",
      nextFail: "namer_action_fail"
    }
  },

  namer_action_success: {
    speaker: "הבמאי",
    characterAnimation: "bounce",
    text: "זה פשוט גאוני! האור שחזר משלומי הלבן האיר את ים כמו מלאך האקשן! צילמנו את סרט האקשן הטוב ביותר בהיסטוריה של 'אני סילבסטר סטאלון הפקות'!\nים מוחתם על חוזה ל-10 סרטים ויוצא איתך לחגוג בהקרנת בכורה חגיגית!",
    choices: [
      { text: "ללכת לשטיח האדום", next: "end_namer_action_star" }
    ]
  },

  namer_action_fail: {
    speaker: "המספר",
    effect: "flash",
    text: "שלומי זז בטעות, והפנים הלבנות שלו החזירו קרן אור חזקה וממוקדת מדי ששרפה והמיסה את המצלמה של הבמאי ואת הפיג'מה של ים.\nהבמאי זועק: 'שלומי! אתה מפוטר! הרסת את האומנות!'\nים בורח למיטה כשהוא סובל מכוויות שמש בגלל שלומי.",
    choices: [
      { text: "להתאבל על המצלמה", next: "end_shlomi_melt" }
    ]
  },

  namer_burek_screen: {
    speaker: "המספר",
    text: "מרחתם על שלומי הלבן שכבה עבה של שמן בורקסים כדי לתת לו גוון שחום ומוזהב.\nהוא נראה מדהים ומריח כמו מאפיה ביום שישי.\nלרוע המזל, הריח משך את כל חתולי הרחוב של אורנית. הם הסתערו על שלומי הלבן והתחילו לנגוס בו בהנאה.\nשלומי צורח ובורח כשאחריו גדוד של 40 חתולים רעבים.",
    choices: [
      { text: "להציל את שלומי (או שלא)", next: "end_shlomi_burek_cat" }
    ]
  }

});
