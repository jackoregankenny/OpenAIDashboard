import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const sitePages = await db
      .select()
      .from(pages)
      .where(eq(pages.siteId, siteId));
    
    return NextResponse.json(sitePages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const body = await request.json();
    const { slug, title, blocks: blocksData } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const pageId = nanoid();
    await db.insert(pages).values({
      id: pageId,
      siteId,
      slug,
      title,
      blocks: JSON.stringify(blocksData || []),
      isPublished: false,
    });

    const page = await db.select().from(pages).where(eq(pages.id, pageId)).get();
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

