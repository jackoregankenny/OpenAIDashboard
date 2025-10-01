import { db } from './index';
import { sites, themes, pages } from './schema';
import { nanoid } from 'nanoid';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create a demo site
  const siteId = nanoid();
  await db.insert(sites).values({
    id: siteId,
    name: 'Riverside High School',
    domain: 'riverside-hs',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200',
  });

  console.log('✓ Created demo site: Riverside High School');

  // Create theme
  const themeId = nanoid();
  await db.insert(themes).values({
    id: themeId,
    siteId,
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    borderRadius: '0.5rem',
    spacing: '1rem',
  });

  console.log('✓ Created theme');

  // Create home page with sample blocks
  const homePageId = nanoid();
  const homeBlocks = [
    {
      id: nanoid(),
      type: 'hero',
      props: {
        title: 'Welcome to Riverside High School',
        subtitle: 'Excellence in Education Since 1985',
        alignment: 'center',
        height: 'large',
        backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',
        cta: {
          text: 'Learn More',
          link: '#about',
        },
      },
    },
    {
      id: nanoid(),
      type: 'content',
      props: {
        title: 'About Our School',
        content: '<p>Riverside High School has been a cornerstone of our community for over 35 years. We are committed to providing a world-class education that prepares students for success in college, career, and life.</p><p>Our dedicated faculty and staff work tirelessly to create an engaging and supportive learning environment where every student can thrive.</p>',
        alignment: 'left',
      },
    },
    {
      id: nanoid(),
      type: 'news',
      props: {
        title: 'Latest News & Announcements',
        layout: 'cards',
        itemsPerRow: 3,
        items: [
          {
            title: 'Spring Concert Success',
            excerpt: 'Our music department put on an amazing spring concert featuring performances from all grade levels.',
            date: '2025-03-15',
            image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600',
          },
          {
            title: 'Science Fair Winners Announced',
            excerpt: 'Congratulations to all our science fair participants! See the winning projects from this year.',
            date: '2025-03-10',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
          },
          {
            title: 'New Athletic Facility Opens',
            excerpt: 'Our state-of-the-art athletic center is now open for student use. Come check it out!',
            date: '2025-03-05',
            image: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?w=600',
          },
        ],
      },
    },
    {
      id: nanoid(),
      type: 'contact',
      props: {
        title: 'Get In Touch',
        address: '123 Education Lane, Riverside, CA 92501',
        phone: '(555) 123-4567',
        email: 'info@riverside-hs.edu',
        showForm: true,
      },
    },
  ];

  await db.insert(pages).values({
    id: homePageId,
    siteId,
    slug: 'home',
    title: 'Home',
    blocks: JSON.stringify(homeBlocks),
    isPublished: true,
  });

  console.log('✓ Created home page with sample blocks');

  // Create about page
  const aboutPageId = nanoid();
  await db.insert(pages).values({
    id: aboutPageId,
    siteId,
    slug: 'about',
    title: 'About Us',
    blocks: '[]',
    isPublished: false,
  });

  console.log('✓ Created about page');

  // Create timetable page
  const timetablePageId = nanoid();
  const timetableBlocks = [
    {
      id: nanoid(),
      type: 'hero',
      props: {
        title: 'School Timetable',
        subtitle: 'View class schedules and periods',
        alignment: 'center',
        height: 'small',
        backgroundColor: '#3b82f6',
      },
    },
    {
      id: nanoid(),
      type: 'timetable',
      props: {
        title: 'Grade 10 - Class A Timetable',
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
          'Monday-Period 3': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
          'Monday-Period 4': { subject: 'History', teacher: 'Mr. Davis', room: '104', color: '#f3e8ff' },
          'Monday-Period 5': { subject: 'Physical Ed', teacher: 'Coach Wilson', room: 'Gym', color: '#ffedd5' },
          'Monday-Period 6': { subject: 'Art', teacher: 'Ms. Garcia', room: '205', color: '#fce7f3' },
          
          'Tuesday-Period 1': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
          'Tuesday-Period 2': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
          'Tuesday-Period 3': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
          'Tuesday-Period 4': { subject: 'Music', teacher: 'Mr. Lee', room: '301', color: '#fee2e2' },
          'Tuesday-Period 5': { subject: 'Geography', teacher: 'Ms. Taylor', room: '106', color: '#f3f4f6' },
          'Tuesday-Period 6': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
          
          'Wednesday-Period 1': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
          'Wednesday-Period 2': { subject: 'History', teacher: 'Mr. Davis', room: '104', color: '#f3e8ff' },
          'Wednesday-Period 3': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
          'Wednesday-Period 4': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
          'Wednesday-Period 5': { subject: 'Art', teacher: 'Ms. Garcia', room: '205', color: '#fce7f3' },
          'Wednesday-Period 6': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
          
          'Thursday-Period 1': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
          'Thursday-Period 2': { subject: 'Physical Ed', teacher: 'Coach Wilson', room: 'Gym', color: '#ffedd5' },
          'Thursday-Period 3': { subject: 'History', teacher: 'Mr. Davis', room: '104', color: '#f3e8ff' },
          'Thursday-Period 4': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
          'Thursday-Period 5': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
          'Thursday-Period 6': { subject: 'Computer Science', teacher: 'Mr. Patel', room: 'Lab 2', color: '#dbeafe' },
          
          'Friday-Period 1': { subject: 'Science', teacher: 'Dr. Brown', room: '303', color: '#fef3c7' },
          'Friday-Period 2': { subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: '#dbeafe' },
          'Friday-Period 3': { subject: 'Geography', teacher: 'Ms. Taylor', room: '106', color: '#f3f4f6' },
          'Friday-Period 4': { subject: 'English', teacher: 'Ms. Johnson', room: '202', color: '#dcfce7' },
          'Friday-Period 5': { subject: 'Music', teacher: 'Mr. Lee', room: '301', color: '#fee2e2' },
          'Friday-Period 6': { subject: 'Study Hall', teacher: '', room: 'Library', color: '#f3f4f6' },
        },
        showTeachers: true,
        showRooms: true,
        compactMode: false,
      },
    },
  ];

  await db.insert(pages).values({
    id: timetablePageId,
    siteId,
    slug: 'timetable',
    title: 'Timetable',
    blocks: JSON.stringify(timetableBlocks),
    isPublished: false,
  });

  console.log('✓ Created timetable page with full schedule');

  // Create staff page
  const staffPageId = nanoid();
  const staffBlocks = [
    {
      id: nanoid(),
      type: 'staff',
      props: {
        title: 'Our Faculty & Staff',
        layout: 'grid',
        members: [
          {
            name: 'Dr. Sarah Johnson',
            role: 'Principal',
            bio: 'Dr. Johnson has been leading Riverside High for 10 years, bringing innovative educational practices to our school.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            email: 's.johnson@riverside-hs.edu',
            phone: '(555) 123-4501',
          },
          {
            name: 'Michael Chen',
            role: 'Vice Principal',
            bio: 'Mr. Chen oversees curriculum development and student affairs with dedication and care.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            email: 'm.chen@riverside-hs.edu',
            phone: '(555) 123-4502',
          },
          {
            name: 'Emily Rodriguez',
            role: 'Head of Science Department',
            bio: 'Ms. Rodriguez brings 15 years of teaching experience and a passion for STEM education.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            email: 'e.rodriguez@riverside-hs.edu',
          },
        ],
      },
    },
  ];

  await db.insert(pages).values({
    id: staffPageId,
    siteId,
    slug: 'staff',
    title: 'Staff',
    blocks: JSON.stringify(staffBlocks),
    isPublished: false,
  });

  console.log('✓ Created staff page with sample data');

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Demo site created:');
  console.log(`   Name: Riverside High School`);
  console.log(`   Domain: riverside-hs`);
  console.log(`   Pages: Home, About, Staff, Timetable`);
  console.log(`   View at: http://localhost:3000/sites/riverside-hs/home`);
  console.log(`   Timetable: http://localhost:3000/sites/riverside-hs/timetable`);
  console.log(`   Admin at: http://localhost:3000/admin`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Done!');
    process.exit(0);
  });

