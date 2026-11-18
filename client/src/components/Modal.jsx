import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'

/**
 * Modal — модальне вікно на нативному елементі <dialog>.
 * Браузер сам: блокує решту сторінки, тримає фокус усередині, закриває по Esc
 * і повертає фокус на елемент, що відкрив вікно.
 * Ми додаємо: керування через prop `open`, закриття кліком по підкладці
 * і необов'язковий prop `actions` — власні кнопки замість стандартної «Закрити».
 */
export default function Modal({ open, onClose, title, children, actions }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  // Синхронізуємо стан React зі станом <dialog>: showModal() / close() — імперативні методи DOM
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleBackdropClick(event) {
    // Клік по підкладці (::backdrop) приходить із target === dialog; клік усередині вмісту — ні
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby={titleId} onClose={onClose} onClick={handleBackdropClick}>
      <h2 id={titleId}>{title}</h2>
      <div>{children}</div>
      {actions ?? (
        <p>
          <Button onClick={onClose} autoFocus>
            Закрити
          </Button>
        </p>
      )}
    </dialog>
  )
}
