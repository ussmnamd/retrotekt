import { projects } from '../data';
import { portfolioAssets } from '../assets';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectClientModesto from './ProjectClientModesto';
import ProjectClientStandard from './ProjectClientStandard';

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

  const description = `See how Retrotekt delivered ${project.type.toLowerCase()} visualization for ${project.name}. Photorealistic renders and full architectural visualization for ${project.tags.join(', ')} projects across the US.`;
  const coverImage = portfolioAssets[project.assetKey].renders[0]?.jpg ?? '/og/portfolio.png';

  return {
    title: `${project.name} | 3D Architectural Visualization — Retrotekt`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${project.name} — 3D Architectural Visualization`,
      description: project.description.slice(0, 155),
      url: `https://retrotekt.com/portfolio/${project.slug}`,
      images: [
        {
          url: coverImage,
          width: 1600,
          height: 900,
          alt: `${project.name} — 3D Architectural Render by Retrotekt`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} — 3D Architectural Visualization`,
      description: project.description.slice(0, 155),
      images: [coverImage],
    },
    alternates: {
      canonical: `https://retrotekt.com/portfolio/${project.slug}`,
    },
  };
}

const projectSchema = (project: (typeof projects)[number]) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: `${project.name} — 3D Architectural Visualization`,
  description: project.description,
  creator: {
    '@type': 'Organization',
    name: 'Retrotekt',
    url: 'https://retrotekt.com',
  },
  image: portfolioAssets[project.assetKey].renders[0]?.jpg ?? '/og/portfolio.png',
  url: `https://retrotekt.com/portfolio/${project.slug}`,
  locationCreated: {
    '@type': 'Place',
    name: project.city,
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
      {project.isFlagship ? (
        <ProjectClientModesto project={project} />
      ) : (
        <ProjectClientStandard project={project} />
      )}
    </>
  );
}
