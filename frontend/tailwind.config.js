/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",             // Đọc file `index.html` gốc
      "./src/**/*.{js,ts,jsx,tsx}" // Đọc các file React trong thư mục `src`
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  