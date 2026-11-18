import { useState } from 'react'
import { createWorkspace } from '../api/api.js'
import { useFormValidation } from '../hooks/useFormValidation.js'
import { AMENITY_LABELS } from '../utils/format.js'
import { mapServerErrors } from '../utils/serverErrors.js'
import { AMENITY_CODES, buildWorkspacePayload, WORKSPACE_RULES } from '../utils/workspaceRules.js'
import Button from './Button.jsx'
import FormField from './FormField.jsx'

// Назви полів у API збігаються з назвами полів форми
const SERVER_FIELDS = { name: 'name', type: 'type', pricePerHour: 'pricePerHour', capacity: 'capacity', description: 'description' }

const INITIAL_VALUES = {
  name: '',
  type: '',
  pricePerHour: '',
  capacity: '',
  description: '',
  ...Object.fromEntries(AMENITY_CODES.map((code) => [`amenity_${code}`, ''])),
}

/**
 * WorkspaceForm — створення робочого місця: POST /api/items.
 * @param onCreated  викликається з новим місцем після успіху (сторінка оновлює список)
 */
export default function WorkspaceForm({ onCreated }) {
  const form = useFormValidation(INITIAL_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState('') // загальна помилка (сервер недоступний тощо)
  const { values } = form
  const { errors, isValid } = form.validate(WORKSPACE_RULES)

  async function handleSubmit(event) {
    event.preventDefault()
    form.touchAll(Object.keys(WORKSPACE_RULES))
    if (!isValid || submitting) return

    setSubmitting(true)
    setFailure('')
    try {
      const created = await createWorkspace(buildWorkspacePayload(values))
      form.reset()
      onCreated(created)
    } catch (error) {
      if (error.code === 'VALIDATION') {
        form.setServerErrors(mapServerErrors(error.errors, SERVER_FIELDS, 'name'))
      } else if (error.code === 'CONFLICT') {
        form.setError('name', error.message) // місце з такою назвою вже існує
      } else {
        setFailure(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  })

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Нове робоче місце</legend>
        <FormField label="Назва" required maxLength={80} {...field('name')} />
        <FormField label="Тип місця" as="select" required {...field('type')}>
          <option value="">Оберіть тип</option>
          <option value="open-space">Open space</option>
          <option value="fixed-desk">Фіксоване місце</option>
          <option value="private-office">Приватний кабінет</option>
          <option value="meeting-room">Переговорна</option>
        </FormField>
        <FormField label="Ціна за годину, грн" type="number" min={1} max={10000} step={1} inputMode="numeric" required {...field('pricePerHour')} />
        <FormField label="Місткість (осіб)" type="number" min={1} max={100} step={1} inputMode="numeric" required {...field('capacity')} />
        <FormField label="Опис" as="textarea" rows={4} required maxLength={1000} {...field('description')} />
      </fieldset>

      <fieldset className="fieldset--checks">
        <legend>Обладнання (необов’язково)</legend>
        {AMENITY_CODES.map((code) => (
          <FormField key={code} label={AMENITY_LABELS[code]} type="checkbox" {...field(`amenity_${code}`)} />
        ))}
      </fieldset>

      {failure && (
        <p className="state state--error" role="alert">
          {failure}
        </p>
      )}

      <p>
        <Button type="submit" disabled={!isValid || submitting}>
          Додати місце
        </Button>
      </p>
      <p className="form-note">Зображення призначається автоматично за типом місця.</p>
    </form>
  )
}
