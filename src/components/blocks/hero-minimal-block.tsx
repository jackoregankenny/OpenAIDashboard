import { Button } from '@/components/ui/button';

export interface HeroMinimalBlockProps {
  title: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  backgroundColor?: string;
  textColor?: string;
}

export function HeroMinimalBlock({
  title = 'Simple. Powerful. Effective.',
  subtitle,
  description = 'Everything you need to succeed, nothing you don\'t.',
  alignment = 'center',
  primaryCta = { text: 'Get Started', link: '#' },
  secondaryCta,
  backgroundColor = 'transparent',
  textColor,
}: HeroMinimalBlockProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div 
      style={{ backgroundColor, color: textColor }}
      className="w-full py-20 md:py-32 px-6"
    >
      <div className={`max-w-5xl mx-auto flex flex-col ${alignmentClasses[alignment]}`}>
        {subtitle && (
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
            {subtitle}
          </p>
        )}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
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
            <Button size="lg" variant="ghost" asChild>
              <a href={secondaryCta.link}>{secondaryCta.text}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const heroMinimalDefaultProps: HeroMinimalBlockProps = {
  title: 'Simple. Powerful. Effective.',
  subtitle: 'Modern Education',
  description: 'Everything you need to succeed, nothing you don\'t.',
  alignment: 'center',
  primaryCta: { text: 'Get Started', link: '#' },
  secondaryCta: { text: 'Learn More', link: '#about' },
  backgroundColor: 'transparent',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'heroMinimal' as any,
  name: 'Hero Minimal',
  description: 'Clean, minimalist hero section',
  component: HeroMinimalBlock,
  defaultProps: heroMinimalDefaultProps,
  icon: '✨',
  category: 'hero',
});

