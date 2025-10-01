export interface LogosBlockProps {
  title?: string;
  subtitle?: string;
  logos: Array<{
    name: string;
    image: string;
    link?: string;
  }>;
  backgroundColor?: string;
  grayscale?: boolean;
}

export function LogosBlock({
  title,
  subtitle = 'Trusted by leading organizations',
  logos = [],
  backgroundColor = 'transparent',
  grayscale = true,
}: LogosBlockProps) {
  return (
    <div style={{ backgroundColor }} className="px-6 py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {logos.map((logo, index) => {
            const content = (
              <img
                src={logo.image}
                alt={logo.name}
                className={`h-12 w-auto mx-auto object-contain transition-all ${
                  grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''
                }`}
              />
            );

            return logo.link ? (
              <a
                key={index}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                {content}
              </a>
            ) : (
              <div key={index} className="flex items-center justify-center">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const logosDefaultProps: LogosBlockProps = {
  title: 'Our Partners',
  subtitle: 'Proud to work with leading educational organizations',
  grayscale: true,
  logos: [
    { name: 'Partner 1', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=50&fit=crop' },
    { name: 'Partner 2', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=50&fit=crop' },
    { name: 'Partner 3', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&h=50&fit=crop' },
    { name: 'Partner 4', image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=50&fit=crop' },
    { name: 'Partner 5', image: 'https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?w=150&h=50&fit=crop' },
  ],
  backgroundColor: 'transparent',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'logos' as any,
  name: 'Logo Grid',
  description: 'Partner logos and sponsors',
  component: LogosBlock,
  defaultProps: logosDefaultProps,
  icon: '🏢',
  category: 'media',
});

