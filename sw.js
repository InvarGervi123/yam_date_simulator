const CACHE_NAME = 'yam-date-sim-v111-multi-channel-sfx-and-audio-unlocked';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/minigames.css',
  './css/battle.css',
  './css/baldi.css',
  './css/atmosphere.css',
  './css/court.css',
  './src/audio.js',
  './src/minigames.js',
  './src/battle.js',
  './src/battle_arena.js',
  './src/baldi.js',
  './src/baldi_renderer.js',
  './src/slender.js',
  './src/slender_renderer.js',
  './src/ascii_converter.js',
  './src/preg_game.js',
  './src/preg_game_renderer.js',
  './src/gamepad.js',
  './src/atmosphere.js',
  './src/court_engine.js',
  './src/engine.js',
  './src/story/setup.js',
  './src/story/main.js',
  './src/story/special.js',
  './src/story/court.js',
  './src/story/battle.js',
  './src/story/baldi.js',
  './src/story/endings.js',
  './src/story/dialogue_expansions.js',
  './src/story/yam_shadow_story.js',
  './src/story/polish_chocolate.js',
  './src/story/polish_chocolate_ch2.js',
  './src/story/polish_chocolate_ch3.js',
  './src/story/polish_chocolate_ch4.js',
  './src/wii_pulse_game.js',
  './src/yam_shadow_battle.js',
  './src/yam_shadow_renderer.js',
  './images/characters/yam_sleepy.png',
  './images/characters/yam.png',
  './images/characters/Boss_fight.png',
  './images/characters/yam_boss_animation_food_1.png',
  './images/characters/yam_boss_animation_food_2.png',
  './images/characters/yam_boss_animation_food_3.png',
  './images/characters/yam_angry.png',
  './images/characters/yam_sad.png',
  './images/characters/yam_curious.png',
  './images/characters/yam_happy.png',
  './images/characters/yam_horny.png',
  './images/characters/yam_surpise.png',
  './images/characters/yam_alien.png',
  './images/characters/yam_dead.png',
  './images/characters/invar.png',
  './images/characters/ינוור החרדי.png',
  './images/characters/ים חרדי.png',
  './images/backgrounds/room.jpg',
  './images/backgrounds/בית משפט.png',
  './images/backgrounds/התנגדות.png',
  './images/backgrounds/לוגו מוסד.png',
  './audio/boss_fight.mp3',
  './audio/break.mp3',
  './audio/click.mp3',
  './audio/crack.mp3',
  './audio/dodge.mp3',
  './audio/game_over.mp3',
  './audio/healing.mp3',
  './audio/hit.mp3',
  './audio/inject.mp3',
  './audio/main.mp3',
  './audio/rip.mp3',
  './audio/truimph.mp3',
  './audio/the_clockwork_void.mp3',
  './audio/the_clockwork_void_extend.mp3',
  './audio/Panic.mp3',
  './audio/baldi_sound.mp3',
  './audio/בואי תמי (גרסא לדייטים).mp3',
  './audio/גישה פיזית ודרמטית.mp3',
  './audio/ים דייט סימולטור - תפריט ראשי.mp3',
  './audio/נתיבים מיוחדים והרפתקאות.mp3',
  './audio/פיניקס בייט_ הסנגור לענייני קלוריות.mp3'
];

// Install Service Worker and cache all resources
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate and remove old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch interceptor: Stale-While-Revalidate with decoded URI fallback for Hebrew filenames
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        // Try decoded URI match (for Hebrew filenames and spaces)
        try {
          const decodedUrl = decodeURI(e.request.url);
          if (decodedUrl !== e.request.url) {
            return cache.match(decodedUrl).then((decMatch) => {
              if (decMatch) return decMatch;
              return fetchFromNetwork();
            });
          }
        } catch (err) {}

        function fetchFromNetwork() {
          return fetch(e.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return cache.match('./index.html');
          });
        }

        return fetchFromNetwork();
      });
    })
  );
});
