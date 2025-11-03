const sharedConfig = require('@shared/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  // Asegurar que estos colores siempre se generen
  safelist: [
    'bg-app',
    'bg-card',
    'bg-hover',
    'text-primary-text',
    'text-secondary-text',
    'text-muted',
    'border-light',
    'border-dark',
    'border-border-default',
    {
      pattern: /(bg|text|border)-(primary|secondary|success|warning|danger|info|neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /(bg|text|border)-rickmorty-(green|blue|portal)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
}

