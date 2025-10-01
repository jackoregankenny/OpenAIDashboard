import { z } from 'zod';

/**
 * Color palette with shades from 50-900
 */
export const colorPaletteSchema = z.object({
  50: z.string(),
  100: z.string(),
  200: z.string(),
  300: z.string(),
  400: z.string(),
  500: z.string(),
  600: z.string(),
  700: z.string(),
  800: z.string(),
  900: z.string(),
  950: z.string().optional(),
  DEFAULT: z.string(),
});

export type ColorPalette = z.infer<typeof colorPaletteSchema>;

/**
 * Typography scale
 */
export const typographyScaleSchema = z.object({
  xs: z.string(),
  sm: z.string(),
  base: z.string(),
  lg: z.string(),
  xl: z.string(),
  '2xl': z.string(),
  '3xl': z.string(),
  '4xl': z.string(),
  '5xl': z.string(),
  '6xl': z.string(),
});

export type TypographyScale = z.infer<typeof typographyScaleSchema>;

/**
 * Spacing scale
 */
export const spacingScaleSchema = z.record(z.string(), z.string());

export type SpacingScale = z.infer<typeof spacingScaleSchema>;

/**
 * Border radius scale
 */
export const radiusScaleSchema = z.object({
  none: z.string(),
  sm: z.string(),
  DEFAULT: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  '2xl': z.string(),
  '3xl': z.string(),
  full: z.string(),
});

export type RadiusScale = z.infer<typeof radiusScaleSchema>;

/**
 * Source type for theme generation
 */
export const themeSourceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('logo'),
    reference: z.string(), // Asset ID or URL
  }),
  z.object({
    type: z.literal('website'),
    reference: z.string(), // URL
  }),
  z.object({
    type: z.literal('manual'),
    reference: z.string().optional(),
  }),
]);

export type ThemeSource = z.infer<typeof themeSourceSchema>;

/**
 * Complete theme configuration
 */
export const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: themeSourceSchema,
  colors: z.object({
    primary: colorPaletteSchema,
    secondary: colorPaletteSchema.optional(),
    accent: colorPaletteSchema.optional(),
    neutral: colorPaletteSchema,
    semantic: z.object({
      success: z.string(),
      warning: z.string(),
      error: z.string(),
      info: z.string(),
    }),
  }),
  typography: z.object({
    fontFamilies: z.object({
      heading: z.string(),
      body: z.string(),
      mono: z.string().optional(),
    }),
    scale: typographyScaleSchema,
  }),
  spacing: spacingScaleSchema,
  borderRadius: radiusScaleSchema,
  metadata: z
    .object({
      createdAt: z.string(),
      updatedAt: z.string(),
      version: z.string(),
    })
    .optional(),
});

export type Theme = z.infer<typeof themeSchema>;

/**
 * CSS variable mapping for runtime theming
 */
export interface ThemeCSSVariables {
  // Primary colors
  '--color-primary-50': string;
  '--color-primary-100': string;
  '--color-primary-200': string;
  '--color-primary-300': string;
  '--color-primary-400': string;
  '--color-primary-500': string;
  '--color-primary-600': string;
  '--color-primary-700': string;
  '--color-primary-800': string;
  '--color-primary-900': string;
  '--color-primary-950'?: string;
  '--color-primary': string;

  // Neutral colors
  '--color-neutral-50': string;
  '--color-neutral-100': string;
  '--color-neutral-200': string;
  '--color-neutral-300': string;
  '--color-neutral-400': string;
  '--color-neutral-500': string;
  '--color-neutral-600': string;
  '--color-neutral-700': string;
  '--color-neutral-800': string;
  '--color-neutral-900': string;
  '--color-neutral-950'?: string;
  '--color-neutral': string;

  // Semantic colors
  '--color-success': string;
  '--color-warning': string;
  '--color-error': string;
  '--color-info': string;

  // Typography
  '--font-heading': string;
  '--font-body': string;
  '--font-mono'?: string;

  // Spacing (example)
  '--spacing-xs': string;
  '--spacing-sm': string;
  '--spacing-md': string;
  '--spacing-lg': string;
  '--spacing-xl': string;

  // Border radius
  '--radius-sm': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-xl': string;
  '--radius-full': string;

  [key: string]: string | undefined;
}

/**
 * Default theme values
 */
export const DEFAULT_THEME: Omit<Theme, 'id' | 'name' | 'source'> = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
      DEFAULT: '#3b82f6',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
      DEFAULT: '#737373',
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  typography: {
    fontFamilies: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'Menlo, Monaco, monospace',
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
};
