/**
 * images.js — адреси зображень із client/assets/images/.
 * import.meta.glob підключає всі файли на етапі збірки: Vite дає кожному хешоване ім'я
 * (кешування в браузері) і копіює їх у dist. Файли не дублюються.
 */
const files = import.meta.glob('../../assets/images/*.{jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** imageUrl('workspace-a1-800.jpg') → адреса файлу у збірці. */
export function imageUrl(fileName) {
  return files[`../../assets/images/${fileName}`]
}
