/**
 * Перетворює помилки валідації сервера [{ field, message }] на об'єкт { поле форми: текст }.
 * Назви полів у API (customerName) і у формі (name) можуть відрізнятися — для цього fieldMap.
 * Помилки полів, яких немає у формі, збираємо в fallbackField, щоб користувач їх побачив.
 */
export function mapServerErrors(errors, fieldMap, fallbackField) {
  const result = {}
  for (const { field, message } of errors) {
    const formField = fieldMap[field] ?? fallbackField
    if (formField && !result[formField]) result[formField] = message
  }
  return result
}
