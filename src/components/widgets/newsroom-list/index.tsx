import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface NewsItem {
  title: string;
  category?: string;
  publishedAt?: string;
  author?: string;
  excerpt?: string;
  image?: string;
  link?: LinkTarget | string;
  linkLabel?: string;
}

interface NewsroomListProps {
  heading?: string;
  subheading?: string;
  items?: NewsItem[];
  viewAllLabel?: string;
  viewAllLink?: LinkTarget | string;
}

const defaultNews: NewsItem[] = [
  {
    title: 'Robotics Team Wins Back-to-Back State Championship',
    category: 'STEM',
    publishedAt: 'February 14, 2025',
    author: 'Communications Office',
    excerpt:
      'The North Ridge Robohawks secured their second consecutive title with a groundbreaking autonomous challenge.',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    linkLabel: 'Read story',
    link: '#robotics-story',
  },
  {
    title: 'Students Launch Community Garden for Local Food Pantry',
    category: 'Service Learning',
    publishedAt: 'January 28, 2025',
    author: 'Student Life Team',
    excerpt:
      'More than 120 volunteers contributed design ideas, engineering plans, and hours of hands-on work across campus.',
    image:
      'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=900&q=80',
    linkLabel: 'Learn more',
    link: '#community-garden',
  },
  {
    title: 'Faculty Spotlight: Dr. Priya Desai Receives National Teaching Award',
    category: 'Faculty',
    publishedAt: 'January 12, 2025',
    author: 'Academic Affairs',
    excerpt:
      'Dr. Desai was honored for her innovative approach to interdisciplinary science instruction.',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
    linkLabel: 'Celebrate with us',
    link: '#faculty-award',
  },
];

export default function NewsroomList({ props }: RenderComponentProps<NewsroomListProps>) {
  const {
    heading = 'In the News',
    subheading = 'Spotlight on student achievements, faculty innovation, and community partnerships.',
    items = defaultNews,
    viewAllLabel = 'View all news',
    viewAllLink = '#newsroom',
  } = props;

  const viewAllHref = resolveLinkHref(viewAllLink) || undefined;

  return (
    <section className="bg-gray-900 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Newsroom</p>
            <h2 className="mt-3 text-3xl font-light md:text-4xl">{heading}</h2>
            {subheading && <p className="mt-4 max-w-2xl text-base text-white/70">{subheading}</p>}
          </div>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              {viewAllLabel}
              <span aria-hidden>→</span>
            </a>
          )}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const href = resolveLinkHref(item.link);
            return (
              <article
                key={`${item.title}-${item.publishedAt ?? 'news'}`}
                className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 shadow-lg shadow-black/30 ring-1 ring-white/10"
              >
                {item.image && (
                  <div
                    className="h-48 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary-300">
                      <span>{item.category ?? 'Update'}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    {item.author && <p className="text-xs text-white/60">By {item.author}</p>}
                  </div>
                  {item.excerpt && <p className="flex-1 text-sm text-white/70">{item.excerpt}</p>}
                  {href && item.linkLabel && (
                    <a
                      href={href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white"
                    >
                      {item.linkLabel}
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
