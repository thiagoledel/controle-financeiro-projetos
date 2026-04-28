/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Tema dark ativado por classe — o body já adiciona a classe por padrão via CSS.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta primária: tons de azul.
        primary: {
          900: '#1d4ed8',
          700: '#2563eb',
          300: '#93c5fd',
        },
        // Tons de fundo escuro.
        dark: {
          900: '#0f172a',
          800: '#1e293b',
        },
        // Tons de sucesso: verde.
        success: {
          700: '#16a34a',
          500: '#22c55e',
        },
        // Tons de perigo/alerta: goiaba/vermelho.
        danger: {
          900: '#9f1239',
          700: '#9f1239',
          500: '#e11d48',
          300: '#fb7185',
        },
      },
    },
  },
  plugins: [],
};
