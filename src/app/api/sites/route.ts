import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sites, themes, pages } from '@/db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSites = await db.select().from(sites);
    return NextResponse.json(allSites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, domain } = body;

    if (!name || !domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 });
    }

    // Create site
    const siteId = nanoid();
    await db.insert(sites).values({
      id: siteId,
      name,
      domain,
    });

    // Create default theme
    const themeId = nanoid();
    await db.insert(themes).values({
      id: themeId,
      siteId,
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      borderRadius: '0.5rem',
      spacing: '1rem',
    });

    // Create default home page
    const pageId = nanoid();
    await db.insert(pages).values({
      id: pageId,
      siteId,
      slug: 'home',
      title: 'Home',
      blocks: '[]',
      isPublished: false,
    });

    const site = await db.select().from(sites).where(eq(sites.id, siteId)).get();
    return NextResponse.json(site);
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 });
  }
}

