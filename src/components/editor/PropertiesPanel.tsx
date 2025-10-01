'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { getWidget } from '@/lib/registry/generated';
import { findNodeById } from '@/lib/page-structure/types';
import { getComponentSchema, type PropertyField } from '@/lib/registry/component-schemas';
import { resolveLinkHref, type LinkTarget } from '@/lib/registry/types';
import { useMemo, useState } from 'react';

/**
 * Properties Panel
 *
 * Allows users to edit component properties in real-time
 */
export function PropertiesPanel() {
  const pageTree = useEditorStore((state) => state.pageTree);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const updateNode = useEditorStore((state) => state.updateNode);

  if (!pageTree || !selectedNodeId) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm">No component selected</p>
          <p className="text-xs mt-2">Click a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const selectedNode = findNodeById(pageTree, selectedNodeId);

  if (!selectedNode || selectedNode.type !== 'component' || !selectedNode.componentId) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm">Select a component to edit</p>
        </div>
      </div>
    );
  }

  const widget = getWidget(selectedNode.componentId);

  if (!widget) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-red-500">
          <p className="text-sm">Component not found</p>
        </div>
      </div>
    );
  }

  const props = selectedNode.props || {};

  const handlePropChange = (key: string, value: any) => {
    updateNode(selectedNodeId, {
      props: {
        ...props,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {widget.config.name}
        </h3>
        <p className="text-xs text-gray-500">{widget.config.description}</p>
      </div>

      {/* Properties Form */}
      <div className="p-6 space-y-4">
        <PropertyFields
          componentId={selectedNode.componentId}
          props={props}
          onChange={handlePropChange}
        />
      </div>
    </div>
  );
}

/**
 * Property Fields Component
 *
 * Renders form fields based on component schema
 */
function PropertyFields({
  componentId,
  props,
  onChange,
}: {
  componentId: string;
  props: Record<string, any>;
  onChange: (key: string, value: any) => void;
}) {
  // Get component-specific schema
  const schema = getComponentSchema(componentId);

  if (schema.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        <p>No editable properties defined for this component.</p>
        <AddPropertyButton onChange={onChange} />
      </div>
    );
  }

  return (
    <>
      {schema.map((field) => {
        const value = props[field.key];

        return (
          <PropertyField
            key={field.key}
            field={field}
            value={value}
            onChange={onChange}
          />
        );
      })}

      {/* Add custom property button */}
      <div className="pt-4 border-t border-gray-200">
        <AddPropertyButton onChange={onChange} />
      </div>
    </>
  );
}

/**
 * Single Property Field Renderer
 */
function PropertyField({
  field,
  value,
  onChange,
}: {
  field: PropertyField;
  value: any;
  onChange: (key: string, value: any) => void;
}) {
  switch (field.type) {
    case 'textarea':
      return <TextAreaField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} placeholder={field.placeholder} />;

    case 'url':
      return <TextField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} type="url" placeholder={field.placeholder} />;

    case 'color':
      return <ColorField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} />;

    case 'select':
      return <SelectField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} options={field.options || []} />;

    case 'link':
      return (
        <LinkField
          label={field.label}
          value={value}
          onChange={(val) => onChange(field.key, val)}
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return <NumberField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} min={field.min} max={field.max} />;

    case 'array':
      return <ArrayField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} schema={field.arraySchema!} />;

    case 'text':
    default:
      return <TextField label={field.label} value={value} onChange={(k, v) => onChange(field.key, v)} placeholder={field.placeholder} />;
  }
}

/**
 * Text Field
 */
