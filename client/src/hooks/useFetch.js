import { useCallback, useEffect, useState } from 'react'

/**
 * useFetch — власний хук для завантаження даних зі станами loading / error.
 *
 * @param {() => Promise<any>} fetcher — функція, що повертає Promise з даними.
 *   ВАЖЛИВО: вона має бути «стабільною» (оголошена поза компонентом або обгорнута в useCallback),
 *   інакше ефект запускатиметься на кожному рендері.
 * @returns {{ data, loading, error, refetch }}
 *
 * Як працює:
 *  1. useEffect запускає fetcher після рендера і щоразу, коли змінюється fetcher
 *     (наприклад, змінився id у адресі) або викликано refetch().
 *  2. Результат зберігається разом із «ключем» запиту (fetcher + номер спроби).
 *     loading = true, поки збережений ключ не збігається з поточним — тож
 *     не потрібно викликати setState({loading: true}) всередині ефекту.
 *  3. Функція очищення ставить ignore = true. Якщо відповідь старого запиту прийде
 *     після нового (race condition) або після розмонтування — вона буде проігнорована.
 */
export function useFetch(fetcher) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ fetcher: null, attempt: -1, data: null, error: null })

  useEffect(() => {
    let ignore = false

    fetcher()
      .then((data) => {
        if (!ignore) setResult({ fetcher, attempt, data, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ fetcher, attempt, data: null, error })
      })

    return () => {
      ignore = true
    }
  }, [fetcher, attempt])

  const sameFetcher = result.fetcher === fetcher
  const loading = !sameFetcher || result.attempt !== attempt
  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  return {
    // Для повторного запиту того ж fetcher лишаємо попередні дані (немає «блимання»);
    // для іншого fetcher (інший id, інша дата) старі дані не показуємо.
    data: sameFetcher ? result.data : null,
    error: loading ? null : result.error,
    loading,
    refetch,
  }
}
