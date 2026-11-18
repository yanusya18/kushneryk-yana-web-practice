import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Header from './Header.jsx'

// jsdom не має matchMedia, який використовує Header, тому підставляємо просту заглушку
function mockMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

function renderHeader(path = '/') {
  mockMatchMedia()
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('кнопка меню перемикає aria-expanded', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /меню/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('Esc закриває відкрите меню', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /меню/i })
    await user.click(toggle)
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('позначає поточну сторінку через aria-current', () => {
    renderHeader('/catalog')
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Головна' })).not.toHaveAttribute('aria-current')
  })
})
