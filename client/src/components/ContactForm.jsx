import { useState } from 'react'
import { sendContactMessage } from '../api/api.js'
import { useFormValidation } from '../hooks/useFormValidation.js'
import { validateConsent, validateEmail, validateName, validatePhone, validateRequired } from '../utils/validators.js'
import Button from './Button.jsx'
import FormField from './FormField.jsx'
import StateMessage from './StateMessage.jsx'

const MIN_MESSAGE = 10
const MAX_MESSAGE = 1000

const INITIAL_VALUES = { name: '', email: '', phone: '', topic: '', message: '', consent: '' }

// Правила — це чисті функції; телефон тут необов'язковий
const RULES = {
  name: validateName,
  email: validateEmail,
  phone: (value) => validatePhone(value, { required: false }),
  topic: (value) => validateRequired(value, 'Оберіть тему звернення.'),
  message: (value) => {
    const text = value.trim()
    if (!text) return 'Напишіть повідомлення.'
    if (text.length < MIN_MESSAGE) return `Повідомлення має містити щонайменше ${MIN_MESSAGE} символів.`
    if (text.length > MAX_MESSAGE) return `Повідомлення не може перевищувати ${MAX_MESSAGE} символів.`
    return ''
  },
  consent: validateConsent,
}

export default function ContactForm() {
  const form = useFormValidation(INITIAL_VALUES)
  const [result, setResult] = useState(null) // { type: 'success' | 'error', text }
  const [submitting, setSubmitting] = useState(false)

  const { errors, isValid } = form.validate(RULES)
  const { values } = form

  function handleChange(event) {
    form.handleChange(event)
    setResult(null) // користувач знову пише — ховаємо попереднє повідомлення
  }

  async function handleSubmit(event) {
    event.preventDefault()
    form.touchAll(Object.keys(RULES))
    if (!isValid || submitting) return

    setSubmitting(true)
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        topic: values.topic,
        message: values.message.trim(),
      })
      setResult({
        type: 'success',
        text: `Дякуємо, ${values.name.trim()}! Повідомлення збережено (демо-режим). Надсилання на сервер з’явиться в ПР 8.`,
      })
      form.reset()
    } catch (error) {
      console.error(error)
      setResult({ type: 'error', text: 'Не вдалося зберегти повідомлення. Спробуйте ще раз.' })
    } finally {
      setSubmitting(false)
    }
  }

  // noValidate вимикає вбудовані підказки браузера: показуємо власні, доступні для екранних читачів
  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Ваше повідомлення</legend>
        <FormField label="Ім'я" name="name" value={values.name} error={errors.name} onChange={handleChange} onBlur={form.handleBlur} required maxLength={60} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} onBlur={form.handleBlur} required autoComplete="email" />
        <FormField label="Телефон (необов'язково)" name="phone" type="tel" value={values.phone} error={errors.phone} onChange={handleChange} onBlur={form.handleBlur} placeholder="+380501234567" autoComplete="tel" />
        <FormField label="Тема звернення" name="topic" as="select" value={values.topic} error={errors.topic} onChange={handleChange} onBlur={form.handleBlur} required>
          <option value="">Оберіть тему</option>
          <option value="tour">Екскурсія по коворкінгу</option>
          <option value="booking">Питання щодо бронювання</option>
          <option value="team">Умови для команд</option>
          <option value="other">Інше</option>
        </FormField>
        <FormField label="Повідомлення" name="message" as="textarea" rows={5} value={values.message} error={errors.message} onChange={handleChange} onBlur={form.handleBlur} required counter={`${values.message.length} / ${MAX_MESSAGE}`} />
      </fieldset>

      <FormField label="Погоджуюсь на обробку персональних даних" name="consent" type="checkbox" value={values.consent} error={errors.consent} onChange={handleChange} onBlur={form.handleBlur} required />

      <p>
        <Button type="submit" disabled={!isValid || submitting}>
          Надіслати
        </Button>
      </p>
      <p className="form-note">Кнопка стане активною, коли всі обов’язкові поля заповнено коректно.</p>

      {result && (
        <StateMessage variant={result.type}>
          <p>{result.text}</p>
        </StateMessage>
      )}
    </form>
  )
}
