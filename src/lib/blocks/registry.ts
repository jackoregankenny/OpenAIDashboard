import { ComponentType } from 'react';
import { BlockType } from './types';

// Block component registry
export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  component: ComponentType<any>;
  defaultProps: any;
  icon: string;
  category: 'content' | 'media' | 'people' | 'interactive';
}

// Auto-populated registry - blocks register themselves
export const blockRegistry: Map<BlockType, BlockDefinition> = new Map();

// Helper function to register a block (called by each block component)
export function registerBlock(definition: BlockDefinition) {
  blockRegistry.set(definition.type, definition);
}

export function getBlockDefinition(type: BlockType): BlockDefinition | undefined {
  return blockRegistry.get(type);
}

export function getAllBlockDefinitions(): BlockDefinition[] {
  return Array.from(blockRegistry.values());
}

export function getBlocksByCategory(category: BlockDefinition['category']): BlockDefinition[] {
  return Array.from(blockRegistry.values()).filter(block => block.category === category);
}

