import { HolidaysBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plane, Sun, Download, Upload } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

// Helper function to parse ICS files (can be used in builder)
export function parseICSFile(icsContent: string): Array<{name: string; date: string; type: string; description?: string}> {
  const holidays: Array<{name: string; date: string; type: string; description?: string}> = [];
  const events = icsContent.split('BEGIN:VEVENT');
  
  events.forEach((event) => {
    if (!event.includes('END:VEVENT')) return;
    
    const summaryMatch = event.match(/SUMMARY:(.*?)[\r\n]/);
    const dateMatch = event.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);
    const descMatch = event.match(/DESCRIPTION:(.*?)[\r\n]/);
    
    if (summaryMatch && dateMatch) {
      const dateStr = dateMatch[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const formattedDate = `${year}-${month}-${day}`;
      
      // Try to determine type from summary
      const summary = summaryMatch[1].toLowerCase();
      let type = 'holiday';
      if (summary.includes('break') || summary.includes('vacation')) type = 'break';
      if (summary.includes('trip') || summary.includes('excursion')) type = 'trip';
      
      holidays.push({
        name: summaryMatch[1],
        date: formattedDate,
        type,
        description: descMatch ? descMatch[1] : undefined,
      });
    }
  });
  
  return holidays;
}

export function HolidaysBlock({
  title,
  subtitle,
  holidays,
  showCountdown = true,
  layout = 'cards',
}: HolidaysBlockProps) {
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isUpcoming = (dateStr: string) => {
    return getDaysUntil(dateStr) >= 0;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'break':
        return <Sun className="w-4 h-4" />;
      case 'holiday':
        return <Calendar className="w-4 h-4" />;
      case 'trip':
        return <Plane className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'break':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'holiday':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'trip':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter and sort holidays
  const upcomingHolidays = holidays
    .filter(holiday => isUpcoming(holiday.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//School Holidays//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${title}
X-WR-TIMEZONE:UTC
`;

    upcomingHolidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      icsContent += `BEGIN:VEVENT
UID:${holiday.name.replace(/\s+/g, '-')}-${formatDate(date)}@school
DTSTART;VALUE=DATE:${formatDate(date)}
DTEND;VALUE=DATE:${formatDate(date)}
SUMMARY:${holiday.name}
DESCRIPTION:${holiday.description || holiday.name}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'school-holidays.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (layout === 'timeline') {
    return (
      <div className="px-6 py-12 md:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="space-y-6">
            {upcomingHolidays.map((holiday, index) => {
              const daysUntil = getDaysUntil(holiday.date);
              const dates = parseDate(holiday.date);

              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${getTypeColor(holiday.type)}`}>
                        <div className="text-2xl font-bold">{dates.short.split(' ')[1]}</div>
                        <div className="text-xs uppercase">{dates.short.split(' ')[0]}</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{holiday.name}</h3>
                        <Badge variant="outline" className={getTypeColor(holiday.type)}>
                          {getTypeIcon(holiday.type)}
                          <span className="ml-1 capitalize">{holiday.type}</span>
                        </Badge>
                      </div>

                      {holiday.description && (
                        <p className="text-sm text-muted-foreground mb-2">{holiday.description}</p>
                      )}

                      {showCountdown && daysUntil >= 0 && (
                        <div className="text-sm font-medium text-primary">
                          {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {upcomingHolidays.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No upcoming holidays scheduled</p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Cards layout (default)
  return (
    <div className="px-6 py-12 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}
            {upcomingHolidays.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportToICS}>
                <Download className="w-4 h-4 mr-2" />
                Export to Calendar
              </Button>
            )}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingHolidays.map((holiday, index) => {
            const daysUntil = getDaysUntil(holiday.date);
            const dates = parseDate(holiday.date);

            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:scale-105">
                <div className="mb-4">
                  <Badge variant="outline" className={getTypeColor(holiday.type)}>
                    {getTypeIcon(holiday.type)}
                    <span className="ml-1 capitalize">{holiday.type}</span>
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-2">{holiday.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{dates.full}</span>
                </div>

                {holiday.description && (
                  <p className="text-sm text-muted-foreground mb-3">{holiday.description}</p>
                )}

                {showCountdown && daysUntil >= 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{daysUntil}</div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Day to go' : 'Days to go'}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {upcomingHolidays.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No upcoming holidays scheduled</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'holidays',
  name: 'School Holidays',
  description: 'Display school holidays and breaks with countdown',
  component: HolidaysBlock,
  defaultProps: {
    title: 'School Holidays',
    subtitle: 'Upcoming breaks and important dates',
    holidays: [
      {
        name: 'Spring Break',
        date: '2025-03-29',
        type: 'break',
        description: 'Two-week spring holiday',
      },
      {
        name: 'Easter Holiday',
        date: '2025-04-18',
        type: 'holiday',
        description: 'School closed for Easter',
      },
      {
        name: 'Summer Holiday',
        date: '2025-06-28',
        type: 'break',
        description: 'Six-week summer break',
      },
      {
        name: 'Field Trip Day',
        date: '2025-05-15',
        type: 'trip',
        description: 'Annual school excursion',
      },
    ],
    showCountdown: true,
    layout: 'cards',
  },
  icon: '🌴',
  category: 'school',
});

