import type { RenderComponentProps } from '@/lib/registry/types';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
  icon?: string;
}

interface StatsShowcaseProps {
  heading?: string;
  subheading?: string;
  stats?: Stat[];
  variant?: 'default' | 'cards' | 'minimal';
  backgroundColor?: string;
}

/**
 * Stats Showcase Component
 *
 * Display key metrics and achievements in an engaging format
 */
export default function StatsShowcase({ props }: RenderComponentProps<StatsShowcaseProps>) {
  const {
    heading,
    subheading,
    stats = [
      { value: '500', suffix: '+', label: 'Students Enrolled', icon: '👨‍🎓' },
      { value: '25', suffix: '+', label: 'Years of Excellence', icon: '🏆' },
      { value: '98', suffix: '%', label: 'Satisfaction Rate', icon: '⭐' },
      { value: '50', suffix: '+', label: 'Expert Teachers', icon: '👩‍🏫' },
    ],
    variant = 'default',
    backgroundColor,
  } = props;

  const variantClasses = {
    default: 'bg-transparent',
    cards: 'p-8 bg-white rounded-xl border border-black/10',
    minimal: 'border-l-4 border-primary-500 pl-6',
  };

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-16">
            {subheading && (
              <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-3">
                {subheading}
              </p>
            )}
            {heading && (
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-300 ${variantClasses[variant]}`}
            >
              {/* Icon */}
              {stat.icon && (
                <div className="text-4xl mb-3">
                  {stat.icon}
                </div>
              )}

              {/* Value */}
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl md:text-6xl font-light text-primary-600">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-3xl md:text-4xl font-light text-primary-500">
                    {stat.suffix}
                  </span>
                )}
              </div>

              {/* Label */}
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
