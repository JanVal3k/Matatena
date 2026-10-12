import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        matatena: {
          50: '#fff5ec',
          100: '#ffe7d2',
          200: '#ffcca5',
          300: '#ffa86b',
          400: '#ff7930',
          500: '#ff5508',
          600: '#f83d00',
          700: '#cd2801',
          800: '#9a1f09',
          900: '#831e0b',
          950: '#470b03',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;