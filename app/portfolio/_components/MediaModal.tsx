'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ResponsiveImage, ProjectVideo } from '../assets';

// ── Public types ───────────────────────────────────────────────────────────────

export type ModalItem =
  | { kind: 'image'; data: ResponsiveImage; label?: string }
  | { kind: 'video'; data: ProjectVideo;    label?: string };

// ── Internal: video player ─────────────────────────────────────────────────────

function ModalVideoPlayer({ video }: { video: ProjectVideo }) {
  const ref     = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);

  const [playing,     setPlaying]     = useState(false);
  const [muted,       setMuted]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);

  // Auto-play on mount. key prop on <ModalVideoPlayer> ensures a fresh element
  // (and a fresh effect) every time the selected video changes.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, []);

  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else          { v.pause(); setPlaying(false); }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v   = ref.current;
    const bar = scrubRef.current;
    if (!v || !bar || !isFinite(v.duration)) return;
    const rect = bar.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * v.duration;
  }, []);

  const fmt = (s: number) =>
    isFinite(s) && s >= 0
      ? `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
      : '0:00';

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative bg-black w-full"
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      <video
        ref={ref}
        className="w-full h-full object-contain cursor-pointer"
        muted={muted}
        playsInline
        preload="auto"
        poster={video.poster}
        onClick={toggle}
        onTimeUpdate={() => setCurrentTime(ref.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(ref.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4}  type="video/mp4"  />
      </video>

      {/* Controls bar */}
      <div
        className="absolute bottom-0 inset-x-0 px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.78))' }}
      >
        {/* Play / pause */}
        <button
          onClick={toggle}
          className="shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        {/* Scrubber */}
        <div
          ref={scrubRef}
          className="flex-1 h-[3px] bg-white/20 cursor-pointer relative rounded-full"
          onClick={seek}
          role="slider"
          aria-label="Video progress"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-y-0 left-0 bg-secondary rounded-full pointer-events-none"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Time */}
        <span className="shrink-0 font-body text-[10px] tabular-nums text-white/50">
          {fmt(currentTime)} / {fmt(duration)}
        </span>

        {/* Mute */}
        <button
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
          className="shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────────

interface MediaModalProps {
  items:      ModalItem[];
  startIndex: number;
  onClose:    () => void;
}

export default function MediaModal({ items, startIndex, onClose }: MediaModalProps) {
  const [current, setCurrent] = useState(startIndex);
  const multi = items.length > 1;

  const prev = useCallback(
    () => setCurrent(i => (i - 1 + items.length) % items.length),
    [items.length],
  );
  const next = useCallback(
    () => setCurrent(i => (i + 1) % items.length),
    [items.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')                    onClose();
      if (e.key === 'ArrowLeft'  && multi) prev();
      if (e.key === 'ArrowRight' && multi) next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, prev, next, multi]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const item = items[current];

  return (
    <div
      className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* ── Close ── */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center
                   text-background/60 hover:text-background border border-background/10
                   hover:border-background/30 transition-colors"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* ── Counter ── */}
      {multi && (
        <p className="absolute top-6 left-6 font-body text-[10px] tracking-[0.14em] uppercase text-background/40">
          {current + 1} / {items.length}
        </p>
      )}

      {/* ── Prev ── */}
      {multi && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 z-10 select-none text-background/50
                     hover:text-secondary transition-colors font-body text-[36px] leading-none"
          aria-label="Previous"
        >‹</button>
      )}

      {/* ── Media ── */}
      <div
        className="relative max-w-5xl w-full mx-14 md:mx-20"
        onClick={e => e.stopPropagation()}
      >
        {item.kind === 'video' ? (
          /* key forces a fresh <video> element (and fresh autoplay) on every switch */
          <ModalVideoPlayer key={item.data.mp4} video={item.data} />
        ) : (
          <picture>
            <source type="image/avif" srcSet={item.data.srcsetAvif} sizes="(max-width: 1280px) 100vw, 1280px" />
            <source type="image/webp" srcSet={item.data.srcsetWebp} sizes="(max-width: 1280px) 100vw, 1280px" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.data.jpg}
              srcSet={item.data.srcsetJpg}
              sizes="(max-width: 1280px) 100vw, 1280px"
              alt={item.data.alt}
              className="w-full h-auto max-h-[85vh] object-contain"
              width={item.data.width}
              height={item.data.height}
            />
          </picture>
        )}

        {item.label && (
          <p className="mt-3 font-body text-[9px] tracking-[0.15em] uppercase text-background/40 text-center">
            {item.label}
          </p>
        )}
      </div>

      {/* ── Next ── */}
      {multi && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 z-10 select-none text-background/50
                     hover:text-secondary transition-colors font-body text-[36px] leading-none"
          aria-label="Next"
        >›</button>
      )}
    </div>
  );
}
