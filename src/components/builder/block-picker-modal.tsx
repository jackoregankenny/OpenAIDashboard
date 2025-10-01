'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllBlockDefinitions, BlockDefinition } from '@/lib/blocks/registry';
import { BlockType } from '@/lib/blocks/types';
import { Search, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlockPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlock: (blockType: BlockType) => void;
}

const categoryInfo = {
  hero: { label: 'Hero Sections', icon: '🎯', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  layout: { label: 'Layout', icon: '📐', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  content: { label: 'Content', icon: '📝', color: 'bg-green-100 text-green-700 border-green-200' },
  media: { label: 'Media', icon: '🎨', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  school: { label: 'School', icon: '🏫', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  people: { label: 'People', icon: '👥', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  interactive: { label: 'Interactive', icon: '⚡', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

export function BlockPickerModal({ open, onOpenChange, onSelectBlock }: BlockPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const allBlocks = getAllBlockDefinitions();
  
  // Filter blocks by search and category
  const filteredBlocks = allBlocks.filter((block) => {
    const matchesSearch = 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group blocks by category for "all" view
  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    const category = block.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {} as Record<string, BlockDefinition[]>);
  
  const handleSelectBlock = (blockType: BlockType) => {
    onSelectBlock(blockType);
    onOpenChange(false);
    setSearchQuery('');
    setSelectedCategory('all');
  };
  
  const BlockCard = ({ block }: { block: BlockDefinition }) => {
    const categoryStyle = categoryInfo[block.category as keyof typeof categoryInfo];
    
    return (
      <button
        onClick={() => handleSelectBlock(block.type)}
        className="group relative flex flex-col items-start p-4 rounded-lg border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left bg-card hover:bg-accent/50"
      >
        <div className="flex items-start justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{block.icon}</div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {block.name}
              </h3>
              <Badge variant="outline" className={`text-xs mt-1 ${categoryStyle?.color}`}>
                {categoryStyle?.icon} {categoryStyle?.label}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {block.description}
        </p>
        <div className="absolute inset-0 rounded-lg ring-2 ring-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle className="text-2xl">Add a Block</DialogTitle>
          </div>
          <DialogDescription>
            Choose from our library of professional building blocks
          </DialogDescription>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 overflow-hidden">
          <div className="px-6 py-3 border-b bg-muted/30">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="all" className="text-xs">
                  ✨ All
                </TabsTrigger>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {info.icon} {info.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>
          
          <ScrollArea className="flex-1 px-6 py-4">
            <TabsContent value="all" className="mt-0 space-y-6">
              {Object.entries(groupedBlocks).map(([category, blocks]) => {
                const categoryStyle = categoryInfo[category as keyof typeof categoryInfo];
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{categoryStyle?.icon}</span>
                      <h3 className="font-semibold text-lg">{categoryStyle?.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {blocks.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {blocks.map((block) => (
                        <BlockCard key={block.type} block={block} />
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {filteredBlocks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-muted-foreground">
                    No blocks found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </TabsContent>
            
            {Object.keys(categoryInfo).map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredBlocks
                    .filter((b) => b.category === category)
                    .map((block) => (
                      <BlockCard key={block.type} block={block} />
                    ))}
                </div>
                
                {filteredBlocks.filter((b) => b.category === category).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-muted-foreground">
                      No blocks found in this category
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

