/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#C8A96B',
        'accent-dark': '#B0894E',
        'accent-light': '#F8F3EA',
        'bg-primary': '#FAFAF7',
        'bg-card': '#FFFFFF',
        'bg-section': '#F5F5F0',
        'bg-input': '#F8F7F4',
        'border-dark': '#D4D3CB',
        'border-light': '#ECECEC',
        'text-primary': '#1F1F1F',
        'text-secondary': '#6B6B6B',
        'text-muted': '#ABABAB',
        success: '#16A34A',
        danger: '#DC2626',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        'sm-custom': '0 2px 8px rgba(0,0,0,0.04)',
        'md-custom': '0 8px 32px rgba(0,0,0,0.05)',
        'lg-custom': '0 20px 60px rgba(0,0,0,0.06)',
        'accent-custom': '0 12px 40px rgba(200,169,107,0.20)',
        'whatsapp': '0 8px 24px rgba(37,211,102,0.25)',
        'glass': '0 4px 24px rgba(0,0,0,0.03)',
        'premium': '0 8px 40px rgba(0,0,0,0.05)',
        'card': '0 2px 12px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-up-sm': 'slideUpSm 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'progress': 'progress 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '500px' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpSm: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
