import { useEffect, useState } from 'react'

/**
 * useDebounce: повертає значення, яке оновлюється лише через `delay` мс
 * після ОСТАННЬОЇ зміни вхідного значення. Пошук не фільтрує список на кожну літеру.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timerId) // нова зміна скасовує попередній таймер
  }, [value, delay])

  return debounced
}
