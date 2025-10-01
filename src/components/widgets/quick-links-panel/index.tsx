import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface QuickLinkItem {
  label: string;
  description?: string;
  icon?: string;
  link?: LinkTarget | string;
  audience?: 'parents' | 'students' | 'staff' | 'community';
}

interface QuickLinksPanelProps {
  heading?: string;
  subheading?: string;
  links?: QuickLinkItem[];
}

const defaultLinks: QuickLinkItem[] = [
  {
    label: 'Parent Portal',
    description: 'Grades, attendance, lunch balances, and teacher communication.',
    icon: '👪',
    link: '#parent-portal',
    audience: 'parents',
  },
  {
    label: 'Student Canvas',
    description: 'Assignments, submissions, and classroom resources.',
    icon: '🎒',
    link: '#student-canvas',
    audience: 'students',
  },
  {
    label: 'Staff Intranet',
    description: 'HR links, professional learning, and district updates.',
    icon: '🧑‍🏫',
    link: '#staff-intranet',
    audience: 'staff',
  },
  {
    label: 'Athletics Schedule',
    description: 'Team calendars, rosters, and ticket information.',
    icon: '🏅',
    link: '#athletics',
    audience: 'community',
  },
  {
    label: 'Transportation Updates',
    description: 'Bus routes, delays, and contact information.',
    icon: '🚌',
    link: '#transportation',
    audience: 'parents',
  },
  {
    label: 'Lunch Menu',
    description: 'Weekly meal plans and nutrition information.',
    icon: '🍎',
    link: '#lunch-menu',
    audience: 'students',
  },
];

const audienceBadge: Record<NonNullable<QuickLinkItem['audience']>, string> = {
  parents: 'bg-amber-100 text-amber-700',
  students: 'bg-sky-100 text-sky-700',
  staff: 'bg-violet-100 text-violet-700',
  community: 'bg-emerald-100 text-emerald-700',
};

export default function QuickLinksPanel({ props }: RenderComponentProps<QuickLinksPanelProps>) {
  const {
    heading = 'Quick Links',
    subheading = 'One-tap access to the resources families and staff use most often.',
    links = defaultLinks,
  } = props;

  return (
    <section className="bg-primary-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Resources</p>
            <h2 className="mt-3 text-3xl font-light text-gray-900 md:text-4xl">{heading}</h2>
            {subheading && <p className="mt-4 max-w-2xl text-base text-gray-600 md:text-lg">{subheading}</p>}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => {
            const href = resolveLinkHref(item.link) || '#';
            return (
              <a
                key={item.label}
                href={href}
                className="group flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-primary-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-2xl">
                      {item.icon ?? '🔗'}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{item.label}</p>
                      {item.audience && (
                        <span
                          className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${audienceBadge[item.audience]}`}
                        >
                          {item.audience}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                  Open link
                  <span aria-hidden>→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
