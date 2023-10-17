/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: () => ({
        112: '28rem',
        120: '30rem',
      }),
      minHeight: () => ({
        80: '20rem',
      }),
      colors: {
        palette: {
          lighter: '#F5F3FF',
          light: '#DDD6FE',
          primary: '#2d76ff',
          secondary: '#2ECC71',
          danger: '#FF4136',
          accent: '#FFDC00',
        },
      },
      fontFamily: {
        primary: ['"Josefin Sans"'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
