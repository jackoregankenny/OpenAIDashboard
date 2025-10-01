import { GalleryBlockProps } from '@/lib/blocks/types';
import Image from 'next/image';
import { registerBlock } from '@/lib/blocks/registry';

export function GalleryBlock({ 
  title, 
  images, 
  columns = 3,
  spacing = 'normal'
}: GalleryBlockProps) {
  const spacingClasses = {
    compact: 'gap-2',
    normal: 'gap-4',
    spacious: 'gap-8',
  };

  return (
    <div className="px-6 py-12 md:px-12">
      {title && (
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      )}
      <div 
        className={`grid ${spacingClasses[spacing]}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'gallery',
  name: 'Image Gallery',
  description: 'Photo gallery with multiple layout options',
  component: GalleryBlock,
  defaultProps: {
    images: [],
    columns: 3,
    spacing: 'normal',
  },
  icon: 'images',
  category: 'media',
});

