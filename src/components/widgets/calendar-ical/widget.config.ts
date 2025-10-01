import type { WidgetConfig } from '@/lib/registry/types';

export const widgetConfig: WidgetConfig = {
  id: 'calendar-ical',
  name: 'Calendar (iCal)',
  description: 'Show upcoming events from an iCal/ICS feed with formatted dates and details.',
  icon: 'CalendarDays',
  category: 'feature',
  tags: ['calendar', 'events', 'schedule'],
  version: '1.0.0',
};
