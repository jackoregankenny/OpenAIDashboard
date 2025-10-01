import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface HeroBasicProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: LinkTarget | string;
  secondaryCtaText?: string;
  secondaryCtaLink?: LinkTarget | string;
  backgroundImage?: string;
  variant?: 'gradient' | 'minimal' | 'image';
}

export default function HeroBasic({
  props,
}: RenderComponentProps<HeroBasicProps>) {
  const {
    title = 'Excellence in Education',
    subtitle,
    description = 'Empowering students to reach their full potential through innovative learning and dedicated teaching',
    primaryCtaText = 'Explore Programs',
    primaryCtaLink = '#',
    secondaryCtaText,
    secondaryCtaLink,
    backgroundImage,
    variant = 'gradient',
  } = props;

  const primaryHref = resolveLinkHref(primaryCtaLink) || undefined;
  const secondaryHref = resolveLinkHref(secondaryCtaLink) || undefined;

  const variantStyles = {
    gradient: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white',
    minimal: 'bg-white text-gray-900',
    image: backgroundImage ? 'text-white' : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white',
  };

  return (
    <section
      className={`relative min-h-[700px] flex items-center px-4 py-24 ${variantStyles[variant]}`}
      style={
        variant === 'image' && backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          {subtitle && (
            <p className={`text-sm font-medium uppercase tracking-wider mb-4 ${
              variant === 'minimal' ? 'text-primary-600' : 'text-white/90'
            }`}>
              {subtitle}
            </p>
          )}

          <h1 className={`text-5xl md:text-7xl font-light tracking-tight mb-6 ${
            variant === 'minimal' ? 'text-gray-900' : 'text-white'
          }`}>
            {title}
          </h1>

          {description && (
            <p className={`text-xl md:text-2xl mb-10 leading-relaxed ${
              variant === 'minimal' ? 'text-gray-600' : 'text-white/90'
            }`}>
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {primaryCtaText && primaryHref && (
              <a
                href={primaryHref}
                className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                  variant === 'minimal'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white text-primary-600 hover:bg-gray-50'
                }`}
              >
                {primaryCtaText}
              </a>
            )}

            {secondaryCtaText && secondaryHref && (
              <a
                href={secondaryHref}
                className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                  variant === 'minimal'
                    ? 'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                    : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20'
                }`}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
