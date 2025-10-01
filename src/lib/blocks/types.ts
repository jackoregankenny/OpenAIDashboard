import { z } from 'zod';

// Base block schema
export const baseBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.any()),
});

export type Block = z.infer<typeof baseBlockSchema>;

// Hero block props
export const heroBlockPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundImage: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  cta: z.object({
    text: z.string(),
    link: z.string(),
  }).optional(),
  height: z.enum(['small', 'medium', 'large', 'full']).default('large'),
});

export type HeroBlockProps = z.infer<typeof heroBlockPropsSchema>;

// Gallery block props
export const galleryBlockPropsSchema = z.object({
  title: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })),
  columns: z.number().min(1).max(6).default(3),
  spacing: z.enum(['compact', 'normal', 'spacious']).default('normal'),
});

export type GalleryBlockProps = z.infer<typeof galleryBlockPropsSchema>;

// Staff directory block props
export const staffBlockPropsSchema = z.object({
  title: z.string().default('Our Team'),
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    image: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })),
  layout: z.enum(['grid', 'list']).default('grid'),
});

export type StaffBlockProps = z.infer<typeof staffBlockPropsSchema>;

// Text/Content block props
export const contentBlockPropsSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  alignment: z.enum(['left', 'center', 'right']).default('left'),
  backgroundColor: z.string().optional(),
});

export type ContentBlockProps = z.infer<typeof contentBlockPropsSchema>;

// Calendar/Events block props
export const eventsBlockPropsSchema = z.object({
  title: z.string().default('Upcoming Events'),
  events: z.array(z.object({
    title: z.string(),
    date: z.string(),
    time: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  })),
  layout: z.enum(['list', 'calendar', 'cards']).default('list'),
});

export type EventsBlockProps = z.infer<typeof eventsBlockPropsSchema>;

// Contact block props
export const contactBlockPropsSchema = z.object({
  title: z.string().default('Contact Us'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mapUrl: z.string().optional(),
  showForm: z.boolean().default(true),
});

export type ContactBlockProps = z.infer<typeof contactBlockPropsSchema>;

// News/Announcements block props
export const newsBlockPropsSchema = z.object({
  title: z.string().default('Latest News'),
  items: z.array(z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    image: z.string().optional(),
    link: z.string().optional(),
  })),
  layout: z.enum(['cards', 'list', 'featured']).default('cards'),
  itemsPerRow: z.number().min(1).max(4).default(3),
});

export type NewsBlockProps = z.infer<typeof newsBlockPropsSchema>;

// Timetable block props
export const timetableBlockPropsSchema = z.object({
  title: z.string().default('Class Timetable'),
  layout: z.enum(['weekly', 'daily', 'period']).default('weekly'),
  days: z.array(z.string()).default(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  periods: z.array(z.object({
    time: z.string(),
    label: z.string(),
  })).default([
    { time: '8:00 AM', label: 'Period 1' },
    { time: '9:00 AM', label: 'Period 2' },
    { time: '10:00 AM', label: 'Period 3' },
    { time: '11:00 AM', label: 'Period 4' },
    { time: '12:00 PM', label: 'Lunch' },
    { time: '1:00 PM', label: 'Period 5' },
    { time: '2:00 PM', label: 'Period 6' },
  ]),
  // Year groups (Year 7, Year 8, etc.)
  years: z.array(z.string()).default(['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12']),
  // Classes within each year (A, B, C, etc.)
  classesPerYear: z.array(z.string()).default(['Class A', 'Class B', 'Class C']),
  // Nested schedules: { "Year 7-Class A": { schedule }, "Year 7-Class B": { schedule } }
  schedules: z.record(z.string(), z.record(z.string(), z.object({
    subject: z.string(),
    teacher: z.string().optional(),
    room: z.string().optional(),
    color: z.string().optional(),
  }))).default({}),
  selectedYear: z.string().default('Year 7'),
  selectedClass: z.string().default('Class A'),
  showSelectors: z.boolean().default(true),
  showTeachers: z.boolean().default(true),
  showRooms: z.boolean().default(true),
  compactMode: z.boolean().default(false),
});

export type TimetableBlockProps = z.infer<typeof timetableBlockPropsSchema>;

// FAQ block props
export const faqBlockPropsSchema = z.object({
  title: z.string().default('Frequently Asked Questions'),
  subtitle: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
  columns: z.number().min(1).max(2).default(1),
});

export type FAQBlockProps = z.infer<typeof faqBlockPropsSchema>;

// Testimonials block props
export const testimonialsBlockPropsSchema = z.object({
  title: z.string().default('What People Say'),
  testimonials: z.array(z.object({
    name: z.string(),
    role: z.string(),
    content: z.string(),
    image: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  })).default([]),
  layout: z.enum(['grid', 'carousel', 'featured']).default('grid'),
});

export type TestimonialsBlockProps = z.infer<typeof testimonialsBlockPropsSchema>;

// Features block props
export const featuresBlockPropsSchema = z.object({
  title: z.string().default('Our Features'),
  subtitle: z.string().optional(),
  features: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })).default([]),
  columns: z.number().min(2).max(4).default(3),
  colorScheme: z.enum(['blue', 'purple', 'green', 'orange']).default('blue'),
});

export type FeaturesBlockProps = z.infer<typeof featuresBlockPropsSchema>;

