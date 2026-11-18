import { imageUrl } from '../utils/images.js'

/**
 * Picture — адаптивне зображення: AVIF → WebP → JPG (браузер бере перший формат, який уміє),
 * кожен у кількох розмірах (srcset + sizes) — обирається найменший достатній файл.
 * width/height резервують місце під картинку (менше зсувів макета під час завантаження).
 *
 * @param name          основа імені файлу, напр. 'workspace-a1' → workspace-a1-400.webp
 * @param widths        доступні ширини AVIF/WebP, напр. [400, 800]
 * @param fallbackWidth ширина JPG-файлу для <img src>
 * @param priority      true для зображення першого екрана (без lazy, з високим пріоритетом)
 */
export default function Picture({ name, widths, fallbackWidth, width, height, alt, sizes, priority = false }) {
  const buildSrcSet = (extension) => widths.map((w) => `${imageUrl(`${name}-${w}.${extension}`)} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet('webp')} sizes={sizes} />
      <img
        src={imageUrl(`${name}-${fallbackWidth}.jpg`)}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}
