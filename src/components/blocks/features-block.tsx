import { FeaturesBlockProps } from '@/lib/blocks/types';
import { Card, CardContent } from '@/components/ui/card';
import { registerBlock } from '@/lib/blocks/registry';
import { 
  GraduationCap, BookOpen, Users, Trophy, Heart, Star,
  Sparkles, Zap, Shield, Target, Award, Lightbulb 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'users': Users,
  'trophy': Trophy,
  'heart': Heart,
  'star': Star,
  'sparkles': Sparkles,
  'zap': Zap,
  'shield': Shield,
  'target': Target,
  'award': Award,
  'lightbulb': Lightbulb,
};

export function FeaturesBlock({ 
  title, 
  subtitle, 
  features, 
  columns = 3,
  colorScheme = 'blue' 
}: FeaturesBlockProps) {
  const colorSchemes = {
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-600',
    purple: 'from-purple-500/10 to-purple-600/10 text-purple-600',
    green: 'from-green-500/10 to-green-600/10 text-green-600',
    orange: 'from-orange-500/10 to-orange-600/10 text-orange-600',
  };

  return (
    <div className="px-6 py-16 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div 
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${300 / columns * 2}px, 1fr))` }}
        >
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Star;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorSchemes[colorScheme]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
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
  type: 'features',
  name: 'Features Grid',
  description: 'Showcase features or services with icons',
  component: FeaturesBlock,
  defaultProps: {
    title: 'Why Choose Us',
    subtitle: 'Excellence in every aspect of education',
    features: [
      {
        icon: 'graduation-cap',
        title: 'Expert Faculty',
        description: 'Experienced and dedicated teachers committed to student success.',
      },
      {
        icon: 'book-open',
        title: 'Modern Curriculum',
        description: 'Up-to-date educational programs aligned with current standards.',
      },
      {
        icon: 'users',
        title: 'Small Class Sizes',
        description: 'Personalized attention with optimal student-teacher ratios.',
      },
      {
        icon: 'trophy',
        title: 'Award Winning',
        description: 'Recognized for academic excellence and student achievements.',
      },
      {
        icon: 'heart',
        title: 'Supportive Environment',
        description: 'A caring community that nurtures growth and well-being.',
      },
      {
        icon: 'sparkles',
        title: 'Innovative Programs',
        description: 'Cutting-edge learning opportunities and extracurriculars.',
      },
    ],
    columns: 3,
    colorScheme: 'blue',
  },
  icon: 'grid',
  category: 'content',
});

