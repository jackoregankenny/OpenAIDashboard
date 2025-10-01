import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface ProgramStat {
  label: string;
  value: string;
}

interface ProgramCard {
  title: string;
  description: string;
  icon?: string;
  highlights?: string[];
  stats?: ProgramStat[];
  linkLabel?: string;
  link?: LinkTarget | string;
}

interface ProgramsCardsProps {
  heading?: string;
  subheading?: string;
  programs?: ProgramCard[];
}

const defaultPrograms: ProgramCard[] = [
  {
    title: 'Health Sciences Academy',
    description:
      'Clinical simulation labs, biomedical research electives, and partnerships with regional hospitals.',
    highlights: ['Certified nursing assistant pathway', 'Emergency medicine capstone', 'Mentorship with practicing clinicians'],
    stats: [
      { label: 'Clinical Hours', value: '120+' },
      { label: 'Dual Credit', value: '6 courses' },
    ],
    linkLabel: 'Explore health sciences',
    link: '#health-sciences',
  },
  {
    title: 'Global Studies & World Languages',
    description:
      'AP world languages, cultural immersion trips, and international service learning projects.',
    highlights: ['Four language tracks', 'Exchange programs in 3 countries', 'Diploma of global competency'],
    stats: [
      { label: 'Language Proficiency', value: '95%+' },
      { label: 'Study Abroad', value: '45 students' },
    ],
    linkLabel: 'View global studies',
    link: '#global-studies',
  },
  {
    title: 'Entrepreneurship & Innovation Lab',
    description:
      'Startup incubator, design thinking studios, and venture pitch competitions judged by alumni.',
    highlights: ['Shark Tank-style pitch night', 'Incubator coaching', 'Micro-grants for student ventures'],
    stats: [
      { label: 'Ventures Launched', value: '32' },
      { label: 'Seed Funding', value: '$85K' },
    ],
    linkLabel: 'Tour innovation lab',
    link: '#innovation-lab',
  },
];

const iconFallback = '🎓';

export default function ProgramsCards({ props }: RenderComponentProps<ProgramsCardsProps>) {
  const {
    heading = 'Signature Programs that Inspire Possibility',
    subheading =
      'From health sciences to entrepreneurship, students immerse themselves in pathways that translate passion into purpose.',
    programs = defaultPrograms,
  } = props;

  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Academic Highlights</p>
          <h2 className="mt-3 text-3xl font-light md:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-base text-white/70 md:text-lg">{subheading}</p>}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => {
            const href = resolveLinkHref(program.link);
            return (
              <article
                key={program.title}
                className="flex h-full flex-col justify-between rounded-3xl bg-white/5 p-8 shadow-xl shadow-primary-900/40 ring-1 ring-white/10"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-2xl">
                      {program.icon ?? iconFallback}
                    </span>
                    <h3 className="text-xl font-semibold text-white">{program.title}</h3>
                  </div>
                  <p className="text-sm text-white/70">{program.description}</p>
                  {program.highlights?.length ? (
                    <ul className="space-y-2 text-sm text-white/80">
                      {program.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-400" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="mt-8 space-y-4">
                  {program.stats?.length ? (
                    <dl className="grid grid-cols-2 gap-4 text-sm text-white/80">
                      {program.stats.map((stat) => (
                        <div key={`${program.title}-${stat.label}`} className="rounded-2xl bg-white/10 p-3 text-center">
                          <dt className="text-xs uppercase tracking-widest text-primary-200">{stat.label}</dt>
                          <dd className="mt-1 text-lg font-semibold text-white">{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {program.linkLabel && href && (
                    <a
                      href={href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white"
                    >
                      {program.linkLabel}
                      <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
