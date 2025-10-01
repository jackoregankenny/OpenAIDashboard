import chroma from 'chroma-js';
import type { ColorPalette } from '../types';

/**
 * Generate a full color palette (50-950) from a base color
 */
export function generatePaletteFromColor(baseColor: string): ColorPalette {
  try {
    const color = chroma(baseColor);

    // Generate a scale from very light to very dark
    const scale = chroma
      .scale([
        color.brighten(3).saturate(0.5), // 50 - very light
        color.brighten(2), // 100
        color.brighten(1.5), // 200
        color.brighten(1), // 300
        color.brighten(0.5), // 400
        color, // 500 - base color
        color.darken(0.5), // 600
        color.darken(1), // 700
        color.darken(1.5), // 800
        color.darken(2), // 900
        color.darken(2.5).desaturate(0.3), // 950 - very dark
      ])
      .mode('lch')
      .colors(11);

    return {
      50: scale[0],
      100: scale[1],
      200: scale[2],
      300: scale[3],
      400: scale[4],
      500: scale[5],
      600: scale[6],
      700: scale[7],
      800: scale[8],
      900: scale[9],
      950: scale[10],
      DEFAULT: baseColor,
    };
  } catch (error) {
    console.error('Error generating palette:', error);
    // Return a default blue palette on error
    return {
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
    };
  }
}

/**
 * Generate a neutral/gray palette from a base color
 * Uses desaturated version of the base color to create harmonious grays
 */
export function generateNeutralPalette(baseColor: string): ColorPalette {
  try {
    const color = chroma(baseColor);
    const hue = color.get('hsl.h');

    // Create grays with a hint of the base color's hue
    const scale = chroma
      .scale(['#ffffff', `hsl(${hue}, 10%, 10%)`])
      .mode('lch')
      .colors(11);

    return {
      50: scale[0],
      100: scale[1],
      200: scale[2],
      300: scale[3],
      400: scale[4],
      500: scale[5],
      600: scale[6],
      700: scale[7],
      800: scale[8],
      900: scale[9],
      950: scale[10],
      DEFAULT: scale[5],
    };
  } catch (error) {
    console.error('Error generating neutral palette:', error);
    // Return default neutral palette
    return {
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
    };
  }
}

/**
 * Generate complementary color (opposite on color wheel)
 */
export function generateComplementaryColor(baseColor: string): string {
  try {
    const color = chroma(baseColor);
    const hue = color.get('hsl.h');
    const saturation = color.get('hsl.s');
    const lightness = color.get('hsl.l');

    // Rotate hue by 180 degrees
    const complementaryHue = (hue + 180) % 360;

    return chroma.hsl(complementaryHue, saturation, lightness).hex();
  } catch (error) {
    console.error('Error generating complementary color:', error);
    return baseColor;
  }
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function generateAnalogousColors(
  baseColor: string,
  count: number = 2
): string[] {
  try {
    const color = chroma(baseColor);
    const hue = color.get('hsl.h');
    const saturation = color.get('hsl.s');
    const lightness = color.get('hsl.l');

    const colors: string[] = [];
    const step = 30; // 30 degrees apart

    for (let i = 1; i <= count; i++) {
      const newHue = (hue + step * i) % 360;
      colors.push(chroma.hsl(newHue, saturation, lightness).hex());
    }

    return colors;
  } catch (error) {
    console.error('Error generating analogous colors:', error);
    return [baseColor];
  }
}

/**
 * Check if a color has good contrast with white text
 */
export function hasGoodContrastWithWhite(color: string): boolean {
  try {
    const chromaColor = chroma(color);
    const contrast = chroma.contrast(chromaColor, 'white');
    return contrast >= 4.5; // WCAG AA standard
  } catch (error) {
    return false;
  }
}

/**
 * Check if a color has good contrast with black text
 */
export function hasGoodContrastWithBlack(color: string): boolean {
  try {
    const chromaColor = chroma(color);
    const contrast = chroma.contrast(chromaColor, 'black');
    return contrast >= 4.5; // WCAG AA standard
  } catch (error) {
    return false;
  }
}

/**
 * Get the best text color (black or white) for a background color
 */
export function getBestTextColor(backgroundColor: string): string {
  const whiteContrast = hasGoodContrastWithWhite(backgroundColor);
  return whiteContrast ? '#ffffff' : '#000000';
}

/**
 * Adjust color brightness to ensure minimum contrast
 */
export function ensureMinimumContrast(
  color: string,
  textColor: 'white' | 'black' = 'white',
  minContrast: number = 4.5
): string {
  try {
    let chromaColor = chroma(color);
    const target = textColor === 'white' ? 'white' : 'black';
    let contrast = chroma.contrast(chromaColor, target);

    // If contrast is already good, return original
    if (contrast >= minContrast) {
      return color;
    }

    // Try darkening or lightening
    let attempts = 0;
    const maxAttempts = 10;

    while (contrast < minContrast && attempts < maxAttempts) {
      if (textColor === 'white') {
        chromaColor = chromaColor.darken(0.2);
      } else {
        chromaColor = chromaColor.brighten(0.2);
      }

      contrast = chroma.contrast(chromaColor, target);
      attempts++;
    }

    return chromaColor.hex();
  } catch (error) {
    console.error('Error ensuring contrast:', error);
    return color;
  }
}
