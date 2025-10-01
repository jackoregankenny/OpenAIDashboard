# EdTech School Website Builder - Project Documentation

## Project Overview
Building a drag-and-drop website builder for schools to create quick, lightweight, and stylistic homepages (similar to bish.ie but more modern).

**Design System**: Inspired by nucleus-search - clean, professional, minimal aesthetic with subtle backgrounds, smooth transitions, and rounded corners.

## Core Features
1. **Drag and Drop Editor** - Visual website building interface
2. **Onboarding & Profile Tool** - Import data from existing school websites
3. **Design Automation** - Generate color palettes from logos or existing sites
4. **Component System** - Easily extensible, self-registering components
5. **Published Sites** - Fast, lightweight, static-generated school homepages

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **State Management**: Zustand (editor state) + React Query (server state)
- **Styling**: Tailwind CSS + CSS Variables for theming
- **Drag & Drop**: @dnd-kit/core
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

### Key Architectural Patterns
1. **Component Registry Pattern** - Self-registering components via build-time code generation
2. **Strategy Pattern** - Design extraction (logo, website, manual)
3. **Builder Pattern** - Progressive site construction during onboarding
4. **Command Pattern** - Editor actions for undo/redo support
5. **Adapter Pattern** - Import system for different platforms (WordPress, Wix, etc.)

### Project Structure
```
/src
  /app
    /(editor)           # Editor interface routes
    /(render)           # Published site routes (SSG)
    /(admin)            # Onboarding & settings
    /api                # API routes
  /components
    /editor             # Editor-specific UI
    /ui                 # Shared UI components
    /widgets            # Site components (self-registering)
      /hero
        index.tsx       # Component implementation
        widget.config.ts # Component metadata
  /lib
    /registry           # Component registry system
      types.ts          # Shared types
      generated.ts      # Auto-generated registry (gitignored)
    /theme-engine       # Theme & palette generation
    /stores             # Zustand stores
  /scripts
    generate-registry.ts # Build-time component discovery
```

## Component Registry System

Components self-register by existing in the folder structure:

1. Create component folder: `src/components/widgets/[name]/`
2. Add `index.tsx` (component implementation)
3. Add `widget.config.ts` (metadata)
4. Build script auto-discovers and generates registry

**Example Component Config:**
```typescript
export const config: WidgetConfig = {
  id: 'hero-basic',
  name: 'Hero Section',
  category: 'hero',
  icon: 'Layout',
  description: 'Basic hero section with title and CTA',
};
```

**Benefits:**
- No manual registration needed
- Fully type-safe with autocomplete
- Tree-shakeable (unused components removed)
- Hot reload support during development

## Data Schema

**Core Tables:**
- `schools` - Multi-tenant (subdomain, custom_domain, settings)
- `sites` - Multiple sites per school
- `pages` - Page content stored as tree structure (PageNode)
- `themes` - Color palettes, typography, spacing
- `assets` - Images, files, media
- `import_jobs` - Website scraping/import tracking

## Theme Engine

**Color Palette Generation:**
- Extract colors from uploaded logos (colorthief/vibrant.js)
- Scrape colors from existing websites
- Generate full color scales (50-900) using chroma.js
- Ensure WCAG contrast compliance

**Implementation:**
- CSS Variables for runtime theming
- Tailwind with dynamic color injection
- Support for custom fonts, spacing scales, border radius

## Development Workflow

**Scripts:**
```bash
npm run dev              # Dev server + registry generation
npm run generate:registry # Generate component registry
npm run watch:registry   # Watch for component changes
npm run build            # Build + generate registry
```

## Implementation Phases

### Phase 1: Foundation ✅ COMPLETED
- [x] Component registry system with build-time generation
- [x] Create 3 example components (Hero, Content, Footer)
- [x] Theme engine foundation (types, CSS variables)
- [x] Basic page tree structure
- [x] Zustand editor state (selection, undo/redo)
- [x] React Query setup for server state

**Completed Files:**
- `src/lib/registry/types.ts` - Component type system
- `src/lib/registry/generated.ts` - Auto-generated registry
- `src/scripts/generate-registry.ts` - Build-time scanner
- `src/lib/theme-engine/types.ts` - Theme definitions
- `src/lib/theme-engine/theme-to-css.ts` - CSS variable converter
- `src/lib/page-structure/types.ts` - Page tree schema
- `src/lib/stores/editor-store.ts` - Zustand state management
- `src/lib/providers/query-provider.tsx` - React Query provider
- `src/components/widgets/hero-basic/` - Example component
- `src/components/widgets/content-section/` - Example component
- `src/components/widgets/footer-simple/` - Example component

### Phase 2: Core Features ✅ COMPLETED
- [x] Drag-drop editor with @dnd-kit
- [x] Database schema with Prisma
- [x] Minimal editor canvas
- [x] Basic rendering engine
- [x] Color palette generation

