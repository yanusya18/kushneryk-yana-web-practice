import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getWorkspaces } from '../api/api.js'
import Button from '../components/Button.jsx'
import CardList from '../components/CardList.jsx'
import FilterForm from '../components/FilterForm.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSeo } from '../hooks/useSeo.js'
import { useFetch } from '../hooks/useFetch.js'
import { applyFilters, EMPTY_FILTERS, hasActiveFilters } from '../utils/catalog.js'

const DEBOUNCE_MS = 300
const TYPES = ['open-space', 'fixed-desk', 'private-office', 'meeting-room']

/** Початкові фільтри з адреси: /catalog?q=вікна&type=open-space&max_price=80 */
function readInitialFilters(params) {
  const type = params.get('type')
  return {
    ...EMPTY_FILTERS,
    query: params.get('q') ?? '',
    type: TYPES.includes(type) ? type : '',
    maxPrice: params.get('max_price') ?? '',
  }
}

export default function CatalogPage() {
  useSeo({
    title: 'Каталог робочих місць',
    description:
      'Каталог робочих місць коворкінгу: open space, фіксовані столи, приватні кабінети та переговорні. Фільтруйте за типом і ціною та бронюйте онлайн.',
  })
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => readInitialFilters(searchParams))
  const searchRef = useRef(null)

  const { data, loading, error, refetch } = useFetch(getWorkspaces)

  // Поля пошуку й ціни «відкладаємо» на 300 мс: список не перебудовується на кожну літеру
  const debouncedQuery = useDebounce(filters.query, DEBOUNCE_MS)
  const debouncedPrice = useDebounce(filters.maxPrice, DEBOUNCE_MS)
  const applied = { ...filters, query: debouncedQuery, maxPrice: debouncedPrice }

  // useMemo: фільтруємо заново лише коли змінились дані або застосовані фільтри
  const items = useMemo(
    () => applyFilters(data ?? [], { query: debouncedQuery, type: filters.type, maxPrice: debouncedPrice, sort: filters.sort }),
    [data, debouncedQuery, debouncedPrice, filters.type, filters.sort],
  )
  const filtered = hasActiveFilters(applied)

  function handleChange(name, value) {
    setFilters((previous) => ({ ...previous, [name]: value }))
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    searchRef.current?.focus()
  }

  return (
    <main id="main-content" tabIndex={-1} className="container">
      <h1>Каталог робочих місць</h1>

      <section aria-labelledby="filters-title">
        <h2 id="filters-title">Пошук і фільтри</h2>
        <FilterForm filters={filters} onChange={handleChange} onReset={handleReset} searchRef={searchRef} />
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">Доступні місця</h2>
        <p className="results-count" role="status">
          {!loading && !error && items.length > 0 ? `Знайдено місць: ${items.length}` : ''}
        </p>
        <CardList
          items={items}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyTitle={filtered ? 'Нічого не знайдено.' : 'Поки що немає доступних робочих місць.'}
          emptyContent={
            filtered ? (
              <>
                <p>Спробуйте змінити пошуковий запит або прибрати фільтри.</p>
                <p>
                  <Button variant="secondary" onClick={handleReset}>
                    Скинути фільтри
                  </Button>
                </p>
              </>
            ) : (
              <p>Зазирніть пізніше.</p>
            )
          }
        />
      </section>
    </main>
  )
}
