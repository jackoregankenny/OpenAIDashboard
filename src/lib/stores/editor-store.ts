import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PageNode } from '../page-structure/types';
import {
  updateNodeInTree,
  deleteNodeFromTree,
  addChildToNode,
  moveNode,
  generateNodeId,
  createPageNode,
} from '../page-structure/types';

const MAX_HISTORY_LENGTH = 50;
const DEFAULT_PAGE_TITLE = 'Home';

/**
 * Page metadata for multi-page support
 */
export interface PageMetadata {
  id: string;
  title: string;
  slug: string;
  description?: string;
  pageTree: PageNode;
  createdAt: string;
  updatedAt: string;
}

interface TreeUpdateOptions {
  recordHistory?: boolean;
  selectedNodeId?: string | null;
}

/**
 * Editor state interface
 */
interface EditorState {
  // Multi-page support
  pages: PageMetadata[];
  currentPageId: string | null;
  pageHistories: Record<string, PageNode[]>;
  pageHistoryIndex: Record<string, number>;

  // Current page tree (computed from current page)
  pageTree: PageNode | null;

  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  // History for undo/redo (current page convenience access)
  history: PageNode[];
  historyIndex: number;
  maxHistoryLength: number;

  // UI state
  isPreviewMode: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Initialization
  hydratePages: (pages: PageMetadata[], currentPageId?: string | null) => void;
  initializeWithDemo: () => void;

  // Page Management Actions
  createPage: (title?: string, slug?: string) => string; // Returns new page ID
  deletePage: (pageId: string) => void;
  switchToPage: (pageId: string) => void;
  updatePageMetadata: (
    pageId: string,
    updates: Partial<Omit<PageMetadata, 'id' | 'pageTree'>>
  ) => void;
  duplicatePage: (pageId: string) => string; // Returns new page ID

  // Actions
  setPageTree: (tree: PageNode, options?: TreeUpdateOptions) => void;
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;

  // Tree manipulation
  updateNode: (nodeId: string, updates: Partial<PageNode>) => void;
  deleteNode: (nodeId: string) => void;
  addChild: (parentId: string, child: PageNode) => void;
  moveNodeTo: (nodeId: string, newParentId: string, newIndex: number) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;

  // UI
  togglePreviewMode: () => void;
  setSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;

  // Reset
  reset: () => void;
}

function createInitialDataState() {
  return {
    pages: [] as PageMetadata[],
    currentPageId: null as string | null,
    pageHistories: {} as Record<string, PageNode[]>,
    pageHistoryIndex: {} as Record<string, number>,
    pageTree: null as PageNode | null,
    selectedNodeId: null as string | null,
    hoveredNodeId: null as string | null,
    history: [] as PageNode[],
    historyIndex: -1,
    maxHistoryLength: MAX_HISTORY_LENGTH,
    isPreviewMode: false,
    isSaving: false,
    lastSaved: null as Date | null,
  };
}

function createBlankPageTree(): PageNode {
  const page = createPageNode('page');
  const section = createPageNode('section');
  page.children = [section];
  return page;
}

function createDemoPageTree(): PageNode {
  const page = createPageNode('page');
  const section = createPageNode('section');

  const heroNode = createPageNode('component', 'hero-basic', {
    title: 'Welcome to Our School',
    subtitle: 'Excellence in Education',
    description: 'Empowering students to reach their full potential',
    primaryCtaText: 'Explore Programs',
    variant: 'gradient',
  });

  const contentNode = createPageNode('component', 'content-section', {
    heading: 'About Us',
    content: 'We are committed to providing excellent education.',
    alignment: 'center',
  });

  section.children = [heroNode, contentNode];
  page.children = [section];

  return page;
}

function cloneTreeWithNewIds(node: PageNode): PageNode {
  return {
    ...node,
    id: generateNodeId(),
    props: node.props ? { ...node.props } : undefined,
    metadata: { ...node.metadata },
    children: node.children?.map((child) => cloneTreeWithNewIds(child)),
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/-{2,}/g, '-')
    || 'page';
}

