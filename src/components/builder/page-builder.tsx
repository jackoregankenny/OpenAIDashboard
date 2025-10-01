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
import { Save, Eye, Plus, ArrowLeft, Settings as SettingsIcon, Palette, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeCustomizer } from '@/components/theme-customizer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Page {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  isPublished: boolean;
}

interface Site {
  id: string;
  name: string;
  domain: string;
}

interface PageBuilderProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  page?: Page;
  site?: Site;
  allPages?: Page[];
  onPublish?: () => void;
  onPageChange?: (pageId: string) => void;
  onBackToAdmin?: () => void;
}

export function PageBuilder({ 
  initialBlocks = [], 
  onSave,
  page,
  site,
  allPages = [],
  onPublish,
  onPageChange,
  onBackToAdmin,
}: PageBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

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
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-background sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToAdmin}
            className="h-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{site?.name}</span>
            <span className="text-xs text-muted-foreground">•</span>
            
            {/* Page Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <span className="text-xs">{page?.title}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {allPages.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => onPageChange?.(p.id)}
                    className={p.id === page?.id ? 'bg-muted' : ''}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs">{p.title}</span>
                      {p.isPublished && (
                        <Eye className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemePanel(true)}
            className="h-8"
          >
            <Palette className="w-3.5 h-3.5 mr-1.5" />
            Theme
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettingsPanel(true)}
            className="h-8"
          >
            <SettingsIcon className="w-3.5 h-3.5 mr-1.5" />
            Settings
          </Button>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          <Button variant="outline" size="sm" className="h-8">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
          
          <Button 
            size="sm" 
            onClick={onPublish}
            variant={page?.isPublished ? 'outline' : 'default'}
            className="h-8"
          >
            {page?.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
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
        <div 
          className="flex-1 overflow-y-auto bg-muted/30"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('blockType') as BlockType;
            if (blockType) {
              handleAddBlock(blockType);
            }
          }}
        >
          <div className="p-6 max-w-5xl mx-auto">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-background">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Drag blocks here to start building
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Or select a block from the left panel
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

      {/* Theme Panel */}
      <Sheet open={showThemePanel} onOpenChange={setShowThemePanel}>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Theme Settings</SheetTitle>
            <SheetDescription>
              Customize your site's appearance
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            {site && <ThemeCustomizer siteId={site.id} />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Settings Panel */}
      <Sheet open={showSettingsPanel} onOpenChange={setShowSettingsPanel}>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Page Settings</SheetTitle>
            <SheetDescription>
              Configure this page
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium">Page Title</label>
              <p className="text-sm mt-1">{page?.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium">URL Slug</label>
              <p className="text-sm mt-1">/{page?.slug}</p>
            </div>
            <div>
              <label className="text-xs font-medium">Status</label>
              <p className="text-sm mt-1">
                {page?.isPublished ? (
                  <span className="text-green-600">Published</span>
                ) : (
                  <span className="text-muted-foreground">Draft</span>
                )}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

