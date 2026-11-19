/**
 * config.js — єдине місце, де читаються налаштування з середовища (.env).
 * dotenv завантажує файл .env у process.env; решта коду бере значення звідси,
 * а не з process.env напряму.
 */
import path from 'node:path'
import 'dotenv/config'

const serverRoot = path.resolve(import.meta.dirname, '..')

const toList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const config = {
  serverRoot,
  port: Number(process.env.PORT) || 3001,
  // Дозволені адреси клієнта; підтримується символ * (напр., https://*.vercel.app для preview-деплоїв)
  corsOrigins: toList(process.env.CORS_ORIGIN ?? 'http://localhost:5173'),
  // Якщо задано — створення, зміна й видалення місць потребують заголовка X-Admin-Token (ПР 10)
  adminToken: process.env.ADMIN_TOKEN ?? '',
  dataFile: path.resolve(serverRoot, process.env.DATA_FILE ?? 'data/db.json'),
  timezone: process.env.TIMEZONE ?? 'Europe/Kyiv',
  isProduction: process.env.NODE_ENV === 'production',
}
