'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/lib/blocks/types';
import { BlockRenderer } from '@/components/block-renderer';
import { Button } from '@/components/ui/button';
import { GripVertical, Settings, Trash2 } from 'lucide-react';

interface SortableBlockProps {
  block: Block;
  onEdit: (block: Block) => void;
  onDelete: (blockId: string) => void;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
}

export function SortableBlock({ 
  block, 
  onEdit, 
  onDelete, 
  isSelected,
  onSelect 
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => {
        onSelect(block.id);
        onEdit(block);
      }}
    >
      {/* Drag handle and controls overlay */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 shadow-lg cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(block);
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Block content */}
      <div className={`${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} cursor-pointer`}>
        <BlockRenderer block={block} isPreview />
      </div>
    </div>
  );
}

