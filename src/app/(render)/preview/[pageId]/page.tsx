import { PageRenderer } from '@/lib/renderer/PageRenderer';
import { createPageNode } from '@/lib/page-structure/types';

export default function PreviewPage() {
  // Create a demo page for preview
  const demoPage = createPageNode('page');

  const section = createPageNode('section');

  const heroNode = createPageNode('component', 'hero-basic', {
    title: 'Welcome to Our School',
    subtitle: 'Excellence in Education Since 1950',
    ctaText: 'Enroll Now',
    ctaLink: '/enroll',
  });

  const contentNode = createPageNode('component', 'content-section', {
    heading: 'About Our School',
    content:
      'We provide world-class education in a nurturing environment. Our dedicated faculty and state-of-the-art facilities ensure that every student reaches their full potential.',
    alignment: 'center',
  });

  const footerNode = createPageNode('component', 'footer-simple', {
    schoolName: 'Demo School',
    copyrightYear: 2024,
    links: [
      { label: 'About', href: '/about' },
      { label: 'Admissions', href: '/admissions' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  });

  section.children = [heroNode, contentNode];
  demoPage.children = [section, footerNode];

  return (
    <main>
      <PageRenderer pageTree={demoPage} />
    </main>
  );
}
