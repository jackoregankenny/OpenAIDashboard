# Mission: School Website Builder

## 🎯 Project Vision

Create a **Webflow-style visual builder** specifically designed for schools, enabling non-technical staff to create, manage, and maintain professional school websites without writing code.

## 🏫 Problem Statement

Schools need modern, attractive websites but face challenges:
- **Limited Technical Expertise**: Most school administrators aren't developers
- **High Costs**: Custom development or premium platforms are expensive
- **Inflexible Templates**: Generic website builders don't understand school-specific needs
- **Maintenance Burden**: Updating timetables, staff, events requires developer intervention

## 💡 Our Solution

A specialized website builder that:
1. **Understands Schools**: Pre-built blocks for timetables, staff directories, events, news
2. **Visual First**: Drag-and-drop interface with live preview
3. **Multi-Tenant**: Single platform hosting multiple school websites
4. **Professional UX**: Webflow-level polish, not "scrappy" feeling

## 🧱 Core Philosophy: "Every Section is a Block"

### Block-Based Architecture
- Pages are arrays of JSON block definitions
- Each block is a self-contained component with props
- Blocks auto-register themselves (no manual registry maintenance)
- Drag-and-drop reordering with live preview

### Example Block Structure
```json
{
  "id": "abc123",
  "type": "timetable",
  "props": {
    "title": "Class Timetable",
    "layout": "weekly",
    "showClassSelector": true,
    "classes": ["Year 7", "Year 8", ...],
    "schedules": {
      "Year 7": { /* schedule data */ }
    }
  }
}
```

## 🎨 Design Principles

### 1. Webflow-Inspired UX
- **Clean, Professional Interface**: No gradients, flashy effects, or "scrappy" feeling
- **Three-Panel Layout**: 
  - Left: Block palette with inline previews
  - Center: Live canvas with drag-and-drop
  - Right: Property editor
- **Inline Previews**: See what blocks look like before adding them
- **Real-time Updates**: Changes reflect immediately

### 2. School-Specific Blocks
Unlike generic builders, we provide blocks tailored to schools:

#### **Timetable Block**
- Multiple layouts (weekly, daily, period)
- Per-class/year schedules
- Teacher and room information
- Color-coded subjects
- Visual editor (no JSON manipulation)

#### **Staff Directory**
- Bio, contact info, subjects taught
- Photo galleries
- Department organization

#### **Events Calendar**
- Upcoming events with dates
- RSVP/registration links
- Category filtering

#### **News Feed**
- Latest announcements
- Image support
- Date-based sorting

#### **Hero/Content Blocks**
- Large banners, text sections
- Image galleries
- Contact forms
- FAQs with accordions
- Testimonials
- Feature grids
- Statistics displays
- Call-to-action sections

### 3. Live Preview & Auto-Save
- **Live Updates**: Property changes reflect instantly on canvas
- **Auto-Save**: Changes saved automatically after 1s of inactivity
- **Draft/Publish**: Work on drafts without affecting live site
- **Page Management**: Create, delete, duplicate, publish/unpublish pages

### 4. Theme System
- **Site-Wide Theming**: Colors, fonts, spacing controlled centrally
- **Quick Presets**: Ocean Blue, Forest Green, Royal Purple, Sunset Orange
- **Live Preview**: See theme changes in real-time
- **Accessible via Builder**: Theme button in top nav opens side panel

## 🏗️ Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Drag & Drop**: @dnd-kit for smooth interactions
- **State Management**: React hooks + auto-save
- **Validation**: Zod schemas for block props

### Backend
- **Database**: SQLite with Drizzle ORM
- **API**: Next.js API routes
- **Tables**:
  - `sites`: Multi-tenant site configs
  - `pages`: Page definitions with blocks JSON
  - `themes`: Site-wide appearance settings
  - `media`: Image/file management

### Block System
```
src/lib/blocks/
├── types.ts           # Zod schemas for all block props
├── registry.ts        # Auto-registration system
└── index.tsx          # Central import point

src/components/blocks/
├── hero-block.tsx     # Each block registers itself
├── timetable-block.tsx
├── staff-block.tsx
└── ...
```

### Builder Components
```
src/components/builder/
├── page-builder.tsx      # Main builder orchestrator
├── block-palette.tsx     # Left sidebar with previews
├── sortable-block.tsx    # Draggable block wrapper
├── block-editor.tsx      # Right sidebar property editor
├── timetable-editor.tsx  # Visual timetable editor
└── array-editor.tsx      # Array/object property editor
```

## 🚀 Current Status

### ✅ Completed Features

#### Core Builder
- [x] Three-panel layout (palette, canvas, properties)
- [x] Drag-and-drop block placement
- [x] Live preview updates
- [x] Auto-save functionality
- [x] Block property editing with type-aware inputs

#### Block System
- [x] Auto-registration pattern
- [x] 15+ pre-built blocks
- [x] Hero, Gallery, Staff, Content, Events, Contact
- [x] News, Timetable, FAQ, Testimonials, Features, Statistics, CTA
- [x] Custom property editors (array, object, timetable)

#### Timetable Features
- [x] Three layouts: weekly, daily, period
- [x] Multi-class support (Year 7-12)
- [x] Visual schedule editor
- [x] Teacher, room, color coding
- [x] Class selector dropdown

