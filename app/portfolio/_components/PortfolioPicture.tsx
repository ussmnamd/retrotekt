import type { ResponsiveImage } from '../assets';
import { lqipMap } from '../lqip';

interface PortfolioPictureProps {
  image: ResponsiveImage;
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** Derive the lqipMap key from an avif path (strips -{w}.avif suffix). */
function lqipKey(avif: string): string {
  return avif.replace(/-\d+\.avif$/, '');
}

export default function PortfolioPicture({
  image,
  sizes,
  className,
  loading = 'lazy',
}: PortfolioPictureProps) {
  const lqip = image.base64Lqip ?? lqipMap[lqipKey(image.avif)];

  return (
    <picture>
      <source type="image/avif" srcSet={image.srcsetAvif} sizes={sizes} />
      <source type="image/webp" srcSet={image.srcsetWebp} sizes={sizes} />
      <img
        src={image.jpg}
        srcSet={image.srcsetJpg}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={loading}
        decoding="async"
        className={className}
        style={lqip ? { backgroundImage: `url("${lqip}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.backgroundImage = 'none';
        }}
      />
    </picture>
  );
}
