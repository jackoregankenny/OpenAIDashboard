import { SportsFixturesBlockProps } from '@/lib/blocks/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trophy, Clock } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function SportsFixturesBlock({
  title,
  fixtures,
  showPastResults = false,
}: SportsFixturesBlockProps) {
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const isUpcoming = (dateStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const fixtureDate = new Date(dateStr);
    fixtureDate.setHours(0, 0, 0, 0);
    return fixtureDate >= now;
  };

  const upcomingFixtures = fixtures.filter(f => isUpcoming(f.date));
  const pastFixtures = fixtures.filter(f => !isUpcoming(f.date));
  const displayFixtures = showPastResults ? fixtures : upcomingFixtures;

  return (
    <div className="px-6 py-12 md:px-12 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">
            {showPastResults ? 'All fixtures and results' : 'Upcoming matches'}
          </p>
        </div>

        <div className="space-y-4">
          {displayFixtures.map((fixture, index) => {
            const dates = parseDate(fixture.date);
            const upcoming = isUpcoming(fixture.date);

            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <div className="text-xs font-semibold text-primary uppercase">
                        {dates.short.split(' ')[0]}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {dates.short.split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={upcoming ? 'default' : 'secondary'}>
                        {fixture.sport}
                      </Badge>
                      {fixture.team && (
                        <Badge variant="outline">{fixture.team}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-lg font-semibold mb-2">
                      <span>{fixture.homeTeam}</span>
                      <span className="text-muted-foreground text-sm">vs</span>
                      <span>{fixture.awayTeam}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{fixture.time}</span>
                      </div>
                      {fixture.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{fixture.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score/Result */}
                  {fixture.result && (
                    <div className="flex-shrink-0">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Final Score</div>
                        <div className="text-2xl font-bold">{fixture.result}</div>
                        {fixture.won && (
                          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <Trophy className="w-4 h-4" />
                            <span>Win</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {displayFixtures.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {showPastResults ? 'No fixtures scheduled' : 'No upcoming fixtures'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

registerBlock({
  type: 'sportsFixtures',
  name: 'Sports Fixtures',
  description: 'Display upcoming sports matches and results',
  component: SportsFixturesBlock,
  defaultProps: {
    title: 'Sports Fixtures',
    fixtures: [
      {
        sport: 'Rugby',
        team: 'Year 10',
        homeTeam: 'St. Mary\'s School',
        awayTeam: 'Riverside Academy',
        date: '2025-10-15',
        time: '3:30 PM',
        location: 'Home Ground',
      },
      {
        sport: 'Netball',
        team: 'Year 9',
        homeTeam: 'St. Mary\'s School',
        awayTeam: 'Oakwood High',
        date: '2025-10-18',
        time: '4:00 PM',
        location: 'Sports Hall',
      },
      {
        sport: 'Football',
        team: 'Year 11',
        homeTeam: 'Greenfield School',
        awayTeam: 'St. Mary\'s School',
        date: '2025-09-20',
        time: '3:00 PM',
        location: 'Greenfield Stadium',
        result: '2-1',
        won: true,
      },
    ],
    showPastResults: false,
  },
  icon: 'trophy',
  category: 'content',
});