**Additional Completed Files:**
- `prisma/schema.prisma` - Complete database schema
- `src/lib/prisma.ts` - Prisma client singleton
- `src/components/editor/Canvas.tsx` - Visual editor with drag-drop
- `src/components/editor/ComponentPalette.tsx` - Component sidebar
- `src/components/editor/Toolbar.tsx` - Editor controls
- `src/app/editor/[siteId]/page.tsx` - Editor page
- `src/lib/theme-engine/generators/palette-generator.ts` - Color palette utilities
- `src/lib/theme-engine/extractors/logo-extractor.ts` - Logo color extraction
- `src/lib/renderer/PageRenderer.tsx` - Clean render engine
- `src/app/(render)/preview/[pageId]/page.tsx` - Preview/published view

### Phase 3: Advanced Features (NEXT)
- [ ] Onboarding flow
- [ ] Import system (website scraper)
- [ ] Publishing pipeline (SSG)
- [ ] Custom domain support
- [ ] Performance optimization
- [ ] Responsive preview modes
- [ ] Properties panel for editing component props
- [ ] Save/load pages from database

## What's Working Now

✅ **Self-Registering Components**
- Drop a component folder with `index.tsx` and `widget.config.ts`
- Run `npm run dev` and it's automatically available
- Full type safety with autocomplete
- 3 example components included

✅ **Theme Engine**
- CSS variables integrated with Tailwind
- Can be dynamically changed at runtime
- Fallbacks for missing values
- Color palette generation from base colors
- Logo color extraction with Vibrant.js
- WCAG contrast checking utilities

✅ **Page Tree System**
- Nested component structure
- Helper functions for CRUD operations
- Fully integrated with drag-drop

✅ **State Management**
- Zustand store with undo/redo
- React Query for server data
- Optimized selector hooks
- History management (50 levels)

✅ **Visual Editor**
- Drag-and-drop components (@dnd-kit)
- Component selection & highlighting
- Add/delete components
- Undo/redo functionality
- Preview mode toggle
- Component palette sidebar
- Toolbar with controls

✅ **Rendering Engine**
- Clean renderer for published sites
- No editor bloat
- SSG-ready architecture
- Preview route available

✅ **Database**
- Prisma schema with SQLite
- Multi-tenant support (schools)
- Sites, Pages, Themes, Assets, Import Jobs
- Indexes for performance

## Key Design Decisions

1. **Build-time component registration** - Best balance of DX and performance
2. **Separate editor vs render components** - Keep published sites lightweight
3. **Static generation for published sites** - Maximum performance
4. **Tree-based page structure** - Supports nested layouts
5. **CSS Variables over CSS-in-JS** - No runtime overhead
6. **Zustand + React Query** - Separation of editor state vs server state

## Performance Targets
- Published sites: Lighthouse score >95
- Editor: 60fps drag operations
- Time to Interactive: <2s for published sites
- Component library: <100kb base bundle

## How to Use

### Run the Application
```bash
npm run dev
```

Visit http://localhost:3000 to see:
- Component registry demo
- Link to visual editor
- Link to published preview

### Visual Editor
http://localhost:3000/editor/demo
- Pre-loaded demo page with components
- Drag components to reorder
- Click to select components
- Add components from sidebar
- Delete selected components
- Undo/redo with toolbar
- Toggle preview mode

### Published Preview
http://localhost:3000/preview/demo
- Clean rendering without editor UI
- Shows how published sites will look
- No editor overhead

### Add a New Component
1. Create `src/components/widgets/my-component/`
2. Add `widget.config.ts`:
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
3. Add `index.tsx` with your component
4. Run `npm run dev` - it's automatically registered!

## Next Steps (Phase 3)

1. **Properties Panel** - Edit component props in the editor
2. **Save/Load** - Persist pages to database
3. **API Routes** - CRUD operations for sites/pages
4. **Onboarding Flow** - Guided school setup
5. **Import System** - Scrape existing websites
6. **SSG Pipeline** - Generate static sites
7. **Custom Domains** - DNS configuration
8. **Advanced Features** - Responsive modes, collaboration, etc.

## Future Considerations
- Real-time collaboration (CRDT-ready structure)
- Component marketplace
- AI-powered content suggestions
- Advanced import adapters (more platforms)
- White-label options

---

**Last Updated**: 2025-10-01
**Status**: Phase 2 Complete - Core Editor Functional

## Project Stats
- **Files Created**: 25+ core files
- **Components**: 3 example widgets
- **Lines of Code**: ~3000+ (excluding node_modules)
- **Dependencies**: 20+ key packages
- **Features**: Component registry, visual editor, drag-drop, theming, rendering, database
