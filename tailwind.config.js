/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mar': '#1A5F7A',
        'mar-dark': '#0D3D52',
        'oceano': '#2E86AB',
        'solar': '#F2A23A',
        'areia-dourada': '#F5C97A',
        'areia': '#FDF6EC',
        'espuma': '#FAFCFD',
        'pedra-mar': '#B8D4DC',
        'ardosia': '#1C3A47',
        'marinha': '#5A7A87',
        'coral': '#E05A5A',
        'mangue': '#3A9E6A',
      },
    },
  },
  plugins: [],
};
