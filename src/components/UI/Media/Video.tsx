import { cn } from '@/utils/cn';

interface VideoProps {
  src: string;
  type?: 'youtube' | 'vimeo' | 'html5';
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9';
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  title?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const aspectRatioClasses = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
};

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoId(url: string): string | null {
  const regExp = /(?:vimeo\.com\/|video\/)(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function detectVideoType(src: string): 'youtube' | 'vimeo' | 'html5' {
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    return 'youtube';
  }
  if (src.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'html5';
}

function buildYouTubeUrl(
  videoId: string,
  autoplay: boolean,
  muted: boolean,
  loop: boolean,
  controls: boolean
): string {
  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (!controls) params.set('controls', '0');
  params.set('rel', '0');
  params.set('modestbranding', '1');

  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}

function buildVimeoUrl(
  videoId: string,
  autoplay: boolean,
  muted: boolean,
  loop: boolean,
  controls: boolean
): string {
  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('muted', '1');
  if (loop) params.set('loop', '1');
  if (!controls) params.set('controls', '0');
  params.set('dnt', '1');

  const queryString = params.toString();
  return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ''}`;
}

export function Video({
  src,
  type,
  aspectRatio = '16/9',
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
  poster,
  title = 'Video player',
  rounded = 'none',
  className,
}: VideoProps) {
  const videoType = type || detectVideoType(src);

  const containerClasses = cn(
    'relative w-full overflow-hidden bg-black',
    aspectRatioClasses[aspectRatio],
    roundedClasses[rounded],
    className
  );

  if (videoType === 'youtube') {
    const videoId = getYouTubeId(src);
    if (!videoId) {
      return (
        <div className={cn(containerClasses, 'flex items-center justify-center text-white')}>
          Invalid YouTube URL
        </div>
      );
    }

    const embedUrl = buildYouTubeUrl(videoId, autoplay, muted, loop, controls);

    return (
      <div className={containerClasses}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={cn('absolute inset-0 w-full h-full', roundedClasses[rounded])}
        />
      </div>
    );
  }

  if (videoType === 'vimeo') {
    const videoId = getVimeoId(src);
    if (!videoId) {
      return (
        <div className={cn(containerClasses, 'flex items-center justify-center text-white')}>
          Invalid Vimeo URL
        </div>
      );
    }

    const embedUrl = buildVimeoUrl(videoId, autoplay, muted, loop, controls);

    return (
      <div className={containerClasses}>
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className={cn('absolute inset-0 w-full h-full', roundedClasses[rounded])}
        />
      </div>
    );
  }

  // HTML5 video
  return (
    <div className={containerClasses}>
      <video
        src={src}
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        className={cn('absolute inset-0 w-full h-full object-cover', roundedClasses[rounded])}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
