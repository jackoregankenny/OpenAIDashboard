export type FontFormat = 'woff2' | 'woff' | 'truetype' | 'opentype' | 'embedded-opentype';

export interface CustomFontDefinition {
  id: string;
  family: string;
  dataUrl: string;
  format?: FontFormat;
  weight?: string;
  style?: string;
}

function formatFamilyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'CustomFont';
  const hasQuotes = trimmed.startsWith('"') || trimmed.startsWith("'");
  if (hasQuotes) {
    return trimmed;
  }
  if (/\s/.test(trimmed)) {
    return `"${trimmed}"`;
  }
  return trimmed;
}

export function createFontFaceCSS(font: CustomFontDefinition): string {
  const parts: string[] = [];
  parts.push('@font-face {');
  parts.push(`  font-family: ${formatFamilyName(font.family)};`);
  parts.push(`  font-display: swap;`);
  if (font.style) {
    parts.push(`  font-style: ${font.style};`);
  }
  if (font.weight) {
    parts.push(`  font-weight: ${font.weight};`);
  }
  const formatSegment = font.format ? ` format('${font.format}')` : '';
  parts.push(`  src: url('${font.dataUrl}')${formatSegment};`);
  parts.push('}');
  return parts.join('\n');
}

export function injectFontFaceStyles(
  fonts: CustomFontDefinition[],
  id = 'theme-fonts'
): void {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  if (!fonts.length) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = fonts.map(createFontFaceCSS).join('\n');
  document.head.appendChild(style);
}
