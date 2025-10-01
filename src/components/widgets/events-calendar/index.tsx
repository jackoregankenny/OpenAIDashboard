import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface EventItem {
  title: string;
  dateLabel: string;
  timeLabel?: string;
  location?: string;
  description?: string;
  audience?: string;
  linkLabel?: string;
  link?: LinkTarget | string;
  featured?: boolean;
}

interface EventsCalendarProps {
  heading?: string;
  subheading?: string;
  events?: EventItem[];
  footerNote?: string;
}

const defaultEvents: EventItem[] = [
  {
    title: 'STEM Innovation Showcase',
    dateLabel: 'Thu · Feb 27, 2025',
    timeLabel: '6:30 – 8:30 PM',
    location: 'Innovation Lab · Building C',
    description: 'Experience student prototypes, robotics demonstrations, and live coding challenges.',
    audience: 'Open to families & community partners',
    linkLabel: 'Reserve seats',
    link: '#rsvp-stem',
    featured: true,
  },
  {
    title: 'Spring Arts Festival',
    dateLabel: 'Sat · Mar 15, 2025',
    timeLabel: '1:00 – 4:00 PM',
    location: 'Performing Arts Center',
    description: 'Gallery walk, live performances, and interactive workshops led by student artists.',
    audience: 'All grade levels · Free admission',
    linkLabel: 'View program',
    link: '#arts-festival',
  },
  {
    title: 'Admissions Coffee & Tour',
    dateLabel: 'Wed · Mar 26, 2025',
    timeLabel: '9:00 – 10:30 AM',
    location: 'Welcome Center Lobby',
    description: 'Meet our admissions team, hear from student ambassadors, and tour campus.',
    audience: 'Prospective families (K-12)',
    linkLabel: 'Sign up',
    link: '#tour',
  },
];

export default function EventsCalendar({ props }: RenderComponentProps<EventsCalendarProps>) {
  const {
    heading = 'Upcoming Events & Experiences',
    subheading = 'Join us on campus to connect with faculty, explore programs, and celebrate our community.',
    events = defaultEvents,
    footerNote = 'Looking ahead? Download the full calendar in the parent portal.',
  } = props;

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Campus Calendar</p>
          <h2 className="text-3xl font-light text-gray-900 md:text-4xl">{heading}</h2>
          {subheading && <p className="text-base text-gray-600 md:text-lg">{subheading}</p>}
        </div>

        <div className="mt-12 space-y-4">
          {events.map((event) => {
            const href = resolveLinkHref(event.link);
            return (
              <article
                key={`${event.title}-${event.dateLabel}`}
                className={`flex flex-col gap-6 rounded-3xl border border-gray-200 bg-gray-50/60 p-6 transition-shadow md:flex-row md:items-center ${
                  event.featured ? 'border-primary-200 bg-primary-50/50 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex w-full flex-col gap-2 md:w-52">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
                    {event.dateLabel}
                  </p>
                  {event.timeLabel && (
                    <p className="text-base font-semibold text-gray-900">{event.timeLabel}</p>
                  )}
                  {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                  {event.audience && (
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-500">{event.audience}</p>
                  )}
                </div>

                {href && event.linkLabel && (
                  <a
                    href={href}
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                  >
                    {event.linkLabel}
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {footerNote && <p className="mt-10 text-center text-sm text-gray-500">{footerNote}</p>}
      </div>
    </section>
  );
}
