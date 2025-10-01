import { db } from '@/db';
import { sites, pages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { BlockRenderer } from '@/components/block-renderer';
import { Block } from '@/lib/blocks/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string;
  }>;
}

async function getPage(domain: string, slug: string) {
  const site = await db.select().from(sites).where(eq(sites.domain, domain)).get();
  
  if (!site) {
    return null;
  }

  const page = await db
    .select()
    .from(pages)
    .where(and(eq(pages.siteId, site.id), eq(pages.slug, slug)))
    .get();

  return page;
}

export default async function PublicSitePage({ params }: PageProps) {
  const { domain, slug } = await params;
  const page = await getPage(domain, slug);

  if (!page) {
    notFound();
  }

  const blocks: Block[] = JSON.parse(page.blocks);

  return (
    <div className="min-h-screen">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  // For hackathon purposes, return empty array
  // In production, you'd generate all site/page combinations
  return [];
}

