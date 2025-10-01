import type { RenderComponentProps } from '@/lib/registry/types';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsSliderProps {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
  layout?: 'single' | 'grid';
}

/**
 * Testimonials Component
 *
 * Displays customer/student testimonials with ratings and author information
 */
export default function TestimonialsSlider({ props }: RenderComponentProps<TestimonialsSliderProps>) {
  const {
    heading = 'What Our Community Says',
    subheading,
    testimonials = [
      {
        quote: 'This school has transformed my child\'s learning experience. The teachers are dedicated and the curriculum is outstanding.',
        author: 'Sarah Johnson',
        role: 'Parent',
        rating: 5,
      },
      {
        quote: 'The best decision we made was enrolling our daughter here. She\'s thriving academically and socially.',
        author: 'Michael Chen',
        role: 'Parent',
        rating: 5,
      },
      {
        quote: 'The supportive environment and excellent facilities have made my educational journey exceptional.',
        author: 'Emma Thompson',
        role: 'Student',
        rating: 5,
      },
    ],
    layout = 'grid',
  } = props;

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {subheading && (
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-3">
              {subheading}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            {heading}
          </h2>
        </div>

        {/* Testimonials */}
        <div className={layout === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'max-w-3xl mx-auto'}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50/50 rounded-xl border border-black/5 transition-all duration-300 hover:border-black/10 hover:shadow-sm"
            >
              {/* Rating */}
              {testimonial.rating && renderStars(testimonial.rating)}

              {/* Quote */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                    {testimonial.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
