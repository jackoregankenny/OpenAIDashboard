'use client';

import { useEffect } from 'react';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { Toolbar } from '@/components/editor/Toolbar';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { PageNavigator } from '@/components/editor/PageNavigator';
import { useEditorStore, type PageMetadata } from '@/lib/stores/editor-store';
import { generateNodeId } from '@/lib/page-structure/types';

export default function EditorPage() {
  const hydratePages = useEditorStore((state) => state.hydratePages);
  const initializeWithDemo = useEditorStore((state) => state.initializeWithDemo);
  const pages = useEditorStore((state) => state.pages);
  const currentPageId = useEditorStore((state) => state.currentPageId);

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
