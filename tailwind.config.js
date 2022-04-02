module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#BC8DF8',
        'secondary': '#42E2B8',
        'tertiary': '#F3DFBF',
        'background-dark': '#222025'
      }
    },
  },
  plugins: [],
}
