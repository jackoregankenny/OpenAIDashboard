'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ArrayEditorProps {
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
  itemSchema?: 'simple' | 'object';
}

export function ArrayEditor({ label, value = [], onChange, itemSchema = 'object' }: ArrayEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  const addItem = () => {
    if (itemSchema === 'simple') {
      onChange([...value, '']);
    } else {
      onChange([...value, {}]);
    }
    setExpandedItems(new Set([...expandedItems, value.length]));
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const updateItem = (index: number, newItem: any) => {
    const newValue = [...value];
    newValue[index] = newItem;
    onChange(newValue);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === value.length - 1) return;
    
    const newValue = [...value];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
    onChange(newValue);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const renderObjectEditor = (item: any, index: number) => {
    const isExpanded = expandedItems.has(index);
    
    return (
      <Card key={index} className="mb-3">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpanded(index)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <CardTitle className="text-sm">Item {index + 1}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveItem(index, 'down')}
              disabled={index === value.length - 1}
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0 px-4 pb-4 space-y-3">
            {Object.keys(item || {}).length === 0 && (
              <p className="text-xs text-muted-foreground">No properties yet. Add them below:</p>
            )}
            {Object.entries(item || {}).map(([key, val]) => {
              // Convert value to string for display
              const stringValue = typeof val === 'string' ? val : JSON.stringify(val);
              const isLongText = typeof val === 'string' && val.length > 50;
              
              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-medium">{key}</Label>
                  {isLongText ? (
                    <Textarea
                      value={stringValue}
                      onChange={(e) => updateItem(index, { ...item, [key]: e.target.value })}
                      rows={3}
                      className="text-xs font-mono"
                    />
                  ) : (
                    <Input
                      value={stringValue}
                      onChange={(e) => updateItem(index, { ...item, [key]: e.target.value })}
                      className="text-xs"
                      placeholder={`Enter ${key}`}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    );
  };

  const renderSimpleEditor = (item: string, index: number) => {
    return (
      <div key={index} className="flex gap-2 items-center mb-2">
        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Input
          value={item || ''}
          onChange={(e) => updateItem(index, e.target.value)}
          className="flex-1 text-sm"
          placeholder="Enter value"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive flex-shrink-0"
          onClick={() => removeItem(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{label}</Label>
        <span className="text-xs text-muted-foreground">{value.length} items</span>
      </div>
      
      <Separator />
      
      <div className="max-h-96 overflow-y-auto pr-2">
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items yet. Click "Add Item" below.
          </p>
        ) : (
          <div>
            {itemSchema === 'object'
              ? value.map((item, index) => renderObjectEditor(item, index))
              : value.map((item, index) => renderSimpleEditor(item, index))}
          </div>
        )}
      </div>

      <Button
        onClick={addItem}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

