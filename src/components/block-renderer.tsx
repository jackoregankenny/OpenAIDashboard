'use client';

import { Block } from '@/lib/blocks/types';
import { getBlockDefinition } from '@/lib/blocks/registry';
import '@/components/blocks'; // Import to register components

interface BlockRendererProps {
  block: Block;
  isPreview?: boolean;
}

export function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
  const definition = getBlockDefinition(block.type as any);
  
  if (!definition) {
    console.error(`Unknown block type: ${block.type}`);
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded">
        <p className="text-red-600">Unknown block type: {block.type}</p>
      </div>
    );
  }

  const Component = definition.component;
  
  if (!Component) {
    console.error(`No component registered for block type: ${block.type}`);
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-yellow-600">Block component not loaded: {block.type}</p>
      </div>
    );
  }

  return (
    <div data-block-id={block.id} data-block-type={block.type} className={isPreview ? 'relative' : ''}>
      <Component {...block.props} />
    </div>
  );
}

