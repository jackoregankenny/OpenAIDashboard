import { StatsBlockProps } from '@/lib/blocks/types';
import { registerBlock } from '@/lib/blocks/registry';
import { Badge } from '@/components/ui/badge';

export function StatsBlock({ title, stats, columns = 4, backgroundColor }: StatsBlockProps) {
  return (
    <div 
      className="px-6 py-16 md:px-12"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        )}
        <div 
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${300 / columns * 2}px, 1fr))` }}
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'stats',
  name: 'Statistics',
  description: 'Display key numbers and achievements',
  component: StatsBlock,
  defaultProps: {
    title: 'Our Impact',
    stats: [
      {
        value: '1,500+',
        label: 'Students',
        description: 'Enrolled annually',
      },
      {
        value: '98%',
        label: 'Graduation Rate',
        description: 'Class of 2024',
      },
      {
        value: '25+',
        label: 'Years',
        description: 'Of excellence',
      },
      {
        value: '50+',
        label: 'Programs',
        description: 'Academic & extracurricular',
      },
    ],
    columns: 4,
  },
  icon: 'bar-chart',
  category: 'content',
});

