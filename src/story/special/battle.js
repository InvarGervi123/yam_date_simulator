// --- Story Chapter: BATTLE ---
Object.assign(window.story, {
  boss_fight_intro: {
    speaker: "המספר",
    music: "audio/boss_fight.mp3",
    text: "אתה נעמד באמצע החדר.\nמוזיקה אלקטרונית מוזרה מתחילה להתנגן באוויר.\nשם למטה, בתוך המיטה, ים פותח עין אחת זוהרת.\n'רצית קרב? קיבלת!'\nהעולם מסביב מוחשך, והלב האדום שלך נחשף!",
    choices: [
      { text: "להתחיל בקרב!", next: "boss_fight_start" }
    ]
  },

  boss_fight_start: {
    speaker: "המספר",
    text: "קרב בבוס פעיל!",
    minigame: {
      type: "deltarune_battle",
      duration: 999999, // Handled internally by JS battle engine
      nextSuccess: "boss_fight_win",
      nextFail: "boss_fight_lose",
      items: [
        { name: "בורקס חם מהתנור (מרפא 50 HP)", heal: 50, sfx: "audio/healing.mp3" },
        { name: "פחית אנרגיה של ינוור (מרפא 30 HP)", heal: 30, sfx: "audio/click.mp3" }
      ]
    }
  },

  boss_fight_win: {
    character: "images/characters/yam_dead.png",
    speaker: "ים",
    characterAnimation: "shake",
    effect: "shake",
    music: "audio/main.mp3",
    sfx: "audio/truimph.mp3",
    text: "ים קורס על המיטה, מתנשף.\n'בסדר... בסדר! ניצחת! המיטה שלך חזקה יותר...\nאני אקום, אני אצא איתך לדייט. רק תפסיק לתקוף אותי עם הנתונים האנליטיים האלה!'",
    choices: [
      { text: "לגרור אותו לדייט הניצחון בפתח תקווה!", next: "end_boss_victory_force" }
    ]
  },

  boss_fight_lose: {
    speaker: "המספר",
    effect: "redflash",
    music: "audio/game_over.mp3",
    text: "הלב שלך נסדק ונשבר לרסיסים...\nים מביט בגופתך המובסת ומפהק פיהוק ענק.\n'פפפ... נוקאאוט. עכשיו אני יכול לחזור לישון בשקט לעוד חצי שנה.'\nמוזיקת מוות אירונית מתחילה להתנגן ברקע...",
    choices: [
      { text: "לגלות מה קרה לגופה שלך...", next: "end_boss_defeat" }
    ]
  },

  boss_fight_spare: {
    character: "images/characters/yam_dead.png",
    speaker: "ים",
    characterAnimation: "bounce",
    text: "ים מביט בך בעיניים דומעות.\n'ריחמת עלי? למרות שידעת שיש לי מינוס שלושה סאבים?!'\nהוא קם מהמיטה מרצונו החופשי.\n'אתה חבר אמיתי. יאללה, בוא נלך לאכול בורקס ולדבר על האלגוריתם.'",
    choices: [
      { text: "לצאת לדייט רומנטי ובריא", next: "end_boss_spare" }
    ]
  }

});
