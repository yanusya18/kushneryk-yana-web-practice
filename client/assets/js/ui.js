/**
 * ui.js — інтерактивні елементи інтерфейсу.
 *
 * Реалізовано (вимога ПР 6 — мінімум 3 елементи):
 *  1. Бургер-меню (мобільна навігація);
 *  2. Перемикач теми зі збереженням у localStorage;
 *  3. Модальне вікно (закриття по Esc, кліку поза ним і кнопці «Закрити»).
 * Додатково: делегування кліків по картках.
 */

const THEME_KEY = 'coworking:theme';
const DESKTOP_QUERY = window.matchMedia('(min-width: 768px)');
const DARK_QUERY = window.matchMedia('(prefers-color-scheme: dark)');

// ---------------------------------------------------------------------------
// 1. Бургер-меню
// ---------------------------------------------------------------------------
export function initBurgerMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav-toggle__label').textContent = open ? 'Закрити' : 'Меню';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  // Esc закриває меню й повертає фокус на кнопку
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Клік по пункту меню закриває його (корисно для якорів на тій самій сторінці)
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // При переході на широкий екран меню завжди видиме — скидаємо стан
  DESKTOP_QUERY.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

// ---------------------------------------------------------------------------
// 2. Перемикач теми
// ---------------------------------------------------------------------------

/** Яка тема діє зараз: явно вибрана (data-theme) або системна. */
function getEffectiveTheme() {
  return document.documentElement.dataset.theme || (DARK_QUERY.matches ? 'dark' : 'light');
}

export function initThemeToggle() {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;

  // Збережений вибір застосовуємо одразу (дублює inline-скрипт у <head>, який прибирає «мигання»)
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch {
    /* localStorage недоступний (приватний режим) — працюємо без збереження */
  }

  const syncButton = () => button.setAttribute('aria-pressed', String(getEffectiveTheme() === 'dark'));
  syncButton();

  button.addEventListener('click', () => {
    const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ігноруємо */
    }
    syncButton();
  });

  // Якщо користувач не обирав тему вручну — стежимо за системною
  DARK_QUERY.addEventListener('change', syncButton);
}

// ---------------------------------------------------------------------------
// 3. Модальне вікно (елемент <dialog>)
// ---------------------------------------------------------------------------

/**
 * Відкриває <dialog> як модальне. Браузер сам:
 *  • блокує решту сторінки й тримає фокус усередині;
 *  • закриває вікно по Esc;
 *  • повертає фокус на елемент, що його відкрив.
 * Ми додаємо закриття по кліку ПОЗА вікном і по кнопках [data-modal-close].
 */
export function openModal(dialog) {
  if (!dialog.open) dialog.showModal();
}

export function closeModal(dialog) {
  if (dialog.open) dialog.close();
}

export function initModal(dialog) {
  if (!dialog) return;

  // Клік по «підкладці» (::backdrop) приходить із target === dialog.
  // Клік усередині вмісту має target = внутрішній елемент, тож його ігноруємо.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal(dialog);
  });

  // Кнопки закриття — через делегування
  dialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-modal-close]')) closeModal(dialog);
  });
}

// ---------------------------------------------------------------------------
// Делегування подій: клік по картці відкриває сторінку місця
// ---------------------------------------------------------------------------

/**
 * Один слухач на контейнер замість слухача на кожній картці.
 * Клік «спливає» (bubbling) від внутрішнього елемента до контейнера,
 * а event.target.closest('.card') знаходить потрібну картку.
 * Це працює і для карток, які JS додасть пізніше (після fetch).
 */
export function initCardClicks(container) {
  if (!container) return;
  container.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card || !container.contains(card)) return;
    if (event.target.closest('a, button')) return; // власні посилання працюють як зазвичай
    const link = card.querySelector('a[href]');
    if (link) window.location.href = link.href;
  });
}

/** Позначає картки як клікабельні (курсор-«рука»). */
export function markCardsClickable(container) {
  container?.classList.add('card-grid--clickable');
}
