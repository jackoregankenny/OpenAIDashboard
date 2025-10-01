import { TestimonialsBlockProps } from '@/lib/blocks/types';
import { Card, CardContent } from '@/components/ui/card';
import { registerBlock } from '@/lib/blocks/registry';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

export function TestimonialsBlock({ 
  title, 
  testimonials, 
  layout = 'grid' 
}: TestimonialsBlockProps) {
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (layout === 'featured' && testimonials.length > 0) {
    const [featured, ...rest] = testimonials;
    return (
      <div className="px-6 py-16 md:px-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
          
          {/* Featured testimonial */}
          <Card className="mb-8 overflow-hidden border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <Quote className="w-12 h-12 text-primary/20 mb-6" />
              <p className="text-2xl font-medium mb-6 leading-relaxed">&ldquo;{featured.content}&rdquo;</p>
              <div className="flex items-center gap-4">
                {featured.image && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <Image
                      src={featured.image}
                      alt={featured.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{featured.name}</p>
                  <p className="text-muted-foreground">{featured.role}</p>
                  {renderRating(featured.rating)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-sm mb-4 line-clamp-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {testimonial.image && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      {renderRating(testimonial.rating)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="px-6 py-16 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-4 mt-auto">
                  {testimonial.image && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/10">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    {renderRating(testimonial.rating)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'testimonials',
  name: 'Testimonials',
  description: 'Customer reviews and testimonials',
  component: TestimonialsBlock,
  defaultProps: {
    title: 'What People Say',
    testimonials: [
      {
        name: 'Sarah Mitchell',
        role: 'Parent',
        content: 'The school has provided an exceptional education for my children. The teachers are dedicated and truly care about each student\'s success.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        rating: 5,
      },
      {
        name: 'Michael Chen',
        role: 'Student',
        content: 'I love the extracurricular activities and the supportive environment. This school has helped me discover my passions.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        rating: 5,
      },
      {
        name: 'Emily Rodriguez',
        role: 'Parent',
        content: 'Outstanding academic programs and excellent communication with parents. We couldn\'t be happier with our choice.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        rating: 5,
      },
    ],
    layout: 'grid',
  },
  icon: 'message-square',
  category: 'content',
});

