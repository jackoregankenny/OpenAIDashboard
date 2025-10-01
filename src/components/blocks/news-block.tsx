import { NewsBlockProps } from '@/lib/blocks/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { registerBlock } from '@/lib/blocks/registry';

export function NewsBlock({ 
  title, 
  items, 
  layout = 'cards',
  itemsPerRow = 3 
}: NewsBlockProps) {
  if (layout === 'featured' && items.length > 0) {
    const [featured, ...rest] = items;
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Featured article */}
          <Card className="overflow-hidden md:grid md:grid-cols-2">
            {featured.image && (
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <CardHeader>
                <CardDescription>{featured.date}</CardDescription>
                <CardTitle className="text-2xl">{featured.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                {featured.link && (
                  <Button asChild>
                    <a href={featured.link}>Read More</a>
                  </Button>
                )}
              </CardContent>
            </div>
          </Card>

          {/* Other articles */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(rest.length, itemsPerRow)} gap-6`}>
            {rest.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                {item.image && (
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardDescription>{item.date}</CardDescription>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.excerpt}</p>
                  {item.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.link}>Read More</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex gap-4">
                {item.image && (
                  <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{item.date}</p>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.excerpt}</p>
                  {item.link && (
                    <Button variant="link" size="sm" className="p-0" asChild>
                      <a href={item.link}>Read More →</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Cards layout (default)
  return (
    <div className="px-6 py-12 md:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div 
        className="grid gap-6 max-w-7xl mx-auto"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${itemsPerRow === 1 ? '100%' : itemsPerRow === 2 ? '400px' : '300px'}, 1fr))` }}
      >
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden flex flex-col">
            {item.image && (
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardDescription>{item.date}</CardDescription>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-1">{item.excerpt}</p>
              {item.link && (
                <Button variant="outline" size="sm" asChild>
                  <a href={item.link}>Read More</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'news',
  name: 'News Feed',
  description: 'Latest news and announcements',
  component: NewsBlock,
  defaultProps: {
    title: 'Latest News',
    items: [],
    layout: 'cards',
    itemsPerRow: 3,
  },
  icon: 'newspaper',
  category: 'content',
});

