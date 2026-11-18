/**
 * main.js — спільний вхід для ВСІХ сторінок: шапка, тема, делегування кліків по картках.
 * Сторінко-специфічна логіка живе в окремих модулях (catalog.js, workspace.js, contacts.js).
 */
import { initBurgerMenu, initThemeToggle, initCardClicks, markCardsClickable } from './ui.js';

// Клас js дозволяє CSS показувати кнопки меню/теми лише коли скрипт працює
document.documentElement.classList.add('js');

initBurgerMenu();
initThemeToggle();

// Статичні картки на головній (динамічні в каталозі підключає catalog.js)
document.querySelectorAll('.card-grid[data-static-cards]').forEach((grid) => {
  initCardClicks(grid);
  markCardsClickable(grid);
});
