import { describe, expect, it } from 'vitest'
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  validateConsent,
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
} from './validators.js'

describe('validateName', () => {
  it('приймає коректне ім’я', () => {
    expect(validateName('Яна')).toBe('')
  })
  it('вимагає значення (пробіли не рахуються)', () => {
    expect(validateName('   ')).toBe('Вкажіть ім’я.')
  })
  it('відхиляє занадто коротке ім’я', () => {
    expect(validateName('Я')).toContain('щонайменше 2')
  })
  it('відхиляє ім’я довше за 60 символів', () => {
    expect(validateName('а'.repeat(61))).toContain('60')
  })
})

describe('validateEmail', () => {
  it('приймає коректні адреси', () => {
    expect(validateEmail('yana@example.com')).toBe('')
    expect(validateEmail('  yana.k+test@mail.ua  ')).toBe('')
  })
  it('відхиляє порожній email', () => {
    expect(validateEmail('')).toBe('Вкажіть email.')
  })
  it.each(['yana', 'yana@', '@example.com', 'yana@example', 'ya na@example.com', 'yana@example.c'])(
    'відхиляє некоректний email «%s»',
    (value) => {
      expect(validateEmail(value)).toContain('коректний email')
    },
  )
  it('регулярний вираз EMAIL_PATTERN працює напряму', () => {
    expect(EMAIL_PATTERN.test('a@b.co')).toBe(true)
  })
})

describe('validatePhone', () => {
  it('приймає український номер +380 і 9 цифр', () => {
    expect(validatePhone('+380501234567')).toBe('')
    expect(PHONE_PATTERN.test('+380501234567')).toBe(true)
  })
  it.each(['0501234567', '+38050123456', '+3805012345678', '+381501234567', '+380 50 123 45 67'])(
    'відхиляє номер «%s»',
    (value) => {
      expect(validatePhone(value)).toContain('+380')
    },
  )
  it('обов’язковий за замовчуванням', () => {
    expect(validatePhone('')).not.toBe('')
  })
  it('може бути необов’язковим (контактна форма)', () => {
    expect(validatePhone('', { required: false })).toBe('')
    expect(validatePhone('123', { required: false })).not.toBe('')
  })
})

describe('validateRequired / validateConsent', () => {
  it('validateRequired повертає наданий текст для порожнього значення', () => {
    expect(validateRequired('  ', 'Оберіть тему.')).toBe('Оберіть тему.')
    expect(validateRequired('tour', 'Оберіть тему.')).toBe('')
  })
  it('validateConsent вимагає позначку', () => {
    expect(validateConsent('')).toContain('згода')
    expect(validateConsent('on')).toBe('')
  })
})
