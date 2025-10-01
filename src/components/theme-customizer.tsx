'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Palette, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThemeCustomizerProps {
  siteId: string;
}

export function ThemeCustomizer({ siteId }: ThemeCustomizerProps) {
  const { toast } = useToast();
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    borderRadius: '0.5rem',
    spacing: '1rem',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheme();
  }, [siteId]);

  const fetchTheme = async () => {
    try {
      const response = await fetch(`/api/sites/${siteId}/theme`);
      if (response.ok) {
        const data = await response.json();
        setTheme({
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          fontFamily: data.fontFamily,
          headingFont: data.headingFont,
          borderRadius: data.borderRadius,
          spacing: data.spacing,
        });
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/sites/${siteId}/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      });

      if (response.ok) {
        toast({
          title: 'Theme saved',
          description: 'Your theme has been updated successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save theme.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save theme.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setTheme({
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      borderRadius: '0.5rem',
      spacing: '1rem',
    });
  };

  const presets = [
    { name: 'Ocean Blue', colors: { primaryColor: '#0284c7', secondaryColor: '#0891b2', accentColor: '#06b6d4' } },
    { name: 'Forest Green', colors: { primaryColor: '#059669', secondaryColor: '#10b981', accentColor: '#34d399' } },
    { name: 'Royal Purple', colors: { primaryColor: '#7c3aed', secondaryColor: '#8b5cf6', accentColor: '#a78bfa' } },
    { name: 'Sunset Orange', colors: { primaryColor: '#ea580c', secondaryColor: '#f97316', accentColor: '#fb923c' } },
  ];

  if (loading) {
    return <div>Loading theme...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <CardTitle>Theme Customizer</CardTitle>
        </div>
        <CardDescription>
          Customize your site's colors, fonts, and spacing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => setTheme({ ...theme, ...preset.colors })}
                className="justify-start"
              >
                <div className="flex gap-1 mr-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.primaryColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.secondaryColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.colors.accentColor }}
                  />
                </div>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary">Primary</Label>
              <div className="flex gap-2">
                <Input
                  id="primary"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-14 h-10 p-1"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary">Secondary</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-14 h-10 p-1"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent">Accent</Label>
              <div className="flex gap-2">
                <Input
                  id="accent"
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-14 h-10 p-1"
                />
                <Input
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="text"
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                  className="w-14 h-10 p-1"
                />
                <Input
                  value={theme.textColor}
                  onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Typography</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font">Body Font</Label>
              <Select value={theme.fontFamily} onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}>
                <SelectTrigger id="font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="system-ui">System UI</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Heading Font</Label>
              <Select value={theme.headingFont} onValueChange={(value) => setTheme({ ...theme, headingFont: value })}>
                <SelectTrigger id="heading">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="system-ui">System UI</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Theme
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

