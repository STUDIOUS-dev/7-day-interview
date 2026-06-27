import type { Config } from 'tailwindcss'

const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-muted': 'var(--accent-muted)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-subtle': 'var(--border-subtle)',
        'border-active': 'var(--border-active)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px var(--border-subtle)',
        'active': '0 0 0 2px var(--border-active)',
        'glow': '0 0 24px rgba(94,234,212,0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
