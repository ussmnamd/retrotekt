"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "../data";

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#F7F0E3]/60 hover:text-[#F7F0E3] font-body text-[28px] leading-none transition-colors z-10"
        aria-label="Close lightbox"
      >
        ×
      </button>

      <div className="absolute top-6 left-6 font-body text-[11px] tracking-[0.12em] uppercase text-[#F7F0E3]/40">
        {current + 1} / {images.length}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8 text-[#F7F0E3]/50 hover:text-secondary font-body text-[32px] transition-colors z-10 select-none"
        aria-label="Previous image"
      >
        ‹
      </button>

      <div
        className="relative max-w-5xl w-full mx-16 md:mx-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={`Gallery image ${current + 1}`}
          className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8 text-[#F7F0E3]/50 hover:text-secondary font-body text-[32px] transition-colors z-10 select-none"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}

export default function ProjectClient({ project }: { project: Project }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = project.images;
  const galleryImages = allImages.slice(1);

  return (
    <div className="bg-background min-h-screen">
      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-end"
        style={{ minHeight: "70vh" }}
      >
        <Image
          src={project.coverImage}
          alt={project.name}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 pt-40">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-[#F7F0E3]/85 backdrop-blur-sm border border-[#D4C5A9] px-3 py-1 font-body text-[10px] tracking-[0.12em] uppercase text-primary/80">
                {project.type}
              </span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-secondary/50 px-3 py-1 font-body text-[10px] tracking-[0.12em] uppercase text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="font-heading text-[#F7F0E3] leading-[0.92] tracking-[-0.025em] mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {project.name}
            </h1>

            <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#F7F0E3]/50">
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION + DETAILS ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div className="lg:col-span-2">
              <p className="font-body text-[18px] leading-[1.75] text-deep">
                {project.description}
              </p>
            </div>

            <div className="lg:col-span-1">
              <dl className="space-y-6">
                <div>
                  <dt className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary mb-1">
                    Project Type
                  </dt>
                  <dd className="font-body text-[14px] text-primary/75">
                    {project.type}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary mb-1">
                    Location
                  </dt>
                  <dd className="font-body text-[14px] text-primary/75">
                    {project.location}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary mb-1">
                    Category
                  </dt>
                  <dd className="font-body text-[14px] text-primary/75">
                    {project.filterCategory}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary mb-1">
                    Services
                  </dt>
                  <dd className="font-body text-[14px] text-primary/75">
                    {project.tags.join(", ")}
                  </dd>
                </div>
              </dl>

              <div className="mt-10 pt-10 border-t border-[#D4C5A9]">
                <p className="font-body text-[12px] text-primary/40 mb-4 tracking-[0.05em]">
                  Interested in a similar project?
                </p>
                <Link
                  href="/contact"
                  className="btn-dark inline-block font-body text-[11px] tracking-[0.12em] uppercase bg-primary text-background px-5 py-3"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div
            className="w-full aspect-video overflow-hidden rounded-xl cursor-pointer group relative"
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={allImages[0]}
              alt={`${project.name} — render 1`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1400px) 100vw, 1400px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-[#F7F0E3] border border-[#F7F0E3]/40 px-4 py-2">
                View Full
              </span>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryImages.map((src, i) => (
                <div
                  key={src}
                  className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  <Image
                    src={src}
                    alt={`${project.name} — render ${i + 2}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 700px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-[#F7F0E3] border border-[#F7F0E3]/40 px-4 py-2">
                      View Full
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-primary border-t border-primary py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary/70 mb-3">
              Start a Project
            </p>
            <h2
              className="font-heading text-background leading-[0.95]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Ready to start your project?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact"
              className="btn-gold font-body text-[11px] tracking-[0.12em] uppercase bg-secondary text-primary px-7 py-4"
            >
              Book a Call
            </Link>
            <Link
              href="/contact"
              className="font-body text-[11px] tracking-[0.12em] uppercase border border-background/25 text-background/65 px-7 py-4 hover:border-background/50 hover:text-background transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
