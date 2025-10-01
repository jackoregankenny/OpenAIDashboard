import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface CTABannerProps {
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: LinkTarget | string;
  secondaryButtonText?: string;
  secondaryButtonLink?: LinkTarget | string;
  variant?: 'gradient' | 'solid' | 'minimal';
  alignment?: 'left' | 'center';
}

/**
 * CTA Banner Component
 *
 * Prominent call-to-action section to drive conversions
 */
export default function CTABanner({ props }: RenderComponentProps<CTABannerProps>) {
  const {
    heading = 'Ready to Get Started?',
    description = 'Join our community and experience excellence in education.',
    primaryButtonText = 'Enroll Now',
    primaryButtonLink = '/enroll',
    secondaryButtonText,
    secondaryButtonLink,
    variant = 'gradient',
    alignment = 'center',
  } = props;

  const variantClasses = {
    gradient: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white',
    solid: 'bg-primary-600 text-white',
    minimal: 'bg-gray-50 text-gray-900',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  const buttonVariantClasses = {
    gradient: {
      primary: 'bg-white text-primary-600 hover:bg-gray-50',
      secondary: 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20',
    },
    solid: {
      primary: 'bg-white text-primary-600 hover:bg-gray-50',
      secondary: 'bg-transparent text-white border-2 border-white/50 hover:bg-white/10',
    },
    minimal: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50',
    },
  };

  const primaryHref = resolveLinkHref(primaryButtonLink) || undefined;
  const secondaryHref = resolveLinkHref(secondaryButtonLink) || undefined;

  return (
    <section className={`py-20 px-4 ${variantClasses[variant]}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`flex flex-col gap-8 ${alignmentClasses[alignment]}`}>
          {/* Content */}
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              {heading}
            </h2>
            <p className={`text-lg md:text-xl ${variant === 'minimal' ? 'text-gray-600' : 'text-white/90'}`}>
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {primaryButtonText && primaryHref && (
              <a
                href={primaryHref}
                className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 ${buttonVariantClasses[variant].primary}`}
              >
                {primaryButtonText}
              </a>
            )}

            {secondaryButtonText && secondaryHref && (
              <a
                href={secondaryHref}
                className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 ${buttonVariantClasses[variant].secondary}`}
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
