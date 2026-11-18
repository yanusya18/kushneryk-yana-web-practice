/**
 * seo.js — SEO для односторінкового застосунку (SPA).
 * Браузер вантажить один index.html, тому title, description, canonical та Open Graph
 * для кожного маршруту оновлюємо з JavaScript. Функції приймають `doc`, щоб їх можна було тестувати.
 *
 * Обмеження SPA: сучасні пошуковики (Google) виконують JS і бачать ці теги, але частина ботів
 * (соцмережі, месенджери) читає лише початковий index.html. Для повного SEO застосовують SSR/prerender.
 */

export const SITE_NAME = 'Простір'
export const DEFAULT_TITLE = 'Простір — коворкінг із бронюванням робочих місць'
const JSON_LD_ID = 'page-jsonld'

/** Адреса сайту: VITE_SITE_URL (задається при деплої) або поточний origin. Без «/» в кінці. */
export function getSiteUrl() {
  const fromEnv = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SITE_URL : undefined
  return (fromEnv || window.location.origin).replace(/\/$/, '')
}

/** title вкладки: «Каталог — Простір»; для головної (title = null) — повна назва. */
export function buildTitle(title) {
  return title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
}

/** Знаходить <meta> за атрибутом (name або property) або створює новий у <head>. */
function upsertMeta(doc, attr, key, content) {
  let element = doc.head.querySelector(`meta[${attr}="${key}"]`)
  if (!element) {
    element = doc.createElement('meta')
    element.setAttribute(attr, key)
    doc.head.append(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(doc, href) {
  let link = doc.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = doc.createElement('link')
    link.setAttribute('rel', 'canonical')
    doc.head.append(link)
  }
  link.setAttribute('href', href)
}

/**
 * Застосовує SEO-дані маршруту до <head>.
 * @param {{title: string|null, description: string, path: string, noindex?: boolean}} seo
 */
export function applySeo({ title, description, path, noindex = false }, doc = document, siteUrl = getSiteUrl()) {
  const fullTitle = buildTitle(title)
  const url = `${siteUrl}${path}`

  doc.title = fullTitle
  upsertMeta(doc, 'name', 'description', description)
  upsertMeta(doc, 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  upsertCanonical(doc, url)

  // Open Graph — попередній перегляд посилання в соцмережах і месенджерах
  upsertMeta(doc, 'property', 'og:type', 'website')
  upsertMeta(doc, 'property', 'og:site_name', SITE_NAME)
  upsertMeta(doc, 'property', 'og:locale', 'uk_UA')
  upsertMeta(doc, 'property', 'og:title', fullTitle)
  upsertMeta(doc, 'property', 'og:description', description)
  upsertMeta(doc, 'property', 'og:url', url)
}

/** Вставляє (або оновлює) блок JSON-LD; data === null — прибирає його. */
export function setJsonLd(data, doc = document) {
  const existing = doc.getElementById(JSON_LD_ID)
  if (!data) {
    existing?.remove()
    return
  }
  const script = existing ?? doc.createElement('script')
  script.id = JSON_LD_ID
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  if (!existing) doc.head.append(script)
}

/** Опис місця для <meta description>: до ~155 символів, із ціною. */
export function buildWorkspaceDescription(workspace, maxLength = 155) {
  const price = `${workspace.pricePerHour} грн/год.`
  const base = `${workspace.name}: ${workspace.description}`
  const full = `${base} ${price}`
  if (full.length <= maxLength) return full
  const room = maxLength - price.length - 2 // 2 = пробіл і «…»
  return `${base.slice(0, room).trimEnd()}… ${price}`
}

/**
 * Schema.org Product + Offer для сторінки робочого місця.
 * Ціна задана за годину (UnitPriceSpecification, unitCode HUR = година).
 */
export function buildWorkspaceJsonLd(workspace, { siteUrl, imageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: workspace.name,
    description: workspace.description,
    image: imageUrl,
    category: 'Coworking space',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/items/${workspace.id}`,
      priceCurrency: 'UAH',
      price: workspace.pricePerHour,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: workspace.pricePerHour,
        priceCurrency: 'UAH',
        unitCode: 'HUR',
      },
      availability: 'https://schema.org/InStock',
    },
  }
}
