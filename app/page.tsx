import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title:
    "Retrotekt | 3D Architectural Rendering Services for Contractors & Developers",
  description:
    "Photorealistic 3D renders, walkthroughs, floor plans, and aerial views — built for US contractors, remodelers, and real estate developers. Fast delivery. Studio quality. Starting from $200/render.",
  keywords: [
    "3D rendering services for contractors",
    "architectural visualization studio USA",
    "photorealistic renders for construction",
    "3D rendering for remodelers",
    "architectural rendering services",
    "3D interior rendering services",
    "exterior rendering services",
    "construction visualization services",
  ],
  openGraph: {
    title: "Retrotekt — Win More Bids With Photorealistic 3D Renders",
    description:
      "Turn your plans into visuals that close deals. Still renders, walkthroughs, floor plans, and aerials for US contractors and developers.",
    url: "https://retrotekt.com",
    siteName: "Retrotekt",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/homepage.png",
        width: 1200,
        height: 630,
        alt: "Retrotekt — 3D Architectural Rendering Services for Contractors & Developers",
      },
    ],
  },
  alternates: {
    canonical: "https://retrotekt.com",
  },
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Retrotekt",
  url: "https://retrotekt.com",
  description:
    "Photorealistic 3D renders, walkthroughs, floor plans, and aerial views for US contractors, remodelers, and real estate developers.",
  priceRange: "$200–$1,500",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "3D Architectural Rendering Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Still Renders",
          description:
            "Photorealistic interior and exterior architectural renders, permit-compatible, HD resolution.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 200,
          priceCurrency: "USD",
          unitText: "per render",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Walkthrough Animations",
          description:
            "Cinematic 3D walkthrough animations for construction and real estate projects.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 800,
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Floor Plan Renders",
          description:
            "Clean architectural floor plan renders for permit applications and proposals.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 150,
          priceCurrency: "USD",
          unitText: "per floor",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Aerial & Bird's-Eye Views",
          description:
            "Drone-perspective site overviews and aerial renders for development projects.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 200,
          priceCurrency: "USD",
          unitText: "per view",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "360° Panorama Views",
          description:
            "Immersive 360-degree room renders shareable via link on any device.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 300,
          priceCurrency: "USD",
          unitText: "per room",
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      <HomeClient />
    </>
  );
}
