'use client';

import { useEffect, useMemo, useState } from 'react';
import type { RenderComponentProps } from '@/lib/registry/types';

type CalendarEvent = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  url?: string;
  allDay?: boolean;
};

interface CalendarIcalProps {
  heading?: string;
  description?: string;
  feedUrl?: string;
  maxEvents?: number;
  includePastDays?: number;
  emptyStateMessage?: string;
}

const FALLBACK_EVENTS = () => {
  const now = new Date();
  const makeDate = (dayOffset: number, hour = 9, minute = 0) => {
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    date.setDate(now.getDate() + dayOffset);
    return date;
  };

  return [
    {
      uid: 'sample-1',
      title: 'STEM Club Showcase',
      description:
        'Students present robotics, coding, and engineering projects to families and the community.',
      location: 'Innovation Lab',
      start: makeDate(3, 18, 0),
      end: makeDate(3, 19, 30),
      url: '#',
    },
    {
      uid: 'sample-2',
      title: 'Parent-Teacher Conferences',
      description: 'Schedule one-on-one time with staff to review student progress.',
      location: 'Main Building · Rooms 101-110',
      start: makeDate(7, 16, 0),
      end: makeDate(7, 20, 0),
    },
    {
      uid: 'sample-3',
      title: 'School Spirit Week Kickoff',
      description: 'Pep rally, club fair, and live performances to start the celebration.',
      location: 'Gymnasium',
      start: makeDate(11, 13, 0),
      end: makeDate(11, 15, 0),
    },
  ];
};

function unfoldLines(lines: string[]): string[] {
  return lines.reduce<string[]>((acc, line) => {
    if (/^[ \t]/.test(line) && acc.length > 0) {
      acc[acc.length - 1] += line.slice(1);
    } else {
      acc.push(line);
    }
    return acc;
  }, []);
}

