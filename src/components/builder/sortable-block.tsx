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
      className={`relative group rounded-lg overflow-hidden transition-all ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-md'
      } ${isDragging ? 'scale-105' : ''}`}
      onClick={() => {
        onSelect(block.id);
        onEdit(block);
      }}
    >
      {/* Control bar - always visible when selected, hover otherwise */}
      <div className={`absolute top-3 right-3 z-20 flex gap-2 transition-all ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 shadow-xl cursor-grab active:cursor-grabbing backdrop-blur-sm bg-background/90 hover:bg-background"
          {...attributes}
          {...listeners}
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 shadow-xl backdrop-blur-sm bg-background/90 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(block);
          }}
          title="Edit block"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-9 w-9 shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete this block?')) {
              onDelete(block.id);
            }
          }}
          title="Delete block"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
      )}

      {/* Block content */}
      <div className="cursor-pointer relative">
        <BlockRenderer block={block} isPreview />
        {/* Hover overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-all ${
          isSelected 
            ? 'bg-primary/5' 
            : 'bg-transparent group-hover:bg-primary/5'
        }`} />
      </div>
    </div>
  );
}

