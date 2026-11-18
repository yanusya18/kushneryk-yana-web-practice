import { describe, expect, it } from 'vitest'
import { calcTotalPrice, durationHours, findConflict, isWholeHour, overlaps, timeToMinutes } from './booking.js'

const booked = [
  { startTime: '10:00', endTime: '13:00', status: 'confirmed' },
  { startTime: '15:00', endTime: '17:00', status: 'confirmed' },
]

describe('timeToMinutes', () => {
  it('переводить час у хвилини', () => {
    expect(timeToMinutes('00:00')).toBe(0)
    expect(timeToMinutes('10:30')).toBe(630)
  })
  it('повертає NaN для некоректного значення', () => {
    expect(timeToMinutes('25:00')).toBeNaN()
    expect(timeToMinutes('10:7')).toBeNaN()
    expect(timeToMinutes(undefined)).toBeNaN()
  })
})

describe('overlaps', () => {
  it('виявляє перетин', () => {
    expect(overlaps(600, 780, 720, 840)).toBe(true) // 10–13 і 12–14
  })
  it('суміжні проміжки не перетинаються (13:00 = 13:00)', () => {
    expect(overlaps(600, 780, 780, 900)).toBe(false)
  })
})

describe('findConflict — захист від подвійного бронювання', () => {
  it('знаходить бронювання, що перетинається', () => {
    expect(findConflict(booked, '12:00', '14:00')).toBe(booked[0])
  })
  it('вкладений проміжок теж конфліктує', () => {
    expect(findConflict(booked, '11:00', '12:00')).toBe(booked[0])
  })
  it('вільний час між бронюваннями', () => {
    expect(findConflict(booked, '13:00', '15:00')).toBeNull()
  })
  it('скасовані бронювання не блокують час', () => {
    const cancelled = [{ startTime: '10:00', endTime: '13:00', status: 'cancelled' }]
    expect(findConflict(cancelled, '10:00', '13:00')).toBeNull()
  })
  it('некоректний час — не конфлікт (помилку покаже валідація)', () => {
    expect(findConflict(booked, 'xx', '14:00')).toBeNull()
  })
})

describe('вартість і тривалість', () => {
  it('рахує тривалість у годинах', () => {
    expect(durationHours('10:00', '13:00')).toBe(3)
  })
  it('вартість = ціна за годину × години', () => {
    expect(calcTotalPrice(70, '10:00', '13:00')).toBe(210)
    expect(calcTotalPrice(300, '14:00', '16:00')).toBe(600)
  })
  it('isWholeHour відрізняє повні години', () => {
    expect(isWholeHour('10:00')).toBe(true)
    expect(isWholeHour('10:30')).toBe(false)
  })
})
