import Vibrant from 'node-vibrant';
import { generatePaletteFromColor, generateNeutralPalette } from '../generators/palette-generator';
import type { Theme } from '../types';

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

/**
 * Generate a complete theme from a logo image
 */
export async function generateThemeFromLogo(
  imageUrl: string,
  schoolName: string
): Promise<Omit<Theme, 'id'>> {
  const colors = await extractColorsFromImage(imageUrl);

  // Generate full color palettes
  const primaryPalette = generatePaletteFromColor(colors.primary);
  const neutralPalette = generateNeutralPalette(colors.primary);

  // Generate secondary palette if we have a secondary color
  const secondaryPalette = colors.secondary
    ? generatePaletteFromColor(colors.secondary)
    : undefined;

  return {
    name: `${schoolName} Theme`,
    source: {
      type: 'logo',
      reference: imageUrl,
    },
    colors: {
      primary: primaryPalette,
      secondary: secondaryPalette,
      neutral: neutralPalette,
      semantic: {
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: colors.lightVibrant,
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
