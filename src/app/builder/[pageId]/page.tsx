'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageBuilder } from '@/components/builder/page-builder';
import { Block } from '@/lib/blocks/types';

interface Page {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  blocks: string;
  isPublished: boolean;
}

interface Site {
  id: string;
  name: string;
  domain: string;
}

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [allPages, setAllPages] = useState<Page[]>([]);

  useEffect(() => {
    fetchPageAndSite();
  }, [params.pageId]);

  async function fetchPageAndSite() {
    try {
      // Fetch current page
      const pageResponse = await fetch(`/api/pages/${params.pageId}`);
      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        setPage(pageData);
        setBlocks(JSON.parse(pageData.blocks));

        // Fetch site info
        const siteResponse = await fetch(`/api/sites`);
        if (siteResponse.ok) {
          const sites = await siteResponse.json();
          const currentSite = sites.find((s: Site) => s.id === pageData.siteId);
          setSite(currentSite);

          // Fetch all pages for this site
          const pagesResponse = await fetch(`/api/sites/${pageData.siteId}/pages`);
          if (pagesResponse.ok) {
            const pagesData = await pagesResponse.json();
            setAllPages(pagesData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (updatedBlocks: Block[]) => {
    try {
      const response = await fetch(`/api/pages/${params.pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks: updatedBlocks,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handlePublish = async () => {
    if (!page) return;
    
    try {
      const response = await fetch(`/api/pages/${params.pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !page.isPublished,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPage(updated);
      }
    } catch (error) {
      console.error('Error publishing page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading builder...</p>
      </div>
    );
  }

  if (!page || !site) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <PageBuilder
      initialBlocks={blocks}
      onSave={handleSave}
      page={page}
      site={site}
      allPages={allPages}
      onPublish={handlePublish}
      onPageChange={(pageId) => router.push(`/builder/${pageId}`)}
      onBackToAdmin={() => router.push('/admin')}
    />
  );
}
