import { Button } from '@/components/ui/button';

export interface HeroImageBlockProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  overlay?: 'light' | 'dark' | 'none';
  overlayOpacity?: number;
  alignment?: 'left' | 'center' | 'right';
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  height?: 'small' | 'medium' | 'large' | 'full';
}

export function HeroImageBlock({
  title = 'Inspiring Excellence',
  subtitle,
  description = 'Join our community of learners and achievers',
  backgroundImage = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600',
  overlay = 'dark',
  overlayOpacity = 50,
  alignment = 'center',
  primaryCta = { text: 'Get Started', link: '#' },
  secondaryCta,
  height = 'large',
}: HeroImageBlockProps) {
  const heightClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[600px]',
    full: 'min-h-screen',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const overlayColor = overlay === 'light' ? 'bg-white' : overlay === 'dark' ? 'bg-black' : 'bg-transparent';
  const overlayStyle = overlay !== 'none' ? { opacity: overlayOpacity / 100 } : {};

  return (
    <div className={`relative w-full ${heightClasses[height]} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      {overlay !== 'none' && (
        <div 
          className={`absolute inset-0 ${overlayColor}`}
          style={overlayStyle}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-12 flex flex-col ${alignmentClasses[alignment]}`}>
        {subtitle && (
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
            {subtitle}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow">
            {description}
          </p>
        )}
        <div className={`flex flex-wrap gap-4 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {primaryCta && (
            <Button size="lg" asChild>
              <a href={primaryCta.link}>{primaryCta.text}</a>
            </Button>
          )}
          {secondaryCta && (
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur" asChild>
              <a href={secondaryCta.link}>{secondaryCta.text}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const heroImageDefaultProps: HeroImageBlockProps = {
  title: 'Inspiring Excellence',
  subtitle: 'Since 1950',
  description: 'Join our community of learners and achievers',
  backgroundImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600',
  overlay: 'dark',
  overlayOpacity: 50,
  alignment: 'center',
  primaryCta: { text: 'Get Started', link: '#' },
  secondaryCta: { text: 'Learn More', link: '#about' },
  height: 'large',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'heroImage' as any,
  name: 'Hero with Background',
  description: 'Full-width hero with background image',
  component: HeroImageBlock,
  defaultProps: heroImageDefaultProps,
  icon: '🌄',
  category: 'hero',
});

