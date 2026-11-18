import { describe, expect, it } from 'vitest'
import { applyFilters, EMPTY_FILTERS, hasActiveFilters } from './catalog.js'

const items = [
  { id: 1, name: 'Місце A1 — біля вікна', description: 'Світле місце', type: 'open-space', pricePerHour: 70 },
  { id: 2, name: 'Місце B1 — із монітором', description: 'Є монітор', type: 'fixed-desk', pricePerHour: 90 },
  { id: 3, name: 'Переговорна M1', description: 'Екран і дошка', type: 'meeting-room', pricePerHour: 300 },
]

describe('applyFilters', () => {
  it('без фільтрів повертає всі місця', () => {
    expect(applyFilters(items, EMPTY_FILTERS)).toHaveLength(3)
  })
  it('шукає за назвою без урахування регістру', () => {
    const result = applyFilters(items, { ...EMPTY_FILTERS, query: 'ВІКНА' })
    expect(result.map((i) => i.id)).toEqual([1])
  })
  it('фільтрує за типом', () => {
    expect(applyFilters(items, { ...EMPTY_FILTERS, type: 'fixed-desk' })).toHaveLength(1)
  })
  it('фільтрує за максимальною ціною', () => {
    const result = applyFilters(items, { ...EMPTY_FILTERS, maxPrice: '90' })
    expect(result.map((i) => i.id)).toEqual([1, 2])
  })
  it('ігнорує некоректну ціну', () => {
    expect(applyFilters(items, { ...EMPTY_FILTERS, maxPrice: '-5' })).toHaveLength(3)
  })
  it('сортує від дорожчих до дешевших', () => {
    const result = applyFilters(items, { ...EMPTY_FILTERS, sort: 'price-desc' })
    expect(result.map((i) => i.id)).toEqual([3, 2, 1])
  })
  it('не змінює вихідний масив', () => {
    const copy = [...items]
    applyFilters(items, { ...EMPTY_FILTERS, sort: 'price-desc' })
    expect(items).toEqual(copy)
  })
})

describe('hasActiveFilters', () => {
  it('false для порожніх фільтрів, true коли щось задано', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false)
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: 'a' })).toBe(true)
  })
})
