export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        pastel: {
          mint: {
            light: '#E0F2F1',
            DEFAULT: '#B2DFDB',
            dark: '#4DB6AC',
          },
          lavender: {
            light: '#F3E5F5',
            DEFAULT: '#E1BEE7',
            dark: '#9575CD',
          },
          pink: {
            light: '#FCE4EC',
            DEFAULT: '#F8BBD0',
            dark: '#F06292',
          },
          peach: {
            light: '#FFF3E0',
            DEFAULT: '#FFE0B2',
            dark: '#FFB74D',
          },
          yellow: {
            light: '#FFF9C4',
            DEFAULT: '#FFF59D',
            dark: '#FBC02D',
          },
          cream: '#FFFBE6',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: [],
};
