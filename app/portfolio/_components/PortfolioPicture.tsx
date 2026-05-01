import type { ResponsiveImage } from '../assets';

interface PortfolioPictureProps {
  image: ResponsiveImage;
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function PortfolioPicture({
  image,
  sizes,
  className,
  loading = 'lazy',
}: PortfolioPictureProps) {
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
      />
    </picture>
  );
}
