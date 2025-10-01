import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sites } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .get();
    
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const body = await request.json();

    await db
      .update(sites)
      .set({
        name: body.name,
        domain: body.domain,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sites.id, siteId));

    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .get();

    return NextResponse.json(site);
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json({ error: 'Failed to update site' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    
    await db
      .delete(sites)
      .where(eq(sites.id, siteId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 });
  }
}

