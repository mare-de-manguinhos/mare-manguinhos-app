/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'terracota': '#D45D4A',
        'oceano': '#3A9D8F',
        'terracota-escuro': '#B3422E',
        'oceano-claro': '#5BB8A8',
        'solar': '#E9B84C',
        'areia-dourada': '#F2C97A',
        'areia': '#FBF6EF',
        'espuma': '#FFFCF7',
        'pedra-mar': '#D6CFC4',
        'ardosia': '#2C241E',
        'marinha': '#6B655A',
        'coral': '#D64550',
        'mangue': '#3FB27E',
      },
    },
  },
  plugins: [],
};
