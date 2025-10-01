import { z } from 'zod';

/**
 * Page node types
 */
export const pageNodeTypeSchema = z.enum(['page', 'section', 'component']);

export type PageNodeType = z.infer<typeof pageNodeTypeSchema>;

/**
 * Metadata for each node
 */
export const pageNodeMetadataSchema = z.object({
  order: z.number(),
  locked: z.boolean().default(false),
  hidden: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PageNodeMetadata = z.infer<typeof pageNodeMetadataSchema>;

/**
 * Base page node (recursive structure)
 */
export const pageNodeSchema: z.ZodType<PageNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: pageNodeTypeSchema,
    componentId: z.string().optional(), // References widget registry
    props: z.record(z.string(), z.any()).optional(), // Component props
    children: z.array(pageNodeSchema).optional(), // Nested children
    metadata: pageNodeMetadataSchema,
  })
);

export type PageNode = {
  id: string;
  type: PageNodeType;
  componentId?: string;
  props?: Record<string, any>;
  children?: PageNode[];
  metadata: PageNodeMetadata;
};

/**
 * Complete page structure
 */
export const pageStructureSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  pageTree: pageNodeSchema,
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string().optional(),
    version: z.number().default(1),
  }),
});

export type PageStructure = z.infer<typeof pageStructureSchema>;

/**
 * Helper function to generate unique node IDs
 */
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper function to create a new page node
 */
export function createPageNode(
  type: PageNodeType,
  componentId?: string,
  props?: Record<string, any>
): PageNode {
  return {
    id: generateNodeId(),
    type,
    componentId,
    props: props || {},
    children: type === 'component' ? undefined : [],
    metadata: {
      order: 0,
      locked: false,
      hidden: false,
    },
  };
}

/**
 * Helper function to create an empty page structure
 */
export function createEmptyPage(
  siteId: string,
  slug: string,
  title: string
): PageStructure {
  return {
    id: generateNodeId(),
    siteId,
    slug,
    title,
    pageTree: createPageNode('page'),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  };
}

/**
 * Find a node in the tree by ID
 */
export function findNodeById(
  tree: PageNode,
  targetId: string
): PageNode | null {
  if (tree.id === targetId) return tree;

  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find the parent node for a given child ID
 */
export function findParentNode(
  tree: PageNode,
  childId: string
): PageNode | null {
  if (!tree.children) {
    return null;
  }

  for (const child of tree.children) {
    if (child.id === childId) {
      return tree;
    }

    const found = findParentNode(child, childId);
    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Update a node in the tree
 */
export function updateNodeInTree(
  tree: PageNode,
  nodeId: string,
  updates: Partial<PageNode>
): PageNode {
  if (tree.id === nodeId) {
    return { ...tree, ...updates };
  }

  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map((child) =>
        updateNodeInTree(child, nodeId, updates)
      ),
    };
  }

  return tree;
}

/**
 * Delete a node from the tree
 */
export function deleteNodeFromTree(tree: PageNode, nodeId: string): PageNode {
  if (tree.children) {
    return {
      ...tree,
      children: tree.children
        .filter((child) => child.id !== nodeId)
        .map((child) => deleteNodeFromTree(child, nodeId)),
    };
  }

  return tree;
}

/**
 * Add a child node to a parent in the tree
 */
export function addChildToNode(
  tree: PageNode,
  parentId: string,
  newChild: PageNode
): PageNode {
  if (tree.id === parentId) {
    const children = tree.children || [];
    return {
      ...tree,
      children: [...children, newChild],
    };
  }

  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map((child) =>
        addChildToNode(child, parentId, newChild)
      ),
    };
  }

  return tree;
}

/**
 * Move a node within the tree (for drag-drop)
 */
export function moveNode(
  tree: PageNode,
  nodeId: string,
  newParentId: string,
  newIndex: number
): PageNode {
  // Find and remove the node
  const nodeToMove = findNodeById(tree, nodeId);
  if (!nodeToMove) return tree;

  let treeWithoutNode = deleteNodeFromTree(tree, nodeId);

  // Find the new parent and insert at the specified index
  function insertAtIndex(
    node: PageNode,
    parentId: string,
    childToInsert: PageNode,
    index: number
  ): PageNode {
    if (node.id === parentId) {
      const children = node.children || [];
      const newChildren = [...children];
      newChildren.splice(index, 0, childToInsert);

      return {
        ...node,
        children: newChildren,
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          insertAtIndex(child, parentId, childToInsert, index)
        ),
      };
    }

    return node;
  }

  return insertAtIndex(treeWithoutNode, newParentId, nodeToMove, newIndex);
}

/**
 * Reorder siblings within the same parent (simpler for drag-drop)
 */
export function reorderSiblings(
  tree: PageNode,
  activeId: string,
  overId: string
): PageNode {
  // Find the parent of both nodes
  function findParent(node: PageNode, childId: string): PageNode | null {
    if (node.children?.some(child => child.id === childId)) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = findParent(child, childId);
        if (found) return found;
      }
    }

    return null;
  }

  const activeParent = findParent(tree, activeId);
  const overParent = findParent(tree, overId);

  // Only reorder if they share the same parent
  if (!activeParent || !overParent || activeParent.id !== overParent.id) {
    return tree;
  }

  // Reorder children within the parent
  function reorderChildren(node: PageNode): PageNode {
    if (node.id === activeParent.id && node.children) {
      const children = [...node.children];
      const activeIndex = children.findIndex(c => c.id === activeId);
      const overIndex = children.findIndex(c => c.id === overId);

      if (activeIndex === -1 || overIndex === -1) return node;

      // Remove and reinsert at new position
      const [removed] = children.splice(activeIndex, 1);
      children.splice(overIndex, 0, removed);

      return {
        ...node,
        children,
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(reorderChildren),
      };
    }

    return node;
  }

  return reorderChildren(tree);
}

/**
 * Flatten the tree into a list (for rendering)
 */
export function flattenTree(tree: PageNode): PageNode[] {
  const result: PageNode[] = [tree];

  if (tree.children) {
    tree.children.forEach((child) => {
      result.push(...flattenTree(child));
    });
  }

  return result;
}

/**
 * Get all component IDs used in the tree
 */
export function getUsedComponentIds(tree: PageNode): string[] {
  const ids: string[] = [];

  if (tree.componentId) {
    ids.push(tree.componentId);
  }

  if (tree.children) {
    tree.children.forEach((child) => {
      ids.push(...getUsedComponentIds(child));
    });
  }

  return ids;
}
