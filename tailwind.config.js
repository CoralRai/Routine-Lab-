/** @type {import('tailwindcss').Config} */

// Nykaa's design language: a single signature pink (#FC2779) on clean
// white surfaces with neutral greys. No gradients, no secondary accents —
// pink is the only colour that carries brand weight.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    // Conflict severity colours — assembled dynamically
    'bg-red-50', 'border-red-200', 'text-red-700',
    'bg-amber-50', 'border-amber-200', 'text-amber-700',
    'bg-green-50', 'border-green-200', 'text-green-700',
    'bg-pink-50', 'border-pink-200', 'text-pink-700',
  ],
  theme: {
    extend: {
      // Exact tokens from Nykaa's design system colour sheet.
      colors: {
        nykaa: {
          pink: '#FC2779',        // Petal Pink — primary
          'pink-dark': '#DD1973', // Dark Pink — hover/active
          'pink-light': '#FFE7F4',// Baby Pink — tints
          'pink-mid': '#FDC0CE',  // Rusty Pink — borders on tints
        },
        ink: {
          DEFAULT: '#3F4140',     // Fade Black — primary text
          soft: '#717171',        // secondary text
          muted: '#A7A7A7',       // Light Grey — tertiary text
        },
        line: '#EEE5E9',          // Lines — borders/dividers
      },
      fontFamily: {
        // Nykaa's webfont (confirmed via their @font-face: font-family: Inter)
        sans: ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 14px rgba(0,0,0,0.10)',
        modal: '0 8px 28px rgba(0,0,0,0.14)',
      },
      borderRadius: {
        nykaa: '6px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}
