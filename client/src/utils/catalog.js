/** Чиста логіка каталогу: фільтрація й сортування списку місць. */

const SORTERS = {
  default: null,
  'price-asc': (a, b) => a.pricePerHour - b.pricePerHour,
  'price-desc': (a, b) => b.pricePerHour - a.pricePerHour,
  name: (a, b) => a.name.localeCompare(b.name, 'uk'),
}

/**
 * @param {Array} items — усі місця
 * @param {{query: string, type: string, maxPrice: string, sort: string}} filters
 * Повертає НОВИЙ масив (оригінал не змінюється).
 */
export function applyFilters(items, { query, type, maxPrice, sort }) {
  const q = query.trim().toLowerCase()
  const max = maxPrice === '' ? null : Number(maxPrice)
  const limit = Number.isFinite(max) && max >= 0 ? max : null

  const result = items.filter(
    (item) =>
      (!q || `${item.name} ${item.description}`.toLowerCase().includes(q)) &&
      (!type || item.type === type) &&
      (limit === null || item.pricePerHour <= limit),
  )
  const sorter = SORTERS[sort]
  return sorter ? result.sort(sorter) : result // filter створив копію, тож sort безпечний
}

export function hasActiveFilters({ query, type, maxPrice }) {
  return Boolean(query.trim() || type || maxPrice !== '')
}

export const EMPTY_FILTERS = { query: '', type: '', maxPrice: '', sort: 'default' }
