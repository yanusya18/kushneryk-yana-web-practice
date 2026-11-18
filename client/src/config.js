/**
 * config.js — адреса API із змінної середовища VITE_API_URL (файл client/.env).
 * Vite підставляє значення на етапі збірки. Якщо змінну не задано — локальний сервер за замовчуванням.
 * ПР 10: на хостингу задайте VITE_API_URL = адреса розгорнутого API.
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/+$/, '')
