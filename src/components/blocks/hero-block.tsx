import { HeroBlockProps } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { registerBlock } from '@/lib/blocks/registry';

export function HeroBlock({ 
  title, 
  subtitle, 
  backgroundImage, 
  alignment = 'center',
  cta,
  height = 'large'
}: HeroBlockProps) {
  const heightClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[400px]',
    large: 'min-h-[500px]',
    full: 'min-h-screen',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div 
      className={`relative flex flex-col justify-center ${heightClasses[height]} px-6 py-16 md:px-12 ${alignmentClasses[alignment]}`}
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            {subtitle}
          </p>
        )}
        {cta && (
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 shadow-lg"
            asChild
          >
            <a href={cta.link}>{cta.text}</a>
          </Button>
        )}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'hero',
  name: 'Hero Section',
  description: 'Large banner with title, subtitle, and call-to-action',
  component: HeroBlock,
  defaultProps: {
    title: 'Welcome to Our School',
    subtitle: 'Building excellence in education',
    alignment: 'center',
    height: 'large',
  },
  icon: 'image',
  category: 'content',
});

