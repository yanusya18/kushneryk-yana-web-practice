import { useCallback, useState } from 'react'
import { clearStoredBookings, createBooking, getBookingsFor } from '../api/api.js'
import { useFetch } from '../hooks/useFetch.js'
import { useFormValidation } from '../hooks/useFormValidation.js'
import { calcTotalPrice, durationHours, timeToMinutes } from '../utils/booking.js'
import { buildBookingRules } from '../utils/bookingRules.js'
import { formatDate, toDateString } from '../utils/format.js'
import Button from './Button.jsx'
import FormField from './FormField.jsx'

const INITIAL_VALUES = { date: '', start_time: '', end_time: '', name: '', email: '', phone: '', consent: '' }

/**
 * BookingForm — бронювання робочого місця на дату й час (обов'язкова функція варіанта).
 *
 * Потік даних:
 *  1. Користувач обирає дату → useFetch завантажує зайняті години цього місця на цю дату;
 *  2. правила валідації (buildBookingRules) знають зайняті години й не дозволяють обрати час, що перетинається;
 *  3. submit → createBooking (повторна перевірка доступності) → onBooked(booking) відкриває підтвердження.
 */
export default function BookingForm({ workspace, onBooked }) {
  const form = useFormValidation(INITIAL_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const { values } = form
  const today = toDateString()

  // Стабільний fetcher: змінюється лише коли змінилось місце або дата → ефект у useFetch перезапускається
  const fetchBusy = useCallback(
    () => (values.date ? getBookingsFor(workspace.id, values.date) : Promise.resolve([])),
    [workspace.id, values.date],
  )
  const { data: busyData, loading: busyLoading, refetch: refetchBusy } = useFetch(fetchBusy)
  const busy = busyData ?? []

  const rules = buildBookingRules({ busy, today })
  const { errors, isValid } = form.validate(rules)

  // ---- Підказка про зайняті години й вартість (aria-live) ----
  const info = []
  if (!values.date) {
    info.push('Оберіть дату, щоб побачити зайняті години.')
  } else if (busyLoading && busyData === null) {
    info.push('Перевіряємо зайняті години…')
  } else if (busy.length === 0) {
    info.push('На цю дату місце вільне весь день.')
  } else {
    const intervals = busy.map((b) => `${b.startTime}–${b.endTime}`).join(', ')
    info.push(`Уже заброньовано на ${formatDate(values.date)}: ${intervals}.`)
  }
  if (values.start_time && values.end_time && timeToMinutes(values.end_time) > timeToMinutes(values.start_time)) {
    const hours = durationHours(values.start_time, values.end_time)
    const total = calcTotalPrice(workspace.pricePerHour, values.start_time, values.end_time)
    info.push(`Тривалість: ${hours} год. Вартість: ${total} грн.`)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    form.touchAll(Object.keys(rules))
    if (!isValid || submitting) return

    setSubmitting(true)
    try {
      const booking = await createBooking({
        workspaceId: workspace.id,
        date: values.date,
        startTime: values.start_time,
        endTime: values.end_time,
        customerName: values.name.trim(),
        customerEmail: values.email.trim(),
        customerPhone: values.phone.trim(),
        totalPrice: calcTotalPrice(workspace.pricePerHour, values.start_time, values.end_time),
      })
      // Дату лишаємо, щоб одразу було видно нову зайнятість
      form.reset({ ...INITIAL_VALUES, date: values.date })
      refetchBusy()
      onBooked(booking)
    } catch (error) {
      if (error.code === 'CONFLICT') {
        refetchBusy() // оновлюємо зайняті години й показуємо помилку біля поля часу
        form.setError('end_time', error.message)
      } else {
        console.error(error)
        form.setError('end_time', 'Не вдалося зберегти бронювання. Спробуйте ще раз.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleClearDemo() {
    clearStoredBookings()
    refetchBusy()
  }

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  })

  return (
    <>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <fieldset className="fieldset--row">
          <legend>Дата та час</legend>
          <FormField label="Дата" type="date" min={today} required {...field('date')} />
          <FormField label="Початок" type="time" min="08:00" max="21:00" step={3600} required {...field('start_time')} />
          <FormField label="Завершення" type="time" min="09:00" max="22:00" step={3600} required {...field('end_time')} />
        </fieldset>

        <fieldset>
          <legend>Ваші дані</legend>
          <FormField label="Ім'я" required maxLength={60} autoComplete="name" {...field('name')} />
          <FormField label="Email" type="email" required autoComplete="email" {...field('email')} />
          <FormField label="Телефон" type="tel" required placeholder="+380501234567" autoComplete="tel" {...field('phone')} />
        </fieldset>

        <FormField label="Погоджуюсь на обробку персональних даних" type="checkbox" required {...field('consent')} />

        <div className="booking-info" aria-live="polite">
          {info.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p>
          <Button type="submit" disabled={!isValid || submitting || busyLoading}>
            Забронювати
          </Button>
        </p>
        <p className="form-note">Кнопка стане активною, коли форма заповнена коректно, а обраний час вільний.</p>
      </form>

      <p className="form-note">
        Демо-режим: бронювання зберігаються в цьому браузері.{' '}
        <Button variant="secondary" onClick={handleClearDemo}>
          Очистити мої бронювання
        </Button>
      </p>
    </>
  )
}
