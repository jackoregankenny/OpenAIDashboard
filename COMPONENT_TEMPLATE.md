# Component Template Guide

This guide provides a complete template for creating new components in the EdTech School Website Builder.

## Design Principles

Based on the nucleus-search design system, follow these principles:

### Visual Style
- **Clean & Minimal**: Use subtle backgrounds and soft borders
- **Professional Typography**: System fonts with careful spacing
- **Smooth Interactions**: 0.3s transitions on hover states
- **Rounded Corners**: 8-12px for cards, 50px for buttons
- **Soft Borders**: Use `rgba(0, 0, 0, 0.1)` for subtle separators
- **Color Accents**: Use theme colors sparingly for emphasis

### Color Guidelines
- **Backgrounds**: `rgba(0, 0, 0, 0.02)` for subtle fills
- **Hover States**: `rgba(0, 0, 0, 0.04)` or theme color at 5% opacity
- **Borders**: `rgba(0, 0, 0, 0.1)` for soft definition
- **Text**: `#1a1a1a` for primary, `#666` for secondary, `#999` for tertiary
- **Accents**: Use CSS variables from theme system

### Layout
- **Spacing**: Use consistent padding (20-40px for sections)
- **Responsive**: Mobile-first with Tailwind breakpoints
- **Typography Scale**: Follow Tailwind's type scale
- **Max Width**: 1200px for content, centered with auto margins

---

## Complete Component Template

### 1. Create Component Folder

```bash
src/components/widgets/[component-name]/
├── index.tsx              # Component implementation
├── widget.config.ts       # Component metadata
└── README.md             # Component documentation (optional)
```

### 2. Component Metadata (`widget.config.ts`)

```typescript
import type { WidgetConfig } from '@/lib/registry/types';

export const widgetConfig: WidgetConfig = {
  id: 'component-name',                    // Unique ID (kebab-case)
  name: 'Component Display Name',          // User-friendly name
  description: 'Brief description of what this component does and when to use it',
  icon: 'IconName',                        // Icon identifier (Lucide icons recommended)
  category: 'content',                     // Category: hero | content | footer | navigation | media | form | feature | testimonial | cta
  tags: ['tag1', 'tag2'],                 // Searchable tags (optional)
  version: '1.0.0',                        // Semantic version
};
```

### 3. Component Implementation (`index.tsx`)

```typescript
import type { RenderComponentProps } from '@/lib/registry/types';

/**
 * Define your component's props interface
 * Make all props optional with sensible defaults
 */
interface ComponentNameProps {
  // Content props
  title?: string;
  subtitle?: string;
  description?: string;

  // Style props
  alignment?: 'left' | 'center' | 'right';
  variant?: 'default' | 'outlined' | 'filled';

  // Interactive props
  buttonText?: string;
  buttonLink?: string;

  // Advanced props
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Component Display Name
 *
 * Brief description of the component's purpose
 *
 * @param props - Component properties from page tree
 */
export default function ComponentName({
  props
}: RenderComponentProps<ComponentNameProps>) {
  // Destructure props with defaults
  const {
    title = 'Default Title',
    subtitle,
    description = 'Default description text',
    alignment = 'center',
    variant = 'default',
    buttonText,
    buttonLink,
    backgroundColor,
    textColor,
  } = props;

  // Compute dynamic classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const variantClasses = {
    default: 'bg-white border border-black/10',
    outlined: 'bg-transparent border-2 border-primary-500',
    filled: 'bg-primary-50 border-none',
  };

  return (
    <section
      className="py-16 px-4"
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Content wrapper */}
        <div className={`flex flex-col gap-6 ${alignmentClasses[alignment]}`}>
          {/* Optional subtitle */}
          {subtitle && (
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wider">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-primary-900">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl">
              {description}
            </p>
          )}

          {/* Optional CTA button */}
          {buttonText && buttonLink && (
            <a
              href={buttonLink}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors duration-300"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## Best Practices

### 1. **Props Design**
- Use optional props with sensible defaults
- Group related props (content, style, behavior)
- Use TypeScript enums/unions for variant options
- Support theme customization via CSS variables

### 2. **Styling**
- Use Tailwind utility classes
- Follow the design system (rounded-lg, subtle borders, soft transitions)
- Support responsive breakpoints (sm, md, lg, xl)
- Use theme colors via CSS variables

### 3. **Accessibility**
- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA)

### 4. **Performance**
- Keep components lightweight
- Avoid heavy dependencies
- Use CSS for animations (not JS)
- Lazy load images if needed

### 5. **Documentation**
- Add JSDoc comments to component and props
- Document expected behavior
- Include usage examples
- Note any dependencies

---

## Component Categories

### Hero (`category: 'hero'`)
- Large header sections
- Main landing area
- Call-to-action focused
- Full-width, prominent placement

### Content (`category: 'content'`)
- Text-based sections
- Information display
- Mixed media support
- Standard padding and spacing

### Footer (`category: 'footer'`)
- Site footer sections
- Navigation links
- Contact information
- Copyright notices

### Navigation (`category: 'navigation'`)
- Menus and nav bars
- Breadcrumbs
- Tabs and filters
- Site navigation

### Media (`category: 'media'`)
- Image galleries
- Video players
- Slideshows/carousels
- Media-rich content

### Form (`category: 'form'`)
- Contact forms
- Registration forms
- Search inputs
- Data collection

### Feature (`category: 'feature'`)
- Feature highlights
- Service offerings
- Product showcases
- Grid layouts

### Testimonial (`category: 'testimonial'`)
- User reviews
- Success stories
- Quotes and endorsements
- Social proof

### CTA (`category: 'cta'`)
- Call-to-action sections
- Conversion-focused
- Action buttons
- Lead generation

---

## Quick Start Checklist

- [ ] Create component folder: `src/components/widgets/[name]/`
- [ ] Add `widget.config.ts` with metadata
- [ ] Add `index.tsx` with component implementation
- [ ] Define TypeScript interface for props
- [ ] Add sensible default values
- [ ] Use Tailwind classes following design system
- [ ] Support responsive breakpoints
- [ ] Add JSDoc documentation
- [ ] Test component in editor
- [ ] Verify preview renders correctly
- [ ] Run `npm run generate:registry` to register

---

## Example: Simple Card Component

### File Structure
```
src/components/widgets/card-simple/
├── index.tsx
└── widget.config.ts
```

### widget.config.ts
```typescript
import type { WidgetConfig } from '@/lib/registry/types';

