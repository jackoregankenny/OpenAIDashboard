'use client';

import { getAllBlockDefinitions, getBlocksByCategory } from '@/lib/blocks/registry';
import { BlockType } from '@/lib/blocks/types';
import { Plus } from 'lucide-react';
import { BlockRenderer } from '@/components/block-renderer';

interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const categories = ['content', 'media', 'people', 'interactive'] as const;

  const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('blockType', blockType);
  };

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const blocks = getBlocksByCategory(category);
        if (blocks.length === 0) return null;

        return (
          <div key={category} className="space-y-1">
            <div className="px-2 py-1.5">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
            </div>
            {blocks.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => handleDragStart(e, block.type)}
                className="group cursor-move select-none mb-3"
              >
                {/* Block Header */}
                <div className="px-2 py-1.5 hover:bg-muted rounded-t transition-colors flex items-center gap-2 border-b">
                  <div className="w-5 h-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <Plus className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{block.name}</div>
                    <div className="text-xs text-muted-foreground truncate leading-tight">{block.description}</div>
                  </div>
                </div>

                {/* Mini Preview - Contained and properly sized */}
                <div className="px-2 py-2 bg-muted/30">
                  <div 
                    className="border rounded bg-white overflow-hidden relative"
                    style={{ height: '80px' }}
                  >
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transform: 'scale(0.2)',
                        transformOrigin: 'top left',
                        width: '500%',
                        height: '500%',
                      }}
                    >
                      <BlockRenderer
                        block={{
                          id: `preview-${block.type}`,
                          type: block.type,
                          props: block.defaultProps,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
