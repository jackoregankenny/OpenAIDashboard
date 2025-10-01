import { TimetableBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { registerBlock } from '@/lib/blocks/registry';

export function TimetableBlock({
  title,
  layout = 'weekly',
  days,
  periods,
  schedule,
  showTeachers = true,
  showRooms = true,
  compactMode = false,
}: TimetableBlockProps) {
  // Generate schedule key from day and period
  const getScheduleKey = (day: string, periodLabel: string) => {
    return `${day}-${periodLabel}`;
  };

  // Get cell content
  const getCellContent = (day: string, periodLabel: string) => {
    const key = getScheduleKey(day, periodLabel);
    return schedule[key];
  };

  if (layout === 'daily') {
    // Daily view - one day at a time
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {days.map((day) => (
            <Card key={day} className="overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-semibold">
                {day}
              </div>
              <div className="divide-y">
                {periods.map((period) => {
                  const content = getCellContent(day, period.label);
                  return (
                    <div key={period.label} className="p-4 flex gap-4">
                      <div className="flex-shrink-0 w-24">
                        <div className="text-xs text-muted-foreground">{period.time}</div>
                        <div className="font-medium">{period.label}</div>
                      </div>
                      <div className="flex-1">
                        {content ? (
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: content.color || '#f3f4f6' }}
                          >
                            <div className="font-semibold">{content.subject}</div>
                            {showTeachers && content.teacher && (
                              <div className="text-sm text-muted-foreground">{content.teacher}</div>
                            )}
                            {showRooms && content.room && (
                              <div className="text-xs text-muted-foreground">Room {content.room}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic">Free period</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'period') {
    // Period view - grouped by period
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-6xl mx-auto space-y-6">
          {periods.map((period) => (
            <div key={period.label}>
              <h3 className="text-xl font-semibold mb-3">
                {period.label} <span className="text-muted-foreground text-sm">({period.time})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {days.map((day) => {
                  const content = getCellContent(day, period.label);
                  return (
                    <Card key={day} className="p-3" style={{ backgroundColor: content?.color || 'white' }}>
                      <div className="text-sm font-semibold text-muted-foreground mb-1">{day}</div>
                      {content ? (
                        <>
                          <div className="font-semibold">{content.subject}</div>
                          {showTeachers && content.teacher && (
                            <div className="text-xs text-muted-foreground">{content.teacher}</div>
                          )}
                          {showRooms && content.room && (
                            <div className="text-xs text-muted-foreground">Rm {content.room}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">Free</div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Weekly view (default) - traditional grid
  return (
    <div className="px-6 py-12 md:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid gap-2" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
            {/* Header row */}
            <div className="bg-muted p-3 rounded-lg font-semibold text-center">Time</div>
            {days.map((day) => (
              <div key={day} className="bg-primary text-primary-foreground p-3 rounded-lg font-semibold text-center">
                {day}
              </div>
            ))}

            {/* Period rows */}
            {periods.map((period) => (
              <>
                <div
                  key={`time-${period.label}`}
                  className="bg-muted p-3 rounded-lg flex flex-col justify-center"
                >
                  <div className={`font-medium ${compactMode ? 'text-xs' : 'text-sm'}`}>{period.label}</div>
                  <div className="text-xs text-muted-foreground">{period.time}</div>
                </div>
                {days.map((day) => {
                  const content = getCellContent(day, period.label);
                  return (
                    <Card
                      key={`${day}-${period.label}`}
                      className={`${compactMode ? 'p-2' : 'p-3'} transition-all hover:shadow-md`}
                      style={{ backgroundColor: content?.color || 'white' }}
                    >
                      {content ? (
                        <>
                          <div className={`font-semibold ${compactMode ? 'text-sm' : ''}`}>
                            {content.subject}
                          </div>
                          {showTeachers && content.teacher && (
                            <div className={`text-muted-foreground ${compactMode ? 'text-xs' : 'text-sm'}`}>
                              {content.teacher}
                            </div>
                          )}
                          {showRooms && content.room && (
                            <div className="text-xs text-muted-foreground">Room {content.room}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">-</div>
                      )}
                    </Card>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'timetable',
  name: 'Timetable',
  description: 'Class schedules and timetables with multiple layouts',
  component: TimetableBlock,
  defaultProps: {
    title: 'Class Timetable',
    layout: 'weekly',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    periods: [
      { time: '8:00 AM', label: 'Period 1' },
      { time: '9:00 AM', label: 'Period 2' },
      { time: '10:00 AM', label: 'Period 3' },
      { time: '11:00 AM', label: 'Period 4' },
      { time: '12:00 PM', label: 'Lunch' },
      { time: '1:00 PM', label: 'Period 5' },
      { time: '2:00 PM', label: 'Period 6' },
    ],
    schedule: {
      'Monday-Period 1': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
      'Monday-Period 2': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
      'Tuesday-Period 1': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
    },
    showTeachers: true,
    showRooms: true,
    compactMode: false,
  },
  icon: 'calendar',
  category: 'interactive',
});

