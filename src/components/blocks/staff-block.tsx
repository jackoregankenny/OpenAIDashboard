import { StaffBlockProps } from '@/lib/blocks/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function StaffBlock({ 
  title, 
  members, 
  layout = 'grid' 
}: StaffBlockProps) {
  if (layout === 'list') {
    return (
      <div className="px-6 py-12 md:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {members.map((member, index) => (
            <Card key={index}>
              <CardContent className="flex gap-6 p-6">
                {member.image && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  {member.bio && <p className="text-sm mb-3">{member.bio}</p>}
                  <div className="flex gap-4 text-sm">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </a>
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

  // Grid layout
  return (
    <div className="px-6 py-12 md:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {members.map((member, index) => (
          <Card key={index} className="overflow-hidden">
            {member.image && (
              <div className="relative w-full h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              {member.bio && <p className="text-sm mb-3">{member.bio}</p>}
              <div className="space-y-1 text-sm">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </a>
                )}
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
  type: 'staff',
  name: 'Staff Directory',
  description: 'Display team members with bios and contact info',
  component: StaffBlock,
  defaultProps: {
    title: 'Our Team',
    members: [],
    layout: 'grid',
  },
  icon: 'users',
  category: 'people',
});

