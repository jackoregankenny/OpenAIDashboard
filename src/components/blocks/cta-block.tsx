import { CTABlockProps } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { registerBlock } from '@/lib/blocks/registry';
import { ArrowRight } from 'lucide-react';

export function CTABlock({ 
  title, 
  subtitle, 
  primaryButton,
  secondaryButton,
  backgroundImage,
  backgroundColor = '#3b82f6',
  layout = 'centered'
}: CTABlockProps) {
  if (layout === 'split') {
    return (
      <div className="px-6 py-20 md:px-12">
        <div 
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})` : undefined,
            backgroundColor: !backgroundImage ? backgroundColor : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center p-12 md:p-16">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
              {subtitle && (
                <p className="text-xl text-white/90 leading-relaxed">{subtitle}</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg py-6 shadow-xl"
                asChild
              >
                <a href={primaryButton.link} className="flex items-center gap-2">
                  {primaryButton.text}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              {secondaryButton && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 text-lg py-6"
                  asChild
                >
                  <a href={secondaryButton.link}>{secondaryButton.text}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Centered layout (default)
  return (
    <div className="px-6 py-20 md:px-12">
      <div 
        className="max-w-5xl mx-auto text-center rounded-3xl p-12 md:p-20 shadow-2xl"
        style={{
          backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})` : undefined,
          backgroundColor: !backgroundImage ? backgroundColor : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg py-6 px-8 shadow-xl"
            asChild
          >
            <a href={primaryButton.link} className="flex items-center gap-2">
              {primaryButton.text}
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          {secondaryButton && (
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 text-lg py-6 px-8"
              asChild
            >
              <a href={secondaryButton.link}>{secondaryButton.text}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'cta',
  name: 'Call to Action',
  description: 'Prominent call-to-action section',
  component: CTABlock,
  defaultProps: {
    title: 'Ready to Join Our School?',
    subtitle: 'Start your journey with us today and experience excellence in education.',
    primaryButton: {
      text: 'Apply Now',
      link: '/apply',
    },
    secondaryButton: {
      text: 'Schedule a Tour',
      link: '/tour',
    },
    backgroundColor: '#3b82f6',
    layout: 'centered',
  },
  icon: 'megaphone',
  category: 'interactive',
});

