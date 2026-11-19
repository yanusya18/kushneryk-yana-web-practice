/**
 * Реєструє service worker (public/sw.js) лише в production-збірці:
 * у режимі розробки (npm run dev) кеш заважав би бачити свіжий код.
 * Service worker працює лише на HTTPS (або localhost) — хостинг Vercel/Netlify це забезпечує.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Не вдалося зареєструвати service worker:', error)
    })
  })
}
