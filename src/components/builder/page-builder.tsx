'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
import { BlockPickerModal } from './block-picker-modal';
import { getBlockDefinition } from '@/lib/blocks/registry';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Save, Eye, Plus, ArrowLeft, Settings as SettingsIcon, Palette, ChevronDown, Check, Loader2, ExternalLink, Sparkles } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

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
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedBlocksRef = useRef<string>(JSON.stringify(initialBlocks));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync blocks when page changes (when initialBlocks changes)
  useEffect(() => {
    setBlocks(initialBlocks);
    setSelectedBlockId(null);
    setEditingBlock(null);
    lastSavedBlocksRef.current = JSON.stringify(initialBlocks);
  }, [page?.id]);

  // Auto-save when blocks change
  useEffect(() => {
    const currentBlocks = JSON.stringify(blocks);
    
    // Skip if blocks haven't actually changed
    if (currentBlocks === lastSavedBlocksRef.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set status to saving after a short delay
    setSaveStatus('saving');

    // Debounce save by 1.5 seconds
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (onSave) {
          await onSave(blocks);
          lastSavedBlocksRef.current = currentBlocks;
          setSaveStatus('saved');
          
          // Reset to idle after 2 seconds
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch (error) {
        setSaveStatus('error');
        toast({
          title: 'Save failed',
          description: 'Could not save changes. Please try again.',
          variant: 'destructive',
        });
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [blocks, onSave, toast]);

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

  // Live update for block properties (without closing editor)
  const handleLiveUpdate = useCallback((updatedBlock: Block) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  }, []);

  const handleManualSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      if (onSave) {
        await onSave(blocks);
        lastSavedBlocksRef.current = JSON.stringify(blocks);
        setSaveStatus('saved');
        toast({
          title: 'Saved',
          description: 'All changes have been saved.',
        });
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setSaveStatus('error');
      toast({
        title: 'Save failed',
        description: 'Could not save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishClick = async () => {
    // Save before publishing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    try {
      if (onSave) {
        await onSave(blocks);
        lastSavedBlocksRef.current = JSON.stringify(blocks);
      }
      
      if (onPublish) {
        await onPublish();
        toast({
          title: page?.isPublished ? 'Unpublished' : 'Published',
          description: page?.isPublished 
            ? 'Page is now hidden from public view.' 
            : 'Page is now live and visible to the public.',
        });
      }
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'Could not complete the action. Please try again.',
        variant: 'destructive',
      });
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
          {/* Save Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Saved</span>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-border mx-1" />
          
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
          
          <Button 
            variant="ghost"
            size="sm" 
            onClick={() => {
              if (site && page) {
                window.open(`/sites/${site.domain}/${page.slug}`, '_blank');
              }
            }}
            className="h-8"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualSave}
            disabled={isSaving}
            className="h-8"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            Save
          </Button>
          
          <Button 
            size="sm" 
            onClick={handlePublishClick}
            variant={page?.isPublished ? 'outline' : 'default'}
            className="h-8"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {page?.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center - Canvas */}
        <div 
          className="flex-1 overflow-y-auto bg-muted/30"
        >
          <div className="p-6 max-w-5xl mx-auto">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[600px] border-2 border-dashed rounded-xl bg-background/50 backdrop-blur">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Start Building Your Page
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Add your first block to begin. Choose from hero sections, content blocks, 
                    school-specific widgets, and more.
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => setShowBlockPicker(true)}
                    className="gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Block
                  </Button>
                  <div className="mt-6 text-xs text-muted-foreground">
                    💡 Tip: Click on any block after adding it to customize its content
                  </div>
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
            
            {/* Floating Add Block Button */}
            {blocks.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <Button
                  size="lg"
                  onClick={() => setShowBlockPicker(true)}
                  className="shadow-2xl gap-2 px-6 h-14 text-base hover:scale-105 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Add Block
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l overflow-y-auto bg-background/50 backdrop-blur">
          <div className="p-4 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
              {editingBlock ? (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Edit Block</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Auto-saves changes</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBlock(null);
                      setSelectedBlockId(null);
                    }}
                    className="h-8 text-xs"
                  >
                    Done
                  </Button>
                </>
              ) : (
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Properties</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Click block to edit</p>
                </div>
              )}
            </div>
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
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <SettingsIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">No Block Selected</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click any block on the canvas to customize its content, colors, and settings
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
              Customize your site&apos;s appearance
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
      
      {/* Block Picker Modal */}
      <BlockPickerModal
        open={showBlockPicker}
        onOpenChange={setShowBlockPicker}
        onSelectBlock={handleAddBlock}
      />
    </div>
  );
}

