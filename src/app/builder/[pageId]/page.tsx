'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageBuilder } from '@/components/builder/page-builder';
import { Block } from '@/lib/blocks/types';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch(`/api/pages/${params.pageId}`);
        if (response.ok) {
          const page = await response.json();
          setBlocks(JSON.parse(page.blocks));
          setPageTitle(page.title);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [params.pageId]);

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
      // Silently save - no alerts for auto-save
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading builder...</p>
      </div>
    );
  }

  return <PageBuilder initialBlocks={blocks} onSave={handleSave} />;
}

