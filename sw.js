'use strict';
var CACHE = 'iphonehilfe-v1';
var DATEIEN = [
  './',
  'index.html',
  'css/styles.css',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable.svg',
  'js/dom.js',
  'js/data/anleitungen.js',
  'js/geraet.js',
  'js/einrichtung.js',
  'js/app.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(DATEIEN); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') { return; }
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) { return; }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (treffer) {
      if (treffer) { return treffer; }
      return fetch(e.request).then(function (antwort) {
        if (antwort && antwort.ok) {
          var kopie = antwort.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, kopie); });
        }
        return antwort;
      }).catch(function () {
        if (e.request.mode === 'navigate') { return caches.match('index.html'); }
      });
    })
  );
});
