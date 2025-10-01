/**
 * Auto-registration module for all block components
 * 
 * Simply importing this file will register all blocks.
 * Each block component registers itself when imported.
 * 
 * To add a new block:
 * 1. Create your-block.tsx in this folder
 * 2. Add the registerBlock() call at the bottom of your component file
 * 3. Import it below
 */

// Import all blocks - they auto-register on import
import './hero-block';
import './hero-split-block';
import './hero-image-block';
import './hero-minimal-block';
import './gallery-block';
import './staff-block';
import './content-block';
import './columns-block';
import './pricing-block';
import './logos-block';
import './events-block';
import './contact-block';
import './news-block';
import './timetable-block';
import './faq-block';
import './testimonials-block';
import './features-block';
import './cta-block';
import './stats-block';
import './video-block';
import './school-calendar-block';
import './holidays-block';
import './booklist-block';
import './uniform-block';
import './sports-fixtures-block';
import './downloads-block';

// Export all blocks for direct usage if needed
export { HeroBlock } from './hero-block';
export { HeroSplitBlock } from './hero-split-block';
export { HeroImageBlock } from './hero-image-block';
export { HeroMinimalBlock } from './hero-minimal-block';
export { GalleryBlock } from './gallery-block';
export { StaffBlock } from './staff-block';
export { ContentBlock } from './content-block';
export { ColumnsBlock } from './columns-block';
export { PricingBlock } from './pricing-block';
export { LogosBlock } from './logos-block';
export { EventsBlock } from './events-block';
export { ContactBlock } from './contact-block';
export { NewsBlock } from './news-block';
export { TimetableBlock } from './timetable-block';
export { FAQBlock } from './faq-block';
export { TestimonialsBlock } from './testimonials-block';
export { FeaturesBlock } from './features-block';
export { CTABlock } from './cta-block';
export { StatsBlock } from './stats-block';
export { VideoBlock } from './video-block';
export { SchoolCalendarBlock } from './school-calendar-block';
export { HolidaysBlock } from './holidays-block';
export { BooklistBlock } from './booklist-block';
export { UniformBlock } from './uniform-block';
export { SportsFixturesBlock } from './sports-fixtures-block';
export { DownloadsBlock } from './downloads-block';

