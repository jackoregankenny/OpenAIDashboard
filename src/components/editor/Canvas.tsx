'use client';

import { useEditorStore, usePageTree } from '@/lib/stores/editor-store';
import { getWidget } from '@/lib/registry/generated';
import type { PageNode } from '@/lib/page-structure/types';
import { reorderSiblings } from '@/lib/page-structure/types';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface CanvasProps {
  initialPageTree?: PageNode;
}

/**
 * Sortable node wrapper with drag physics
 */
function SortableNode({ node }: { node: PageNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: node.id });

  // Apply squish/stretch physics during drag
  const scale = isDragging ? 0.95 : 1;
  const transformValue = transform ? {
    ...transform,
    scaleX: scale,
    scaleY: scale,
  } : null;

  const style = {
    transform: CSS.Transform.toString(transformValue),
    transition: isDragging ? transition : 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <RenderNode node={node} dragHandleProps={listeners} />
    </div>
  );
}

/**
 * Renders the page tree recursively
 */
function RenderNode({
  node,
  dragHandleProps,
}: {
  node: PageNode;
  dragHandleProps?: any;
}) {
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const hoveredNodeId = useEditorStore((state) => state.hoveredNodeId);
  const selectNode = useEditorStore((state) => state.selectNode);
  const hoverNode = useEditorStore((state) => state.hoverNode);
  const deleteNode = useEditorStore((state) => state.deleteNode);

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;

  // If this is a component node, render the actual component
  if (node.type === 'component' && node.componentId) {
    const widget = getWidget(node.componentId);

    if (!widget) {
      return (
        <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700">
          Component not found: {node.componentId}
        </div>
      );
    }

    const Component = widget.component;

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectNode(node.id);

      // Simple confirm dialog for now (can be replaced with custom menu)
      const action = window.confirm('Delete this component?');
      if (action) {
        deleteNode(node.id);
      }
    };

    return (
      <div
        data-editor-node-id={node.id}
        className={`relative group transition-all ${
          isSelected ? 'ring-4 ring-blue-500' : ''
        } ${isHovered ? 'ring-2 ring-blue-300' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={(e) => {
          e.stopPropagation();
          hoverNode(node.id);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          hoverNode(null);
        }}
      >
        {/* Drag Handle - Only visible on hover or select */}
        {(isSelected || isHovered) && (
          <div
            className="absolute -left-8 top-2 bg-gray-700 text-white p-2 rounded-lg cursor-grab active:cursor-grabbing z-20 hover:bg-gray-800 transition-colors shadow-lg"
            {...dragHandleProps}
            title="Drag to reorder"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3h2v2H5V3zm4 0h2v2H9V3zM5 7h2v2H5V7zm4 0h2v2H9V7zm-4 4h2v2H5v-2zm4 0h2v2H9v-2z"/>
            </svg>
          </div>
        )}

        {/* Component Label */}
        {isSelected && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-3 py-1.5 z-10 rounded-br-lg font-medium flex items-center gap-2">
            <span>🔷 {widget.config.name}</span>
            <span className="text-blue-200 text-[10px]">Right-click to delete</span>
          </div>
        )}

        <Component props={node.props || {}} />
      </div>
    );
  }

  // For section or page nodes, render children with sortable context
  const childIds = node.children?.map((child) => child.id) || [];

  return (
    <div
      data-editor-node-id={node.id}
      className={`relative ${node.type === 'section' ? 'border-2 border-dashed border-gray-300 min-h-[100px] p-4' : ''} ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      } ${isHovered ? 'ring-2 ring-blue-300' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(node.id);
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        hoverNode(node.id);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        hoverNode(null);
      }}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 z-10">
          {node.type.toUpperCase()}
        </div>
      )}

      {node.children && node.children.length > 0 ? (
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          {node.children.map((child) => (
            <SortableNode key={child.id} node={child} />
          ))}
        </SortableContext>
      ) : (
        node.type === 'section' && (
          <div className="text-gray-400 text-center py-8">
            Empty section - Drop components here
          </div>
        )
      )}
    </div>
  );
}

/**
 * Main canvas component for the editor
 */
export function Canvas({ initialPageTree }: CanvasProps) {
  const pageTree = usePageTree();
  const setPageTree = useEditorStore((state) => state.setPageTree);
  const selectNode = useEditorStore((state) => state.selectNode);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePointerDownCapture = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (!target.closest('[data-editor-node-id]')) {
      selectNode(null);
    }
  };

  // Initialize page tree if provided
  if (initialPageTree && !pageTree) {
    setPageTree(initialPageTree);
  }

  // Drag sensors - require minimum distance to prevent conflict with click
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id || !pageTree) {
      return;
    }

    // Reorder nodes using the helper function
    const newTree = reorderSiblings(pageTree, active.id as string, over.id as string);

    setPageTree(newTree);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the background
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  if (!pageTree) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Page Loaded</h2>
          <p className="text-gray-500">Create a new page or load an existing one</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="h-full overflow-auto bg-white"
        onPointerDownCapture={handlePointerDownCapture}
        onClick={handleBackgroundClick}
      >
        {/* Add left padding for drag handles */}
        <div className="max-w-7xl mx-auto pl-12 pr-4 py-8 min-h-full">
          <RenderNode node={pageTree} />
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl scale-95 opacity-90 font-medium">
            ✋ Dragging component...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