function ensureUniqueSlug(
  baseSlug: string,
  pages: PageMetadata[],
  ignorePageId?: string
): string {
  const existing = new Set(
    pages
      .filter((page) => page.id !== ignorePageId)
      .map((page) => page.slug)
  );

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;
  while (existing.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

function applyTreeUpdate(
  state: EditorState,
  pageId: string,
  tree: PageNode,
  options: TreeUpdateOptions = {}
) {
  const { recordHistory = true, selectedNodeId } = options;
  const now = new Date().toISOString();

  const pages = state.pages.map((page) =>
    page.id === pageId
      ? {
          ...page,
          pageTree: tree,
          updatedAt: now,
        }
      : page
  );

  let history = state.pageHistories[pageId] ?? [];
  let historyIndex = state.pageHistoryIndex[pageId] ?? -1;

  if (recordHistory) {
    history = history.slice(0, historyIndex + 1);
    history.push(tree);

    if (history.length > state.maxHistoryLength) {
      history = history.slice(history.length - state.maxHistoryLength);
    }

    historyIndex = history.length - 1;
  } else {
    if (!history.length) {
      history = [tree];
      historyIndex = 0;
    } else if (historyIndex < 0) {
      historyIndex = history.length - 1;
    }
  }

  return {
    pages,
    pageTree: tree,
    selectedNodeId: selectedNodeId ?? state.selectedNodeId,
    pageHistories: {
      ...state.pageHistories,
      [pageId]: history,
    },
    pageHistoryIndex: {
      ...state.pageHistoryIndex,
      [pageId]: historyIndex,
    },
    history,
    historyIndex,
  } satisfies Partial<EditorState>;
}

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    ...createInitialDataState(),

    hydratePages: (pages, currentPageId = null) => {
      set(() => {
        if (!pages.length) {
          return createInitialDataState();
        }

        const validCurrentId =
          currentPageId && pages.some((page) => page.id === currentPageId)
            ? currentPageId
            : pages[0].id;

        const histories = pages.reduce((acc, page) => {
          acc[page.id] = [page.pageTree];
          return acc;
        }, {} as Record<string, PageNode[]>);

        const historyIndex = pages.reduce((acc, page) => {
          acc[page.id] = 0;
          return acc;
        }, {} as Record<string, number>);

        const currentPage = pages.find((page) => page.id === validCurrentId)!;

        return {
          pages,
          currentPageId: validCurrentId,
          pageHistories: histories,
          pageHistoryIndex: historyIndex,
          pageTree: currentPage.pageTree,
          selectedNodeId: currentPage.pageTree.id,
          hoveredNodeId: null,
          history: histories[validCurrentId],
          historyIndex: 0,
          isPreviewMode: false,
          isSaving: false,
          lastSaved: null,
        } satisfies Partial<EditorState>;
      });
    },

    initializeWithDemo: () => {
      const demoTree = createDemoPageTree();
      const now = new Date().toISOString();
      const pageId = generateNodeId();

      const page: PageMetadata = {
        id: pageId,
        title: DEFAULT_PAGE_TITLE,
        slug: 'home',
        description: 'Primary landing page',
        pageTree: demoTree,
        createdAt: now,
        updatedAt: now,
      };

      set(() => ({
        pages: [page],
        currentPageId: pageId,
        pageHistories: { [pageId]: [demoTree] },
        pageHistoryIndex: { [pageId]: 0 },
        pageTree: demoTree,
        selectedNodeId: demoTree.id,
        hoveredNodeId: null,
        history: [demoTree],
        historyIndex: 0,
        isPreviewMode: false,
        isSaving: false,
        lastSaved: null,
      } satisfies Partial<EditorState>));
    },

    createPage: (title, slug) => {
      const pageId = generateNodeId();
      const now = new Date().toISOString();
      const state = get();
      const name = title?.trim() || `Page ${state.pages.length + 1}`;
      const baseSlug = slug?.trim() || slugify(name);
      const uniqueSlug = ensureUniqueSlug(baseSlug, state.pages);
      const pageTree = createBlankPageTree();

      const newPage: PageMetadata = {
        id: pageId,
        title: name,
        slug: uniqueSlug,
        description: '',
        pageTree,
        createdAt: now,
        updatedAt: now,
      };

      set((current) => ({
        pages: [...current.pages, newPage],
        currentPageId: pageId,
        pageHistories: { ...current.pageHistories, [pageId]: [pageTree] },
        pageHistoryIndex: { ...current.pageHistoryIndex, [pageId]: 0 },
        pageTree,
        selectedNodeId: pageTree.id,
        hoveredNodeId: null,
        history: [pageTree],
        historyIndex: 0,
      } satisfies Partial<EditorState>));

      return pageId;
    },

    deletePage: (pageId) => {
      set((state) => {
        if (!state.pages.some((page) => page.id === pageId)) {
          return {};
        }

        const remainingPages = state.pages.filter((page) => page.id !== pageId);
        const { [pageId]: _history, ...remainingHistories } = state.pageHistories;
        const { [pageId]: _index, ...remainingIndexes } = state.pageHistoryIndex;

        if (!remainingPages.length) {
          return {
            ...createInitialDataState(),
          } satisfies Partial<EditorState>;
        }

        const newCurrentId =
          state.currentPageId && state.currentPageId !== pageId
            ? state.currentPageId
            : remainingPages[0].id;

        const currentPage = remainingPages.find((page) => page.id === newCurrentId)!;
        const history = remainingHistories[newCurrentId] ?? [currentPage.pageTree];
        const historyIdx = remainingIndexes[newCurrentId] ?? Math.max(history.length - 1, 0);

        return {
          pages: remainingPages,
          currentPageId: newCurrentId,
          pageHistories: {
            ...remainingHistories,
            [newCurrentId]: history,
          },
          pageHistoryIndex: {
            ...remainingIndexes,
            [newCurrentId]: historyIdx,
          },
          pageTree: currentPage.pageTree,
          selectedNodeId: currentPage.pageTree.id,
          hoveredNodeId: null,
          history,
          historyIndex: historyIdx,
        } satisfies Partial<EditorState>;
      });
    },

    switchToPage: (pageId) => {
      set((state) => {
        if (state.currentPageId === pageId) {
          return {};
        }

        const page = state.pages.find((p) => p.id === pageId);
        if (!page) {
          return {};
        }

        const history = state.pageHistories[pageId] ?? [page.pageTree];
        const historyIdx = state.pageHistoryIndex[pageId] ?? Math.max(history.length - 1, 0);

        return {
          currentPageId: pageId,
          pageHistories: {
            ...state.pageHistories,
            [pageId]: history,
          },
          pageHistoryIndex: {
            ...state.pageHistoryIndex,
            [pageId]: historyIdx,
          },
          pageTree: page.pageTree,
          selectedNodeId: page.pageTree.id,
          hoveredNodeId: null,
          history,
          historyIndex: historyIdx,
        } satisfies Partial<EditorState>;
      });
    },

    updatePageMetadata: (pageId, updates) => {
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) {
          return {};
        }

        const nextTitle = updates.title?.trim();
        let nextSlug = updates.slug?.trim();

        if (!nextSlug && nextTitle) {
          nextSlug = slugify(nextTitle);
        }

        const finalSlug = nextSlug
          ? ensureUniqueSlug(nextSlug, state.pages, pageId)
          : page.slug;

        const updatedPage: PageMetadata = {
          ...page,
          ...updates,
          ...(nextTitle ? { title: nextTitle } : {}),
          slug: finalSlug,
          updatedAt: new Date().toISOString(),
        };

        return {
          pages: state.pages.map((p) => (p.id === pageId ? updatedPage : p)),
        } satisfies Partial<EditorState>;
      });
    },

    duplicatePage: (pageId) => {
      const state = get();
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) {
        return pageId;
      }

      const duplicateTree = cloneTreeWithNewIds(page.pageTree);
      const now = new Date().toISOString();
      const newPageId = generateNodeId();
      const title = `${page.title} Copy`;
      const baseSlug = `${page.slug}-copy`;
      const uniqueSlug = ensureUniqueSlug(baseSlug, state.pages);

      const duplicatePage: PageMetadata = {
        id: newPageId,
        title,
        slug: uniqueSlug,
        description: page.description,
        pageTree: duplicateTree,
        createdAt: now,
        updatedAt: now,
      };

      set((current) => ({
        pages: [...current.pages, duplicatePage],
        currentPageId: newPageId,
        pageHistories: {
          ...current.pageHistories,
          [newPageId]: [duplicateTree],
        },
        pageHistoryIndex: {
          ...current.pageHistoryIndex,
          [newPageId]: 0,
        },
        pageTree: duplicateTree,
        selectedNodeId: duplicateTree.id,
        hoveredNodeId: null,
        history: [duplicateTree],
        historyIndex: 0,
      } satisfies Partial<EditorState>));

      return newPageId;
    },

    setPageTree: (tree, options = {}) => {
      set((state) => {
        if (!state.currentPageId) {
          return {
            pageTree: tree,
            history: options.recordHistory === false ? state.history : [tree],
            historyIndex: options.recordHistory === false ? state.historyIndex : 0,
          } satisfies Partial<EditorState>;
        }

        return applyTreeUpdate(state, state.currentPageId, tree, options);
      });
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    hoverNode: (id) => set({ hoveredNodeId: id }),

    updateNode: (nodeId, updates) => {
      set((state) => {
        if (!state.pageTree || !state.currentPageId) return {};
        const updatedTree = updateNodeInTree(state.pageTree, nodeId, updates);
        return applyTreeUpdate(state, state.currentPageId, updatedTree);
      });
    },

    deleteNode: (nodeId) => {
      set((state) => {
        if (!state.pageTree || !state.currentPageId) return {};

        const updatedTree = deleteNodeFromTree(state.pageTree, nodeId);
        const selectedNodeId =
          state.selectedNodeId === nodeId ? updatedTree.id : state.selectedNodeId;

        return applyTreeUpdate(state, state.currentPageId, updatedTree, {
          selectedNodeId,
        });
      });
    },

    addChild: (parentId, child) => {
      set((state) => {
        if (!state.pageTree || !state.currentPageId) return {};
        const updatedTree = addChildToNode(state.pageTree, parentId, child);
        return applyTreeUpdate(state, state.currentPageId, updatedTree, {
          selectedNodeId: child.id,
        });
      });
    },

    moveNodeTo: (nodeId, newParentId, newIndex) => {
      set((state) => {
        if (!state.pageTree || !state.currentPageId) return {};
        const updatedTree = moveNode(
          state.pageTree,
          nodeId,
          newParentId,
          newIndex
        );
        return applyTreeUpdate(state, state.currentPageId, updatedTree);
      });
    },

    saveToHistory: () => {
      set((state) => {
        if (!state.pageTree || !state.currentPageId) return {};
        return applyTreeUpdate(state, state.currentPageId, state.pageTree);
      });
    },

    undo: () => {
      set((state) => {
        const pageId = state.currentPageId;
        if (!pageId) return {};

        const history = state.pageHistories[pageId] ?? [];
        const historyIdx = state.pageHistoryIndex[pageId] ?? history.length - 1;
        if (historyIdx <= 0) return {};

        const newIndex = historyIdx - 1;
        const tree = history[newIndex];

        const pages = state.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                pageTree: tree,
                updatedAt: new Date().toISOString(),
              }
            : page
        );

        return {
          pages,
          pageTree: tree,
          selectedNodeId: tree.id,
          hoveredNodeId: null,
          history,
          historyIndex: newIndex,
          pageHistoryIndex: {
            ...state.pageHistoryIndex,
            [pageId]: newIndex,
          },
        } satisfies Partial<EditorState>;
      });
    },

    redo: () => {
      set((state) => {
        const pageId = state.currentPageId;
        if (!pageId) return {};

        const history = state.pageHistories[pageId] ?? [];
        const historyIdx = state.pageHistoryIndex[pageId] ?? history.length - 1;
        if (historyIdx >= history.length - 1) return {};

        const newIndex = historyIdx + 1;
        const tree = history[newIndex];

        const pages = state.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                pageTree: tree,
                updatedAt: new Date().toISOString(),
              }
            : page
        );

        return {
          pages,
          pageTree: tree,
          selectedNodeId: tree.id,
          hoveredNodeId: null,
          history,
          historyIndex: newIndex,
          pageHistoryIndex: {
            ...state.pageHistoryIndex,
            [pageId]: newIndex,
          },
        } satisfies Partial<EditorState>;
      });
    },

    canUndo: () => {
      const state = get();
      const pageId = state.currentPageId;
      if (!pageId) return false;
      const historyIdx = state.pageHistoryIndex[pageId] ?? 0;
      return historyIdx > 0;
    },

    canRedo: () => {
      const state = get();
      const pageId = state.currentPageId;
      if (!pageId) return false;
      const history = state.pageHistories[pageId] ?? [];
      const historyIdx = state.pageHistoryIndex[pageId] ?? history.length - 1;
      return historyIdx < history.length - 1;
    },

    togglePreviewMode: () =>
      set((state) => ({ isPreviewMode: !state.isPreviewMode })),

    setSaving: (isSaving) => set({ isSaving }),

    setLastSaved: (date) => set({ lastSaved: date }),

    reset: () => set(createInitialDataState()),
  }))
);

/**
 * Selector hooks for optimized re-renders
 */
export const useSelectedNode = () =>
  useEditorStore((state) => state.selectedNodeId);

export const useHoveredNode = () =>
  useEditorStore((state) => state.hoveredNodeId);

export const usePageTree = () => useEditorStore((state) => state.pageTree);

export const useIsPreviewMode = () =>
  useEditorStore((state) => state.isPreviewMode);

export const useCanUndo = () => useEditorStore((state) => state.canUndo());

export const useCanRedo = () => useEditorStore((state) => state.canRedo());
