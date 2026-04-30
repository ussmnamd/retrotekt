import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

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
    url: "https://retrotekt.com/portfolio",
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
    canonical: "https://retrotekt.com/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
