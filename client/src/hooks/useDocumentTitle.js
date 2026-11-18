import { useEffect } from 'react'

const SITE_NAME = 'Простір'

/** Встановлює title вкладки для поточної сторінки (SPA сама його не змінює). */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  }, [title])
}
