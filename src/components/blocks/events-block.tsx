import { EventsBlockProps } from '@/lib/blocks/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function EventsBlock({ 
  title, 
  events, 
  layout = 'list' 
}: EventsBlockProps) {
  if (layout === 'cards') {
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-3">{event.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // List layout
  return (
    <div className="px-6 py-12 md:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {events.map((event, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0 text-center">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3">
                    <div className="text-2xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs uppercase">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm mt-3">{event.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'events',
  name: 'Events Calendar',
  description: 'Display upcoming events and calendar',
  component: EventsBlock,
  defaultProps: {
    title: 'Upcoming Events',
    events: [],
    layout: 'list',
  },
  icon: 'calendar',
  category: 'interactive',
});

