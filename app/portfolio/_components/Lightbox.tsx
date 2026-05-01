'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResponsiveImage } from '../assets';

interface LightboxProps {
  images: ResponsiveImage[];
  startIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const img = images[current];

  return (
    <div
      className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-background/60 hover:text-background font-body text-[28px] leading-none transition-colors z-10"
        aria-label="Close lightbox"
      >
        ×
      </button>

      <div className="absolute top-6 left-6 font-body text-[11px] tracking-[0.12em] uppercase text-background/40">
        {current + 1} / {images.length}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8 text-background/50 hover:text-secondary font-body text-[32px] transition-colors z-10 select-none"
        aria-label="Previous image"
      >
        ‹
      </button>

      <div
        className="relative max-w-5xl w-full mx-16 md:mx-24"
        onClick={(e) => e.stopPropagation()}
      >
        <picture>
          <source type="image/avif" srcSet={img.srcsetAvif} sizes="(max-width: 1280px) 100vw, 1280px" />
          <source type="image/webp" srcSet={img.srcsetWebp} sizes="(max-width: 1280px) 100vw, 1280px" />
          <img
            src={img.jpg}
            srcSet={img.srcsetJpg}
            sizes="(max-width: 1280px) 100vw, 1280px"
            alt={img.alt}
            className="w-full h-auto max-h-[85vh] object-contain"
            width={img.width}
            height={img.height}
          />
        </picture>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8 text-background/50 hover:text-secondary font-body text-[32px] transition-colors z-10 select-none"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}
