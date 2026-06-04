import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * The palette is stored as hex in CSS variables (see src/index.css). Hex can't
 * carry Tailwind's `<alpha-value>`, so we wrap each token in color-mix() — this
 * keeps opacity modifiers (e.g. `bg-primary/90`) working across light/dark.
 */
const c = (token) =>
  `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        amber: {
          DEFAULT: c('--amber'),
          bright: c('--amber-bright'),
        },
        'cream-dim': c('--cream-dim'),
        border: c('--border'),
        input: c('--input'),
        ring: c('--ring'),
        background: c('--background'),
        foreground: c('--foreground'),
        primary: {
          DEFAULT: c('--primary'),
          foreground: c('--primary-foreground'),
        },
        secondary: {
          DEFAULT: c('--secondary'),
          foreground: c('--secondary-foreground'),
        },
        destructive: {
          DEFAULT: c('--destructive'),
          foreground: c('--destructive-foreground'),
        },
        muted: {
          DEFAULT: c('--muted'),
          foreground: c('--muted-foreground'),
        },
        accent: {
          DEFAULT: c('--accent'),
          foreground: c('--accent-foreground'),
        },
        popover: {
          DEFAULT: c('--popover'),
          foreground: c('--popover-foreground'),
        },
        card: {
          DEFAULT: c('--card'),
          foreground: c('--card-foreground'),
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
