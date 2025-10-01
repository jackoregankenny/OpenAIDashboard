import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface SpotlightStat {
  label: string;
  value: string;
}

interface SpotlightAction {
  label: string;
  link?: LinkTarget | string;
  emphasis?: 'primary' | 'secondary';
}

interface HeroSpotlightProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  highlightTag?: string;
  stats?: SpotlightStat[];
  actions?: SpotlightAction[];
  overlayIntensity?: 'light' | 'medium' | 'dark';
  alignment?: 'left' | 'center';
}

const overlayMap: Record<NonNullable<HeroSpotlightProps['overlayIntensity']>, string> = {
  light: 'bg-black/30',
  medium: 'bg-black/50',
  dark: 'bg-black/70',
};

export default function HeroSpotlight({
  props,
}: RenderComponentProps<HeroSpotlightProps>) {
  const {
    eyebrow = 'Spotlight',
    title = 'STEM Innovation Program',
    description =
      'Where curious minds meet cutting-edge technology. Our award-winning STEM academy blends robotics, engineering, and design thinking.',
    backgroundImage =
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
    backgroundVideo,
    highlightTag = 'National Blue Ribbon School',
    stats = [
      { value: '98%', label: 'Graduates admitted to first-choice university' },
      { value: '12', label: 'Competitive robotics championships' },
      { value: '4.9/5', label: 'Family satisfaction score' },
    ],
    actions = [
      { label: 'Explore the Program', link: '#program', emphasis: 'primary' },
      { label: 'Watch Student Stories', link: '#stories', emphasis: 'secondary' },
    ],
    overlayIntensity = 'medium',
    alignment = 'left',
  } = props;

  const contentAlignment = alignment === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <section className="relative min-h-[640px] overflow-hidden text-white">
      {backgroundVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className={`absolute inset-0 ${overlayMap[overlayIntensity]}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-900/30 to-primary-900/10" />

      <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col justify-center px-6 py-24">
        <div className={`flex max-w-3xl flex-col gap-6 ${contentAlignment}`}>
          {highlightTag && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {highlightTag}
            </span>
          )}

          <div className="flex flex-col gap-4">
            {eyebrow && (
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">{eyebrow}</span>
            )}
            <h1 className="text-4xl font-light leading-tight md:text-6xl">{title}</h1>
            {description && <p className="text-lg text-white/80 md:text-xl">{description}</p>}
          </div>

          {actions?.length ? (
            <div className="flex flex-wrap gap-4">
              {actions.map((action) => {
                const href = resolveLinkHref(action.link) || '#';
                const isPrimary = action.emphasis !== 'secondary';
                return (
                  <a
                    key={action.label}
                    href={href}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
                      isPrimary
                        ? 'bg-white text-primary-700 hover:bg-primary-100'
                        : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {action.label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        {stats?.length ? (
          <div className="mt-16 grid gap-6 rounded-3xl bg-white/10 p-8 backdrop-blur md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border-white/10 md:border-r last:border-none md:last:border-r-0">
                <div className="pr-6">
                  <div className="text-3xl font-semibold md:text-4xl">{stat.value}</div>
                  <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
