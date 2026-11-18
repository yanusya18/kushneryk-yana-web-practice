/** Останній «звичайний» middleware: якщо жоден маршрут не обробив запит — відповідаємо 404 у форматі JSON. */
export function notFound(req, res) {
  res.status(404).json({ message: `Маршрут не знайдено: ${req.method} ${req.originalUrl}` })
}
