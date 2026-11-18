/**
 * form.js — клієнтська валідація форм.
 *
 * Ідея: для кожної форми описуємо ПРАВИЛА (rules) — функції, що повертають
 * текст помилки або порожній рядок. Модуль:
 *  • перевіряє поля на події input/blur та на submit;
 *  • показує повідомлення під полем і зв'язує його з полем через aria-describedby;
 *  • ставить aria-invalid="true" на хибні поля;
 *  • блокує кнопку відправки, доки форма не заповнена коректно.
 *
 * Важливо: клієнтська валідація — це зручність, а не безпека.
 * Користувач може обійти її в DevTools чи надіслати запит напряму,
 * тому ті самі перевірки потрібні на сервері (ПР 8).
 */

// ---------- Регулярні вирази ----------
// email: щось@щось.домен (без пробілів, домен щонайменше з 2 літер)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// український номер: +380 і рівно 9 цифр, напр. +380501234567
export const PHONE_PATTERN = /^\+380\d{9}$/;

// ---------- Готові перевірки (повертають текст помилки або '') ----------
export function validateName(value) {
  const name = value.trim();
  if (!name) return 'Вкажіть ім’я.';
  if (name.length < 2) return 'Ім’я має містити щонайменше 2 символи.';
  if (name.length > 60) return 'Ім’я не може бути довшим за 60 символів.';
  return '';
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Вкажіть email.';
  if (!EMAIL_PATTERN.test(email)) return 'Введіть коректний email, наприклад name@example.com.';
  return '';
}

export function validatePhone(value, { required = true } = {}) {
  const phone = value.trim();
  if (!phone) return required ? 'Вкажіть телефон у форматі +380XXXXXXXXX.' : '';
  if (!PHONE_PATTERN.test(phone)) return 'Телефон має бути у форматі +380XXXXXXXXX (9 цифр після +380).';
  return '';
}

export function validateRequired(value, message) {
  return value.trim() ? '' : message;
}

// ---------- Основна функція ----------

/**
 * @param {HTMLFormElement} form
 * @param {object} options
 * @param {Record<string, (value: string, values: object) => string>} options.rules
 *        правила за атрибутом name поля
 * @param {HTMLButtonElement} options.submitButton
 * @param {(values: object) => Promise<void>|void} options.onSubmit
 * @returns {{ refresh(): void, reset(): void }}
 */
export function initFormValidation(form, { rules, submitButton, onSubmit }) {
  // Вимикаємо вбудовані підказки браузера: показуємо власні, доступні для екранних читачів.
  form.noValidate = true;

  const fieldNames = Object.keys(rules);
  const touched = new Set(); // поля, з якими користувач уже взаємодіяв

  const getField = (name) => form.elements[name];

  /** Поточні значення полів (checkbox → 'on' або ''). */
  function readValues() {
    const values = {};
    for (const name of fieldNames) {
      const field = getField(name);
      values[name] = field.type === 'checkbox' ? (field.checked ? 'on' : '') : field.value;
    }
    return values;
  }

  /** Блок для повідомлення про помилку; створюється один раз і підключається через aria-describedby. */
  function getErrorElement(field) {
    const id = `${field.id}-error`;
    let element = document.getElementById(id);
    if (!element) {
      element = document.createElement('p');
      element.id = id;
      element.className = 'field-error';
      (field.closest('p') ?? field.parentElement).append(element);

      const describedBy = field.getAttribute('aria-describedby');
      field.setAttribute('aria-describedby', describedBy ? `${describedBy} ${id}` : id);
    }
    return element;
  }

  function showError(field, message) {
    const element = getErrorElement(field);
    element.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  /** Перевіряє одне поле. Повідомлення показується лише якщо showMessage === true. */
  function checkField(name, values, showMessage) {
    const message = rules[name](values[name], values);
    if (showMessage) showError(getField(name), message);
    return message === '';
  }

  /** Перевіряє всі поля; повертає масив імен хибних полів. */
  function checkAll(showMessages) {
    const values = readValues();
    return fieldNames.filter((name) => !checkField(name, values, showMessages || touched.has(name)));
  }

  /** Кнопка активна лише коли немає жодної помилки. */
  function updateSubmitState() {
    const invalid = checkAll(false);
    submitButton.disabled = invalid.length > 0;
  }

  /** Перевірка при введенні: показуємо помилки для полів, яких користувач уже торкався. */
  function handleChange(event) {
    const name = event.target.name;
    if (!fieldNames.includes(name)) return;
    if (event.type === 'blur' || event.type === 'change' || touched.has(name)) touched.add(name);
    // Зміна одного поля (напр., дати) може змінити валідність інших (час) — перевіряємо всі «торкнуті».
    checkAll(false);
    updateSubmitState();
  }

  // Делегування подій: один слухач на форму замість окремих на кожне поле.
  form.addEventListener('input', handleChange);
  form.addEventListener('change', handleChange);
  form.addEventListener('focusout', (event) => {
    // focusout «спливає» (на відміну від blur), тому підходить для делегування
    if (fieldNames.includes(event.target.name)) {
      touched.add(event.target.name);
      checkAll(false);
      updateSubmitState();
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = checkAll(true);
    updateSubmitState();
    if (invalid.length > 0) {
      getField(invalid[0]).focus(); // фокус на першому хибному полі
      return;
    }
    submitButton.disabled = true; // захист від подвійного натискання
    try {
      await onSubmit(readValues());
    } finally {
      updateSubmitState();
    }
  });

  // Блоки помилок створюємо одразу й резервуємо під них місце (min-height у CSS):
  // інакше поява повідомлення зсувала б сторінку й клік по наступному полю «промахувався» б.
  fieldNames.forEach((name) => getErrorElement(getField(name)));

  updateSubmitState();

  return {
    /** Перерахувати стан (коли змінились зовнішні дані, напр., зайняті години). */
    refresh() {
      checkAll(false);
      updateSubmitState();
    },
    /** Очистити форму й помилки після успішної відправки. */
    reset() {
      form.reset();
      touched.clear();
      for (const name of fieldNames) showError(getField(name), '');
      updateSubmitState();
    },
    /** Показати помилку для поля вручну (напр., відповідь сервера). */
    setError(name, message) {
      touched.add(name);
      showError(getField(name), message);
    }
  };
}
