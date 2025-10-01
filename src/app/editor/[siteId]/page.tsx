'use client';

import { useEffect } from 'react';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { Toolbar } from '@/components/editor/Toolbar';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { PageNavigator } from '@/components/editor/PageNavigator';
import { useEditorStore, type PageMetadata } from '@/lib/stores/editor-store';
import { generateNodeId } from '@/lib/page-structure/types';
import { injectThemeStyles } from '@/lib/theme-engine/theme-to-css';
import {
  injectFontFaceStyles,
  type CustomFontDefinition,
} from '@/lib/theme-engine/font-face';
import {
  THEME_STORAGE_KEY,
  type StoredThemePackage,
} from '@/lib/theme-engine/theme-storage';

export default function EditorPage() {
  const hydratePages = useEditorStore((state) => state.hydratePages);
  const initializeWithDemo = useEditorStore((state) => state.initializeWithDemo);
  const pages = useEditorStore((state) => state.pages);
  const currentPageId = useEditorStore((state) => state.currentPageId);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (!storedTheme) {
      injectFontFaceStyles([], 'editor-fonts');
      return;
    }

    try {
      const parsed = JSON.parse(storedTheme) as StoredThemePackage;

      if (parsed.theme) {
        injectThemeStyles(parsed.theme);
      }

      const fonts: CustomFontDefinition[] = [];
      const headingFont = parsed.customFonts?.heading;
      const bodyFont = parsed.customFonts?.body;

      if (headingFont) {
        fonts.push({
          id: 'editor-heading-font',
          family: headingFont.family,
          dataUrl: headingFont.dataUrl,
          format: headingFont.format,
          weight: headingFont.weight,
          style: headingFont.style,
        });
      }

      if (bodyFont) {
        fonts.push({
          id: 'editor-body-font',
          family: bodyFont.family,
          dataUrl: bodyFont.dataUrl,
          format: bodyFont.format,
          weight: bodyFont.weight,
          style: bodyFont.style,
        });
      }

      injectFontFaceStyles(fonts, 'editor-fonts');
    } catch (error) {
      injectFontFaceStyles([], 'editor-fonts');
      console.error('Failed to load stored theme:', error);
    }
  }, []);

  // Load saved pages (multi-page aware) or fall back to demo
  useEffect(() => {
    const savedPages = localStorage.getItem('editorPages');

    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages) as {
          pages: PageMetadata[];
          currentPageId?: string | null;
        };

        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          hydratePages(parsed.pages, parsed.currentPageId ?? null);
          return;
        }
      } catch (error) {
        console.error('Failed to load saved pages:', error);
      }
    }

    // Legacy support: migrate single page save format
    const legacyPage = localStorage.getItem('editorPageTree');
    if (legacyPage) {
      try {
        const pageTree = JSON.parse(legacyPage);
        const pageId = generateNodeId();
        const now = new Date().toISOString();

        const metadata: PageMetadata = {
          id: pageId,
          title: 'Home',
          slug: 'home',
          description: 'Imported from legacy save',
          pageTree,
          createdAt: now,
          updatedAt: now,
        };

        hydratePages([metadata], pageId);
        localStorage.removeItem('editorPageTree');
        return;
      } catch (error) {
        console.error('Failed to migrate legacy page:', error);
      }
    }

    initializeWithDemo();
  }, [hydratePages, initializeWithDemo]);

  // Persist pages to localStorage whenever they change
  useEffect(() => {
    if (!pages.length) return;

    try {
      const payload = JSON.stringify({ pages, currentPageId });
      localStorage.setItem('editorPages', payload);
    } catch (error) {
      console.error('Failed to persist pages:', error);
    }
  }, [pages, currentPageId]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <PageNavigator />

      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <div className="w-80 flex-shrink-0">
          <ComponentPalette />
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <Canvas />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
