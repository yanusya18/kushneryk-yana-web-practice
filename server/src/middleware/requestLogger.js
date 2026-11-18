/**
 * requestLogger — middleware логування запитів.
 *
 * Middleware — це функція (req, res, next). Express викликає їх по черзі, а next()
 * передає керування наступній. Тут ми запам'ятовуємо час початку, а коли відповідь
 * відправлено (подія 'finish'), виводимо рядок: час, метод, адреса, статус, тривалість.
 * Тіло запиту НЕ логуємо: у ньому можуть бути персональні дані.
 */
export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`)
  })

  next()
}
