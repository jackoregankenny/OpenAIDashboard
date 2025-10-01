'use client';

import { getAllWidgets } from '@/lib/registry/generated';
import { useEditorStore } from '@/lib/stores/editor-store';
import {
  createPageNode,
  findNodeById,
  findParentNode,
} from '@/lib/page-structure/types';

/**
 * Component palette showing all available components
 */
export function ComponentPalette() {
  const widgets = getAllWidgets();
  const addChild = useEditorStore((state) => state.addChild);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const pageTree = useEditorStore((state) => state.pageTree);
  const selectNode = useEditorStore((state) => state.selectNode);

  const handleAddComponent = (componentId: string) => {
    if (!pageTree) {
      alert('No page loaded');
      return;
    }

    const pageRootId = pageTree.id;
    const candidateTargetId = selectedNodeId || pageRootId;

    const candidateNode = findNodeById(pageTree, candidateTargetId);
    const isContainer = candidateNode && candidateNode.type !== 'component';

    const parentNode =
      candidateNode && !isContainer
        ? findParentNode(pageTree, candidateNode.id)
        : null;

    const resolvedTarget =
      (isContainer ? candidateNode : parentNode) ?? pageTree;

    const targetId =
      resolvedTarget && resolvedTarget.type !== 'component'
        ? resolvedTarget.id
        : pageRootId;

    const newNode = createPageNode('component', componentId);
    addChild(targetId, newNode);
    selectNode(newNode.id);
  };

  // Group widgets by category
  const widgetsByCategory = widgets.reduce((acc, widget) => {
    const category = widget.config.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(widget);
    return acc;
  }, {} as Record<string, typeof widgets>);

  return (
    <div className="h-full bg-gray-50 border-r overflow-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Components</h2>

        {Object.entries(widgetsByCategory).map(([category, categoryWidgets]) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              {category}
            </h3>

            <div className="space-y-2">
              {categoryWidgets.map((widget) => (
                <button
                  key={widget.config.id}
                  onClick={() => handleAddComponent(widget.config.id)}
                  className="w-full text-left p-3 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                      <span className="text-blue-600 font-semibold text-sm group-hover:text-white">
                        {widget.config.icon.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{widget.config.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {widget.config.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
