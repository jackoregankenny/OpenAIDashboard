'use client';

import { PageRenderer } from '@/lib/renderer/PageRenderer';
import { createPageNode } from '@/lib/page-structure/types';
import { useEffect, useState } from 'react';

export default function PreviewPage() {

  const [pageTree, setPageTree] = useState(createPageNode('page'));

  useEffect(() => {
    const savedPages = localStorage.getItem('editorPages');
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme) {
      try {
        const parsedTheme = JSON.parse(storedTheme) as StoredThemePackage;
        if (parsedTheme.theme) {
          injectThemeStyles(parsedTheme.theme);
        }
        if (parsedTheme.customFonts) {
          const fonts = Object.values(parsedTheme.customFonts).filter(Boolean);
          const definitions = fonts.map((font) => ({
            id: `preview-${font.role}`,
            family: font.family,
            dataUrl: font.dataUrl,
            format: font.format,
            weight: font.weight,
            style: font.style,
          }));
          injectFontFaceStyles(definitions, 'preview-fonts');
        }
      } catch (error) {
        console.error('Failed to load stored theme:', error);
      }
    }

    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        const currentPage = parsed.pages.find(page => page.id === parsed.currentPageId);
        setPageTree(currentPage ? currentPage.pageTree : createPageNode('page'));
      } catch (error) {
        console.error('Failed to load saved pages:', error);
      }
    }
  }, []);

  return (
    <main>
      <PageRenderer pageTree={pageTree} />
    </main>
  );
}
