import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#2563eb", 
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(55 65 81)',
            '--tw-prose-headings': 'rgb(17 24 39)',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-td-borders': 'rgb(229 231 235)',
            '--tw-prose-th-backgrounds': 'rgb(243 244 246)',
            
            color: 'var(--tw-prose-body)',
            
            // Headings
            h1: { color: 'var(--tw-prose-headings)', fontWeight: '800' },
            h2: { color: 'var(--tw-prose-headings)', fontWeight: '700' },
            h3: { color: 'var(--tw-prose-headings)', fontWeight: '600' },
            h4: { color: 'var(--tw-prose-headings)', fontWeight: '600' },
            
            // Lists
            ul: {
              li: {
                color: 'var(--tw-prose-body)',
                '&::marker': {
                  color: 'var(--tw-prose-body)',
                },
              },
            },
            ol: {
              li: {
                color: 'var(--tw-prose-body)',
                '&::marker': {
                  color: 'var(--tw-prose-body)',
                },
              },
            },
            
            // Links
            a: {
              color: 'var(--tw-prose-links)',
              '&:hover': {
                color: 'var(--tw-prose-links)',
                textDecoration: 'underline',
              },
            },
            
            // Paragraphs
            p: {
              color: 'var(--tw-prose-body)',
            },
            
            // Tables
            table: {
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'table thead': {
              borderBottom: '2px solid var(--tw-prose-td-borders)',
            },
            'table thead th': {
              padding: '0.75rem',
              backgroundColor: 'var(--tw-prose-th-backgrounds)',
              fontWeight: '600',
              textAlign: 'left',
              color: 'var(--tw-prose-headings)',
            },
            'table tbody td': {
              padding: '0.75rem',
              borderWidth: '1px',
              borderColor: 'var(--tw-prose-td-borders)',
              verticalAlign: 'top',
              color: 'var(--tw-prose-body)',
            },
            
            // Code blocks
            pre: {
              backgroundColor: 'rgb(243 244 246)',
              color: 'var(--tw-prose-body)',
            },
            code: {
              color: 'var(--tw-prose-body)',
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            
            // Blockquotes
            blockquote: {
              color: 'var(--tw-prose-body)',
              borderLeftColor: 'var(--tw-prose-td-borders)',
            },
            
            // Strong, emphasis
            strong: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
            },
            em: {
              color: 'var(--tw-prose-body)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
