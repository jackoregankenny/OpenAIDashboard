'use client';

import { useEditorStore, useCanUndo, useCanRedo } from '@/lib/stores/editor-store';

/**
 * Editor toolbar with undo/redo and other controls
 */
export function Toolbar() {
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const togglePreviewMode = useEditorStore((state) => state.togglePreviewMode);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const pageTree = useEditorStore((state) => state.pageTree);

  const handleDelete = () => {
    if (!selectedNodeId || selectedNodeId === pageTree?.id) {
      alert('Cannot delete root page');
      return;
    }

    if (confirm('Delete this component?')) {
      deleteNode(selectedNodeId);
    }
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold">Site Editor</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>
        </div>

        {/* Delete */}
        {selectedNodeId && selectedNodeId !== pageTree?.id && (
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm font-medium rounded hover:bg-red-50 hover:text-red-600"
            title="Delete selected component"
          >
            🗑️ Delete
          </button>
        )}

        {/* Preview Toggle */}
        <button
          onClick={togglePreviewMode}
          className={`px-4 py-1.5 text-sm font-medium rounded ${
            isPreviewMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {isPreviewMode ? '✏️ Edit' : '👁️ Preview'}
        </button>

        {/* Save - Auto-saves to localStorage */}
        <div className="px-4 py-1.5 text-sm text-gray-600 flex items-center gap-2">
          <span className="text-green-600">✓</span> Auto-saved
        </div>
      </div>
    </div>
  );
}
