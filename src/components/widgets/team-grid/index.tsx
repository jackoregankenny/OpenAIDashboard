import type { RenderComponentProps } from '@/lib/registry/types';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
}

interface TeamGridProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
  columns?: 2 | 3 | 4;
}

/**
 * Team Grid Component
 *
 * Display team members or faculty in a professional grid layout
 */
export default function TeamGrid({ props }: RenderComponentProps<TeamGridProps>) {
  const {
    heading = 'Meet Our Team',
    subheading,
    members = [
      {
        name: 'Dr. Emily Roberts',
        role: 'Principal',
        bio: 'Leading our school with 20+ years of educational excellence',
        image: '',
      },
      {
        name: 'James Mitchell',
        role: 'Head of Mathematics',
        bio: 'Passionate about making math accessible and engaging',
        image: '',
      },
      {
        name: 'Sarah Williams',
        role: 'Science Department Lead',
        bio: 'Inspiring the next generation of scientists',
        image: '',
      },
    ],
    columns = 3,
  } = props;

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {subheading && (
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-3">
              {subheading}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            {heading}
          </h2>
        </div>

        {/* Team Grid */}
        <div className={`grid gap-8 ${columnClasses[columns]}`}>
          {members.map((member, index) => (
            <div
              key={index}
              className="group"
            >
              {/* Photo */}
              <div className="relative mb-6 overflow-hidden rounded-xl aspect-square">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-6xl text-primary-600 font-light">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {member.bio}
                  </p>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 mt-3 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Contact
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
