/**
 * api.js — єдине місце, де застосунок спілкується із сервером (REST API, ПР 8).
 * Компоненти й хуки викликають лише ці функції, тому знати про fetch їм не потрібно.
 *
 * Демо-режими станів (для захисту та скриншотів), параметр у адресі сторінки:
 *   ?demo=loading — довге завантаження (3 с) · ?demo=error — імітація помилки · ?demo=empty — порожній список
 */
import { API_URL } from '../config.js'

/**
 * ApiError — помилка запиту до API.
 *   code: 'NETWORK' (сервер недоступний) | 'VALIDATION' (400) | 'NOT_FOUND' (404) | 'CONFLICT' (409) | 'SERVER'
 *   errors:   [{ field, message }] — помилки полів від серверної валідації (400)
 *   conflict: { startTime, endTime } — з чим перетнулося бронювання (409)
 */
export class ApiError extends Error {
  constructor(message, { status, code, errors = [], conflict } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.errors = errors
    this.conflict = conflict
  }
}

const CODE_BY_STATUS = { 400: 'VALIDATION', 401: 'UNAUTHORIZED', 404: 'NOT_FOUND', 409: 'CONFLICT' }

// Токен адміністратора (ПР 10): зберігається лише на час сесії вкладки, у репозиторій і збірку не потрапляє
const ADMIN_TOKEN_KEY = 'coworking:admin-token'

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? ''
  } catch {
    return '' // sessionStorage недоступний (приватний режим)
  }
}

export function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch {
    /* ігноруємо */
  }
}

/** Заголовки запиту: JSON для тіла + токен адміністратора для запитів, що змінюють дані. */
function buildHeaders({ method, hasBody }) {
  const headers = {}
  if (hasBody) headers['Content-Type'] = 'application/json'
  const token = getAdminToken()
  if (token && method !== 'GET') headers['X-Admin-Token'] = token
  return Object.keys(headers).length > 0 ? headers : undefined
}

/**
 * request — універсальний запит: fetch + async/await.
 * fetch НЕ кидає помилку на 404/500 (лише при збої мережі), тому перевіряємо response.ok вручну.
 * 204 No Content — тіла немає, повертаємо null.
 */
async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: buildHeaders({ method, hasBody: body !== undefined }),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Не вдалося з’єднатися із сервером. Перевірте, чи запущено API (npm run dev у папці server).', {
      code: 'NETWORK',
    })
  }

  if (response.status === 204) return null

  let data = null
  try {
    data = await response.json()
  } catch {
    /* тіла немає або воно не JSON */
  }

  if (!response.ok) {
    throw new ApiError(data?.message ?? `Сервер відповів з помилкою ${response.status}`, {
      status: response.status,
      code: CODE_BY_STATUS[response.status] ?? 'SERVER',
      errors: data?.errors ?? [],
      conflict: data?.conflict,
    })
  }
  return data
}

// ---------------------------------------------------------------------------
// Демо-режими
// ---------------------------------------------------------------------------
const getDemoMode = () => new URLSearchParams(window.location.search).get('demo')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function applyDemoMode() {
  const demo = getDemoMode()
  if (demo === 'loading') await sleep(3000)
  if (demo === 'error') {
    await sleep(600)
    throw new ApiError('Не вдалося з’єднатися із сервером (демо-режим).', { code: 'NETWORK' })
  }
}

// ---------------------------------------------------------------------------
// Робочі місця
// ---------------------------------------------------------------------------

/** GET /api/items — усі активні місця. */
export async function getWorkspaces() {
  await applyDemoMode()
  if (getDemoMode() === 'empty') return []
  return request('/api/items')
}

/** GET /api/items?includeInactive=true — усі місця (для сторінки керування). */
export function getAllWorkspaces() {
  return request('/api/items?includeInactive=true')
}

/** GET /api/items/:id — місце або null, якщо його немає. */
export async function getWorkspaceById(id) {
  await applyDemoMode()
  try {
    return await request(`/api/items/${id}`)
  } catch (error) {
    if (error.code === 'NOT_FOUND') return null
    throw error
  }
}

/** POST /api/items — створення місця. */
export function createWorkspace(data) {
  return request('/api/items', { method: 'POST', body: data })
}

/** DELETE /api/items/:id — видалення місця. */
export function deleteWorkspace(id) {
  return request(`/api/items/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Бронювання
// ---------------------------------------------------------------------------

/** GET /api/items/:id/availability?date= — зайняті проміжки (без персональних даних). */
export function getBookingsFor(workspaceId, date) {
  return request(`/api/items/${workspaceId}/availability?date=${encodeURIComponent(date)}`)
}

/**
 * POST /api/bookings — створення бронювання.
 * Сервер сам перевіряє доступність і рахує вартість. Помилки: 400 (VALIDATION), 409 (CONFLICT).
 */
export function createBooking(data) {
  return request('/api/bookings', { method: 'POST', body: { ...data, consent: true } })
}

// ---------------------------------------------------------------------------
// Контактна форма
// ---------------------------------------------------------------------------

/** POST /api/contact — 201 при успіху, 400 з errors[] при помилках полів. */
export function sendContactMessage(data) {
  return request('/api/contact', { method: 'POST', body: { ...data, consent: true } })
}
