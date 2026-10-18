/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5ded3',
          300: '#9ec6b6',
          400: '#6ea691',
          500: '#488771',
          DEFAULT: '#245C46',
          600: '#245C46',
          700: '#1d4b39',
          800: '#193d2f',
          900: '#163328',
          950: '#0b1d16',
        },
        sage: {
          50: '#f7faf7',
          100: '#edf4ee',
          DEFAULT: '#DCE9DE',
          200: '#DCE9DE',
          300: '#b8d4bc',
          400: '#8eb694',
        },
        cream: {
          50: '#fdfcf9',
          DEFAULT: '#FAF7F0',
          100: '#FAF7F0',
          200: '#f3eedf',
          300: '#e8dcbf',
        },
        peach: {
          50: '#fdf8f5',
          100: '#faeee7',
          DEFAULT: '#EFAF91',
          200: '#f4ccb6',
          300: '#EFAF91',
          400: '#e58f69',
          500: '#d97448',
        },
        charcoal: {
          DEFAULT: '#26332D',
          muted: '#475A51',
          light: '#72887D',
          border: '#D3DDD7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 92, 70, 0.08)',
        'card': '0 2px 12px -1px rgba(38, 51, 45, 0.06), 0 1px 3px 0 rgba(38, 51, 45, 0.04)',
        'elevated': '0 12px 32px -4px rgba(36, 92, 70, 0.12), 0 4px 12px -2px rgba(38, 51, 45, 0.06)',
      }
    },
  },
  plugins: [],
}
