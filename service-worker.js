const CACHE = "tower-v1";
const ASSETS = [
  "./index.html",
  "./game.js",
  "./manifest.json",
  "./drop.wav",
  "./invalid.wav",
  "./win.wav",
  // plus any CSS or image files
];

self.addEventListener("install", evt =>
  evt.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))
);

self.addEventListener("fetch", evt =>
  evt.respondWith(caches.match(evt.request).then(r=>r||fetch(evt.request)))
);