import type { PageNode } from '../page-structure/types';
import { getWidget } from '../registry/generated';

interface PageRendererProps {
  pageTree: PageNode;
  className?: string;
}

/**
 * Recursively render a page node and its children
 * This is the clean rendering engine for published sites (no editor UI)
 */
function RenderNode({ node }: { node: PageNode }) {
  // Render component nodes
  if (node.type === 'component' && node.componentId) {
    const widget = getWidget(node.componentId);

    if (!widget) {
      // In production, skip missing components silently
      if (process.env.NODE_ENV === 'production') {
        return null;
      }

      // In development, show an error
      return (
        <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700">
          Component not found: {node.componentId}
        </div>
      );
    }

    const Component = widget.component;
    return <Component props={node.props || {}} />;
  }

  // Render section/page nodes with children
  if (node.children && node.children.length > 0) {
    return (
      <>
        {node.children.map((child) => (
          <RenderNode key={child.id} node={child} />
        ))}
      </>
    );
  }

  // Empty nodes render nothing
  return null;
}

/**
 * Main page renderer component
 * Used for both preview and published sites
 */
export function PageRenderer({ pageTree, className }: PageRendererProps) {
  return (
    <div className={className}>
      <RenderNode node={pageTree} />
    </div>
  );
}
