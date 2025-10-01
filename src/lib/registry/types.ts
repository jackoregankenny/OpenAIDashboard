import { z } from 'zod';
import type { ComponentType } from 'react';

/**
 * Component categories for organizing widgets
 */
export type WidgetCategory =
  | 'hero'
  | 'content'
  | 'footer'
  | 'navigation'
  | 'media'
  | 'form'
  | 'feature'
  | 'testimonial'
  | 'cta';

/**
 * Zod schema for widget configuration
 * This ensures type safety and validation at build time
 */
export const widgetConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string(), // Lucide icon name
  category: z.enum([
    'hero',
    'content',
    'footer',
    'navigation',
    'media',
    'form',
    'feature',
    'testimonial',
    'cta',
  ]),
  tags: z.array(z.string()).optional(),
  version: z.string().default('1.0.0'),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

/**
 * Props that all editor components receive
 */
export interface EditorComponentProps<T = Record<string, any>> {
  id: string;
  props: T;
  isSelected: boolean;
  isHovered: boolean;
  onChange: (props: Partial<T>) => void;
  onSelect: () => void;
}

/**
 * Props that all render components receive (for published sites)
 */
export interface RenderComponentProps<T = Record<string, any>> {
  props: T;
}

/**
 * Complete widget registry entry
 */
export interface WidgetRegistryEntry<T = Record<string, any>> {
  config: WidgetConfig;
  component: ComponentType<RenderComponentProps<T>>;
  editorComponent?: ComponentType<EditorComponentProps<T>>;
}

/**
 * The complete widget registry
 */
export type WidgetRegistry = Record<string, WidgetRegistryEntry>;

/**
 * Helper type for accessing widget IDs
 */
export type WidgetId = keyof WidgetRegistry;

/**
 * Structured link configuration for editor components
 */
export type LinkTarget =
  | {
      type: 'internal';
      path: string; // Pre-resolved path (e.g. "/about")
      pageId?: string;
      slug?: string;
    }
  | {
      type: 'external';
      url: string;
    };

/**
 * Normalize link targets to href strings for rendering
 */
export function resolveLinkHref(link?: LinkTarget | string | null): string | undefined {
  if (!link) return undefined;

  if (typeof link === 'string') {
    return link;
  }

  if (link.type === 'internal') {
    return link.path;
  }

  if (!link.url) {
    return undefined;
  }

  return link.url;
}
