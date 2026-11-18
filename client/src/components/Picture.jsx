import { imageUrl } from '../utils/images.js'

/**
 * Picture — адаптивне зображення: WebP у кількох розмірах (srcset + sizes) і JPG-запасний варіант.
 * Браузер сам обирає найменший достатній файл за шириною екрана.
 * width/height резервують місце під картинку (менше зсувів макета під час завантаження).
 *
 * @param name          основа імені файлу, напр. 'workspace-a1' → workspace-a1-400.webp
 * @param widths        доступні ширини WebP, напр. [400, 800]
 * @param fallbackWidth ширина JPG-файлу для <img src>
 * @param priority      true для зображення першого екрана (без lazy, з високим пріоритетом)
 */
export default function Picture({ name, widths, fallbackWidth, width, height, alt, sizes, priority = false }) {
  const srcSet = widths.map((w) => `${imageUrl(`${name}-${w}.webp`)} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
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
