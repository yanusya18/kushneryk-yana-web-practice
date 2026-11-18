/**
 * catalog.js — сторінка каталогу: завантаження через fetch, динамічні картки,
 * пошук, фільтр за типом і ціною, сортування, debounce 300 мс,
 * стани «завантаження» / «помилка» / «немає даних».
 */
import { getWorkspaces } from './api.js';
import { initCardClicks, markCardsClickable } from './ui.js';
import { debounce, escapeHtml, formatCapacity, TYPE_LABELS } from './utils.js';

const DEBOUNCE_MS = 300;

const form = document.getElementById('filters-form');
const searchInput = document.getElementById('search');
const typeSelect = document.getElementById('type');
const priceInput = document.getElementById('max-price');
const sortSelect = document.getElementById('sort');
const resetButton = document.getElementById('filters-reset');
const list = document.getElementById('workspace-list');
const stateBox = document.getElementById('catalog-state');
const counter = document.getElementById('results-count');

/** Усі місця, отримані з API (фільтруємо копію, оригінал не змінюємо). */
let allWorkspaces = [];

// ---------- Стани ----------

function showLoading() {
  list.replaceChildren();
  list.setAttribute('aria-busy', 'true');
  counter.textContent = '';
  stateBox.className = 'state';
  stateBox.hidden = false;
  stateBox.innerHTML = '<span class="spinner" aria-hidden="true"></span><p>Завантажуємо робочі місця…</p>';
}

function showError(message) {
  list.setAttribute('aria-busy', 'false');
  counter.textContent = '';
  stateBox.className = 'state state--error';
  stateBox.hidden = false;
  stateBox.innerHTML = `
    <p><strong>Не вдалося завантажити каталог.</strong></p>
    <p>${escapeHtml(message)}</p>
    <p><button class="button" type="button" data-action="retry">Спробувати ще раз</button></p>`;
}

function showEmpty(hasFilters) {
  stateBox.className = 'state';
  stateBox.hidden = false;
  stateBox.innerHTML = hasFilters
    ? `<p><strong>Нічого не знайдено.</strong></p>
       <p>Спробуйте змінити пошуковий запит або прибрати фільтри.</p>
       <p><button class="button button--secondary" type="button" data-action="reset">Скинути фільтри</button></p>`
    : '<p><strong>Поки що немає доступних робочих місць.</strong></p><p>Зазирніть пізніше.</p>';
}

function hideState() {
  stateBox.hidden = true;
  stateBox.innerHTML = '';
}

// ---------- Картки ----------

/** Шаблон однієї картки; той самий вигляд, що й у статичній розмітці ПР 4–5. */
function renderCard(workspace) {
  const base = `../assets/images/${workspace.image}`;
  return `
    <article class="card">
      <figure>
        <picture>
          <source type="image/webp" srcset="${base}-400.webp 400w, ${base}-800.webp 800w" sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, 100vw">
          <img src="${base}-800.jpg" width="800" height="600" alt="${escapeHtml(workspace.imageAlt)}" loading="lazy" decoding="async">
        </picture>
        <figcaption>${escapeHtml(TYPE_LABELS[workspace.type] ?? workspace.type)}</figcaption>
      </figure>
      <h3>${escapeHtml(workspace.name)}</h3>
      <p>${escapeHtml(workspace.description)}</p>
      <p><data value="${workspace.pricePerHour}">${workspace.pricePerHour} грн</data> / година · ${formatCapacity(workspace.capacity)}</p>
      <p><a class="button button--secondary" href="workspace.html?id=${workspace.id}">Детальніше та бронювання</a></p>
    </article>`;
}

// ---------- Фільтрація і сортування ----------

function readFilters() {
  const maxPrice = priceInput.value === '' ? null : Number(priceInput.value);
  return {
    query: searchInput.value.trim().toLowerCase(),
    type: typeSelect.value,
    maxPrice: Number.isFinite(maxPrice) && maxPrice >= 0 ? maxPrice : null,
    sort: sortSelect.value
  };
}

const SORTERS = {
  default: null,
  'price-asc': (a, b) => a.pricePerHour - b.pricePerHour,
  'price-desc': (a, b) => b.pricePerHour - a.pricePerHour,
  name: (a, b) => a.name.localeCompare(b.name, 'uk')
};

function applyFilters(items, { query, type, maxPrice, sort }) {
  const result = items.filter(
    (item) =>
      (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)) &&
      (!type || item.type === type) &&
      (maxPrice === null || item.pricePerHour <= maxPrice)
  );
  const sorter = SORTERS[sort];
  return sorter ? result.sort(sorter) : result; // filter створив нову копію, тож sort безпечний
}

function render() {
  const filters = readFilters();
  const items = applyFilters(allWorkspaces, filters);
  const hasFilters = Boolean(filters.query || filters.type || filters.maxPrice !== null);

  list.setAttribute('aria-busy', 'false');
  list.innerHTML = items.map(renderCard).join('');

  if (items.length === 0) {
    counter.textContent = '';
    showEmpty(hasFilters);
  } else {
    hideState();
    counter.textContent = `Знайдено місць: ${items.length}`;
  }
}

// ---------- Завантаження ----------

async function loadCatalog() {
  showLoading();
  try {
    allWorkspaces = await getWorkspaces(); // fetch + async/await всередині api.js
    render();
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

function resetFilters() {
  form.reset();
  render();
  searchInput.focus();
}

/** Початкові значення фільтрів з адреси (?q=...&type=...&max_price=...). */
function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  searchInput.value = params.get('q') ?? '';
  if ([...typeSelect.options].some((option) => option.value === params.get('type'))) {
    typeSelect.value = params.get('type');
  }
  priceInput.value = params.get('max_price') ?? '';
}

// ---------- Підключення подій ----------

const debouncedRender = debounce(render, DEBOUNCE_MS);

searchInput.addEventListener('input', debouncedRender);
priceInput.addEventListener('input', debouncedRender);
typeSelect.addEventListener('change', render);
sortSelect.addEventListener('change', render);
resetButton.addEventListener('click', resetFilters);

// Форма в HTML має action/method для режиму без JS; з JS сторінку не перезавантажуємо
form.addEventListener('submit', (event) => {
  event.preventDefault();
  render();
});

// Делегування: кнопки в блоці стану («Спробувати ще раз», «Скинути фільтри»)
stateBox.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'retry') loadCatalog();
  if (action === 'reset') resetFilters();
});

// Делегування: клік по картці веде на сторінку місця
initCardClicks(list);
markCardsClickable(list);

applyQueryParams();
loadCatalog();
