'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useEditorStore } from '@/lib/stores/editor-store';

export function PageNavigator() {
  const pages = useEditorStore((state) => state.pages);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const createPage = useEditorStore((state) => state.createPage);
  const switchToPage = useEditorStore((state) => state.switchToPage);
  const deletePage = useEditorStore((state) => state.deletePage);
  const duplicatePage = useEditorStore((state) => state.duplicatePage);
  const updatePageMetadata = useEditorStore((state) => state.updatePageMetadata);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isActionsOpen, setActionsOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setActionsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleAddPage = () => {
    const index = pages.length + 1;
    const pageId = createPage(`Page ${index}`);
    switchToPage(pageId);
  };

  const handleDeletePage = (pageId: string, title: string) => {
    if (pages.length <= 1) {
      alert('A site needs at least one page. Add another page before deleting this one.');
      return;
    }

    if (window.confirm(`Delete “${title}”? This cannot be undone.`)) {
      deletePage(pageId);
    }
  };

  const handleDuplicatePage = (pageId: string) => {
    const newPageId = duplicatePage(pageId);
    switchToPage(newPageId);
  };

  const currentPage = pages.find((page) => page.id === currentPageId) ?? null;

  useEffect(() => {
    if (isActionsOpen && currentPage) {
      setDraftTitle(currentPage.title);
      setDraftSlug(currentPage.slug);
    }
  }, [isActionsOpen, currentPage]);

  const handleSavePageDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPage) return;

    const title = draftTitle.trim();
    const slug = draftSlug.trim();

    if (!title) {
      alert('Page title cannot be empty.');
      return;
    }

    updatePageMetadata(currentPage.id, { title, slug });
    setActionsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="h-12 bg-gray-100 border-b px-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setDropdownOpen((open) => !open);
              setActionsOpen(false);
            }}
            className="px-4 py-1.5 rounded-full bg-white border border-gray-300 shadow-sm text-sm font-medium flex items-center gap-2 hover:border-blue-400 hover:text-blue-600"
            disabled={!pages.length}
          >
            {currentPage ? (
              <>
                <span>{currentPage.title}</span>
                <span className="text-xs text-gray-400">/{currentPage.slug}</span>
              </>
            ) : (
              <span className="text-gray-400">No pages</span>
            )}
            <svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isDropdownOpen && pages.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2 text-sm">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    switchToPage(page.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    page.id === currentPageId ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{page.title}</span>
                    {page.id === currentPageId && (
                      <span className="text-xs uppercase tracking-wide">Current</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">/{page.slug}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setDropdownOpen(false);
              setActionsOpen((open) => {
                const next = !open;
                if (!open && currentPage) {
                  setDraftTitle(currentPage.title);
                  setDraftSlug(currentPage.slug);
                }
                return next;
              });
            }}
            className="px-3 py-1.5 rounded-full bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300"
            disabled={!currentPage}
            title="Page actions"
          >
            Actions
          </button>

          {isActionsOpen && currentPage && (
            <div
              className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-3 text-sm"
              onClick={(event) => event.stopPropagation()}
            >
              <form className="px-4 space-y-3" onSubmit={handleSavePageDetails}>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Page Title
                  </label>
                  <input
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Home"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Slug
                  </label>
                  <div className="flex items-center rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-2 text-xs text-gray-400">/</span>
                    <input
                      value={draftSlug}
                      onChange={(event) => setDraftSlug(event.target.value)}
                      className="flex-1 rounded-md bg-transparent px-2 py-2 text-sm focus:outline-none"
                      placeholder="home"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Slugs must be URL friendly. Duplicates are auto-adjusted.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActionsOpen(false)}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>

              <div className="mt-3 border-t border-gray-200">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDuplicatePage(currentPage.id);
                    setActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Duplicate page
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeletePage(currentPage.id, currentPage.title);
                    setActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Delete page
                </button>
              </div>
            </div>
          )}
        </div>

        {pages.length === 0 && (
          <div className="text-sm text-gray-500">No pages yet</div>
        )}
      </div>

      <button
        onClick={handleAddPage}
        className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        + Add Page
      </button>
    </div>
  );
}
