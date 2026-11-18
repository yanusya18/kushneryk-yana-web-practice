/**
 * seed.js — початкові дані: робочі місця з data/workspaces.seed.json
 * і кілька демо-бронювань на найближчі дні (щоб було що показати в інтерфейсі).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'
import { addDays, nowInTimezone } from './utils/time.js'

// dayOffset — на скільки днів від «сьогодні» (в часовому поясі коворкінгу)
const DEMO_BOOKINGS = [
  { workspaceId: 1, dayOffset: 1, startTime: '10:00', endTime: '13:00', name: 'Демо-клієнт' },
  { workspaceId: 1, dayOffset: 1, startTime: '15:00', endTime: '17:00', name: 'Демо-клієнт' },
  { workspaceId: 3, dayOffset: 2, startTime: '09:00', endTime: '12:00', name: 'Демо-клієнт' },
  { workspaceId: 5, dayOffset: 1, startTime: '11:00', endTime: '14:00', name: 'Демо-клієнт' },
  { workspaceId: 6, dayOffset: 3, startTime: '14:00', endTime: '16:00', name: 'Демо-клієнт' },
]

export async function createSeed() {
  const raw = await fs.readFile(path.join(config.serverRoot, 'data', 'workspaces.seed.json'), 'utf8')
  const workspaces = JSON.parse(raw)
  const today = nowInTimezone(config.timezone).date

  const bookings = DEMO_BOOKINGS.map((demo, index) => {
    const workspace = workspaces.find((w) => w.id === demo.workspaceId)
    const hours = (Number(demo.endTime.slice(0, 2)) - Number(demo.startTime.slice(0, 2)))
    return {
      id: 1001 + index,
      workspaceId: demo.workspaceId,
      date: addDays(today, demo.dayOffset),
      startTime: demo.startTime,
      endTime: demo.endTime,
      customerName: demo.name,
      totalPrice: workspace.pricePerHour * hours,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
  })

  return {
    counters: {
      nextWorkspaceId: Math.max(...workspaces.map((w) => w.id)) + 1,
      nextBookingId: 1001 + bookings.length,
      nextMessageId: 1,
    },
    workspaces,
    bookings,
    messages: [],
  }
}
