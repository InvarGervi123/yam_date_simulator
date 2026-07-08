// --- Story Chapter: BALDI ---
Object.assign(window.story, {
  baldi_intro: {
    speaker: "ים",
    text: "ים שולף מהמיטה טאבלט פלסטיק ירוק ומיושן.\n'רוצה ללכת לדייט? קודם כל נוכיח שאתה ראוי לזה מבחינה אינטלקטואלית! קח את הטאבלט הלימודי שלי, You Can Think! Pad, ופתור את 3 התרגילים. אם תעשה טעות... כדאי שתתחיל לרוץ מהר.'",
    choices: [
      { text: "לקחת את הטאבלט ולהתחיל לפתור!", next: "baldi_game_start" },
      { text: "זה נשמע לי פסיכוטי מדי, אני מוותר", next: "room_intro_special" }
    ]
  },

  baldi_game_start: {
    speaker: "הטאבלט הלימודי",
    text: "מתחבר לטאבלט...",
    minigame: {
      type: "baldi_basics",
      nextSuccess: "baldi_win",
      nextFail: "baldi_lose"
    }
  },

  baldi_win: {
    speaker: "ים",
    characterAnimation: "bounce",
    text: "ים מביט בך בהלם, משליך את סרגל העץ שלו הצידה.\n'וואו! פתרת הכל והצלחת להתחמק מכל מכות הסרגל שלי! אתה גאון אמיתי. מגיע לך פרס - דייט בורקס רומנטי ויוקרתי!'",
    choices: [
      { text: "לצאת לדייט הלימודי המנצח!", next: "end_baldi_success" }
    ]
  },

  baldi_lose: {
    speaker: "ים",
    characterAnimation: "shake",
    effect: "redflash",
    text: "ים עומד מעליך כשהסרגל ביד שלו והעיניים שלו זוהרות באדום.\n'אני שונא תשובות שגויות! הגיע זמן העונש!'",
    choices: [
      { text: "לקבל את גזר הדין...", next: "end_baldi_fail" }
    ]
  }

});
