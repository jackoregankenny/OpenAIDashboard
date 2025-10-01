import type { RenderComponentProps } from '@/lib/registry/types';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  heading?: string;
  subheading?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'bordered' | 'elevated';
}

/**
 * Features Grid Component
 *
 * Displays features in a clean grid layout with icons and descriptions
 */
export default function FeaturesGrid({ props }: RenderComponentProps<FeaturesGridProps>) {
  const {
    heading = 'Our Features',
    subheading,
    features = [
      {
        icon: '🎓',
        title: 'Quality Education',
        description: 'World-class curriculum designed for student success and personal growth',
      },
      {
        icon: '👥',
        title: 'Expert Faculty',
        description: 'Experienced educators dedicated to nurturing every student\'s potential',
      },
      {
        icon: '🏆',
        title: 'Proven Results',
        description: 'Track record of academic excellence and student achievement',
      },
    ],
    columns = 3,
    variant = 'default',
  } = props;

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const variantClasses = {
    default: 'bg-white/50 backdrop-blur-sm',
    bordered: 'bg-white border border-black/10 hover:border-black/20',
    elevated: 'bg-white shadow-sm hover:shadow-md',
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50/50">
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

        {/* Features Grid */}
        <div className={`grid gap-8 ${columnClasses[columns]}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl transition-all duration-300 ${variantClasses[variant]}`}
            >
              {/* Icon */}
              {feature.icon && (
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-3xl mb-5">
                  {feature.icon}
                </div>
              )}

              {/* Content */}
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
