import { UniformBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShirtIcon, Check } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function UniformBlock({
  title,
  subtitle,
  categories,
  showImages = true,
}: UniformBlockProps) {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShirtIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  {category.season && (
                    <Badge variant="secondary" className="mt-1">
                      {category.season}
                    </Badge>
                  )}
                </div>
              </div>

              {showImages && category.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {category.notes && (
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  {category.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

registerBlock({
  type: 'uniform',
  name: 'School Uniform',
  description: 'Display uniform requirements and dress code',
  component: UniformBlock,
  defaultProps: {
    title: 'School Uniform',
    subtitle: 'Dress code and uniform requirements',
    categories: [
      {
        name: 'Boys Uniform',
        season: 'All Year',
        items: [
          'Navy blue blazer with school badge',
          'White shirt with school tie',
          'Grey trousers',
          'Black leather shoes',
          'Navy blue socks',
        ],
        notes: 'Blazers must be worn at all times except during PE',
      },
      {
        name: 'Girls Uniform',
        season: 'All Year',
        items: [
          'Navy blue blazer with school badge',
          'White blouse with school tie',
          'Grey skirt or trousers',
          'Black leather shoes',
          'Navy blue socks or tights',
        ],
        notes: 'Skirts must be knee-length',
      },
      {
        name: 'PE Kit',
        season: 'Sports',
        items: [
          'School PE shirt (house colors)',
          'Navy blue shorts or sports skirt',
          'White sports socks',
          'Trainers (non-marking soles)',
          'Navy blue tracksuit (winter)',
        ],
        notes: 'All PE kit must be clearly labeled',
      },
    ],
    showImages: false,
  },
  icon: 'shirt',
  category: 'content',
});

