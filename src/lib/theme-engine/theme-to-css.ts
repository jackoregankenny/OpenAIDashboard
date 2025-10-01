import type { Theme, ThemeCSSVariables } from './types';

/**
 * Convert a Theme object to CSS variables
 */
export function themeToCSSVariables(theme: Theme): ThemeCSSVariables {
  const variables: Record<string, string> = {};

  // Primary colors
  Object.entries(theme.colors.primary).forEach(([shade, value]) => {
    const key = shade === 'DEFAULT' ? '--color-primary' : `--color-primary-${shade}`;
    variables[key] = value;
  });

  // Secondary colors (if present)
  if (theme.colors.secondary) {
    Object.entries(theme.colors.secondary).forEach(([shade, value]) => {
      const key = shade === 'DEFAULT' ? '--color-secondary' : `--color-secondary-${shade}`;
      variables[key] = value;
    });
  }

  // Accent colors (if present)
  if (theme.colors.accent) {
    Object.entries(theme.colors.accent).forEach(([shade, value]) => {
      const key = shade === 'DEFAULT' ? '--color-accent' : `--color-accent-${shade}`;
      variables[key] = value;
    });
  }

  // Neutral colors
  Object.entries(theme.colors.neutral).forEach(([shade, value]) => {
    const key = shade === 'DEFAULT' ? '--color-neutral' : `--color-neutral-${shade}`;
    variables[key] = value;
  });

  // Semantic colors
  variables['--color-success'] = theme.colors.semantic.success;
  variables['--color-warning'] = theme.colors.semantic.warning;
  variables['--color-error'] = theme.colors.semantic.error;
  variables['--color-info'] = theme.colors.semantic.info;

  // Typography
  variables['--font-heading'] = theme.typography.fontFamilies.heading;
  variables['--font-body'] = theme.typography.fontFamilies.body;
  if (theme.typography.fontFamilies.mono) {
    variables['--font-mono'] = theme.typography.fontFamilies.mono;
  }

  // Typography scale
  Object.entries(theme.typography.scale).forEach(([size, value]) => {
    variables[`--text-${size}`] = value;
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([size, value]) => {
    variables[`--spacing-${size}`] = value;
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([size, value]) => {
    const key = size === 'DEFAULT' ? '--radius' : `--radius-${size}`;
    variables[key] = value;
  });

  return variables as ThemeCSSVariables;
}

/**
 * Convert CSS variables object to inline style string
 */
export function cssVariablesToStyle(variables: ThemeCSSVariables): React.CSSProperties {
  return variables as React.CSSProperties;
}

/**
 * Convert CSS variables to a CSS string for style tags
 */
export function cssVariablesToString(variables: ThemeCSSVariables): string {
  return Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Generate a complete CSS string with :root selector
 */
export function generateThemeCSS(theme: Theme): string {
  const variables = themeToCSSVariables(theme);
  return `:root {\n${cssVariablesToString(variables)}\n}`;
}

/**
 * Inject theme into document head as a style tag
 */
export function injectThemeStyles(theme: Theme, id = 'theme-variables'): void {
  if (typeof document === 'undefined') return;

  // Remove existing theme style tag
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create new style tag
  const style = document.createElement('style');
  style.id = id;
  style.textContent = generateThemeCSS(theme);
  document.head.appendChild(style);
}

/**
 * Get current theme CSS variables from document
 */
export function getCurrentThemeVariables(): Partial<ThemeCSSVariables> {
  if (typeof document === 'undefined') return {};

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const variables: Record<string, string> = {};

  // Get all CSS custom properties
  Array.from(computedStyle).forEach((property) => {
    if (property.startsWith('--color-') ||
        property.startsWith('--font-') ||
        property.startsWith('--spacing-') ||
        property.startsWith('--radius-') ||
        property.startsWith('--text-')) {
      variables[property] = computedStyle.getPropertyValue(property).trim();
    }
  });

  return variables;
}