function parseDate(value: string): { date: Date; allDay: boolean } | null {
  const dateTimeMatch = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (dateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds, isZulu] = dateTimeMatch;
    const iso = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${isZulu ? 'Z' : ''}`;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return { date, allDay: false };
  }

  const dateMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return { date, allDay: true };
  }

  return null;
}

function parseICS(text: string): CalendarEvent[] {
  const lines = unfoldLines(text.split(/\r?\n/));
  const events: CalendarEvent[] = [];
  let current: Partial<CalendarEvent & { allDay: boolean }> | null = null;

  lines.forEach((line) => {
    if (line.startsWith('BEGIN:VEVENT')) {
      current = {};
      return;
    }

    if (line.startsWith('END:VEVENT')) {
      if (current?.start && current.title) {
        if (!current.end) {
          current.end = new Date(current.start);
          if (current.allDay) {
            current.end.setHours(23, 59, 59, 999);
          }
        }

        events.push({
          uid: current.uid || `${current.start.getTime()}-${current.title}`,
          title: current.title,
          description: current.description,
          location: current.location,
          start: current.start,
          end: current.end,
          url: current.url,
          allDay: current.allDay,
        });
      }
      current = null;
      return;
    }

    if (!current) return;

    const [rawKey, ...rest] = line.split(':');
    const value = rest.join(':');
    const key = rawKey?.split(';')[0];

    switch (key) {
      case 'UID':
        current.uid = value;
        break;
      case 'SUMMARY':
        current.title = value;
        break;
      case 'DESCRIPTION':
        current.description = value.replace(/\\n/g, '\n');
        break;
      case 'LOCATION':
        current.location = value;
        break;
      case 'URL':
        current.url = value;
        break;
      case 'DTSTART': {
        const parsed = parseDate(value);
        if (parsed) {
          current.start = parsed.date;
          current.allDay = parsed.allDay;
        }
        break;
      }
      case 'DTEND': {
        const parsed = parseDate(value);
        if (parsed) {
          const endDate = new Date(parsed.date);
          if (current.allDay && parsed.allDay) {
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
          }
          current.end = endDate;
        }
        break;
      }
      default:
        break;
    }
  });

  return events;
}

function formatEventRange(event: CalendarEvent) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const start = event.start;
  const end = event.end;

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (event.allDay && sameDay) {
    return `${dateFormatter.format(start)} · All day`;
  }

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} ${timeFormatter.format(start)} → ${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
}

function getFeedLabel(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
}

/**
 * Calendar (iCal) Component
 *
 * Fetches an ICS feed and displays upcoming events in a clean card layout.
 */
export default function CalendarIcal({ props }: RenderComponentProps<CalendarIcalProps>) {
  const {
    heading = 'Upcoming Events',
    description = 'Stay informed with the latest happenings on campus. Subscribe to the calendar to never miss a moment.',
    feedUrl,
    maxEvents = 5,
    includePastDays = 0,
    emptyStateMessage = 'No upcoming events just yet. Check back soon!',
  } = props;

  const safeMaxEvents = Number.isFinite(Number(maxEvents)) ? Math.max(1, Number(maxEvents)) : 5;
  const safePastDays = Math.max(0, Number(includePastDays) || 0);

  const [rawEvents, setRawEvents] = useState<CalendarEvent[]>(() => FALLBACK_EVENTS());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedUrl) {
      setRawEvents(FALLBACK_EVENTS());
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadFeed = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const proxyUrl = `/api/ical-proxy?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl, {
          headers: {
            Accept: 'text/calendar, text/plain;q=0.8, */*;q=0.5',
          },
        });
        if (!response.ok) {
          const message = await response
            .json()
            .catch(() => ({ error: response.statusText }));
          throw new Error(message.error || `Unable to fetch calendar (status ${response.status}).`);
        }

        const text = await response.text();
        if (cancelled) return;

        const events = parseICS(text);
        setRawEvents(events);
        if (events.length === 0) {
          setError('No events found in the provided calendar.');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load iCal feed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'We could not load the calendar feed. Please verify the link is public.'
        );
        setRawEvents(FALLBACK_EVENTS());
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadFeed();

    return () => {
      cancelled = true;
    };
  }, [feedUrl]);

  const events = useMemo(() => {
    const now = new Date();
    const pastThreshold = new Date(now);
    pastThreshold.setDate(now.getDate() - safePastDays);

    return [...rawEvents]
      .filter((event) => {
        const eventEnd = event.end ?? event.start;
        return eventEnd >= pastThreshold;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, safeMaxEvents);
  }, [rawEvents, safePastDays, safeMaxEvents]);

  const renderEvent = (event: CalendarEvent) => {
    const content = (
      <div className="p-6 bg-white rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center text-primary-600 font-semibold text-sm uppercase tracking-wide mt-1">
            <span>{new Intl.DateTimeFormat(undefined, { month: 'short' }).format(event.start)}</span>
            <span className="text-3xl leading-none">{event.start.getDate()}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
              {event.title}
            </h3>
            <p className="text-sm text-primary-600 font-medium mt-1">
              {formatEventRange(event)}
            </p>
            {event.location && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <span role="img" aria-label="Location">📍</span>
                <span>{event.location}</span>
              </p>
            )}
            {event.description && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    if (event.url) {
      return (
        <a
          key={event.uid}
          href={event.url}
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 rounded-xl"
          target={event.url.startsWith('http') ? '_blank' : undefined}
          rel={event.url.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <div key={event.uid} className="block">
        {content}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50/40">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-3">
            Events Calendar
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            {description}
          </p>

          {feedUrl && (
            <p className="text-xs text-gray-400 mt-3 truncate" title={feedUrl}>
              Connected to: <span className="font-mono text-gray-500">{getFeedLabel(feedUrl)}</span>
            </p>
          )}
        </div>

        <div className="mt-12 space-y-6">
          {isLoading && (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-24 bg-white/70 border border-dashed border-gray-200 rounded-xl"
                />
              ))}
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="p-10 bg-white border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
              {emptyStateMessage}
            </div>
          )}

          {!isLoading && events.length > 0 && events.map((event) => renderEvent(event))}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-700 rounded-lg">
            {error}
          </div>
        )}

        {!feedUrl && (
          <div className="mt-6 text-sm text-gray-500 bg-gray-100 rounded-lg p-4">
            <p className="font-medium text-gray-600">Tip</p>
            <p className="mt-1">
              Provide a public ICS link (for example from Google Calendar) to replace the sample events above.
              Ensure the calendar is shared publicly and the URL ends in <code>.ics</code>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
