"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, Project } from "./data";

const FILTERS = ["All", "Interior", "Exterior", "Aerial", "Full Project"] as const;

function ProjectCard({
  project,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 700px",
}: {
  project: Project;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`relative overflow-hidden rounded-xl group block ${className ?? ""}`}
    >
      {/* Cover image — lazy-loaded, format-optimized via Next.js Image */}
      <Image
        src={project.coverImage}
        alt={`${project.name} — 3D architectural visualization`}
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        sizes={sizes}
        loading="lazy"
      />

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Type badge — always visible */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-[#F7F0E3]/85 backdrop-blur-sm border border-[#D4C5A9] px-3 py-1 font-body text-[10px] tracking-[0.12em] uppercase text-primary/80">
          {project.type}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-6 z-10">
        <p className="font-body text-[11px] tracking-[0.15em] uppercase text-secondary mb-2">
          {project.tags.join(" · ")}
        </p>
        <h3 className="font-body font-bold text-[20px] text-[#F7F0E3] mb-1">
          {project.name}
        </h3>
        <p className="font-body text-[12px] text-[#F7F0E3]/60 mb-4">
          {project.location}
        </p>
        <span className="font-body text-[11px] tracking-[0.1em] uppercase text-secondary border-b border-secondary/50 pb-0.5">
          View Project →
        </span>
      </div>
    </Link>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const revealEls = el.querySelectorAll(".reveal");
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const containerRef = useReveal();

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.filterCategory === activeFilter);

  const featuredProject = projects.find((p) => p.layout === "featured");
  const tallProject = projects.find((p) => p.layout === "tall");
  const equalProjects = projects.filter((p) => p.layout === "equal");

  return (
    <div className="bg-background min-h-screen" ref={containerRef}>
      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20 border-b border-[#D4C5A9]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-label">Portfolio</span>
            <div className="h-px bg-[#D4C5A9] w-16 flex-shrink-0" />
          </div>
          <h1
            className="reveal font-heading text-primary leading-[0.92] tracking-[-0.025em] mb-10"
            style={{ fontSize: "clamp(4rem, 9vw, 7rem)" }}
          >
            Our Work.
          </h1>

          {/* Filter pills */}
          <div className="reveal flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 font-body text-[11px] tracking-[0.1em] uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-background border border-primary"
                      : "border border-primary/20 text-primary/50 hover:border-secondary/50 hover:text-secondary"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {activeFilter === "All" ? (
            <>
              {/* Row 1 — asymmetric 5-col grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 reveal">
                {featuredProject && (
                  <ProjectCard
                    project={featuredProject}
                    className="md:col-span-3 min-h-[340px] md:min-h-[480px]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 60vw, 840px"
                  />
                )}
                {tallProject && (
                  <ProjectCard
                    project={tallProject}
                    className="md:col-span-2 min-h-[340px] md:min-h-[520px]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 40vw, 560px"
                  />
                )}
              </div>

              {/* Row 2 — 3 equal columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 reveal">
                {equalProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    className="min-h-[260px] md:min-h-[320px]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 33vw, 467px"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
              {filteredProjects.length === 0 ? (
                <p className="col-span-full font-body text-primary/40 text-[14px] tracking-[0.08em] py-20 text-center">
                  No projects in this category yet.
                </p>
              ) : (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    className="min-h-[320px]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 33vw, 467px"
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
