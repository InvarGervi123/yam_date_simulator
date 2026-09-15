// --- Story Chapter: YAM SHADOW & INVAR LORE ---
Object.assign(window.story, {
  // --- PART 1: Something is Wrong with Yam ---
  yam_shadow_part1_start: {
    speaker: "המספר",
    character: "images/characters/yam_sleepy.png",
    music: "audio/main.mp3",
    effect: "shake",
    text: "את מתקרבת למיטה של ים.\nהוא שוכב שם כרגיל, אבל משהו באוויר מרגיש שונה.\nמאחורי הפינה של הארון, הצל של ים מרונדר באיחור של שנייה שלמה.\nהוא נראה כהה יותר, כאילו מישהו שכח לנקות את המטמון של הזיכרון.",
    next: "yam_shadow_part1_glitch"
  },

  yam_shadow_part1_glitch: {
    speaker: "ים",
    character: "images/characters/yam_curious.png",
    text: "'את עוד פעם פה?\nרגע... אמרתי לך כבר שהבורקס מהסיבוב הקודם היה קר?\nסליחה, מה? לא אמרתי כלום! למה ההרגשה הזאת שמישהו לחץ F5 בלעדיי?'",
    choices: [
      { text: "😂 לצחוק על ים שאיבד את השפיות", next: "yam_shadow_part1_laugh" },
      { text: "😟 לשאול בעדינות אם הוא מרגיש בסדר", next: "yam_shadow_part1_cared" },
      { text: "👉 לפנות ישירות לינוור ולשאול מה קורה", next: "yam_shadow_part1_invar_ask" },
      { text: "🙈 להתעלם מהצל המוזר בפינה", next: "yam_shadow_part1_ignore" }
    ]
  },

  yam_shadow_part1_laugh: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    text: "'תצחקי, תצחקי... אבל הצל שלי מאחוריי לא משתף פעולה!\nאני מסתובב ימינה והוא מסתכל שמאלה. זה לא באג, זה מרגיש כמו נקמה על זה שלא קמתי.'",
    next: "yam_shadow_part1_conclude"
  },

  yam_shadow_part1_cared: {
    speaker: "ים",
    character: "images/characters/yam_sad.png",
    text: "'אני בסדר! סתם... יש לי הרגשה מוזרה כאילו כבר היינו בסצנה הזאת.\nכאילו הבטחתי משהו בסיבוב הקודם ולא קיימתי, והעולם זוכר הכל.'",
    next: "yam_shadow_part1_conclude"
  },

  yam_shadow_part1_invar_ask: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'הוא לא מדמיין.\nהצל מאחוריו מורכב מכל הריסטים וההחלטות שהתבטלו.\nהבטחות שניתנו ולא קויימו מותירות משקע בזיכרון של המשחק.'",
    next: "yam_shadow_part1_conclude"
  },

  yam_shadow_part1_ignore: {
    speaker: "המספר",
    character: "images/characters/yam_horny.png",
    text: "את מנסה להתעלם מהצל, אבל ינוור עומד בפתח החדר.\nהמבט שלו רציני, שונה מהחיוך הרגיל שלו.\nים מסתכל עליו במבוכה ומנסה למשוך את השמיכה למעלה.",
    next: "yam_shadow_part1_conclude"
  },

  yam_shadow_part1_conclude: {
    speaker: "ים",
    character: "images/characters/yam_curious.png",
    text: "'ינוור... למה אתה עומד לידה ומסתכל עליי ככה?\nאתה לא אמור לבדוק אם הטיימר של ה-Service Worker תקין?'",
    next: "yam_shadow_part2_talk"
  },

  // --- PART 2: Conversation with Invar ---
  yam_shadow_part2_talk: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "ינוור מסמן לך להתקדם איתו לכיוון במסדרון, מחוץ לטווח השמיעה של ים.\n'בואי. יש דברים שים פשוט לא מסוגל לשמוע עדיין.'",
    next: "yam_shadow_part2_history1"
  },

  yam_shadow_part2_history1: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'אנחנו חברים כבר שנים. עוד לפני שהסימולטור הזה נכתב... כשאורנית הייתה רק רעיון.\nניסיתי הכל כדי לעזור לו, להוציא אותו מהמיטה, לגרום לו לקחת אחריות ולמנוע ממנו לפגוע בסובבים אותו.'",
    next: "yam_shadow_part2_history2"
  },

  yam_shadow_part2_history2: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'גם אני עשיתי טעויות. סלחתי לו מהר מדי בכל פעם שהוא נרדם.\nהסתתרתי מאחורי הקוד, ניסיתי לתקן הכל בעצמי ולא הצבתי גבולות בזמן.\nים התרגל לזה שאני תמיד פה, והתחיל להתייחס לסליחה שלי כמשהו מובן מאליו.'",
    choices: [
      { text: "❓ 'אז למה נשארת איתו כל הזמן הזה?'", next: "yam_shadow_part2_resp_stay" },
      { text: "❤️ 'אתה עדיין רוצה להציל אותו?'", next: "yam_shadow_part2_resp_save" },
      { text: "💔 'אולי הוא פשוט לא מסוגל להשתנות?'", next: "yam_shadow_part2_resp_change" },
      { text: "🎯 'ומה אתה רוצה לעשות עכשיו?'", next: "yam_shadow_part2_resp_now" }
    ]
  },

  yam_shadow_part2_resp_stay: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'כי האמנתי שאם רק אבנה עוד מנוע, עוד מיני-משחק, עוד הזדמנות – הוא יקום.\nאבל חברות לא אמורה להיות חוזה בלעדיות לשכב במיטה 40 שנה.'",
    next: "yam_shadow_part2_pivot"
  },

  yam_shadow_part2_resp_save: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'אני לא שונא אותו ואני לא רוצה להעניש אותו.\nאני עדיין דואג לו. אבל אני רק לא מוכן יותר להיעלם כדי שהוא לא יצטרך להשתנות.'",
    next: "yam_shadow_part2_pivot"
  },

  yam_shadow_part2_resp_change: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'הוא מסוגל להשתנות, אבל רק אם הוא יבין שהבחירות שלו נושאות תוצאות.\nכל עוד יש מישהו שמנקה אחריו, אין לו שום סיבה לקום.'",
    next: "yam_shadow_part2_pivot"
  },

  yam_shadow_part2_resp_now: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'אני צריך להציב גבולות.\nאת הכרת אותי רק בזמן קצר, אבל הקשבת לי, ניסית ללמוד ולא השתמשת בי רק כשהיית צריכה עזרה. אני לא מוכן להמשיך להעלים את עצמי.'",
    next: "yam_shadow_part2_pivot"
  },

  yam_shadow_part2_pivot: {
    speaker: "המספר",
    text: "צעדים כבדים נשמעים מהמסדרון.\nים עומד שם, נשען על המשקוף. הוא שמע חלק מהשיחה.",
    next: "yam_shadow_part3_confront"
  },

  // --- PART 3: The Confrontation ---
  yam_shadow_part3_confront: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    effect: "redflash",
    text: "'הכרת אותי שנים, ינוור!\nשנים! ואותה... אותה הכרת רק היום!'",
    next: "yam_shadow_part3_invar_reply"
  },

  yam_shadow_part3_invar_reply: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'נכון.\nאבל ביום אחד היא הקשיבה לי יותר ממה שאתה הקשבת במשך שנים.'",
    choices: [
      { text: "🛡️ להגן על ינוור: 'הוא ניסה לעזור לך שנים!'", next: "yam_shadow_part3_defend" },
      { text: "🕊️ לנסות להרגיע את ים: 'זה לא חייב להסתיים בריב'", next: "yam_shadow_part3_calm" },
      { text: "🌱 לומר לים: 'אתה עדיין יכול להשתנות ולעמוד על הרגליים'", next: "yam_shadow_part3_grow" },
      { text: "⚖️ לומר לים: 'הבעיה היא הבחירות שלך, לא השחקנית'", next: "yam_shadow_part3_truth" }
    ]
  },

  yam_shadow_part3_defend: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    text: "'תראו אותה, מגינה עליו!\nאת לא יודעת כמה פעמים הוא אמר שהוא עוזב ותמיד חזר ב-F5 הבא!'",
    next: "yam_shadow_part4_echo_rise"
  },

  yam_shadow_part3_calm: {
    speaker: "ים",
    character: "images/characters/yam_sad.png",
    text: "'להירגע?! החבר הכי טוב שלי עומד לידך ואומר לי שההבטחות שלנו לא שוות כלום!'",
    next: "yam_shadow_part4_echo_rise"
  },

  yam_shadow_part3_grow: {
    speaker: "ים",
    character: "images/characters/yam_curious.png",
    text: "'להשתנות? לקום מהמיטה?! את בכלל מבינה כמה נוח פה תחת השמיכה?!'",
    next: "yam_shadow_part4_echo_rise"
  },

  yam_shadow_part3_truth: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    text: "'הבחירות שלי?! אני כולו רציתי לישון ולאכול בורקס בשקט, מה הפכתם את זה למחזה דרמה?!'",
    next: "yam_shadow_part4_echo_rise"
  },

  // --- PART 4: Revealing THE ECHO ---
  yam_shadow_part4_echo_rise: {
    speaker: "המספר",
    effect: "shake",
    text: "פתאום, הצל שמאחורי ים מתרחב ומתעצם.\nהאוויר בחדר נהיה כבד וצליל סטטי עמוק ממלא את החלל.\nצורת צל כהה עומדת מאחורי ים וחוזרת על תנועותיו באיחור.",
    next: "yam_shadow_part4_echo_speak"
  },

  yam_shadow_part4_echo_speak: {
    speaker: "THE ECHO",
    effect: "redflash",
    text: "☠ 'הוא תמיד יחזור... הוא לא באמת יעזוב...'\n'אם הוא בחר בה, אז לא נשאר לנו כלום!'\n'אם אמחק את הבחירה, הכול יחזור להיות כמו קודם!' ☠",
    next: "yam_shadow_part4_yam_struggle"
  },

  yam_shadow_part4_yam_struggle: {
    speaker: "ים",
    character: "images/characters/yam_surpise.png",
    text: "'שתוק! אני לא אמרתי את זה!\nינוור, אל תקשיב לו! זה... זה סתם הד שמשמיע דברים מתחת לבלטה!'",
    next: "yam_shadow_part4_invar_explain"
  },

  yam_shadow_part4_invar_explain: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'הצל הזה... משהו בו קשור ל-Resets והבטחות שלא קויימו.\nאני לא יודע בדיוק מה המקור שלו עדיין, אבל הוא מזין את עצמו מכל פעם שברחנו מאחריות.'",
    next: "yam_shadow_final_scene"
  },

  // --- FINAL DRAMATIC SCENE ---
  yam_shadow_final_scene: {
    speaker: "ים",
    character: "images/characters/yam_sad.png",
    text: "ים מסתכל על ינוור בעיניים כואבות, הקול שלו מפסיק להיות ציני.\n'אם היא לא הייתה מגיעה... היית נשאר איתי?'",
    next: "yam_shadow_final_invar_answer"
  },

  yam_shadow_final_invar_answer: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'כנראה.'",
    next: "yam_shadow_final_yam_accuse"
  },

  yam_shadow_final_yam_accuse: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    text: "'אז היא לקחה אותך ממני!'",
    next: "yam_shadow_final_invar_climax"
  },

  yam_shadow_final_invar_climax: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'לא.\nאתה לימדת אותי שאני לא יכול להמשיך לחכות לנצח.'",
    next: "yam_shadow_final_darkness"
  },

  yam_shadow_final_darkness: {
    speaker: "THE ECHO",
    effect: "redflash",
    vibrate: [200, 100, 200],
    text: "☠ 'אם הוא לא חוזר מרצונו... נחזיר אותו בדרך אחרת!' ☠",
    choices: [
      { text: "🛡️ לעמוד לצד ינוור", next: "yam_shadow_battle_start" }
    ]
  },

  yam_shadow_battle_start: {
    speaker: "המספר",
    text: "זירת הקרב נפתחת. השחקנית וינוור נעמדים זה לצד זה מול ים ו-THE ECHO!",
    minigame: {
      type: "yam_shadow_battle",
      nextSuccess: "yam_shadow_vertical_slice_end",
      nextFail: "yam_shadow_battle_fail"
    }
  },

  yam_shadow_vertical_slice_end: {
    speaker: "ים",
    character: "images/characters/yam_angry.png",
    text: "ים נסוג צעד אחד לאחור, נשען על הארון.\nהצל מאחוריו מבעבע ולא נעלם.\n'זה עדיין לא נגמר...'",
    choices: [
      { text: "🏠 חזרה לחדר של ים", next: "room_intro" },
      { text: "🔄 חזרה למסך הראשי", next: "start" }
    ]
  },

  yam_shadow_battle_fail: {
    speaker: "ינוור",
    character: "images/characters/invar.png",
    text: "'לא נכשלת. עכשיו אנחנו יודעים מאיפה הגשם מגיע.'",
    choices: [
      { text: "🔄 ניסיון חוזר", next: "yam_shadow_battle_start" },
      { text: "🏠 חזרה לחדר של ים", next: "room_intro" }
    ]
  },

  yam_shadow_invar_fallen_placeholder: {
    speaker: "ים",
    character: "images/characters/yam_surpise.png",
    effect: "redflash",
    text: "ים מפסיק לתקוף. הצל מאחוריו מתפרץ.\n'מה עשית לו...?!'\n\n📢 מסלול Grief Mode יתווסף בשלב Gameplay עתידי.",
    choices: [
      { text: "🏠 חזרה למסך הראשי", next: "start" }
    ]
  },

  // --- FUTURE DIALOGUE DRAFTS (INVAR DEATH LORE - UNCONNECTED TO GAMEPLAY) ---
  yam_shadow_future_invar_death_1: {
    speaker: "ים",
    character: "images/characters/yam_sad.png",
    text: "'כל הזמן חשבתי שהוא תמיד יחזור...'",
    next: "yam_shadow_future_invar_death_player"
  },

  yam_shadow_future_invar_death_player: {
    speaker: "השחקנית",
    text: "'הוא חזר. כל פעם מחדש.'",
    next: "yam_shadow_future_invar_death_2"
  },

  yam_shadow_future_invar_death_2: {
    speaker: "ים",
    character: "images/characters/yam_sad.png",
    text: "'אז למה הפעם הוא לא קם?\nהוא בחר בך כי את ידעת לשמור עליו... ואני רק ידעתי שהוא תמיד יסלח לי.'",
    choices: [
      { text: "🏠 חזרה למסך הראשי", next: "start" }
    ]
  }
});
