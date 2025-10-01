'use client';
import { useMemo, useState } from 'react';
import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface TabHighlight {
  label: string;
}

interface AcademicTab {
  id: string;
  title: string;
  summary: string;
  highlights?: TabHighlight[];
  image?: string;
  ctaLabel?: string;
  ctaLink?: LinkTarget | string;
}

interface AcademicsTabsProps {
  heading?: string;
  description?: string;
  tabs?: AcademicTab[];
  defaultTabId?: string;
}

export default function AcademicsTabs({ props }: RenderComponentProps<AcademicsTabsProps>) {
  const {
    heading = 'Academic Pathways Designed for Every Learner',
    description =
      'Explore rigorous academics, hands-on STEM labs, and arts programming that empowers students to discover their passions.',
    tabs = [
      {
        id: 'stem',
        title: 'STEM Academy',
        summary:
          'Project-based learning with robotics, engineering design studios, and dual-credit calculus partnerships.',
        highlights: [
          { label: 'Robotics & coding from Grade 6' },
          { label: 'State-of-the-art fabrication lab' },
          { label: 'University mentorships' },
        ],
        image:
          'https://images.unsplash.com/photo-1581091012184-7af44b7bb1b4?auto=format&fit=crop&w=800&q=80',
        ctaLabel: 'View STEM curriculum',
        ctaLink: '#stem',
      },
      {
        id: 'humanities',
        title: 'Humanities & Leadership',
        summary:
          'Interdisciplinary seminars, Model UN, and leadership practicums focused on global citizenship and civic voice.',
        highlights: [
          { label: 'Capstone research conference' },
          { label: 'Writing center with peer mentorship' },
          { label: 'Leadership certificate track' },
        ],
        image:
          'https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=800&q=80',
        ctaLabel: 'See humanities highlights',
        ctaLink: '#humanities',
      },
      {
        id: 'arts',
        title: 'Visual & Performing Arts',
        summary:
          'Award-winning theater, orchestra, and studio art programs with residencies from working professionals.',
        highlights: [
          { label: 'Professional-grade black box theater' },
          { label: 'Annual fine arts showcase' },
          { label: 'Portfolio development coaching' },
        ],
        image:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        ctaLabel: 'Tour the arts facilities',
        ctaLink: '#arts',
      },
    ],
    defaultTabId,
  } = props;

  const safeTabs = useMemo(() => tabs.filter((tab) => tab.id && tab.title), [tabs]);
  const defaultActive = defaultTabId && safeTabs.some((tab) => tab.id === defaultTabId)
    ? defaultTabId
    : safeTabs[0]?.id;
  const [activeTabId, setActiveTabId] = useState(defaultActive);
  const activeTab = safeTabs.find((tab) => tab.id === activeTabId) ?? safeTabs[0];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Academic Programs</p>
          <h2 className="mt-3 text-3xl font-light text-gray-900 md:text-4xl">{heading}</h2>
          {description && <p className="mt-4 text-base text-gray-600 md:text-lg">{description}</p>}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-2 rounded-3xl bg-gray-50 p-4">
            {safeTabs.map((tab) => {
              const isActive = tab.id === activeTab?.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full rounded-2xl px-5 py-4 text-left transition-all ${
                    isActive
                      ? 'bg-white shadow-sm ring-2 ring-primary-200'
                      : 'hover:bg-white/80'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-400">
                    {String(tab.id)}
                  </span>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{tab.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{tab.summary}</p>
                </button>
              );
            })}
          </div>

          {activeTab && (
            <div className="overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
              {activeTab.image && (
                <div
                  className="h-56 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeTab.image})` }}
                />
              )}
              <div className="space-y-6 px-8 py-10">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-primary-200">Featured Program</p>
                  <h3 className="text-3xl font-light">{activeTab.title}</h3>
                  <p className="text-base text-white/80">{activeTab.summary}</p>
                </div>

                {activeTab.highlights?.length ? (
                  <ul className="grid gap-3 md:grid-cols-2">
                    {activeTab.highlights.map((highlight) => (
                      <li key={highlight.label} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                          ✓
                        </span>
                        <span>{highlight.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {activeTab.ctaLabel && (
                  <a
                    href={resolveLinkHref(activeTab.ctaLink) || '#'}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                  >
                    {activeTab.ctaLabel}
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