export const widgetConfig: WidgetConfig = {
  id: 'card-simple',
  name: 'Simple Card',
  description: 'A clean card component with title and description',
  icon: 'Square',
  category: 'content',
  tags: ['card', 'content', 'minimal'],
  version: '1.0.0',
};
```

### index.tsx
```typescript
import type { RenderComponentProps } from '@/lib/registry/types';

interface CardSimpleProps {
  title?: string;
  description?: string;
  icon?: string;
}

export default function CardSimple({ props }: RenderComponentProps<CardSimpleProps>) {
  const {
    title = 'Card Title',
    description = 'Card description text',
    icon = '📦'
  } = props;

  return (
    <div className="p-6 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
```

---

## Testing Your Component

1. **Run Registry Generation**
   ```bash
   npm run generate:registry
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Test in Editor**
   - Visit http://localhost:3000/editor/demo
   - Find your component in the palette
   - Drag it onto the canvas
   - Verify it renders correctly

4. **Test in Preview**
   - Toggle preview mode
   - Verify clean rendering
   - Check responsive behavior

---

## Advanced Features

### Dynamic Theme Integration
```typescript
// Use CSS variables from theme
<div className="bg-primary-500 text-white">
  Content with theme colors
</div>

// Or inline styles for custom colors
<div style={{
  backgroundColor: `var(--color-primary-${shade})`,
  color: textColor
}}>
  Content
</div>
```

### Conditional Rendering
```typescript
{/* Only render if prop is provided */}
{imageUrl && (
  <img src={imageUrl} alt={imageAlt} className="..." />
)}

{/* Render different variants */}
{variant === 'card' ? (
  <CardLayout />
) : (
  <ListLayout />
)}
```

### Array Props for Lists
```typescript
interface FeatureListProps {
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

// In component
{features?.map((feature, index) => (
  <FeatureCard key={index} {...feature} />
))}
```

---

## Component Design System

### Typography
```typescript
// Headings
<h1 className="text-5xl font-light tracking-tight">
<h2 className="text-4xl font-light tracking-tight">
<h3 className="text-2xl font-medium">
<h4 className="text-xl font-medium">

// Body
<p className="text-base text-gray-600">
<p className="text-lg text-gray-600">  // Larger body
<p className="text-sm text-gray-500">  // Small text
```

### Buttons
```typescript
// Primary
<button className="px-8 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors duration-300">

// Secondary
<button className="px-8 py-3 bg-white text-primary-600 border border-primary-600 rounded-full font-medium hover:bg-primary-50 transition-colors duration-300">

// Minimal
<button className="px-6 py-2 bg-transparent text-gray-700 border border-black/10 rounded-full hover:bg-black/5 transition-all duration-300">
```

### Cards
```typescript
// Standard card
<div className="p-6 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-all duration-300">

// Elevated card
<div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">

// Subtle card
<div className="p-6 bg-black/[0.02] rounded-lg">
```

### Spacing
```typescript
// Section padding
<section className="py-16 px-4">        // Standard
<section className="py-24 px-4">        // Large
<section className="py-8 px-4">         // Compact

// Container
<div className="max-w-6xl mx-auto">     // Standard width
<div className="max-w-4xl mx-auto">     // Narrow content
<div className="max-w-7xl mx-auto">     // Wide content
```

---

## Need Help?

- Check existing components in `src/components/widgets/` for examples
- Review the theme engine in `src/lib/theme-engine/`
- See the registry types in `src/lib/registry/types.ts`
- Read the main project docs in `CLAUDE.md`

Happy building! 🚀
