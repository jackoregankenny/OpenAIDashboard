# Widget Components

This directory contains all self-registering widget components for the EdTech School Website Builder.

## How to Add a New Component

1. **Create a new folder** in this directory with your component name (kebab-case):
   ```
   src/components/widgets/your-component-name/
   ```

2. **Create `widget.config.ts`** with component metadata:
   ```typescript
   import type { WidgetConfig } from '@/lib/registry/types';

   export const widgetConfig: WidgetConfig = {
     id: 'your-component-name',
     name: 'Your Component Name',
     description: 'What this component does',
     icon: 'IconName', // Lucide icon name
     category: 'hero', // or 'content', 'footer', etc.
     tags: ['optional', 'tags'],
     version: '1.0.0',
   };
   ```

3. **Create `index.tsx`** with your component:
   ```typescript
   import type { RenderComponentProps } from '@/lib/registry/types';

   interface YourComponentProps {
     title?: string;
     // ... your props
   }

   export default function YourComponent({
     props,
   }: RenderComponentProps<YourComponentProps>) {
     const { title = 'Default Title' } = props;

     return (
       <section>
         <h1>{title}</h1>
       </section>
     );
   }
   ```

4. **Run the registry generator**:
   ```bash
   npm run generate:registry
   ```

That's it! Your component is now registered and available throughout the application.

## Development

- **Dev with auto-reload**: `npm run dev` (regenerates on startup)
- **Dev with hot-reload**: `npm run dev:watch` (watches for config changes)
- **Manual regeneration**: `npm run generate:registry`

## Component Categories

- `hero` - Hero sections and headers
- `content` - Content sections and text blocks
- `footer` - Footer components
- `navigation` - Navigation menus
- `media` - Image galleries, videos
- `form` - Forms and contact sections
- `feature` - Feature showcases
- `testimonial` - Testimonials and reviews
- `cta` - Call-to-action sections

## Examples

See the existing components in this directory:
- `hero-basic/` - Simple hero section
- `content-section/` - Flexible content area
- `footer-simple/` - Basic footer

## Benefits

✅ **No manual registration** - Just add files, run script
✅ **Fully type-safe** - TypeScript autocomplete everywhere
✅ **Tree-shakeable** - Unused components are removed from bundle
✅ **Hot reload support** - Changes detected automatically
✅ **Fast runtime** - Zero file system operations at runtime
