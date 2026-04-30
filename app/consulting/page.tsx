import type { Metadata } from "next";
import ConsultingClient from "./ConsultingClient";

export const metadata: Metadata = {
  title:
    "Architectural Visualization Consulting | Save vs. Local Studios — Retrotekt",
  description:
    "Retrotekt delivers US-market-quality 3D renders at a fraction of local studio rates — thanks to global operations. Serving real estate developers, contractors, interior designers, architects, and property marketers.",
  keywords: [
    "3D rendering for real estate developers",
    "3D rendering for interior designers",
    "architectural visualization for architects",
    "construction visualization before groundbreaking",
    "3D renders for property marketing",
    "hospitality hotel pre-opening renders",
    "affordable 3D rendering for small contractors",
    "fast architectural renders USA",
    "3D rendering services cheaper than local studio",
  ],
  openGraph: {
    title: "Why Smart Contractors Choose Retrotekt Over Local Studios",
    description:
      "Same quality. Faster delivery. Up to 60% less than US studio rates. See how Retrotekt's global model saves you money without cutting corners.",
    url: "https://retrotekt.com/consulting",
    images: [
      {
        url: "/og/consulting.png",
        width: 1200,
        height: 630,
        alt: "Retrotekt Architectural Visualization Consulting",
      },
    ],
  },
  alternates: {
    canonical: "https://retrotekt.com/consulting",
  },
};

export default function ConsultingPage() {
  return <ConsultingClient />;
}
