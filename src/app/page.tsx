import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            School Site Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, modern school websites with drag-and-drop simplicity. 
            Built with Next.js, dnd-kit, shadcn/ui, and SQLite.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-lg">
            <Link href="/admin">Go to Admin Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View Documentation
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-white/50 backdrop-blur p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Drag & Drop Builder</h3>
            <p className="text-sm text-muted-foreground">
              Intuitive visual editor powered by dnd-kit for creating pages
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Beautiful Components</h3>
            <p className="text-sm text-muted-foreground">
              Pre-built blocks for heroes, galleries, staff, events, and more
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Multi-Tenant Ready</h3>
            <p className="text-sm text-muted-foreground">
              Manage multiple school sites with custom domains and themes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


