import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface ContentSectionProps {
  subheading?: string;
  heading?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  variant?: 'default' | 'featured' | 'minimal';
  backgroundColor?: string;
  buttonText?: string;
  buttonLink?: LinkTarget | string;
}

export default function ContentSection({
  props,
}: RenderComponentProps<ContentSectionProps>) {
  const {
    subheading,
    heading = 'About Our School',
    content = 'We are dedicated to providing quality education and fostering a nurturing environment for all our students. Our commitment to excellence drives everything we do.',
    alignment = 'center',
    variant = 'default',
    backgroundColor,
    buttonText,
    buttonLink,
  } = props;

  const buttonHref = resolveLinkHref(buttonLink) || undefined;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const variantClasses = {
    default: 'bg-white',
    featured: 'bg-gray-50/50',
    minimal: 'bg-transparent',
  };

  return (
    <section
      className={`py-20 px-4 ${variantClasses[variant]}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className={`max-w-4xl ${alignmentClasses[alignment]}`}>
        {subheading && (
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-3">
            {subheading}
          </p>
        )}

        {heading && (
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            {heading}
          </h2>
        )}

        {content && (
          <div className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            <p>{content}</p>
          </div>
        )}

        {buttonText && buttonHref && (
          <a
            href={buttonHref}
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-300"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
