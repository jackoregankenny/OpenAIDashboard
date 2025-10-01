import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const page = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId))
      .get();
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const body = await request.json();
    const { blocks: blocksData, title, slug, isPublished } = body;

    const updateData: any = {};
    if (blocksData !== undefined) updateData.blocks = JSON.stringify(blocksData);
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    updateData.updatedAt = new Date();

    await db
      .update(pages)
      .set(updateData)
      .where(eq(pages.id, pageId));

    const page = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId))
      .get();

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    await db.delete(pages).where(eq(pages.id, pageId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

