import type { Metadata } from "next";
import { Suspense } from "react";
import PortfolioClient from "./PortfolioClient";
import PortfolioFallback from "./PortfolioFallback";
import { projects } from "./data";

export const metadata: Metadata = {
  title: "Portfolio | 3D Architectural Renders & Walkthroughs — Retrotekt",
  description:
    "Browse Retrotekt's portfolio of photorealistic 3D architectural renders and walkthrough animations. Residential, commercial, hospitality, and development projects across the US.",
  keywords: [
    "architectural visualization portfolio",
    "3D rendering portfolio",
    "photorealistic architectural renders",
    "3D rendering for real estate developers",
    "3D renders for property marketing",
    "architectural walkthrough animation",
  ],
  openGraph: {
    title: "Our Work — Retrotekt Architectural Visualization Portfolio",
    description:
      "Photorealistic renders, animated walkthroughs, aerials, and full-project visual suites for US contractors and developers.",
    url: "https://www.retrotekt.com/portfolio",
    images: [
      {
        url: "/og/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Retrotekt Architectural Visualization Portfolio",
      },
    ],
  },
  alternates: {
    canonical: "https://www.retrotekt.com/portfolio",
  },
};

const portfolioListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Retrotekt Architectural Visualization Portfolio",
  description:
    "Portfolio of photorealistic 3D architectural renders, walkthrough animations, and construction documentation by Retrotekt.",
  url: "https://www.retrotekt.com/portfolio",
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: p.name,
      description: p.description,
      url: `https://www.retrotekt.com/portfolio/${p.slug}`,
    },
  })),
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioListSchema) }}
      />
      <Suspense fallback={<PortfolioFallback />}>
        <PortfolioClient />
      </Suspense>
    </>
  );
}
