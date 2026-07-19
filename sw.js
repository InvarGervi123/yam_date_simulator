const CACHE_NAME = 'yam-date-sim-v26-keyboard';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/minigames.css',
  './css/battle.css',
  './css/baldi.css',
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
  './src/engine.js',
  './src/story/setup.js',
  './src/story/main.js',
  './src/story/special.js',
  './src/story/court.js',
  './src/story/battle.js',
  './src/story/baldi.js',
  './src/story/endings.js',
  './src/story/dialogue_expansions.js',
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
  './images/backgrounds/room.jpg',
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
  './audio/Panic.mp3'
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

// Fetch interceptor: Stale-While-Revalidate strategy
// Instantly serves from cache, fetches from network in background to update cache
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchedResponse = fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Silent catch for offline fetch failures
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});
