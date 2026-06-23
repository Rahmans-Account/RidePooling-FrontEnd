export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        chalk: {
          cream: '#F9F9FB',
        },
        currant: {
          dark: '#1E1A34',
        },
        pastel: {
          mint: {
            light: '#EAF8F1',
            DEFAULT: '#D0F2E5',
            dark: '#8CCAB0',
          },
          lavender: {
            light: '#F3ECFA',
            DEFAULT: '#E5D9F2',
            dark: '#B7A4DB',
          },
          pink: {
            light: '#FCEDEE',
            DEFAULT: '#FCE1E4',
            dark: '#E4A6B0',
          },
          peach: {
            light: '#FDF0E5',
            DEFAULT: '#FAD2B8',
            dark: '#E7A87F',
          },
          yellow: {
            light: '#FFF9C4',
            DEFAULT: '#FFF59D',
            dark: '#FBC02D',
          },
          cream: '#F9F9FB',
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
