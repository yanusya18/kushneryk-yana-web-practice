/**
 * contacts.js — валідація та відправка контактної форми.
 * Повідомлення зберігаються локально (api.js); реальна відправка на сервер — у ПР 8.
 */
import { sendContactMessage } from './api.js';
import { initFormValidation, validateEmail, validateName, validatePhone, validateRequired } from './form.js';

const form = document.getElementById('contact-form');
const resultBox = document.getElementById('contact-result');
const messageField = document.getElementById('c-message');
const counter = document.getElementById('c-message-counter');

const MIN_MESSAGE = 10;
const MAX_MESSAGE = 1000;

const validator = initFormValidation(form, {
  submitButton: document.getElementById('contact-submit'),
  rules: {
    name: validateName,
    email: validateEmail,
    phone: (value) => validatePhone(value, { required: false }), // телефон необов'язковий
    topic: (value) => validateRequired(value, 'Оберіть тему звернення.'),
    message: (value) => {
      const text = value.trim();
      if (!text) return 'Напишіть повідомлення.';
      if (text.length < MIN_MESSAGE) return `Повідомлення має містити щонайменше ${MIN_MESSAGE} символів.`;
      if (text.length > MAX_MESSAGE) return `Повідомлення не може перевищувати ${MAX_MESSAGE} символів.`;
      return '';
    },
    consent: (value) => (value ? '' : 'Потрібна згода на обробку персональних даних.')
  },
  onSubmit: async (values) => {
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        topic: values.topic,
        message: values.message.trim()
      });
      resultBox.hidden = false;
      resultBox.className = 'state state--success';
      resultBox.textContent = `Дякуємо, ${values.name.trim()}! Повідомлення збережено (демо-режим). Надсилання на сервер з’явиться в ПР 8.`;
      validator.reset();
      updateCounter();
    } catch (error) {
      console.error(error);
      resultBox.hidden = false;
      resultBox.className = 'state state--error';
      resultBox.textContent = 'Не вдалося зберегти повідомлення. Спробуйте ще раз.';
    }
  }
});

function updateCounter() {
  counter.textContent = `${messageField.value.length} / ${MAX_MESSAGE}`;
}

messageField.addEventListener('input', updateCounter);
form.addEventListener('input', () => {
  resultBox.hidden = true; // ховаємо попереднє повідомлення, коли користувач знову пише
});
updateCounter();
