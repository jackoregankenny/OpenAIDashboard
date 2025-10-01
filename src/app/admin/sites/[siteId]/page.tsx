'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Site {
  id: string;
  name: string;
  domain: string;
}

export default function SiteSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState('');
  const [siteDomain, setSiteDomain] = useState('');

  useEffect(() => {
    fetchSite();
  }, [params.siteId]);

  async function fetchSite() {
    try {
      const response = await fetch(`/api/sites`);
      const sites = await response.json();
      const foundSite = sites.find((s: Site) => s.id === params.siteId);
      if (foundSite) {
        setSite(foundSite);
        setSiteName(foundSite.name);
        setSiteDomain(foundSite.domain);
      }
    } catch (error) {
      console.error('Error fetching site:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    try {
      const response = await fetch(`/api/sites/${params.siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: siteName,
          domain: siteDomain,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Site settings have been updated successfully.',
        });
        fetchSite();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!site) {
    return <div className="flex items-center justify-center h-screen">Site not found</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{site.name}</h1>
              <p className="text-sm text-muted-foreground">Site Settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Update your site's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="e.g. Riverside High School"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDomain">Domain Slug</Label>
                  <Input
                    id="siteDomain"
                    value={siteDomain}
                    onChange={(e) => setSiteDomain(e.target.value)}
                    placeholder="e.g. riverside-hs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Site URL: /sites/{siteDomain}
                  </p>
                </div>
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <ThemeCustomizer siteId={site.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

