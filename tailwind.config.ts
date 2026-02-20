import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        az: {
          black: '#07070A',
          charcoal: '#14141A',
          beige: '#D9C9AF',
          gold: '#C49A51',
          electric: '#5BA8FF'
        }
      },
      boxShadow: {
        glow: '0 0 25px rgba(91,168,255,0.2)',
        gold: '0 0 20px rgba(196,154,81,0.25)'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 20% 20%, rgba(91,168,255,0.08), transparent 45%), radial-gradient(circle at 80% 0%, rgba(196,154,81,0.1), transparent 35%)'
      }
    }
  },
  plugins: []
};

export default config;
