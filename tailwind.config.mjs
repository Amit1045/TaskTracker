/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // 👈 required for manual dark mode toggle
    theme: {
      extend: {
        colors: {
          primary: '#1E40AF',
          secondary: '#F59E0B',
          background: '#F9FAFB',
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  