# Component Library

## Available Components (8 Total)

### Hero Components

#### 1. **Hero Basic** (`hero-basic`)
Enhanced hero section with multiple variants and configurable CTAs.

**Props:**
- `title` - Main heading (default: "Excellence in Education")
- `subtitle` - Small text above heading
- `description` - Subheading/description text
- `primaryCtaText` - Primary button text
- `primaryCtaLink` - Primary button URL
- `secondaryCtaText` - Secondary button text (optional)
- `secondaryCtaLink` - Secondary button URL
- `backgroundImage` - Background image URL
- `variant` - Style variant: `gradient` | `minimal` | `image`

**Variants:**
- `gradient` - Gradient background from primary colors
- `minimal` - Clean white background
- `image` - Full-width background image with overlay

---

### Content Components

#### 2. **Content Section** (`content-section`)
Versatile content section with heading, body text, and optional CTA.

**Props:**
- `subheading` - Small text above heading
- `heading` - Main section heading
- `content` - Body text/description
- `alignment` - Text alignment: `left` | `center` | `right`
- `variant` - Style variant: `default` | `featured` | `minimal`
- `backgroundColor` - Custom background color
- `buttonText` - CTA button text (optional)
- `buttonLink` - CTA button URL

**Use Cases:**
- About sections
- Mission statements
- General content blocks
- Informational sections

---

### Feature Components

#### 3. **Features Grid** (`features-grid`)
Showcase features, services, or offerings in a clean grid layout.

**Props:**
- `heading` - Section heading
- `subheading` - Small text above heading
- `features` - Array of feature objects:
  ```typescript
  {
    icon: string;      // Emoji or icon
    title: string;
    description: string;
  }
  ```
- `columns` - Grid columns: `2` | `3` | `4`
- `variant` - Card style: `default` | `bordered` | `elevated`

**Default Features:**
- Quality Education 🎓
- Expert Faculty 👥
- Proven Results 🏆

---

#### 4. **Stats Showcase** (`stats-showcase`)
Display key metrics and achievements in an engaging format.

**Props:**
- `heading` - Section heading (optional)
- `subheading` - Small text above heading
- `stats` - Array of stat objects:
  ```typescript
  {
    value: string;     // The number
    suffix: string;    // +, %, etc.
    label: string;     // Description
    icon: string;      // Emoji or icon
  }
  ```
- `variant` - Display style: `default` | `cards` | `minimal`
- `backgroundColor` - Custom background color

**Default Stats:**
- 500+ Students Enrolled
- 25+ Years of Excellence
- 98% Satisfaction Rate
- 50+ Expert Teachers

---

### Testimonial Components

#### 5. **Testimonials** (`testimonials-slider`)
Showcase testimonials with ratings and author information.

**Props:**
- `heading` - Section heading
- `subheading` - Small text above heading
- `testimonials` - Array of testimonial objects:
  ```typescript
  {
    quote: string;
    author: string;
    role: string;
    avatar: string;    // Image URL (optional)
    rating: number;    // 1-5 stars
  }
  ```
- `layout` - Display style: `single` | `grid`

**Features:**
- Star ratings
- Author photos or initials
- Responsive grid layout
- Hover effects

---

### CTA Components

#### 6. **CTA Banner** (`cta-banner`)
Prominent call-to-action section to drive conversions.

**Props:**
- `heading` - Main CTA heading
- `description` - Supporting text
- `primaryButtonText` - Main action button text
- `primaryButtonLink` - Main action URL
- `secondaryButtonText` - Secondary button text (optional)
- `secondaryButtonLink` - Secondary button URL
- `variant` - Style: `gradient` | `solid` | `minimal`
- `alignment` - Text alignment: `left` | `center`

**Variants:**
- `gradient` - Eye-catching gradient background
- `solid` - Solid primary color
- `minimal` - Subtle gray background

---

### Team Components

#### 7. **Team Grid** (`team-grid`)
Display team members or faculty with photos and details.

**Props:**
- `heading` - Section heading
- `subheading` - Small text above heading
- `members` - Array of member objects:
  ```typescript
  {
    name: string;
    role: string;
    bio: string;
    image: string;     // Photo URL (optional)
    email: string;     // Contact email (optional)
  }
  ```
- `columns` - Grid columns: `2` | `3` | `4`

**Features:**
- Photo placeholders with initials
- Hover effects on images
- Contact links
- Responsive grid

---

### Footer Components

