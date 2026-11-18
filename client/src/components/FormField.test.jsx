import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FormField from './FormField.jsx'

describe('FormField (доступність)', () => {
  it('зв’язує label з полем', () => {
    render(<FormField label="Ім’я" name="name" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Ім’я')).toBeInTheDocument()
  })

  it('показує помилку, ставить aria-invalid і зв’язує текст через aria-describedby', () => {
    render(<FormField label="Email" name="email" value="x" onChange={() => {}} error="Введіть коректний email." />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Введіть коректний email.')
  })

  it('без помилки не має aria-invalid', () => {
    render(<FormField label="Email" name="email" value="a@b.co" onChange={() => {}} error="" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
  })
})
