/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",           // يفحص الملفات اللي بالمجلد الرئيسي (مثل App.tsx)
    "./components/**/*.{js,ts,jsx,tsx}", // يفحص مجلد المكونات
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}