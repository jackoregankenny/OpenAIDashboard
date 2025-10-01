import type { Theme } from './types';
import type { FontFormat } from './font-face';

export const THEME_STORAGE_KEY = 'editorTheme';

export interface StoredFontFace {
  family: string;
  dataUrl: string;
  format?: FontFormat;
  weight?: string;
  style?: string;
}

export interface StoredThemePackage {
  theme: Theme;
  fontPairing?: {
    label: string;
    heading: string;
    body: string;
  };
  customFonts?: {
    heading?: StoredFontFace;
    body?: StoredFontFace;
  };
  metadata?: {
    generatedAt: string;
    schoolName?: string;
  };
}
