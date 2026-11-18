import { useId } from 'react'
import Button from './Button.jsx'

/**
 * FilterForm — форма пошуку й фільтрів каталогу. Усі поля контрольовані:
 * значення живуть у стані батьківської сторінки (CatalogPage), тут лише відображення й події.
 */
export default function FilterForm({ filters, onChange, onReset, searchRef }) {
  const id = useId()

  function handleChange(event) {
    onChange(event.target.name, event.target.value)
  }

  return (
    <form className="form form--wide" onSubmit={(event) => event.preventDefault()}>
      <fieldset>
        <legend>Параметри пошуку</legend>
        <div className="filters-grid">
          <p>
            <label htmlFor={`${id}-q`}>Назва місця</label>
            <input
              ref={searchRef}
              type="search"
              id={`${id}-q`}
              name="query"
              value={filters.query}
              onChange={handleChange}
              maxLength={60}
              placeholder="Наприклад, біля вікна"
            />
          </p>
          <p>
            <label htmlFor={`${id}-type`}>Тип місця</label>
            <select id={`${id}-type`} name="type" value={filters.type} onChange={handleChange}>
              <option value="">Усі типи</option>
              <option value="open-space">Open space</option>
              <option value="fixed-desk">Фіксоване місце</option>
              <option value="private-office">Приватний кабінет</option>
              <option value="meeting-room">Переговорна</option>
            </select>
          </p>
          <p>
            <label htmlFor={`${id}-price`}>Макс. ціна за годину, грн</label>
            <input
              type="number"
              id={`${id}-price`}
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              min={0}
              max={1000}
              step={10}
              inputMode="numeric"
            />
          </p>
          <p>
            <label htmlFor={`${id}-sort`}>Сортування</label>
            <select id={`${id}-sort`} name="sort" value={filters.sort} onChange={handleChange}>
              <option value="default">За замовчуванням</option>
              <option value="price-asc">Спочатку дешевші</option>
              <option value="price-desc">Спочатку дорожчі</option>
              <option value="name">За назвою</option>
            </select>
          </p>
        </div>
      </fieldset>
      <div className="filters-actions">
        <Button variant="secondary" onClick={onReset}>
          Скинути
        </Button>
      </div>
    </form>
  )
}
