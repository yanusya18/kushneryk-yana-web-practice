import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Перевіряємо файли PWA з client/public: маніфест має відповідати вимогам «встановлюваного» сайту
const publicFile = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))
const manifest = JSON.parse(readFileSync(publicFile('manifest.webmanifest'), 'utf-8'))

/** Розміри PNG читаємо із заголовка файлу (байти 16–23: ширина й висота). */
function pngSize(file) {
  const bytes = readFileSync(file)
  return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`
}

describe('PWA manifest', () => {
  it('містить назву, початкову адресу й режим standalone', () => {
    expect(manifest.name).toContain('Простір')
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
  })
  it('має theme_color і background_color', () => {
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i)
  })
  it('має іконки 192 і 512 px', () => {
    const sizes = manifest.icons.map((icon) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })
  it('файли іконок існують і мають заявлені розміри', () => {
    for (const icon of manifest.icons) {
      expect(pngSize(publicFile(icon.src.replace(/^\//, '')))).toBe(icon.sizes)
    }
  })
  it('є maskable-іконка для Android', () => {
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
  })
})

describe('service worker', () => {
  const source = readFileSync(publicFile('sw.js'), 'utf-8')
  it('кешує офлайн-сторінку при встановленні', () => {
    expect(source).toContain("'/offline.html'")
  })
  it('не втручається в запити, що змінюють дані (API)', () => {
    expect(source).toContain("request.method !== 'GET'")
  })
})
