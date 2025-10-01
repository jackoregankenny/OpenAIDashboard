'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ExternalLink, Settings, Copy, Trash2, FileText, Eye, EyeOff, Palette } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Site {
  id: string;
  name: string;
  domain: string;
  createdAt: Date;
}

interface Page {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  isPublished: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [pages, setPages] = useState<Record<string, Page[]>>({});
  const [loading, setLoading] = useState(true);
  const [isCreateSiteDialogOpen, setIsCreateSiteDialogOpen] = useState(false);
  const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteDomain, setNewSiteDomain] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    try {
      const response = await fetch('/api/sites');
      if (response.ok) {
        const data = await response.json();
        setSites(data);
        
        // Fetch pages for each site
        for (const site of data) {
          fetchPagesForSite(site.id);
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPagesForSite(siteId: string) {
    try {
      const response = await fetch(`/api/sites/${siteId}/pages`);
      if (response.ok) {
        const data = await response.json();
        setPages(prev => ({ ...prev, [siteId]: data }));
      }
    } catch (error) {
      console.error(`Error fetching pages for site ${siteId}:`, error);
    }
  }

  async function handleCreateSite() {
    if (!newSiteName || !newSiteDomain) return;

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSiteName,
          domain: newSiteDomain,
        }),
      });

      if (response.ok) {
        setNewSiteName('');
        setNewSiteDomain('');
        setIsCreateSiteDialogOpen(false);
        fetchSites();
      } else {
        alert('Failed to create site');
      }
    } catch (error) {
      console.error('Error creating site:', error);
      alert('Error creating site');
    }
  }

  async function handleCreatePage() {
    if (!selectedSiteId || !newPageTitle || !newPageSlug) return;

    try {
      const response = await fetch(`/api/sites/${selectedSiteId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: newPageSlug,
          title: newPageTitle,
          blocks: [],
        }),
      });

      if (response.ok) {
        setNewPageTitle('');
        setNewPageSlug('');
        setIsCreatePageDialogOpen(false);
        fetchPagesForSite(selectedSiteId);
      } else {
        alert('Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Error creating page');
    }
  }

  async function handleDuplicatePage(pageId: string, siteId: string) {
    try {
      // Fetch the page
      const response = await fetch(`/api/pages/${pageId}`);
      if (!response.ok) return;
      
      const page = await response.json();
      
      // Create duplicate
      const duplicateResponse = await fetch(`/api/sites/${siteId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: `${page.slug}-copy`,
          title: `${page.title} (Copy)`,
          blocks: JSON.parse(page.blocks),
        }),
      });

      if (duplicateResponse.ok) {
        fetchPagesForSite(siteId);
      } else {
        alert('Failed to duplicate page');
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
      alert('Error duplicating page');
    }
  }

  async function handleDeletePage(pageId: string, siteId: string) {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPagesForSite(siteId);
      } else {
        alert('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page');
    }
  }

  async function handleTogglePublish(pageId: string, siteId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchPagesForSite(siteId);
      } else {
        alert('Failed to update page');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Error updating page');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header - Webflow style */}
      <div className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Sites
              </h1>
            </div>
            <Dialog open={isCreateSiteDialogOpen} onOpenChange={setIsCreateSiteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Site
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Site</DialogTitle>
                  <DialogDescription>
                    Set up a new school website
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">School Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Riverside High School"
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="e.g. riverside-hs"
                      value={newSiteDomain}
                      onChange={(e) => setNewSiteDomain(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateSite} className="w-full">
                    Create Site
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        {sites.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold mb-1">No sites yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Create your first school website
              </p>
              <Button onClick={() => setIsCreateSiteDialogOpen(true)} size="sm">
                <Plus className="w-3.5 h-3.5 mr-2" />
                New Site
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">
                        {site.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5 truncate">
                        {site.domain}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/sites/${site.id}`)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings & Theme
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span className="text-xs text-muted-foreground">
                        {pages[site.id]?.length || 0} pages
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setIsCreatePageDialogOpen(true);
                        }}
                        className="h-6 text-xs -mr-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        New
                      </Button>
                    </div>
                    
                    <div className="space-y-0.5 max-h-40 overflow-y-auto">
                      {pages[site.id]?.length === 0 ? (
                        <div className="text-center py-4 text-xs text-muted-foreground">
                          No pages yet
                        </div>
                      ) : (
                        pages[site.id]?.map((page) => (
                          <div 
                            key={page.id} 
                            className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {page.isPublished ? (
                                <Eye className="w-3 h-3 text-green-600 flex-shrink-0" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs truncate">{page.title}</div>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/builder/${page.id}`)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                title="Edit"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    •••
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                  <DropdownMenuItem onClick={() => handleTogglePublish(page.id, site.id, page.isPublished)}>
                                    {page.isPublished ? (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicatePage(page.id, site.id)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeletePage(page.id, site.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                        asChild
                      >
                        <a href={`/sites/${site.domain}/home`} target="_blank" className="flex items-center justify-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Page Dialog */}
      <Dialog open={isCreatePageDialogOpen} onOpenChange={setIsCreatePageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your school website
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                placeholder="e.g. About Us"
                value={newPageTitle}
                onChange={(e) => {
                  setNewPageTitle(e.target.value);
                  // Auto-generate slug
                  setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                }}
              />
            </div>
            <div>
              <Label htmlFor="pageSlug">URL Slug</Label>
              <Input
                id="pageSlug"
                placeholder="e.g. about-us"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Will be accessible at: /sites/{sites.find(s => s.id === selectedSiteId)?.domain}/{newPageSlug}
              </p>
            </div>
            <Button onClick={handleCreatePage} className="w-full" disabled={!newPageTitle || !newPageSlug}>
              Create Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

