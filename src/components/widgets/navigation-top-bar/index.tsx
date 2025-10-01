import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface NavigationLink {
  label: string;
  href?: LinkTarget | string;
  isActive?: boolean;
}

interface AnnouncementBanner {
  text: string;
  link?: LinkTarget | string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}

interface NavigationTopBarProps {
  logoText?: string;
  logoSubtitle?: string;
  logoImage?: string;
  primaryLinks?: NavigationLink[];
  utilityLinks?: NavigationLink[];
  announcement?: AnnouncementBanner;
  sticky?: boolean;
  background?: 'light' | 'dark' | 'translucent';
  applyButtonLabel?: string;
  applyButtonLink?: LinkTarget | string;
}

const toneStyles: Record<NonNullable<AnnouncementBanner['tone']>, string> = {
  info: 'bg-primary-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-black',
  danger: 'bg-rose-600 text-white',
};

const backgroundStyles: Record<NonNullable<NavigationTopBarProps['background']>, string> = {
  light: 'bg-white text-gray-900 shadow-sm',
  dark: 'bg-gray-900 text-white shadow-lg',
  translucent: 'bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white shadow-sm backdrop-blur',
};

export default function NavigationTopBar({
  props,
}: RenderComponentProps<NavigationTopBarProps>) {
  const {
    logoText = 'North Ridge Academy',
    logoSubtitle = 'Inspiring Excellence Since 1952',
    logoImage,
    primaryLinks = [
      { label: 'Academics', href: '#academics', isActive: true },
      { label: 'Admissions', href: '#admissions' },
      { label: 'Student Life', href: '#student-life' },
      { label: 'Athletics', href: '#athletics' },
    ],
    utilityLinks = [
      { label: 'Parents', href: '#parents' },
      { label: 'Students', href: '#students' },
      { label: 'Staff', href: '#staff' },
    ],
    announcement,
    sticky = true,
    background = 'light',
    applyButtonLabel = 'Apply Now',
    applyButtonLink = '#apply',
  } = props;

  const applyHref = resolveLinkHref(applyButtonLink) || undefined;

  const navClassName = [
    backgroundStyles[background],
    'w-full transition-shadow duration-300',
    sticky ? 'sticky top-0 z-50' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const renderLinks = (links?: NavigationLink[], isPrimary?: boolean) =>
    links?.map((link) => {
      const href = resolveLinkHref(link.href) || '#';
      return (
        <a
          key={link.label}
          href={href}
          className={`text-sm font-medium transition-colors ${
            isPrimary
              ? link.isActive
                ? 'text-primary-600 dark:text-primary-300'
                : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'
              : 'text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {link.label}
        </a>
      );
    });

  return (
    <header className="w-full">
      {announcement?.text && (
        <div
          className={`px-4 py-2 text-sm font-medium text-center ${
            toneStyles[announcement.tone ?? 'info']
          }`}
        >
          {announcement.link ? (
            <a
              className="underline-offset-2 hover:underline"
              href={resolveLinkHref(announcement.link) || '#'}
            >
              {announcement.text}
            </a>
          ) : (
            announcement.text
          )}
        </div>
      )}

      <nav className={navClassName}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {logoImage ? (
              <img
                src={logoImage}
                alt={logoText}
                className="h-12 w-12 rounded-full border border-primary-100 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white font-semibold">
                {logoText
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <span className="block text-base font-semibold tracking-tight">{logoText}</span>
              {logoSubtitle && (
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {logoSubtitle}
                </span>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {renderLinks(primaryLinks, true)}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 md:flex">
              {renderLinks(utilityLinks)}
            </div>
            {applyHref && applyButtonLabel && (
              <a
                href={applyHref}
                className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                {applyButtonLabel}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 text-sm lg:hidden dark:border-gray-800">
          <div className="flex flex-wrap gap-3">
            {primaryLinks?.slice(0, 3).map((link) => {
              const href = resolveLinkHref(link.href) || '#';
              return (
                <a
                  key={link.label}
                  href={href}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <a
            className="text-xs font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700 dark:text-primary-300"
            href={applyHref || '#'}
          >
            Menu
          </a>
        </div>
      </nav>
    </header>
  );
}