// CTA block props
export const ctaBlockPropsSchema = z.object({
  title: z.string().default('Ready to Get Started?'),
  subtitle: z.string().optional(),
  primaryButton: z.object({
    text: z.string(),
    link: z.string(),
  }),
  secondaryButton: z.object({
    text: z.string(),
    link: z.string(),
  }).optional(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().default('#3b82f6'),
  layout: z.enum(['centered', 'split']).default('centered'),
});

export type CTABlockProps = z.infer<typeof ctaBlockPropsSchema>;

// Stats block props
export const statsBlockPropsSchema = z.object({
  title: z.string().optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
  })).default([]),
  columns: z.number().min(2).max(4).default(4),
  backgroundColor: z.string().optional(),
});

export type StatsBlockProps = z.infer<typeof statsBlockPropsSchema>;

// Video block props
export const videoBlockPropsSchema = z.object({
  title: z.string().optional(),
  videoUrl: z.string(), // YouTube, Vimeo, or direct video URL
  aspectRatio: z.enum(['16:9', '4:3', '1:1']).default('16:9'),
  autoplay: z.boolean().default(false),
  caption: z.string().optional(),
});

export type VideoBlockProps = z.infer<typeof videoBlockPropsSchema>;

// School Calendar block props
export const schoolCalendarBlockPropsSchema = z.object({
  title: z.string().default('Academic Calendar'),
  academicYear: z.string().default('2024-2025'),
  terms: z.array(z.object({
    name: z.string(),
    startDate: z.string(), // ISO date format
    endDate: z.string(), // ISO date format
  })).default([]),
  showWeeks: z.boolean().default(true),
  layout: z.enum(['cards', 'timeline']).default('cards'),
});

export type SchoolCalendarBlockProps = z.infer<typeof schoolCalendarBlockPropsSchema>;

// Holidays block props
export const holidaysBlockPropsSchema = z.object({
  title: z.string().default('School Holidays'),
  subtitle: z.string().optional(),
  holidays: z.array(z.object({
    name: z.string(),
    date: z.string(), // ISO date format
    type: z.enum(['holiday', 'break', 'trip']).default('holiday'),
    description: z.string().optional(),
  })).default([]),
  showCountdown: z.boolean().default(true),
  layout: z.enum(['cards', 'timeline']).default('cards'),
});

export type HolidaysBlockProps = z.infer<typeof holidaysBlockPropsSchema>;

// Booklist block props
export const booklistBlockPropsSchema = z.object({
  title: z.string().default('School Booklist'),
  year: z.string().default('2025'),
  books: z.array(z.object({
    title: z.string(),
    author: z.string(),
    edition: z.string().optional(),
    isbn: z.string().optional(),
    price: z.number().optional(),
    supplier: z.string().optional(),
    required: z.boolean().default(true),
    notes: z.string().optional(),
  })).default([]),
  showPrices: z.boolean().default(true),
  showISBN: z.boolean().default(true),
  includeOptional: z.boolean().default(true),
});

export type BooklistBlockProps = z.infer<typeof booklistBlockPropsSchema>;

// Uniform block props
export const uniformBlockPropsSchema = z.object({
  title: z.string().default('School Uniform'),
  subtitle: z.string().optional(),
  categories: z.array(z.object({
    name: z.string(),
    season: z.string().optional(),
    items: z.array(z.string()),
    imageUrl: z.string().optional(),
    notes: z.string().optional(),
  })).default([]),
  showImages: z.boolean().default(false),
});

export type UniformBlockProps = z.infer<typeof uniformBlockPropsSchema>;

// Sports fixtures block props
export const sportsFixturesBlockPropsSchema = z.object({
  title: z.string().default('Sports Fixtures'),
  fixtures: z.array(z.object({
    sport: z.string(),
    team: z.string().optional(),
    homeTeam: z.string(),
    awayTeam: z.string(),
    date: z.string(), // ISO date
    time: z.string(),
    location: z.string().optional(),
    result: z.string().optional(),
    won: z.boolean().optional(),
  })).default([]),
  showPastResults: z.boolean().default(false),
});

export type SportsFixturesBlockProps = z.infer<typeof sportsFixturesBlockPropsSchema>;

// Downloads block props
export const downloadsBlockPropsSchema = z.object({
  title: z.string().default('Downloads & Resources'),
  subtitle: z.string().optional(),
  categories: z.array(z.object({
    name: z.string(),
    files: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      type: z.enum(['pdf', 'image', 'doc', 'other']).default('pdf'),
      url: z.string(),
      sizeKB: z.number().optional(),
    })),
  })).default([]),
  layout: z.enum(['grid', 'list']).default('grid'),
});

export type DownloadsBlockProps = z.infer<typeof downloadsBlockPropsSchema>;

// Block type definitions
export type BlockType = 
  | 'hero'
  | 'gallery'
  | 'staff'
  | 'content'
  | 'events'
  | 'contact'
  | 'news'
  | 'timetable'
  | 'faq'
  | 'testimonials'
  | 'features'
  | 'cta'
  | 'stats'
  | 'video'
  | 'schoolCalendar'
  | 'holidays'
  | 'booklist'
  | 'uniform'
  | 'sportsFixtures'
  | 'downloads';

// Block with typed props
export interface TypedBlock<T extends Record<string, any> = Record<string, any>> extends Block {
  type: BlockType;
  props: T;
}

