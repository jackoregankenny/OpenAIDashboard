import { Card, CardContent } from '@/components/ui/card';

export interface ColumnsBlockProps {
  title?: string;
  columns: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
  columnCount?: 2 | 3 | 4;
  backgroundColor?: string;
  centerText?: boolean;
}

export function ColumnsBlock({
  title,
  columns = [],
  columnCount = 3,
  backgroundColor = 'transparent',
  centerText = false,
}: ColumnsBlockProps) {
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div style={{ backgroundColor }} className="px-6 py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
        )}
        <div className={`grid grid-cols-1 ${gridClasses[columnCount]} gap-8`}>
          {columns.map((column, index) => (
            <Card key={index} className="border-0 shadow-none bg-transparent">
              <CardContent className={`pt-6 ${centerText ? 'text-center' : ''}`}>
                {column.icon && (
                  <div className={`text-4xl mb-4 ${centerText ? 'flex justify-center' : ''}`}>
                    {column.icon}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3">{column.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{column.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export const columnsDefaultProps: ColumnsBlockProps = {
  title: 'Why Choose Us',
  columnCount: 3,
  centerText: true,
  columns: [
    {
      title: 'Expert Teachers',
      content: 'Our dedicated faculty brings years of experience and passion to every lesson.',
      icon: '👨‍🏫',
    },
    {
      title: 'Modern Facilities',
      content: 'State-of-the-art classrooms and resources to support 21st-century learning.',
      icon: '🏫',
    },
    {
      title: 'Community Focus',
      content: 'Building strong connections between students, families, and the wider community.',
      icon: '🤝',
    },
  ],
  backgroundColor: 'transparent',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'columns' as any,
  name: 'Columns',
  description: 'Multi-column content layout',
  component: ColumnsBlock,
  defaultProps: columnsDefaultProps,
  icon: '📊',
  category: 'layout',
});

