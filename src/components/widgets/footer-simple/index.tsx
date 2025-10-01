import type { RenderComponentProps } from '@/lib/registry/types';

interface Link {
  label: string;
  href: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface FooterSimpleProps {
  schoolName?: string;
  tagline?: string;
  copyrightYear?: number;
  links?: Link[];
  socialLinks?: SocialLink[];
  variant?: 'dark' | 'light' | 'branded';
  backgroundColor?: string;
}

export default function FooterSimple({
  props,
}: RenderComponentProps<FooterSimpleProps>) {
  const {
    schoolName = 'Our School',
    tagline,
    copyrightYear = new Date().getFullYear(),
    links = [
      { label: 'About', href: '/about' },
      { label: 'Admissions', href: '/admissions' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    socialLinks = [],
    variant = 'dark',
    backgroundColor,
  } = props;

  const variantClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50 text-gray-900 border-t border-gray-200',
    branded: 'bg-primary-600 text-white',
  };

  return (
    <footer
      className={`py-12 px-4 ${variantClasses[variant]}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="text-2xl font-light mb-2">{schoolName}</h3>
            {tagline && (
              <p className={`text-sm ${variant === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                {tagline}
              </p>
            )}
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`text-sm transition-colors ${
                  variant === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${variant === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
            © {copyrightYear} {schoolName}. All rights reserved.
          </p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    variant === 'light'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  aria-label={social.platform}
                >
                  {social.icon || social.platform.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
