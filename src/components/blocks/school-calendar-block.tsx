import { SchoolCalendarBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function SchoolCalendarBlock({
  title,
  academicYear,
  terms,
  showWeeks = true,
  layout = 'cards',
}: SchoolCalendarBlockProps) {
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const calculateWeeks = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  const isCurrentTerm = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//School Calendar//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${title} ${academicYear}
X-WR-TIMEZONE:UTC
`;

    terms.forEach((term) => {
      const start = new Date(term.startDate);
      const end = new Date(term.endDate);
      
      // Format dates as YYYYMMDD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      icsContent += `BEGIN:VEVENT
UID:${term.name.replace(/\s+/g, '-')}-${academicYear}@school
DTSTART;VALUE=DATE:${formatDate(start)}
DTEND;VALUE=DATE:${formatDate(end)}
SUMMARY:${term.name} - ${academicYear}
DESCRIPTION:${term.name} of the academic year ${academicYear}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    // Create download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `school-calendar-${academicYear}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (layout === 'timeline') {
    return (
      <div className="px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
          <p className="text-center text-muted-foreground mb-8">{academicYear}</p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {terms.map((term, index) => {
                const isCurrent = isCurrentTerm(term.startDate, term.endDate);
                const weeks = showWeeks ? calculateWeeks(term.startDate, term.endDate) : 0;

                return (
                  <div key={index} className="relative pl-16">
                    {/* Timeline dot */}
                    <div 
                      className={`absolute left-6 top-2 w-5 h-5 rounded-full border-4 ${
                        isCurrent 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-muted-foreground'
                      }`}
                    />

                    <Card className={`p-4 ${isCurrent ? 'border-primary shadow-lg' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                            {term.name}
                            {isCurrent && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{parseDate(term.startDate)} - {parseDate(term.endDate)}</span>
                          </div>
                          {showWeeks && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{weeks} weeks</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards layout (default)
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">{academicYear}</p>
          <Button variant="outline" size="sm" onClick={exportToICS}>
            <Download className="w-4 h-4 mr-2" />
            Export to Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {terms.map((term, index) => {
            const isCurrent = isCurrentTerm(term.startDate, term.endDate);
            const weeks = showWeeks ? calculateWeeks(term.startDate, term.endDate) : 0;

            return (
              <Card 
                key={index} 
                className={`p-6 ${isCurrent ? 'border-primary shadow-lg' : ''}`}
              >
                <div className="mb-3">
                  <h3 className="text-xl font-bold mb-1">{term.name}</h3>
                  {isCurrent && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Current Term
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Start</div>
                      <div className="text-muted-foreground">{parseDate(term.startDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">End</div>
                      <div className="text-muted-foreground">{parseDate(term.endDate)}</div>
                    </div>
                  </div>

                  {showWeeks && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{weeks} weeks</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'schoolCalendar',
  name: 'School Calendar',
  description: 'Display academic year terms and dates',
  component: SchoolCalendarBlock,
  defaultProps: {
    title: 'Academic Calendar',
    academicYear: '2024-2025',
    terms: [
      {
        name: 'Term 1',
        startDate: '2024-09-01',
        endDate: '2024-12-20',
      },
      {
        name: 'Term 2',
        startDate: '2025-01-06',
        endDate: '2025-03-28',
      },
      {
        name: 'Term 3',
        startDate: '2025-04-14',
        endDate: '2025-06-27',
      },
      {
        name: 'Term 4',
        startDate: '2025-07-14',
        endDate: '2025-09-19',
      },
    ],
    showWeeks: true,
    layout: 'cards',
  },
  icon: 'calendar',
  category: 'content',
});

