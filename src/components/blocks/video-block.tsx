import { VideoBlockProps } from '@/lib/blocks/types';
import { registerBlock } from '@/lib/blocks/registry';

export function VideoBlock({ 
  title, 
  videoUrl, 
  aspectRatio = '16:9', 
  autoplay = false,
  caption 
}: VideoBlockProps) {
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  // Extract video ID for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`;
    }
    // Direct video URL
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');

  return (
    <div className="px-6 py-16 md:px-12">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-8">{title}</h2>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className={aspectRatioClasses[aspectRatio]}>
            {isDirectVideo ? (
              <video
                src={embedUrl}
                controls
                autoPlay={autoplay}
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
        {caption && (
          <p className="text-center text-muted-foreground mt-4">{caption}</p>
        )}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'video',
  name: 'Video',
  description: 'Embed YouTube, Vimeo, or direct video',
  component: VideoBlock,
  defaultProps: {
    title: 'Watch Our Story',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '16:9',
    autoplay: false,
    caption: 'Learn more about our school community',
  },
  icon: 'video',
  category: 'media',
});

