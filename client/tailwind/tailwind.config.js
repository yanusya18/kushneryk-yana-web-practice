/** @type {import('tailwindcss').Config} */
// Tailwind бере кольори з тих самих CSS-змінних (tokens.css), що й чистий CSS.
// Тому світла/темна тема (prefers-color-scheme і data-theme) працює без dark:-варіантів.
module.exports = {
  content: ["../static/contacts.tailwind.html"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        ink: "var(--color-text)",
        muted: "var(--color-muted)",
        line: "var(--color-border)",
        "line-strong": "var(--color-border-strong)",
        brand: "var(--color-primary)",
        "brand-hover": "var(--color-primary-hover)",
        "on-brand": "var(--color-on-primary)",
        link: "var(--color-link)",
        danger: "var(--color-error)",
        focus: "var(--color-focus)",
      },
      fontFamily: { sans: ["var(--font-sans)"] },
      maxWidth: { container: "var(--container)" },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },
    },
  },
  plugins: [],
};
