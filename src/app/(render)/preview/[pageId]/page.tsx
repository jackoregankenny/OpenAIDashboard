'use client';

import { PageRenderer } from '@/lib/renderer/PageRenderer';
import { createPageNode } from '@/lib/page-structure/types';
import { useEffect, useState } from 'react';

export default function PreviewPage() {

  const [pageTree, setPageTree] = useState(createPageNode('page'));

  useEffect(() => {
    const savedPages = localStorage.getItem('editorPages');

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
