import { projects } from "../data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectClient from "./ProjectClient";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};

  const description = `See how Retrotekt delivered ${project.type.toLowerCase()} visualization for ${project.name}. Photorealistic renders and full architectural visualization for ${project.tags.join(", ")} projects across the US.`;

  return {
    title: `${project.name} | 3D Architectural Visualization — Retrotekt`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${project.name} — 3D Architectural Visualization`,
      description: project.description.slice(0, 155),
      url: `https://retrotekt.com/portfolio/${project.slug}`,
      images: [
        {
          url: project.coverImage,
          width: 1600,
          height: 900,
          alt: `${project.name} — 3D Architectural Render by Retrotekt`,
        },
      ],
    },
    alternates: {
      canonical: `https://retrotekt.com/portfolio/${project.slug}`,
    },
  };
}

const projectSchema = (project: (typeof projects)[number]) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: `${project.name} — 3D Architectural Visualization`,
  description: project.description,
  creator: {
    "@type": "Organization",
    name: "Retrotekt",
    url: "https://retrotekt.com",
  },
  image: project.coverImage,
  url: `https://retrotekt.com/portfolio/${project.slug}`,
  locationCreated: {
    "@type": "Place",
    name: project.location,
  },
  genre: project.type,
});

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema(project)),
        }}
      />
      <ProjectClient project={project} />
    </>
  );
}
