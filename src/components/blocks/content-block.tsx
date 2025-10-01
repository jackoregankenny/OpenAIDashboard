import { ContentBlockProps } from '@/lib/blocks/types';
import { registerBlock } from '@/lib/blocks/registry';

export function ContentBlock({ 
  title, 
  content, 
  alignment = 'left',
  backgroundColor 
}: ContentBlockProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div 
      className="px-6 py-12 md:px-12"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className={`max-w-4xl mx-auto ${alignmentClasses[alignment]}`}>
        {title && (
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
        )}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'content',
  name: 'Text Content',
  description: 'Rich text content block',
  component: ContentBlock,
  defaultProps: {
    content: 'Enter your content here...',
    alignment: 'left',
  },
  icon: 'type',
  category: 'content',
});

