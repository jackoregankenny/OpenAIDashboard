import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Theme engine colors - these map to our CSS variables
  			primary: {
  				50: 'var(--color-primary-50)',
  				100: 'var(--color-primary-100)',
  				200: 'var(--color-primary-200)',
  				300: 'var(--color-primary-300)',
  				400: 'var(--color-primary-400)',
  				500: 'var(--color-primary-500)',
  				600: 'var(--color-primary-600)',
  				700: 'var(--color-primary-700)',
  				800: 'var(--color-primary-800)',
  				900: 'var(--color-primary-900)',
  				950: 'var(--color-primary-950)',
  				DEFAULT: 'var(--color-primary)',
  			},
  			secondary: {
  				50: 'var(--color-secondary-50, var(--color-primary-50))',
  				100: 'var(--color-secondary-100, var(--color-primary-100))',
  				200: 'var(--color-secondary-200, var(--color-primary-200))',
  				300: 'var(--color-secondary-300, var(--color-primary-300))',
  				400: 'var(--color-secondary-400, var(--color-primary-400))',
  				500: 'var(--color-secondary-500, var(--color-primary-500))',
  				600: 'var(--color-secondary-600, var(--color-primary-600))',
  				700: 'var(--color-secondary-700, var(--color-primary-700))',
  				800: 'var(--color-secondary-800, var(--color-primary-800))',
  				900: 'var(--color-secondary-900, var(--color-primary-900))',
  				DEFAULT: 'var(--color-secondary, var(--color-primary))',
  			},
  			neutral: {
  				50: 'var(--color-neutral-50)',
  				100: 'var(--color-neutral-100)',
  				200: 'var(--color-neutral-200)',
  				300: 'var(--color-neutral-300)',
  				400: 'var(--color-neutral-400)',
  				500: 'var(--color-neutral-500)',
  				600: 'var(--color-neutral-600)',
  				700: 'var(--color-neutral-700)',
  				800: 'var(--color-neutral-800)',
  				900: 'var(--color-neutral-900)',
  				950: 'var(--color-neutral-950)',
  				DEFAULT: 'var(--color-neutral)',
  			},
  			success: 'var(--color-success)',
  			warning: 'var(--color-warning)',
  			error: 'var(--color-error)',
  			info: 'var(--color-info)',

  			// shadcn/ui compatibility colors
  			background: 'hsl(var(--background, 0 0% 100%))',
  			foreground: 'hsl(var(--foreground, 0 0% 3.9%))',
  			card: {
  				DEFAULT: 'hsl(var(--card, 0 0% 100%))',
  				foreground: 'hsl(var(--card-foreground, 0 0% 3.9%))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover, 0 0% 100%))',
  				foreground: 'hsl(var(--popover-foreground, 0 0% 3.9%))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted, 0 0% 96.1%))',
  				foreground: 'hsl(var(--muted-foreground, 0 0% 45.1%))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent, 0 0% 96.1%))',
  				foreground: 'hsl(var(--accent-foreground, 0 0% 9%))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive, 0 84.2% 60.2%))',
  				foreground: 'hsl(var(--destructive-foreground, 0 0% 98%))'
  			},
  			border: 'hsl(var(--border, 0 0% 89.8%))',
  			input: 'hsl(var(--input, 0 0% 89.8%))',
  			ring: 'hsl(var(--ring, 0 0% 3.9%))',
  		},
  		fontFamily: {
  			heading: 'var(--font-heading)',
  			body: 'var(--font-body)',
  			mono: 'var(--font-mono, ui-monospace, monospace)',
  		},
  		spacing: {
  			xs: 'var(--spacing-xs, 0.5rem)',
  			sm: 'var(--spacing-sm, 0.75rem)',
  			md: 'var(--spacing-md, 1rem)',
  			lg: 'var(--spacing-lg, 1.5rem)',
  			xl: 'var(--spacing-xl, 2rem)',
  			'2xl': 'var(--spacing-2xl, 2.5rem)',
  			'3xl': 'var(--spacing-3xl, 3rem)',
  			'4xl': 'var(--spacing-4xl, 4rem)',
  		},
  		borderRadius: {
  			none: 'var(--radius-none, 0)',
  			sm: 'var(--radius-sm, 0.125rem)',
  			DEFAULT: 'var(--radius, 0.25rem)',
  			md: 'var(--radius-md, 0.375rem)',
  			lg: 'var(--radius-lg, 0.5rem)',
  			xl: 'var(--radius-xl, 0.75rem)',
  			'2xl': 'var(--radius-2xl, 1rem)',
  			'3xl': 'var(--radius-3xl, 1.5rem)',
  			full: 'var(--radius-full, 9999px)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;