#### Page Management
- [x] Create, delete, duplicate pages
- [x] Publish/unpublish workflow
- [x] Page navigation in builder
- [x] Draft vs published states
- [x] Page settings panel

#### Theme System
- [x] Site-wide color customization
- [x] Typography controls
- [x] Quick presets
- [x] Live theme preview
- [x] Theme persistence

#### UX Enhancements
- [x] Inline block previews in sidebar
- [x] Drag blocks from palette to canvas
- [x] Webflow-style clean interface
- [x] Compact, professional styling
- [x] Keyboard shortcuts (Escape to close panels)

### 🔄 Known Issues
- [ ] React key warning in timetable (cosmetic, doesn't affect functionality)
- [ ] Image warnings for missing 'sizes' prop (Next.js optimization)

## 📋 Roadmap

### Phase 1: Builder Polish (Current)
- [x] Fix all linter errors
- [x] Remove gradients/flashy effects
- [x] Implement drag & drop previews
- [x] Multi-class timetables
- [x] Live preview updates

### Phase 2: Content Management
- [ ] Media library with upload
- [ ] Image optimization pipeline
- [ ] Rich text editor for content blocks
- [ ] Markdown support
- [ ] Copy/paste blocks between pages

### Phase 3: Onboarding & Import
- [ ] New site wizard
- [ ] Logo upload
- [ ] Import from existing website
- [ ] Template gallery
- [ ] Quick start templates

### Phase 4: Advanced Features
- [ ] Custom domains
- [ ] SEO optimization tools
- [ ] Analytics dashboard
- [ ] Form submissions management
- [ ] Email notifications
- [ ] User roles & permissions

### Phase 5: Extensibility
- [ ] Custom block creation UI
- [ ] Block marketplace
- [ ] Plugin system
- [ ] API for third-party integrations
- [ ] Webhook support

### Phase 6: Performance & Scale
- [ ] Static site generation
- [ ] CDN integration
- [ ] Image lazy loading
- [ ] Code splitting optimization
- [ ] Performance monitoring

## 🎓 Target Users

### Primary: School Administrators
- Non-technical users
- Need to update content regularly
- Manage multiple pages/sections
- Coordinate with other staff

### Secondary: Teachers
- Update timetables
- Post news/announcements
- Manage class pages

### Tertiary: IT Staff
- Initial setup
- Theme customization
- Troubleshooting
- Advanced configurations

## 🏆 Success Criteria

1. **Non-Developer Friendly**: Admin staff can build entire site without code
2. **Professional Output**: Sites look as good as expensive custom builds
3. **Time Savings**: Reduce site update time from hours to minutes
4. **Cost Effective**: Cheaper than hiring developers or premium platforms
5. **School-Specific**: Better than generic builders for education sector

## 🔧 Development Workflow

### Adding a New Block
1. Create `my-block.tsx` in `src/components/blocks/`
2. Define Zod schema in `src/lib/blocks/types.ts`
3. Component calls `registerBlock()` at bottom of file
4. Export from `src/components/blocks/index.tsx`
5. No manual registry updates needed!

### Editing the Builder
- **page-builder.tsx**: Main orchestrator, drag-drop logic
- **block-palette.tsx**: Add/modify block categories
- **block-editor.tsx**: Add custom property editors
- **theme-customizer.tsx**: Add theme options

## 📚 Key Files Reference

### Schema & Types
- `src/lib/blocks/types.ts` - All block prop schemas
- `src/db/schema.ts` - Database schema

### APIs
- `src/app/api/sites/route.ts` - Site CRUD
- `src/app/api/sites/[siteId]/pages/route.ts` - Page CRUD
- `src/app/api/sites/[siteId]/theme/route.ts` - Theme CRUD
- `src/app/api/pages/[pageId]/route.ts` - Individual page ops

### Main Pages
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/builder/[pageId]/page.tsx` - Page builder
- `src/app/sites/[domain]/[slug]/page.tsx` - Public site renderer

## 🌟 Unique Selling Points

1. **Education-First**: Built specifically for schools, not adapted from generic tools
2. **Visual Timetable Editor**: No other builder has this level of timetable support
3. **Multi-Tenant**: One platform, many schools
4. **Webflow UX**: Professional-grade interface at accessible price
5. **Block Ecosystem**: Extensible with auto-registration pattern
6. **Live Preview**: See changes instantly, not after "publish"
7. **Auto-Save**: Never lose work
8. **Class Management**: Per-year/class content organization

## 🚦 Getting Started (For New Developers)

1. **Setup**: `npm install` → `npm run db:push` → `npm run db:seed`
2. **Run**: `npm run dev` → Visit `http://localhost:3000/admin`
3. **Explore**: Create a site → Add pages → Drag blocks → Edit properties
4. **Code**: Check `src/components/blocks/` for examples
5. **Extend**: Add new blocks using existing patterns

## 📞 Support & Documentation

- **Inline Help**: Hover tooltips and descriptions throughout UI
- **Block Previews**: See what blocks do before adding them
- **Default Props**: Sensible defaults for all block properties
- **Validation**: Zod ensures data integrity
- **Type Safety**: TypeScript prevents runtime errors

---

## 🎯 The Goal

**Empower schools to create and maintain professional websites without technical expertise, saving time and money while providing better web experiences for students, parents, and staff.**

---

**Last Updated**: October 2025  
**Version**: 0.1.0 (Hackathon MVP)  
**Status**: Core features complete, ready for testing and feedback

