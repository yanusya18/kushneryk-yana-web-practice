/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Коренем проєкту є папка client/. Стилі, зображення й дані з ПР 4–6 лежать у client/assets/
// і підключаються в React імпортами (Vite хешує їх і копіює у збірку).
export default defineConfig({
  plugins: [react()],
  // Налаштування Vitest (ПР 9): jsdom імітує браузерний DOM для тестів React-компонентів
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
})
