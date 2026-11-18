/**
 * generate-seo.mjs — створює public/robots.txt і public/sitemap.xml.
 * Запускається автоматично перед збіркою (npm run build → prebuild).
 *
 * Адреса сайту береться зі змінної SITE_URL, напр.:
 *   SITE_URL=https://my-site.vercel.app npm run build
 * Якщо змінна не задана, використовується заглушка https://example.com — замініть її після деплою (ПР 10).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

// Сторінки робочих місць беремо з тих самих даних, що й сайт
const workspaces = JSON.parse(readFileSync(resolve(root, 'assets/data/workspaces.json'), 'utf-8')).filter((w) => w.isActive)

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/catalog', priority: '0.9', changefreq: 'weekly' },
  ...workspaces.map((w) => ({ path: `/items/${w.id}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/contacts', priority: '0.6', changefreq: 'yearly' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

mkdirSync(resolve(root, 'public'), { recursive: true })
writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap)
writeFileSync(resolve(root, 'public/robots.txt'), robots)
console.log(`SEO-файли створено для ${siteUrl} (${pages.length} адрес)`)
