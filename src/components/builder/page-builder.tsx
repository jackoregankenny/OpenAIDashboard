'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block, BlockType } from '@/lib/blocks/types';
import { SortableBlock } from './sortable-block';
import { BlockPalette } from './block-palette';
import { BlockEditor } from './block-editor';
import { getBlockDefinition } from '@/lib/blocks/registry';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Save, Eye, Plus } from 'lucide-react';

interface PageBuilderProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
}

export function PageBuilder({ initialBlocks = [], onSave }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddBlock = (blockType: BlockType) => {
    const definition = getBlockDefinition(blockType);
    if (!definition) return;

    const newBlock: Block = {
      id: nanoid(),
      type: blockType,
      props: { ...definition.defaultProps },
    };

    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setEditingBlock(null);
    }
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setSelectedBlockId(block.id);
  };

  const handleSaveBlock = (updatedBlock: Block) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
    setEditingBlock(null);
  };

  const handleSavePage = () => {
    if (onSave) {
      onSave(blocks);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Block Palette */}
      <div className="w-64 border-r overflow-y-auto bg-background">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-sm font-semibold text-foreground">Add Elements</h2>
        </div>
        <div className="p-3">
          <BlockPalette onAddBlock={handleAddBlock} />
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="border-b bg-background sticky top-0 z-20 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Canvas</h1>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{blocks.length} blocks</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSavePage} className="h-8">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Publish
            </Button>
          </div>
        </div>
        
        <div className="p-6 max-w-5xl mx-auto">
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-background">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Start building
                </p>
                <p className="text-xs text-muted-foreground">
                  Add elements from the left panel
                </p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      onEdit={handleEditBlock}
                      onDelete={handleDeleteBlock}
                      isSelected={selectedBlockId === block.id}
                      onSelect={setSelectedBlockId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <div className="w-80 border-l overflow-y-auto bg-background">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        </div>
        {editingBlock ? (
          <div className="p-4">
            <BlockEditor
              block={editingBlock}
              onSave={handleSaveBlock}
              onCancel={() => {
                setEditingBlock(null);
                setSelectedBlockId(null);
              }}
              onLiveUpdate={handleLiveUpdate}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div>
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground">No element selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select an element to edit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

