'use client';

import { useState } from 'react';
import { getAllBlockDefinitions, getBlocksByCategory } from '@/lib/blocks/registry';
import { BlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BlockRenderer } from '@/components/block-renderer';

interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const [previewBlock, setPreviewBlock] = useState<{ type: BlockType; definition: any } | null>(null);
  
  const categories = ['content', 'media', 'people', 'interactive'] as const;

  return (
    <>
      <div className="space-y-1">
        {categories.map((category) => {
          const blocks = getBlocksByCategory(category);
          if (blocks.length === 0) return null;

          return (
            <div key={category} className="space-y-0.5">
              <div className="px-2 py-1.5">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
              </div>
              {blocks.map((block) => (
                <div key={block.type} className="group">
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-2 px-2 hover:bg-muted"
                    onClick={() => onAddBlock(block.type)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Plus className="w-3 h-3" />
                      </div>
                      <span className="text-xs truncate text-left">{block.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewBlock({ type: block.type, definition: block });
                      }}
                      title="Preview"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewBlock} onOpenChange={() => setPreviewBlock(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewBlock?.definition.name}</DialogTitle>
            <DialogDescription>
              {previewBlock?.definition.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border rounded-lg overflow-hidden bg-background">
            {previewBlock && (
              <BlockRenderer
                block={{
                  id: 'preview',
                  type: previewBlock.type,
                  props: previewBlock.definition.defaultProps,
                }}
              />
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1"
              onClick={() => {
                if (previewBlock) {
                  onAddBlock(previewBlock.type);
                  setPreviewBlock(null);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Page
            </Button>
            <Button variant="outline" onClick={() => setPreviewBlock(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
