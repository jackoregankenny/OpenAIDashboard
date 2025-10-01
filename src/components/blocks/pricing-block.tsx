import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export interface PricingBlockProps {
  title?: string;
  description?: string;
  plans: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    ctaText?: string;
    ctaLink?: string;
    highlighted?: boolean;
  }>;
  backgroundColor?: string;
}

export function PricingBlock({
  title = 'Fees & Pricing',
  description,
  plans = [],
  backgroundColor = 'transparent',
}: PricingBlockProps) {
  return (
    <div style={{ backgroundColor }} className="px-6 py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <a href={plan.ctaLink || '#'}>
                    {plan.ctaText || 'Learn More'}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export const pricingDefaultProps: PricingBlockProps = {
  title: 'School Fees',
  description: 'Transparent pricing for quality education',
  plans: [
    {
      name: 'Primary',
      price: '$8,000',
      period: 'year',
      description: 'Years 1-6',
      features: [
        'Core curriculum subjects',
        'After-school care available',
        'Sports and music programs',
        'Library access',
        'School lunches included',
      ],
      ctaText: 'Enroll Now',
      ctaLink: '#enroll',
    },
    {
      name: 'Secondary',
      price: '$12,000',
      period: 'year',
      description: 'Years 7-10',
      features: [
        'Comprehensive curriculum',
        'Elective subjects',
        'STEM programs',
        'Sports excellence programs',
        'Career counseling',
        'Device program included',
      ],
      ctaText: 'Enroll Now',
      ctaLink: '#enroll',
      highlighted: true,
    },
    {
      name: 'Senior',
      price: '$14,000',
      period: 'year',
      description: 'Years 11-12',
      features: [
        'University preparation',
        'VCE/IB programs',
        'Advanced subjects',
        'Career guidance',
        'University applications support',
        'Study facilities',
      ],
      ctaText: 'Enroll Now',
      ctaLink: '#enroll',
    },
  ],
  backgroundColor: 'transparent',
};

// Auto-register this block
import { registerBlock } from '@/lib/blocks/registry';
registerBlock({
  type: 'pricing' as any,
  name: 'Pricing',
  description: 'Pricing tables and fee structures',
  component: PricingBlock,
  defaultProps: pricingDefaultProps,
  icon: '💰',
  category: 'content',
});

