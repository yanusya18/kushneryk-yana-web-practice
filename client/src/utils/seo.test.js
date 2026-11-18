import { beforeEach, describe, expect, it } from 'vitest'
import { applySeo, buildTitle, buildWorkspaceDescription, buildWorkspaceJsonLd, setJsonLd } from './seo.js'

const SITE = 'https://coworking.test'

beforeEach(() => {
  document.head.innerHTML = ''
  document.title = ''
})

describe('applySeo', () => {
  it('встановлює title, description і canonical', () => {
    applySeo({ title: 'Каталог', description: 'Опис каталогу', path: '/catalog' }, document, SITE)
    expect(document.title).toBe('Каталог — Простір')
    expect(document.head.querySelector('meta[name="description"]').content).toBe('Опис каталогу')
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe(`${SITE}/catalog`)
  })
  it('оновлює існуючі теги замість створення дублікатів', () => {
    applySeo({ title: 'A', description: 'a', path: '/a' }, document, SITE)
    applySeo({ title: 'B', description: 'b', path: '/b' }, document, SITE)
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelector('meta[property="og:title"]').content).toBe('B — Простір')
  })
  it('для сторінки помилки ставить noindex', () => {
    applySeo({ title: '404', description: 'x', path: '/zzz', noindex: true }, document, SITE)
    expect(document.head.querySelector('meta[name="robots"]').content).toContain('noindex')
  })
})

describe('buildTitle', () => {
  it('для головної (null) повертає повну назву сайту', () => {
    expect(buildTitle(null)).toContain('коворкінг')
  })
})

describe('JSON-LD', () => {
  const workspace = { id: 1, name: 'Місце A1', description: 'Опис', pricePerHour: 70 }

  it('buildWorkspaceJsonLd формує Product з Offer у гривнях', () => {
    const data = buildWorkspaceJsonLd(workspace, { siteUrl: SITE, imageUrl: `${SITE}/a1.jpg` })
    expect(data['@type']).toBe('Product')
    expect(data.offers.priceCurrency).toBe('UAH')
    expect(data.offers.url).toBe(`${SITE}/items/1`)
  })
  it('setJsonLd додає й прибирає скрипт', () => {
    setJsonLd({ '@type': 'Product' }, document)
    expect(document.getElementById('page-jsonld').type).toBe('application/ld+json')
    setJsonLd(null, document)
    expect(document.getElementById('page-jsonld')).toBeNull()
  })
})

describe('buildWorkspaceDescription', () => {
  it('не перевищує 155 символів і містить ціну', () => {
    const long = { name: 'Місце', description: 'д'.repeat(400), pricePerHour: 70 }
    const text = buildWorkspaceDescription(long)
    expect(text.length).toBeLessThanOrEqual(155)
    expect(text).toContain('70 грн')
  })
})
