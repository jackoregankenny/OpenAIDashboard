import { generatePaletteFromColor, generateNeutralPalette } from '../generators/palette-generator';
import type { Theme } from '../types';

let vibrantLoader: Promise<any> | null = null;

async function loadVibrant() {
  if (!vibrantLoader) {
    const isBrowser = typeof window !== 'undefined';
    vibrantLoader = (isBrowser
      ? import('node-vibrant/browser')
      : import('node-vibrant')
    ).then((mod) => mod.default ?? mod);
  }

  return vibrantLoader;
}

/**
 * Extract dominant colors from an image URL
 */
export async function extractColorsFromImage(imageUrl: string): Promise<{
  primary: string;
  secondary?: string;
  vibrant: string;
  muted: string;
  darkVibrant: string;
  lightVibrant: string;
}> {
  try {
    const Vibrant = await loadVibrant();
    const palette = await Vibrant.from(imageUrl).getPalette();

    return {
      primary: palette.Vibrant?.hex || '#3b82f6',
      secondary: palette.DarkVibrant?.hex,
      vibrant: palette.Vibrant?.hex || '#3b82f6',
      muted: palette.Muted?.hex || '#737373',
      darkVibrant: palette.DarkVibrant?.hex || '#1e40af',
      lightVibrant: palette.LightVibrant?.hex || '#60a5fa',
    };
  } catch (error) {
    console.error('Error extracting colors from image:', error);
    // Return default colors on error
    return {
      primary: '#3b82f6',
      vibrant: '#3b82f6',
      muted: '#737373',
      darkVibrant: '#1e40af',
      lightVibrant: '#60a5fa',
    };
  }
}

interface ThemeBaseOptions {
  schoolName: string;
  sourceReference: string;
  primaryColor: string;
  secondaryColor?: string;
  infoColor?: string;
}

function createThemeFromBaseColors({
  schoolName,
  sourceReference,
  primaryColor,
  secondaryColor,
  infoColor,
}: ThemeBaseOptions): Omit<Theme, 'id'> {
  const primaryPalette = generatePaletteFromColor(primaryColor);
  const neutralPalette = generateNeutralPalette(primaryColor);

  const secondaryPalette = secondaryColor
    ? generatePaletteFromColor(secondaryColor)
    : undefined;

  return {
    name: `${schoolName} Theme`,
    source: {
      type: 'logo',
      reference: sourceReference,
    },
    colors: {
      primary: primaryPalette,
      secondary: secondaryPalette,
      neutral: neutralPalette,
      semantic: {
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: infoColor || primaryPalette[300],
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
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
}

export interface GeneratedThemeResult {
  theme: Omit<Theme, 'id'>;
  extractedColors: Awaited<ReturnType<typeof extractColorsFromImage>>;
}

/**
 * Generate a complete theme from a logo image along with the raw crest colours
 */
export async function generateThemeFromLogo(
  imageUrl: string,
  schoolName: string
): Promise<GeneratedThemeResult> {
  const colors = await extractColorsFromImage(imageUrl);

  const theme = createThemeFromBaseColors({
    schoolName,
    sourceReference: imageUrl,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    infoColor: colors.lightVibrant,
  });

  return {
    theme,
    extractedColors: colors,
  };
}

export { createThemeFromBaseColors };

/**
 * Extract colors from a logo file (base64 or URL)
 * This is a simplified version for client-side use
 */
export async function extractColorsFromLogoFile(
  file: File
): Promise<{
  primary: string;
  secondary?: string;
  vibrant: string;
  muted: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const colors = await extractColorsFromImage(dataUrl);
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
