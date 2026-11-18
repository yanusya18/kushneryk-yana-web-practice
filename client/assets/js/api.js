/**
 * api.js — єдине місце, де код працює з даними.
 *
 * ПР 6: дані беремо з локальних JSON-файлів (assets/data/) через fetch,
 *       а бронювання користувача зберігаємо в localStorage браузера.
 * ПР 8: тут з'явиться fetch до власного Express-API (/api/items, /api/bookings).
 *       Інші модулі не зміняться, бо вони викликають лише ці функції.
 *
 * Режими демонстрації станів (для захисту та скриншотів), параметр у URL:
 *   ?demo=loading — довге завантаження (3 с)
 *   ?demo=error   — імітація помилки мережі
 *   ?demo=empty   — порожній список
 */
import { dateFromToday } from './utils.js';
import { findConflict } from './booking.js';

// new URL(..., import.meta.url) — шлях рахується від цього файлу, а не від сторінки.
const WORKSPACES_URL = new URL('../data/workspaces.json', import.meta.url);
const BOOKINGS_URL = new URL('../data/bookings.json', import.meta.url);
const STORAGE_KEY = 'coworking:bookings';

const demoMode = new URLSearchParams(window.location.search).get('demo');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Кеш у пам'яті: JSON завантажується один раз за відвідування сторінки. */
const cache = {};

/**
 * Універсальний запит: fetch + async/await.
 * fetch ПОВЕРТАЄ Promise<Response> і НЕ кидає помилку на 404/500 —
 * тому вручну перевіряємо response.ok.
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Сервер відповів з помилкою ${response.status}`);
  }
  return response.json();
}

async function loadCached(key, url) {
  if (!cache[key]) cache[key] = await fetchJson(url);
  return cache[key];
}

/** Імітація станів для демонстрації. У звичайному режимі нічого не робить. */
async function applyDemoMode() {
  if (demoMode === 'loading') await sleep(3000);
  if (demoMode === 'error') {
    await sleep(600);
    throw new Error('Не вдалося з’єднатися із сервером (демо-режим).');
  }
}

// ---------------------------------------------------------------------------
// Робочі місця
// ---------------------------------------------------------------------------

/** Усі активні робочі місця. */
export async function getWorkspaces() {
  await applyDemoMode();
  if (demoMode === 'empty') return [];
  const list = await loadCached('workspaces', WORKSPACES_URL);
  return list.filter((item) => item.isActive);
}

/** Одне місце за id або null, якщо такого немає. */
export async function getWorkspaceById(id) {
  await applyDemoMode();
  const list = await loadCached('workspaces', WORKSPACES_URL);
  return list.find((item) => item.id === Number(id) && item.isActive) ?? null;
}

// ---------------------------------------------------------------------------
// Бронювання
// ---------------------------------------------------------------------------

/** Бронювання користувача з localStorage (з обробкою пошкоджених даних). */
function readStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // localStorage недоступний або JSON пошкоджено
  }
}

function writeStoredBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/**
 * Демо-бронювання з bookings.json. Дати там задані зміщенням від сьогодні
 * (dayOffset), щоб приклади не «застарівали». Перетворюємо їх на реальні дати.
 */
async function getSeedBookings() {
  const seeds = await loadCached('bookings', BOOKINGS_URL);
  return seeds.map(({ dayOffset, ...rest }) => ({ ...rest, date: dateFromToday(dayOffset) }));
}

/** Усі підтверджені бронювання місця на дату (демо + збережені користувачем). */
export async function getBookingsFor(workspaceId, date) {
  const all = [...(await getSeedBookings()), ...readStoredBookings()];
  return all
    .filter((b) => b.workspaceId === Number(workspaceId) && b.date === date && b.status === 'confirmed')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Створює бронювання. Доступність перевіряється ще раз прямо перед записом
 * (захист від ситуації, коли місце встигли забронювати в іншій вкладці).
 * Кидає Error з code === 'CONFLICT', якщо проміжок зайнятий.
 */
export async function createBooking(data) {
  const existing = await getBookingsFor(data.workspaceId, data.date);
  const conflict = findConflict(existing, data.startTime, data.endTime);
  if (conflict) {
    const error = new Error(`Час уже заброньовано: ${conflict.startTime}–${conflict.endTime}.`);
    error.code = 'CONFLICT';
    throw error;
  }

  const stored = readStoredBookings();
  // Простий порядковий номер: найбільший наявний id + 1 (на сервері його видасть БД, ПР 8)
  const nextId = Math.max(1000, ...existing.map((b) => b.id), ...stored.map((b) => b.id)) + 1;
  const booking = {
    ...data,
    id: nextId,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  writeStoredBookings([...stored, booking]);
  return booking;
}

/** Видаляє лише бронювання, створені користувачем у цьому браузері (для повторного тестування). */
export function clearStoredBookings() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// Форма контактів (до ПР 8 повідомлення зберігаються лише локально)
// ---------------------------------------------------------------------------

const MESSAGES_KEY = 'coworking:contact-messages';

export async function sendContactMessage(data) {
  let messages = [];
  try {
    messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) ?? '[]');
  } catch {
    messages = [];
  }
  const message = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...messages, message]));
  return message;
}
