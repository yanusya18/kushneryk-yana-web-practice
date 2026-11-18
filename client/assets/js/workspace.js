/**
 * workspace.js — сторінка робочого місця: дані за ?id=, галерея, обладнання
 * та форма БРОНЮВАННЯ на конкретну дату й час (обов'язкова функція варіанта).
 */
import { createBooking, getBookingsFor, getWorkspaceById, clearStoredBookings } from './api.js';
import { calcTotalPrice, durationHours, findConflict, isWholeHour, timeToMinutes, OPEN_HOUR, CLOSE_HOUR } from './booking.js';
import { initFormValidation, validateEmail, validateName, validatePhone } from './form.js';
import { initModal, openModal } from './ui.js';
import { AMENITY_LABELS, escapeHtml, formatCapacity, formatDate, toDateString, TYPE_LABELS } from './utils.js';

const article = document.getElementById('workspace-article');
const statusBox = document.getElementById('workspace-state');
const form = document.getElementById('booking-form');
const infoBox = document.getElementById('booking-info');
const dialog = document.getElementById('booking-modal');
const dialogBody = document.getElementById('booking-modal-body');
const resetDemoButton = document.getElementById('reset-demo');

let workspace = null;   // поточне робочe місце
let busy = [];          // бронювання цього місця на обрану дату

// ---------- Відображення даних місця ----------

function renderWorkspace(item) {
  const base = `../assets/images/${item.image}`;
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;

  document.title = `${item.name} — Простір`;
  document.getElementById('crumb-current').textContent = item.name;
  document.getElementById('workspace-title').textContent = item.name;
  document.getElementById('workspace-meta').innerHTML =
    `${escapeHtml(typeLabel)} · ${formatCapacity(item.capacity)} · <data value="${item.pricePerHour}">${item.pricePerHour} грн</data> / година`;

  const picture = document.getElementById('workspace-picture');
  picture.querySelector('source').srcset = `${base}-400.webp 400w, ${base}-800.webp 800w`;
  const img = picture.querySelector('img');
  img.src = `${base}-800.jpg`;
  img.alt = item.imageAlt;
  document.getElementById('workspace-caption').textContent = item.name;

  document.getElementById('workspace-description').textContent = item.description;
  document.getElementById('workspace-amenities').innerHTML = item.amenities
    .map((code) => `<li>${escapeHtml(AMENITY_LABELS[code] ?? code)}</li>`)
    .join('');
}

// ---------- Інформація про доступність і вартість ----------

/** Блок aria-live: зайняті години, тривалість і вартість. */
function renderBookingInfo() {
  const { date, start_time: start, end_time: end } = Object.fromEntries(new FormData(form));
  const lines = [];

  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    if (busy.length === 0) {
      lines.push('На цю дату місце вільне весь день.');
    } else {
      const intervals = busy.map((b) => `${b.startTime}–${b.endTime}`).join(', ');
      lines.push(`Уже заброньовано на ${formatDate(date)}: ${intervals}.`);
    }
  } else {
    lines.push('Оберіть дату, щоб побачити зайняті години.');
  }

  const timesOk = start && end && timeToMinutes(end) > timeToMinutes(start);
  if (timesOk) {
    const hours = durationHours(start, end);
    const total = calcTotalPrice(workspace.pricePerHour, start, end);
    lines.push(`Тривалість: ${hours} год. Вартість: ${total} грн.`);
  }

  infoBox.innerHTML = lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
}

/** Завантажує бронювання на обрану дату й оновлює підказку та валідацію. */
async function refreshBusy(validator) {
  const date = form.elements.date.value;
  busy = date ? await getBookingsFor(workspace.id, date) : [];
  renderBookingInfo();
  validator?.refresh();
}

// ---------- Правила валідації бронювання ----------

function buildRules() {
  const today = toDateString();

  return {
    date: (value) => {
      if (!value) return 'Оберіть дату бронювання.';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Вкажіть дату у форматі ДД.ММ.РРРР.';
      if (value < today) return 'Не можна бронювати місце на минулу дату.'; // рядки YYYY-MM-DD порівнюються як дати
      return '';
    },

    start_time: (value, values) => {
      if (!value) return 'Вкажіть час початку.';
      if (!isWholeHour(value)) return 'Бронювання — на повні години (наприклад, 10:00).';
      const hour = timeToMinutes(value) / 60;
      if (hour < OPEN_HOUR || hour > CLOSE_HOUR - 1) {
        return `Початок — з ${String(OPEN_HOUR).padStart(2, '0')}:00 до ${CLOSE_HOUR - 1}:00.`;
      }
      if (values.date === today) {
        const now = new Date();
        if (timeToMinutes(value) <= now.getHours() * 60 + now.getMinutes()) {
          return 'Цей час сьогодні вже минув. Оберіть пізніший.';
        }
      }
      return '';
    },

    end_time: (value, values) => {
      if (!value) return 'Вкажіть час завершення.';
      if (!isWholeHour(value)) return 'Бронювання — на повні години (наприклад, 13:00).';
      const hour = timeToMinutes(value) / 60;
      if (hour < OPEN_HOUR + 1 || hour > CLOSE_HOUR) {
        return `Завершення — з ${OPEN_HOUR + 1}:00 до ${CLOSE_HOUR}:00.`;
      }
      if (values.start_time && timeToMinutes(value) <= timeToMinutes(values.start_time)) {
        return 'Час завершення має бути пізніше за час початку.';
      }
      // Перевірка доступності: перетин із наявними бронюваннями на цю дату
      if (values.start_time) {
        const conflict = findConflict(busy, values.start_time, value);
        if (conflict) return `Місце зайняте з ${conflict.startTime} до ${conflict.endTime}. Оберіть інший час.`;
      }
      return '';
    },

    name: validateName,
    email: validateEmail,
    phone: (value) => validatePhone(value, { required: true }),
    consent: (value) => (value ? '' : 'Потрібна згода на обробку персональних даних.')
  };
}

