import { Button } from '@/components/ui/button';

export interface HeroSplitBlockProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imagePosition?: 'left' | 'right';
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  backgroundColor?: string;
}

export function HeroSplitBlock({
  title = 'Welcome to Our School',
  subtitle = 'Excellence in Education',
  description = 'Providing quality education and nurturing future leaders since 1950.',
  image = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  imagePosition = 'right',
  primaryCta = { text: 'Learn More', link: '#' },
  secondaryCta,
  backgroundColor = 'transparent',
}: HeroSplitBlockProps) {
  const content = (
    <div className="flex flex-col justify-center h-full px-6 md:px-12 py-12">
      {subtitle && (
        <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
          {subtitle}
        </p>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        {primaryCta && (
          <Button size="lg" asChild>
            <a href={primaryCta.link}>{primaryCta.text}</a>
          </Button>
        )}
        {secondaryCta && (
          <Button size="lg" variant="outline" asChild>
            <a href={secondaryCta.link}>{secondaryCta.text}</a>
          </Button>
        )}
      </div>
    </div>
  );

  const imageContent = (
    <div className="relative h-full min-h-[400px] md:min-h-[500px]">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div style={{ backgroundColor }} className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
          {imagePosition === 'left' ? (
            <>
              <div className="order-2 md:order-1">{imageContent}</div>
              <div className="order-1 md:order-2">{content}</div>
            </>
          ) : (
            <>
              <div className="order-1">{content}</div>
              <div className="order-2">{imageContent}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const heroSplitDefaultProps: HeroSplitBlockProps = {
  title: 'Welcome to Our School',
  subtitle: 'Excellence in Education',
  description: 'Providing quality education and nurturing future leaders since 1950.',
  image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  imagePosition: 'right',
  primaryCta: { text: 'Learn More', link: '#' },
  secondaryCta: { text: 'Contact Us', link: '#contact' },
  backgroundColor: 'transparent',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'heroSplit' as any,
  name: 'Hero Split',
  description: 'Split hero with image and text side-by-side',
  component: HeroSplitBlock,
  defaultProps: heroSplitDefaultProps,
  icon: '🖼️',
  category: 'hero',
});

