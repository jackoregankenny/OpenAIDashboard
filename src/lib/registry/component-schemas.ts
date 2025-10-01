/**
 * Component Property Schemas
 *
 * Defines the editable properties for each component
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'color'
  | 'select'
  | 'number'
  | 'toggle'
  | 'array'
  | 'link';

export interface ArrayFieldSchema {
  fields: PropertyField[]; // Fields for each array item
}

export interface PropertyField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // For select fields
  min?: number; // For number fields
  max?: number;
  placeholder?: string;
  description?: string;
  arraySchema?: ArrayFieldSchema; // For array fields
}

export interface ComponentSchema {
  componentId: string;
  fields: PropertyField[];
}

// Component-specific schemas
export const componentSchemas: Record<string, PropertyField[]> = {
  'hero-basic': [
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Excellence in Education' },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Welcome to Our School' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Empowering students...' },
    { key: 'primaryCtaText', label: 'Primary Button Text', type: 'text', placeholder: 'Explore Programs' },
    { key: 'primaryCtaLink', label: 'Primary Button Link', type: 'link', placeholder: '/programs' },
    { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', placeholder: 'Learn More' },
    { key: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'link', placeholder: '/about' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['gradient', 'minimal', 'image'] },
    { key: 'backgroundImage', label: 'Background Image URL', type: 'url', placeholder: 'https://...' },
  ],

  'content-section': [
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'About Us' },
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Story' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'We are dedicated to...' },
    { key: 'alignment', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'featured', 'minimal'] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Learn More' },
    { key: 'buttonLink', label: 'Button Link', type: 'link', placeholder: '/about' },
  ],

  'features-grid': [
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'What We Offer' },
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Features' },
    { key: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'bordered', 'elevated'] },
    {
      key: 'features',
      label: 'Features',
      type: 'array',
      arraySchema: {
        fields: [
          { key: 'icon', label: 'Icon (Emoji)', type: 'text', placeholder: '🎓' },
          { key: 'title', label: 'Feature Title', type: 'text', placeholder: 'Quality Education' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'World-class curriculum...' },
        ],
      },
    },
  ],

  'stats-showcase': [
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'By The Numbers' },
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Achievements' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'cards', 'minimal'] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    {
      key: 'stats',
      label: 'Statistics',
      type: 'array',
      arraySchema: {
        fields: [
          { key: 'icon', label: 'Icon (Emoji)', type: 'text', placeholder: '🎓' },
          { key: 'value', label: 'Value', type: 'text', placeholder: '500' },
          { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'Students Enrolled' },
        ],
      },
    },
  ],

  'testimonials-slider': [
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Testimonials' },
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'What Our Community Says' },
    { key: 'layout', label: 'Layout', type: 'select', options: ['grid', 'single'] },
    {
      key: 'testimonials',
      label: 'Testimonials',
      type: 'array',
      arraySchema: {
        fields: [
          { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Enter testimonial quote' },
          { key: 'author', label: 'Author Name', type: 'text', placeholder: 'John Doe' },
          { key: 'role', label: 'Role/Title', type: 'text', placeholder: 'Parent' },
          { key: 'avatar', label: 'Avatar URL', type: 'url', placeholder: 'https://...' },
          { key: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
        ],
      },
    },
  ],

  'cta-banner': [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Ready to Get Started?' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Join our community...' },
    { key: 'primaryButtonText', label: 'Primary Button Text', type: 'text', placeholder: 'Enroll Now' },
    { key: 'primaryButtonLink', label: 'Primary Button Link', type: 'link', placeholder: '/enroll' },
    { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text', placeholder: 'Contact Us' },
    { key: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'link', placeholder: '/contact' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['gradient', 'solid', 'minimal'] },
    { key: 'alignment', label: 'Alignment', type: 'select', options: ['left', 'center'] },
  ],

  'team-grid': [
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Our People' },
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Meet Our Team' },
    { key: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
    {
      key: 'members',
      label: 'Team Members',
      type: 'array',
      arraySchema: {
        fields: [
          { key: 'name', label: 'Name', type: 'text', placeholder: 'Dr. Emily Roberts' },
          { key: 'role', label: 'Role/Title', type: 'text', placeholder: 'Principal' },
          { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Leading our school...' },
          { key: 'image', label: 'Photo URL', type: 'url', placeholder: 'https://...' },
          { key: 'email', label: 'Email', type: 'text', placeholder: 'email@school.com' },
        ],
      },
    },
  ],

  'footer-simple': [
    { key: 'schoolName', label: 'School Name', type: 'text', placeholder: 'Our School' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Excellence in Education' },
    { key: 'copyrightYear', label: 'Copyright Year', type: 'number', min: 2000, max: 2100 },
    { key: 'variant', label: 'Variant', type: 'select', options: ['dark', 'light', 'branded'] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
};

/**
 * Get property schema for a component
 */
export function getComponentSchema(componentId: string): PropertyField[] {
  return componentSchemas[componentId] || [];
}

/**
 * Check if a component has a defined schema
 */
export function hasComponentSchema(componentId: string): boolean {
  return componentId in componentSchemas;
}
