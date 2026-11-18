// Додає зручні перевірки для DOM: toBeInTheDocument(), toHaveAttribute(), toHaveAccessibleName() тощо
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Після кожного тесту прибираємо відрендерені компоненти, щоб тести не впливали один на одного
afterEach(() => cleanup())
