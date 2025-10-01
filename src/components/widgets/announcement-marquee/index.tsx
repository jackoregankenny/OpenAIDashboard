import type { CSSProperties } from 'react';
import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface AnnouncementItem {
  text: string;
  href?: LinkTarget | string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}

interface AnnouncementMarqueeProps {
  label?: string;
  items?: AnnouncementItem[];
  showIcon?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

const toneBadgeStyles: Record<Required<AnnouncementItem>['tone'], string> = {
  info: 'bg-white/10 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-400 text-gray-900',
  danger: 'bg-rose-500 text-white',
};

const durationMap: Record<NonNullable<AnnouncementMarqueeProps['speed']>, string> = {
  slow: '30s',
  normal: '20s',
  fast: '12s',
};

const marqueeStyles = `
@keyframes announcementMarqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.announcement-marquee-track {
  display: flex;
  width: max-content;
  gap: 2rem;
  animation: announcementMarqueeScroll var(--marquee-duration, 20s) linear infinite;
}
`;

export default function AnnouncementMarquee({
  props,
}: RenderComponentProps<AnnouncementMarqueeProps>) {
  const {
    label = 'On Campus Now',
    items = [
      { text: 'School closed on Friday for professional development', tone: 'warning' },
      { text: 'Spring musical tickets on sale now', tone: 'info' },
      { text: 'Congratulations to our varsity robotics team—state champions!', tone: 'success' },
    ],
    showIcon = true,
    speed = 'normal',
  } = props;

  const durationValue = durationMap[speed];

  const renderItem = (item: AnnouncementItem, index: number) => {
    const badgeTone = item.tone ?? 'info';
    const content = (
      <span className="flex items-center gap-3 text-sm font-medium">
        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${toneBadgeStyles[badgeTone]}`}>
          {badgeTone}
        </span>
        <span className="text-white/90">{item.text}</span>
      </span>
    );

    const href = resolveLinkHref(item.href);

    return href ? (
      <a key={`${item.text}-${index}`} href={href} className="flex items-center gap-3 text-sm">
        {content}
      </a>
    ) : (
      <div key={`${item.text}-${index}`} className="flex items-center gap-3 text-sm">
        {content}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-primary-700 text-white">
      <style>{marqueeStyles}</style>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {showIcon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl">
            📣
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">{label}</p>
          <p className="text-sm text-white/80">
            Stay current with important campus announcements and celebrations.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div
          className="announcement-marquee-track px-4 py-3"
          style={{ '--marquee-duration': durationValue } as CSSProperties}
        >
          {[...items, ...items].map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </section>
  );
}
