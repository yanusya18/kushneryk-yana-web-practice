/**
 * sw.js — service worker (ПР 10).
 *
 * Що робить:
 *  • при встановленні кешує «оболонку»: головну, офлайн-сторінку, маніфест, іконки;
 *  • статичні файли збірки (/assets/*, іконки) віддає з кешу, а якщо їх там ще немає — завантажує й кешує (cache-first);
 *  • навігацію (відкриття сторінок) робить «мережа спочатку»; без мережі показує /offline.html;
 *  • запити до API НЕ кешує: бронювання й доступність часу завжди мають бути актуальними.
 *
 * Оновлення: змініть VERSION — старі кеші буде видалено при активації нової версії.
 */
const VERSION = 'v1'
const CACHE_NAME = `coworking-${VERSION}`
const PRECACHE_URLS = ['/', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('coworking-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

/** Файли збірки Vite мають хеш у назві (змінився вміст — змінилась назва), тому їх безпечно кешувати назавжди. */
const isStaticAsset = (url) => url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return // POST/PUT/DELETE (API) не чіпаємо

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // API та зовнішні ресурси (мапа) — напряму в мережу

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            }
            return response
          }),
      ),
    )
  }
})
