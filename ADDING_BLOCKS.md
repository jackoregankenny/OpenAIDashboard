# 📦 Adding New Blocks

This guide shows you how to add new block types to the School Site Builder.

## Quick Start

1. **Create your block component** in `src/components/blocks/`
2. **Register it at the bottom** of your file
3. **Import it** in `src/components/blocks/index.tsx`

That's it! Your block will automatically appear in the builder.

## Step-by-Step Example

Let's create a "Testimonials" block:

### 1. Define the Props Type

First, add your block's prop schema to `src/lib/blocks/types.ts`:

```typescript
// Add to BlockType union
export type BlockType = 
  | 'hero'
  | 'gallery'
  // ... existing types
  | 'testimonials';  // Add this

// Define props schema
export const testimonialsBlockPropsSchema = z.object({
  title: z.string().default('What People Say'),
  testimonials: z.array(z.object({
    name: z.string(),
    role: z.string(),
    content: z.string(),
    image: z.string().optional(),
  })),
  layout: z.enum(['grid', 'carousel']).default('grid'),
});

export type TestimonialsBlockProps = z.infer<typeof testimonialsBlockPropsSchema>;
```

### 2. Create the Component

Create `src/components/blocks/testimonials-block.tsx`:

```typescript
import { TestimonialsBlockProps } from '@/lib/blocks/types';
import { Card, CardContent } from '@/components/ui/card';
import { registerBlock } from '@/lib/blocks/registry';
import Image from 'next/image';

export function TestimonialsBlock({ 
  title, 
  testimonials,
  layout = 'grid' 
}: TestimonialsBlockProps) {
  return (
    <div className="px-6 py-12 md:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              {testimonial.image && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 mx-auto">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-sm italic mb-4">"{testimonial.content}"</p>
              <div className="text-center">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'testimonials',
  name: 'Testimonials',
  description: 'Display customer testimonials and reviews',
  component: TestimonialsBlock,
  defaultProps: {
    title: 'What People Say',
    testimonials: [],
    layout: 'grid',
  },
  icon: 'quote',  // Choose from lucide-react icons
  category: 'content',  // 'content' | 'media' | 'people' | 'interactive'
});
```

### 3. Import in Index

Add to `src/components/blocks/index.tsx`:

```typescript
// Import all blocks - they auto-register on import
import './hero-block';
import './gallery-block';
// ... existing imports
import './testimonials-block';  // Add this

// Export for direct usage
export { TestimonialsBlock } from './testimonials-block';  // Add this
```

### 4. Done! 🎉

Your block will now:
- ✅ Appear in the builder's block palette
- ✅ Be draggable and sortable
- ✅ Have an editable properties panel
- ✅ Render on public pages

## Block Definition Options

```typescript
registerBlock({
  type: 'yourBlock',           // Unique identifier (must match BlockType)
  name: 'Your Block',          // Display name in palette
  description: 'What it does', // Shown in palette
  component: YourBlock,        // React component
  defaultProps: {              // Default values for all props
    // These populate the properties editor
  },
  icon: 'iconName',           // Lucide icon name
  category: 'content',        // Groups in palette
});
```

## Available Icons

Common icon names (from lucide-react):
- `image`, `images`, `gallery`
- `users`, `user`, `contact`
- `type`, `text`, `file-text`
- `calendar`, `clock`
- `mail`, `phone`, `message`
- `newspaper`, `book`
- `quote`, `message-square`
- `video`, `play`
- `map`, `map-pin`

## Categories

- **content** - Text, headings, rich content
- **media** - Images, videos, galleries
- **people** - Staff, testimonials, team
- **interactive** - Forms, calendars, contact

## Tips

### Styling
- Use Tailwind classes for consistency
- Follow mobile-first responsive design
- Use `max-w-7xl mx-auto` for content containers
- Standard padding: `px-6 py-12 md:px-12`

### Props Editor
The properties panel auto-generates fields based on your `defaultProps`:
- `string` → Text input
- `boolean` → Toggle switch
- `number` → Number input
- Enum types (alignment, layout) → Select dropdown

Complex types (arrays, objects) show a placeholder - you can enhance the editor in `src/components/builder/block-editor.tsx`.

### Images
- Always use Next.js `<Image>` component
- Provide alt text props
- Use responsive sizing
- Example: `<Image src={url} alt={alt} fill className="object-cover" />`

### Accessibility
- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation works
- Use proper heading hierarchy

## Advanced: Custom Editor Fields

To add custom editing UI for your block, modify `src/components/builder/block-editor.tsx`:

```typescript
// Add special handling for your block type
if (block.type === 'testimonials' && key === 'testimonials') {
  return (
    <div key={key}>
      <Label>Testimonials</Label>
      {/* Custom array editor UI here */}
    </div>
  );
}
```

## Need Help?

Check existing blocks in `src/components/blocks/` for examples:
- **Simple**: `content-block.tsx`
- **With images**: `gallery-block.tsx`
- **Complex layout**: `news-block.tsx`
- **Forms**: `contact-block.tsx`

