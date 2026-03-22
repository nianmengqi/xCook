/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E85D04',
          light: '#F48C06',
          dark: '#DC2F02',
        },
        secondary: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
        },
        background: {
          primary: '#FFFBF7',
          secondary: '#FFFFFF',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        cn: ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