// ---------- Підтвердження ----------

function showConfirmation(booking) {
  dialogBody.innerHTML = `
    <dl class="summary">
      <div><dt>Номер бронювання</dt><dd>${booking.id}</dd></div>
      <div><dt>Місце</dt><dd>${escapeHtml(workspace.name)}</dd></div>
      <div><dt>Дата</dt><dd>${formatDate(booking.date)}</dd></div>
      <div><dt>Час</dt><dd>${booking.startTime}–${booking.endTime}</dd></div>
      <div><dt>Вартість</dt><dd>${booking.totalPrice} грн</dd></div>
      <div><dt>На ім’я</dt><dd>${escapeHtml(booking.customerName)}</dd></div>
    </dl>`;
  openModal(dialog);
}

// ---------- Ініціалізація ----------

function showNotFound() {
  article.hidden = true;
  document.getElementById('workspace-aside').hidden = true;
  statusBox.className = 'state state--error';
  statusBox.hidden = false;
  statusBox.innerHTML = `
    <p><strong>Таке робоче місце не знайдено.</strong></p>
    <p>Можливо, посилання застаріло. Перегляньте актуальні місця в каталозі.</p>
    <p><a class="button" href="catalog.html">До каталогу</a></p>`;
}

function showLoadError(message) {
  article.hidden = true;
  statusBox.className = 'state state--error';
  statusBox.hidden = false;
  statusBox.innerHTML = `
    <p><strong>Не вдалося завантажити дані місця.</strong></p>
    <p>${escapeHtml(message)}</p>
    <p><button class="button" type="button" onclick="location.reload()">Спробувати ще раз</button></p>`;
}

async function init() {
  // Поки дані вантажаться, приховуємо статичний вміст-заглушку (він потрібен лише без JS)
  article.hidden = true;
  statusBox.className = 'state';
  statusBox.hidden = false;
  statusBox.innerHTML = '<span class="spinner" aria-hidden="true"></span><p>Завантажуємо дані місця…</p>';

  const rawId = new URLSearchParams(window.location.search).get('id') ?? '1';

  try {
    workspace = /^\d+$/.test(rawId) ? await getWorkspaceById(rawId) : null;
  } catch (error) {
    console.error(error);
    showLoadError(error.message);
    return;
  }
  if (!workspace) {
    showNotFound();
    return;
  }

  renderWorkspace(workspace);
  statusBox.hidden = true;
  article.hidden = false;

  // Мінімальна дата в календарі — сьогодні
  form.elements.date.min = toDateString();

  const validator = initFormValidation(form, {
    rules: buildRules(),
    submitButton: document.getElementById('booking-submit'),
    onSubmit: async (values) => {
      const startTime = values.start_time;
      const endTime = values.end_time;
      try {
        const booking = await createBooking({
          workspaceId: workspace.id,
          date: values.date,
          startTime,
          endTime,
          customerName: values.name.trim(),
          customerEmail: values.email.trim(),
          customerPhone: values.phone.trim(),
          totalPrice: calcTotalPrice(workspace.pricePerHour, startTime, endTime)
        });
        const bookedDate = values.date;
        validator.reset();
        form.elements.date.value = bookedDate; // залишаємо дату, щоб одразу видно було нову зайнятість
        await refreshBusy(validator);
        showConfirmation({ ...booking, date: bookedDate });
      } catch (error) {
        if (error.code === 'CONFLICT') {
          await refreshBusy(validator);
          validator.setError('end_time', error.message);
        } else {
          console.error(error);
          validator.setError('end_time', 'Не вдалося зберегти бронювання. Спробуйте ще раз.');
        }
      }
    }
  });

  // При зміні дати перезавантажуємо зайняті години; при зміні часу оновлюємо вартість
  form.elements.date.addEventListener('change', () => refreshBusy(validator));
  form.addEventListener('input', renderBookingInfo);

  resetDemoButton.addEventListener('click', async () => {
    clearStoredBookings();
    await refreshBusy(validator);
  });

  initModal(dialog);
  await refreshBusy(validator);
}

init();