function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (key: string, value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(label, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

/**
 * Text Area Field
 */
function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (key: string, value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(label, e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-sm"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

/**
 * Number Field
 */
function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  label: string;
  value?: number;
  onChange: (key: string, value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
        {label.replace(/([A-Z])/g, ' $1').trim()}
      </label>
      <input
        type="number"
        value={value || min}
        onChange={(e) => onChange(label, parseInt(e.target.value))}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

/**
 * Color Field
 */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
        {label.replace(/([A-Z])/g, ' $1').trim()}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#3b82f6'}
          onChange={(e) => onChange(label, e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(label, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="#3b82f6"
        />
      </div>
    </div>
  );
}

/**
 * Select Field (for variants, alignment, etc.)
 */
function SelectField({
  label,
  value,
  onChange,
  options = [],
}: {
  label: string;
  value?: string;
  onChange: (key: string, value: string) => void;
  options?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value || options[0] || ''}
        onChange={(e) => onChange(label, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Link Field with internal/external options
 */
function LinkField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: LinkTarget | string | null | undefined;
  onChange: (value: LinkTarget | string) => void;
  placeholder?: string;
}) {
  const pages = useEditorStore((state) => state.pages);

  const normalized = useMemo<LinkTarget>(() => {
    if (typeof value === 'string') {
      if (value.startsWith('/')) {
        const slug = value.replace(/^\//, '');
        return { type: 'internal', path: value, slug };
      }

      return { type: 'external', url: value };
    }

    if (value && typeof value === 'object') {
      if (value.type === 'internal') {
        const path = value.path || (value.slug ? `/${value.slug}` : '');
        return {
          type: 'internal',
          path,
          pageId: value.pageId,
          slug: value.slug ?? path.replace(/^\//, ''),
        };
      }

      if (value.type === 'external') {
        return { type: 'external', url: value.url || '' };
      }
    }

    return { type: 'external', url: '' };
  }, [value]);

  const handleModeChange = (mode: 'internal' | 'external') => {
    if (mode === normalized.type) return;

    if (mode === 'internal') {
      const fallback =
        pages.find((page) => page.id === normalized.pageId) || pages[0] || null;

      if (!fallback) {
        onChange({ type: 'internal', path: '' });
        return;
      }

      onChange({
        type: 'internal',
        path: `/${fallback.slug}`,
        pageId: fallback.id,
        slug: fallback.slug,
      });
      return;
    }

    onChange({ type: 'external', url: normalized.type === 'external' ? normalized.url : '' });
  };

  const handlePageSelect = (pageId: string) => {
    const selected = pages.find((page) => page.id === pageId);
    if (!selected) {
      onChange({ type: 'internal', path: '' });
      return;
    }

    onChange({
      type: 'internal',
      path: `/${selected.slug}`,
      pageId: selected.id,
      slug: selected.slug,
    });
  };

  const handleExternalChange = (url: string) => {
    onChange({ type: 'external', url });
  };

  const isInternal = normalized.type === 'internal';
  const selectValue = isInternal
    ? normalized.pageId ||
      pages.find((page) => `/${page.slug}` === normalized.path)?.id ||
      ''
    : '';

  const hrefPreview = resolveLinkHref(normalized);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleModeChange('internal')}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
            isInternal
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
          }`}
          disabled={!pages.length}
        >
          Internal
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('external')}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
            !isInternal
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
          }`}
        >
          External
        </button>
      </div>

      {isInternal ? (
        <div className="space-y-2">
          <select
            value={selectValue}
            onChange={(event) => handlePageSelect(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
          >
            <option value="" disabled>
              Select a page
            </option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title} — /{page.slug}
              </option>
            ))}
          </select>

          {!pages.length && (
            <p className="text-xs text-gray-500">
              Create a page to enable internal links.
            </p>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={normalized.type === 'external' ? normalized.url || '' : ''}
          onChange={(event) => handleExternalChange(event.target.value)}
          placeholder={placeholder || 'https://example.com'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
        />
      )}

      {hrefPreview && (
        <p className="mt-2 text-xs text-gray-500 break-all">
          Destination: <span className="font-medium text-gray-700">{hrefPreview}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Array Field Editor
 */
function ArrayField({
  label,
  value,
  onChange,
  schema,
}: {
  label: string;
  value?: any[];
  onChange: (key: string, value: any[]) => void;
  schema: import('@/lib/registry/component-schemas').ArrayFieldSchema;
}) {
  const items = value || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItem: Record<string, any> = {};
    schema.fields.forEach((field) => {
      newItem[field.key] = field.type === 'number' ? (field.min || 0) : '';
    });
    onChange(label, [...items, newItem]);
    setExpandedIndex(items.length);
  };

  const handleUpdateItem = (index: number, key: string, itemValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: itemValue };
    onChange(label, newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(label, newItems);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange(label, newItems);
    setExpandedIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange(label, newItems);
    setExpandedIndex(index + 1);
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <button
          onClick={handleAddItem}
          className="px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add {label.slice(0, -1)}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">
          No {label.toLowerCase()} yet. Click "+ Add" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Item Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}. {item[schema.fields[0]?.key] || `${label.slice(0, -1)} ${index + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Move buttons */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}
                    disabled={index === items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this item?')) handleDeleteItem(index);
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    🗑️
                  </button>
                  {/* Expand toggle */}
                  <span className="text-xs text-gray-400 ml-1">
                    {expandedIndex === index ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {/* Item Fields (Expanded) */}
              {expandedIndex === index && (
                <div className="p-3 border-t border-gray-200 space-y-3 bg-gray-50">
                  {schema.fields.map((field) => (
                    <div key={field.key}>
                      <PropertyField
                        field={field}
                        value={item[field.key]}
                        onChange={(_, v) => handleUpdateItem(index, field.key, v)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Add Property Button
 */
function AddPropertyButton({ onChange }: { onChange: (key: string, value: any) => void }) {
  const [showInput, setShowInput] = useState(false);
  const [newKey, setNewKey] = useState('');

  const handleAdd = () => {
    if (newKey.trim()) {
      onChange(newKey.trim(), '');
      setNewKey('');
      setShowInput(false);
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
      >
        + Add Custom Property
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={newKey}
        onChange={(e) => setNewKey(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Property name"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        autoFocus
      />
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
      >
        Add
      </button>
      <button
        onClick={() => setShowInput(false)}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
