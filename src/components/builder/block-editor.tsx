'use client';

import { useState, useEffect } from 'react';
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

interface BlockEditorProps {
  block: Block | null;
  onSave: (block: Block) => void;
  onCancel: () => void;
  onLiveUpdate?: (block: Block) => void;
}

export function BlockEditor({ block, onSave, onCancel, onLiveUpdate }: BlockEditorProps) {
  const [editedProps, setEditedProps] = useState<any>(block?.props || {});

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
    // Special handling for timetable schedule
    if (block.type === 'timetable' && key === 'schedule') {
      return (
        <div key={key} className="space-y-2">
          <Label>Timetable Schedule</Label>
          <TimetableEditor
            days={editedProps.days || definition.defaultProps.days}
            periods={editedProps.periods || definition.defaultProps.periods}
            schedule={editedProps.schedule || {}}
            onChange={(schedule) => updateProp('schedule', schedule)}
          />
        </div>
      );
    }

    // Handle different prop types
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between space-x-2">
          <Label htmlFor={key} className="cursor-pointer">{key}</Label>
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
      }
      if (key === 'height') enumValues = ['small', 'medium', 'large', 'full'];
      if (key === 'spacing') enumValues = ['compact', 'normal', 'spacious'];

      if (enumValues.length > 0) {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Select
              value={editedProps[key] ?? value}
              onValueChange={(newValue) => updateProp(key, newValue)}
            >
              <SelectTrigger id={key}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enumValues.map((option) => (
                  <SelectItem key={option} value={option}>
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
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            type="number"
            value={editedProps[key] ?? value}
            onChange={(e) => updateProp(key, parseInt(e.target.value))}
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      if (key.includes('content') || key.includes('bio') || key.includes('description')) {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Textarea
              id={key}
              value={editedProps[key] ?? value}
              onChange={(e) => updateProp(key, e.target.value)}
              rows={4}
            />
          </div>
        );
      }
      
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            value={editedProps[key] ?? value}
            onChange={(e) => updateProp(key, e.target.value)}
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Edit {definition.name}</CardTitle>
            <CardDescription className="text-xs">{definition.description}</CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">
            Live Preview
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(definition.defaultProps).map(([key, value], index) => (
          <div key={key}>
            {renderField(key, value)}
            {index < Object.entries(definition.defaultProps).length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
        
        <Separator className="my-4" />
        
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

