# 🏫 School Site Builder

A modern, drag-and-drop website builder specifically designed for schools. Built for hackathons with rapid development in mind, using Next.js 15, dnd-kit, shadcn/ui, and SQLite.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![dnd-kit](https://img.shields.io/badge/dnd--kit-latest-orange)

## ✨ Features

- 🎨 **Drag & Drop Builder** - Intuitive visual editor powered by dnd-kit
- 🧩 **Block-Based System** - Pre-built components for common school website needs
- 🎯 **Multi-Tenant Ready** - Manage multiple school sites from one dashboard
- 🎨 **Theme System** - Customizable design tokens per site
- 📱 **Responsive Design** - Mobile-first approach using Tailwind CSS
- 🚀 **Fast Performance** - Next.js App Router with React Server Components
- 💾 **SQLite Database** - Simple, serverless data persistence with Drizzle ORM
- 🎭 **Beautiful UI** - shadcn/ui component library

## 🏗️ Architecture

### Stack Overview

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Drag & Drop**: dnd-kit
- **Database**: SQLite + Drizzle ORM
- **State Management**: React hooks (client-side)

### Block System

Each page is composed of reusable blocks stored as JSON:

```typescript
{
  id: "unique-id",
  type: "hero" | "gallery" | "staff" | "content" | "events" | "contact" | "news",
  props: {
    // Block-specific properties
  }
}
```

### Available Blocks

1. **Hero Block** - Large banner with title, subtitle, CTA, and background image
2. **Gallery Block** - Image gallery with multiple layout options
3. **Staff Block** - Team directory with bios and contact info
4. **Content Block** - Rich text content with customizable styling
5. **Events Block** - Calendar and event listings
6. **Contact Block** - Contact form and information
7. **News Block** - News feed with multiple layout options

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OpenAIDashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Homepage: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Demo Site: http://localhost:3000/sites/riverside-hs/home

## 📁 Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── builder/[pageId]/  # Page builder interface
│   │   ├── sites/[domain]/    # Public site renderer
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── blocks/            # Block components
│   │   ├── builder/           # Builder UI components
│   │   └── ui/                # shadcn/ui components
│   ├── db/
│   │   ├── schema.ts          # Database schema
│   │   ├── index.ts           # Database connection
│   │   └── seed.ts            # Seed script
│   └── lib/
│       ├── blocks/            # Block type definitions & registry
│       └── utils.ts           # Utility functions
├── drizzle/                   # Database migrations
├── sqlite.db                  # SQLite database file
└── package.json
```

## 🎨 Usage

### Creating a New Site

1. Navigate to `/admin`
2. Click "New Site"
3. Enter school name and domain
4. Click "Create Site"

### Building a Page

1. From the admin dashboard, click the settings icon on a page
2. Use the drag-and-drop builder:
   - **Left sidebar**: Add new blocks
   - **Center**: Canvas with live preview
   - **Right sidebar**: Edit block properties
3. Drag blocks to reorder
4. Click settings icon on a block to edit
5. Click "Save Page" when done

### Viewing the Public Site

Navigate to `/sites/[domain]/[slug]` to see the published page.

## 🗄️ Database Schema

### Sites
- `id` - Unique identifier
- `name` - School name
- `domain` - URL-friendly domain
- `logoUrl` - Logo image URL

### Themes
- `siteId` - Foreign key to site
- Color scheme (primary, secondary, accent, etc.)
- Typography settings
- Spacing and border radius

### Pages
- `siteId` - Foreign key to site
- `slug` - URL path
- `title` - Page title
- `blocks` - JSON array of blocks
- `isPublished` - Publish status

### Media
- `siteId` - Foreign key to site
- `url` - File URL
- `filename` - Original filename
- Metadata (type, size, alt text)

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Database
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:seed      # Seed with demo data

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🎯 Hackathon Features

Perfect for hackathons because:

- ✅ **Quick Setup** - Database seeded with demo data
- ✅ **Visual Builder** - No coding required to create pages
- ✅ **Beautiful UI** - Professional design out of the box
- ✅ **Extensible** - Easy to add new block types
- ✅ **Full Stack** - Database, API, and UI included
- ✅ **Modern Stack** - Latest tech for impressive demos

## 🚧 Future Enhancements

Potential additions for post-hackathon:

- [ ] Theme editor UI
- [ ] Image upload and media management
- [ ] Advanced block editor (rich text, arrays, objects)
- [ ] Page templates and starter layouts
- [ ] Import existing website (scraper)
- [ ] Custom domain support
- [ ] User authentication & authorization
- [ ] Version history & drafts
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Export static HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Adding Custom Blocks

Blocks **auto-register** themselves! Just create a file and import it.

**Quick Steps:**

1. **Create your block** in `src/components/blocks/my-block.tsx`
2. **Add `registerBlock()` at the bottom** of your file
3. **Import it** in `src/components/blocks/index.tsx`

**Example:**

```typescript
// src/components/blocks/my-block.tsx
import { registerBlock } from '@/lib/blocks/registry';

export function MyBlock({ title }: { title: string }) {
  return <div>{title}</div>;
}

// Auto-register on import!
registerBlock({
  type: 'myBlock',
  name: 'My Block',
  component: MyBlock,
  defaultProps: { title: 'Hello' },
  icon: 'box',
  category: 'content',
});
```

Then import in `src/components/blocks/index.tsx`:
```typescript
import './my-block';
export { MyBlock } from './my-block';
```

**That's it!** Your block appears in the builder automatically.

📖 See [ADDING_BLOCKS.md](./ADDING_BLOCKS.md) for detailed guide.

## 📄 License

MIT License - feel free to use this in your hackathon projects!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [dnd-kit](https://dndkit.com/) - Drag and drop library
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

Built with ❤️ for hackathons and rapid prototyping
