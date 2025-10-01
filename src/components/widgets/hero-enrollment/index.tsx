import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface ChecklistItem {
  label: string;
  complete?: boolean;
}

interface ContactCard {
  name: string;
  title?: string;
  phone?: string;
  email?: string;
}

interface HeroEnrollmentProps {
  title?: string;
  subtitle?: string;
  deadlineDate?: string;
  deadlineLabel?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: LinkTarget | string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: LinkTarget | string;
  checklist?: ChecklistItem[];
  contact?: ContactCard;
  backgroundPattern?: 'grid' | 'gradient' | 'solid';
}

const patternMap: Record<NonNullable<HeroEnrollmentProps['backgroundPattern']>, string> = {
  grid: 'bg-white',
  gradient: 'bg-gradient-to-br from-primary-50 via-white to-white',
  solid: 'bg-white',
};

export default function HeroEnrollment({
  props,
}: RenderComponentProps<HeroEnrollmentProps>) {
  const {
    title = 'Admissions Open for Fall 2025',
    subtitle = 'Discover a learning community built to help every student thrive.',
    deadlineDate = 'Priority Deadline · March 1, 2025',
    deadlineLabel = 'Priority Applications',
    description =
      'Submit your application early to secure priority consideration, scholarship eligibility, and first-choice program placement.',
    ctaLabel = 'Start Application',
    ctaLink = '#apply',
    secondaryCtaLabel = 'Schedule a Campus Tour',
    secondaryCtaLink = '#visit',
    checklist = [
      { label: 'Complete online application' },
      { label: 'Request transcripts and recommendations' },
      { label: 'Submit scholarship essay (optional)' },
    ],
    contact = {
      name: 'Alexis Reed',
      title: 'Director of Admissions',
      phone: '(555) 867-5309',
      email: 'admissions@northridge.edu',
    },
    backgroundPattern = 'grid',
  } = props;

  const primaryHref = resolveLinkHref(ctaLink) || undefined;
  const secondaryHref = resolveLinkHref(secondaryCtaLink) || undefined;

  return (
    <section className={`${patternMap[backgroundPattern]} px-6 py-20`}> 
      <div className="mx-auto flex max-w-6xl flex-col gap-12 rounded-3xl bg-white p-10 shadow-xl shadow-primary-100/60 ring-1 ring-primary-50 md:flex-row">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
            {deadlineLabel}
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-light tracking-tight text-gray-900 md:text-6xl">{title}</h1>
            {subtitle && <p className="text-lg text-primary-600">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-primary-600/10 px-5 py-4 text-primary-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white font-semibold">
              ⏰
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary-500">Deadline</p>
              <p className="text-base font-semibold">{deadlineDate}</p>
            </div>
          </div>

          {description && <p className="text-base text-gray-600 md:text-lg">{description}</p>}

          <div className="flex flex-wrap gap-4">
            {primaryHref && ctaLabel && (
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                {ctaLabel}
              </a>
            )}

            {secondaryHref && secondaryCtaLabel && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:border-primary-400 hover:text-primary-700"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col justify-between gap-8 rounded-2xl bg-gray-50 p-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Application Checklist</h2>
            <ul className="space-y-3">
              {checklist?.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    ✓
                  </span>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {contact && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">
                Need help? Contact us
              </p>
              <p className="mt-3 text-lg font-semibold text-gray-900">{contact.name}</p>
              {contact.title && <p className="text-sm text-gray-500">{contact.title}</p>}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {contact.phone && <a href={`tel:${contact.phone}`} className="block hover:text-primary-600">{contact.phone}</a>}
                {contact.email && <a href={`mailto:${contact.email}`} className="block hover:text-primary-600">{contact.email}</a>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
