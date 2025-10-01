'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Block } from '@/lib/blocks/types';
import { getBlockDefinition } from '@/lib/blocks/registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { TimetableEditor } from './timetable-editor';
import { ArrayEditor } from './array-editor';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Upload } from 'lucide-react';
import { parseICSFile } from '@/components/blocks/holidays-block';

interface BlockEditorProps {
  block: Block | null;
  onSave: (block: Block) => void;
  onCancel: () => void;
  onLiveUpdate?: (block: Block) => void;
}

export function BlockEditor({ block, onSave, onCancel, onLiveUpdate }: BlockEditorProps) {
  const [editedProps, setEditedProps] = useState<any>(block?.props || {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedProps(block?.props || {});
  }, [block]);

  if (!block) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Block Selected</CardTitle>
          <CardDescription>Select a block to edit its properties</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const definition = getBlockDefinition(block.type as any);
  
  if (!definition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unknown Block Type</CardTitle>
          <CardDescription>Cannot edit block of type: {block.type}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleSave = () => {
    onSave({
      ...block,
      props: editedProps,
    });
  };

  const updateProp = (key: string, value: any) => {
    setEditedProps((prev: any) => {
      const newProps = {
        ...prev,
        [key]: value,
      };
      
      // Trigger live update if callback provided
      if (onLiveUpdate && block) {
        onLiveUpdate({
          ...block,
          props: newProps,
        });
      }
      
      return newProps;
    });
  };

  const renderField = (key: string, value: any) => {
    // Special handling for timetable schedules - use modal editor
    if (block.type === 'timetable' && key === 'schedules') {
      // Calculate total filled cells across all year+class combinations
      const allSchedules = editedProps.schedules || {};
      const totalFilled = Object.values(allSchedules).reduce((sum: number, schedule: any) => {
        return sum + Object.keys(schedule).length;
      }, 0);
      const years = editedProps.years || definition.defaultProps.years;
      const classesPerYear = editedProps.classesPerYear || definition.defaultProps.classesPerYear;
      const totalCombinations = years.length * classesPerYear.length;
      
      return (
        <div key={key} className="space-y-2">
          <Label className="text-sm font-medium">Timetable Schedule</Label>
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-auto py-2.5 text-left flex flex-col items-start gap-1">
                  <div className="font-semibold text-sm">Edit Timetables</div>
                  <div className="text-xs text-muted-foreground">
                    {totalFilled} cells filled • {totalCombinations} timetables
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Timetable Schedule</DialogTitle>
                  <DialogDescription>
                    Select a year and class, then click cells to edit. Changes save automatically to live preview.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 pr-2">
                  <TimetableEditor
                    days={editedProps.days || definition.defaultProps.days}
                    periods={editedProps.periods || definition.defaultProps.periods}
                    years={editedProps.years || definition.defaultProps.years}
                    classesPerYear={editedProps.classesPerYear || definition.defaultProps.classesPerYear}
                    schedules={editedProps.schedules || {}}
                    onSchedulesChange={(schedules) => updateProp('schedules', schedules)}
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Timetable
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Timetable Preview</DialogTitle>
                  <DialogDescription>
                    Live preview of how the timetable will appear on your site
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {React.createElement(definition.component, editedProps)}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    // Handle different prop types
    if (typeof value === 'boolean') {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      
      return (
        <div key={key} className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card">
          <Label htmlFor={key} className="cursor-pointer text-sm font-medium">
            {capitalizedLabel}
          </Label>
          <Switch
            id={key}
            checked={editedProps[key] ?? value}
            onCheckedChange={(checked) => updateProp(key, checked)}
          />
        </div>
      );
    }

    if (key.includes('alignment') || key.includes('layout') || key.includes('height')) {
      const options = definition.defaultProps[key];
      // Try to get enum values from the default prop if it's a string
      let enumValues: string[] = [];
      
      if (key === 'alignment') enumValues = ['left', 'center', 'right'];
      if (key === 'layout') {
        if (block.type === 'staff') enumValues = ['grid', 'list'];
        if (block.type === 'events') enumValues = ['list', 'calendar', 'cards'];
        if (block.type === 'news') enumValues = ['cards', 'list', 'featured'];
        if (block.type === 'timetable') enumValues = ['weekly', 'daily', 'period'];
        if (block.type === 'schoolCalendar') enumValues = ['cards', 'timeline'];
        if (block.type === 'holidays') enumValues = ['cards', 'timeline'];
      }
      if (key === 'height') enumValues = ['small', 'medium', 'large', 'full'];
      if (key === 'spacing') enumValues = ['compact', 'normal', 'spacious'];

      if (enumValues.length > 0) {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">{capitalizedLabel}</Label>
            <Select
              value={editedProps[key] ?? value}
              onValueChange={(newValue) => updateProp(key, newValue)}
            >
              <SelectTrigger id={key} className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enumValues.map((option) => (
                  <SelectItem key={option} value={option} className="capitalize">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
    }

    if (typeof value === 'number') {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">{capitalizedLabel}</Label>
          <Input
            id={key}
            type="number"
            value={editedProps[key] ?? value}
            onChange={(e) => updateProp(key, parseInt(e.target.value))}
            className="h-9"
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      
      if (key.includes('content') || key.includes('bio') || key.includes('description')) {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">{capitalizedLabel}</Label>
            <Textarea
              id={key}
              value={editedProps[key] ?? value}
              onChange={(e) => updateProp(key, e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        );
      }
      
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">{capitalizedLabel}</Label>
          <Input
            id={key}
            value={editedProps[key] ?? value}
            onChange={(e) => updateProp(key, e.target.value)}
            className="h-9"
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      // Hide days and periods - they're too cluttered
      if (key === 'days' || key === 'periods') {
        return null;
      }
      
      // Show years and classes in a compact way for timetable
      if (key === 'years' || key === 'classesPerYear') {
        const label = key === 'years' ? 'Year Groups' : 'Classes';
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              {(editedProps[key] || value).join(', ')}
            </div>
          </div>
        );
      }
      
      // Special handling for holidays - add ICS import
      if (block?.type === 'holidays' && key === 'holidays') {
        const handleICSImport = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
              const parsedHolidays = parseICSFile(content);
              // Merge with existing holidays
              const existing = editedProps[key] || value;
              updateProp(key, [...existing, ...parsedHolidays]);
            } catch (error) {
              console.error('Failed to parse ICS file:', error);
              alert('Failed to parse ICS file. Please ensure it\'s a valid calendar file.');
            }
          };
          reader.readAsText(file);
          
          // Reset input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
        
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Holidays</Label>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ics,.ical"
                  onChange={handleICSImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Import ICS
                </Button>
              </div>
            </div>
            <ArrayEditor
              label=""
              value={editedProps[key] || value}
              onChange={(newValue) => updateProp(key, newValue)}
              itemSchema="object"
            />
          </div>
        );
      }
      
      const itemSchema = value.length > 0 && typeof value[0] === 'object' ? 'object' : 'simple';
      return (
        <div key={key}>
          <ArrayEditor
            label={key}
            value={editedProps[key] || value}
            onChange={(newValue) => updateProp(key, newValue)}
            itemSchema={itemSchema}
          />
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="space-y-2">
          <Label>{key} (object)</Label>
          <p className="text-sm text-muted-foreground">
            Object editing coming soon
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Block Info Header */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{definition.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">{definition.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{definition.description}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Properties */}
      <div className="space-y-4">
        {Object.entries(definition.defaultProps).map(([key, value]) => {
          const field = renderField(key, value);
          return field ? <div key={key}>{field}</div> : null;
        })}
      </div>
    </div>
  );
}