#### 8. **Footer Simple** (`footer-simple`)
Professional footer with navigation links and social media.

**Props:**
- `schoolName` - Organization name
- `tagline` - Short description
- `copyrightYear` - Year (defaults to current year)
- `links` - Array of navigation links:
  ```typescript
  {
    label: string;
    href: string;
  }
  ```
- `socialLinks` - Array of social media links:
  ```typescript
  {
    platform: string;
    url: string;
    icon: string;      // Emoji or icon
  }
  ```
- `variant` - Style: `dark` | `light` | `branded`
- `backgroundColor` - Custom background color

**Variants:**
- `dark` - Dark background (default)
- `light` - Light background with border
- `branded` - Primary brand color

---

## Component Template

See [COMPONENT_TEMPLATE.md](./COMPONENT_TEMPLATE.md) for the complete guide on creating new components.

### Quick Start

1. **Create component folder:**
   ```bash
   mkdir -p src/components/widgets/my-component
   ```

2. **Add `widget.config.ts`:**
   ```typescript
   import type { WidgetConfig } from '@/lib/registry/types';

   export const widgetConfig: WidgetConfig = {
     id: 'my-component',
     name: 'My Component',
     description: 'What it does',
     icon: 'IconName',
     category: 'content',
     tags: ['tag1', 'tag2'],
     version: '1.0.0',
   };
   ```

3. **Add `index.tsx`:**
   ```typescript
   import type { RenderComponentProps } from '@/lib/registry/types';

   interface MyComponentProps {
     title?: string;
     // ... other props
   }

   export default function MyComponent({ props }: RenderComponentProps<MyComponentProps>) {
     const { title = 'Default Title' } = props;

     return (
       <section className="py-20 px-4">
         <h2>{title}</h2>
       </section>
     );
   }
   ```

4. **Regenerate registry:**
   ```bash
   npm run generate:registry
   ```

---

## Design Guidelines

### Colors
- **Primary**: Use CSS variables from theme system
- **Backgrounds**: `rgba(0, 0, 0, 0.02)` for subtle fills
- **Borders**: `rgba(0, 0, 0, 0.1)` for soft definition
- **Text**: `#1a1a1a` primary, `#666` secondary, `#999` tertiary

### Spacing
- **Section padding**: `py-20 px-4` standard, `py-24 px-4` large
- **Container width**: `max-w-6xl` or `max-w-7xl` with `mx-auto`
- **Content width**: `max-w-4xl` for text-heavy sections

### Buttons
- **Rounded**: Use `rounded-full` for pill-shaped buttons
- **Padding**: `px-8 py-4` standard, `px-6 py-3` compact
- **Transition**: `transition-all duration-300` for smooth effects

### Cards
- **Rounded corners**: `rounded-xl` (12px)
- **Borders**: `border border-black/10`
- **Hover**: `hover:border-black/20` or `hover:shadow-md`
- **Padding**: `p-6` or `p-8`

### Typography
- **Headings**: Font weight `light` (300) for modern look
- **Tracking**: Use `tracking-tight` for large headings
- **Line height**: `leading-relaxed` for body text
- **Responsive**: `text-4xl md:text-5xl` pattern

---

## Component Categories

- **hero** - Large header sections, main landing areas
- **content** - Text-based sections, information display
- **footer** - Site footer sections
- **navigation** - Menus, navbars, breadcrumbs
- **media** - Image galleries, videos, media content
- **form** - Contact forms, data collection
- **feature** - Feature highlights, service offerings
- **testimonial** - Reviews, success stories, social proof
- **cta** - Call-to-action sections, conversion focused

---

## Testing Components

1. **Run dev server:**
   ```bash
   npm run dev
   ```

2. **View in homepage:**
   - Visit http://localhost:3000
   - See all registered components

3. **Test in editor:**
   - Visit http://localhost:3000/editor/demo
   - Drag components to canvas
   - Test interactions

4. **Check preview:**
   - Toggle preview mode in editor
   - Or visit http://localhost:3000/preview/demo

---

## Tips

- **Make everything configurable** - Use props with sensible defaults
- **Support variants** - Offer multiple style options
- **Responsive by default** - Use Tailwind breakpoints
- **Accessibility** - Use semantic HTML and ARIA labels
- **Performance** - Keep components lightweight
- **Documentation** - Add JSDoc comments to props

---

**Total Components**: 8
**Last Updated**: 2025-10-01
